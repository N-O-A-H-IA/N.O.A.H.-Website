"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/logo/LogoStatic";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="glass-strong rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Logo />
            <span className="font-display font-bold text-lg">N.O.A.H.</span>
          </div>

          <h1 className="font-display text-2xl font-bold mb-2 text-center">
            Bon retour parmi nous
          </h1>
          <p className="text-noah-muted text-sm mb-6 text-center">
            Connectez-vous pour retrouver vos conversations.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Email
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

            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-noah-panel border border-noah-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-noah-violet/50 transition"
              />
              {/* LIEN MOT DE PASSE OUBLIÉ AJOUTÉ ICI */}
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-xs text-noah-violet hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
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
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-noah-muted mt-6">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-noah-violet hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}