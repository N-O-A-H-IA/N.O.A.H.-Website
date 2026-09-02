"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { syncUserDiscordRoles } from "@/lib/discord";
import {
    CheckCircle2, XCircle, Clock, Search, Filter,
    Eye, GraduationCap, Mail, FileText, MapPin, Calendar,
    Loader2, RefreshCw, X, User, Building2, ExternalLink, AlertCircle
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
    verified_at?: string | null;
    rejection_reason?: string | null;
    user_email?: string | null;
    user_name?: string | null;
    user_pseudo?: string | null;
    student_email?: string | null;
}

export default function StudentVerificationsPage() {
    const supabase = createClient();
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
    const [isOpeningDoc, setIsOpeningDoc] = useState(false);
    const [verificationHistory, setVerificationHistory] = useState<any[]>([]);

    useEffect(() => {
        loadVerifications();
    }, []);

    useEffect(() => {
        if (selectedVerification) {
            loadVerificationHistory(selectedVerification.user_id);
        }
    }, [selectedVerification]);

    const loadVerifications = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from('student_verifications')
            .select('*')  // ✅ Ça sélectionne tout, donc student_email aussi
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erreur chargement:", error);
            setVerifications([]);
        } else {
            const userIds = (data || []).map((v: any) => v.user_id);
            let profiles: any[] = [];

            if (userIds.length > 0) {
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('id, email, full_name, first_name, last_name, username')
                    .in('id', userIds);
                profiles = profilesData || [];
            }

            const combined = (data || []).map((verify: any) => {
                const profile = profiles.find((p: any) => p.id === verify.user_id);

                // Nom complet
                const fullName = profile?.full_name ||
                    (profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.name) ||
                    'Nom inconnu';

                // ✅ Pseudo : username en priorité, sinon email sans domaine
                const pseudo = profile?.username ||  // ← Doit contenir "FrozerYTB"
                    profile?.email?.split('@')[0] ||  // ← Sinon "frozerYtb3"
                    'utilisateur';

                return {
                    ...verify,
                    user_email: profile?.email || verify.email,
                    student_email: verify.student_email || verify.email,
                    user_name: fullName,
                    user_pseudo: pseudo  // ← Utiliser la variable pseudo
                };
            });

            console.log("✅ Données chargées:", combined);
            setVerifications(combined);
        }
        setLoading(false);
    };

    const loadVerificationHistory = async (userId: string) => {
        const { data, error } = await supabase
            .from('student_verification_attempts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setVerificationHistory(data);
        }
    };

    const handleVerify = async (id: string) => {
        const verification = verifications.find(v => v.id === id);
        if (!verification) return;

        // 1. Mettre à jour le statut de la vérification
        const { error: dbError } = await supabase
            .from('student_verifications')
            .update({
                status: 'verified',
                verified_at: new Date().toISOString()
            })
            .eq('id', id);

        if (dbError) {
            console.error("Erreur update:", dbError);
            return;
        }

        // 2. Mettre à jour le plan de l'utilisateur en 'student'
        await supabase
            .from('profiles')
            .update({ plan: 'student' })
            .eq('id', verification.user_id);

        // 3. 🎯 ATTRIBUER LE RÔLE DISCORD AUTOMATIQUEMENT
        try {
            // Récupérer le discord_id de l'utilisateur
            const { data: profile } = await supabase
                .from('profiles')
                .select('discord_id')
                .eq('id', verification.user_id)
                .single();

            if (profile?.discord_id) {
                console.log("🔄 Synchronisation du rôle Discord pour:", profile.discord_id);
                await syncUserDiscordRoles(profile.discord_id, 'student');
                console.log("✅ Rôle Discord 'student' attribué avec succès !");
            } else {
                console.log("ℹ️ L'utilisateur n'a pas de compte Discord connecté, rien à faire.");
            }
        } catch (error) {
            console.error("❌ Erreur lors de l'attribution du rôle Discord:", error);
            // On ne bloque pas la validation si Discord échoue, on log juste l'erreur
        }

        // 4. Rafraîchir l'interface
        setSelectedVerification(null);
        loadVerifications();
    };

    const handleReject = async (id: string) => {
        const reason = prompt("Raison du refus :");
        if (!reason) return;

        await supabase
            .from('student_verifications')
            .update({
                status: 'rejected',
                rejection_reason: reason
            })
            .eq('id', id);

        setSelectedVerification(null);
        loadVerifications();
    };

    const handleViewDocument = async (documentPath: string | null, e?: React.MouseEvent) => {
        if (!documentPath) {
            alert("Aucun document disponible");
            return;
        }

        if (e) e.stopPropagation();
        setIsOpeningDoc(true);

        try {
            let cleanPath = documentPath;
            if (documentPath.startsWith('http')) {
                try {
                    const url = new URL(documentPath);
                    const parts = url.pathname.split('/');
                    const bucketIndex = parts.findIndex(p => p === 'student-documents');
                    if (bucketIndex !== -1 && bucketIndex < parts.length - 1) {
                        cleanPath = parts.slice(bucketIndex + 1).join('/');
                    }
                } catch (err) {
                    console.error("Erreur parsing URL:", err);
                }
            }

            const { data, error } = await supabase.storage
                .from('student-documents')
                .createSignedUrl(cleanPath, 604800);

            if (error) {
                console.error("Erreur génération URL signée:", error);
                alert(`Impossible d'ouvrir le document.\nDétail: ${error.message}\n\nVérifie que le bucket "student-documents" existe bien dans Supabase Storage.`);
                return;
            }

            window.open(data.signedUrl, '_blank');
        } catch (error) {
            console.error("Erreur globale:", error);
            alert("Une erreur inattendue est survenue.");
        } finally {
            setIsOpeningDoc(false);
        }
    };

    const filteredVerifications = verifications
        .filter(v => filter === "all" || v.status === filter)
        .filter(v =>
            v.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.user_pseudo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Actualiser
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
                        placeholder="Rechercher (nom, email, établissement)..."
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
                        {verifications.length === 0
                            ? "Aucune vérification dans la base. Soumets une demande depuis /student-verification pour tester."
                            : "Aucun résultat pour ces filtres"}
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
                            <tr
                                key={v.id}
                                className="hover:bg-white/[0.02] transition cursor-pointer"
                                onClick={() => setSelectedVerification(v)}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                            {(v.user_name || v.user_pseudo || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">
                                                {v.user_name}
                                            </div>
                                            <div className="text-xs text-white/50">
                                                @{v.user_pseudo} • {v.user_email}
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
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-2">
                                        {v.document_url && (
                                            <button
                                                onClick={(e) => handleViewDocument(v.document_url!, e)}
                                                disabled={isOpeningDoc}
                                                className="p-2 hover:bg-white/5 rounded-lg transition text-white/60 hover:text-white disabled:opacity-50"
                                                title="Voir le document (URL sécurisée)"
                                            >
                                                {isOpeningDoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                            </button>
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
                                                    onClick={() => handleReject(v.id)}
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

            {/* ========================================== */}
            {/* MODAL DÉTAILLÉ */}
            {/* ========================================== */}
            {selectedVerification && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedVerification(null)}
                >
                    <div
                        className="glass rounded-2xl border border-white/10 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="font-display text-2xl font-bold text-white mb-2">
                                    Détails de la vérification
                                </h2>
                                <p className="text-white/60 text-sm font-mono">
                                    ID: {selectedVerification.id}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedVerification(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        <div className="mb-8">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${
                                selectedVerification.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    selectedVerification.status === 'verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                                {selectedVerification.status === 'pending' ? '⏳ En attente' :
                                    selectedVerification.status === 'verified' ? '✅ Vérifié' : '❌ Refusé'}
                            </span>
                        </div>

                        {/* ✅ GRID pour Informations étudiant et Établissement */}
                        {/* ✅ GRID pour mettre les deux cartes côte à côte */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Informations étudiant */}
                            <div className="glass rounded-xl p-5 border border-white/10">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-400" />
                                    Informations étudiant
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-white/60 block mb-1">Nom complet</span>
                                        <span className="text-white font-medium">{selectedVerification.user_name}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60 block mb-1">Pseudo</span>
                                        <span className="text-white font-medium">@{selectedVerification.user_pseudo}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60 block mb-1">Email du compte</span>
                                        <span className="text-white font-medium">{selectedVerification.user_email}</span>
                                    </div>
                                    {selectedVerification.student_email && (
                                        <div>
                                            <span className="text-white/60 block mb-1">Email étudiant</span>
                                            <span className="text-emerald-400 font-medium">{selectedVerification.student_email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Établissement */}
                            <div className="glass rounded-xl p-5 border border-white/10">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-violet-400" />
                                    Établissement
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-white/60 block mb-1">Nom</span>
                                        <span className="text-white font-medium">{selectedVerification.institution_name || 'Non renseigné'}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60 block mb-1">Pays</span>
                                        <span className="text-white">{selectedVerification.country || 'Non renseigné'}</span>
                                    </div>
                                    <div>
                                        <span className="text-white/60 block mb-1">Type</span>
                                        <span className="text-white capitalize">{selectedVerification.institution_type || 'Non renseigné'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass rounded-xl p-5 border border-white/10 mb-8">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-amber-400" />
                                Historique de la demande actuelle
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                    <div className="flex-1">
                                        <p className="text-sm text-white font-medium">Demande soumise</p>
                                        <p className="text-xs text-white/60">
                                            {new Date(selectedVerification.created_at).toLocaleString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {selectedVerification.status === 'verified' && selectedVerification.verified_at && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                                        <div className="flex-1">
                                            <p className="text-sm text-white font-medium">Vérifié et validé</p>
                                            <p className="text-xs text-white/60">
                                                {new Date(selectedVerification.verified_at).toLocaleString('fr-FR', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedVerification.status === 'rejected' && selectedVerification.rejection_reason && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                                        <div className="flex-1">
                                            <p className="text-sm text-white font-medium">Refusé</p>
                                            <p className="text-xs text-white/60 mb-2">
                                                {new Date(selectedVerification.created_at).toLocaleString('fr-FR', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                                <p className="text-xs text-red-400">
                                                    <span className="font-semibold">Raison du refus :</span> {selectedVerification.rejection_reason}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {verificationHistory.length > 1 && (
                            <div className="glass rounded-xl p-5 border border-white/10 mb-8">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    Historique des tentatives précédentes ({verificationHistory.length})
                                </h3>
                                <div className="space-y-3">
                                    {verificationHistory.map((attempt, index) => (
                                        <div
                                            key={attempt.id}
                                            className={`p-3 rounded-lg border ${
                                                attempt.status === 'verified' ? 'bg-emerald-500/5 border-emerald-500/20' :
                                                    attempt.status === 'rejected' ? 'bg-red-500/5 border-red-500/20' :
                                                        'bg-amber-500/5 border-amber-500/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                        attempt.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            attempt.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-amber-500/20 text-amber-400'
                                                    }`}>
                                                        {attempt.status === 'verified' ? '✅ Vérifié' :
                                                            attempt.status === 'rejected' ? '❌ Refusé' : '⏳ En attente'}
                                                    </span>
                                                    <span className="text-xs text-white/60">
                                                        {new Date(attempt.created_at).toLocaleString('fr-FR', {
                                                            day: '2-digit', month: '2-digit', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            {attempt.email && (
                                                <div className="text-xs text-white/70 mb-1">
                                                    <span className="text-white/50">Email :</span> {attempt.email}
                                                </div>
                                            )}

                                            {attempt.institution_name && (
                                                <div className="text-xs text-white/70">
                                                    <span className="text-white/50">Établissement :</span> {attempt.institution_name}
                                                </div>
                                            )}

                                            {attempt.rejection_reason && (
                                                <div className="text-xs text-red-400 mt-2">
                                                    <span className="font-semibold">Raison :</span> {attempt.rejection_reason}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedVerification.document_url && (
                            <div className="glass rounded-xl p-5 border border-white/10 mb-8">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-violet-400" />
                                    Justificatif
                                </h3>
                                <button
                                    onClick={() => handleViewDocument(selectedVerification.document_url!)}
                                    disabled={isOpeningDoc}
                                    className="w-full flex items-center gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-lg hover:bg-white/[0.05] transition group text-left disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                        {isOpeningDoc ? <Loader2 className="w-5 h-5 text-violet-400 animate-spin" /> : <FileText className="w-5 h-5 text-violet-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white font-medium group-hover:text-violet-400 transition">
                                            {isOpeningDoc ? 'Génération du lien sécurisé...' : 'Ouvrir le document'}
                                        </p>
                                        <p className="text-xs text-white/60">
                                            Lien sécurisé temporaire (valable 7 jours)
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white transition" />
                                </button>
                            </div>
                        )}

                        {selectedVerification.status === 'pending' && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleVerify(selectedVerification.id)}
                                    className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition font-semibold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Valider la vérification
                                </button>
                                <button
                                    onClick={() => handleReject(selectedVerification.id)}
                                    className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-semibold flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Refuser
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}