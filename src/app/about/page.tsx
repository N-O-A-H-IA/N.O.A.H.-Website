import { Navbar } from "@/components/Navbar";
import {
  Rocket, Target, Heart, Shield, Zap, Code2,
  Users, TrendingUp, Map, Lightbulb, Award,
  MessageSquare, Bot, Database, Lock, Eye,
  Mail, Calendar,
  CheckCircle2, Star, Sparkles, BookOpen,
  CreditCard, Globe,
} from "lucide-react";
import {
  tocItems,
  projectItems,
  storyItems,
  visionItems,
  valuesItems,
  architectureItems,
  featuresItems,
  roadmapItems,
  teamItems,
  statsItems,
  joinItems,
  contactItems,
} from "@/data/aboutData";
import { SectionHeader } from "@/components/privacy/SectionHeader";
import { TableOfContents } from "@/components/privacy/TableOfContents";
import { InfoCard } from "@/components/privacy/InfoCard";
import { BoldText } from "@/components/BoldText";
import { getTheme } from "@/utils/colors";
import { LogoAnimated } from "@/components/logo/LogoAnimated";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-noah-black">
      <Navbar />

      {/* ===== Header ===== */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <LogoAnimated size="lg" showText={false} />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-white">
            À propos de <span className="text-white/90">N.O.A.H.</span>
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            Découvrez l'histoire, la vision et les valeurs derrière <br />
            <span className="font-bold text-white">N.O.A.H.</span>, l'assistant IA qui place votre vie privée au cœur de chaque décision.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-base text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Fondé en 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span>Basé en France</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contenu principal ===== */}
      <section className="pb-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* ===== Introduction ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-6 h-6 text-violet-400/80" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Bienvenue dans l'univers <span className="font-bold text-white">N.O.A.H.</span>
                </h2>
                <div className="space-y-4 text-white leading-relaxed text-base">
                  <p>
                    <span className="font-bold text-white">N.O.A.H.</span> (Neural Operational Assistant Hub) est bien plus qu'un simple assistant IA. <br />
                    C'est une <span className="font-bold text-white">vision</span> : celle d'une intelligence artificielle puissante, accessible et respectueuse de la vie privée.
                  </p>
                  <p>
                    Dans un monde numérique où les données personnelles sont de plus en plus convoitées, <br />
                    <span className="font-bold text-white">N.O.A.H.</span> se dresse comme un rempart : <span className="font-bold text-white">votre vie privée n'est pas négociable</span>.
                  </p>
                  <p>
                    Cette page vous invite à découvrir notre histoire, nos valeurs, notre architecture technique <br />
                    et la feuille de route qui nous guidera dans les années à venir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Table des matières ===== */}
          <TableOfContents items={tocItems} />

          {/* ===== Section 1 : Le projet ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Rocket} number={1} title="Le projet N.O.A.H." color="violet" id="projet" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> est une plateforme d'intelligence artificielle conversationnelle <br />
              conçue pour être <span className="font-bold text-white">puissante, sécurisée et respectueuse de la vie privée</span>. <br />
              Découvrez ce qui rend ce projet unique :
            </p>

            <div className="space-y-4">
              {projectItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 2 : Histoire ===== */}
          <div className="bg-gradient-to-br from-blue-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-blue-500/50 border-y border-r border-white/10">
            <SectionHeader icon={BookOpen} number={2} title="L'histoire derrière N.O.A.H." color="blue" id="histoire" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Chaque grand projet naît d'une frustration, d'une vision ou d'une conviction. <br />
              Voici comment <span className="font-bold text-white">N.O.A.H.</span> a vu le jour :
            </p>

            <div className="space-y-4">
              {storyItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 3 : Vision ===== */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-emerald-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Eye} number={3} title="Notre vision et mission" color="emerald" id="vision" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Nous ne construisons pas seulement un produit. <br />
              Nous bâtissons un <span className="font-bold text-white">avenir numérique plus éthique</span>.
            </p>

            <div className="space-y-4">
              {visionItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 4 : Valeurs ===== */}
          <div className="bg-gradient-to-br from-rose-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-rose-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Heart} number={4} title="Les valeurs fondamentales" color="rose" id="valeurs" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Nos valeurs ne sont pas de simples mots sur un site web. <br />
              Elles guident <span className="font-bold text-white">chaque décision technique, éthique et commerciale</span> que nous prenons.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {valuesItems.map((item, index) => (
                <InfoCard key={index} {...item} subtitle={item.subtitle} />
              ))}
            </div>
          </div>

          {/* ===== Section 5 : Architecture ===== */}
          <div className="bg-gradient-to-br from-cyan-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-cyan-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Code2} number={5} title="Architecture technique" color="cyan" id="architecture" />

            <p className="text-white leading-relaxed mb-6 text-base">
              La robustesse de <span className="font-bold text-white">N.O.A.H.</span> repose sur une stack technique moderne et des choix architecturaux réfléchis. <br />
              Voici les piliers de notre infrastructure :
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {architectureItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 6 : Fonctionnalités ===== */}
          <div className="bg-gradient-to-br from-amber-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-amber-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Sparkles} number={6} title="Fonctionnalités clés" color="amber" id="fonctionnalites" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> propose une suite complète de fonctionnalités pensées pour l'efficacité et la confidentialité.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {featuresItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

                    {/* ===== Section 7 : Roadmap ===== */}
          <div className="bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-indigo-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Map} number={7} title="Feuille de route" color="indigo" id="roadmap" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Notre développement suit une feuille de route claire et transparente. <br />
              Voici les grandes phases de <span className="font-bold text-white">N.O.A.H.</span> :
            </p>

            <div className="space-y-4">
              {roadmapItems.map((item, index) => {
                const theme = getTheme(item.color);
                // Icônes selon le statut
                const statusIcons = {
                  completed: { icon: "✅", label: "Terminé", class: "text-emerald-400" },
                  current: { icon: "⏳", label: "En cours", class: "text-amber-400" },
                  upcoming: { icon: "⏰", label: "À venir", class: "text-red-400" },
                };
                const currentStatus = statusIcons[item.status];
                
                return (
                  <div key={index} className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <h4 className="font-semibold text-white text-lg">{item.phase}</h4>
                      <div className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-lg border ${theme.bg} ${theme.border} ${theme.text} font-semibold`}>
                        <span>{currentStatus.icon}</span>
                        <span>{currentStatus.label}</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {item.items.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-base text-white">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            item.status === "completed" ? "bg-emerald-500/20" : 
                            item.status === "current" ? "bg-amber-500/20" : 
                            item.status === "upcoming" ? "bg-red-500/20" : 
                            "bg-blue-500/20"
                          }`}>
                            {item.status === "completed" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : item.status === "current" ? (
                              <span className="text-amber-400 text-xs">⏳</span>
                            ) : (
                              <span className="text-blue-400 text-xs"></span>
                            )}
                          </div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== Section 8 : Équipe ===== */}
          <div className="bg-gradient-to-br from-pink-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-pink-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Users} number={8} title="L'équipe" color="pink" id="equipe" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Derrière <span className="font-bold text-white">N.O.A.H.</span>, il y a des humains passionnés. <br />
              Découvrez qui donne vie à ce projet :
            </p>

            <div className="space-y-4">
              {teamItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 9 : Chiffres ===== */}
          <div className="bg-gradient-to-br from-blue-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-blue-500/50 border-y border-r border-white/10">
            <SectionHeader icon={TrendingUp} number={9} title="N.O.A.H. en chiffres" color="blue" id="chiffres" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Quelques chiffres qui illustrent la croissance et l'engagement de notre communauté. <br />
              <span className="font-bold text-white">Ces chiffres évoluent chaque jour</span> :
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statsItems.map((item, index) => {
                const theme = getTheme(item.color);
                const Icon = item.icon;
                return (
                  <div key={index} className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-6 border border-white/10 text-center`}>
                    <div className={`w-12 h-12 rounded-xl ${theme.bg} ${theme.border} border flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`w-6 h-6 ${theme.text}`} />
                    </div>
                    <div className="font-display text-3xl font-bold text-white mb-1">{item.value}</div>
                    <div className="text-sm text-white/70">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== Section 10 : Rejoindre ===== */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-emerald-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Heart} number={10} title="Rejoindre l'aventure" color="emerald" id="rejoindre" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> est un projet vivant qui grandit avec sa communauté. <br />
              Que vous soyez développeur, rédacteur, testeur ou simplement passionné, il y a une place pour vous.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {joinItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>

            <div className="mt-6 bg-emerald-500/[0.05] rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-emerald-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Pourquoi contribuer à N.O.A.H. ?</h4>
                  <p className="text-base text-white leading-relaxed">
                    En rejoignant l'aventure <span className="font-bold text-white">N.O.A.H.</span>, vous participez à la construction d'une <br />
                    <span className="font-bold text-white">IA éthique et respectueuse</span>. Vous acquérez une expérience précieuse, <br />
                    rejoignez une communauté passionnée et contribuez à un projet qui a du sens.
                  </p>
                </div>
              </div>
            </div>
          </div>

                    {/* ===== Section 11 : Contact ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Mail} number={11} title="Contact" color="violet" id="contact" />

            <div className="flex flex-col items-center justify-center py-8 gap-6">
              <p className="text-white/80 text-lg text-center max-w-xl">
                Une question, une suggestion ou une envie de collaborer ?
              </p>
              
              <a
                href="/contact"
                className="inline-flex items-center gap-3 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all hover:shadow-lg hover:shadow-violet-500/20 group"
              >
                <Mail className="w-5 h-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
                Aller à la page de contact
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}