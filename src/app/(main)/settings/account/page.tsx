"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Calendar, Camera } from "lucide-react";

export default function AccountPage() {
    
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        setProfile(data);
        setLoading(false);
    };

    if (loading) {
        return <div className="text-white/60">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-white mb-2">Compte</h1>
                <p className="text-white/60">Gérez vos informations personnelles</p>
            </div>

            {/* Photo de profil */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-violet-400" />
                    Photo de profil
                </h2>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                        {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || '?'}
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition">
                        Modifier
                    </button>
                </div>
            </div>

            {/* Informations personnelles */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Informations personnelles
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-white/60 mb-2 block">Nom complet</label>
                        <input
                            type="text"
                            value={profile?.full_name || ''}
                            readOnly
                            className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white/80"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-white/60 mb-2 block">Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={profile?.username || ''}
                            readOnly
                            className="w-full bg-noah-panel border border-noah-border rounded-xl px-4 py-3 text-sm text-white/80"
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    Adresse e-mail
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">{profile?.email}</p>
                        <p className="text-xs text-emerald-400 mt-1">✓ Adresse vérifiée</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition">
                        Modifier
                    </button>
                </div>
            </div>

            {/* Date de création */}
            <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    Informations du compte
                </h2>
                <div>
                    <p className="text-xs text-white/60 mb-1">Date de création</p>
                    <p className="text-white">
                        {new Date(profile?.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}