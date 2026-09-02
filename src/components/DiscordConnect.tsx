"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";

export function DiscordConnect() {
    const supabase = createClient();
    const [discordId, setDiscordId] = useState("");
    const [discordUsername, setDiscordUsername] = useState("");
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
    const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

    useEffect(() => {
        loadDiscordInfo();

        // ✅ Vérification automatique toutes les 3 minutes (180000 ms)
        const interval = setInterval(() => {
            if (autoSyncEnabled) {
                console.log("🔄 Vérification périodique des rôles Discord...");
                handleSyncRoles(true); // true = mode silencieux
            }
        }, 180000);

        return () => clearInterval(interval);
    }, [autoSyncEnabled]);

    const loadDiscordInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
            .from("profiles")
            .select("discord_id, discord_username, plan")
            .eq("id", user.id)
            .single();

        if (profile?.discord_id) {
            setDiscordId(profile.discord_id);
            setDiscordUsername(profile.discord_username || "");
            setConnected(true);

            // ✅ Sync automatique au chargement
            console.log("🔄 Sync automatique au chargement (plan:", profile.plan, ")");
            await handleSyncRoles(true);
        }
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/discord/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ discordId, discordUsername }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            setConnected(true);
            setSuccess("✅ Compte Discord connecté et rôles synchronisés !");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message || "Erreur de connexion");
        } finally {
            setLoading(false);
        }
    };

    const handleSyncRoles = async (silent: boolean = false) => {
        if (!silent) setLoading(true);
        if (!silent) setError("");

        try {
            const response = await fetch("/api/discord/sync-roles", {
                method: "POST",
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            setLastSyncAt(new Date());

            if (!silent) {
                setSuccess("✅ Rôles Discord mis à jour !");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                console.log("✅ Rôles Discord synchronisés (auto)");
            }
        } catch (err: any) {
            if (!silent) {
                setError(err.message);
            } else {
                console.log("ℹ️ Sync auto échouée (non bloquant):", err.message);
            }
        } finally {
            if (!silent) setLoading(false);
        }
    };

    if (connected) {
        return (
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">Discord connecté</h3>
                            <p className="text-sm text-white/60">
                                {discordUsername || discordId}
                            </p>
                            {lastSyncAt && (
                                <p className="text-xs text-white/40 mt-1">
                                    Dernière sync : {lastSyncAt.toLocaleTimeString('fr-FR')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Toggle auto-sync */}
                        <button
                            onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                            className={`px-3 py-2 rounded-lg border text-xs transition flex items-center gap-2 ${
                                autoSyncEnabled
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-white/5 border-white/10 text-white/60"
                            }`}
                            title={autoSyncEnabled ? "Auto-sync activée" : "Auto-sync désactivée"}
                        >
                            <RefreshCw className={`w-3 h-3 ${autoSyncEnabled ? "animate-spin" : ""}`} />
                            Auto
                        </button>

                        <button
                            onClick={() => handleSyncRoles(false)}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm hover:bg-indigo-500/20 transition disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Sync rôles
                        </button>
                    </div>
                </div>

                {success && (
                    <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {success}
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-white mb-1">Connecter Discord</h3>
                    <p className="text-sm text-white/60">
                        Connectez votre compte pour recevoir vos rôles automatiquement
                    </p>
                </div>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-white/60 mb-2 block">
                        ID Discord (clic droit sur ton profil → Copier l'ID)
                    </label>
                    <input
                        type="text"
                        value={discordId}
                        onChange={(e) => setDiscordId(e.target.value)}
                        placeholder="123456789012345678"
                        className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500/50"
                        required
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-white/60 mb-2 block">
                        Nom d'utilisateur Discord (optionnel)
                    </label>
                    <input
                        type="text"
                        value={discordUsername}
                        onChange={(e) => setDiscordUsername(e.target.value)}
                        placeholder="FrozerYTB#1234"
                        className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500/50"
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !discordId}
                    className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                    Connecter Discord
                </button>
            </form>
        </div>
    );
}