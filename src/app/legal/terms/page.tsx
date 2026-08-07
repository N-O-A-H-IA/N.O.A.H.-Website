import { Navbar } from "@/components/Navbar";
import {
  Shield, CheckCircle2, AlertCircle, FileText, UserCheck,
  Lock, Scale, Clock, AlertTriangle, Ban, Eye, Database,
  MessageSquare, Bot, Zap, Globe, Flag, Mail, ShieldAlert,
  FileSearch, ListCheck, History, Server
} from "lucide-react";
import {
  tocItems,
  acceptanceItems,
  serviceDescriptionItems,
  accountItems,
  allowedItems,
  forbiddenItems,
  warningItems,
  intellectualPropertyItems,
  betaItems,
  liabilityItems,
  dataItems,
  securityThreatItems,
  exceptionalAccessItems,
  auditAgentItems,
  suspensionItems,
  lawItems,
  modificationItems,
} from "@/data/termsData";
import { SectionHeader } from "@/components/privacy/SectionHeader";
import { TableOfContents } from "@/components/privacy/TableOfContents";
import { InfoCard } from "@/components/privacy/InfoCard";
import { BoldText } from "@/components/BoldText";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-noah-black">
      <Navbar />

      {/* ===== Header ===== */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] to-transparent" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <FileText className="w-4 h-4 text-blue-400/70" />
            <span className="text-base text-white font-medium">Document légal</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-white">
            Conditions d'<span className="text-white/90">utilisation</span>
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto leading-relaxed">
            En utilisant <span className="font-bold text-white">N.O.A.H.</span>, vous acceptez les présentes conditions. <br />
            Veuillez les lire attentivement avant de créer un compte.
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
          <div className="bg-gradient-to-br from-blue-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-blue-500/50 border-y border-r border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-400/80" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  Bienvenue sur <span className="font-bold text-white">N.O.A.H.</span>
                </h2>
                <div className="space-y-4 text-white leading-relaxed text-base">
                  <p>
                    Les présentes Conditions d'Utilisation (ci-après les « Conditions ») régissent votre accès et votre utilisation de la plateforme <span className="font-bold text-white">N.O.A.H.</span> (Neural Operational Assistant Hub).
                  </p>
                  <p>
                    <span className="font-bold text-white">N.O.A.H.</span> est une plateforme d'intelligence artificielle conçue pour vous accompagner dans votre quotidien, vos études, vos projets et votre créativité. En créant un compte ou en utilisant le service, <span className="font-bold text-white">vous acceptez sans réserve les présentes Conditions</span>.
                  </p>
                  <p>
                    Si vous n'acceptez pas ces Conditions, <span className="font-bold text-white">vous ne devez pas utiliser le service</span>. <br /> 
                    Nous vous invitons à lire également notre Politique de confidentialité pour comprendre comment nous protégeons vos données.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Table des matières ===== */}
          <TableOfContents items={tocItems} />

          {/* ===== Section 1 : Acceptation ===== */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-emerald-500/50 border-y border-r border-white/10">
            <SectionHeader icon={CheckCircle2} number={1} title="Acceptation des conditions" color="emerald" id="acceptation" />
            <p className="text-white leading-relaxed mb-6 text-base">
              L'utilisation de <span className="font-bold text-white">N.O.A.H.</span> implique l'acceptation pleine et entière des présentes Conditions. <br />
              Voici les points essentiels à comprendre avant de commencer :
            </p>
            <div className="space-y-4">
              {acceptanceItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 2 : Description ===== */}
          <div className="bg-gradient-to-br from-blue-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-blue-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Bot} number={2} title="Description du service" color="blue" id="description" />
            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">N.O.A.H.</span> est une plateforme d'intelligence artificielle de nouvelle génération. <br />
              Découvrez ce que le service vous propose :
            </p>
            <div className="space-y-4">
              {serviceDescriptionItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 3 : Comptes ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={UserCheck} number={3} title="Comptes utilisateurs" color="violet" id="comptes" />
            <p className="text-white leading-relaxed mb-6 text-base">
              Votre compte <span className="font-bold text-white">N.O.A.H.</span> est personnel et vous engage à respecter certaines règles de sécurité et de responsabilité :
            </p>
            <div className="space-y-4">
              {accountItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 4 : Règles d'utilisation ===== */}
          <div className="bg-gradient-to-br from-emerald-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-emerald-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Shield} number={4} title="Règles d'utilisation" color="emerald" id="regles" />
            <p className="text-white leading-relaxed mb-6 text-base">
              Pour garantir une expérience sûre et respectueuse pour tous, <span className="font-bold text-white">N.O.A.H.</span> établit des règles claires d'utilisation. <br />
              Merci de les respecter scrupuleusement :
            </p>

            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
              Ce qui est autorisé
            </h3>
            <div className="space-y-4 mb-8">
              {allowedItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400/80" />
              Ce qui est strictement interdit
            </h3>
            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">Toute violation de ces règles peut entraîner la suspension ou la suppression définitive de votre compte</span>, sans préavis ni remboursement.
            </p>
            <div className="space-y-4 mb-8">
              {forbiddenItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400/80" />
              Avertissements importants
            </h3>
            <div className="space-y-4">
              {warningItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 5 : Propriété intellectuelle ===== */}
          <div className="bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-indigo-500/50 border-y border-r border-white/10">
            <SectionHeader icon={FileText} number={5} title="Propriété intellectuelle" color="indigo" id="propriete" />
            <p className="text-white leading-relaxed mb-6 text-base">
              La propriété intellectuelle est un sujet important. <br />
              Voici comment <span className="font-bold text-white">N.O.A.H.</span> protège ses droits et respecte les vôtres :
            </p>
            <div className="space-y-4">
              {intellectualPropertyItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 6 : Phase bêta ===== */}
          <div className="bg-gradient-to-br from-amber-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-amber-500/50 border-y border-r border-white/10">
            <SectionHeader icon={AlertTriangle} number={6} title="Phase bêta et limitations" color="amber" id="beta" />
            <div className="bg-amber-500/[0.05] rounded-2xl p-6 border border-amber-500/20 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Service en phase de développement</h3>
                  <p className="text-white text-base leading-relaxed">
                    <span className="font-bold text-white">N.O.A.H.</span> est actuellement en version bêta. <br />
                    Cela signifie que certaines fonctionnalités peuvent être instables, incomplètes ou sujettes à des modifications importantes. <br />
                    <span className="font-bold text-white">Merci de votre compréhension et de votre patience</span> pendant cette phase de développement.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {betaItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 7 : Responsabilité ===== */}
          <div className="bg-gradient-to-br from-rose-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-rose-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Scale} number={7} title="Responsabilité et garanties" color="rose" id="responsabilite" />
            <p className="text-white leading-relaxed mb-6 text-base">
              Il est important de comprendre les limites de notre responsabilité et les garanties que nous offrons. <br />
              <span className="font-bold text-white">Lisez attentivement cette section</span> :
            </p>
            <div className="space-y-4">
              {liabilityItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
            <div className="mt-6 bg-rose-500/[0.05] rounded-2xl p-6 border border-rose-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400/80 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Point important</h4>
                  <p className="text-base text-white leading-relaxed">
                    <span className="font-bold text-white">N.O.A.H.</span> est un outil d'aide à la décision, pas un substitut à l'expertise humaine. <br />
                    Pour toute décision importante (médicale, juridique, financière), <span className="font-bold text-white">consultez toujours un professionnel qualifié</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Section 8 : Données ===== */}
          <div className="bg-gradient-to-br from-cyan-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-cyan-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Database} number={8} title="Données et confidentialité" color="cyan" id="donnees" />
            <p className="text-white leading-relaxed mb-6 text-base">
              La protection de vos données est au cœur de notre approche. <br />
              Pour plus de détails, consultez notre <span className="font-bold text-white">Politique de confidentialité</span> complète.
            </p>
            <div className="space-y-4">
              {dataItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 9 : Sécurité et détection des menaces ===== */}
          <div className="bg-gradient-to-br from-orange-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-orange-500/50 border-y border-r border-white/10">
            <SectionHeader icon={ShieldAlert} number={9} title="Sécurité et détection des menaces" color="orange" id="securite-menaces" />
            <p className="text-white leading-relaxed mb-6 text-base">
              La sécurité responsable permet à <span className="font-bold text-white">N.O.A.H.</span> de protéger les utilisateurs, les données et l'infrastructure contre les abus, tout en garantissant une utilisation équitable et transparente.
            </p>
            <div className="space-y-4">
              {securityThreatItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 10 : Accès exceptionnels ===== */}
          <div className="bg-gradient-to-br from-rose-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-rose-500/50 border-y border-r border-white/10">
            <SectionHeader icon={FileSearch} number={10} title="Accès exceptionnels et conformité" color="rose" id="acces-exceptionnels" />
            <p className="text-white leading-relaxed mb-6 text-base">
              Dans certaines situations critiques, <span className="font-bold text-white">N.O.A.H.</span> doit pouvoir répondre aux obligations légales tout en protégeant les utilisateurs via le <span className="font-bold text-white">N.O.A.H. Exceptional Access System</span>.
            </p>
            <div className="space-y-4">
              {exceptionalAccessItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 11 : Audit et Agents ===== */}
          <div className="bg-gradient-to-br from-indigo-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-indigo-500/50 border-y border-r border-white/10">
            <SectionHeader icon={ListCheck} number={11} title="Audit, traçabilité et agents IA" color="indigo" id="audit-agents" />
            <p className="text-white leading-relaxed mb-6 text-base">
              Le système d'audit permet de surveiller toutes les actions importantes réalisées autour des données, garantissant une transparence totale et une amélioration continue de nos protections.
            </p>
            <div className="space-y-4">
              {auditAgentItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 12 : Suspension ===== */}
          <div className="bg-gradient-to-br from-red-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-red-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Ban} number={12} title="Suspension et résiliation" color="red" id="suspension" />
            <p className="text-white leading-relaxed mb-6 text-base">
              Dans certaines situations, <span className="font-bold text-white">N.O.A.H.</span> peut être amené à suspendre ou résilier un compte. <br />
              Voici les règles qui s'appliquent :
            </p>
            <div className="space-y-4">
              {suspensionItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 13 : Droit applicable ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Scale} number={13} title="Droit applicable et litiges" color="violet" id="droit" />
            <p className="text-white leading-relaxed mb-6 text-base">
              En cas de désaccord ou de litige, voici le cadre juridique qui s'applique :
            </p>
            <div className="space-y-4">
              {lawItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 14 : Modification ===== */}
          <div className="bg-gradient-to-br from-blue-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-blue-500/50 border-y border-r border-white/10">
            <SectionHeader icon={FileText} number={14} title="Modification des conditions" color="blue" id="modification" />
            <p className="text-white leading-relaxed mb-6 text-base">
              Nous pouvons être amenés à modifier ces Conditions pour refléter les évolutions du service ou les changements législatifs.
            </p>
            <div className="space-y-4">
              {modificationItems.map((item, index) => (
                <InfoCard key={index} {...item} />
              ))}
            </div>
          </div>

          {/* ===== Section 15 : Contact ===== */}
          <div className="bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-2xl p-8 border-l-4 border-violet-500/50 border-y border-r border-white/10">
            <SectionHeader icon={Mail} number={15} title="Contact" color="violet" id="contact" />
            <p className="text-white leading-relaxed mb-6 text-base">
              <span className="font-bold text-white">Si vous avez des questions concernant ces Conditions d'Utilisation, 
                n'hésitez pas à nous contacter :</span>
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
                      Pour toute question relative à ces conditions ou à l'utilisation du service :
                    </p>
                    <a href="mailto:legal@noah.ai" className="inline-flex items-center gap-2 text-base text-violet-400 hover:underline">
                      <Mail className="w-4 h-4" />
                      legal@noah.ai
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
                  Des questions sur nos conditions ?
                </h3>
                <p className="text-white mb-6 max-w-xl mx-auto leading-relaxed text-base">
                  Notre équipe juridique est à votre disposition pour répondre à toutes vos questions concernant ces conditions d'utilisation ou l'utilisation du service <span className="font-bold text-white">N.O.A.H.</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="mailto:legal@noah.ai" className="bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 px-6 py-3 rounded-xl font-medium text-white inline-flex items-center justify-center gap-2 transition">
                    <Mail className="w-4 h-4" />
                    legal@noah.ai
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