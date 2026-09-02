import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-08-26.dahlia", // ✅ Version mise à jour
});

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Erreur webhook:", err.message);
        return NextResponse.json(
            { error: "Webhook Error" },
            { status: 400 }
        );
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const metadata = session.metadata;

            if (metadata?.userId) {
                await supabaseAdmin
                    .from("profiles")
                    .update({
                        plan: metadata.planId || "free",
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: session.subscription as string,
                        subscription_status: "active",
                        subscription_plan_id: metadata.planId,
                        subscription_billing: metadata.billing,
                    })
                    .eq("id", metadata.userId);

                await supabaseAdmin.from("transactions").insert([
                    {
                        user_id: metadata.userId,
                        amount: session.amount_total ? session.amount_total / 100 : 0,
                        currency: session.currency?.toUpperCase() || "EUR",
                        payment_method: "card",
                        payment_id: session.id,
                        status: "completed",
                    },
                ]);
            }
            break;
        }

        case "invoice.paid": {
            const invoice = event.data.object as Stripe.Invoice;

            // ✅ Correction: subscription peut être null ou string
            const subscriptionId = (invoice as any).subscription as string | null;

            if (subscriptionId) {
                await supabaseAdmin
                    .from("profiles")
                    .update({ subscription_status: "active" })
                    .eq("stripe_subscription_id", subscriptionId);
            }

            break;
        }

        case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = (invoice as any).subscription as string | null;

            if (subscriptionId) {
                await supabaseAdmin
                    .from("profiles")
                    .update({ subscription_status: "past_due" })
                    .eq("stripe_subscription_id", subscriptionId);
            }

            break;
        }

        case "customer.subscription.deleted":
        case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;

            if (event.type === "customer.subscription.deleted") {
                await supabaseAdmin
                    .from("profiles")
                    .update({
                        plan: "free",
                        subscription_status: "cancelled",
                        stripe_subscription_id: null,
                    })
                    .eq("stripe_subscription_id", subscription.id);
            } else {
                const status = subscription.status === "active" ? "active" : "past_due";
                await supabaseAdmin
                    .from("profiles")
                    .update({ subscription_status: status })
                    .eq("stripe_subscription_id", subscription.id);
            }
            break;
        }
    }

    return NextResponse.json({ received: true });
}