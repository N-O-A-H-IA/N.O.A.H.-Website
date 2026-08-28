import { Navbar } from "@/components/Navbar";

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-4xl font-bold mb-3">Blog</h1>
          <p className="text-noah-muted mb-12">Les nouveautés et coulisses de N.O.A.H.</p>

          <div className="glass rounded-2xl p-12">
            <p className="text-noah-muted">
              Aucun article pour l'instant — reviens bientôt ! 📝
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}