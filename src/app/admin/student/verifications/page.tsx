// src/app/admin/student/verifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    CheckCircle2, XCircle, Clock, Search, Filter,
    Eye, GraduationCap, Mail, FileText, MapPin, Calendar,
    Loader2
} from "lucide-react";

interface Verification {
    id: string;
    user_id: string;
    email: string | null;
    document_url: string | null;
    institution_name: string;
    country: string;
    institution_type: string;
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    created_at: string;
    // Ajoute ce champ :
    profiles?: {
        email: string | null;
        full_name: string | null;
    };
}

export default function StudentVerificationsPage() {
    const supabase = createClient();
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("pending");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadVerifications();
    }, []);

    const loadVerifications = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('student_verifications')
            .select(`
      *,
      profiles:auth.users!student_verifications_user_id_fkey (
        email,
        full_name:raw_user_meta_data->>full_name
      )
    `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erreur chargement:", error);
            setVerifications([]);
        } else {
            // ✅ Mappe les données pour qu'elles correspondent à l'interface
            const verificationsData: Verification[] = (data || []).map((item: any) => ({
                id: item.id,
                user_id: item.user_id,
                email: item.email,
                document_url: item.document_url,
                institution_name: item.institution_name,
                country: item.country,
                institution_type: item.institution_type,
                status: item.status,
                created_at: item.created_at,
                profiles: item.profiles,
            }));

            setVerifications(verificationsData);
        }
        setLoading(false);
    };

    // Action : Valider une vérification
    const handleVerify = async (id: string) => {
        const verification = verifications.find(v => v.id === id);
        if (!verification) return;

        // 1. Marquer la vérification comme validée
        const { error: dbError } = await supabase
            .from('student_verifications')
            .update({
                status: 'verified',
                verified_at: new Date().toISOString()
            })
            .eq('id', id);

        if (dbError) {
            console.error(dbError);
            return;
        }

        // 2. Mettre à jour le plan de l'utilisateur dans profiles
        const { error: planError } = await supabase
            .from('profiles')
            .update({ plan: 'student' })
            .eq('id', verification.user_id);

        if (planError) {
            console.error("Erreur mise à jour plan:", planError);
        }

        // 3. Recharger
        loadVerifications();
    };

    // Action : Refuser une vérification
    const handleReject = async (id: string, reason: string) => {
        const { error } = await supabase
            .from('student_verifications')
            .update({
                status: 'rejected',
                rejection_reason: reason
            })
            .eq('id', id);

        if (!error) loadVerifications();
    };

    // Filtrage côté client
    const filteredVerifications = verifications
        .filter(v => filter === "all" || v.status === filter)
        .filter(v =>
            v.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.institution_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                        <GraduationCap className="w-7 h-7 text-violet-400" />
                        Vérifications étudiantes
                    </h1>
                    <p className="text-white/60 mt-1">Gérez les demandes de statut étudiant</p>
                </div>
                <button
                    onClick={loadVerifications}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition"
                >
                    🔄 Actualiser
                </button>
            </div>

            {/* Stats dynamiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-4 border border-amber-500/20">
                    <div className="text-2xl font-bold text-white">
                        {verifications.filter(v => v.status === 'pending').length}
                    </div>
                    <div className="text-sm text-white/60">En attente</div>
                </div>
                <div className="glass rounded-xl p-4 border border-emerald-500/20">
                    <div className="text-2xl font-bold text-white">
                        {verifications.filter(v => v.status === 'verified').length}
                    </div>
                    <div className="text-sm text-white/60">Vérifiés</div>
                </div>
                <div className="glass rounded-xl p-4 border border-red-500/20">
                    <div className="text-2xl font-bold text-white">
                        {verifications.filter(v => v.status === 'rejected').length}
                    </div>
                    <div className="text-sm text-white/60">Refusés</div>
                </div>
                <div className="glass rounded-xl p-4 border border-violet-500/20">
                    <div className="text-2xl font-bold text-white">
                        {verifications.length > 0
                            ? Math.round((verifications.filter(v => v.status === 'verified').length / verifications.length) * 100)
                            : 0}%
                    </div>
                    <div className="text-sm text-white/60">Taux d'acceptation</div>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-noah-panel border border-noah-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-noah-panel border border-noah-border rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                    <option value="all">Tous</option>
                    <option value="pending">En attente</option>
                    <option value="verified">Vérifiés</option>
                    <option value="rejected">Refusés</option>
                </select>
            </div>

            {/* Tableau */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                    </div>
                ) : filteredVerifications.length === 0 ? (
                    <div className="text-center py-20 text-white/50">
                        Aucune vérification trouvée
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-white/70 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Étudiant</th>
                            <th className="px-6 py-4">Établissement</th>
                            <th className="px-6 py-4">Méthode</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredVerifications.map((v) => (
                            <tr key={v.id} className="hover:bg-white/[0.02] transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                            {(v.profiles?.full_name || v.email || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">
                                                {v.profiles?.full_name || "Nom inconnu"}
                                            </div>
                                            <div className="text-xs text-white/50">
                                                {v.profiles?.email || v.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-white">{v.institution_name || "—"}</div>
                                    <div className="text-xs text-white/50 mt-1">
                                        {v.country} • {v.institution_type}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-white/80">
                                        {v.document_url ? (
                                            <>
                                                <FileText className="w-4 h-4 text-violet-400" />
                                                <span className="text-sm">Document</span>
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm">Email</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(v.created_at).toLocaleDateString('fr-FR', {
                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        v.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            v.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {v.status === 'pending' ? 'En attente' :
                          v.status === 'verified' ? 'Vérifié' : 'Refusé'}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {v.document_url && (
                                            <a
                                                href={v.document_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-white/5 rounded-lg transition text-white/60 hover:text-white"
                                                title="Voir le document"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                        )}
                                        {v.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleVerify(v.id)}
                                                    className="p-2 hover:bg-emerald-500/10 rounded-lg transition text-emerald-400"
                                                    title="Valider"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const reason = prompt("Raison du refus :");
                                                        if (reason) handleReject(v.id, reason);
                                                    }}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400"
                                                    title="Refuser"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}