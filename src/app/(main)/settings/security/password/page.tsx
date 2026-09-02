"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft,
    ShieldCheck, Loader2, KeyRound
} from "lucide-react";

export default function ChangePasswordPage() {
    const router = useRouter();
    const supabase = createClient();

    // États du formulaire
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // États d'affichage
    const [showPasswords, setShowPasswords] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Validation du mot de passe
    const requirements = [
        { label: "Au moins 12 caractères", met: newPassword.length >= 12 },
        { label: "Une lettre majuscule", met: /[A-Z]/.test(newPassword) },
        { label: "Une lettre minuscule", met: /[a-z]/.test(newPassword) },
        { label: "Un chiffre", met: /[0-9]/.test(newPassword) },
        { label: "Un caractère spécial (!@#$%^&*)", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    ];

    const metCount = requirements.filter(r => r.met).length;
    const strengthPercentage = (metCount / requirements.length) * 100;

    const getStrengthColor = () => {
        if (strengthPercentage <= 40) return "bg-red-500";
        if (strengthPercentage <= 70) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const getStrengthText = () => {
        if (strengthPercentage <= 40) return "Faible";
        if (strengthPercentage <= 70) return "Moyen";
        return "Fort";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validations frontend
        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        if (metCount < requirements.length) {
            setError("Le nouveau mot de passe ne respecte pas tous les critères de sécurité.");
            return;
        }

        if (newPassword === currentPassword) {
            setError("Le nouveau mot de passe doit être différent de l'ancien.");
            return;
        }

        setIsLoading(true);

        try {
            // Mise à jour via Supabase Auth
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            setSuccess("✅ Votre mot de passe a été modifié avec succès.");

            // Reset du formulaire
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Redirection après 2 secondes
            setTimeout(() => {
                router.push("/settings/security");
            }, 2000);

        } catch (err: any) {
            console.error("Erreur changement mot de passe:", err);
            setError(err.message || "Une erreur est survenue lors de la modification.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header avec retour */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-white/5 transition text-white/60 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="font-display text-2xl font-bold text-white">Modifier le mot de passe</h1>
                    <p className="text-white/60 text-sm">Assurez-vous d'utiliser un mot de passe unique et sécurisé.</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-white/10 space-y-6">

                    {/* Mot de passe actuel */}
                    <div>
                        <label className="text-xs font-semibold text-white/60 mb-2 block uppercase tracking-wider">
                            Mot de passe actuel
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                            >
                                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Nouveau mot de passe */}
                    <div>
                        <label className="text-xs font-semibold text-white/60 mb-2 block uppercase tracking-wider">
                            Nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Indicateur de force */}
                        {newPassword.length > 0 && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs text-white/60">Force du mot de passe</span>
                                    <span className={`text-xs font-medium ${
                                        strengthPercentage <= 40 ? 'text-red-400' :
                                            strengthPercentage <= 70 ? 'text-amber-400' : 'text-emerald-400'
                                    }`}>
                                        {getStrengthText()}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()}`}
                                        style={{ width: `${strengthPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Liste des critères */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {requirements.map((req, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 text-xs transition ${
                                        req.met ? 'text-emerald-400' : 'text-white/40'
                                    }`}
                                >
                                    {req.met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                                    {req.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Confirmation */}
                    <div>
                        <label className="text-xs font-semibold text-white/60 mb-2 block uppercase tracking-wider">
                            Confirmer le nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full bg-noah-panel border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/50 transition ${
                                    confirmPassword && confirmPassword !== newPassword
                                        ? 'border-red-500/50'
                                        : 'border-noah-border'
                                }`}
                                placeholder="••••••••"
                                required
                            />
                            {confirmPassword && confirmPassword !== newPassword && (
                                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                            )}
                            {confirmPassword && confirmPassword === newPassword && (
                                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                            )}
                        </div>
                    </div>

                    {/* Messages d'erreur / succès */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {success}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || metCount < requirements.length || newPassword !== confirmPassword}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Modification...
                                </>
                            ) : (
                                <>
                                    <KeyRound className="w-4 h-4" />
                                    Modifier le mot de passe
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Note de sécurité */}
                <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-white/70">
                        <p className="font-medium text-white mb-1">Conseil de sécurité</p>
                        <p>
                            Après avoir modifié votre mot de passe, nous vous recommandons de vérifier vos
                            <button className="text-blue-400 hover:text-blue-300 ml-1 underline">sessions actives</button>
                            pour vous assurer qu'aucun appareil inconnu n'est connecté.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}