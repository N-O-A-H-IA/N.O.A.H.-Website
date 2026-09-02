"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";
import {
    X, CreditCard, Wallet, CheckCircle2, Loader2,
    Gift, AlertCircle, Shield, Lock, Sparkles
} from "lucide-react";

// Initialisation Stripe (côté client)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ️ Map de tous les Price IDs Stripe
const STRIPE_PRICE_IDS: Record<string, Record<string, string>> = {
    plus: {
        monthly: "price_1UBDmMGWiZXx3aJlChyS5Zsw",
        yearly: "price_1UBDoBGWiZXx3aJldxZIiBlh",
    },
    pro: {
        monthly: "price_1UBDpnGWiZXx3aJlAwU8Q4aC",
        yearly: "price_1UBDqNGWiZXx3aJlBIP70Fvn",
    },
    ultimate: {
        monthly: "price_1UBDrMGWiZXx3aJlIEXWn1LQ",
        yearly: "price_1UBDrhGWiZXx3aJljcVzy8Ua",
    },
    student: {
        monthly: "price_1UBDsQGWiZXx3aJl6Dt2C56v",
        yearly: "price_1UBDsnGWiZXx3aJl9T0EZESm",
    },
    student_pro: {
        monthly: "price_1UBDtkGWiZXx3aJlDWco9c5E",
        yearly: "price_1UBDu3GWiZXx3aJlw7rUosnu",
    },
};

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    planId: string;
    planName: string;
    basePrice: number;
    originalPrice: number;
    billingPeriod?: "monthly" | "yearly";
    onSuccess: () => void;
}

export function PaymentModal({
                                 isOpen,
                                 onClose,
                                 planId,
                                 planName,
                                 basePrice,
                                 originalPrice,
                                 billingPeriod = "monthly",
                                 onSuccess,
                             }: PaymentModalProps) {
    const supabase = createClient();
    const [{ isPending }] = usePayPalScriptReducer();

    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | null>(null);
    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [promoError, setPromoError] = useState("");
    const [isCheckingPromo, setIsCheckingPromo] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const calculateFinalPrice = () => {
        if (!appliedPromo) return basePrice;

        let finalPrice = basePrice;
        const discountValue = Number(appliedPromo.discount_value) || 0;

        if (appliedPromo.discount_type === 'percent') {
            finalPrice = basePrice * (1 - discountValue / 100);
        } else {
            finalPrice = basePrice - discountValue;
        }

        return Math.max(finalPrice, 0.99);
    };

    const finalPrice = calculateFinalPrice();
    const savings = basePrice - finalPrice;

    const checkPromoCode = async () => {
        if (!promoCode) return;

        if (basePrice < originalPrice) {
            setPromoError("Une réduction est déjà appliquée. Les codes promo ne sont pas cumulables.");
            return;
        }

        setIsCheckingPromo(true);
        setPromoError("");

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const now = new Date().toISOString();

            const { data: promo, error } = await supabase
                .from("promo_codes")
                .select("*")
                .eq("code", promoCode.toUpperCase())
                .eq("is_active", true)
                .lte("start_at", now)
                .single();

            console.log("Code promo trouvé:", promo);
            console.log("Erreur:", error);

            if (error || !promo) {
                setPromoError("Code invalide ou expiré");
                setAppliedPromo(null);
                setIsCheckingPromo(false);
                return;
            }

            if (promo.end_at) {
                const endDate = new Date(promo.end_at).getTime();
                const nowTime = new Date().getTime();
                if (endDate < nowTime) {
                    setPromoError("Code promo expiré");
                    setAppliedPromo(null);
                    setIsCheckingPromo(false);
                    return;
                }
            }

            if (promo.max_uses && promo.uses_count >= promo.max_uses) {
                setPromoError("Code promo épuisé");
                setAppliedPromo(null);
                setIsCheckingPromo(false);
                return;
            }

            if (promo.min_purchase_amount && basePrice < promo.min_purchase_amount) {
                setPromoError(`Montant minimum requis : ${promo.min_purchase_amount}€`);
                setAppliedPromo(null);
                setIsCheckingPromo(false);
                return;
            }

            if (promo.scope === 'category' || promo.scope === 'products') {
                if (promo.scope === 'category') {
                    const { data: catLinks } = await supabase
                        .from("promo_code_categories")
                        .select("category_id")
                        .eq("promo_code_id", promo.id);

                    const userProduct = await supabase
                        .from("products")
                        .select("category_id")
                        .eq("slug", planId)
                        .single();

                    const isInCategory = catLinks?.some((link: any) =>
                        link.category_id === userProduct.data?.category_id
                    );

                    if (!isInCategory) {
                        setPromoError("Ce code n'est pas valable pour ce plan");
                        setAppliedPromo(null);
                        setIsCheckingPromo(false);
                        return;
                    }
                } else if (promo.scope === 'products') {
                    const { data: prodLinks } = await supabase
                        .from("promo_code_products")
                        .select("product_id")
                        .eq("promo_code_id", promo.id);

                    const userProduct = await supabase
                        .from("products")
                        .select("id")
                        .eq("slug", planId)
                        .single();

                    const isInProducts = prodLinks?.some((link: any) =>
                        link.product_id === userProduct.data?.id
                    );

                    if (!isInProducts) {
                        setPromoError("Ce code n'est pas valable pour ce plan");
                        setAppliedPromo(null);
                        setIsCheckingPromo(false);
                        return;
                    }
                }
            }

            if (promo.max_uses_per_user && user) {
                const { data: userUsage } = await supabase
                    .from("promo_code_uses")
                    .select("*")
                    .eq("user_id", user.id)
                    .eq("promo_code_id", promo.id)
                    .single();

                if (userUsage && userUsage.usage_count >= promo.max_uses_per_user) {
                    setPromoError("Vous avez déjà atteint la limite d'utilisation de ce code");
                    setAppliedPromo(null);
                    setIsCheckingPromo(false);
                    return;
                }
            }

            if (promo.user_target && user && user.email !== promo.user_target) {
                setPromoError("Ce code promo n'est pas valable pour votre compte");
                setAppliedPromo(null);
                setIsCheckingPromo(false);
                return;
            }

            setAppliedPromo(promo);
            setPromoError("");
        } catch (err) {
            console.error("Erreur checkPromoCode:", err);
            setPromoError("Erreur de vérification");
            setAppliedPromo(null);
        } finally {
            setIsCheckingPromo(false);
        }
    };

    const removePromoCode = () => {
        setPromoCode("");
        setAppliedPromo(null);
        setPromoError("");
    };

    // 💳 Fonction Stripe Checkout
    const handleStripeCheckout = async () => {
        setIsProcessing(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Vous devez être connecté pour procéder au paiement");
                setIsProcessing(false);
                return;
            }

            const priceId = STRIPE_PRICE_IDS[planId]?.[billingPeriod];
            if (!priceId) {
                alert("Plan non disponible pour le moment");
                setIsProcessing(false);
                return;
            }

            const response = await fetch("/api/stripe/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    priceId,
                    userId: user.id,
                    email: user.email,
                    planId,
                    billingPeriod,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erreur Stripe");

            // Redirection vers Stripe Checkout
            window.location.href = data.url;
        } catch (error: any) {
            console.error("Erreur Stripe:", error);
            alert("Erreur: " + error.message);
            setIsProcessing(false);
        }
    };

    const createOrder = async () => {
        const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                planId,
                billingPeriod,
                promoCode: appliedPromo ? appliedPromo.code : null,
            }),
        });

        const order = await response.json();
        if (!response.ok) throw new Error(order.error || "Erreur création commande");

        return order.orderId;
    };

    const onApprove = async (data: any) => {
        setIsProcessing(true);

        try {
            const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: data.orderID,
                    planId,
                    billingPeriod,
                    promoCode: appliedPromo ? appliedPromo.code : null,
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Erreur validation commande");

            setPaymentSuccess(true);
            setTimeout(() => {
                onSuccess();
                resetModal();
            }, 2500);
        } catch (error: any) {
            alert("Erreur: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetModal = () => {
        setPaymentMethod(null);
        setPromoCode("");
        setAppliedPromo(null);
        setPromoError("");
        setPaymentSuccess(false);
        setIsProcessing(false);
    };

    const handleClose = () => {
        if (!isProcessing) {
            resetModal();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-2xl glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-white">
                            Finaliser l'achat
                        </h2>
                        <p className="text-sm text-white/60 mt-1">
                            Plan {planName} • {billingPeriod === "monthly" ? "Mensuel" : "Annuel"}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {paymentSuccess ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h3 className="font-display text-2xl font-bold text-white mb-2">
                                Paiement réussi !
                            </h3>
                            <p className="text-white/60">
                                Bienvenue dans le plan {planName}. Redirection...
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="glass rounded-xl p-5 border border-white/10 space-y-3">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-noah-violet" />
                                    Récapitulatif
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-white/70">
                                        <span>Plan {planName} ({billingPeriod === "monthly" ? "mensuel" : "annuel"})</span>
                                        <span>{originalPrice.toFixed(2)}€</span>
                                    </div>

                                    {basePrice < originalPrice && (
                                        <div className="flex justify-between text-emerald-400">
                                            <span className="flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                Réduction automatique
                                            </span>
                                            <span>-{(originalPrice - basePrice).toFixed(2)}€</span>
                                        </div>
                                    )}

                                    {appliedPromo && (
                                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Code <span className="font-mono font-bold">{appliedPromo.code}</span> appliqué !
                                            </p>

                                            {appliedPromo.name && (
                                                <p className="text-xs text-white/60">{appliedPromo.name}</p>
                                            )}

                                            <div className="text-xs text-white/40 space-y-1">
                                                {appliedPromo.end_at && (
                                                    <p>
                                                        Expire le {new Date(appliedPromo.end_at).toLocaleDateString('fr-FR')}
                                                    </p>
                                                )}
                                                {appliedPromo.max_uses_per_user && (
                                                    <p>
                                                        Limite : {appliedPromo.max_uses_per_user} utilisation(s) par utilisateur
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {appliedPromo && (
                                        <div className="flex justify-between text-emerald-400">
                                            <span className="flex items-center gap-1">
                                                <Gift className="w-3 h-3" />
                                                Code promo
                                            </span>
                                            <span>-{savings.toFixed(2)}€</span>
                                        </div>
                                    )}

                                    <div className="border-t border-white/10 pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-white">Total</span>
                                            <div className="text-right">
                                                {(appliedPromo || basePrice < originalPrice) && (
                                                    <div className="text-sm text-white/40 line-through">
                                                        {originalPrice.toFixed(2)}€
                                                    </div>
                                                )}
                                                <div className="text-2xl font-bold text-white">
                                                    {finalPrice.toFixed(2)}€
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    {billingPeriod === "monthly" ? "/mois" : "/an"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">
                                    Code promo
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        disabled={!!appliedPromo || isCheckingPromo || basePrice < originalPrice}
                                        placeholder={basePrice < originalPrice ? "Réduction active" : "NOAH20"}
                                        className="flex-1 bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-noah-violet/50 uppercase disabled:opacity-50"
                                    />

                                    {appliedPromo ? (
                                        <button
                                            onClick={removePromoCode}
                                            className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition whitespace-nowrap flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Retirer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={checkPromoCode}
                                            disabled={isCheckingPromo || !promoCode || basePrice < originalPrice}
                                            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {isCheckingPromo ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Appliquer"
                                            )}
                                        </button>
                                    )}
                                </div>
                                {promoError && (
                                    <p className="text-xs text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {promoError}
                                    </p>
                                )}
                                {appliedPromo && (
                                    <p className="text-xs text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Code appliqué avec succès !
                                    </p>
                                )}
                                {basePrice < originalPrice && !appliedPromo && (
                                    <p className="text-xs text-white/40">
                                        💡 Une réduction automatique est déjà appliquée.
                                    </p>
                                )}
                            </div>

                            {!paymentMethod ? (
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-white/80">
                                        Méthode de paiement
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPaymentMethod("card")}
                                            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-noah-violet/30 transition text-left group"
                                        >
                                            <CreditCard className="w-6 h-6 text-noah-violet mb-2 group-hover:scale-110 transition" />
                                            <div className="font-semibold text-white text-sm">Carte bancaire</div>
                                            <div className="text-xs text-white/50">Via Stripe (sécurisé)</div>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod("paypal")}
                                            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition text-left group"
                                        >
                                            <Wallet className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition" />
                                            <div className="font-semibold text-white text-sm">PayPal</div>
                                            <div className="text-xs text-white/50">Paiement sécurisé</div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setPaymentMethod(null)}
                                        className="text-sm text-noah-violet hover:underline"
                                    >
                                        ← Changer de méthode
                                    </button>

                                    {paymentMethod === "paypal" ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-white/60">
                                                <Lock className="w-4 h-4" />
                                                Paiement sécurisé via PayPal
                                            </div>

                                            {isPending ? (
                                                <div className="p-4 rounded-xl bg-white/5 flex items-center justify-center text-sm text-white/60">
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    Chargement de PayPal...
                                                </div>
                                            ) : (
                                                <PayPalButtons
                                                    style={{ layout: "horizontal", color: "blue", shape: "rect" }}
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={(err) => {
                                                        console.error("Erreur PayPal:", err);
                                                        alert("Erreur lors du paiement PayPal");
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-6 rounded-xl bg-noah-panel border border-noah-border text-center space-y-4">
                                            <CreditCard className="w-12 h-12 text-noah-violet mx-auto" />
                                            <h4 className="font-semibold text-white">Paiement par carte via Stripe</h4>
                                            <p className="text-sm text-white/60">
                                                Vous serez redirigé vers une page sécurisée Stripe pour finaliser votre abonnement récurrent.
                                            </p>
                                            <button
                                                onClick={handleStripeCheckout}
                                                disabled={isProcessing}
                                                className="btn-primary px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
                                            >
                                                {isProcessing ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Lock className="w-4 h-4" />
                                                        Procéder au paiement ({finalPrice.toFixed(2)}€)
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-white/40">
                                                Abonnement récurrent • Annulable à tout moment
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-4 text-xs text-white/40 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    <span>Paiement sécurisé</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    <span>SSL Encrypté</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}