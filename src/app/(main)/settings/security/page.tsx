"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
    Shield, Key, Smartphone, Laptop, Globe, AlertTriangle,
    CheckCircle2, XCircle, ChevronRight, Lock, Mail, RefreshCw,
    Copy, Download, Loader2, KeyRound, ShieldCheck, AlertCircle, EyeOff, Eye
} from "lucide-react";
import * as OTPAuth from "otpauth";
import { QRCodeSVG } from "qrcode.react";

// Types pour les sessions et l'activité
interface Session {
    id: string;
    device: string;
    browser: string;
    location: string;
    isCurrent: boolean;
    lastActive: string;
}

interface Activity {
    id: string;
    action: string;
    status: 'success' | 'warning' | 'danger';
    device: string;
    location: string;
    date: string;
}

export default function SecurityPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);

    // ✅ Ajout du state user pour accéder à l'email et l'ID
    const [user, setUser] = useState<any>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    // États pour le modal 2FA
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [twoFAStep, setTwoFAStep] = useState(1);
    const [twoFASecret, setTwoFASecret] = useState("");
    const [twoFACode, setTwoFACode] = useState("");
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [twoFAError, setTwoFAError] = useState("");
    const [is2FASubmitting, setIs2FASubmitting] = useState(false);

    // États pour le modal Mot de passe
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);
    const [isPwdLoading, setIsPwdLoading] = useState(false);
    const [pwdError, setPwdError] = useState("");
    const [pwdSuccess, setPwdSuccess] = useState("");

    // Données mockées pour l'UI
    const [sessions] = useState<Session[]>([
        { id: '1', device: 'Windows', browser: 'Chrome', location: 'France, Paris', isCurrent: true, lastActive: 'Actuellement' },
        { id: '2', device: 'Android', browser: 'N.O.A.H. App', location: 'France, Paris', isCurrent: false, lastActive: 'Il y a 2 heures' },
        { id: '3', device: 'Windows', browser: 'Firefox', location: 'France, Lyon', isCurrent: false, lastActive: 'Il y a 3 jours' },
    ]);

    const [activities] = useState<Activity[]>([
        { id: '1', action: 'Connexion réussie', status: 'success', device: 'Windows · Chrome', location: 'France', date: "Aujourd'hui à 14:30" },
        { id: '2', action: 'Mot de passe modifié', status: 'success', device: 'Windows · Chrome', location: 'France', date: 'Il y a 3 mois' },
        { id: '3', action: 'Tentative de connexion échouée', status: 'warning', device: 'Inconnu · Safari', location: 'Roumanie', date: 'Il y a 5 jours' },
    ]);

    useEffect(() => {
        loadSecurityData();
    }, []);

    const loadSecurityData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user); // ✅ Stocker l'utilisateur
                setIsEmailVerified(!!user.email_confirmed_at);

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('two_factor_enabled')
                    .eq('id', user.id)
                    .single();

                setIs2FAEnabled(profile?.two_factor_enabled || false);
            }
        } catch (error) {
            console.error("Erreur chargement données sécurité:", error);
        } finally {
            setLoading(false);
        }
    };

    const open2FAModal = () => {
        setTwoFAError("");

        const newTotp = new OTPAuth.TOTP({
            issuer: 'N.O.A.H.',
            label: user?.email || 'user@noah.ai', // ✅ Utiliser user.email
            algorithm: 'SHA1',
            digits: 6,
            period: 30
        });

        const secretBase32 = newTotp.secret.base32;
        setTwoFASecret(secretBase32);
        setTwoFAStep(1);
        setShow2FAModal(true);
    };

    //Mot de passe
    const openPasswordModal = () => {
        setShowPasswordModal(true);
        setPwdError("");
        setPwdSuccess("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdError("");
        setPwdSuccess("");

        if (newPassword !== confirmPassword) {
            setPwdError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        const metCount = requirements.filter(r => r.met).length;
        if (metCount < requirements.length) {
            setPwdError("Le nouveau mot de passe ne respecte pas tous les critères de sécurité.");
            return;
        }

        if (newPassword === currentPassword) {
            setPwdError("Le nouveau mot de passe doit être différent de l'ancien.");
            return;
        }

        setIsPwdLoading(true);

        try {
            // Supabase gère la session, on envoie juste le nouveau mot de passe
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            setPwdSuccess("✅ Mot de passe modifié avec succès !");

            setTimeout(() => {
                setShowPasswordModal(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPwdSuccess("");
            }, 2000);

        } catch (err: any) {
            setPwdError(err.message || "Une erreur est survenue lors de la modification.");
        } finally {
            setIsPwdLoading(false);
        }
    };

    // Logique de validation du mot de passe (à mettre en dehors des fonctions ou juste au-dessus du return)
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

    const verify2FACode = async () => {
        if (twoFACode.length !== 6) {
            setTwoFAError("Veuillez entrer un code à 6 chiffres");
            return;
        }

        setIs2FASubmitting(true);
        setTwoFAError("");

        try {
            const totpForVerify = new OTPAuth.TOTP({
                issuer: 'N.O.A.H.',
                label: user?.email || 'user@noah.ai', // ✅ Utiliser user.email
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: OTPAuth.Secret.fromBase32(twoFASecret)
            });

            const delta = totpForVerify.validate({ token: twoFACode, window: 1 });

            if (delta === null) {
                const localCode = totpForVerify.generate();
                throw new Error(`Code invalide. Code attendu : ${localCode}`);
            }

            const codes = Array.from({ length: 8 }, () =>
                Array.from({ length: 8 }, () =>
                    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]
                ).join("")
            );

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    two_factor_secret: twoFASecret,
                    two_factor_enabled: true,
                    recovery_codes: codes
                })
                .eq('id', user.id); // ✅ Utiliser user.id

            if (updateError) throw updateError;

            setRecoveryCodes(codes);
            setTwoFAStep(3);
            setIs2FAEnabled(true);
        } catch (err: any) {
            setTwoFAError(err.message || "Code invalide");
        } finally {
            setIs2FASubmitting(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copié dans le presse-papiers !");
    };

    const downloadCodes = () => {
        const text = "Codes de récupération N.O.A.H.\n\n" + recoveryCodes.join("\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "noah-recovery-codes.txt";
        a.click();
    };

    // Calcul dynamique du score de sécurité
    const securityScore = (isEmailVerified ? 50 : 0) + (is2FAEnabled ? 50 : 0);

    const handleDisconnectSession = (id: string) => {
        alert("Fonctionnalité de déconnexion de session à implémenter avec une table dédiée.");
    };

    const handleDisconnectAll = () => {
        if (confirm("Voulez-vous vraiment déconnecter tous les autres appareils ?")) {
            alert("Toutes les autres sessions ont été déconnectées.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-display text-2xl font-bold text-white mb-2">Sécurité du compte</h1>
                <p className="text-white/60">Gérez la protection de votre compte et surveillez votre activité.</p>
            </div>

            {/* Score de sécurité dynamique */}
            <div className="glass rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-violet-500/5 to-transparent">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-white">État de sécurité</h2>
                            <p className="text-sm text-white/60">
                                {securityScore >= 80 ? 'Excellent niveau de sécurité' :
                                    securityScore >= 50 ? 'Niveau de sécurité moyen' : 'Sécurité à améliorer'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-white">{securityScore}%</span>
                    </div>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                            securityScore >= 80 ? 'bg-emerald-500' : securityScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${securityScore}%` }}
                    ></div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className={`flex items-center gap-2 ${isEmailVerified ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isEmailVerified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>Adresse e-mail vérifiée</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mot de passe configuré</span>
                    </div>
                    <div className={`flex items-center gap-2 ${is2FAEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {is2FAEnabled ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        <span>Authentification à deux facteurs {is2FAEnabled ? 'activée' : 'non activée'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aucune session suspecte détectée</span>
                    </div>
                </div>
            </div>

            {/* Mot de passe */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Key className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">Mot de passe</h3>
                            <p className="text-sm text-white/60 mb-3">Changez régulièrement votre mot de passe pour plus de sécurité.</p>
                            <button
                                onClick={openPasswordModal}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition"
                            >
                                Modifier le mot de passe
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2FA - OUVERTURE DIRECTE DU MODAL */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <Smartphone className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">Authentification à deux facteurs (2FA)</h3>
                            <p className="text-sm text-white/60 mb-3">
                                {is2FAEnabled
                                    ? "Votre compte est protégé par une authentification à deux facteurs."
                                    : "Ajoutez une couche de sécurité supplémentaire avec Google ou Microsoft Authenticator."}
                            </p>
                            {/* ✅ Remplacement du Link par un button qui ouvre le modal */}
                            <button
                                onClick={open2FAModal}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                                    is2FAEnabled
                                        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                            >
                                {is2FAEnabled ? 'Gérer le 2FA' : 'Activer le 2FA'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sessions actives */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-violet-400" />
                        <h3 className="font-semibold text-white">Sessions actives</h3>
                    </div>
                    <button
                        onClick={handleDisconnectAll}
                        className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                        Déconnecter les autres
                    </button>
                </div>

                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${session.isCurrent ? 'bg-emerald-400' : 'bg-white/30'}`} />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {session.device} · {session.browser}
                                        {session.isCurrent && <span className="ml-2 text-xs text-emerald-400">(Cet appareil)</span>}
                                    </p>
                                    <p className="text-xs text-white/50 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> {session.location} · {session.lastActive}
                                    </p>
                                </div>
                            </div>
                            {!session.isCurrent && (
                                <button
                                    onClick={() => handleDisconnectSession(session.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition text-white/40 hover:text-red-400"
                                    title="Déconnecter"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Activité de sécurité */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-semibold text-white">Activité de sécurité récente</h3>
                </div>

                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                activity.status === 'success' ? 'bg-emerald-400' :
                                    activity.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                            }`} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-white">{activity.action}</p>
                                    <span className="text-xs text-white/40">{activity.date}</span>
                                </div>
                                <p className="text-xs text-white/50 flex items-center gap-2">
                                    <span>{activity.device}</span>
                                    <span>·</span>
                                    <span>{activity.location}</span>
                                </p>
                                {activity.status === 'warning' && (
                                    <button className="mt-2 text-xs text-red-400 hover:text-red-300 underline">
                                        Ce n'était pas moi
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ==================== MODAL MOT DE PASSE ==================== */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="glass rounded-2xl border border-white/10 p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="font-display text-xl font-bold text-white">Modifier le mot de passe</h2>
                                    <p className="text-xs text-white/50">Assurez-vous d'utiliser un mot de passe unique.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-5">
                            {/* Mot de passe actuel */}
                            <div>
                                <label className="text-xs font-semibold text-white/60 mb-2 block uppercase tracking-wider">Mot de passe actuel</label>
                                <div className="relative group">
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition">
                                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* Nouveau mot de passe */}
                            <div>
                                <label className="text-xs font-semibold text-white/60 mb-2 block uppercase tracking-wider">Nouveau mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition pr-10"
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

                                {/* Indicateur de force stylé */}
                                {newPassword.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-white/60">Force du mot de passe</span>
                                            <span className={`text-xs font-bold ${strengthPercentage <= 40 ? 'text-red-400' : strengthPercentage <= 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                {strengthPercentage <= 40 ? 'Faible' : strengthPercentage <= 70 ? 'Moyen' : 'Fort'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-500 ease-out ${getStrengthColor()}`} style={{ width: `${strengthPercentage}%` }} />
                                        </div>

                                        {/* Checklist des critères */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                            {requirements.map((req, index) => (
                                                <div key={index} className={`flex items-center gap-2 text-xs transition-all duration-300 ${req.met ? 'text-emerald-400' : 'text-white/40'}`}>
                                                    {req.met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current opacity-50" />}
                                                    {req.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirmation */}
                            <div>
                                <label className="text-xs font-semibold text-white/60 mb-2 block uppercase tracking-wider">Confirmer le nouveau mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full bg-noah-panel border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-1 transition pr-10 ${
                                            confirmPassword && confirmPassword !== newPassword
                                                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50'
                                                : confirmPassword && confirmPassword === newPassword
                                                    ? 'border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/50'
                                                    : 'border-noah-border focus:border-blue-500/50 focus:ring-blue-500/50'
                                        }`}
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
                                {confirmPassword && confirmPassword !== newPassword && (
                                    <AlertCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                                )}
                                {confirmPassword && confirmPassword === newPassword && (
                                    <CheckCircle2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                )}
                            </div>

                            {/* Messages d'erreur / succès */}
                            {pwdError && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2 animate-in slide-in-from-top-1">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    {pwdError}
                                </div>
                            )}
                            {pwdSuccess && (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-2 animate-in slide-in-from-top-1">
                                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    {pwdSuccess}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPwdLoading || metCount < requirements.length || newPassword !== confirmPassword}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                >
                                    {isPwdLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Modification...</>
                                    ) : (
                                        <><KeyRound className="w-4 h-4" /> Modifier le mot de passe</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================== MODAL 2FA ==================== */}
            {show2FAModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass rounded-2xl border border-white/10 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-xl font-bold text-white">
                                {twoFAStep === 1 ? 'Activer le 2FA' : twoFAStep === 2 ? 'Vérifier le code' : 'Codes de récupération'}
                            </h2>
                            <button
                                onClick={() => setShow2FAModal(false)}
                                className="text-white/60 hover:text-white"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {twoFAError && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm whitespace-pre-line">
                                {twoFAError}
                            </div>
                        )}

                        {/* Étape 1 : QR Code */}
                        {twoFAStep === 1 && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <p className="text-sm text-white/70 mb-4">Scannez ce QR code avec votre application d'authentification :</p>
                                    <div className="bg-white p-6 rounded-xl inline-block mb-4">
                                        <QRCodeSVG
                                            value={`otpauth://totp/N.O.A.H.${user?.email}?secret=${twoFASecret}&issuer=N.O.A.H.&algorithm=SHA1&digits=6&period=30`}
                                            size={200}
                                            level="H"
                                        />
                                    </div>
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4 text-left">
                                        <p className="text-xs text-amber-400 font-medium flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span>
                                                <strong>Important :</strong> Si vous avez déjà ajouté "N.O.A.H." dans votre application, <strong>supprimez-le d'abord</strong> avant de scanner ce nouveau QR code.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTwoFAStep(2)}
                                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
                                >
                                    Continuer
                                </button>
                            </div>
                        )}

                        {/* Étape 2 : Code */}
                        {twoFAStep === 2 && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <p className="text-sm text-white/70 mb-4">Entrez le code à 6 chiffres affiché dans votre application :</p>
                                </div>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={twoFACode}
                                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-center text-2xl font-mono text-white placeholder-white/30 outline-none focus:border-emerald-500/50 tracking-widest"
                                    placeholder="000000"
                                    autoFocus
                                />
                                <button
                                    onClick={verify2FACode}
                                    disabled={is2FASubmitting || twoFACode.length !== 6}
                                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {is2FASubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Vérifier et activer
                                </button>
                                <button
                                    onClick={() => setTwoFAStep(1)}
                                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition"
                                >
                                    Retour
                                </button>
                            </div>
                        )}

                        {/* Étape 3 : Codes */}
                        {twoFAStep === 3 && (
                            <div className="space-y-4">
                                <div className="text-center">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                    <h3 className="font-semibold text-white mb-2">2FA activé avec succès !</h3>
                                    <p className="text-sm text-white/70 mb-4">Voici vos codes de récupération. Conservez-les en lieu sûr :</p>
                                </div>
                                <div className="bg-noah-panel rounded-xl p-4 border border-white/10 space-y-2">
                                    {recoveryCodes.map((code, i) => (
                                        <div key={i} className="text-xs font-mono text-white text-center">{code}</div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={downloadCodes} className="flex-1 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition text-sm flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" /> Télécharger
                                    </button>
                                    <button onClick={() => copyToClipboard(recoveryCodes.join('\n'))} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition text-sm flex items-center justify-center gap-2">
                                        <Copy className="w-4 h-4" /> Copier
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setShow2FAModal(false);
                                        setTwoFAStep(1);
                                        setTwoFACode("");
                                        setRecoveryCodes([]);
                                    }}
                                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
                                >
                                    Terminer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}