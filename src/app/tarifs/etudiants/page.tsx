import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const studentPlans = [
  {
    name: "Student Free",
    price: "0",
    emoji: "",
    description: "Découvrir N.O.A.H. Student",
    features: [
      "Assistant étudiant de base",
      "Explication de cours",
      "Aide aux devoirs",
      "Résumés simples",
      "Quota réduit",
    ],
  },
  {
    name: "Student",
    price: "4,99",
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
  },
  {
    name: "Student Pro",
    price: "7,99",
    emoji: "🎯",
    description: "Étudiants intensifs",
    features: [
      "Tout de Student",
      "Capacités IA maximales",
      "Gros documents",
      "Agents personnalisés",
      "Automatisations",
    ],
  },
];

export default function EtudiantsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
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
            {studentPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col relative ${
                  plan.popular
                    ? "pricing-popular border-2 border-emerald-500/30"
                    : "glass"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold">
                    POPULAIRE
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
                  <span className="font-display text-3xl font-bold">
                    {plan.price}€
                  </span>
                  <span className="text-noah-muted text-sm">/mois</span>
                </div>
                <ul className="space-y-2 text-sm text-noah-muted mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition ${
                    plan.popular
                      ? "btn-primary text-white"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  Choisir
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 glass rounded-xl p-6">
            <h3 className="font-bold text-lg mb-3">
              📋 Vérification du statut étudiant
            </h3>
            <p className="text-sm text-noah-muted mb-4">
              Pour bénéficier des tarifs étudiants, une vérification est
              requise :
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">1.</span>
                Fournir une adresse email étudiante officielle
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">2.</span>
                Envoyer un justificatif (carte étudiante, certificat de
                scolarité)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">3.</span>
                Validation sous 24h
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}