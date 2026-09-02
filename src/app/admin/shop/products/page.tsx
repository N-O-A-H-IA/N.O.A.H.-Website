"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Select } from "@/components/ui/Select"; // <-- Import du composant Select
import {
    Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X
} from "lucide-react";

type Category = {
    id: string;
    name: string;
    icon: string | null;
};

type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category_id: string | null;
    type: string;
    price_monthly: number | null;
    price_yearly: number | null;
    currency: string;
    requires_student_verification: boolean;
    is_active: boolean;
    is_popular: boolean;
    features: string[] | null;
    rank_badge: string | null;
    categories: Category | null;
};

export default function ProductsPage() {
    const supabase = createClient();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
            supabase.from("products").select("*, categories(name, icon)").order("created_at", { ascending: false }),
            supabase.from("categories").select("id, name, icon").eq("is_active", true),
        ]);
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce produit ?")) return;
        await supabase.from("products").delete().eq("id", id);
        loadData();
    };

    const handleToggleActive = async (product: Product) => {
        await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
        loadData();
    };

    const filteredProducts = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory = !filterCategory || p.category_id === filterCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold">Produits</h2>
                    <p className="text-white/60 text-sm">{products.length} produits au total</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setShowForm(true); }}
                    className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nouveau produit
                </button>
            </div>

            {/* Filtres */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-noah-panel border border-noah-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-noah-violet/50"
                    />
                </div>
                <Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-auto min-w-[200px]"
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                </Select>
            </div>

            {/* Liste */}
            {loading ? (
                <div className="text-center py-20 text-white/60"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-white/40">Aucun produit trouvé</div>
            ) : (
                <div className="grid gap-4">
                    {filteredProducts.map((prod) => (
                        <div key={prod.id} className="glass rounded-xl p-5 border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-semibold text-white text-lg">{prod.name}</h3>
                                        {prod.is_popular && <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">POPULAIRE</span>}
                                        {prod.requires_student_verification && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">🎓 ÉTUDIANT</span>}
                                    </div>
                                    <p className="text-sm text-white/60">{prod.slug} • {prod.categories?.icon} {prod.categories?.name || "Sans catégorie"}</p>
                                    {prod.description && <p className="text-sm text-white/50 mt-1">{prod.description}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${prod.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {prod.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <span className="text-white/50">Mensuel: </span>
                                        <span className="text-white font-semibold">{prod.price_monthly?.toFixed(2) || "0.00"}€</span>
                                    </div>
                                    <div>
                                        <span className="text-white/50">Annuel: </span>
                                        <span className="text-white font-semibold">{prod.price_yearly?.toFixed(2) || "0.00"}€</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleToggleActive(prod)} className="p-2 hover:bg-white/10 rounded-lg transition" title={prod.is_active ? "Désactiver" : "Activer"}>
                                        {prod.is_active ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-red-400" />}
                                    </button>
                                    <button onClick={() => { setEditingProduct(prod); setShowForm(true); }} className="p-2 hover:bg-white/10 rounded-lg transition">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(prod.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Formulaire */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setShowForm(false)}
                    onSave={() => { setShowForm(false); loadData(); }}
                />
            )}
        </div>
    );
}

// ============================================
// FORMULAIRE PRODUIT
// ============================================
function ProductForm({ product, categories, onClose, onSave }: { product: Product | null; categories: Category[]; onClose: () => void; onSave: () => void }) {
    const supabase = createClient();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: product?.name || "",
        slug: product?.slug || "",
        description: product?.description || "",
        category_id: product?.category_id || categories[0]?.id || "",
        type: product?.type || "subscription",
        price_monthly: product?.price_monthly || 0,
        price_yearly: product?.price_yearly || 0,
        requires_student_verification: product?.requires_student_verification || false,
        is_active: product?.is_active ?? true,
        is_popular: product?.is_popular || false,
        rank_badge: product?.rank_badge || "",
        features: Array.isArray(product?.features) ? product.features.join("\n") : "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const data = {
            ...form,
            features: form.features.split("\n").filter((f: string) => f.trim()),
            price_monthly: parseFloat(String(form.price_monthly)) || 0,
            price_yearly: parseFloat(String(form.price_yearly)) || 0,
        };

        try {
            if (product) {
                await supabase.from("products").update(data).eq("id", product.id);
            } else {
                await supabase.from("products").insert([data]);
            }
            onSave();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl glass rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-noah-black/95 backdrop-blur p-6 border-b border-white/10 flex items-center justify-between z-10">
                    <h3 className="font-display text-xl font-bold">{product ? "Modifier le produit" : "Nouveau produit"}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-white/80 mb-1 block">Nom</label>
                            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Slug (ID)</label>
                            <input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Catégorie</label>
                            <Select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Prix mensuel (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.price_monthly}
                                onChange={e => setForm({...form, price_monthly: parseFloat(e.target.value) || 0})}
                                className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Prix annuel (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.price_yearly}
                                onChange={e => setForm({...form, price_yearly: parseFloat(e.target.value) || 0})}
                                className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-white/80 mb-1 block">Fonctionnalités (une par ligne)</label>
                            <textarea value={form.features} onChange={e => setForm({...form, features: e.target.value})} rows={5} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50 font-mono" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Rank Badge</label>
                            <input value={form.rank_badge} onChange={e => setForm({...form, rank_badge: e.target.value})} placeholder="ex: plus, pro, student" className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div className="md:col-span-2 space-y-3 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_popular} onChange={e => setForm({...form, is_popular: e.target.checked})} className="rounded border-noah-border bg-noah-panel text-violet-500 focus:ring-violet-500" />
                                <span className="text-sm text-white/80">Marquer comme populaire</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.requires_student_verification} onChange={e => setForm({...form, requires_student_verification: e.target.checked})} className="rounded border-noah-border bg-noah-panel text-violet-500 focus:ring-violet-500" />
                                <span className="text-sm text-white/80">Nécessite une vérification étudiant</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded border-noah-border bg-noah-panel text-violet-500 focus:ring-violet-500" />
                                <span className="text-sm text-white/80">Actif (visible sur le site)</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium glass hover:bg-white/10 transition">Annuler</button>
                        <button type="submit" disabled={saving} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {product ? "Mettre à jour" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}