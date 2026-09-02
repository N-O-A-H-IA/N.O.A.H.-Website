"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";
import { PaymentModal } from "@/components/PaymentModal";
import { UrgencyBanner } from "@/components/UrgencyBanner"; // ✅ AJOUTÉ
import { Sparkles } from "lucide-react";

const plans = [
  {
    id: "free",
    price: 0,
    description: "Découvrir N.O.A.H.",
    features: ["50 messages/jour", "Assistant général", "Historique 7 jours", "Agents standards", "Analyse documentaire limitée"],
    popular: false,
    cta: "Commencer",
    isFree: true,
  },
  {
    id: "plus",
    price: 9.99,
    description: "Utilisateurs réguliers",
    features: ["Messages illimités", "Modèles IA avancés", "Tous les agents", "Mémoire améliorée", "Documents avancés", "Support prioritaire"],
    popular: true,
    cta: "Acheter maintenant",
  },
  {
    id: "pro",
    price: 24.99,
    description: "Professionnels",
    features: ["Tout de Plus", "Agents personnalisés", "Automatisation avancée", "Accès API", "Support dédié", "Accès anticipé aux nouveautés"],
    popular: false,
    cta: "Acheter maintenant",
  },
  {
    id: "ultimate",
    price: 49.99,
    description: "Expérience complète",
    features: ["Tout de Pro", "Limites maximales", "Système multi-agents", "Account manager dédié", "Accès anticipé aux nouveautés", "Formation personnalisée"],
    popular: false,
    cta: "Acheter maintenant",
  },
];

export default function TarifsPage() {
  const router = useRouter();
  const supabase = createClient();
  

  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Réduction automatique (staff)
  const [siteDiscount, setSiteDiscount] = useState<any>(null);

  useEffect(() => {
    loadUserPlan();
    loadSiteDiscount();
  }, []);

  const loadUserPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();
      if (profile) setCurrentPlan(profile.plan);
    }
  };

  const loadSiteDiscount = async () => {
    const { data: discount } = await supabase
        .from("site_discounts")
        .select("*")
        .eq("is_active", true)
        .lte("starts_at", new Date().toISOString())
        .single();

    if (discount) {
      setSiteDiscount(discount);
    }
  };

  // Calculer le prix avec réduction automatique
  const getDisplayPrice = (planId: string, basePrice: number) => {
    if (!siteDiscount || planId === "free") return basePrice;

    if (siteDiscount.scope_type === 'plans' && siteDiscount.scope_ids) {
      const scopeArray = Array.isArray(siteDiscount.scope_ids)
          ? siteDiscount.scope_ids
          : JSON.parse(siteDiscount.scope_ids);
      if (!scopeArray.includes(planId)) return basePrice;
    }

    const discountValue = Number(siteDiscount.discount_value) || 0;
    if (siteDiscount.discount_type === 'percent') {
      return basePrice * (1 - discountValue / 100);
    } else {
      return Math.max(basePrice - discountValue, 0.99);
    }
  };

  const handleBuy = (plan: any) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handleSuccess = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan.id);
      setSuccessPlan(selectedPlan.id);
    }
  };

  return (
      <main className="min-h-screen">
        <Navbar />

        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">

            {successPlan && (
                <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-medium">
                  ✅ Paiement réussi ! Bienvenue dans le plan {successPlan.toUpperCase()}. Redirection...
                </div>
            )}

            {/* ✅ BANDEAU D'URGENCE (Remplace l'ancienne bannière) */}
            {siteDiscount && siteDiscount.ends_at && (
                <UrgencyBanner
                    discountName={siteDiscount.name || "Offre spéciale"}
                    discountPercent={Number(siteDiscount.discount_value)}
                    endsAt={siteDiscount.ends_at}
                    onTimeUp={() => {
                      window.location.reload();
                    }}
                />
            )}

            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full glass text-xs text-noah-violet mb-4 font-medium">
                TARIFS
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
                Un plan pour chaque <span className="text-gradient">ambition</span>
              </h1>
              <p className="text-noah-muted text-lg max-w-2xl mx-auto">
                Commencez gratuitement. Évoluez quand vous êtes prêt.
              </p>
            </div>

            {/* Grille des plans */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => {
                const isCurrent = currentPlan === plan.id;
                const displayPrice = getDisplayPrice(plan.id, plan.price);
                const hasAutoDiscount = displayPrice < plan.price && plan.id !== "free";

                return (
                    <div
                        key={plan.id}
                        className={`rounded-2xl p-6 flex flex-col relative w-full ${
                            plan.popular ? "border-2 border-noah-violet/30 bg-noah-violet/5" : "glass"
                        } ${isCurrent ? "ring-2 ring-emerald-500/50" : ""}`}
                    >
                      {/* Badge populaire */}
                      {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-noah-blue to-noah-violet text-xs font-bold z-10">
                            POPULAIRE
                          </div>
                      )}

                      {/* Badge réduction automatique */}
                      {hasAutoDiscount && (
                          <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-white z-10 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {siteDiscount.discount_type === 'percent'
                                ? `-${siteDiscount.discount_value}%`
                                : `-${siteDiscount.discount_value}€`
                            }
                          </div>
                      )}

                      {/* Badge plan actuel */}
                      {isCurrent && (
                          <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-emerald-500 text-xs font-bold text-white z-10">
                            ACTUEL
                          </div>
                      )}

                      <div className="w-full flex justify-center mb-6">
                        <RankBadge plan={plan.id} size="lg" animated={true} asTitle={true} />
                      </div>

                      <p className="text-sm text-noah-muted mb-6 text-center">{plan.description}</p>

                      {/* Prix */}
                      <div className="mb-6 text-center">
                        {hasAutoDiscount ? (
                            <>
                              <div className="text-lg text-white/40 line-through mb-1">
                                {plan.price.toFixed(2)}€
                              </div>
                              <div className="flex items-baseline justify-center gap-1">
                                <span className="font-display text-4xl font-bold text-emerald-400">
                                  {displayPrice.toFixed(2)}€
                                </span>
                                <span className="text-noah-muted text-sm">/mois</span>
                              </div>
                            </>
                        ) : (
                            <div>
                              <span className="font-display text-4xl font-bold text-white">
                                {plan.price.toFixed(2)}€
                              </span>
                              <span className="text-noah-muted text-sm">/mois</span>
                            </div>
                        )}
                      </div>

                      <ul className="space-y-3 text-sm text-noah-muted mb-6 flex-1 w-full">
                        {plan.features.map((f, index) => (
                            <li key={index} className="flex items-start gap-3 w-full">
                              <span className="text-noah-violet flex-shrink-0 mt-0.5 font-bold">✓</span>
                              <span className="flex-1">{f}</span>
                            </li>
                        ))}
                      </ul>

                      {plan.isFree ? (
                          <Link
                              href="/register"
                              className="w-full py-3 rounded-xl text-sm font-semibold text-center transition glass hover:bg-white/10 border border-noah-border"
                          >
                            {plan.cta}
                          </Link>
                      ) : isCurrent ? (
                          <button disabled className="w-full py-3 rounded-xl text-sm font-semibold text-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default">
                            Plan actuel
                          </button>
                      ) : (
                          <button
                              onClick={() => handleBuy(plan)}
                              className="w-full py-3 rounded-xl text-sm font-semibold text-center transition btn-primary text-white hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {plan.cta}
                          </button>
                      )}
                    </div>
                );
              })}
            </div>

            {/* Autres offres */}
            <div className="mt-20">
              <h2 className="font-display text-3xl font-bold text-center mb-8">Autres offres</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Link href="/tarifs/etudiants" className="glass rounded-2xl p-8 hover:border-emerald-500/30 transition group w-full">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-4xl">🎓</div>
                    <RankBadge plan="student" size="md" animated={false} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2 text-center text-white">Offre Étudiant</h3>
                  <p className="text-sm text-noah-muted text-center">Plan gratuit disponible avec vérification</p>
                </Link>
                <Link href="/tarifs/entreprises" className="glass rounded-2xl p-8 hover:border-amber-500/30 transition group w-full">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-4xl">🏢</div>
                    <RankBadge plan="pro" size="md" animated={false} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2 text-center text-white">Offre Entreprise</h3>
                  <p className="text-sm text-noah-muted text-center">À partir de 19,99€/utilisateur/mois</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modal de paiement */}
        {selectedPlan && (
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                planId={selectedPlan.id}
                planName={selectedPlan.id}
                basePrice={getDisplayPrice(selectedPlan.id, selectedPlan.price)}
                originalPrice={selectedPlan.price}
                onSuccess={handleSuccess}
            />
        )}
      </main>
  );
}