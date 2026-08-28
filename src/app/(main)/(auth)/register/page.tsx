"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogoStatic } from "@/components/logo/LogoStatic";
import { Eye, EyeOff, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

// Liste des pseudos réservés
const RESERVED_NAMES = [
  "admin", "administrator", "support", "n.o.a.h.", "noah", "openai", 
  "chatgpt", "moderator", "root", "system", "help"
];

// Liste (simplifiée) des domaines d'e-mail jetables à bloquer
const DISPOSABLE_DOMAINS = [
  "10minutemail.com", "guerrillamail.com", "tempmail.com", "mailinator.com", 
  "yopmail.com", "throwawaymail.com", "temp-mail.org"
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calcul de la robustesse du mot de passe
  const getPasswordStrength = (pwd: string, userName: string, userEmail: string) => {
    let score = 0;
    const checks = {
      length14: pwd.length >= 14,
      length16: pwd.length >= 16,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
      noName: !userName || !pwd.toLowerCase().includes(userName.toLowerCase()),
      noEmail: !userEmail || !pwd.toLowerCase().includes(userEmail.split('@')[0].toLowerCase()),
      noForbidden: !/noah|admin|password|123456|azerty/i.test(pwd)
    };

    if (checks.length14) score += 1;
    if (checks.length16) score += 1;
    if (checks.upper) score += 1;
    if (checks.lower) score += 1;
    if (checks.number) score += 1;
    if (checks.special) score += 1;
    if (checks.noName && checks.noEmail && checks.noForbidden) score += 1;

    // Score max 7, on le ramène à une échelle de 0 à 5
    const normalizedScore = Math.min(5, Math.max(0, score - 1));

    const levels = [
      { label: "Très faible", color: "bg-red-500", textColor: "text-red-400", icon: ShieldAlert },
      { label: "Faible", color: "bg-orange-500", textColor: "text-orange-400", icon: ShieldAlert },
      { label: "Moyen", color: "bg-yellow-500", textColor: "text-yellow-400", icon: Shield },
      { label: "Fort", color: "bg-emerald-500", textColor: "text-emerald-400", icon: ShieldCheck },
      { label: "Excellent", color: "bg-blue-500", textColor: "text-blue-400", icon: ShieldCheck },
    ];

    return { score: normalizedScore, ...levels[normalizedScore], checks };
  };

  const strength = getPasswordStrength(password, name, email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validations Frontend
    const nameLower = name.toLowerCase().trim();
    if (RESERVED_NAMES.includes(nameLower)) {
      return setError("Ce pseudo est réservé ou non autorisé.");
    }

    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (DISPOSABLE_DOMAINS.includes(emailDomain)) {
      return setError("Les adresses e-mail temporaires ou jetables ne sont pas autorisées.");
    }

    if (password !== confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    if (strength.score < 3) { // Minimum "Moyen" requis, idéalement "Fort"
      return setError("Le mot de passe est trop faible. Il doit contenir au moins 14 caractères, des majuscules, minuscules, chiffres et caractères spéciaux.");
    }

    if (!dateOfBirth) {
      return setError("La date de naissance est obligatoire pour la vérification de l'âge.");
    }

    setLoading(true);

    try {
      // 2. Appel à Supabase
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            date_of_birth: dateOfBirth,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      // 3. Succès : L'utilisateur doit vérifier son e-mail
      setSuccess(true);
      
      // Note: La création du profil dans la table 'profiles' se fait automatiquement 
      // grâce au trigger Supabase que nous avons configuré précédemment.

    } catch (err: any) {
      console.error(err);
      // Gestion des erreurs spécifiques (ex: e-mail déjà utilisé)
      if (err.message.includes("User already registered")) {
        setError("Cette adresse e-mail est déjà associée à un compte.");
      } else {
        setError(err.message || "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">Compte créé avec succès !</h1>
            <p className="text-noah-muted text-sm mb-6">
              Un lien de vérification a été envoyé à <strong className="text-white">{email}</strong>. 
              Veuillez cliquer sur ce lien pour activer votre compte avant de pouvoir vous connecter.
            </p>
            <Link 
              href="/login" 
              className="btn-primary inline-block w-full py-3 rounded-xl font-medium text-white"
            >
              Aller à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="glass-strong rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <LogoStatic />
            <span className="font-display font-bold text-lg">N.O.A.H.</span>
          </div>

          <h1 className="font-display text-2xl font-bold mb-2 text-center">
            Créer un compte
          </h1>
          <p className="text-noah-muted text-sm mb-6 text-center">
            Rejoignez N.O.A.H. et découvrez l'IA nouvelle génération.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Pseudo */}
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Pseudo (unique)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                className="w-full bg-noah-panel border border-noah-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-noah-violet/50 transition"
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Date de naissance (Vérification de l'âge)
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-noah-panel border border-noah-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-noah-violet/50 transition text-noah-muted"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Adresse e-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="w-full bg-noah-panel border border-noah-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-noah-violet/50 transition"
              />
              <p className="text-[10px] text-noah-muted mt-1">
                Les adresses temporaires (10minutemail, etc.) sont bloquées.
              </p>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={14}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 14 caractères"
                  className="w-full bg-noah-panel border border-noah-border rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-noah-violet/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-noah-muted hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Jauge de robustesse */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1 h-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-colors duration-300 ${
                          i <= strength.score ? strength.color : "bg-noah-border"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={strength.textColor}>{strength.label}</span>
                    <span className="text-noah-muted">
                      {strength.checks.length14 ? "✓ 14+ car." : "✗ 14+ car."} 
                      {" "}
                      {strength.checks.special ? "✓ Spécial" : "✗ Spécial"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmation Mot de passe */}
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez votre mot de passe"
                  className={`w-full bg-noah-panel border rounded-lg px-3 py-2.5 pr-10 text-sm outline-none transition ${
                    confirmPassword && password !== confirmPassword 
                      ? "border-red-500/50 focus:border-red-500" 
                      : "border-noah-border focus:border-noah-violet/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-noah-muted hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            {/* Message d'erreur global */}
            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading || strength.score < 2 || (confirmPassword !== "" && password !== confirmPassword)}
              className="w-full btn-primary py-3 rounded-xl font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-noah-muted mt-6">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-noah-violet hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}