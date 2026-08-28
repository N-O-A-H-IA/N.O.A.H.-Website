import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { RankBadge } from "@/components/RankBadge";

const plans = [
  {
    id: "free",
    price: "0",
    description: "Découvrir N.O.A.H.",
    features: [
      "50 messages/jour",
      "Assistant général",
      "Historique 7 jours",
      "Agents standards",
      "Analyse documentaire limitée",
    ],
    popular: false,
    cta: "Commencer",
  },
  {
    id: "plus",
    price: "9,99",
    description: "Utilisateurs réguliers",
    features: [
      "Messages illimités",
      "Modèles IA avancés",
      "Tous les agents",
      "Mémoire améliorée",
      "Documents avancés",
      "Support prioritaire",
    ],
    popular: true,
    cta: "Choisir Plus",
  },
  {
    id: "pro",
    price: "24,99",
    description: "Professionnels",
    features: [
      "Tout de Plus",
      "Agents personnalisés",
      "Automatisation avancée",
      "Accès API",
      "Support dédié",
      "Accès anticipé aux nouveautés",
    ],
    popular: false,
    cta: "Choisir Pro",
  },
  {
    id: "ultimate",
    price: "49,99",
    description: "Expérience complète",
    features: [
      "Tout de Pro",
      "Limites maximales",
      "Système multi-agents",
      "Account manager dédié",
      "Accès anticipé aux nouveautés",
      "Formation personnalisée",
    ],
    popular: false,
    cta: "Choisir Ultimate",
  },
];

export default function TarifsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full glass text-xs text-noah-violet mb-4 font-medium">
              TARIFS
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              Un plan pour chaque{" "}
              <span className="text-gradient">ambition</span>
            </h1>
            <p className="text-noah-muted text-lg max-w-2xl mx-auto">
              Commencez gratuitement. Évoluez quand vous êtes prêt.
            </p>
          </div>

          {/* Grille des plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col relative w-full ${
                  plan.popular
                    ? "border-2 border-noah-violet/30 bg-noah-violet/5"
                    : "glass"
                }`}
              >
                {/* Badge populaire */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-noah-blue to-noah-violet text-xs font-bold z-10">
                    POPULAIRE
                  </div>
                )}

                {/* RankBadge comme TITRE principal - Grande taille */}
                <div className="w-full flex justify-center mb-6">
                  <RankBadge plan={plan.id} size="lg" animated={true} asTitle={true} />
                </div>

                <p className="text-sm text-noah-muted mb-6 text-center">
                  {plan.description}
                </p>

                {/* Prix */}
                <div className="mb-6 text-center">
                  <span className="font-display text-4xl font-bold text-white">
                    {plan.price}€
                  </span>
                  <span className="text-noah-muted text-sm">/mois</span>
                </div>

                {/* Fonctionnalités */}
                <ul className="space-y-3 text-sm text-noah-muted mb-6 flex-1 w-full">
                  {plan.features.map((f, index) => (
                    <li key={index} className="flex items-start gap-3 w-full">
                      <span className="text-noah-violet flex-shrink-0 mt-0.5 font-bold">✓</span>
                      <span className="flex-1">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton CTA - Pleine largeur */}
                <Link
                  href="/register"
                  className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition ${
                    plan.popular
                      ? "btn-primary text-white"
                      : "glass hover:bg-white/10 border border-noah-border"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Autres offres */}
          <div className="mt-20">
            <h2 className="font-display text-3xl font-bold text-center mb-8">
              Autres offres
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Offre Étudiant */}
              <Link
                href="/tarifs/etudiants"
                className="glass rounded-2xl p-8 hover:border-emerald-500/30 transition group w-full"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-4xl">🎓</div>
                  <RankBadge plan="student" size="md" animated={false} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2 text-center text-white">
                  Offre Étudiant
                </h3>
                <p className="text-sm text-noah-muted text-center">
                  Plan gratuit disponible avec vérification
                </p>
              </Link>

              {/* Offre Entreprise */}
              <Link
                href="/tarifs/entreprises"
                className="glass rounded-2xl p-8 hover:border-amber-500/30 transition group w-full"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-4xl">🏢</div>
                  <RankBadge plan="pro" size="md" animated={false} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2 text-center text-white">
                  Offre Entreprise
                </h3>
                <p className="text-sm text-noah-muted text-center">
                  À partir de 19,99€/utilisateur/mois
                </p>
              </Link>
            </div>

            {/* Offre Développeurs */}
            <div className="mt-6 max-w-2xl mx-auto">
              <Link
                href="/tarifs/developpeurs"
                className="glass rounded-2xl p-8 hover:border-noah-violet/30 transition group w-full block"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-4xl">💻</div>
                  <RankBadge plan="free" size="md" animated={false} />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2 text-center text-white">
                  API Développeurs
                </h3>
                <p className="text-sm text-noah-muted text-center">
                  Plan gratuit disponible
                </p>
              </Link>
            </div>
          </div>

          {/* Note */}
          <div className="mt-12 p-6 glass rounded-xl text-center">
            <p className="text-sm text-noah-muted">
              💡 <strong className="text-white">Note :</strong> Les paiements
              seront disponibles dans la V2 avec Stripe. Pour l'instant, cette
              page présente les offres à venir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}