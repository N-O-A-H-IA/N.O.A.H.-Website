"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User, Shield, Brain, MessageSquare, Lock, Palette,
    Bell, CreditCard, GraduationCap, Link2, HelpCircle,
    ChevronRight, Menu, X
} from "lucide-react";

const settingsMenu = [
    { name: "Compte", href: "/settings/account", icon: User },
    { name: "Sécurité", href: "/settings/security", icon: Shield },
    { name: "Intelligence N.O.A.H.", href: "/settings/ai", icon: Brain },
    { name: "Conversations", href: "/settings/conversations", icon: MessageSquare },
    { name: "Confidentialité", href: "/settings/privacy", icon: Lock },
    { name: "Apparence", href: "/settings/appearance", icon: Palette },
    { name: "Notifications", href: "/settings/notifications", icon: Bell },
    { name: "Abonnement", href: "/settings/billing", icon: CreditCard },
    { name: "Statut étudiant", href: "/settings/student", icon: GraduationCap },
    { name: "Intégrations", href: "/settings/integrations", icon: Link2 },
    { name: "Aide", href: "/settings/help", icon: HelpCircle },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex gap-8">
                {/* Sidebar */}
                <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
                    <div className="md:hidden mb-4">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="flex items-center gap-2 text-white/80"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            <span>Menu</span>
                        </button>
                    </div>
                    <nav className="space-y-1">
                        {settingsMenu.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                                        isActive
                                            ? 'bg-violet-500/10 border border-violet-500/20 text-white'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4" />}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    );
}