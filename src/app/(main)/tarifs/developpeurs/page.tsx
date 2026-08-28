import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const devPlans = [
  {
    name: "Developer Free",
    price: "0",
    emoji: "🆓",
    description: "Découvrir l'API",
    features: [
      "Clé API personnelle",
      "500 requêtes/jour",
      "30 req/minute",
      "2 agents max",
      "500 Mo stockage",
      "Documentation",
    ],
  },
  {
    name: "Developer Pro",
    price: "24,99",
    emoji: "",
    description: "Développeurs indépendants",
    features: [
      "100 000 req/mois",
      "Modèles IA avancés",
      "Création d'agents",
      "Vision IA",
      "Vocal (STT/TTS)",
      "Dashboard détaillé",
    ],
    popular: true,
  },
  {
    name: "Business API",
    price: "199",
    emoji: "🏢",
    description: "PME et startups",
    features: [
      "Millions de req/mois",
      "Quotas personnalisables",
      "Plusieurs clés API",
      "Gestion équipes",
      "Support prioritaire",
    ],
  },
  {
    name: "Enterprise API",
    price: "Sur devis",
    emoji: "🏆",
    description: "Grandes organisations",
    features: [
      "Volume illimité",
      "Modèles personnalisés",
      "SLA dédiés",
      "Support 24/7",
      "Account manager",
    ],
  },
];

export default function DeveloppeursPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full glass text-xs text-noah-violet mb-4">
              💻 API PUBLIQUE
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">
              N.O.A.H. pour les{" "}
              <span className="text-gradient">développeurs</span>
            </h1>
            <p className="text-noah-muted max-w-2xl mx-auto">
              Intégrez les capacités de N.O.A.H. dans vos applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {devPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col relative ${
                  plan.popular
                    ? "pricing-popular border-2 border-noah-violet/30"
                    : "glass"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-noah-blue to-noah-violet text-[10px] font-bold">
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
                      <span className="text-noah-violet">✓</span> {f}
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
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}