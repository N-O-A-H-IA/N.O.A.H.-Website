"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function TransactionsPage() {
    const supabase = createClient();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from("transactions").select("*, products(name), promo_codes(code)").order("created_at", { ascending: false }).then(({ data }) => {
            setTransactions(data || []);
            setLoading(false);
        });
    }, []);

    const statusColors: any = {
        completed: "bg-emerald-500/20 text-emerald-400",
        pending: "bg-amber-500/20 text-amber-400",
        failed: "bg-red-500/20 text-red-400",
        refunded: "bg-blue-500/20 text-blue-400",
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-display text-2xl font-bold">Paiements</h2>
                <p className="text-white/60 text-sm">{transactions.length} transactions</p>
            </div>
            {loading ? (
                <div className="text-center py-20 text-white/60"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : transactions.length === 0 ? (
                <div className="text-center py-20 text-white/40">Aucune transaction</div>
            ) : (
                <div className="glass rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5 text-white/60">
                        <tr>
                            <th className="text-left p-4">Date</th>
                            <th className="text-left p-4">Produit</th>
                            <th className="text-left p-4">Montant</th>
                            <th className="text-left p-4">Méthode</th>
                            <th className="text-left p-4">Code promo</th>
                            <th className="text-left p-4">Statut</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                                <td className="p-4 text-white/70">{new Date(t.created_at).toLocaleDateString("fr-FR")}</td>
                                <td className="p-4 text-white">{t.products?.name || "-"}</td>
                                <td className="p-4 font-semibold text-white">{t.amount}€</td>
                                <td className="p-4 text-white/70 capitalize">{t.payment_method}</td>
                                <td className="p-4 font-mono text-violet-400">{t.promo_codes?.code || "-"}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}