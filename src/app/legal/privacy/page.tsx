import { Navbar } from "@/components/Navbar";
import {
  Shield, Database, Mail, Lock, Eye, UserCheck, Server, Clock,
  AlertCircle, CheckCircle2, FileText, Globe, Trash2, Download,
  CreditCard, MessageSquare, Fingerprint, Smartphone, UserX, XCircle,
  Key, BarChart3, Bell, Scale, Cookie, RefreshCw, Heart,
  Baby, Flag, Building2, FileCheck, Gavel,
  ShieldAlert, Ban, TriangleAlert, FileSearch, ListChecks, History,
  type LucideIcon,
} from "lucide-react";
import {
privacyArchitectureItems,
  securityEngineItems,
  suspicionLevelsItems,
  exceptionalAccessItems,
  externalReportingItems,
  auditSystemItems,
  tocItems,
  accountData,
  usageDataList,
  preferencesData,
  notCollectedData,
  usageItems,
  partnerItems,
  securityItems,
  rightItems,
  retentionItems,
  cookieItems,
  minorItems,
  transferItems,
  modificationItems,
} from "@/data/privacyData";
import { SectionHeader } from "@/components/privacy/SectionHeader";
import { TableOfContents } from "@/components/privacy/TableOfContents";
import { InfoCard, InfoCardCompact } from "@/components/privacy/InfoCard";
import { NotCollectedCard } from "@/components/privacy/NotCollectedCard";
import { BoldText } from "@/components/BoldText";
import { getTheme } from "@/utils/colors";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-noah-black">
      <Navbar />

      {/* ===== Header ===== */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <Shield className="w-4 h-4 text-violet-400/70" />
            <span className="text-base text-white font-medium">Document légal</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-white">
            Politique de <span className="text-white/90">confidentialité</span>
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto leading-relaxed">
            Chez <span className="font-bold text-white">N.O.A.H.</span>, votre vie privée n'est pas une option. <br />
            Ce document détaille de manière exhaustive comment nous protégeons vos données.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-base text-white/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Dernière mise à jour : 4 août 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Version 1.0</span>
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
                <Shield className="w-6 h-6 text-violet-400/80" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Notre engagement de confidentialité
                </h2>
                <div className="space-y-4 text-white leading-relaxed text-base">
                  <p>
                    Chez <span className="font-bold text-white">N.O.A.H.</span>, nous croyons que la confidentialité est un droit fondamental,
                    non négociable. <br /> 
                    Cette politique de confidentialité a été rédigée avec une transparence totale 
                    pour vous expliquer exactement quelles données nous collectons, pourquoi nous les collectons,
                    comment nous les utilisons, et surtout quelles données nous ne collectons <span className="font-bold text-white">jamais</span>.
                  </p>
                  <p>
                    <span className="font-bold text-white">N.O.A.H.</span> (Neural Operational Assistant Hub) est conçu dès le départ 
                    avec une philosophie de <span className="font-bold text-white">privacy-first</span> : chaque fonctionnalité est 
                    évaluée à travers le prisme de la protection de vos données personnelles. <br />
                    Nous ne vendons, ne louons, ni ne partageons vos données à des fins commerciales. <br />
                    Votre confiance est notre actif le plus précieux.
                  </p>
                  <p>
                    Ce document s'applique à tous les utilisateurs de <span className="font-bold text-white">N.O.A.H.</span>,
                    qu'ils utilisent la version gratuite ou l'une de nos offres payantes. <br />
                    Les mêmes standards de protection s'appliquent à tous, sans distinction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Table des matières ===== */}
          <TableOfContents items={tocItems} />

          {/* ===== Section 1 : Données collectées ===== */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-emerald-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Database} number={1} title="Données que nous collectons" color="emerald" id="donnees-collectees" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> collecte uniquement les données strictement nécessaires 
              au fonctionnement du service. <br />
              Chaque donnée collectée a une finalité précise et légitime. <br />
              Voici la liste exhaustive des données que nous sommes amenés à collecter :
            </p>

            {/* Données de compte */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-5 h-5 text-emerald-400/80" />
                <h3 className="font-semibold text-white text-lg">Données de compte</h3>
              </div>
              <p className="text-white text-base mb-4 leading-relaxed">
                Lors de votre inscription sur <span className="font-bold text-white">N.O.A.H.</span>,
                nous collectons les informations suivantes pour créer et gérer votre compte :
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {accountData.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
                    <div className="flex items-start gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/70 flex-shrink-0 mt-0.5" />
                      <div className="font-medium text-white text-base">{item.label}</div>
                    </div>
                    <div className="text-sm text-white/90 leading-relaxed ml-6 space-y-0.5">
                      {item.desc.map((line, idx) => (
                        <p key={idx}><BoldText text={line} /></p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Données d'utilisation */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-400/80" />
                <h3 className="font-semibold text-white text-lg">Données d'utilisation</h3>
              </div>
              <p className="text-white text-base mb-4 leading-relaxed">
                Lorsque vous utilisez <span className="font-bold text-white">N.O.A.H.</span>,
                certaines données sont générées automatiquement pour assurer le bon fonctionnement du service :
              </p>
              <ul className="space-y-2">
                {usageDataList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-white text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400/70 flex-shrink-0 mt-0.5" />
                    <span><BoldText text={item} /></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Préférences */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-rose-400/80" />
                <h3 className="font-semibold text-white text-lg">Préférences utilisateur</h3>
              </div>
              <p className="text-white text-base mb-4 leading-relaxed">
                Pour personnaliser votre expérience sur <span className="font-bold text-white">N.O.A.H.</span>,
                nous pouvons collecter :
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {preferencesData.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
                    <div className="flex items-start gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/70 flex-shrink-0 mt-0.5" />
                      <div className="font-medium text-white text-base">{item.label}</div>
                    </div>
                    <div className="text-sm text-white/90 leading-relaxed ml-6">
                      {item.desc.map((line, idx) => <p key={idx}><BoldText text={line} /></p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Section 2 : Données NON collectées ===== */}
          <div className="bg-gradient-to-br from-red-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-red-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Shield} number={2} title="Ce que nous NE collectons PAS" color="red" id="donnees-non-collectees" />

            <div className="bg-red-500/[0.05] rounded-2xl p-6 border border-red-500/20 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Notre promesse de confidentialité</h3>
                  <p className="text-white text-base leading-relaxed">
                    Chez <span className="font-bold text-white">N.O.A.H.</span>, nous croyons en la transparence totale. <br />
                    Voici la liste exhaustive des données que nous ne collectons <span className="font-bold text-white">jamais</span>,
                    sous aucune circonstance. <br />
                    Chaque point ci-dessous est garanti contractuellement :
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {notCollectedData.map((item, index) => (
                <NotCollectedCard key={index} {...item} color="red" />
              ))}
            </div>
          </div>

          {/* ===== Section 3 : Utilisation ===== */}
          <div className="bg-gradient-to-br from-blue-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-blue-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Eye} number={3} title="Comment nous utilisons vos données" color="blue" id="utilisation" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Les données collectées par <span className="font-bold text-white">N.O.A.H.</span> sont utilisées exclusivement 
              pour les finalités suivantes. <br />
              Nous ne détournons jamais vos données à d'autres fins :
            </p>

            <div className="space-y-4">
              {usageItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 4 : Partage avec des tiers ===== */}
          <div className="bg-gradient-to-br from-amber-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-amber-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Globe} number={4} title="Partage avec des tiers" color="amber" id="partage-tiers" />

            <div className="bg-emerald-500/[0.05] rounded-2xl p-6 border border-emerald-500/20 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Notre engagement fondamental</h3>
                  <p className="text-white text-base leading-relaxed">
                    <span className="font-bold text-white">N.O.A.H.</span> ne vend, ne loue, ni ne partage vos données personnelles 
                    à des fins commerciales avec des tiers. <br />
                    Vos données vous appartiennent, point final.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-white leading-relaxed mb-6 text-base">
              Cependant, pour faire fonctionner le service, nous devons partager certaines données 
              avec des partenaires techniques de confiance. Ces partenaires sont strictement sélectionnés 
              et contractualisés pour protéger vos données :
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {partnerItems.map((item, index) => (
                <InfoCardCompact key={index} title="" {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 5 : Sécurité ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Lock} number={5} title="Sécurité et protection" color="violet" id="securite" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> met en œuvre des mesures de sécurité robustes et <br />
              multi-couches pour protéger vos données contre les accès non autorisés, la perte ou la divulgation :
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {securityItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 6 : Vos droits ===== */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-emerald-500/50 border-y border-r border-white/10">
            <SectionHeader icon={UserCheck} number={6} title="Vos droits" color="emerald" id="vos-droits" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">Conformément au RGPD (Règlement Général sur la Protection des Données) 
              et aux lois françaises sur la protection des données, </span>
              vous disposez des droits suivants sur vos données personnelles :
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {rightItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>

            <div className="mt-6 bg-violet-500/[0.05] rounded-2xl p-6 border border-violet-500/20">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-violet-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Exercer vos droits</h4>
                  <p className="text-base text-white leading-relaxed">
                    Pour exercer l'un de ces droits, contactez-nous à{" "}
                    <a href="mailto:privacy@noah.ai" className="text-violet-400 font-medium hover:underline">
                      privacy@noah.ai
                    </a>{" "}
                    ou via notre formulaire de contact. <br />
                    Nous répondrons dans un délai maximum de 30 jours. <br />
                    L'exercice de ces droits est gratuit et ne nécessite aucune justification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Section 7 : Conservation ===== */}
          <div className="bg-gradient-to-br from-cyan-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-cyan-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Clock} number={7} title="Conservation des données" color="cyan" id="conservation" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> conserve vos données uniquement aussi longtemps que 
              nécessaire pour les finalités pour lesquelles elles ont été collectées. <br />
              Voici nos durées de conservation :
            </p>

            <div className="space-y-4">
              {retentionItems.map((item, index) => {
                const theme = getTheme(item.color);
                return (
                  <div key={index} className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                    <div className={`inline-block px-3 py-1 rounded-lg border text-sm font-semibold mb-4 ${theme.bg} ${theme.border} ${theme.text}`}>
                      <BoldText text={item.duration} />
                    </div>
                    <ul className="space-y-2">
                      {item.items.map((dataPoint, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-base text-white">
                          <Clock className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
                          <span><BoldText text={dataPoint} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== Section 8 : Cookies ===== */}
          <div className="bg-gradient-to-br from-amber-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-amber-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Cookie} number={8} title="Cookies et technologies similaires" color="amber" id="cookies" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> utilise uniquement des cookies essentiels au 
              fonctionnement du service. <br />
              Nous n'utilisons aucun cookie à des fins publicitaires ou de tracking marketing :
            </p>

            <div className="space-y-4">
              {cookieItems.map((item, index) => {
                const theme = getTheme(item.color);
                return (
                  <div key={index} className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white text-lg">{item.name}</h4>
                      <div className={`text-sm px-3 py-1 rounded border ${theme.bg} ${theme.border} ${theme.text}`}>{item.duration}</div>
                    </div>
                    <p className="text-base text-white mb-3">{item.purpose}</p>
                    <div className="space-y-1">
                      {item.details.map((line, idx) => (
                        <p key={idx} className="text-base text-white leading-relaxed"><BoldText text={line} /></p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 bg-emerald-500/[0.05] rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Pas de cookies publicitaires</h4>
                  <p className="text-base text-white leading-relaxed">
                    <span className="font-bold text-white">N.O.A.H.</span> n'utilise aucun cookie de tracking publicitaire, 
                    de réseaux sociaux, ou d'analyse marketing. <br />
                    Votre navigation reste privée. <br />
                    Nous ne partageons aucune donnée avec des régies publicitaires ou des plateformes de tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Section 9 : Mineurs ===== */}
          <div className="bg-gradient-to-br from-pink-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-pink-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Shield} number={9} title="Protection des mineurs" color="pink" id="mineurs" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> accorde une attention particulière à la protection
              des mineurs. <br />
              Notre service n'est pas destiné <span className="font-bold text-white">aux enfants de moins de 15 ans</span>, conformément à la législation française et au RGPD.
            </p>

            <div className="space-y-4">
              {minorItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 10 : Transferts internationaux ===== */}
          <div className="bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-indigo-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Globe} number={10} title="Transferts internationaux de données" color="indigo" id="transferts" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> est hébergé principalement en Europe,
              mais certains de nos partenaires techniques peuvent traiter des données en dehors de l'Union Européenne. <br />
              Voici comment nous garantissons la protection de vos données dans ce contexte :
            </p>

            <div className="space-y-4">
              {transferItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 11 : Modifications ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={RefreshCw} number={11} title="Modifications de cette politique" color="violet" id="modifications" />

            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> peut être amené à modifier cette politique de
              confidentialité pour refléter les évolutions de notre service, 
              les changements législatifs ou les nouvelles bonnes pratiques en matière de protection des données.
            </p>

            <div className="space-y-4">
              {modificationItems.map((item, index) => (
                <InfoCard key={index} icon={item.icon} title={item.title} details={item.desc} color={item.color} />
              ))}
            </div>
          </div>

          {/* ===== Section 12 : Architecture de confidentialité ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Lock} number={12} title="Architecture de confidentialité et chiffrement" color="violet" id="architecture-confidentialite" />

            <p className="text-white leading-relaxed mb-6 text-base">
              L'architecture <span className="font-bold text-white">N.O.A.H. Privacy Architecture</span> constitue le cœur du système de protection. <br />
              Son objectif est de créer un environnement où <span className="font-bold text-white">N.O.A.H.</span> reste puissant tout en garantissant un niveau maximal de confidentialité, 
              selon une approche <span className="font-bold text-white">Privacy by Design</span>.
            </p>

            <div className="space-y-4">
              {privacyArchitectureItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 13 : Sécurité responsable ===== */}
          <div className="bg-gradient-to-br from-orange-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-orange-500/50 border-y border-r border-white/10">
            <SectionHeader icon={ShieldAlert} number={13} title="Sécurité responsable et détection des menaces" color="orange" id="securite-responsable" />

            <p className="text-white leading-relaxed mb-6 text-base">
              La sécurité responsable permet à <span className="font-bold text-white">N.O.A.H.</span> de protéger les utilisateurs, 
              les données et l'infrastructure contre les abus, tout en limitant les erreurs de détection et en garantissant 
              une intervention humaine pour les cas graves.
            </p>

            <div className="space-y-4 mb-8">
              {securityEngineItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-400/80" />
              Niveaux de suspicion et sanctions
            </h3>
            <p className="text-white leading-relaxed mb-6 text-base">
              Le système utilise plusieurs niveaux afin d'adapter la réponse au niveau réel de danger, 
              allant du traitement normal au bannissement définitif.
            </p>

            <div className="space-y-4">
              {suspicionLevelsItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 14 : Accès exceptionnels ===== */}
          <div className="bg-gradient-to-br from-rose-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-rose-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Gavel} number={14} title="Accès exceptionnels et réquisitions judiciaires" color="rose" id="acces-exceptionnels" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Dans certaines situations critiques, <span className="font-bold text-white">N.O.A.H.</span> doit pouvoir répondre aux obligations légales 
              tout en protégeant les utilisateurs. <br />
              Le <span className="font-bold text-white">N.O.A.H. Exceptional Access System</span> encadre strictement ces accès.
            </p>

            <div className="space-y-4">
              {exceptionalAccessItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 15 : Signalement externe ===== */}
          <div className="bg-gradient-to-br from-red-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-red-500/50 border-y border-r border-white/10">
            <SectionHeader icon={TriangleAlert} number={15} title="Signalement externe des menaces graves" color="red" id="signalement-externe" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Dans les situations représentant une menace importante pour des personnes, des infrastructures 
              ou la sécurité publique, <span className="font-bold text-white">N.O.A.H. pourra déclencher une procédure de signalement externe conformément aux obligations légales applicables.</span>
            </p>

            <div className="space-y-4">
              {externalReportingItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 16 : Audit et traçabilité ===== */}
          <div className="bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-indigo-500/50 border-y border-r border-white/10">
            <SectionHeader icon={ListChecks} number={16} title="Audit complet et traçabilité" color="indigo" id="audit-tracabilite" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Le système d'audit permet de surveiller toutes les actions importantes réalisées autour des données, 
              garantissant une transparence totale et une amélioration continue de nos protections.
            </p>

            <div className="space-y-4">
              {auditSystemItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>

            <div className="mt-6 bg-indigo-500/[0.05] rounded-2xl p-6 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Vision long terme : Une IA de confiance</h4>
                  <p className="text-base text-white leading-relaxed">
                    L'objectif final de <span className="font-bold text-white">N.O.A.H.</span> est de créer une intelligence artificielle capable d'être 
                    <span className="font-bold text-white"> puissante, sécurisée, transparente et digne de confiance</span>. <br />
                    Chaque action sera traçable, les interventions humaines resteront <span className="font-bold text-white">exceptionnelles</span>, 
                    et les utilisateurs <span className="font-bold text-white">garderont le contrôle total sur leur vie privée.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Section 17 : Contact ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Mail} number={17} title="Contact et autorité de contrôle" color="violet" id="contact" />

            <p className="text-white leading-relaxed mb-6 text-base">
              Si vous avez des questions concernant cette politique de confidentialité 
              ou si vous souhaitez exercer vos droits, vous pouvez nous contacter directement. <br />
              Vous avez également la possibilité de saisir l'autorité de contrôle compétente.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-violet-400/80" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Nous contacter</h4>
                    <p className="text-base text-white leading-relaxed mb-3">
                      Pour toute question relative à cette politique ou à l'utilisation de vos données :
                    </p>
                    <a href="mailto:privacy@noah.ai" className="inline-flex items-center gap-2 text-base text-violet-400 hover:underline">
                      <Mail className="w-4 h-4" />
                      privacy@noah.ai
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Flag className="w-5 h-5 text-blue-400/80" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Autorité de contrôle</h4>
                    <p className="text-base text-white leading-relaxed mb-3">
                      Vous pouvez également saisir la CNIL (Commission Nationale de l'Informatique et des Libertés) :
                    </p>
                    <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base text-blue-400 hover:underline">
                      <Globe className="w-4 h-4" />
                      www.cnil.fr
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-violet-500/[0.05] rounded-2xl p-6 border border-violet-500/20">
              <div className="text-center">
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Des questions sur votre vie privée ?
                </h3>
                <p className="text-white mb-6 max-w-xl mx-auto leading-relaxed text-base">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions concernant cette politique de 
                  confidentialité ou l'utilisation de vos données par <span className="font-bold text-white">N.O.A.H.</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="mailto:privacy@noah.ai" className="bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 px-6 py-3 rounded-xl font-medium text-white inline-flex items-center justify-center gap-2 transition">
                    <Mail className="w-4 h-4" />
                    privacy@noah.ai
                  </a>
                  <a href="/contact" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl font-medium text-white inline-flex items-center justify-center gap-2 transition">
                    Formulaire de contact
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}