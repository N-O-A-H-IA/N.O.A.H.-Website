"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CreditCard, Gift, Clock, CheckCircle2 } from "lucide-react";

export default function BillingPage() {
    const supabase = createClient();
    const [currentPlan, setCurrentPlan] = useState("free");
    const [promoHistory, setPromoHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
            .from("profiles")
            .select("plan, applied_promo_code, promo_applied_at")
            .eq("id", user.id)
            .single();

        if (profile) {
            setCurrentPlan(profile.plan);
            if (profile.applied_promo_code) {
                setPromoHistory([{
                    code: profile.applied_promo_code,
                    applied_at: profile.promo_applied_at,
                    plan: profile.plan,
                }]);
            }
        }
        setLoading(false);
    };

    if (loading) return <div className="text-center py-20 text-white/60">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-white mb-2">Facturation</h1>
                <p className="text-white/60">Gérez votre abonnement et vos codes promo</p>
            </div>

            {/* Plan actuel */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-lg capitalize">{currentPlan} Plan</h3>
                            <p className="text-sm text-white/60">Abonnement actif</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                        Actif
                    </div>
                </div>
            </div>

            {/* Historique des codes promo */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-noah-violet" />
                    Historique des codes promo
                </h3>

                {promoHistory.length === 0 ? (
                    <div className="text-center py-8 text-white/40 text-sm">
                        Aucun code promo utilisé
                    </div>
                ) : (
                    <div className="space-y-3">
                        {promoHistory.map((promo, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="font-mono font-semibold text-white">{promo.code}</div>
                                        <div className="text-xs text-white/60 capitalize">Plan {promo.plan}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <Clock className="w-3 h-3" />
                                    {new Date(promo.applied_at).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}