"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { PaymentModal } from "@/components/PaymentModal";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { Sparkles } from "lucide-react";

const studentPlans = [
  {
    id: "student_free",
    name: "Student Free",
    price: 0,
    emoji: "🎓",
    description: "Découvrir N.O.A.H. Student",
    features: [
      "Assistant étudiant de base",
      "Explication de cours",
      "Aide aux devoirs",
      "Résumés simples",
      "Quota réduit",
    ],
    isFree: true,
    cta: "Commencer",
  },
  {
    id: "student",
    name: "Student",
    price: 4.99,
    emoji: "⭐",
    description: "Étudiants réguliers",
    features: [
      "Tout de Student Free",
      "IA améliorée",
      "Quota augmenté",
      "Fiches de révision",
      "Agent Professeur",
      "Agent Révision",
    ],
    popular: true,
    cta: "Acheter maintenant",
  },
  {
    id: "student_pro",
    name: "Student Pro",
    price: 7.99,
    emoji: "🎯",
    description: "Étudiants intensifs",
    features: [
      "Tout de Student",
      "Capacités IA maximales",
      "Gros documents",
      "Agents personnalisés",
      "Automatisations",
    ],
    cta: "Acheter maintenant",
  },
];

export default function EtudiantsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentPlan, setCurrentPlan] = useState<string>("student_free");
  const [successPlan, setSuccessPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [siteDiscount, setSiteDiscount] = useState<any>(null);
  const [isStudentVerified, setIsStudentVerified] = useState(false);

  useEffect(() => {
    loadUserPlan();
    loadSiteDiscount();
    checkStudentStatus();
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
    // 1. On récupère TOUTES les réductions actives (sans .single() pour éviter le crash)
    const { data: discounts, error } = await supabase
        .from("site_discounts")
        .select("*")
        .eq("is_active", true)
        .lte("starts_at", new Date().toISOString());

    if (error) {
      console.error(" Erreur Supabase:", error);
      return;
    }

    console.log("🔍 Discounts trouvés dans la BDD:", discounts);

    if (discounts && discounts.length > 0) {
      // 2. On cherche celle qui est faite pour les étudiants (ou globale)
      const discount = discounts.find(d =>
          d.scope_type === 'student' || d.scope_type === 'all' || !d.scope_type
      );

      if (discount) {
        console.log("✅ Réduction étudiant trouvée :", discount.name);
        setSiteDiscount(discount);
      } else {
        console.log("⚠️ Aucune réduction 'student' trouvée, mais il y en a d'autres :", discounts.map(d => d.scope_type));
      }
    } else {
      console.log("️ Aucune réduction active trouvée.");
    }
  };

  const checkStudentStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
          .from("profiles")
          .select("plan, is_student_verified") // On récupère les deux au cas où
          .eq("id", user.id)
          .single();

      if (profile) {
        // 1. Si le plan commence par "student" (student, student_free, student_pro)
        const isStudentPlan = profile.plan?.startsWith('student');

        // 2. OU si la colonne is_student_verified existe et est true
        const isVerified = profile.is_student_verified === true;

        // Si l'un des deux est vrai, on débloque les boutons
        if (isStudentPlan || isVerified) {
          setIsStudentVerified(true);
        }
      }
    }
  };

  const getDisplayPrice = (planId: string, basePrice: number) => {
    if (!siteDiscount || planId === "student_free") return basePrice;

    if (siteDiscount.scope_ids) {
      try {
        const scopeArray = Array.isArray(siteDiscount.scope_ids)
            ? siteDiscount.scope_ids
            : JSON.parse(siteDiscount.scope_ids);

        // Si le plan n'est pas dans la liste, on ne met pas de réduction
        if (!scopeArray.includes(planId)) return basePrice;
      } catch (e) {
        console.error("Erreur lecture scope_ids:", e);
      }
    }

    const discountValue = Number(siteDiscount.discount_value) || 0;
    if (siteDiscount.discount_type === 'percent') {
      return basePrice * (1 - discountValue / 100);
    } else {
      return Math.max(basePrice - discountValue, 0.99);
    }
  };

  const handleBuy = (plan: any) => {
    if (!isStudentVerified) {
      router.push("/tarifs/etudiants/student-verification");
      return;
    }
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

            {/* Bandeau d'urgence pour réductions étudiants */}
            {siteDiscount && siteDiscount.ends_at && (
                <UrgencyBanner
                    discountName={siteDiscount.name || "Offre spéciale étudiant"}
                    discountPercent={Number(siteDiscount.discount_value)}
                    endsAt={siteDiscount.ends_at}
                    onTimeUp={() => {
                      setSiteDiscount(null);
                    }}
                />
            )}

            <div className="text-center mb-12">
              <div className="inline-block px-3 py-1 rounded-full glass text-xs text-emerald-400 mb-4">
                🎓 PROGRAMME ÉTUDIANT
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">
                N.O.A.H. pour les{" "}
                <span className="text-gradient">étudiants</span>
              </h1>
              <p className="text-noah-muted max-w-2xl mx-auto">
                Tarifs réduits avec vérification du statut étudiant.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {studentPlans.map((plan) => {
                const isCurrent = currentPlan === plan.id;
                const displayPrice = getDisplayPrice(plan.id, plan.price);
                const hasAutoDiscount = displayPrice < plan.price && plan.id !== "student_free";

                return (
                    <div
                        key={plan.id}
                        className={`rounded-2xl p-6 flex flex-col relative ${
                            plan.popular
                                ? "pricing-popular border-2 border-emerald-500/30"
                                : "glass"
                        } ${isCurrent ? "ring-2 ring-emerald-500/50" : ""}`}
                    >
                      {plan.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold">
                            POPULAIRE
                          </div>
                      )}

                      {hasAutoDiscount && (
                          <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-bold text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {siteDiscount.discount_type === 'percent'
                                ? `-${siteDiscount.discount_value}%`
                                : `-${siteDiscount.discount_value}€`
                            }
                          </div>
                      )}

                      {isCurrent && (
                          <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-emerald-500 text-xs font-bold text-white">
                            ACTUEL
                          </div>
                      )}

                      <div className="text-2xl mb-3">{plan.emoji}</div>
                      <h3 className="font-display text-xl font-bold mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-noah-muted mb-4">
                        {plan.description}
                      </p>

                      <div className="mb-5">
                        {hasAutoDiscount ? (
                            <>
                              <div className="text-lg text-white/40 line-through mb-1">
                                {plan.price.toFixed(2)}€
                              </div>
                              <div className="flex items-baseline gap-1">
                          <span className="font-display text-3xl font-bold text-emerald-400">
                            {displayPrice.toFixed(2)}€
                          </span>
                                <span className="text-noah-muted text-sm">/mois</span>
                              </div>
                            </>
                        ) : (
                            <>
                        <span className="font-display text-3xl font-bold">
                          {plan.price.toFixed(2)}€
                        </span>
                              <span className="text-noah-muted text-sm">/mois</span>
                            </>
                        )}
                      </div>

                      <ul className="space-y-2 text-sm text-noah-muted mb-6 flex-1">
                        {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <span className="text-emerald-400">✓</span> {f}
                            </li>
                        ))}
                      </ul>

                      {plan.isFree ? (
                          <Link
                              href="/register"
                              className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition ${
                                  plan.popular
                                      ? "btn-primary text-white"
                                      : "glass hover:bg-white/10"
                              }`}
                          >
                            {plan.cta}
                          </Link>
                      ) : isCurrent ? (
                          <button disabled className="w-full py-2.5 rounded-lg text-sm font-medium text-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default">
                            Plan actuel
                          </button>
                      ) : (
                          <button
                              onClick={() => handleBuy(plan)}
                              className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition ${
                                  plan.popular
                                      ? "btn-primary text-white hover:scale-[1.02] active:scale-[0.98]"
                                      : "glass hover:bg-white/10"
                              }`}
                          >
                            {isStudentVerified ? plan.cta : "Vérification requise"}
                          </button>
                      )}
                    </div>
                );
              })}
            </div>

            {/* Section Offres Étudiant */}
            <div className="mt-8 glass rounded-2xl p-8 border border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Offres Étudiant N.O.A.H.
                  </h3>
                  <p className="text-base text-white/70 leading-relaxed">
                    Les offres étudiantes sont <span className="font-bold text-white">verrouillées par défaut</span> et réservées exclusivement aux étudiants vérifiés.
                    Une fois ton statut étudiant confirmé, tu débloques l'accès à <span className="font-bold text-white">Student Free</span>,
                    <span className="font-bold text-white"> Student</span> et <span className="font-bold text-white">Student Pro</span> —
                    trois offres spécialement conçues pour le monde étudiant.
                  </p>
                </div>
              </div>

              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-emerald-400">
                Offres exclusives étudiants • Validation sous 24h
              </span>
              </div>

              {/* Avertissements importants */}
              <div className="mb-8 space-y-4">
                <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  ⚠️ Informations importantes à lire avant toute souscription
                </h4>

                <div className="p-5 rounded-xl bg-red-500/5 border-l-4 border-red-500/50 border-y border-r border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-white mb-2">Les offres ne sont PAS cumulables</h5>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Tu ne peux bénéficier <span className="font-bold text-white">que d'un seul abonnement à la fois</span>.
                        <br/> <span className="font-bold text-white"> Les offres étudiantes (Student Free, Student, Student Pro)
                      et les offres classiques (Free, Plus, Pro, Ultimate) sont mutuellement exclusives</span>.
                        <br/> Si tu possèdes déjà un abonnement classique et que tu souscris à une offre étudiante,
                        <span className="font-bold text-red-400"> ton ancien abonnement sera immédiatement remplacé</span> et
                        <span className="font-bold text-red-400"> tu perdras tous ses avantages</span> sans remboursement automatique.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-amber-500/5 border-l-4 border-amber-500/50 border-y border-r border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-white mb-2">Attention à la facturation en cours</h5>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Si tu as une <span className="font-bold text-white">facturation active</span> sur un abonnement classique (mensuelle ou annuelle),
                        <span className="font-bold text-amber-400"> tu continueras à être facturé</span> tant que tu n'auras pas explicitement annulé cet abonnement.
                        <br/> Passer à une offre étudiante <span className="font-bold text-amber-400">n'annule pas automatiquement</span> ton ancien abonnement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-blue-500/5 border-l-4 border-blue-500/50 border-y border-r border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-white mb-2">Deux options s'offrent à toi</h5>
                      <p className="text-sm text-white/70 leading-relaxed mb-3">
                        <br/> Si tu souhaites passer d'un abonnement classique à une offre étudiante, voici tes options :
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                          <div className="font-semibold text-emerald-400 text-sm mb-1">✅ Option 1 (Recommandée)</div>
                          <p className="text-xs text-white/70 leading-relaxed">
                            <span className="font-bold text-white">Annule ton abonnement classique</span> et attends la fin de la période déjà payée.
                            <br/> Une fois terminé, souscris à l'offre étudiante de ton choix. Tu ne perds rien et tu ne paies pas deux fois.
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                          <div className="font-semibold text-red-400 text-sm mb-1">⚠️ Option 2 (À tes risques)</div>
                          <p className="text-xs text-white/70 leading-relaxed">
                            <span className="font-bold text-white">Souscris immédiatement</span> à l'offre étudiante.
                            <br/> Tu perdras instantanément les avantages de ton ancien abonnement, mais <span className="font-bold text-red-400">tu seras quand même facturé</span> jusqu'à la fin de la période en cours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Garde-fous */}
              <div className="mb-8 space-y-4">
                <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  ️ Nos garde-fous pour te protéger
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">1</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Confirmation obligatoire</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Avant tout changement d'abonnement, une <span className="font-medium text-white">fenêtre de confirmation</span> t'expliquera clairement
                          ce que tu vas perdre et ce que tu vas gagner. Tu devras cocher explicitement pour valider.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">2</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Période de grâce de 7 jours</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Après un changement d'abonnement, tu disposes de <span className="font-medium text-white">7 jours</span> pour revenir en arrière
                          sans frais si tu changes d'avis.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">3</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Remboursement au prorata</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Si tu annules un abonnement annuel, tu peux bénéficier d'un <span className="font-medium text-white">remboursement au prorata des mois non utilisés (dans les 30 premiers jours). </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">4</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Historique complet</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Tous tes changements d'abonnement sont <span className="font-medium text-white">traçables dans ton espace personnel</span>.
                          <br/> Tu peux consulter à tout moment l'historique de tes factures et modifications.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">5</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Email de confirmation</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Chaque modification d'abonnement déclenche un <span className="font-medium text-white">email récapitulatif</span>
                          avec le détail des changements, le nouveau montant et la date de prochaine facturation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">6</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Rappel avant renouvellement</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Tu reçois un <span className="font-medium text-white">email 7 jours avant chaque renouvellement</span> pour te rappeler le montant qui sera débité et te permettre d'annuler si besoin.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">7</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Préservation des données</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          En cas de changement de plan, <span className="font-medium text-white">tes données ne sont jamais supprimées</span>.
                          <br/> Elles restent accessibles en lecture seule jusqu'à ce que tu repasses à un plan supérieur.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 font-bold">8</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-white text-sm mb-1">Support dédié</h5>
                        <p className="text-xs text-white/60 leading-relaxed">
                          En cas de doute ou de problème avec ta facturation, notre <span className="font-medium text-white">support est disponible 7j/7</span> pour t'aider à faire le bon choix sans perdre d'argent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment ça marche */}
              <div className="mb-8 space-y-4">
                <h4 className="font-semibold text-white text-lg mb-4">Comment ça marche ?</h4>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-400">1</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">Crée ton compte normalement</h5>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Inscris-toi sur N.O.A.H. comme n'importe quel utilisateur. Tu commences avec le plan Free, sans aucune limitation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-violet-400">2</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">Fais une demande de vérification</h5>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Depuis ton espace personnel, clique sur <span className="font-medium text-white">"Demander le statut étudiant"</span> et remplis le formulaire :
                      <br/> <span className="font-bold text-white">ton adresse email universitaire et/ou un justificatif (carte étudiante, certificat de scolarité). </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-400">3</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white mb-1">Les offres étudiantes se débloquent</h5>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Une fois ton statut validé, les offres <span className="font-bold text-white">Student Free</span>,
                      <span className="font-bold text-white"> Student</span> et <span className="font-bold text-white">Student Pro</span> deviennent accessibles.
                      <br />Tu peux alors choisir celle qui correspond le mieux à tes besoins.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-white">Questions fréquentes</h4>
                    <p className="text-sm text-white/60">Tout ce que tu dois savoir sur les offres étudiantes</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 w-fit">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-sm font-semibold text-red-400">Changement d'offre</span>
                  </div>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-red-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">⚠️</span>
                        <span>Que se passe-t-il si je souscris à une offre étudiante alors que j'ai déjà un abonnement Pro ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-red-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        Ton abonnement Pro sera <span className="font-bold text-white">immédiatement remplacé</span> par l'offre étudiante choisie.
                        <br/> Tu perdras <span className="font-bold text-red-400">tous les avantages Pro</span> (agents illimités, mémoire étendue, etc.) et <span className="font-bold text-red-400">tu seras quand même facturé</span> pour la période Pro en cours.
                        <br/> C'est pourquoi nous te recommandons <span className="font-bold text-white">fortement</span> d'attendre la fin de ton abonnement actuel avant de changer.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-red-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🔀</span>
                        <span>Puis-je garder mon abonnement classique ET avoir une offre étudiante en même temps ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-red-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold text-white text-base">Non.</span>
                        <br/> Les offres classiques (<span className="font-bold text-white">Free, Plus, Pro, Ultimate</span>) et les offres étudiantes (<span className="font-bold text-white">Student Free, Student, Student Pro</span>) sont <span className="font-bold text-red-400">mutuellement exclusives</span>.
                        <br/> Tu dois choisir : <span className="font-bold text-white">soit tu restes sur ton abonnement classique, soit tu passes à une offre étudiante</span>.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-red-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">↩️</span>
                        <span>Puis-je récupérer mon ancien abonnement si je regrette ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-red-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold text-emerald-400">Oui !</span> Tu peux <span className="font-bold text-white">repasser à un abonnement classique à tout moment</span> depuis ton espace personnel.
                        <br/> De plus, tu disposes d'une <span className="font-bold text-white">période de grâce de 7 jours</span> après tout changement pour revenir en arrière <span className="font-bold text-emerald-400">sans frais</span>.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-red-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🗑️</span>
                        <span>Comment annuler mon abonnement classique proprement ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-red-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        Rends-toi dans <span className="font-bold text-white">Paramètres → Abonnement → Annuler mon abonnement</span>.
                        <br/> Ton abonnement restera <span className="font-bold text-white">actif jusqu'à la fin de la période déjà payée</span>, puis passera automatiquement en <span className="font-bold text-white">Free</span>.
                        <br/> Tu pourras ensuite souscrire à une offre étudiante <span className="font-bold text-emerald-400">sans double facturation</span>.
                      </p>
                    </div>
                  </details>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 w-fit">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-amber-400">Facturation</span>
                  </div>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">💰</span>
                        <span>Suis-je remboursé si je change d'abonnement en cours de période ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-amber-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold text-amber-400">Non, pas automatiquement.</span>
                        <br/> Si tu as payé pour un mois ou une année, <span className="font-bold text-white">cette période reste acquise</span> même si tu changes d'offre.
                        <br/> Cependant, pour les <span className="font-bold text-white">abonnements annuels</span>, tu peux bénéficier d'un <span className="font-bold text-emerald-400">remboursement au prorata</span> des mois non utilisés si tu annules dans les <span className="font-bold text-white">30 premiers jours</span>.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🧾</span>
                        <span>Puis-je obtenir une facture PDF de mes paiements ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-amber-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold text-emerald-400">Oui, absolument.</span>
                        <br/> Chaque paiement génère automatiquement une <span className="font-bold text-white">facture PDF</span> disponible dans <span className="font-bold text-white">Paramètres → Facturation → Historique</span>.
                        <br/> Tu peux aussi recevoir tes factures <span className="font-bold text-white">par email</span> à chaque renouvellement.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📅</span>
                        <span>Quand suis-je facturé après un changement d'offre ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-amber-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        La facturation de ta nouvelle offre commence <span className="font-bold text-white">dès l'instant où tu confirmes le changement</span>.
                        <br/> Cependant, si tu avais déjà payé pour la période en cours sur ton ancien abonnement, <span className="font-bold text-amber-400">tu ne seras pas débité deux fois</span> pour la même période.
                        <br/> La nouvelle facturation débutera <span className="font-bold text-white">à la fin de ta période actuelle</span>.
                      </p>
                    </div>
                  </details>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 w-fit">
                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <span className="text-sm font-semibold text-violet-400">Statut étudiant</span>
                  </div>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎓</span>
                        <span>Que se passe-t-il si je ne suis plus étudiant ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-violet-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        Nous te demanderons un <span className="font-bold text-white">nouveau justificatif chaque année</span>.
                        <br/> Si tu ne peux plus prouver ton statut étudiant, ton compte repassera automatiquement à <span className="font-bold text-white">l'offre classique correspondante</span> (par exemple <span className="font-bold text-violet-400">Student → Plus</span>), avec un <span className="font-bold text-white">préavis de 30 jours</span> avant le changement de tarif.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎒</span>
                        <span>Quels justificatifs sont acceptés pour prouver mon statut étudiant ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-violet-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        Nous acceptons les documents suivants :
                        <br/> • <span className="font-bold text-white">Carte étudiante</span> en cours de validité (recto-verso)
                        <br/> • <span className="font-bold text-white">Certificat de scolarité</span> de l'année en cours
                        <br/> • <span className="font-bold text-white">Attestation d'inscription</span> délivrée par ton établissement
                        <br/> • <span className="font-bold text-white">Email universitaire</span> avec extension <span className="font-bold text-violet-400">.edu</span> ou <span className="font-bold text-violet-400">.fr</span> reconnue
                        <br/> Les documents doivent être <span className="font-bold text-white">lisibles, en couleur et datés de moins d'un an</span>.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏫</span>
                        <span>Que se passe-t-il si je change d'établissement en cours d'année ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-violet-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold text-emerald-400">Aucun souci !</span> Tu peux mettre à jour ton justificatif à tout moment depuis ton espace personnel.
                        <br/> Envoie simplement ton <span className="font-bold text-white">nouveau certificat de scolarité</span> et nous mettrons à jour ton dossier.
                        <br/> Ton statut étudiant reste <span className="font-bold text-white">actif pendant la transition</span>, sans interruption de service.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">️</span>
                        <span>Combien de temps prend la validation de ma demande ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-violet-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        La validation est généralement <span className="font-bold text-emerald-400">automatique et instantanée</span> si tu utilises une adresse email universitaire reconnue.
                        <br/> Pour les justificatifs manuels (carte étudiante, certificat), le délai est de <span className="font-bold text-white">24h ouvrées maximum</span>.
                        <br/> Tu recevras un <span className="font-bold text-white">email de confirmation</span> dès que ton statut sera activé.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg"></span>
                        <span>Les étudiants étrangers peuvent-ils bénéficier des offres étudiantes ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-violet-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold text-emerald-400">Oui, absolument !</span> Les offres étudiantes sont ouvertes à <span className="font-bold text-white">tous les étudiants du monde entier</span>.
                        <br/> Tu peux fournir un justificatif de ton établissement à l'étranger, à condition qu'il soit <span className="font-bold text-white">traduit en français ou en anglais</span> si nécessaire.
                        <br/> Les tarifs sont <span className="font-bold text-white">identiques</span> quel que soit ton pays de résidence.
                      </p>
                    </div>
                  </details>

                  <details className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 transition-colors cursor-pointer">
                    <summary className="flex items-center justify-between text-sm font-medium text-white list-none">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">⚖️</span>
                        <span>Les offres étudiantes sont-elles moins puissantes que les offres classiques ?</span>
                      </div>
                      <span className="transition group-open:rotate-180 flex-shrink-0">
                      <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    </summary>
                    <div className="mt-3 pl-8 border-l-2 border-violet-500/50">
                      <p className="text-sm text-white/60 leading-relaxed">
                        <span className="font-bold text-white">Non, elles sont différentes.</span>
                        <br/> Les offres étudiantes sont <span className="font-bold text-white">spécialement conçues pour les étudiants</span> avec des fonctionnalités adaptées :
                        <br/> • <span className="font-bold text-violet-400">Aide aux devoirs</span> et explication de cours
                        <br/> • <span className="font-bold text-violet-400">Fiches de révision</span> automatiques
                        <br/> • <span className="font-bold text-violet-400">Agent Professeur</span> et <span className="font-bold text-violet-400">Agent Révision</span>
                        <br/> Elles ne sont pas "moins puissantes", elles sont <span className="font-bold text-white">orientées éducation</span> pour maximiser ta réussite.
                      </p>
                    </div>
                  </details>
                </div>
              </div>

              {/* CTA Final */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 p-6 rounded-xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20">
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-white mb-1">Prêt à accéder aux offres étudiantes ?</h4>
                  <p className="text-sm text-white/70">Fais ta demande de vérification en quelques clics</p>
                </div>
                <Link
                    href="/tarifs/etudiants/student-verification"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-violet-500/25"
                >
                  Demander le statut étudiant
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
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
                planName={selectedPlan.name}
                basePrice={getDisplayPrice(selectedPlan.id, selectedPlan.price)}
                originalPrice={selectedPlan.price}
                onSuccess={handleSuccess}
            />
        )}
      </main>
  );
}