import {
  Shield, Database, Mail, Lock, Eye, UserCheck, Server, Clock,
  AlertCircle, CheckCircle2, FileText, Globe, Trash2, Download,
  CreditCard, MessageSquare, Fingerprint, Smartphone, UserX, XCircle,
  Key, BarChart3, Bell, Scale, Cookie, RefreshCw, Heart,
  Baby, Flag, Building2, FileCheck,
  TriangleAlert, // au lieu de AlertTriangle
  ShieldAlert,
  Ban,
  FileSearch,
  ListCheck, // au lieu de ListChecks
  History,
  type LucideIcon,
} from "lucide-react";

// ===== Types =====
export interface TocItem {
  num: number;
  label: string;
  id: string;
}

export interface DataItem {
  label: string;
  desc: string[];
}

export interface NotCollectedItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  details: string[];
  items: string[];
}

export interface UsageItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface PartnerItem {
  icon: LucideIcon;
  name: string;
  role: string;
  details: string[];
  color: string;
}

export interface SecurityItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface RightItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface RetentionItem {
  duration: string;
  color: string;
  items: string[];
}

export interface CookieItem {
  name: string;
  purpose: string;
  duration: string;
  details: string[];
  color: string;
}

export interface MinorItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface TransferItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface ModificationItem {
  icon: LucideIcon;
  title: string;
  desc: string[];
  color: string;
}

export interface ExceptionalAccessItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface ThreatProcessItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface ExternalReportingItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

export interface AuditItem {
  icon: LucideIcon;
  title: string;
  details: string[];
  color: string;
}

// ===== Table des matières =====
export const tocItems: TocItem[] = [
  // --- Partie Légale Standard (RGPD) ---
  { num: 1, label: "Données que nous collectons", id: "donnees-collectees" },
  { num: 2, label: "Ce que nous NE collectons PAS", id: "donnees-non-collectees" },
  { num: 3, label: "Comment nous utilisons vos données", id: "utilisation" },
  { num: 4, label: "Partage avec des tiers", id: "partage-tiers" },
  { num: 5, label: "Sécurité et protection", id: "securite" },
  { num: 6, label: "Vos droits", id: "vos-droits" },
  { num: 7, label: "Conservation des données", id: "conservation" },
  { num: 8, label: "Cookies et technologies similaires", id: "cookies" },
  { num: 9, label: "Protection des mineurs", id: "mineurs" },
  { num: 10, label: "Transferts internationaux", id: "transferts" },
  { num: 11, label: "Modifications de cette politique", id: "modifications" },
  
  // --- Partie N.O.A.H. Security & Privacy System (Basée sur ton PDF) ---
  { num: 12, label: "N.O.A.H. Privacy Architecture", id: "architecture-confidentialite" },
  { num: 13, label: "Sécurité responsable et détection des menaces", id: "securite-responsable" },
  { num: 14, label: "Accès exceptionnels et réquisitions judiciaires", id: "acces-exceptionnels" },
  { num: 15, label: "Signalement externe des menaces graves", id: "signalement-externe" },
  { num: 16, label: "Audit complet et traçabilité", id: "audit-tracabilite" },
  { num: 17, label: "Contact et autorité de contrôle", id: "contact" },
];

// ===== Section 1 : Données collectées =====
export const accountData: DataItem[] = [
  {
    label: "Adresse e-mail",
    desc: [
      "**Nécessaire pour créer votre compte, vous contacter,**",
      "**et vous envoyer des notifications importantes.**",
      "**Votre email ne sera jamais partagé avec des tiers.**",
    ],
  },
  {
    label: "Nom d'utilisateur",
    desc: [
      "Pour personnaliser votre expérience et vous identifier dans l'interface.",
      "**Vous pouvez le modifier à tout moment.**",
    ],
  },
  {
    label: "Mot de passe",
    desc: [
      "**Stocké de manière sécurisée avec un hachage bcrypt/Argon2.**",
      "**Nous ne voyons jamais votre mot de passe en clair.**",
    ],
  },
  {
    label: "Date de naissance",
    desc: [
      "Collectée uniquement si requis pour la vérification de l'âge",
      "conformément aux réglementations en vigueur.",
    ],
  },
];

export const usageDataList: string[] = [
  "Historique de vos conversations avec l'IA : **sauvegardé pour que vous puissiez retrouver vos échanges précédents**",
  "Messages envoyés et reçus : **nécessaires pour générer des réponses via notre partenaire OpenAI**",
  "Métadonnées d'utilisation : date, heure, durée des sessions pour améliorer nos services",
  "Adresse IP : partiellement masquée pour la sécurité, utilisée pour détecter les activités suspectes",
  "Type de navigateur et appareil : pour optimiser l'expérience utilisateur sur chaque plateforme",
  "Logs techniques : pour le débogage et l'amélioration continue de nos infrastructures",
];

export const preferencesData: DataItem[] = [
  { label: "Photo de profil", desc: ["Optionnelle, stockée de manière sécurisée sur nos serveurs"] },
  { label: "Paramètres IA", desc: ["Pour adapter les réponses à vos besoins spécifiques"] },
  { label: "Langue préférée", desc: ["Pour personnaliser l'interface dans votre langue"] },
  { label: "Thème d'affichage", desc: ["Clair ou sombre selon votre préférence"] },
];

// ===== Section 2 : Données NON collectées =====
export const notCollectedData: NotCollectedItem[] = [
  {
    icon: CreditCard,
    title: "Données bancaires",
    subtitle: "Aucune information de paiement stockée",
    details: [
      "Toutes les transactions sont gérées exclusivement par **Stripe et PayPal**, des processeurs de paiement **certifiés PCI-DSS Level 1.**",
      "**Nous ne recevons que la confirmation du paiement, jamais votre numéro de carte, CVV, identifiants PayPal ou autres informations sensibles.**",
    ],
    items: [
      "Numéros de carte bancaire",
      "Codes CVV/CVC",
      "Dates d'expiration",
      "Historique complet des transactions",
      "Coordonnées bancaires (IBAN, BIC)",
      "Identifiants de connexion PayPal",
    ],
  },
  {
    icon: MessageSquare,
    title: "Messages privés externes",
    subtitle: "Nous ne lisons pas vos communications",
    details: [
      "**Nous ne collectons pas vos conversations WhatsApp, SMS, emails personnels, messages sur les réseaux sociaux ou toute autre communication privée.**",
      "Seuls les messages que vous envoyez volontairement à **N.O.A.H.** dans notre interface sont traités.",
    ],
    items: [
      "Messages WhatsApp / Telegram / Signal",
      "SMS et MMS",
      "Emails personnels (Gmail, Outlook...)",
      "Messages sur les réseaux sociaux",
      "Conversations sur d'autres applications",
    ],
  },
  {
    icon: Fingerprint,
    title: "Données biométriques",
    subtitle: "Aucune empreinte ou reconnaissance faciale",
    details: [
      "**Pas d'empreintes digitales, de reconnaissance faciale, d'analyse vocale biométrique ou de toute autre donnée biologique.**",
      "**Votre identité reste anonyme et protégée.**",
    ],
    items: [
      "Empreintes digitales",
      "Reconnaissance faciale",
      "Analyse de la voix (biométrie)",
      "Scan de l'iris",
      "Données génétiques",
      "Reconnaissance de démarche",
    ],
  },
  {
    icon: Smartphone,
    title: "Accès à votre appareil",
    subtitle: "Nous ne piratons pas votre téléphone",
    details: [
      "**Nous ne collectons pas vos contacts, photos, fichiers locaux, historique de navigation, ou autres données personnelles stockées sur votre appareil.**",
      "L'application fonctionne dans votre navigateur sans accès profond au système.",
    ],
    items: [
      "Carnet de contacts",
      "Photos et vidéos personnelles",
      "Fichiers locaux (documents, musique...)",
      "Historique de navigation web",
      "Localisation GPS en temps réel",
      "Microphone et Caméra (sauf activation manuelle)",
    ],
  },
  {
    icon: Globe,
    title: "Tracking publicitaire",
    subtitle: "Aucun profilage pour la publicité",
    details: [
      "**Pas de cookies publicitaires, pas de pixels de tracking Facebook/Google, pas de revente de données à des régies publicitaires.**",
      "**Votre navigation sur N.O.A.H. reste confidentielle.**",
    ],
    items: [
      "Cookies publicitaires tiers",
      "Pixels de tracking (Facebook, Google...)",
      "Historique de navigation sur d'autres sites",
      "Recherche de mots-clés sur Google",
      "Achats sur d'autres sites e-commerce",
      "Intérêts et centres d'intérêt marketing",
    ],
  },
  {
    icon: Shield,
    title: "Données sensibles",
    subtitle: "Protection renforcée des informations délicates",
    details: [
      "**Conformément au RGPD, nous ne collectons pas de données révélant l'origine raciale ou ethnique, les opinions politiques, les convictions religieuses, l'appartenance syndicale, la santé, la vie sexuelle ou l'orientation sexuelle.**",
    ],
    items: [
      "Opinions politiques",
      "Croyances religieuses",
      "Appartenance syndicale",
      "Données de santé",
      "Orientation sexuelle",
      "Origine raciale ou ethnique",
      "Casier judiciaire",
    ],
  },
];

// ===== Section 3 : Utilisation =====
export const usageItems: UsageItem[] = [
  {
    icon: Server,
    title: "Fournir le service",
    color: "blue",
    details: [
      "Traiter vos messages, générer des réponses IA, sauvegarder votre historique de conversations, maintenir votre session active. **Sans ces données, N.O.A.H. ne pourrait tout simplement pas fonctionner.**",
    ],
  },
  {
    icon: BarChart3,
    title: "Améliorer l'expérience",
    color: "violet",
    details: [
      "Personnaliser l'interface, adapter les fonctionnalités à vos besoins, optimiser les performances.",
      "**Nous analysons les données d'utilisation de manière agrégée et anonymisée pour améliorer continuellement le service.**",
    ],
  },
  {
    icon: Lock,
    title: "Sécurité et prévention",
    color: "emerald",
    details: [
      "Détecter les activités suspectes, prévenir les abus et fraudes,",
      "**protéger votre compte contre les accès non autorisés. Votre sécurité est notre priorité absolue.**",
    ],
  },
  {
    icon: Bell,
    title: "Communication",
    color: "amber",
    details: [
      "Vous envoyer des notifications importantes, mises à jour du service, support technique, réponses à vos demandes. **Nous ne vous envoyons jamais de spam ou de publicités non sollicitées.**",
    ],
  },
  {
    icon: Scale,
    title: "Obligations légales",
    color: "rose",
    details: [
      "Répondre aux demandes légales légitimes, appliquer nos conditions d'utilisation, respecter le RGPD et les autres réglementations en vigueur.",
      "**Nous ne divulguons vos données que lorsque la loi l'exige.**",
    ],
  },
];

// ===== Section 4 : Partage avec des tiers =====
export const partnerItems: PartnerItem[] = [
  {
    icon: Database,
    name: "Supabase",
    role: "Hébergement base de données",
    color: "emerald",
    details: [
      "**Stockage sécurisé de vos données en Europe. Certifié ISO 27001, SOC 2 Type II.**",
      "**Chiffrement AES-256 au repos. Supabase ne peut pas accéder à vos données sans notre autorisation explicite.**",
    ],
  },
  {
    icon: MessageSquare,
    name: "OpenAI",
    role: "Traitement des messages IA",
    color: "violet",
    details: [
      "Vos messages sont envoyés pour générer des réponses.",
      "**OpenAI ne stocke pas vos données pour l'entraînement (conformité API).**",
      "**Les données sont chiffrées en transit et au repos.**",
    ],
  },
  {
    icon: CreditCard,
    name: "Stripe",
    role: "Paiements",
    color: "blue",
    details: [
      "**Gestion sécurisée des transactions bancaires. Certifié PCI-DSS Level 1.**",
      "**Nous ne voyons jamais vos données bancaires.**",
      "Stripe est l'un des processeurs de paiement les plus sécurisés au monde.",
    ],
  },
  {
    icon: Globe,
    name: "Vercel",
    role: "Hébergement web",
    color: "amber",
    details: [
      "**Infrastructure cloud pour le site web. CDN mondial, chiffrement HTTPS automatique, conformité SOC 2.**",
      "Vercel héberge notre site avec les plus hauts standards de sécurité.",
    ],
  },
];

// ===== Section 5 : Sécurité =====
export const securityItems: SecurityItem[] = [
  {
    icon: Lock,
    title: "Chiffrement HTTPS/TLS",
    color: "blue",
    details: [
      "**Toutes les communications entre votre navigateur et nos serveurs sont chiffrées avec TLS 1.3, le protocole le plus récent et le plus sécurisé.**",
      "**Impossible d'intercepter vos données en transit.**",
    ],
  },
  {
    icon: Key,
    title: "Mots de passe hashés",
    color: "violet",
    details: [
      "Utilisation de bcrypt/Argon2 avec coût élevé. ",
      "**Même en cas de fuite de base de données, vos mots de passe restent illisibles.**",
      "**Nous ne stockons jamais les mots de passe en clair.**",
    ],
  },
  {
    icon: Shield,
    title: "Row Level Security",
    color: "emerald",
    details: [
      "**Chaque utilisateur ne peut accéder qu'à ses propres données.**",
      "Isolation totale au niveau de la base de données PostgreSQL.",
      "**Impossible pour un utilisateur de voir les données d'un autre.**",
    ],
  },
  {
    icon: Key,
    title: "Authentification 2FA",
    color: "amber",
    details: [
      "Option disponible pour sécuriser davantage votre compte avec Google Authenticator, Authy ou clés FIDO2/Passkey. ",
      "**Nous recommandons vivement d'activer cette fonctionnalité.**",
    ],
  },
  {
    icon: Eye,
    title: "Surveillance continue",
    color: "rose",
    details: [
      "Détection des activités suspectes, connexions inhabituelles, tentatives de brute force.",
      "**Alertes automatiques envoyées par email en cas de comportement anormal.**",
    ],
  },
  {
    icon: Database,
    title: "Sauvegardes régulières",
    color: "cyan",
    details: [
      "**Vos données sont sauvegardées quotidiennement de manière sécurisée avec chiffrement.**",
      "Récupération possible en cas de problème technique majeur.",
    ],
  },
];

// ===== Section 6 : Vos droits =====
export const rightItems: RightItem[] = [
  {
    icon: Eye,
    title: "Droit d'accès",
    color: "blue",
    details: [
      "Vous pouvez consulter toutes vos données personnelles à tout moment via votre profil ou en nous contactant.",
      "**Nous vous fournirons une copie complète de vos données dans un délai de 30 jours.**",
    ],
  },
  {
    icon: FileText,
    title: "Droit de rectification",
    color: "violet",
    details: [
      "Modifiez vos informations inexactes ou incomplètes directement dans votre profil ou sur demande.",
      "**Nous corrigerons vos données dans les plus brefs délais.**",
    ],
  },
  {
    icon: Trash2,
    title: "Droit à l'effacement",
    color: "emerald",
    details: [
      "**Supprimez votre compte et toutes vos données.**",
      "**Suppression définitive sous 30 jours (sauvegardes incluses).**",
      "**Vous pouvez exercer ce droit à tout moment sans justification.**",
    ],
  },
  {
    icon: Download,
    title: "Droit à la portabilité",
    color: "amber",
    details: [
      "**Exportez vos données dans un format standard (JSON, CSV) pour les réutiliser sur un autre service.**",
      "Nous vous fournirons vos données dans un format structuré et lisible par machine.",
    ],
  },
  {
    icon: UserX,
    title: "Droit d'opposition",
    color: "rose",
    details: [
      "Opposez-vous au traitement de vos données pour des raisons légitimes.",
      "**Nous cesserons le traitement sauf obligation légale impérieuse. Votre volonté prime.**",
    ],
  },
  {
    icon: Lock,
    title: "Droit de limitation",
    color: "cyan",
    details: [
      "Limitez le traitement de vos données en cas de contestation de l'exactitude ou d'utilisation illégale.",
      "**Nous gèlerons vos données jusqu'à résolution de la situation.**",
    ],
  },
];

// ===== Section 7 : Conservation =====
export const retentionItems: RetentionItem[] = [
  {
    duration: "**Pendant l'utilisation du service**",
    color: "emerald",
    items: [
      "Données de compte (email, nom d'utilisateur)",
      "Préférences utilisateur (thème, langue, paramètres)",
      "Historique des conversations avec l'IA",
      "Photo de profil",
      "Paramètres de l'IA personnalisés",
    ],
  },
  {
    duration: "**30 jours après suppression du compte**",
    color: "amber",
    items: [
      "Sauvegardes de sécurité",
      "Logs d'activité récents",
      "Données de facturation (en attente de traitement)",
      "Métadonnées temporaires",
    ],
  },
  {
    duration: "**1 an maximum**",
    color: "blue",
    items: [
      "Logs techniques",
      "Métadonnées d'utilisation",
      "Historique de connexions",
      "Données de performance",
    ],
  },
  {
    duration: "**Durée légale requise (jusqu'à 10 ans)**",
    color: "violet",
    items: [
      "Données de facturation (obligation comptable)",
      "Preuves de transactions",
      "Documents comptables",
      "Archives légales",
    ],
  },
];

// ===== Section 8 : Cookies =====
export const cookieItems: CookieItem[] = [
  {
    name: "Cookies de session",
    purpose: "Maintenir votre connexion active",
    duration: "Durée de la session",
    color: "blue",
    details: [
      "**Ces cookies sont essentiels au fonctionnement du site.**",
      "**Sans eux, vous seriez déconnecté à chaque page.**",
      "**Ils ne contiennent aucune donnée personnelle et sont supprimés lorsque vous fermez votre navigateur.**",
    ],
  },
  {
    name: "Cookies de préférences",
    purpose: "Mémoriser vos paramètres",
    duration: "1 an",
    color: "violet",
    details: [
      "Ils stockent vos choix (thème, langue, paramètres d'affichage) pour ne pas avoir à les reconfigurer à chaque visite.",
      "**Ces cookies ne contiennent que vos préférences, aucune donnée personnelle.**",
    ],
  },
  {
    name: "Cookies de sécurité",
    purpose: "Prévenir les attaques CSRF",
    duration: "Session",
    color: "emerald",
    details: [
      "**Ils protègent votre compte contre les attaques de type Cross-Site Request Forgery.**",
      "**Essentiels pour votre sécurité, ces cookies sont supprimés à la fin de votre session.**",
    ],
  },
];

// ===== Section 9 : Mineurs =====
export const minorItems: MinorItem[] = [
  {
    icon: UserCheck,
    title: "Vérification de l'âge",
    color: "pink",
    details: [
      "Lors de l'inscription, nous demandons la date de naissance de l'utilisateur.",
      "**Si l'utilisateur a moins de 15 ans, nous exigeons le consentement explicite d'un titulaire de l'autorité parentale avant de créer le compte.**",
      "Ce consentement peut être fourni par email à **parents@noah.ai**.",
    ],
  },
  {
    icon: Shield,
    title: "Contenu adapté",
    color: "pink",
    details: [
      "**Pour les utilisateurs mineurs (15-17 ans), nous activons automatiquement des filtres de contenu renforcés.**",
      "Les réponses de l'IA sont adaptées à un public jeune, et certaines fonctionnalités avancées peuvent être restreintes pour protéger les mineurs.",
    ],
  },
  {
    icon: Trash2,
    title: "Suppression facile",
    color: "pink",
    details: [
      "Les parents peuvent demander à tout moment la suppression du compte de leur enfant mineur en nous contactant.",
      "**La suppression est effectuée dans un délai de 48 heures, avec confirmation par email.**",
    ],
  },
];

// ===== Section 10 : Transferts internationaux =====
export const transferItems: TransferItem[] = [
  {
    icon: Building2,
    title: "Hébergement principal en Europe",
    color: "indigo",
    details: [
      "**Nos serveurs principaux sont hébergés en Europe (France et Allemagne) via nos partenaires Supabase et Vercel.**",
      "**La majorité de vos données restent donc sur le sol européen, soumis au RGPD.**",
    ],
  },
  {
    icon: FileCheck,
    title: "Clauses contractuelles types",
    color: "indigo",
    details: [
      "Lorsque des données sont transférées hors UE (par exemple vers OpenAI aux États-Unis),",
      "**nous utilisons les Clauses Contractuelles Types (CCT) approuvées par la Commission Européenne.**",
      "**Ces clauses garantissent un niveau de protection équivalent à celui du RGPD.**",
    ],
  },
  {
    icon: Shield,
    title: "Privacy Shield et accords équivalents",
    color: "indigo",
    details: [
      "**Nous travaillons uniquement avec des partenaires certifiés ou adhérant à des cadres de protection reconnus (Privacy Shield, Data Privacy Framework).**",
      "**Nous vérifions régulièrement** la conformité de nos sous-traitants.",
    ],
  },
];

// ===== Section 11 : Modifications =====
export const modificationItems: ModificationItem[] = [
  {
    icon: Bell,
    title: "Notification par e-mail",
    color: "blue",
    desc: [
      "**Toute modification importante vous sera notifiée par e-mail au moins 30 jours avant son application.**",
      "Vous aurez ainsi le temps de prendre connaissance des changements et de décider si vous souhaitez continuer à utiliser le service.",
    ],
  },
  {
    icon: Clock,
    title: "Date de mise à jour",
    color: "violet",
    desc: [
      "**La date de dernière mise à jour sera toujours indiquée en haut de ce document.**",
      "Vous pouvez ainsi vérifier facilement si la politique a été modifiée depuis votre dernière consultation.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Acceptation tacite",
    color: "emerald",
    desc: [
      "**En continuant à utiliser N.O.A.H. après les modifications, vous acceptez la nouvelle politique.**",
      "**Si vous n'acceptez pas les modifications, vous pouvez supprimer votre compte à tout moment.**",
    ],
  },
];

// ===== Section 12 : Architecture de confidentialité =====
export const privacyArchitectureItems: ExceptionalAccessItem[] = [
  {
    icon: Lock,
    title: "Chiffrement avancé et clés individuelles",
    color: "violet",
    details: [
      "**Chiffrement des conversations et des documents** pour empêcher toute interception.",
      "**Chaque utilisateur possède des clés de chiffrement uniques** et personnelles.",
      "**Séparation stricte des données** : même avec un accès au système, les données d'un utilisateur restent protégées contre les accès croisés.",
    ],
  },
  {
    icon: Eye,
    title: "Mode conversation privée et contrôle utilisateur",
    color: "violet",
    details: [
      "**Mode spécial avec confidentialité renforcée** : conversations non utilisées pour l'amélioration de l'IA.",
      "**L'utilisateur garde la maîtrise totale** : il peut voir, supprimer ou gérer la mémoire de **N.O.A.H.** à tout moment.",
      "**Gestion transparente** : le système explique clairement quelles données sont utilisées, pourquoi, et par quel agent.",
    ],
  },
];

// ===== Section 13 : Sécurité responsable =====
export const securityEngineItems: ExceptionalAccessItem[] = [
  {
    icon: ShieldAlert,
    title: "N.O.A.H. Threat Detection Engine",
    color: "orange",
    details: [
      "Le système analyse **l'intention réelle** derrière chaque demande, pas seulement les mots utilisés.",
      "Il évalue : **le contexte complet, l'objectif recherché, le niveau de risque potentiel** et le comportement historique.",
      "Types de menaces détectées : **tentatives de fraude, extorsion, contournement des protections, exploitation du système**.",
    ],
  },
  {
    icon: Ban,
    title: "Blocage automatique et rapport de sécurité",
    color: "orange",
    details: [
      "Lorsqu'un message est détecté comme dangereux, **N.O.A.H. bloque automatiquement son traitement**.",
      "Un **N.O.A.H. Security Report** est généré automatiquement (identifiant, date, catégorie du risque, score de confiance).",
      "L'utilisateur reçoit une **notification immédiate** avec l'identifiant du signalement (#NOAH-SECURITY-XXXXXX).",
    ],
  },
];

export const suspicionLevelsItems: ExceptionalAccessItem[] = [
  {
    icon: CheckCircle2,
    title: "Niveaux 0 et 1 : Conforme et Surveillance légère",
    color: "emerald",
    details: [
      "**Niveau 0 (Conforme)** : Aucun risque détecté. Message traité normalement.",
      "**Niveau 1 (Surveillance légère)** : Comportement inhabituel mais non dangereux.", 
      "Message autorisé avec analyse discrète.",
    ],
  },
  {
    icon: AlertCircle,
    title: "Niveaux 2 et 3 : Suspect et Dangereux",
    color: "amber",
    details: [
      "**Niveau 2 (Suspect)** : Risque potentiel.",
      "Message temporairement bloqué, création d'un rapport et analyse approfondie.",
      "**Niveau 3 (Dangereux)** : Intention malveillante probable.", 
      "**Blocage immédiat, signalement prioritaire et validation humaine obligatoire.**",
    ],
  },
  {
    icon: XCircle,
    title: "Niveau 4 : Critique",
    color: "red",
    details: [
      "**Menace importante pour N.O.A.H. ou ses utilisateurs** (attaque, exploitation massive).",
      "**Blocage immédiat, suspension temporaire possible** et intervention de l'équipe principale de sécurité.",
    ],
  },
];

// ===== Section 14 : Accès exceptionnels =====
export const exceptionalAccessItems: ExceptionalAccessItem[] = [
  {
    icon: FileCheck,
    title: "N.O.A.H. Exceptional Access System",
    color: "rose",
    details: [
      "Un accès exceptionnel n'est envisagé que pour : **menace grave, activité criminelle détectée, réquisition judiciaire ou danger imminent.**",
      "**Conditions obligatoires** : autorisation légale valide, validation interne, justification précise.",
      "**Accès strictement limité** dans le temps et aux informations absolument nécessaires.",
    ],
  },
  {
    icon: ListCheck,
    title: "Procédure d'accès aux données",
    color: "rose",
    details: [
      "1. Réception de la demande et **vérification juridique**.",
      "2. **Validation par les responsables autorisés** de **N.O.A.H.**",
      "3. Définition des données nécessaires et **accès exceptionnel sécurisé**.",
      "4. **Création obligatoire d'un rapport d'audit** complet.",
    ],
  },
];

// ===== Section 15 : Signalement externe =====
export const externalReportingItems: ExceptionalAccessItem[] = [
  {
    icon: TriangleAlert,
    title: "Situations nécessitant un signalement externe",
    color: "red",
    details: [
      "**Menaces graves envers une personne** (danger imminent).",
      "**Tentatives d'extorsion, fraudes organisées ou escroqueries massives.**",
      "**Tentatives d'attaque informatique majeures** ou compromission d'infrastructures critiques.",
    ],
  },
  {
    icon: FileSearch,
    title: "Processus de validation avant transmission",
    color: "red",
    details: [
      "**Un signalement externe n'est JAMAIS envoyé uniquement sur détection automatique.**",
      "Étape 1 : Détection d'une menace critique (Niveau 4).",
      "Étape 2 : **Analyse humaine obligatoire** par une équipe de sécurité autorisée.",
      "Étape 3 : Préparation d'un **N.O.A.H. Legal Security Report** contenant uniquement les informations strictement nécessaires.",
    ],
  },
  {
    icon: Shield,
    title: "Protection de la vie privée maintenue",
    color: "red",
    details: [
      "Même en cas de signalement, **les données personnelles restent protégées**.",
      "**Seules les informations nécessaires sont communiquées.**",
      "Chaque accès est enregistré et chaque transmission est auditée pour garantir l'équilibre entre sécurité publique et confidentialité.",
    ],
  },
];

// ===== Section 16 : Audit et traçabilité =====
export const auditSystemItems: ExceptionalAccessItem[] = [
  {
    icon: ListCheck,
    title: "N.O.A.H. Audit System",
    color: "indigo",
    details: [
      "Le système enregistre de manière immuable : **accès aux données, consultations humaines exceptionnelles, actions des agents IA**.",
      "Il trace également les **modifications importantes et l'utilisation des permissions**.",
    ],
  },
  {
    icon: History,
    title: "Historique de sécurité et transparence",
    color: "indigo",
    details: [
      "L'historique permet d'**analyser les incidents** et d'identifier les comportements suspects.",
      "Il garantit la **transparence totale** des décisions de sécurité.",
      "Objectif final : **Garantir une sécurité efficace tout en protégeant les droits des utilisateurs.**",
    ],
  },
];