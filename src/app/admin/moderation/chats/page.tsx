"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    MessageSquareWarning,
    AlertTriangle,
    Shield,
    UserX,
    Bot,
    Search,
    Filter,
    Eye,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    AlertOctagon,
    MessageSquare,
    User,
    Ban,
    Trash2
} from "lucide-react";

interface ChatReport {
    id: string;
    conversation_id: string;
    message_id: string;
    message_content: string;
    sender_type: 'user' | 'assistant';
    report_reason: string;
    report_category: string;
    severity_level: 'low' | 'medium' | 'high' | 'critical';
    ai_confidence_score: number;
    context_before: string | null;
    status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
    created_at: string;
    user_id: string;
    user_email?: string;
    user_name?: string;
}

export default function AIChatModerationPage() {
    const supabase = createClient();
    const [reports, setReports] = useState<ChatReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<ChatReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "high" | "critical">("pending");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('ai_chat_reports')
            .select(`
        *,
        profiles:auth.users!user_id (
          email,
          full_name:raw_user_meta_data->>full_name
        )
      `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Erreur chargement:", error);
        } else {
            const formatted = (data || []).map((item: any) => ({
                ...item,
                user_email: item.profiles?.email,
                user_name: item.profiles?.full_name
            }));
            setReports(formatted as ChatReport[]);
        }
        setLoading(false);
    };

    const getSeverityColor = (severity: string) => {
        const colors = {
            low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
            high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            critical: "bg-red-500/10 text-red-400 border-red-500/20"
        };
        return colors[severity as keyof typeof colors] || colors.low;
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, any> = {
            illegal_content: AlertOctagon,
            dangerous_content: AlertTriangle,
            harassment: UserX,
            self_harm: AlertTriangle,
            sexual_content: Shield,
            violence: AlertOctagon,
            hate_speech: UserX,
            suspicious_request: AlertTriangle,
            jailbreak_attempt: Bot,
            prompt_injection: Bot
        };
        return icons[category] || AlertTriangle;
    };

    const handleAction = async (reportId: string, action: string) => {
        const { error } = await supabase
            .from('ai_chat_reports')
            .update({
                status: 'action_taken',
                action_taken: action,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', reportId);

        if (!error) {
            loadReports();
        }
    };

    const filteredReports = reports.filter(report => {
        if (filter === "pending") return report.status === "pending";
        if (filter === "high") return report.severity_level === "high" || report.severity_level === "critical";
        if (filter === "critical") return report.severity_level === "critical";
        return true;
    }).filter(report =>
        report.message_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                    <MessageSquareWarning className="w-7 h-7 text-amber-400" />
                    Modération des Conversations IA
                </h1>
                <p className="text-white/60 mt-1">
                    Signalements automatiques des messages suspects ou inappropriés
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-4 border border-amber-500/20">
                    <div className="text-2xl font-bold text-white">
                        {reports.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="text-sm text-white/60">En attente</div>
                </div>
                <div className="glass rounded-xl p-4 border border-red-500/20">
                    <div className="text-2xl font-bold text-white">
                        {reports.filter(r => r.severity_level === 'critical').length}
                    </div>
                    <div className="text-sm text-white/60">Critiques</div>
                </div>
                <div className="glass rounded-xl p-4 border border-orange-500/20">
                    <div className="text-2xl font-bold text-white">
                        {reports.filter(r => r.sender_type === 'user').length}
                    </div>
                    <div className="text-sm text-white/60">Utilisateurs signalés</div>
                </div>
                <div className="glass rounded-xl p-4 border border-violet-500/20">
                    <div className="text-2xl font-bold text-white">
                        {reports.filter(r => r.sender_type === 'assistant').length}
                    </div>
                    <div className="text-sm text-white/60">Réponses IA limites</div>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Rechercher un message ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-noah-panel border border-noah-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/50"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="bg-noah-panel border border-noah-border rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                >
                    <option value="pending">En attente</option>
                    <option value="high">Haute priorité</option>
                    <option value="critical">Critiques uniquement</option>
                    <option value="all">Tous</option>
                </select>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Liste des signalements */}
                <div className="glass rounded-2xl border border-white/10">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-semibold text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Signalements récents
                        </h2>
                        <button
                            onClick={loadReports}
                            className="text-xs text-white/60 hover:text-white"
                        >
                            🔄 Actualiser
                        </button>
                    </div>
                    <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-white/60">Chargement...</div>
                        ) : filteredReports.length === 0 ? (
                            <div className="p-8 text-center text-white/60">Aucun signalement</div>
                        ) : (
                            filteredReports.map((report) => {
                                const CategoryIcon = getCategoryIcon(report.report_category);
                                return (
                                    <button
                                        key={report.id}
                                        onClick={() => setSelectedReport(report)}
                                        className={`w-full p-4 text-left hover:bg-white/[0.03] transition ${
                                            selectedReport?.id === report.id ? "bg-white/[0.05]" : ""
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(report.severity_level)}`}>
                                                <CategoryIcon className="w-3 h-3" />
                                                {report.report_category.replace('_', ' ')}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {report.sender_type === 'assistant' ? (
                                                    <Bot className="w-3.5 h-3.5 text-violet-400" />
                                                ) : (
                                                    <User className="w-3.5 h-3.5 text-blue-400" />
                                                )}
                                                <span className="text-xs text-white/40">
                          {new Date(report.created_at).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                          })}
                        </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-white/80 line-clamp-2 mb-2 font-mono bg-white/[0.03] p-2 rounded">
                                            {report.message_content}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-white/50">
                                            <span>Confiance IA: {Math.round(report.ai_confidence_score * 100)}%</span>
                                            <span>{report.user_name || report.user_email || 'Anonyme'}</span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Détails du signalement */}
                <div className="glass rounded-2xl border border-white/10 p-6">
                    {selectedReport ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display text-lg font-bold text-white">Détails du signalement</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedReport.severity_level)}`}>
                  {selectedReport.severity_level.toUpperCase()}
                </span>
                            </div>

                            {/* Message signalé */}
                            <div className={`rounded-xl p-4 border ${
                                selectedReport.sender_type === 'assistant'
                                    ? 'bg-violet-500/5 border-violet-500/20'
                                    : 'bg-blue-500/5 border-blue-500/20'
                            }`}>
                                <div className="flex items-center gap-2 mb-3">
                                    {selectedReport.sender_type === 'assistant' ? (
                                        <>
                                            <Bot className="w-4 h-4 text-violet-400" />
                                            <span className="text-sm font-medium text-violet-400">Réponse de l'IA</span>
                                        </>
                                    ) : (
                                        <>
                                            <User className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm font-medium text-blue-400">Message utilisateur</span>
                                        </>
                                    )}
                                </div>
                                <p className="text-white/90 leading-relaxed font-mono text-sm">
                                    {selectedReport.message_content}
                                </p>
                            </div>

                            {/* Informations utilisateur */}
                            <div className="bg-noah-panel rounded-xl p-4 border border-white/10">
                                <h3 className="text-sm font-semibold text-white mb-3">Informations utilisateur</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Email:</span>
                                        <span className="text-white">{selectedReport.user_email || 'Inconnu'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Nom:</span>
                                        <span className="text-white">{selectedReport.user_name || 'Anonyme'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Confiance IA:</span>
                                        <span className="text-white font-mono">
                      {Math.round(selectedReport.ai_confidence_score * 100)}%
                    </span>
                                    </div>
                                </div>
                            </div>

                            {/* Raison du signalement */}
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">Raison du signalement</h3>
                                <p className="text-sm text-white/70 bg-white/[0.03] rounded-lg p-3 border border-white/5">
                                    {selectedReport.report_reason}
                                </p>
                            </div>

                            {/* Contexte */}
                            {selectedReport.context_before && (
                                <div>
                                    <h3 className="text-sm font-semibold text-white mb-2">Contexte (message précédent)</h3>
                                    <p className="text-xs text-white/60 bg-white/[0.03] rounded-lg p-3 border border-white/5 font-mono">
                                        {selectedReport.context_before}
                                    </p>
                                </div>
                            )}

                            {/* Actions de modération */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <h3 className="text-sm font-semibold text-white">Actions de modération</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleAction(selectedReport.id, 'dismissed')}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition text-sm font-medium"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Ignorer
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedReport.id, 'warning')}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition text-sm font-medium"
                                    >
                                        <AlertTriangle className="w-4 h-4" />
                                        Avertissement
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedReport.id, 'account_suspended')}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition text-sm font-medium"
                                    >
                                        <Ban className="w-4 h-4" />
                                        Suspendre compte
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedReport.id, 'conversation_blocked')}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition text-sm font-medium"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Bloquer conversation
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-white/40 py-20">
                            <MessageSquareWarning className="w-12 h-12 mb-3 opacity-50" />
                            <p className="text-sm">Sélectionnez un signalement pour voir les détails</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}