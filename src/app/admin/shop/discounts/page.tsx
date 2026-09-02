"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, Loader2, X, Tag, Globe, FolderOpen, Package } from "lucide-react";

type Promotion = {
    id: string;
    name: string;
    description: string;
    discount_type: "percent" | "fixed";
    discount_value: number;
    scope: "site" | "category" | "products";
    start_at: string;
    end_at: string | null;
    is_active: boolean;
    stackable: boolean;
};

export default function DiscountsPage() {
    const supabase = createClient();
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Promotion | null>(null);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        const { data } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
        setPromotions(data || []);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette promotion ?")) return;
        await supabase.from("promotions").delete().eq("id", id);
        loadData();
    };

    const getScopeIcon = (scope: string) => {
        if (scope === "site") return <Globe className="w-4 h-4 text-blue-400" />;
        if (scope === "category") return <FolderOpen className="w-4 h-4 text-violet-400" />;
        return <Package className="w-4 h-4 text-emerald-400" />;
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-display text-2xl font-bold">Réductions automatiques</h2>
                    <p className="text-white/60 text-sm">{promotions.length} promotions</p>
                </div>
                <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nouvelle réduction
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-white/60"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : promotions.length === 0 ? (
                <div className="text-center py-20 text-white/40">Aucune promotion créée</div>
            ) : (
                <div className="grid gap-4">
                    {promotions.map((promo) => {
                        const status = getStatus(promo);
                        return (
                            <div key={promo.id} className="glass rounded-xl p-5 border border-white/10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                            <Tag className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-white text-lg">{promo.name}</h3>
                                                {promo.stackable && <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-bold">CUMULABLE</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-white/60">
                                                {getScopeIcon(promo.scope)}
                                                <span className="capitalize">{promo.scope === "site" ? "Tout le site" : promo.scope === "category" ? "Par catégorie" : "Produits spécifiques"}</span>
                                            </div>
                                            {promo.description && <p className="text-sm text-white/50 mt-1">{promo.description}</p>}
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
                                        <button onClick={() => { setEditing(promo); setShowForm(true); }} className="p-2 hover:bg-white/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(promo.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showForm && <PromotionForm promotion={editing} onClose={() => setShowForm(false)} onSave={() => { setShowForm(false); loadData(); }} />}
        </div>
    );
}

function PromotionForm({ promotion, onClose, onSave }: any) {
    const supabase = createClient();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: promotion?.name || "",
        description: promotion?.description || "",
        discount_type: promotion?.discount_type || "percent",
        discount_value: promotion?.discount_value || 0,
        scope: promotion?.scope || "site",
        start_at: promotion?.start_at ? new Date(promotion.start_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        end_at: promotion?.end_at ? new Date(promotion.end_at).toISOString().slice(0, 16) : "",
        is_active: promotion?.is_active ?? true,
        stackable: promotion?.stackable || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const data = { ...form, discount_value: parseFloat(String(form.discount_value)), end_at: form.end_at || null };
        if (promotion) {
            await supabase.from("promotions").update(data).eq("id", promotion.id);
        } else {
            await supabase.from("promotions").insert([data]);
        }
        setSaving(false);
        onSave();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg glass rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-noah-black/95 backdrop-blur p-6 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold">{promotion ? "Modifier" : "Nouvelle"} réduction</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-white/80 mb-1 block">Nom</label>
                        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-white/80 mb-1 block">Description</label>
                        <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Type</label>
                            <select value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50">
                                <option value="percent">Pourcentage (%)</option>
                                <option value="fixed">Montant fixe (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Valeur</label>
                            <input type="number" step="0.01" required value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Portée</label>
                            <select value={form.scope} onChange={e => setForm({...form, scope: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50">
                                <option value="site">🌍 Tout le site</option>
                                <option value="category">🗂️ Par catégorie</option>
                                <option value="products">📦 Produits spécifiques</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/80 mb-1 block">Début</label>
                            <input type="datetime-local" required value={form.start_at} onChange={e => setForm({...form, start_at: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-white/80 mb-1 block">Fin (optionnel)</label>
                            <input type="datetime-local" value={form.end_at} onChange={e => setForm({...form, end_at: e.target.value})} className="w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="rounded" />
                            <span className="text-sm text-white/80">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={form.stackable} onChange={e => setForm({...form, stackable: e.target.checked})} className="rounded" />
                            <span className="text-sm text-white/80">Cumulable avec les codes promo</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium glass hover:bg-white/10">Annuler</button>
                        <button type="submit" disabled={saving} className="btn-primary px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {promotion ? "Mettre à jour" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}