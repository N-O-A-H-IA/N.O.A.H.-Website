import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const businessPlans = [
  {
    name: "Business Starter",
    price: "19,99",
    emoji: "",
    description: "Petites équipes",
    features: [
      "Assistant IA professionnel",
      "Analyse documentaire",
      "Gestion utilisateurs",
      "Espace partagé",
      "Sécurité pro",
    ],
  },
  {
    name: "Business Advanced",
    price: "49,99",
    emoji: "💼",
    description: "Entreprises en croissance",
    features: [
      "Tout de Starter",
      "Agents métiers personnalisés",
      "Base de connaissances",
      "Automatisations",
      "Intégrations pro",
      "Tableaux de bord",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    emoji: "🏆",
    description: "Grandes organisations",
    features: [
      "Tout de Advanced",
      "Agents IA illimités",
      "Mémoire organisationnelle",
      "Multi-filiales",
      "Support 24/7",
      "Account manager",
    ],
  },
];

export default function EntreprisesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full glass text-xs text-amber-400 mb-4">
              🏢 SOLUTIONS BUSINESS
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">
              N.O.A.H. pour les{" "}
              <span className="text-gradient">entreprises</span>
            </h1>
            <p className="text-noah-muted max-w-2xl mx-auto">
              Intégrez l'IA au cœur de vos processus métier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {businessPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col relative ${
                  plan.popular
                    ? "pricing-popular border-2 border-amber-500/30"
                    : "glass"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold">
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
                  <span className="text-noah-muted text-sm">
                    /utilisateur/mois
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-noah-muted mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-amber-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`w-full py-2.5 rounded-lg text-sm font-medium text-center transition ${
                    plan.popular
                      ? "btn-primary text-white"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  Nous contacter
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}