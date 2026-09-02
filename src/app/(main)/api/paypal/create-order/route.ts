import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAYPAL_API = process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const BASE_PRICES: Record<string, number> = {
    plus: 9.99,
    pro: 24.99,
    ultimate: 49.99,
};

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

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        const { planId, promoCode } = await request.json();
        let finalPrice = BASE_PRICES[planId];

        if (!finalPrice) {
            return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
        }

        // 1. Vérifier le code promo en base de données
        if (promoCode) {
            const now = new Date().toISOString();

            const { data: promo, error: promoError } = await supabase
                .from("promo_codes")
                .select("*")
                .eq("code", promoCode.toUpperCase())
                .eq("is_active", true)
                .lte("start_at", now)
                // ✅ CORRECTION ICI AUSSI
                .or(`end_at.is.null,end_at.gte.${now}`)
                .single();

            if (!promoError && promo) {
                // Vérifier le nombre total d'utilisations
                if (promo.max_uses && promo.uses_count >= promo.max_uses) {
                    return NextResponse.json({ error: "Code promo épuisé" }, { status: 400 });
                }

                // Vérifier le montant minimum d'achat
                if (promo.min_purchase_amount && finalPrice < promo.min_purchase_amount) {
                    return NextResponse.json({
                        error: `Montant minimum requis : ${promo.min_purchase_amount}€`
                    }, { status: 400 });
                }

                // Calculer le prix réduit
                const discountValue = Number(promo.discount_value) || 0;

                if (promo.discount_type === 'percent') {
                    finalPrice = finalPrice * (1 - discountValue / 100);
                } else if (promo.discount_type === 'fixed') {
                    finalPrice = finalPrice - discountValue;
                }

                // Empêcher les prix négatifs ou à 0
                finalPrice = Math.max(finalPrice, 0.99);

                // ✅ J'ai supprimé la ligne "appliedPromo = promo;" qui causait l'erreur
            }
        }

        const accessToken = await getPayPalAccessToken();

        // 2. Créer la commande PayPal avec le PRIX CALCULÉ
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    description: `Abonnement N.O.A.H. ${planId.toUpperCase()}${promoCode ? ` (Code: ${promoCode})` : ''}`,
                    amount: {
                        currency_code: "EUR",
                        value: finalPrice.toFixed(2),
                    },
                }],
            }),
        });

        const order = await response.json();
        if (!response.ok) throw new Error(order.message || "Erreur PayPal");

        // On renvoie le prix final et le code au frontend (utile pour l'affichage)
        return NextResponse.json({
            orderId: order.id,
            finalPrice: finalPrice.toFixed(2),
            appliedPromo: promoCode || null
        });

    } catch (error: any) {
        console.error("Erreur create-order:", error);
        return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
    }
}