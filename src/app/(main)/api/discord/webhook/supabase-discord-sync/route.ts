import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserDiscordRoles } from "@/lib/discord";

export async function POST(request: Request) {
    try {
        // Vérifier le secret
        const secret = request.headers.get("x-webhook-secret");
        if (secret !== process.env.WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();
        const { record, old_record } = body;

        console.log(`🔄 Webhook reçu ! User: ${record.id}, Plan: ${record.plan}`);

        if (!record.discord_id) {
            console.log("ℹ️ Pas de Discord ID");
            return NextResponse.json({ success: true });
        }

        // Synchroniser les rôles
        const result = await syncUserDiscordRoles(record.discord_id, record.plan);

        if (result.success) {
            console.log(`✅ Rôle Discord mis à jour !`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("🚨 Erreur webhook:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}