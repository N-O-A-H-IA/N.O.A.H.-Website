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
    Menu,
    ChevronDown,
    ChevronRight,
    Server,
    FileText,
    Image,
    Redirect,
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
    Monitor, GraduationCap, CheckCircle2, UserCheck, AlertTriangle, MessageSquareWarning
} from "lucide-react";
import { LogoStatic } from "@/components/logo/LogoStatic";

// Structure du menu inspirée d'Azuriom
const menuStructure = [
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
        name: "Navigation",
        href: "/admin/navigation",
        icon: List,
    },
    {
        name: "Serveurs",
        href: "/admin/servers",
        icon: Server,
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
        icon: GraduationCap, // Importe cette icône en haut
        subItems: [
            { name: "Vérifications", href: "/admin/student/verifications", icon: CheckCircle2 },
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
            { name: "Redirections", href: "/admin/content/redirects", icon: Redirect },
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
        name: "skin3D viewer",
        href: "/admin/skin3d",
        icon: Monitor,
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

export function AdminSidebar({ userRole }: { userRole: string }) {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        // Ouvre la section Boutique par défaut si on est dessus
        "Boutique": pathname?.startsWith("/admin/shop"),
        "Paramètres": pathname?.startsWith("/admin/settings"),
        "Utilisateurs": pathname?.startsWith("/admin/users"),
        "Contenu": pathname?.startsWith("/admin/content"),
    });

    const toggleSection = (name: string) => {
        setOpenSections(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

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
                {menuStructure.map((item) => {
                    const hasSubItems = item.subItems;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    const isOpen = openSections[item.name];

                    if (hasSubItems) {
                        return (
                            <div key={item.name} className="space-y-1">
                                {/* Header de section */}
                                <button
                                    onClick={() => toggleSection(item.name)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-blue-800/50 text-white"
                                            : "text-blue-100 hover:bg-blue-800/30 hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </div>
                                    {isOpen ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>

                                {/* Sous-menu */}
                                {isOpen && (
                                    <div className="ml-4 pl-4 border-l-2 border-blue-600/50 space-y-1">
                                        {hasSubItems.map((subItem) => {
                                            const isSubActive = pathname === subItem.href;
                                            return (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        isSubActive
                                                            ? "bg-blue-800 text-white"
                                                            : "text-blue-200 hover:bg-blue-800/30 hover:text-white"
                                                    }`}
                                                >
                                                    <subItem.icon className="w-3.5 h-3.5" />
                                                    <span>{subItem.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Item simple sans sous-menu
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? "bg-blue-800/50 text-white"
                                    : "text-blue-100 hover:bg-blue-800/30 hover:text-white"
                            }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    );
                })}
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