import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-08-26.dahlia",
});

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { priceId, userId, email, planId, billingPeriod } = await request.json();

        if (!priceId || !userId || !email) {
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        const price = await stripe.prices.retrieve(priceId);
        const metadata = price.metadata || {};

        // Récupérer ou créer le client Stripe
        const customers = await stripe.customers.list({ email });
        let customerId = customers.data[0]?.id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email,
                metadata: { userId },
            });
            customerId = customer.id;
        }

        // Créer la session Checkout
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
            metadata: {
                userId,
                planId: metadata.plan_id || planId || "unknown",
                planType: metadata.plan_type || "individual",
                billing: metadata.billing || billingPeriod || "monthly",
            },
            subscription_data: {
                metadata: {
                    userId,
                    planId: metadata.plan_id || planId,
                    planType: metadata.plan_type,
                    billing: metadata.billing || billingPeriod,
                },
            },
        });

        // ✅ MISE À JOUR DIRECTE DU PROFIL (en attendant le webhook)
        const planSlug = metadata.plan_id || planId || "plus";

        await supabaseAdmin
            .from("profiles")
            .update({
                plan: planSlug,
                stripe_customer_id: customerId,
                stripe_subscription_id: session.subscription as string,
                subscription_status: "active",
                subscription_plan_id: planSlug,
                subscription_billing: metadata.billing || billingPeriod || "monthly",
            })
            .eq("id", userId);

        // ✅ INSERTION DANS LA TABLE TRANSACTIONS
        const product = await supabaseAdmin
            .from("products")
            .select("id")
            .eq("slug", planSlug)
            .single();

        await supabaseAdmin.from("transactions").insert([
            {
                user_id: userId,
                product_id: product?.data?.id || null,
                amount: (price.unit_amount || 0) / 100,
                currency: "EUR",
                payment_method: "card",
                payment_id: session.id,
                status: "completed",
            },
        ]);

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Erreur Stripe Checkout:", error);
        return NextResponse.json(
            { error: error.message || "Erreur serveur" },
            { status: 500 }
        );
    }
}