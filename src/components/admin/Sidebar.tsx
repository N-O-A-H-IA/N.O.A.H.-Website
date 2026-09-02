"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    Users,
    Shield,
    UserX,
    ShoppingBag,
    Tag,
    CreditCard,
    Package,
    Gift,
    TrendingUp,
    ChevronDown,
    ChevronRight,
    Server,
    FileText,
    Image,
    Bot,
    HelpCircle,
    UserCog,
    LogOut,
    Home,
    Mail,
    Gauge,
    Wrench,
    Share2,
    List,
    Monitor,
    GraduationCap,
    CheckCircle2,
    UserCheck,
    AlertTriangle,
    MessageSquareWarning,
    Globe
} from "lucide-react";
import { MdEmail } from "react-icons/md";
import { LuMailPlus } from "react-icons/lu";

// Définition du type pour supporter l'imbrication infinie
type MenuItem = {
    name: string;
    href?: string;
    icon: any;
    subItems?: MenuItem[];
};

// Structure du menu avec imbrication
const menuStructure: MenuItem[] = [
    {
        name: "Tableau de bord",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        name: "Paramètres",
        icon: Settings,
        subItems: [
            { name: "Général", href: "/admin/settings/general", icon: Settings },
            { name: "Accueil", href: "/admin/settings/home", icon: Home },
            { name: "Mail", href: "/admin/settings/mail", icon: Mail },
            { name: "Performances", href: "/admin/settings/performance", icon: Gauge },
            { name: "Maintenance", href: "/admin/settings/maintenance", icon: Wrench },
            { name: "Réseaux sociaux", href: "/admin/settings/social", icon: Share2 },
        ]
    },
    {
        name: "Utilisateurs",
        icon: Users,
        subItems: [
            { name: "Utilisateurs", href: "/admin/users", icon: Users },
            { name: "Rôles", href: "/admin/users/roles", icon: Shield },
            { name: "Bannissements", href: "/admin/users/bans", icon: UserX },
        ]
    },
    {
        name: "Programme étudiant",
        icon: GraduationCap,
        subItems: [
            {
                name: "Vérifications",
                href: "/admin/student/verifications",
                icon: CheckCircle2,
                subItems: [
                    { name: "Demandes de domaines", href: "/admin/student/verifications/domain-requests", icon: Globe }
                ]
            },
            { name: "Éligibilité", href: "/admin/student/eligibility", icon: UserCheck },
            { name: "Offres Student", href: "/admin/student/offers", icon: Tag },
        ]
    },
    {
        name: "Modération",
        icon: Shield,
        subItems: [
            { name: "Signalements", href: "/admin/moderation/reports", icon: AlertTriangle },
            { name: "Chats signalés", href: "/admin/moderation/chats", icon: MessageSquareWarning },
            { name: "Utilisateurs sanctionnés", href: "/admin/moderation/sanctions", icon: UserX },
            { name: "Logs", href: "/admin/moderation/logs", icon: FileText },
        ]
    },
    {
        name: "Contenu",
        icon: FileText,
        subItems: [
            { name: "Pages", href: "/admin/content/pages", icon: FileText },
            { name: "Articles", href: "/admin/content/articles", icon: FileText },
            { name: "Images", href: "/admin/content/images", icon: Image },
        ]
    },
    {
        name: "Boutique",
        icon: ShoppingBag,
        subItems: [
            { name: "Paramètres", href: "/admin/shop/settings", icon: Settings },
            { name: "Produits", href: "/admin/shop/products", icon: Package },
            { name: "Moyens de paiements", href: "/admin/shop/payments", icon: CreditCard },
            { name: "Réductions", href: "/admin/shop/discounts", icon: TrendingUp },
            { name: "Codes promo", href: "/admin/shop/promos", icon: Tag },
            { name: "Cartes cadeaux", href: "/admin/shop/giftcards", icon: Gift },
            { name: "Variables", href: "/admin/shop/variables", icon: Settings },
            { name: "Paiements", href: "/admin/shop/transactions", icon: CreditCard },
            { name: "Abonnements", href: "/admin/shop/subscriptions", icon: CreditCard },
            { name: "Statistiques", href: "/admin/shop/stats", icon: TrendingUp },
        ]
    },
    {
        name: "Staff",
        href: "/admin/staff",
        icon: UserCog,
    },
    {
        name: "Support",
        href: "/admin/support",
        icon: HelpCircle,
    },
];

// Composant récursif pour afficher les éléments du menu (gère l'imbrication infinie)
function MenuItemRenderer({ item, level = 0 }: { item: MenuItem; level?: number }) {
    const pathname = usePathname();

    // Ouvrir automatiquement le menu si un de ses enfants (ou petits-enfants) est la page active
    const [isOpen, setIsOpen] = useState(() => {
        if (item.subItems) {
            return item.subItems.some(sub =>
                pathname === sub.href || (sub.subItems && sub.subItems.some((subSub: any) => pathname === subSub.href))
            );
        }
        return false;
    });

    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = pathname === item.href || (hasSubItems && item.subItems?.some(sub => pathname === sub.href || (sub.subItems && sub.subItems.some((subSub: any) => pathname === subSub.href))));

    const toggle = () => setIsOpen(!isOpen);

    // Styles adaptés selon le niveau de profondeur
    const getBaseClasses = () => {
        if (level === 0) {
            return `w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive ? "bg-blue-800/50 text-white" : "text-blue-100 hover:bg-blue-800/30 hover:text-white"
            }`;
        }
        if (level === 1) {
            return `w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                isActive ? "bg-blue-800 text-white" : "text-blue-200 hover:bg-blue-800/30 hover:text-white"
            }`;
        }
        // Niveau 2 et plus
        return `w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
            isActive ? "bg-blue-900/50 text-white" : "text-blue-300 hover:bg-blue-800/30 hover:text-white"
        }`;
    };

    if (hasSubItems) {
        return (
            <div className="space-y-1">
                <button onClick={toggle} className={getBaseClasses()}>
                    <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${level >= 2 ? 'w-3.5 h-3.5' : ''}`} />
                        <span>{item.name}</span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {isOpen && (
                    <div className="ml-4 pl-4 border-l-2 border-blue-600/50 space-y-1">
                        {item.subItems!.map((subItem, idx) => (
                            <MenuItemRenderer key={idx} item={subItem} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Si c'est un lien final (pas de sous-menu)
    return (
        <Link href={item.href!} className={`w-full flex items-center gap-3 ${getBaseClasses().replace('justify-between', '')}`}>
            <item.icon className={`w-4 h-4 ${level >= 2 ? 'w-3.5 h-3.5' : ''}`} />
            <span>{item.name}</span>
        </Link>
    );
}

export function AdminSidebar({ userRole }: { userRole: string }) {
    return (
        <aside className="w-64 bg-blue-700 flex flex-col h-screen sticky top-0 overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b border-blue-600">
                <div className="text-center">
                    <h1 className="font-display text-2xl font-bold text-white tracking-wider">
                        N.O.A.H.
                    </h1>
                    <p className="text-xs text-blue-200 mt-1">
                        Admin Panel
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/50 border border-blue-600">
                        <Shield className="w-3 h-3 text-blue-300" />
                        <span className="text-xs text-blue-100">
                            {userRole === 'admin' ? 'Super Admin' : 'Staff'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuStructure.map((item, idx) => (
                    <MenuItemRenderer key={idx} item={item} level={0} />
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-blue-600 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:bg-blue-800/30 hover:text-white transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Retour au site
                </Link>
            </div>
        </aside>
    );
}