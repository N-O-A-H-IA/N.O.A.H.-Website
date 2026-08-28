import { Navbar } from "@/components/Navbar";

export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-8">Politique de cookies</h1>
          <div className="glass rounded-2xl p-8 space-y-4 text-sm text-noah-muted leading-relaxed">
            <p>Dernière mise à jour : [date]</p>
            {/* TODO: lister les cookies réellement utilisés (Supabase auth, etc.) */}
            <p>
              N.O.A.H. utilise des cookies essentiels au fonctionnement du site
              (connexion utilisateur via Supabase). Aucun cookie publicitaire n'est utilisé.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}