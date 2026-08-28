"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, Shield, UserX, Loader2 } from "lucide-react";

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    plan: string;
    created_at: string;
}

export default function AdminUsersPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        // On récupère les données de la table 'profiles' (à adapter si ta table s'appelle autrement)
        const { data, error } = await supabase
            .from("profiles")
            .select("id, email, full_name, role, plan, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Erreur chargement utilisateurs:", error);
        } else {
            // Le "|| []" garantit qu'on passe toujours un tableau à setUsers
            setUsers((data as UserProfile[]) || []);
        }
        setLoading(false);
    };

    const filteredUsers = users.filter(
        (u) =>
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="w-7 h-7 text-blue-400" />
                        Gestion des utilisateurs
                    </h1>
                    <p className="text-white/60 mt-1">Gérez les comptes, les rôles et les plans</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-noah-panel border border-noah-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
                />
            </div>

            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-white/70 uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Utilisateur</th>
                            <th className="px-6 py-4">Rôle</th>
                            <th className="px-6 py-4">Plan</th>
                            <th className="px-6 py-4">Inscription</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                                            {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{user.full_name || "Nom inconnu"}</div>
                                            <div className="text-xs text-white/50">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            user.role === 'staff' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                'bg-white/5 text-white/60 border-white/10'
                    }`}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {user.role || 'user'}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-white/80 capitalize">{user.plan || 'free'}</td>
                                <td className="px-6 py-4 text-white/60 text-xs">
                                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}