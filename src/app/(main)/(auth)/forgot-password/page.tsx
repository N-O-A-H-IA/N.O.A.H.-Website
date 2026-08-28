"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoStatic } from "@/components/logo/LogoStatic";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Le lien redirigera vers la page /reset-password de ton site
    const redirectUrl = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="glass-strong rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-3">E-mail envoyé !</h1>
            <p className="text-noah-muted text-sm mb-6">
              Si un compte existe avec l'adresse <strong className="text-white">{email}</strong>, vous recevrez un lien pour réinitialiser votre mot de passe.
            </p>
            <Link 
              href="/login" 
              className="btn-primary inline-block w-full py-3 rounded-xl font-medium text-white"
            >
              Retour à la connexion
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
            Mot de passe oublié ?
          </h1>
          <p className="text-noah-muted text-sm mb-6 text-center">
            Entrez votre adresse e-mail et nous vous enverrons un lien pour le réinitialiser.
          </p>

          <form onSubmit={handleReset} className="space-y-4">
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
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-medium text-white disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </button>
          </form>

          <p className="text-center text-sm text-noah-muted mt-6">
            <Link href="/login" className="text-noah-violet hover:underline">
              ← Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}