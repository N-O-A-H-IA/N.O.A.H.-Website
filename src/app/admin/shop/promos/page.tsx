"use client";

import { useState, useEffect } from "react"; // ✅ Import corrigé et complet
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Loader2, X, Ticket, Copy, CheckCircle2 } from "lucide-react";

type PromoCode = {
    id: string;
    code: string;
    name: string | null;
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
};

export default function PromosPage() {
    const supabase = createClient();
    const [codes, setCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<PromoCode | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("promo_codes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Erreur chargement codes promo:", error);
            alert(`Erreur de chargement: ${error.message}`);
        } else {
            setCodes(data || []);
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce code promo ?")) return;
        await supabase.from("promo_codes").delete().eq("id", id);
        loadData();
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    const getUsagePercent = (code: PromoCode) => {
        if (!code.max_uses) return 0;
        return Math.min(((code.uses_count || 0) / code.max_uses) * 100, 100);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold">Codes promo</h2>
                    <p className="text-white/60 text-sm">{codes.length} codes</p>
                </div>
                <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nouveau code
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-white/60"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : codes.length === 0 ? (
                <div className="text-center py-20 text-white/40">Aucun code promo créé</div>
            ) : (
                <div className="grid gap-4">
                    {codes.map((code) => {
                        const usagePercent = getUsagePercent(code);
                        const isExhausted = code.max_uses && code.uses_count >= code.max_uses;
                        return (
                            <div key={code.id} className="glass rounded-xl p-5 border border-white/10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                                            <Ticket className="w-6 h-6 text-violet-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="font-mono font-bold text-white text-xl">{code.code}</h3>
                                                <button onClick={() => copyCode(code.code)} className="p-1 hover:bg-white/10 rounded transition" title="Copier">
                                                    {copied === code.code ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
                                                </button>
                                                {code.name && <span className="text-sm text-white/60">- {code.name}</span>}
                                                {code.stackable && <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">CUMULABLE</span>}
                                            </div>
                                            <div className="text-sm text-white/60 capitalize">
                                                {code.scope === "site" ? "🌍 Tout le site" : code.scope === "category" ? "🗂️ Par catégorie" : "📦 Produits spécifiques"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-emerald-400">
                                            -{code.discount_value}{code.discount_type === "percent" ? "%" : "€"}
                                        </div>
                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                                            !code.is_active ? "bg-red-500/20 text-red-400" :
                                                isExhausted ? "bg-gray-500/20 text-gray-400" : "bg-emerald-500/20 text-emerald-400"
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
                                            <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${usagePercent}%` }} />
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
                                        <button onClick={() => { setEditing(code); setShowForm(true); }} className="p-2 hover:bg-white/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(code.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showForm && <PromoCodeForm code={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); loadData(); }} />}
        </div>
    );
}

// ============================================
// FORMULAIRE CODE PROMO (CORRIGÉ)
// ============================================
function PromoCodeForm({ code, onClose, onSave }: { code: any; onClose: () => void; onSave: () => void }) {
    const supabase = createClient();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const [form, setForm] = useState({
        code: code?.code || "",
        name: code?.name || "",
        discount_type: code?.discount_type || "percent",
        discount_value: code?.discount_value?.toString() || "0",
        scope: code?.scope || "site",
        max_uses: code?.max_uses?.toString() || "",
        max_uses_per_user: code?.max_uses_per_user?.toString() || "",
        start_at: code?.start_at ? new Date(code.start_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        end_at: code?.end_at ? new Date(code.end_at).toISOString().slice(0, 16) : "",
        is_active: code?.is_active ?? true,
        stackable: code?.stackable || false,
    });

    useEffect(() => {
        const loadData = async () => {
            const [catRes, prodRes] = await Promise.all([
                supabase.from("categories").select("*").eq("is_active", true),
                supabase.from("products").select("*").eq("is_active", true),
            ]);
            setCategories(catRes.data || []);
            setProducts(prodRes.data || []);

            if (code?.id) {
                const [catCodes, prodCodes] = await Promise.all([
                    supabase.from("promo_code_categories").select("category_id").eq("promo_code_id", code.id),
                    supabase.from("promo_code_products").select("product_id").eq("promo_code_id", code.id),
                ]);
                setSelectedCategories(catCodes.data?.map((c: any) => c.category_id) || []);
                setSelectedProducts(prodCodes.data?.map((p: any) => p.product_id) || []);
            }
        };
        loadData();
    }, [code?.id]);

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "NOAH-";
        for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        setForm({ ...form, code: result });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = {
                code: form.code.toUpperCase(),
                name: form.name || null,
                discount_type: form.discount_type,
                discount_value: parseFloat(form.discount_value) || 0,
                scope: form.scope,
                max_uses: form.max_uses ? parseInt(form.max_uses) : null,
                max_uses_per_user: form.max_uses_per_user ? parseInt(form.max_uses_per_user) : null,
                start_at: form.start_at,
                end_at: form.end_at || null,
                is_active: form.is_active,
                stackable: form.stackable,
            };

            let promoCodeId = code?.id; // ✅ On initialise avec l'ID existant si c'est une modification
            let error;

            if (code) {
                // MISE À JOUR
                const res = await supabase.from("promo_codes").update(data).eq("id", code.id);
                error = res.error;

                // On supprime les anciennes liaisons
                if (!error) {
                    await supabase.from("promo_code_categories").delete().eq("promo_code_id", code.id);
                    await supabase.from("promo_code_products").delete().eq("promo_code_id", code.id);
                }
            } else {
                // CRÉATION (⚠️ .select() est OBLIGATOIRE pour récupérer le nouvel ID)
                const res = await supabase.from("promo_codes").insert([data]).select();
                error = res.error;
                if (!error && res.data && res.data.length > 0) {
                    promoCodeId = res.data[0].id; // ✅ On récupère l'ID généré
                }
            }

            if (error) throw error;
            if (!promoCodeId) throw new Error("Impossible de récupérer l'ID du code promo.");

            // Insérer les nouvelles liaisons catégories
            if (form.scope === "category" && selectedCategories.length > 0) {
                const categoryLinks = selectedCategories.map(catId => ({
                    promo_code_id: promoCodeId,
                    category_id: catId,
                }));
                await supabase.from("promo_code_categories").insert(categoryLinks);
            }

            // Insérer les nouvelles liaisons produits
            if (form.scope === "products" && selectedProducts.length > 0) {
                const productLinks = selectedProducts.map(prodId => ({
                    promo_code_id: promoCodeId,
                    product_id: prodId,
                }));
                await supabase.from("promo_code_products").insert(productLinks);
            }

            onSave();
        } catch (error: any) {
            console.error("Erreur:", error);
            alert(`Erreur: ${error.message || "Une erreur inconnue est survenue"}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl glass rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-noah-black/95 backdrop-blur p-6 border-b border-white/10 flex items-center justify-between z-10">
                    <h3 className="font-display text-xl font-bold">{code ? "Modifier" : "Nouveau"} code promo</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-sm font-medium text-white/80">Code</label>
                            <button type="button" onClick={generateCode} className="text-xs text-violet-400 hover:underline">🎲 Générer</button>
                        </div>
                        <input required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-noah-violet/50" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-white/80 mb-1 block">Nom descriptif (optionnel)</label>
                        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Type</label>
                            <select value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50 [&>option]:bg-noah-panel [&>option]:text-white">
                                <option value="percent">Pourcentage (%)</option>
                                <option value="fixed">Montant fixe (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Valeur</label>
                            <input type="number" step="0.01" required value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-white/80 mb-2 block">Portée</label>
                        <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50 [&>option]:bg-noah-panel [&>option]:text-white">
                            <option value="site">🌍 Tout le site</option>
                            <option value="category">📁 Par catégorie</option>
                            <option value="products">📦 Produits spécifiques</option>
                        </select>
                    </div>

                    {form.scope === "category" && (
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">Catégories concernées <span className="text-white/50">(Ctrl/Cmd + clic pour multiple)</span></label>
                            <select multiple value={selectedCategories} onChange={(e) => setSelectedCategories(Array.from(e.target.selectedOptions, o => o.value))} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50 [&>option]:bg-noah-panel [&>option]:text-white" size={4}>
                                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}
                            </select>
                            <p className="text-xs text-white/50 mt-1">{selectedCategories.length} catégorie(s) sélectionnée(s)</p>
                        </div>
                    )}

                    {form.scope === "products" && (
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-2 block">Produits concernés <span className="text-white/50">(Ctrl/Cmd + clic pour multiple)</span></label>
                            <select multiple value={selectedProducts} onChange={(e) => setSelectedProducts(Array.from(e.target.selectedOptions, o => o.value))} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50 [&>option]:bg-noah-panel [&>option]:text-white" size={6}>
                                {products.map((prod) => (<option key={prod.id} value={prod.id}>{prod.name} ({prod.price_monthly}€/mois)</option>))}
                            </select>
                            <p className="text-xs text-white/50 mt-1">{selectedProducts.length} produit(s) sélectionné(s)</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Max utilisations</label>
                            <input type="number" value={form.max_uses} onChange={e => setForm({...form, max_uses: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Max par utilisateur</label>
                            <input type="number" value={form.max_uses_per_user} onChange={e => setForm({...form, max_uses_per_user: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Début</label>
                            <input type="datetime-local" required value={form.start_at} onChange={e => setForm({...form, start_at: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Fin (optionnel)</label>
                            <input type="datetime-local" value={form.end_at} onChange={e => setForm({...form, end_at: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded border-noah-border bg-noah-panel text-violet-500" />
                            <span className="text-sm text-white/80">Actif</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.stackable} onChange={e => setForm({...form, stackable: e.target.checked})} className="rounded border-noah-border bg-noah-panel text-violet-500" />
                            <span className="text-sm text-white/80">Cumulable avec les promotions auto</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium glass hover:bg-white/10">Annuler</button>
                        <button type="submit" disabled={saving} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {code ? "Mettre à jour" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}