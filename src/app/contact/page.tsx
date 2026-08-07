"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SiX, SiGithub, SiDiscord, SiInstagram
 } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { 
  Mail, 
  MessageSquare, 
  Shield, 
  Send, 
  CheckCircle2, 
  Clock,
  AlertCircle
} from "lucide-react";

type CategoryKey = keyof typeof categoriesData;

// ✅ Structure de données définie en dehors du composant pour de meilleures performances
const categoriesData = {
  "support-technique": {
    label: "🛠️ Support Technique",
    description: "Un problème technique, un bug ou un souci d'utilisation du site",
    subcategories: {
      "bug": { label: "🐞 Bug / Erreur d'affichage", desc: "Un élément ne s'affiche pas correctement ou se comporte anormalement" },
      "connexion": { label: "🔑 Problème de connexion / Authentification", desc: "Impossible de se connecter, code de vérification non reçu, etc." },
      "performance": { label: "🐢 Lenteur / Problèmes de performance", desc: "Le site ou le chat met du temps à répondre" },
      "compatibilite": { label: "💻 Problème de compatibilité navigateur/appareil", desc: "Le site ne fonctionne pas bien sur ton navigateur ou ton appareil" },
      "installation": { label: "⚙️ Problème d'installation / Configuration", desc: "Difficulté à configurer ton compte ou tes paramètres" },
      "synchronisation": { label: "🔄 Problème de synchronisation des données", desc: "Tes conversations ou données ne se synchronisent pas entre appareils" },
      "export-import": { label: "📤 Export / Import de données", desc: "Souci pour exporter ou importer tes conversations/documents" },
      "notifications": { label: "🔔 Problème de notifications", desc: "Tu ne reçois pas (ou reçois trop) de notifications" },
      "mobile": { label: "📱 Problème sur l'application mobile", desc: "Bug spécifique à l'expérience mobile" },
      "autre-tech": { label: "❓ Autre problème technique", desc: "Un souci technique qui ne correspond à aucune catégorie ci-dessus" },
    },
  },

  "fonctionnalites": {
    label: "🤖 Fonctionnalités N.O.A.H.",
    description: "Une question ou un souci lié à l'utilisation de l'assistant IA",
    subcategories: {
      "agents-ia": { label: "🎯 Question sur les Agents IA", desc: "Comment utiliser ou configurer un agent spécialisé" },
      "nouvelle-feature": { label: "💡 Demande de nouvelle fonctionnalité", desc: "Tu as une idée pour améliorer N.O.A.H." },
      "analyse-documents": { label: "📄 Problème avec l'analyse de documents", desc: "L'IA n'analyse pas correctement un fichier envoyé" },
      "memoire": { label: "🧠 Gestion de la mémoire personnalisée", desc: "Question sur ce que N.O.A.H. retient de toi" },
      "mode-prive": { label: "🕶️ Question sur le mode conversation privée", desc: "Comment fonctionne la confidentialité d'une conversation" },
      "extensions": { label: "🧩 Utilisation des extensions", desc: "Problème ou question sur une extension installée" },
      "qualite-reponses": { label: "🎯 Qualité des réponses de l'IA", desc: "Une réponse te semble incorrecte ou inadaptée" },
      "voix": { label: "🎤 Fonctionnalité vocale", desc: "Question ou souci lié à la reconnaissance/synthèse vocale" },
      "historique": { label: "🗂️ Historique des conversations", desc: "Question sur la gestion de ton historique de discussions" },
    },
  },

  "securite": {
    label: "🔒 Sécurité & Confidentialité",
    description: "Un signalement ou une question liée à la protection de tes données",
    subcategories: {
      "signalement-danger": { label: "🚨 Signalement de contenu dangereux / malveillant", desc: "Tu as repéré un contenu problématique généré ou partagé" },
      "rgpd": { label: "📜 Question sur la protection des données (RGPD)", desc: "Question sur tes droits liés à tes données personnelles" },
      "suppression-donnees": { label: "🗑️ Demande de suppression de compte/données", desc: "Tu veux supprimer ton compte ou tes données" },
      "piratage-fraude": { label: "⚠️ Signalement de tentative de piratage / fraude", desc: "Tu penses que ton compte a été compromis" },
      "chiffrement": { label: "🔐 Question sur le chiffrement des données", desc: "Comment tes données sont-elles protégées techniquement" },
      "audit-securite": { label: "🕵️ Demande d'audit de sécurité", desc: "Requête spécifique liée à un audit ou une vérification" },
      "phishing": { label: "🎣 Signalement de tentative de phishing", desc: "Tu as reçu un email ou message suspect prétendant venir de N.O.A.H." },
      "usurpation": { label: "🎭 Usurpation d'identité", desc: "Quelqu'un utilise ton identité sans autorisation" },
    },
  },

  "compte-facturation": {
    label: "👤 Compte & Facturation",
    description: "Une question sur ton compte, ton abonnement ou un paiement",
    subcategories: {
      "creation-compte": { label: "✨ Création de compte", desc: "Difficulté à créer ton compte" },
      "mot-de-passe": { label: "🔓 Mot de passe oublié / Gestion du profil", desc: "Réinitialisation de mot de passe ou modification de profil" },
      "paiement": { label: "💳 Problème de paiement / Facturation", desc: "Un paiement a échoué ou une facture semble incorrecte" },
      "abonnement": { label: "📆 Modification ou résiliation d'abonnement", desc: "Tu veux changer ou annuler ton abonnement" },
      "plans": { label: "📊 Question sur les plans (Free, Plus, Pro, Ultimate)", desc: "Tu hésites entre plusieurs offres ou veux plus d'infos" },
      "remboursement": { label: "💸 Demande de remboursement", desc: "Tu souhaites être remboursé d'un paiement" },
      "facture": { label: "🧾 Demande de facture / justificatif", desc: "Tu as besoin d'un document comptable" },
      "changement-email": { label: "✉️ Changement d'adresse email", desc: "Tu veux mettre à jour l'email associé à ton compte" },
    },
  },

  "partenariats": {
    label: "🤝 Partenariats & Presse",
    description: "Une proposition professionnelle, une demande presse ou de collaboration",
    subcategories: {
      "partenariat": { label: "🤝 Proposition de partenariat", desc: "Tu représentes une entreprise ou organisation intéressée" },
      "presse": { label: "📰 Demande d'interview / Presse", desc: "Tu es journaliste ou créateur de contenu média" },
      "recrutement": { label: "💼 Offre d'emploi / Recrutement", desc: "Tu proposes une opportunité professionnelle" },
      "collaboration-dev": { label: "👨‍💻 Collaboration avec des développeurs", desc: "Tu souhaites contribuer techniquement au projet" },
      "sponsoring": { label: "🎪 Sponsoring / Événement", desc: "Proposition liée à un événement ou du sponsoring" },
      "affiliation": { label: "🔗 Programme d'affiliation", desc: "Question sur un éventuel programme d'affiliation" },
    },
  },

  "etudiants-education": {
    label: "🎓 Étudiants & Éducation",
    description: "Une question liée au programme étudiant ou à un usage pédagogique",
    subcategories: {
      "verification-statut": { label: "🪪 Vérification du statut étudiant", desc: "Problème lors de la validation de ta carte étudiante" },
      "offre-etablissement": { label: "🏫 Offre pour établissement scolaire", desc: "Tu représentes une école ou université intéressée" },
      "usage-pedagogique": { label: "📚 Question sur un usage pédagogique", desc: "Comment utiliser N.O.A.H. dans un contexte d'apprentissage" },
    },
  },

  "autre": {
    label: "💬 Autre",
    description: "Toute autre demande qui ne rentre pas dans les catégories ci-dessus",
    subcategories: {
      "feedback": { label: "⭐ Retour d'expérience général", desc: "Tu veux simplement partager ton avis sur N.O.A.H." },
      "suggestion-design": { label: "🎨 Suggestion sur le design / l'interface", desc: "Une idée pour améliorer l'apparence du site" },
      "traduction": { label: "🌍 Question de traduction / langue", desc: "Remarque sur une langue ou une traduction" },
      "autre-demande": { label: "❔ Autre demande non listée", desc: "Ta demande ne correspond à aucune catégorie existante" },
    },
  },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subcategory: "",
    importance: "moyenne", // Valeur par défaut
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // ✅ Réinitialise la sous-catégorie quand l'utilisateur change de catégorie principale
      if (name === "category") {
        newData.subcategory = ""; 
      }
      return newData;
    });
  };

  // ✅ Fonction d'envoi du formulaire (manquante dans ton extrait)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Brancher ici ton API d'envoi (ex: Supabase, Resend, ou Node.js)
    // await sendContactForm(formData);
    
    // Simulation d'envoi pour l'UX
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // ✅ Écran de succès après envoi
  if (submitted) {
    return (
      <main className="min-h-screen bg-noah-black">
        <Navbar />
        <section className="pt-32 pb-20 px-6 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-lg w-full glass rounded-2xl p-10 text-center border border-emerald-500/20 bg-emerald-500/[0.03]">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Message envoyé avec succès !
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Merci de nous avoir contactés. Notre équipe examine votre demande et vous répondra sous <span className="font-bold text-white">24 à 48 heures</span> à l'adresse <span className="font-bold text-emerald-400">{formData.email}</span>.
            </p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", email: "", category: "", subcategory: "", importance: "moyenne", message: "" });
              }}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition"
            >
              Envoyer un autre message
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ✅ Formulaire principal
  return (
    <main className="min-h-screen bg-noah-black">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header de la page */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
              <MessageSquare className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300 font-medium">Centre de contact</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Comment pouvons-nous <span className="text-gradient">vous aider ?</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Que ce soit pour une question technique, une demande de fonctionnalité ou un partenariat, 
              notre équipe est là pour vous. Nous nous engageons à répondre à <span className="font-bold text-white">toutes les demandes sous 48 heures</span>.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Colonne de gauche : Infos et Réseaux */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Carte Moyens de contact */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-violet-400" />
                  Moyens de contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">Support général</div>
                      <a href="mailto:contact@noah.ai" className="text-sm text-white/60 hover:text-violet-400 transition">contact@noah.ai</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">Sécurité & Confidentialité</div>
                      <a href="mailto:security@noah.ai" className="text-sm text-white/60 hover:text-violet-400 transition">security@noah.ai</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-1">Délai de réponse</div>
                      <p className="text-sm text-white/60">Lundi - Vendredi, <span className="font-bold text-white">sous 24h à 48h</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Réseaux Sociaux */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
                  Rejoignez la communauté
                </h3>
                <p className="text-sm text-white/60 mb-6 leading-relaxed">
                  Suivez les dernières mises à jour de <span className="font-bold text-white">N.O.A.H.</span>, participez aux discussions et obtenez de l'aide de la communauté.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#5865F2]/10 border border-white/10 hover:border-[#5865F2]/30 transition group">
                    <SiDiscord className="w-5 h-5 text-white/60 group-hover:text-[#5865F2] transition" />
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">Discord</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition group">
                    <SiGithub className="w-5 h-5 text-white/60 group-hover:text-white transition" />
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">GitHub</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#833ab4]/10 border border-white/10 hover:border-[#e1306c]/30 transition group">
                    <SiInstagram className="w-5 h-5 text-white/60 group-hover:text-[#e1306c] transition" />
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">Instagram</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#0A66C2]/10 border border-white/10 hover:border-[#0A66C2]/30 transition group">
                    <FaLinkedin className="w-5 h-5 text-white/60 group-hover:text-[#0A66C2] transition" />
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">LinkedIn</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#1DA1F2]/10 border border-white/10 hover:border-[#1DA1F2]/30 transition group">
                    <SiX className="w-5 h-5 text-white/60 group-hover:text-[#1DA1F2] transition" />
                    <span className="text-sm font-medium text-white/80 group-hover:text-white">X (Twitter)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Colonne de droite : Formulaire */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Send className="w-4 h-4 text-violet-400" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">Envoyez-nous un message</h3>
                </div>

                {/* Nom et Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Nom complet</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jean Dupont"
                      className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Adresse e-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="jean@exemple.com"
                      className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition"
                    />
                  </div>
                </div>

                {/* Catégorie principale - Affichage en cartes */}
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-3 block uppercase tracking-wider">
                    Catégorie principale
                  </label>
                  <div className="grid grid-cols-1 gap-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(categoriesData).map(([key, category]) => (
                      <label
                        key={key}
                        htmlFor={`cat-${key}`}
                        className={`flex items-start gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                          formData.category === key
                            ? "bg-violet-500/10 border-violet-500/50 ring-1 ring-violet-500/30"
                            : "bg-noah-panel border-white/10 hover:border-white/30 hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="radio"
                          id={`cat-${key}`}
                          name="category"
                          value={key}
                          checked={formData.category === key}
                          onChange={handleChange}
                          className="mt-1 accent-violet-500 w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-base mb-1.5 group-hover:text-violet-300 transition-colors leading-tight">
                            {category.label}
                          </div>
                          <div className="text-sm text-white/60 leading-relaxed">
                            {category.description}
                          </div>
                        </div>
                        {/* Indicateur visuel de sélection */}
                        {formData.category === key && (
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Affichage des sous-catégories sous forme de cartes */}
                {formData.category && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-white/70 mb-3 block uppercase tracking-wider">
                      Sous-catégorie (Précision)
                      <span className="text-white/50 font-normal ml-2">
                        - {categoriesData[formData.category as CategoryKey].description}
                      </span>
                    </label>
                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.entries(categoriesData[formData.category as CategoryKey].subcategories).map(([value, subcategory]) => (
                        <label
                          key={value}
                          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                            formData.subcategory === value
                              ? "bg-violet-500/10 border-violet-500/50 ring-1 ring-violet-500/30"
                              : "bg-noah-panel border-white/10 hover:border-white/30 hover:bg-white/5"
                          }`}
                        >
                          <input
                            type="radio"
                            name="subcategory"
                            value={value}
                            checked={formData.subcategory === value}
                            onChange={handleChange}
                            className="mt-1 accent-violet-500 w-4 h-4"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-white text-sm mb-1 group-hover:text-violet-300 transition-colors">
                              {subcategory.label}
                            </div>
                            <div className="text-xs text-white/60 leading-relaxed">
                              {subcategory.desc}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                

                {/* Niveau d'importance */}
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-3 block uppercase tracking-wider">Niveau d'importance</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: "faible", label: "🟢 Faible", desc: "Question générale, pas d'urgence" },
                      { value: "moyenne", label: "🟡 Moyenne", desc: "Problème bloquant, réponse sous 48h" },
                      { value: "elevee", label: "🔴 Élevée", desc: "Sécurité, compte bloqué, urgence" }
                    ].map((level) => (
                      <label
                        key={level.value}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.importance === level.value
                            ? "bg-violet-500/10 border-violet-500/50 ring-1 ring-violet-500/50"
                            : "bg-noah-panel border-noah-border hover:border-white/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="importance"
                          value={level.value}
                          checked={formData.importance === level.value}
                          onChange={handleChange}
                          className="mt-1 accent-violet-500"
                        />
                        <div>
                          <div className="font-semibold text-white text-sm">{level.label}</div>
                          <div className="text-xs text-white/60 mt-1">{level.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-white/70 mb-2 block uppercase tracking-wider">Votre message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Décrivez votre demande avec le plus de détails possible pour que nous puissions vous aider efficacement..."
                    className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition resize-none"
                  />
                  <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Pour les urgences de sécurité (Niveau 3-4), utilisez directement <a href="mailto:security@noah.ai" className="text-violet-400 hover:underline">security@noah.ai</a>.</span>
                  </div>
                </div>

                {/* Bouton d'envoi */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}