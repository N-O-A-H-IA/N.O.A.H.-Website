"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { RankBadgeProfile } from "@/components/RankBadge";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setAvatarUrl(user.user_metadata?.avatar_url || null);
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file || !user) return;

      if (file.size > 2 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 2MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner une image");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          avatar_url: publicUrl
        }
      });

      alert("Photo de profil mise à jour !");

    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || "";
    return name.charAt(0).toUpperCase();
  };

  const currentPlan = profile?.plan || "free";

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-noah-muted">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-8">Mon profil</h1>

        {/* Carte profil - Avatar et infos de base */}
        <div className="glass rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-noah-blue to-noah-violet flex items-center justify-center text-3xl font-bold overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials()
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 w-9 h-9 bg-noah-violet rounded-full flex items-center justify-center cursor-pointer hover:bg-noah-blue transition border-2 border-noah-black shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold mb-1">
                {user?.user_metadata?.full_name || "Utilisateur"}
              </h2>
              <p className="text-noah-muted">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Abonnement - Juste le badge et le bouton */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-display text-xl font-bold mb-6">
            Abonnement
          </h3>
          
          <div className="flex items-center justify-between">
            {/* Badge du plan */}
            <RankBadgeProfile plan={currentPlan} />
            
            {/* Bouton Changer de plan */}
            <a
              href="/tarifs"
              className="btn-primary px-5 py-2.5 rounded-lg text-sm font-medium text-white whitespace-nowrap"
            >
              Changer de plan
            </a>
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-display text-xl font-bold mb-5">
            Informations personnelles
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Nom complet
              </label>
              <input
                type="text"
                defaultValue={user?.user_metadata?.full_name || ""}
                className="w-full bg-noah-panel border border-noah-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-noah-violet/50 transition"
              />
            </div>
            <div>
              <label className="text-xs text-noah-muted mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                disabled
                className="w-full bg-noah-panel border border-noah-border rounded-lg px-3 py-2.5 text-sm outline-none opacity-60"
              />
            </div>
            <button className="btn-primary px-5 py-2.5 rounded-lg text-sm font-medium text-white">
              Enregistrer
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-lg glass hover:bg-red-500/10 hover:border-red-500/30 text-sm font-medium transition text-red-400"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </main>
  );
}