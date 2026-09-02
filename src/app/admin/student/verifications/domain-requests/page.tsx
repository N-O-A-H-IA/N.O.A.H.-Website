"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Globe,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Loader2,
    RefreshCw,
    Building2,
    Mail,
    User,
    AlertCircle
} from "lucide-react";

interface DomainRequest {
    id: string;
    user_id: string;
    domain: string;
    institution_name: string | null;
    email: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    user_name?: string;
    user_email?: string;
}

export default function DomainRequestsPage() {
    const supabase = createClient();
    const [requests, setRequests] = useState<DomainRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('domain_requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erreur chargement:", error);
            setRequests([]);
        } else {
            // Récupérer les infos des utilisateurs
            const userIds = (data || []).map((r: any) => r.user_id).filter(Boolean);
            let profiles: any[] = [];

            if (userIds.length > 0) {
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, email, full_name')
                    .in('id', userIds);
                profiles = profilesData || [];
            }

            const combined = (data || []).map((request: any) => {
                const profile = profiles.find((p: any) => p.id === request.user_id);
                return {
                    ...request,
                    user_name: profile?.full_name || profile?.email || 'Inconnu',
                    user_email: profile?.email || request.email
                };
            });

            setRequests(combined);
        }
        setLoading(false);
    };

    const handleApprove = async (id: string, domain: string, institutionName?: string) => {
        if (!confirm(`Approuver le domaine "${domain}" et l'ajouter à la liste blanche ?`)) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();

            // 1. Mettre à jour le statut de la demande
            const { error: updateError } = await supabase
                .from('domain_requests')
                .update({ status: 'approved' })
                .eq('id', id);

            if (updateError) throw updateError;

            // 2. ✅ Ajouter le domaine dans la liste blanche
            const { error: domainError } = await supabase
                .from('allowed_domains')
                .upsert({
                    domain: domain.toLowerCase(),
                    institution_name: institutionName,
                    approved_by: user?.id,
                    approved_at: new Date().toISOString(),
                    is_active: true
                }, {
                    onConflict: 'domain' // Si le domaine existe déjà, on le met à jour
                });

            if (domainError) {
                console.error("Erreur ajout domaine:", domainError);
                throw domainError;
            }

            alert(`✅ Domaine "${domain}" approuvé et ajouté à la liste blanche !`);
            await loadRequests();

        } catch (error) {
            console.error("Erreur:", error);
            alert("❌ Erreur lors de l'approbation");
        }
    };

    const handleReject = async (id: string, domain: string) => {
        const reason = prompt(`Raison du refus pour ${domain} :`);
        if (!reason) return;

        try {
            const { error } = await supabase
                .from('domain_requests')
                .update({
                    status: 'rejected',
                    rejection_reason: reason
                })
                .eq('id', id);

            if (error) throw error;

            alert(` Domaine ${domain} refusé`);
            loadRequests();
        } catch (error) {
            console.error("Erreur:", error);
            alert(" Erreur lors du refus");
        }
    };

    const filteredRequests = requests
        .filter(r => filter === "all" || r.status === filter)
        .filter(r =>
            r.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.institution_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                        <Globe className="w-7 h-7 text-blue-400" />
                        Demandes de domaines
                    </h1>
                    <p className="text-white/60 mt-1">
                        Gérez les demandes d'ajout de domaines universitaires
                    </p>
                </div>
                <button
                    onClick={loadRequests}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualiser
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-4 border border-amber-500/20">
                    <div className="text-2xl font-bold text-white">
                        {requests.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="text-sm text-white/60">En attente</div>
                </div>
                <div className="glass rounded-xl p-4 border border-emerald-500/20">
                    <div className="text-2xl font-bold text-white">
                        {requests.filter(r => r.status === 'approved').length}
                    </div>
                    <div className="text-sm text-white/60">Approuvés</div>
                </div>
                <div className="glass rounded-xl p-4 border border-red-500/20">
                    <div className="text-2xl font-bold text-white">
                        {requests.filter(r => r.status === 'rejected').length}
                    </div>
                    <div className="text-sm text-white/60">Refusés</div>
                </div>
                <div className="glass rounded-xl p-4 border border-violet-500/20">
                    <div className="text-2xl font-bold text-white">
                        {new Set(requests.map(r => r.domain)).size}
                    </div>
                    <div className="text-sm text-white/60">Domaines uniques</div>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Rechercher (domaine, établissement, email)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-noah-panel border border-noah-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-noah-panel border border-noah-border rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                    <option value="pending">En attente</option>
                    <option value="all">Tous</option>
                    <option value="approved">Approuvés</option>
                    <option value="rejected">Refusés</option>
                </select>
            </div>

            {/* Tableau */}
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20 text-white/50">
                        {requests.length === 0
                            ? "Aucune demande de domaine"
                            : "Aucun résultat pour ces filtres"}
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredRequests.map((request) => (
                            <div key={request.id} className="p-6 hover:bg-white/[0.02] transition">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                                <Globe className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white text-lg">
                                                    {request.domain}
                                                </h3>
                                                <p className="text-sm text-white/60">
                                                    Demandé le {new Date(request.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                </p>
                                            </div>
                                            <div className="ml-auto">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                                                    request.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        request.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                    {request.status === 'pending' ? (
                                                        <><Clock className="w-3 h-3" /> En attente</>
                                                    ) : request.status === 'approved' ? (
                                                        <><CheckCircle2 className="w-3 h-3" /> Approuvé</>
                                                    ) : (
                                                        <><XCircle className="w-3 h-3" /> Refusé</>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            {request.institution_name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Building2 className="w-4 h-4 text-white/40" />
                                                    <span className="text-white/80">{request.institution_name}</span>
                                                </div>
                                            )}
                                            {request.user_email && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-white/40" />
                                                    <span className="text-white/80">{request.user_email}</span>
                                                </div>
                                            )}
                                            {request.user_name && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="w-4 h-4 text-white/40" />
                                                    <span className="text-white/80">{request.user_name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {request.status === 'pending' && (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handleApprove(request.id, request.domain)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition text-sm font-medium"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Approuver
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id, request.domain)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-sm font-medium"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Refuser
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}