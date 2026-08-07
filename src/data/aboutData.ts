import {
  Rocket, Target, Heart, Shield, Zap, Code2,
  Users, TrendingUp, Map, Lightbulb, Award,
  MessageSquare, Bot, Database, Lock, Eye,
  Mail, Calendar,
  CheckCircle2, Star, Sparkles, BookOpen, Globe, // <-- Globe ajouté ici
  type LucideIcon,
  CreditCard,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

// ===== Types =====
export interface TocItem {
  num: number;
  label: string;
  id: string;
}

export interface AboutSectionItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface ValueItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  details: string[];
  color: string;
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface RoadmapItem {
  phase: string;
  status: "completed" | "current" | "upcoming";
  color: string;
  items: string[];
}

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}

// ===== Table des matières =====
export const tocItems: TocItem[] = [
  { num: 1, label: "Le projet N.O.A.H.", id: "projet" },
  { num: 2, label: "L'histoire derrière N.O.A.H.", id: "histoire" },
  { num: 3, label: "Notre vision et mission", id: "vision" },
  { num: 4, label: "Les valeurs fondamentales", id: "valeurs" },
  { num: 5, label: "Architecture technique", id: "architecture" },
  { num: 6, label: "Fonctionnalités clés", id: "fonctionnalites" },
  { num: 7, label: "Feuille de route", id: "roadmap" },
  { num: 8, label: "L'équipe", id: "equipe" },
  { num: 9, label: "N.O.A.H. en chiffres", id: "chiffres" },
  { num: 10, label: "Rejoindre l'aventure", id: "rejoindre" },
  { num: 11, label: "Contact", id: "contact" },
];

// ===== Section 1 : Le projet =====
export const projectItems: AboutSectionItem[] = [
  {
    icon: Rocket,
    title: "Une plateforme d'IA nouvelle génération",
    color: "violet",
    details: [
      "**N.O.A.H. (Neural Operational Assistant Hub)** est une plateforme d'intelligence artificielle conversationnelle conçue pour être **puissante, sécurisée et respectueuse de la vie privée**.",
      "Contrairement aux assistants IA classiques, **N.O.A.H.** met l'utilisateur au centre de chaque décision technique et éthique.",
      "Le service propose des **conversations avancées, des agents spécialisés, une mémoire personnalisée et une gestion intelligente des documents**.",
    ],
  },
  {
    icon: Target,
    title: "Un projet ambitieux et indépendant",
    color: "violet",
    details: [
      "**N.O.A.H.** est un projet indépendant, développé avec passion et une vision claire : **démocratiser l'accès à une IA de qualité**.",
      "Nous refusons le modèle de la surveillance de masse et de la monétisation des données personnelles.",
      "Notre ambition : **devenir la référence européenne** en matière d'assistant IA éthique et transparent.",
    ],
  },
  {
    icon: Sparkles,
    title: "Pourquoi le nom N.O.A.H. ?",
    color: "violet",
    details: [
      "Le nom **N.O.A.H.** fait référence à l'arche de Noé : un **havre de sécurité** dans un monde numérique de plus en plus chaotique.",
      "Chaque lettre représente nos piliers : **N**eural, **O**perational, **A**ssistant, **H**ub.",
      "Notre mission : **protéger vos données** tout en vous offrant une expérience IA exceptionnelle.",
    ],
  },
];

// ===== Section 2 : Histoire =====
export const storyItems: AboutSectionItem[] = [
  {
    icon: Lightbulb,
    title: "La genèse du projet (Juillet 2026)",
    color: "blue",
    details: [
      "**N.O.A.H.** est né de la frustration de son créateur, **FrozerYTB**, étudiant passionné d'informatique et d'intelligence artificielle.",
      "Constatant que la plupart des assistants IA **collectaient massivement les données** sans transparence, il a décidé de créer une alternative.",
      "L'idée : **un assistant IA aussi puissant que les géants du secteur, mais avec une éthique irréprochable**.",
    ],
  },
  {
    icon: Code2,
    title: "Les premiers mois de développement",
    color: "blue",
    details: [
      "Le développement a commencé en **solitaire**, avec une stack moderne : **Next.js, TypeScript, Supabase et OpenAI**.",
      "Les premières versions étaient rudimentaires mais posaient déjà les bases : **chiffrement, contrôle utilisateur, transparence**.",
      "Chaque ligne de code était guidée par une question : **« Est-ce que cela respecte la vie privée de l'utilisateur ? »**",
    ],
  },
  {
    icon: TrendingUp,
    title: "L'évolution vers la V1 (2025-2026)",
    color: "blue",
    details: [
      "Après des mois d'itérations, **N.O.A.H.** est entré en phase **bêta publique** avec un système de plans (Free, Student, Plus, Pro, Ultimate).",
      "Des fonctionnalités avancées ont vu le jour : **agents spécialisés, mémoire contextuelle, mode conversation privée, système de sécurité multi-niveaux**.",
      "Aujourd'hui, **N.O.A.H.** continue d'évoluer avec une communauté grandissante et une feuille de route ambitieuse.",
    ],
  },
];

// ===== Section 3 : Vision =====
export const visionItems: AboutSectionItem[] = [
  {
    icon: Eye,
    title: "Notre vision à long terme",
    color: "emerald",
    details: [
      "Nous imaginons un futur où **l'intelligence artificielle est un partenaire de confiance**, pas un outil de surveillance.",
      "**N.O.A.H.** aspire à devenir **la plateforme IA de référence en Europe**, reconnue pour son éthique et sa transparence.",
      "Notre objectif : **prouver qu'on peut construire une IA puissante sans sacrifier la vie privée**.",
    ],
  },
  {
    icon: Heart,
    title: "Notre mission au quotidien",
    color: "emerald",
    details: [
      "**Rendre l'IA accessible** à tous, étudiants comme professionnels, avec des tarifs justes et transparents.",
      "**Éduquer les utilisateurs** sur les enjeux de la protection des données et de l'éthique numérique.",
      "**Innover constamment** pour offrir une expérience toujours plus riche, tout en restant fidèles à nos valeurs.",
    ],
  },
  {
    icon: Star,
    title: "Ce qui nous différencie",
    color: "emerald",
    details: [
      "**Privacy by Design** : la confidentialité n'est pas une option, c'est le fondement de chaque fonctionnalité.",
      "**Transparence totale** : nos politiques, notre code de sécurité et nos pratiques sont documentés publiquement.",
      "**Indépendance** : nous ne sommes pas liés aux géants du web et prenons nos décisions en toute autonomie.",
    ],
  },
];

// ===== Section 4 : Valeurs =====
export const valuesItems: ValueItem[] = [
  {
    icon: Shield,
    title: "Confidentialité absolue",
    subtitle: "Vos données vous appartiennent",
    color: "violet",
    details: [
      "**Nous ne vendons jamais vos données.** Jamais. Sous aucune circonstance.",
      "Chiffrement de bout en bout, **Row Level Security**, et architecture **Privacy by Design**.",
      "Vous pouvez **supprimer votre compte et toutes vos données** à tout moment, sans justification.",
    ],
  },
  {
    icon: Lock,
    title: "Sécurité sans compromis",
    subtitle: "Protection multi-couches",
    color: "red",
    details: [
      "**Threat Detection Engine** pour analyser les comportements à risque.",
      "**Niveaux de suspicion (0 à 4)** pour adapter la réponse à la gravité réelle.",
      "**Audit System** immuable pour tracer chaque action et garantir la transparence.",
    ],
  },
  {
    icon: Zap,
    title: "Innovation continue",
    subtitle: "Toujours à la pointe",
    color: "amber",
    details: [
      "Nous intégrons les **dernières avancées en IA** (modèles de langage, agents autonomes).",
      "Notre **roadmap publique** permet à la communauté de suivre et influencer les évolutions.",
      "Les utilisateurs **bêta** bénéficient d'un accès prioritaire aux nouvelles fonctionnalités.",
    ],
  },
  {
    icon: Users,
    title: "Accessibilité pour tous",
    subtitle: "Une IA pour chacun",
    color: "emerald",
    details: [
      "**Plan Free généreux** pour permettre à tous de découvrir **N.O.A.H.**",
      "**Tarif étudiant** à partir de 4,99€/mois pour accompagner les jeunes dans leur apprentissage.",
      "Interface intuitive, **documentation complète** et support réactif.",
    ],
  },
  {
    icon: BookOpen,
    title: "Transparence radicale",
    subtitle: "Rien à cacher",
    color: "blue",
    details: [
      "Nos **politiques de confidentialité et conditions d'utilisation** sont publiques et détaillées.",
      "Nous publions régulièrement des **rapports de transparence** sur l'utilisation des données.",
      "Notre **code de sécurité** est audité et documenté pour une confiance totale.",
    ],
  },
  {
    icon: Award,
    title: "Excellence technique",
    subtitle: "La qualité avant tout",
    color: "indigo",
    details: [
      "Stack moderne : **Next.js 14, TypeScript, Supabase, OpenAI, Vercel**.",
      "**Disponibilité cible de 99,9%** avec sauvegardes quotidiennes chiffrées.",
      "Tests rigoureux, **revues de code** et amélioration continue des performances.",
    ],
  },
];

// ===== Section 5 : Architecture =====
export const architectureItems: AboutSectionItem[] = [
  {
    icon: Bot,
    title: "Intelligence Artificielle : OpenAI",
    color: "violet",
    details: [
      "Intégration des **modèles GPT les plus avancés** via l'API OpenAI.",
      "**Conformité API** : OpenAI ne stocke pas vos données pour l'entraînement.",
      "Système d'**agents spécialisés** pour des tâches spécifiques (analyse, code, rédaction).",
    ],
  },
  {
    icon: Lock,
    title: "Sécurité : N.O.A.H. Security System",
    color: "red",
    details: [
      "**Threat Detection Engine** : analyse en temps réel des comportements à risque.",
      "**Exceptional Access System** : procédure stricte pour les réquisitions judiciaires.",
      "**Audit System** : traçabilité immuable de toutes les actions sensibles.",
    ],
  },
    {
    icon: CreditCard,
    title: "Paiements : Stripe & PayPal",
    color: "blue",
    details: [
      "**Stripe** pour des transactions sécurisées et conformes **PCI-DSS Level 1**.",
      "**PayPal** pour une alternative de paiement rapide, sécurisée et universellement reconnue.",
      "Nous **ne voyons jamais vos données bancaires** (ni sur Stripe, ni sur PayPal).",
      "Gestion automatique des abonnements, factures et remboursements.",
    ],
  },
];

// ===== Section 6 : Fonctionnalités =====
export const featuresItems: FeatureItem[] = [
  {
    icon: MessageSquare,
    title: "Conversations IA avancées",
    color: "violet",
    details: [
      "Discussions naturelles avec un **IA de pointe**, capable de comprendre le contexte complexe.",
      "**Historique complet** de vos conversations, consultable et exportable à tout moment.",
      "**Mode conversation privée** pour les échanges sensibles (non utilisés pour l'amélioration de l'IA).",
    ],
  },
  {
    icon: Bot,
    title: "Agents spécialisés",
    color: "blue",
    details: [
      "Des **agents IA dédiés** à des tâches spécifiques : code, rédaction, analyse, recherche.",
      "Chaque agent fonctionne dans un **environnement contrôlé** avec des permissions définies.",
      "Possibilité de **créer vos propres agents** personnalisés (plans Pro et Ultimate).",
    ],
  },
  {
    icon: Database,
    title: "Gestion de documents",
    color: "emerald",
    details: [
      "**Analyse intelligente** de vos documents (PDF, Word, images, code).",
      "**Extraction d'informations** et synthèse automatique.",
      "**Stockage sécurisé** avec chiffrement de bout en bout.",
    ],
  },
  {
    icon: Heart,
    title: "Mémoire personnalisée",
    color: "rose",
    details: [
      "**N.O.A.H. apprend de vos préférences** pour mieux vous servir au fil du temps.",
      "Vous garnez le **contrôle total** : vous pouvez voir, modifier ou supprimer la mémoire à tout moment.",
      "**Transparence totale** : le système explique clairement ce qu'il retient et pourquoi.",
    ],
  },
  {
    icon: Shield,
    title: "Sécurité multi-niveaux",
    color: "red",
    details: [
      "**4 niveaux de suspicion** (0 à 4) pour adapter la réponse aux menaces réelles.",
      "**Validation humaine obligatoire** pour les cas critiques (niveau 3-4).",
      "**Signalement externe** uniquement dans les situations de danger grave et avéré.",
    ],
  },
  {
    icon: Users,
    title: "Plans adaptés à tous",
    color: "amber",
    details: [
      "**Free** : 50 messages/jour pour découvrir N.O.A.H.",
      "**Student** : 4,99€/mois avec vérification du statut étudiant.",
      "**Plus, Pro, Ultimate** : pour les utilisateurs réguliers et professionnels exigeants.",
    ],
  },
];

// ===== Section 7 : Roadmap =====
export const roadmapItems: RoadmapItem[] = [
  {
    phase: "Phase 1 - Fondation (2026)",
    status: "current",
    color: "amber",
    items: [
      "Lancement de la première version de N.O.A.H.",
      "Système d'authentification sécurisé",
      "Conversations IA de base avec OpenAI",
      "Interface utilisateur moderne et responsive",
      "Politique de confidentialité et CGU",
    ],
  },
  {
    phase: "Phase 2 - Bêta publique (2027)",
    status: "upcoming",
    color: "red",
    items: [
      "Système de plans (Free, Student, Plus, Pro, Ultimate)",
      "Intégration Stripe et PayPal pour les paiements",
      "Agents spécialisés (code, rédaction, analyse)",
      "Gestion de documents et analyse de fichiers",
      "Mémoire personnalisée et mode conversation privée",
    ],
  },
  {
    phase: "Phase 3 - Sécurité avancée (2028)",
    status: "upcoming",
    color: "red",
    items: [
      "Threat Detection Engine complet",
      "Niveaux de suspicion et sanctions automatisées",
      "Exceptional Access System pour les réquisitions",
      "Audit System et traçabilité complète",
      "Authentification 2FA obligatoire",
    ],
  },
  {
    phase: "Phase 4 - Expansion (2029)",
    status: "upcoming",
    color: "red",
    items: [
      "Application mobile native (iOS & Android)",
      "API publique pour les développeurs",
      "Marketplace d'agents créés par la communauté",
      "Support multi-langues avancé",
      "Intégrations avec outils professionnels (Slack, Notion, etc.)",
    ],
  },
  {
    phase: "Phase 5 - Vision long terme (2030+)",
    status: "upcoming",
    color: "red",
    items: [
      "IA autonome avec capacité de raisonnement avancé",
      "Système multi-agents collaboratifs",
      "Personnalisation poussée par apprentissage fédéré",
      "Expansion internationale avec serveurs locaux",
      "Fondation N.O.A.H. pour l'éthique en IA",
    ],
  },
];

// ===== Section 8 : Équipe =====
export const teamItems: AboutSectionItem[] = [
  {
    icon: Users,
    title: "FrozerYTB - Fondateur & Développeur principal",
    color: "violet",
    details: [
      "**Étudiant passionné** d'informatique et d'intelligence artificielle.",
      "Développeur **full-stack** avec une expertise en Next.js, TypeScript et architectures sécurisées.",
      "Convaincu que **la technologie doit servir l'humain**, pas l'inverse.",
    ],
  },
  {
    icon: Heart,
    title: "Notre approche collaborative",
    color: "emerald",
    details: [
      "Bien que développé initialement en solo, **N.O.A.H.** s'ouvre progressivement à la collaboration.",
      "Nous recherchons des **contributeurs passionnés** : développeurs, designers, rédacteurs, testeurs.",
      "La **communauté** est au cœur de notre développement : vos retours façonnent le produit.",
    ],
  },
  {
    icon: Star,
    title: "Rejoindre l'équipe",
    color: "amber",
    details: [
      "Nous recrutons régulièrement des **bénévoles et stagiaires** motivés par notre vision.",
      "Consultez la section **« Rejoindre l'aventure »** pour découvrir les opportunités.",
      "Même sans compétences techniques, vous pouvez contribuer : **traduction, documentation, support**.",
    ],
  },
];

// ===== Section 9 : Chiffres =====
export const statsItems: StatItem[] = [
  {
    icon: Users,
    value: "0+",
    label: "Utilisateurs inscrits",
    color: "blue",
  },
  {
    icon: MessageSquare,
    value: "0+",
    label: "Messages échangés",
    color: "violet",
  },
  {
    icon: Bot,
    value: "0+",
    label: "Agents spécialisés",
    color: "emerald",
  },
  {
    icon: Star,
    value: "0/10",
    label: "Satisfaction utilisateur",
    color: "amber",
  },
  {
    icon: Shield,
    value: "0",
    label: "Fuites de données",
    color: "red",
  },
  {
    icon: Calendar,
    value: "0 ans",
    label: "De développement actif",
    color: "cyan",
  },
];

// ===== Section 10 : Rejoindre =====
export const joinItems: AboutSectionItem[] = [
  {
    icon: Code2,
    title: "Développeurs",
    color: "blue",
    details: [
      "Nous cherchons des développeurs **React/Next.js, Python, ou en sécurité informatique**.",
      "Contribuez à notre **codebase open-source** (certaines parties) ou rejoignez l'équipe core.",
      "Stack : **Next.js, TypeScript, Supabase, OpenAI, Tailwind CSS**.",
    ],
  },
  {
    icon: BookOpen,
    title: "Rédacteurs & Traducteurs",
    color: "emerald",
    details: [
      "Aidez-nous à **documenter N.O.A.H.** et à traduire l'interface en plusieurs langues.",
      "Rédigez des **tutoriels, articles de blog** ou guides d'utilisation.",
      "Participez à notre **programme de traduction communautaire**.",
    ],
  },
  {
    icon: Users,
    title: "Testeurs & Bêta-testeurs",
    color: "amber",
    details: [
      "Testez les **nouvelles fonctionnalités** avant leur sortie officielle.",
      "Fournissez des **retours détaillés** pour améliorer l'expérience.",
      "Accès **prioritaire** aux plans payants en échange de votre contribution.",
    ],
  },
  {
    icon: Heart,
    title: "Ambassadeurs",
    color: "rose",
    details: [
      "Faites connaître **N.O.A.H.** autour de vous et dans votre réseau.",
      "Programme d'**affiliation** en cours de développement.",
      "Rejoignez notre **communauté Discord** pour échanger avec d'autres passionnés.",
    ],
  },
];

// ===== Section 11 : Contact =====
export const contactItems: AboutSectionItem[] = [
  {
    icon: Mail,
    title: "Nous contacter directement",
    color: "violet",
    details: [
      "**Email général** : contact@noah.ai",
      "**Support technique** : support@noah.ai",
      "**Sécurité & Confidentialité** : security@noah.ai",
      "**Presse & Partenariats** : press@noah.ai",
    ],
  },
];