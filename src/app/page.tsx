import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { LogoAnimated } from "@/components/logo/LogoAnimated";
import { LogoStatic } from "@/components/logo/LogoStatic";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-noah-black">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-screen">
        <LogoAnimated size="xl" showText={true} className="mb-8" />
        
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white text-center mb-6">
          L'IA qui respecte votre vie privée
        </h1>
        <p className="text-white/70 text-xl text-center max-w-2xl mb-10">
          Découvrez N.O.A.H., l'assistant conversationnel nouvelle génération.
        </p>
        
        <div className="flex gap-4">
          <a href="/register" className="btn-primary px-8 py-3 rounded-xl font-medium text-white">
            Commencer gratuitement
          </a>
          <a href="/about" className="glass px-8 py-3 rounded-xl font-medium text-white">
            En savoir plus
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 px-6 border-t border-noah-border/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full glass text-xs text-noah-violet mb-4">
              FONCTIONNALITÉS
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Une IA pensée pour <span className="text-gradient">évoluer avec vous.</span>
            </h2>
            <p className="text-noah-muted text-lg">
              Tout ce dont vous avez besoin pour travailler, apprendre et créer, réuni dans une seule interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Carte 1 */}
            <div className="glass rounded-2xl p-7 hover:border-noah-violet/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-noah-blue/20 to-noah-violet/20 border border-noah-blue/30 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-noah-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Assistant intelligent</h3>
              <p className="text-noah-muted text-sm leading-relaxed">
                Discutez avec une IA capable de comprendre vos besoins, répondre avec précision et s'adapter à votre style.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="glass rounded-2xl p-7 hover:border-noah-violet/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-noah-violet/20 to-pink-500/20 border border-noah-violet/30 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-noah-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Agents IA</h3>
              <p className="text-noah-muted text-sm leading-relaxed">
                Des assistants spécialisés pour chaque domaine : études, développement, création, business et plus encore.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="glass rounded-2xl p-7 hover:border-noah-violet/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-noah-blue/20 to-cyan-500/20 border border-noah-blue/30 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold mb-2">Mémoire intelligente</h3>
              <p className="text-noah-muted text-sm leading-relaxed">
                Une IA qui apprend vos préférences, retient le contexte et personnalise chaque interaction au fil du temps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-noah-border/50 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="mb-4">
                <LogoStatic size="sm" showText={true} />
              </div>
              <p className="text-sm text-noah-muted max-w-xs">
                Neural Operational Assistant Hub. L'intelligence artificielle qui évolue avec vous.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-noah-muted">
                <li><a href="#" className="hover:text-white transition">Agents IA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-noah-muted">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-noah-muted">
                <li><a href="/about" className="hover:text-white transition">À propos</a></li>
                <li><a href="#" className="hover:text-white transition">Carrières</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-noah-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-noah-muted">© 2026 N.O.A.H. — Tous droits réservés.</p>
            <div className="flex items-center gap-6 text-xs text-noah-muted">
              <a href="/legal/privacy" className="hover:text-white transition">Confidentialité</a>
              <a href="/legal/terms" className="hover:text-white transition">Conditions</a>
              <a href="/legal/cookies" className="hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}