import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserDiscordRoles } from "@/lib/discord";

export async function POST(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        // Récupérer le profil
        const { data: profile } = await supabase
            .from("profiles")
            .select("discord_id, plan")
            .eq("id", user.id)
            .single();

        if (!profile?.discord_id) {
            return NextResponse.json({
                error: "Compte Discord non connecté",
                hint: "Connectez votre compte Discord d'abord"
            }, { status: 400 });
        }

        // ✅ CORRECTION ICI : Seulement 2 arguments (discord_id, plan)
        const result = await syncUserDiscordRoles(profile.discord_id, profile.plan);

        if (!result.success) {
            return NextResponse.json({ error: "Échec de la synchronisation des rôles" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Rôles Discord synchronisés",
            plan: profile.plan
        });
    } catch (error: any) {
        console.error("Erreur sync rôles:", error);
        return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
    }
}