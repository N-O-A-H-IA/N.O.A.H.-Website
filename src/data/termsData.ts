import {
  Shield, CheckCircle2, AlertCircle, FileText, UserCheck,
  Lock, Scale, Clock, AlertTriangle, Ban, Eye, Database,
  MessageSquare, Bot, Zap, Globe, Flag, Mail, ShieldAlert,
  FileSearch, ListCheck, History, Server,
  type LucideIcon,
} from "lucide-react";

// ===== Types =====
export interface TocItem {
  num: number;
  label: string;
  id: string;
}

export interface TermsSectionItem {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  details: string[];
  color: string;
}

export interface RuleItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
  type: "allowed" | "forbidden" | "warning";
}

// ===== Table des matières =====
export const tocItems: TocItem[] = [
  { num: 1, label: "Acceptation des conditions", id: "acceptation" },
  { num: 2, label: "Description du service", id: "description" },
  { num: 3, label: "Comptes utilisateurs", id: "comptes" },
  { num: 4, label: "Règles d'utilisation", id: "regles" },
  { num: 5, label: "Propriété intellectuelle", id: "propriete" },
  { num: 6, label: "Phase bêta et limitations", id: "beta" },
  { num: 7, label: "Responsabilité et garanties", id: "responsabilite" },
  { num: 8, label: "Données et confidentialité", id: "donnees" },
  { num: 9, label: "Sécurité et détection des menaces", id: "securite-menaces" },
  { num: 10, label: "Accès exceptionnels et conformité", id: "acces-exceptionnels" },
  { num: 11, label: "Audit, traçabilité et agents IA", id: "audit-agents" },
  { num: 12, label: "Suspension et résiliation", id: "suspension" },
  { num: 13, label: "Droit applicable et litiges", id: "droit" },
  { num: 14, label: "Modification des conditions", id: "modification" },
  { num: 15, label: "Contact", id: "contact" },
];

// ===== Section 1 : Acceptation =====
export const acceptanceItems: TermsSectionItem[] = [
  {
    icon: CheckCircle2,
    title: "En créant un compte",
    color: "emerald",
    details: [
      "Vous reconnaissez avoir lu, compris et accepté les présentes conditions.",
      "**Vous acceptez d'être lié par ces conditions dans leur intégralité.**",
      "Si vous n'acceptez pas ces conditions, **vous ne devez pas utiliser le service**.",
    ],
  },
  {
    icon: UserCheck,
    title: "Capacité juridique",
    color: "emerald",
    details: [
      "**Vous devez avoir au moins 15 ans** pour utiliser **N.O.A.H.**",
      "Si vous avez entre 15 et 18 ans, **l'autorisation d'un titulaire de l'autorité parentale est requise**.",
      "En utilisant le service, vous déclarez respecter ces conditions d'âge et de capacité.",
    ],
  },
  {
    icon: FileText,
    title: "Documents complémentaires",
    color: "emerald",
    details: [
      "Ces conditions s'appliquent conjointement avec la **Politique de confidentialité**.",
      "Les règles spécifiques à chaque plan (Free, Plus, Pro, Ultimate) sont détaillées sur la page Tarifs.",
      "**Toute utilisation du service vaut acceptation implicite de l'ensemble de ces documents.**",
    ],
  },
];

// ===== Section 2 : Description =====
export const serviceDescriptionItems: TermsSectionItem[] = [
  {
    icon: Bot,
    title: "N.O.A.H. - Neural Operational Assistant Hub",
    color: "blue",
    details: [
      "**N.O.A.H.** est une **plateforme d'intelligence artificielle** proposant des assistants conversationnels avancés.",
      "Le service inclut : **conversations IA, gestion de documents, agents spécialisés, mémoire personnalisée**.",
      "**N.O.A.H.** est conçu pour **accompagner les utilisateurs dans leur quotidien, études, projets et créativité**.",
    ],
  },
  {
    icon: Zap,
    title: "Fonctionnalités principales",
    color: "blue",
    details: [
      "**Assistant conversationnel** : discussions naturelles avec une IA de pointe.",
      "**Gestion de documents** : analyse, synthèse et traitement sécurisé de fichiers.",
      "**Agents spécialisés** : assistants dédiés à des tâches ou domaines spécifiques.",
      "**Mémoire personnalisée** : l'IA apprend de vos préférences pour mieux vous servir.",
      "**Historique des conversations** : retrouvez et gérez vos échanges précédents.",
    ],
  },
  {
    icon: Globe,
    title: "Disponibilité du service",
    color: "blue",
    details: [
      "**N.O.A.H.** est accessible via **navigateur web** à l'adresse officielle du service.",
      "Nous nous efforçons de maintenir une **disponibilité de 99,9%**, mais des interruptions peuvent survenir.",
      "**Aucune garantie de disponibilité continue** n'est offerte, notamment pendant les opérations de maintenance planifiées ou d'urgence.",
    ],
  },
];

// ===== Section 3 : Comptes =====
export const accountItems: TermsSectionItem[] = [
  {
    icon: UserCheck,
    title: "Création et gestion de compte",
    color: "violet",
    details: [
      "Pour utiliser **N.O.A.H.**, vous devez **créer un compte avec une adresse email valide et unique**.",
      "Vous êtes **entièrement responsable de l'exactitude et de la mise à jour** des informations fournies.",
    ],
  },
  {
    icon: Lock,
    title: "Sécurité et confidentialité du compte",
    color: "violet",
    details: [
      "Vous êtes **seul responsable de la confidentialité de vos identifiants de connexion**.",
      "Nous vous recommandons vivement d'**activer l'authentification à deux facteurs (2FA)** pour une sécurité renforcée.",
      "En cas de suspicion de compromission, vous devez **changer immédiatement votre mot de passe** et nous contacter.",
    ],
  },
  {
    icon: AlertCircle,
    title: "Responsabilité des activités",
    color: "violet",
    details: [
      "Toute activité réalisée via votre compte **vous est intégralement imputable**.",
      "Vous devez **nous informer immédiatement** de toute utilisation non autorisée ou suspecte de votre compte.",
      "**N.O.A.H. ne saurait être tenu responsable** des dommages résultant d'une mauvaise sécurisation de votre compte de votre part.",
    ],
  },
];

// ===== Section 4 : Règles d'utilisation =====
export const allowedItems: RuleItem[] = [
  {
    icon: CheckCircle2,
    title: "Utilisation personnelle et professionnelle légitime",
    color: "emerald",
    type: "allowed",
    details: [
      "**Utilisation légitime** du service pour vos besoins personnels, éducatifs ou professionnels.",
      "**Création de contenu original** à l'aide de l'IA (textes, idées, analyses, code).",
      "**Partage responsable** des fonctionnalités et des sorties générées, dans le respect des droits d'auteur.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Respect de la communauté et du service",
    color: "emerald",
    type: "allowed",
    details: [
      "**Interactions respectueuses** avec le service, sans harcèlement ni langage haineux.",
      "**Signalement proactif des bugs** et problèmes rencontrés pour nous aider à améliorer **N.O.A.H.**",
      "**Respect strict des quotas** et des limites d'utilisation définis par votre plan d'abonnement.",
    ],
  },
];

export const forbiddenItems: RuleItem[] = [
  {
    icon: Ban,
    title: "Contenu illégal, dangereux ou nuisible",
    color: "red",
    type: "forbidden",
    details: [
      "**Génération de contenu illégal** : incitation à la haine, apologie du terrorisme, pédopornographie, violence.",
      "**Usurpation d'identité** ou création de contenu trompeur (deepfakes) visant à nuire ou frauder.",
      "**Diffusion de malware**, virus, ransomware ou tout code malveillant via le service.",
    ],
  },
  {
    icon: Ban,
    title: "Abus du système et contournement",
    color: "red",
    type: "forbidden",
    details: [
      "**Tentatives de contournement** des limitations techniques, des filtres de sécurité ou des quotas.",
      "**Utilisation automatisée non autorisée** (bots, scraping massif, API non officielle) sans accord écrit.",
      "**Tentatives d'accès non autorisé** (hacking) aux systèmes, comptes ou données d'autres utilisateurs ou de **N.O.A.H.**",
    ],
  },
  {
    icon: Ban,
    title: "Manipulation de l'IA (Prompt Injection)",
    color: "red",
    type: "forbidden",
    details: [
      "**Tentatives de manipulation** du modèle IA pour désactiver ses protections (jailbreaking).",
      "**Extraction d'informations sensibles** sur le fonctionnement interne, les prompts système ou l'architecture.",
      "**Reverse engineering**, décompilation ou analyse inverse du service.",
    ],
  },
];

export const warningItems: RuleItem[] = [
  {
    icon: AlertTriangle,
    title: "Vérification et utilisation à vos risques",
    color: "amber",
    type: "warning",
    details: [
      "**Vérifiez toujours les informations** générées par l'IA avant de les utiliser dans un contexte critique ou professionnel.",
      "**N.O.A.H. peut produire des erreurs** (hallucinations) : ne prenez pas de décisions importantes (médicales, juridiques, financières) sans vérification humaine.",
      "**Ne partagez jamais d'informations hautement sensibles** (mots de passe, données bancaires, secrets industriels) dans vos conversations.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limites inhérentes à l'Intelligence Artificielle",
    color: "amber",
    type: "warning",
    details: [
      "**N.O.A.H. n'est pas un professionnel** (médecin, avocat, conseiller financier) et ne remplace pas un expert humain.",
      "Les réponses de l'IA **ne constituent pas un avis professionnel, médical ou juridique**.",
      "En cas de doute, **consultez toujours un expert qualifié** dans le domaine concerné.",
    ],
  },
];

// ===== Section 5 : Propriété intellectuelle =====
export const intellectualPropertyItems: TermsSectionItem[] = [
  {
    icon: FileText,
    title: "Propriété exclusive de N.O.A.H.",
    color: "indigo",
    details: [
      "**L'ensemble du service (code source, design, logo, marque, interface) est la propriété exclusive de N.O.A.H.**",
      "**Les agents IA, algorithmes, modèles de langage et architectures** sont protégés par le droit d'auteur et les secrets commerciaux.",
      "Toute **reproduction, distribution, copie ou exploitation** non autorisée est strictement interdite et passible de poursuites.",
    ],
  },
  {
    icon: FileText,
    title: "Contenu généré par l'utilisateur",
    color: "indigo",
    details: [
      "**Vous conservez l'intégralité de vos droits** sur le contenu original et les données que vous importez dans **N.O.A.H.**",
      "En utilisant le service, vous accordez à **N.O.A.H.** une **licence limitée, mondiale et révocable** uniquement pour héberger, traiter et afficher ce contenu afin de fournir le service.",
      "**N.O.A.H. ne revendique aucun droit de propriété** sur vos créations personnelles ou professionnelles.",
    ],
  },
  {
    icon: FileText,
    title: "Contenu généré par l'IA",
    color: "indigo",
    details: [
      "Le contenu produit par l'IA peut être utilisé librement dans le cadre de votre abonnement, y compris à des fins commerciales si votre plan le permet.",
      "**N.O.A.H. ne garantit pas l'originalité absolue** du contenu généré (risque de similitudes fortuites avec des œuvres existantes).",
      "Vous êtes **seul responsable de l'utilisation que vous faites** du contenu généré et devez vous assurer qu'il ne viole pas les droits de tiers.",
    ],
  },
];

// ===== Section 6 : Phase bêta =====
export const betaItems: TermsSectionItem[] = [
  {
    icon: AlertTriangle,
    title: "Nature de la version bêta",
    color: "amber",
    details: [
      "**N.O.A.H.** est actuellement en **phase de développement avancé (bêta)**.",
      "Certaines fonctionnalités peuvent être **instables, incomplètes, expérimentales ou sujettes à des modifications** majeures sans préavis.",
      "**Des bugs, erreurs de calcul, hallucinations ou interruptions de service** peuvent survenir.",
    ],
  },
  {
    icon: Clock,
    title: "Évolutions et modifications du service",
    color: "amber",
    details: [
      "Nous nous réservons le droit de **modifier, ajouter, déprécier ou supprimer** des fonctionnalités à tout moment.",
      "Les **tarifs, les limites d'utilisation et les quotas** peuvent évoluer entre la version bêta et la version finale stable.",
      "Les utilisateurs bêta bénéficient d'**avantages spéciaux et d'un accès prioritaire** en reconnaissance de leur participation et de leurs retours.",
    ],
  },
  {
    icon: Eye,
    title: "Retour d'expérience et amélioration",
    color: "amber",
    details: [
      "Nous encourageons vivement les utilisateurs à **signaler les bugs, les biais ou les problèmes** rencontrés.",
      "Vos retours contribuent directement à **améliorer la sécurité et la qualité du service** pour tous.",
      "Des données d'utilisation **strictement anonymisées et agrégées** peuvent être utilisées pour améliorer les performances des modèles.",
    ],
  },
];

// ===== Section 7 : Responsabilité =====
export const liabilityItems: TermsSectionItem[] = [
  {
    icon: Scale,
    title: "Limitation de responsabilité",
    color: "rose",
    details: [
      "**N.O.A.H.** est fourni **\"en l'état\" (\"as is\")** et \"selon disponibilité\", sans garantie explicite ou implicite d'aucune sorte.",
      "**Nous ne saurions être tenus responsables** des dommages indirects, spéciaux, consécutifs ou des pertes de profits découlant de l'utilisation du service.",
      "Dans les limites autorisées par la loi, notre responsabilité financière est **strictement limitée au montant total payé** par l'utilisateur au cours des 12 derniers mois.",
    ],
  },
  {
    icon: AlertCircle,
    title: "Exclusions de garantie",
    color: "rose",
    details: [
      "Nous ne garantissons pas que le service sera **ininterrompu, totalement sécurisé, exempt de virus ou d'erreurs**.",
      "Nous ne garantissons pas **l'exactitude, la fiabilité, l'exhaustivité ou la légalité** des réponses générées par l'IA.",
      "**L'utilisation du service et la confiance accordée aux sorties de l'IA se font à vos propres risques et périls.**",
    ],
  },
  {
    icon: Shield,
    title: "Indemnisation",
    color: "rose",
    details: [
      "Vous acceptez de **nous indemniser et nous tenir indemnes** contre tout recours, plainte ou demande résultant de votre violation des présentes conditions.",
      "**Cela inclut les frais juridiques raisonnables et les dommages engagés par N.O.A.H.** du fait de votre utilisation abusive ou illégale.",
      "Cette obligation d'indemnisation **survit à la résiliation ou à la suppression** de votre compte.",
    ],
  },
];

// ===== Section 8 : Données =====
export const dataItems: TermsSectionItem[] = [
  {
    icon: Database,
    title: "Traitement et protection des données",
    color: "cyan",
    details: [
      "Vos données sont traitées conformément à notre **Politique de confidentialité**, qui fait partie intégrante des présentes conditions.",
      "Nous déployons des **mesures de sécurité techniques et organisationnelles de pointe** (chiffrement, contrôle d'accès) pour protéger vos informations.",
      "Vous pouvez **exercer vos droits** (accès, rectification, portabilité, suppression) à tout moment via votre tableau de bord.",
    ],
  },
  {
    icon: MessageSquare,
    title: "Conversations et confidentialité",
    color: "cyan",
    details: [
      "Vos conversations et documents sont **chiffrés et sécurisés** selon notre architecture *Privacy by Design*.",
      "**Nous ne vendons, ne louons, ni ne partageons vos données personnelles** à des fins commerciales ou publicitaires.",
      "Certaines données **anonymisées et dépersonnalisées** peuvent être utilisées pour améliorer les performances et la sécurité du service.",
    ],
  },
];

// ===== Section 9 : Sécurité et détection des menaces =====
export const securityThreatItems: TermsSectionItem[] = [
  {
    icon: ShieldAlert,
    title: "N.O.A.H. Threat Detection Engine",
    color: "orange",
    details: [
      "Le système analyse automatiquement les messages, les prompts et les actions pour **détecter les comportements à risque**.",
      "Il évalue : **le contexte complet, l'objectif recherché, le niveau de risque potentiel** et l'historique du compte.",
      "Types de menaces détectées : **tentatives de fraude, extorsion, contournement des protections, exploitation du système**.",
    ],
  },
  {
    icon: Ban,
    title: "Blocage automatique et rapport de sécurité",
    color: "orange",
    details: [
      "Lorsqu'un message est détecté comme dangereux, **N.O.A.H. bloque automatiquement son traitement** pour éviter toute action nuisible.",
      "Un **N.O.A.H. Security Report** est généré automatiquement (identifiant, date, catégorie du risque, score de confiance).",
      "L'utilisateur reçoit une **notification immédiate** avec l'identifiant du signalement (#NOAH-SECURITY-XXXXXX).",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Niveaux de suspicion et sanctions",
    color: "orange",
    details: [
      "**Niveaux 0-1 (Conforme/Surveillance)** : Message traité normalement ou avec analyse discrète.",
      "**Niveau 2 (Suspect)** : Message temporairement bloqué, création d'un rapport et analyse approfondie.",
      "**Niveaux 3-4 (Dangereux/Critique)** : **Blocage immédiat, signalement prioritaire, validation humaine obligatoire** et suspension possible du compte.",
    ],
  },
];

// ===== Section 10 : Accès exceptionnels =====
export const exceptionalAccessItems: TermsSectionItem[] = [
  {
    icon: FileSearch,
    title: "N.O.A.H. Exceptional Access System",
    color: "rose",
    details: [
      "Un accès exceptionnel aux données n'est envisagé que pour : **menace grave, activité criminelle détectée, réquisition judiciaire ou danger imminent.**",
      "**Conditions obligatoires** : autorisation légale valide, validation interne par des responsables autorisés, justification précise.",
      "**Accès strictement limité** dans le temps et aux informations absolument nécessaires à l'enquête.",
    ],
  },
  {
    icon: ListCheck,
    title: "Procédure d'accès et traçabilité",
    color: "rose",
    details: [
      "1. Réception de la demande et **vérification juridique stricte**.",
      "2. **Validation par les responsables autorisés** de N.O.A.H.",
      "3. Définition des données nécessaires et mise en place d'un **accès exceptionnel sécurisé**.",
      "4. **Création obligatoire d'un rapport d'audit** complet et immuable.",
    ],
  },
  {
    icon: Eye,
    title: "Notification et protection de l'utilisateur",
    color: "rose",
    details: [
      "**Sauf interdiction explicite de l'autorité judiciaire** (secret de l'enquête), nous notifions l'utilisateur concerné.",
      "L'utilisateur est informé de la **nature des données transmises** et de l'autorité requérante.",
      "Même en cas de signalement, **les données personnelles restent protégées** et seules les informations strictement nécessaires sont communiquées.",
    ],
  },
];

// ===== Section 11 : Audit et Agents =====
export const auditAgentItems: TermsSectionItem[] = [
  {
    icon: ListCheck,
    title: "N.O.A.H. Audit System",
    color: "indigo",
    details: [
      "Le système enregistre de manière immuable et sécurisée : **accès aux données, consultations humaines exceptionnelles, actions des agents IA**.",
      "Il trace également les **modifications importantes des paramètres et l'utilisation des permissions**.",
      "Objectif : Garantir une **transparence totale** des décisions de sécurité et permettre l'analyse post-incident.",
    ],
  },
  {
    icon: Bot,
    title: "Sécurité des agents intelligents",
    color: "indigo",
    details: [
      "Chaque agent spécialisé fonctionne dans un **environnement contrôlé avec des permissions définies** et des limites d'action strictes.",
      "Avant une action importante (ex: modification de projet), une **vérification des autorisations et une validation utilisateur** sont requises.",
      "Toutes les actions des agents sont **enregistrées dans les logs de sécurité**.",
    ],
  },
  {
    icon: Server,
    title: "Sauvegarde et récupération sécurisée",
    color: "indigo",
    details: [
      "Le **N.O.A.H. Secure Backup System** protège la mémoire utilisateur, les documents importants et les configurations.",
      "En cas d'incident, une **restauration sécurisée** vers une version précédente est possible.",
      "Les sauvegardes sont **chiffrées et stockées séparément** des données de production.",
    ],
  },
];

// ===== Section 12 : Suspension =====
export const suspensionItems: TermsSectionItem[] = [
  {
    icon: AlertTriangle,
    title: "Motifs de suspension ou de résiliation",
    color: "red",
    details: [
      "**Violation des présentes conditions** d'utilisation ou de la Politique de confidentialité.",
      "**Activité frauduleuse, illégale, abusive ou nuisible** détectée sur votre compte.",
      "**Non-paiement** des sommes dues à l'échéance (pour les plans payants).",
      "**Demande motivée des autorités légales** ou judiciaires compétentes.",
    ],
  },
  {
    icon: Clock,
    title: "Processus de suspension",
    color: "red",
    details: [
      "Sauf urgence ou danger imminent, nous vous **notifions préalablement** de la suspension envisagée.",
      "Vous disposez d'un **délai raisonnable pour contester** la décision ou corriger la situation.",
      "En cas de violation grave (niveau de suspicion 3 ou 4), la suspension peut être **immédiate, sans préavis et sans remboursement**.",
    ],
  },
  {
    icon: Ban,
    title: "Résiliation à l'initiative de l'utilisateur",
    color: "red",
    details: [
      "Vous pouvez **supprimer votre compte à tout moment** directement depuis votre profil.",
      "La suppression devient **définitive après un délai de rétractation de 30 jours**.",
      "Passé ce délai, les données sont **supprimées de nos serveurs** conformément à notre politique de conservation.",
    ],
  },
];

// ===== Section 13 : Droit applicable =====
export const lawItems: TermsSectionItem[] = [
  {
    icon: Scale,
    title: "Droit applicable",
    color: "violet",
    details: [
      "Les présentes conditions sont régies et interprétées conformément au **droit français**.",
      "En cas de litige, et à défaut de résolution amiable, les **tribunaux de Paris** seront seuls compétents.",
      "Nous privilégions toutefois toujours **une résolution amiable et de bonne foi** avant toute action judiciaire.",
    ],
  },
  {
    icon: Flag,
    title: "Médiation et réclamations",
    color: "violet",
    details: [
      "En cas de désaccord persistant, vous pouvez saisir gratuitement un **médiateur de la consommation** compétent.",
      "Nous nous engageons à **répondre dans un délai de 30 jours** à toute réclamation formelle.",
      "Vous conservez le droit inaliénable de saisir la **CNIL** pour toute question relative à la protection de vos données personnelles.",
    ],
  },
];

// ===== Section 14 : Modification =====
export const modificationItems: TermsSectionItem[] = [
  {
    icon: FileText,
    title: "Droit de modification",
    color: "blue",
    details: [
      "Nous nous réservons le droit de **modifier ces conditions à tout moment** pour refléter les évolutions du service ou de la loi.",
      "Les modifications importantes vous seront **notifiées par email et via une bannière dans l'application au moins 30 jours avant** leur application.",
      "**L'utilisation continue du service** après la date d'entrée en vigueur vaut acceptation pleine et entière des nouvelles conditions.",
    ],
  },
  {
    icon: Clock,
    title: "Entrée en vigueur et historique",
    color: "blue",
    details: [
      "La **date de dernière mise à jour** est clairement indiquée en haut de ce document.",
      "Les conditions précédentes restent applicables aux **utilisations et faits antérieurs** à la modification.",
      "Vous pouvez **consulter l'historique des versions** précédentes sur simple demande à notre équipe juridique.",
    ],
  },
];