"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Package, Tag, Ticket, FolderOpen, TrendingUp,
    Plus, Edit2, Trash2, Eye, EyeOff, Loader2, AlertCircle
} from "lucide-react";

// ============================================
// TYPES (basés sur la nouvelle BDD)
// ============================================
type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    created_at: string;
};

type Product = {
    id: string;
    category_id: string | null;
    name: string;
    slug: string;
    description: string | null;
    type: string;
    price_monthly: number | null;
    price_yearly: number | null;
    currency: string;
    requires_student_verification: boolean;
    is_active: boolean;
    is_popular: boolean;
    features: any;
    rank_badge: string | null;
    created_at: string;
    categories: { name: string; icon: string } | null;
};

type Promotion = {
    id: string;
    name: string;
    description: string | null;
    discount_type: "percent" | "fixed";
    discount_value: number;
    scope: "site" | "category" | "products";
    start_at: string;
    end_at: string | null;
    is_active: boolean;
    stackable: boolean;
    created_at: string;
};

type PromoCode = {
    id: string;
    code: string;
    name: string | null;
    description: string | null;
    discount_type: "percent" | "fixed";
    discount_value: number;
    scope: "site" | "category" | "products";
    max_uses: number | null;
    uses_count: number;
    max_uses_per_user: number | null;
    start_at: string;
    end_at: string | null;
    is_active: boolean;
    stackable: boolean;
    created_at: string;
};

type Tab = "overview" | "categories" | "products" | "promotions" | "promo_codes";

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export default function AdminShopPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState<Tab>("overview");

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === "overview") {
                const [catRes, prodRes, promoRes, codeRes] = await Promise.all([
                    supabase.from("categories").select("*"),
                    supabase.from("products").select("*, categories(name, icon)"),
                    supabase.from("promotions").select("*"),
                    supabase.from("promo_codes").select("*"),
                ]);
                setCategories(catRes.data || []);
                setProducts(prodRes.data || []);
                setPromotions(promoRes.data || []);
                setPromoCodes(codeRes.data || []);
            } else if (activeTab === "categories") {
                const { data } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
                setCategories(data || []);
            } else if (activeTab === "products") {
                const { data } = await supabase.from("products").select("*, categories(name, icon)").order("created_at", { ascending: false });
                setProducts(data || []);
            } else if (activeTab === "promotions") {
                const { data } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
                setPromotions(data || []);
            } else if (activeTab === "promo_codes") {
                const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
                setPromoCodes(data || []);
            }
        } catch (error) {
            console.error("Erreur de chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: "overview", label: "Vue d'ensemble", icon: TrendingUp },
        { id: "categories", label: "Catégories", icon: FolderOpen },
        { id: "products", label: "Produits", icon: Package },
        { id: "promotions", label: "Réductions", icon: Tag },
        { id: "promo_codes", label: "Codes promo", icon: Ticket },
    ];

    return (
        <div className="min-h-screen bg-noah-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold mb-2">🛒 Boutique N.O.A.H.</h1>
                    <p className="text-white/60">Gérez votre catalogue, promotions et codes promo</p>
                </div>

                {/* Navigation par onglets */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 border-b border-white/10">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                                    isActive
                                        ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/20"
                                        : "glass hover:bg-white/10 text-white/70"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Contenu */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/60">
                        <Loader2 className="w-8 h-8 animate-spin mb-4" />
                        <p>Chargement des données...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === "overview" && <OverviewTab stats={{ categories: categories.length, products: products.length, promotions: promotions.length, promoCodes: promoCodes.length }} />}
                        {activeTab === "categories" && <CategoriesTab categories={categories} />}
                        {activeTab === "products" && <ProductsTab products={products} />}
                        {activeTab === "promotions" && <PromotionsTab promotions={promotions} />}
                        {activeTab === "promo_codes" && <PromoCodesTab promoCodes={promoCodes} />}
                    </>
                )}
            </div>
        </div>
    );
}

// ============================================
// TAB: Vue d'ensemble
// ============================================
function OverviewTab({ stats }: { stats: { categories: number; products: number; promotions: number; promoCodes: number } }) {
    const statCards = [
        { label: "Catégories", value: stats.categories, icon: FolderOpen, color: "from-blue-500 to-cyan-500" },
        { label: "Produits", value: stats.products, icon: Package, color: "from-violet-500 to-purple-500" },
        { label: "Réductions actives", value: stats.promotions, icon: Tag, color: "from-emerald-500 to-teal-500" },
        { label: "Codes promo", value: stats.promoCodes, icon: Ticket, color: "from-amber-500 to-orange-500" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-white/60">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-violet-400" />
                    Structure du système
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <span className="text-2xl">🗂️</span>
                        <div>
                            <strong className="text-white block mb-1">Catégories</strong>
                            Regroupent les produits (Particuliers, Étudiants, Entreprises)
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <span className="text-2xl">📦</span>
                        <div>
                            <strong className="text-white block mb-1">Produits</strong>
                            Les offres individuelles avec leurs prix et fonctionnalités
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <span className="text-2xl">🏷️</span>
                        <div>
                            <strong className="text-white block mb-1">Promotions</strong>
                            Réductions automatiques appliquées sans code
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                        <span className="text-2xl">🎟️</span>
                        <div>
                            <strong className="text-white block mb-1">Codes promo</strong>
                            Réductions activées manuellement par l'utilisateur
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// TAB: Catégories
// ============================================
function CategoriesTab({ categories }: { categories: Category[] }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold">Catégories</h2>
                <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nouvelle catégorie
                </button>
            </div>

            <div className="grid gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="glass rounded-xl p-5 border border-white/10 flex items-center justify-between hover:border-white/20 transition">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">{cat.icon || "📁"}</div>
                            <div>
                                <h3 className="font-semibold text-white text-lg">{cat.name}</h3>
                                <p className="text-sm text-white/60 font-mono">{cat.slug}</p>
                                {cat.description && <p className="text-sm text-white/50 mt-1">{cat.description}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${cat.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                {cat.is_active ? "Active" : "Inactive"}
              </span>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
                {categories.length === 0 && <EmptyState message="Aucune catégorie trouvée" />}
            </div>
        </div>
    );
}

// ============================================
// TAB: Produits
// ============================================
function ProductsTab({ products }: { products: Product[] }) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold">Produits / Offres</h2>
                <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nouveau produit
                </button>
            </div>

            <div className="grid gap-4">
                {products.map((prod) => (
                    <div key={prod.id} className="glass rounded-xl p-5 border border-white/10 hover:border-white/20 transition">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-white text-lg">{prod.name}</h3>
                                    {prod.is_popular && <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">POPULAIRE</span>}
                                    {prod.requires_student_verification && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">🎓 ÉTUDIANT</span>}
                                </div>
                                <p className="text-sm text-white/60">
                                    {prod.slug} • {prod.categories?.icon} {prod.categories?.name || "Sans catégorie"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${prod.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                  {prod.is_active ? "Actif" : "Inactif"}
                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm mb-3">
                            <div>
                                <span className="text-white/50">Mensuel: </span>
                                <span className="text-white font-semibold">{prod.price_monthly?.toFixed(2) || "0.00"}€</span>
                            </div>
                            <div>
                                <span className="text-white/50">Annuel: </span>
                                <span className="text-white font-semibold">{prod.price_yearly?.toFixed(2) || "0.00"}€</span>
                            </div>
                        </div>

                        {prod.features && Array.isArray(prod.features) && prod.features.length > 0 && (
                            <div className="pt-3 border-t border-white/10">
                                <div className="flex flex-wrap gap-2">
                                    {prod.features.slice(0, 4).map((f: string, i: number) => (
                                        <span key={i} className="px-2 py-1 rounded bg-white/5 text-xs text-white/70 border border-white/5">✓ {f}</span>
                                    ))}
                                    {prod.features.length > 4 && (
                                        <span className="px-2 py-1 rounded bg-white/5 text-xs text-white/50 border border-white/5">+{prod.features.length - 4} autres</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/10">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition"><Eye className="w-4 h-4 text-white/60" /></button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
                {products.length === 0 && <EmptyState message="Aucun produit trouvé" />}
            </div>
        </div>
    );
}

// ============================================
// TAB: Promotions
// ============================================
function PromotionsTab({ promotions }: { promotions: Promotion[] }) {
    const getScopeLabel = (scope: string) => {
        switch (scope) {
            case "site": return "🌍 Tout le site";
            case "category": return "🗂️ Par catégorie";
            case "products": return "📦 Produits spécifiques";
            default: return scope;
        }
    };

    const getStatus = (promo: Promotion) => {
        const now = new Date();
        const start = new Date(promo.start_at);
        const end = promo.end_at ? new Date(promo.end_at) : null;
        if (!promo.is_active) return { label: "Inactive", color: "bg-red-500/20 text-red-400" };
        if (start > now) return { label: "À venir", color: "bg-amber-500/20 text-amber-400" };
        if (end && end < now) return { label: "Expirée", color: "bg-gray-500/20 text-gray-400" };
        return { label: "Active", color: "bg-emerald-500/20 text-emerald-400" };
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold">Réductions automatiques</h2>
                <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nouvelle réduction
                </button>
            </div>

            <div className="grid gap-4">
                {promotions.map((promo) => {
                    const status = getStatus(promo);
                    return (
                        <div key={promo.id} className="glass rounded-xl p-5 border border-white/10 hover:border-white/20 transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                        <Tag className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-semibold text-white text-lg">{promo.name}</h3>
                                            {promo.stackable && <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">CUMULABLE</span>}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
                                            {getScopeLabel(promo.scope)}
                                        </div>
                                        {promo.description && <p className="text-sm text-white/50">{promo.description}</p>}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-emerald-400">
                                        -{promo.discount_value}{promo.discount_type === "percent" ? "%" : "€"}
                                    </div>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-sm">
                                <div className="flex items-center gap-4 text-white/60">
                                    <span>Début: {new Date(promo.start_at).toLocaleDateString("fr-FR")}</span>
                                    {promo.end_at && <span>Fin: {new Date(promo.end_at).toLocaleDateString("fr-FR")}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {promotions.length === 0 && <EmptyState message="Aucune promotion configurée" />}
            </div>
        </div>
    );
}

// ============================================
// TAB: Codes Promo
// ============================================
function PromoCodesTab({ promoCodes }: { promoCodes: PromoCode[] }) {
    const getScopeLabel = (scope: string) => {
        switch (scope) {
            case "site": return "🌍 Tout le site";
            case "category": return "🗂️ Par catégorie";
            case "products": return "📦 Produits spécifiques";
            default: return scope;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="font-display text-2xl font-bold">Codes promo</h2>
                <button className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nouveau code
                </button>
            </div>

            <div className="grid gap-4">
                {promoCodes.map((code) => {
                    const usagePercent = code.max_uses ? Math.min(((code.uses_count || 0) / code.max_uses) * 100, 100) : 0;
                    const isExhausted = code.max_uses && (code.uses_count || 0) >= code.max_uses;

                    return (
                        <div key={code.id} className="glass rounded-xl p-5 border border-white/10 hover:border-white/20 transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                                        <Ticket className="w-6 h-6 text-violet-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-mono font-bold text-white text-xl tracking-wide">{code.code}</h3>
                                            {code.name && <span className="text-sm text-white/60">- {code.name}</span>}
                                            {code.stackable && <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">CUMULABLE</span>}
                                        </div>
                                        <div className="text-sm text-white/60">{getScopeLabel(code.scope)}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-emerald-400">
                                        -{code.discount_value}{code.discount_type === "percent" ? "%" : "€"}
                                    </div>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                        !code.is_active ? "bg-red-500/20 text-red-400" :
                                            isExhausted ? "bg-gray-500/20 text-gray-400" :
                                                "bg-emerald-500/20 text-emerald-400"
                                    }`}>
                    {!code.is_active ? "Inactive" : isExhausted ? "Épuisé" : "Active"}
                  </span>
                                </div>
                            </div>

                            {code.max_uses && (
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs text-white/60 mb-1">
                                        <span>Utilisations</span>
                                        <span>{code.uses_count || 0} / {code.max_uses}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isExhausted ? "bg-red-500" : "bg-gradient-to-r from-violet-500 to-blue-500"}`}
                                            style={{ width: `${usagePercent}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-sm">
                                <div className="flex items-center gap-4 text-white/60 flex-wrap">
                                    {code.max_uses_per_user && <span>Max/user: {code.max_uses_per_user}</span>}
                                    <span>Début: {new Date(code.start_at).toLocaleDateString("fr-FR")}</span>
                                    {code.end_at && <span>Fin: {new Date(code.end_at).toLocaleDateString("fr-FR")}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {promoCodes.length === 0 && <EmptyState message="Aucun code promo créé" />}
            </div>
        </div>
    );
}

// ============================================
// COMPOSANT UTILITAIRE: État vide
// ============================================
function EmptyState({ message }: { message: string }) {
    return (
        <div className="glass rounded-xl p-12 border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/60">{message}</p>
        </div>
    );
}