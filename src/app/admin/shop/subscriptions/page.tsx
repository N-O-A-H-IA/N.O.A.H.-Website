"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function SubscriptionsPage() {
    const supabase = createClient();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.from("profiles").select("id, plan, created_at").then(({ data }) => {
            setProfiles(data || []);
            setLoading(false);
        });
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-display text-2xl font-bold">Abonnements</h2>
                <p className="text-white/60 text-sm">{profiles.length} utilisateurs avec un plan</p>
            </div>
            {loading ? (
                <div className="text-center py-20 text-white/60"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
            ) : (
                <div className="glass rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5 text-white/60">
                        <tr>
                            <th className="text-left p-4">Utilisateur ID</th>
                            <th className="text-left p-4">Plan</th>
                            <th className="text-left p-4">Depuis</th>
                        </tr>
                        </thead>
                        <tbody>
                        {profiles.map((p) => (
                            <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                                <td className="p-4 font-mono text-xs text-white/70">{p.id.slice(0, 8)}...</td>
                                <td className="p-4"><span className="px-2 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium capitalize">{p.plan}</span></td>
                                <td className="p-4 text-white/70">{new Date(p.created_at).toLocaleDateString("fr-FR")}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}