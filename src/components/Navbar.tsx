"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, ChevronDown, MessageSquare, Settings, LogOut, User } from "lucide-react";
import { RankBadgeCompact } from "@/components/RankBadge";
import { LogoStatic } from "@/components/logo/LogoStatic";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage(); // Hook de traduction

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
            .from("profiles")
            .select("plan")
            .eq("id", user.id)
            .single();

        if (profileData) {
          setUserPlan(profileData.plan || "free");
        }
      }
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const getAvatarUrl = () => user?.user_metadata?.avatar_url || null;

  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || "";
    return name.charAt(0).toUpperCase();
  };

  // Menu quand NON connecté
  const NotConnectedMenu = () => (
      <>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-noah-muted">
          <Link href="/#fonctionnalites" className="hover:text-white transition-colors">
            {t("nav.features")}
          </Link>
          <Link href="/tarifs" className="hover:text-white transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link href="/marketplace" className="hover:text-white transition-colors">
            {t("nav.marketplace")}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-noah-muted hover:text-white transition-colors">
            {t("nav.login")}
          </Link>
          <Link href="/register" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium text-white">
            {t("nav.try_free")}
          </Link>
        </div>
      </>
  );

  // Menu quand CONNECTÉ
  const ConnectedMenu = () => (
      <>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-noah-muted">
          <Link href="/chat" className="flex items-center gap-2 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4" />
            {t("nav.chat")}
          </Link>
          <Link href="/tarifs" className="hover:text-white transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link href="/marketplace" className="hover:text-white transition-colors">
            {t("nav.marketplace")}
          </Link>
        </div>

        <div className="relative hidden md:block">
          <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-noah-blue to-noah-violet flex items-center justify-center text-sm font-bold text-white overflow-hidden">
              {getAvatarUrl() ? (
                  <img src={getAvatarUrl()} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                  getInitials()
              )}
            </div>
            <RankBadgeCompact plan={userPlan} />
            <ChevronDown className="w-4 h-4 text-noah-muted" />
          </button>

          {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl border border-noah-border py-2 z-50 shadow-xl">
                  <div className="px-4 py-3 border-b border-noah-border">
                    <div className="text-sm font-medium truncate">
                      {user?.user_metadata?.full_name || "Utilisateur"}
                    </div>
                    <div className="text-xs text-noah-muted truncate">
                      {user?.email}
                    </div>
                  </div>

                  <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-noah-muted" />
                    {t("nav.profile")}
                  </Link>
                  <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition"
                      onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-noah-muted" />
                    {t("nav.settings")}
                  </Link>

                  <div className="border-t border-noah-border my-2" />

                  <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("nav.logout")}
                  </button>
                </div>
              </>
          )}
        </div>
      </>
  );

  return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-noah-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            <LogoStatic size="md" showText={true} />
          </Link>

          {loading ? (
              <div className="w-32 h-8 bg-noah-panel rounded animate-pulse" />
          ) : user ? (
              <ConnectedMenu />
          ) : (
              <NotConnectedMenu />
          )}

          <button
              className="md:hidden p-2 text-noah-muted hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden glass-strong border-t border-noah-border px-6 py-4 space-y-4">
              {user ? (
                  <>
                    <Link href="/chat" className="flex items-center gap-2 text-base font-medium hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      <MessageSquare className="w-4 h-4" /> {t("nav.chat")}
                    </Link>
                    <Link href="/tarifs" className="block text-base font-medium hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.pricing")}
                    </Link>
                    <Link href="/profile" className="block text-base font-medium hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.profile")}
                    </Link>
                    <Link href="/settings" className="block text-base font-medium hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.settings")}
                    </Link>
                    <div className="pt-4 border-t border-noah-border">
                      <button
                          onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                          className="w-full text-center text-base font-medium text-red-400 hover:text-red-300"
                      >
                        {t("nav.logout")}
                      </button>
                    </div>
                  </>
              ) : (
                  <>
                    <Link href="/#fonctionnalites" className="block text-base font-medium hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.features")}
                    </Link>
                    <Link href="/tarifs" className="block text-base font-medium hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.pricing")}
                    </Link>
                    <Link href="/marketplace" className="block text-base font-medium hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      {t("nav.marketplace")}
                    </Link>
                    <div className="pt-4 border-t border-noah-border flex flex-col gap-3">
                      <Link href="/login" className="text-center text-base font-medium text-noah-muted hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        {t("nav.login")}
                      </Link>
                      <Link href="/register" className="btn-primary text-center px-4 py-3 rounded-lg text-base font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        {t("nav.try_free")}
                      </Link>
                    </div>
                  </>
              )}
            </div>
        )}
      </nav>
  );
}