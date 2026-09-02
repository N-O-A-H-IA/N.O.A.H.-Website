import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAYPAL_API = process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken() {
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(
                `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: "grant_type=client_credentials",
    });
    const data = await response.json();
    return data.access_token;
}

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

        const { orderId, planId, promoCode } = await request.json();
        const accessToken = await getPayPalAccessToken();

        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const captureData = await response.json();
        if (!response.ok || captureData.status !== "COMPLETED") {
            throw new Error("Le paiement n'a pas abouti");
        }

        // 1. Mettre à jour le plan de l'utilisateur
        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                plan: planId,
                applied_promo_code: promoCode || null // Optionnel : pour garder une trace
            })
            .eq("id", user.id);

        if (updateError) throw new Error("Erreur mise à jour profil");

        // 2. Incrémenter l'utilisation du code promo si un code a été utilisé
        if (promoCode) {
            await supabase.rpc('increment_promo_usage', {
                p_code: promoCode,
                p_user_id: user.id
            });
        }

        return NextResponse.json({ success: true, plan: planId });
    } catch (error: any) {
        console.error("Erreur capture-order:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}