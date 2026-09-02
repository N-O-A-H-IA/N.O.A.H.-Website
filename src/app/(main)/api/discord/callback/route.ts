import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUserDiscordRoles } from "@/lib/discord";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    console.error("❌ Erreur OAuth ou code manquant:", error);
    return NextResponse.redirect(new URL("/settings?discord_error=auth_failed", request.url));
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 1. Échanger le code contre un token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/discord/callback`,
      }),
    });

    // ✅ NOUVEAU : Afficher la vraie erreur de Discord si ça échoue
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("❌ Échec récupération token Discord:", tokenResponse.status, errorText);
      throw new Error(`Discord API error: ${tokenResponse.status}`);
    }

    const tokens = await tokenResponse.json();

    // 2. Récupérer les infos de l'utilisateur Discord
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const discordUser = await userResponse.json();

    // 3. Sauvegarder le Discord ID dans le profil
    const { error: updateError } = await supabase
        .from("profiles")
        .update({
          discord_id: discordUser.id,
          discord_username: `${discordUser.username}#${discordUser.discriminator === '0' ? discordUser.username : discordUser.discriminator}`, // Format moderne Discord
        })
        .eq("id", user.id);

    if (updateError) {
      console.error("❌ Erreur mise à jour profil:", updateError);
    }

    // 4. Récupérer le plan et synchroniser les rôles
    const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

    if (profile?.plan && discordUser.id) {
      console.log(`🔄 Sync rôles Discord pour ${user.id} (plan: ${profile.plan})`);
      await syncUserDiscordRoles(discordUser.id, profile.plan);
    }

    return NextResponse.redirect(new URL("/settings?discord_connected=true", request.url));
  } catch (error: any) {
    console.error("🚨 Erreur OAuth Discord:", error.message);
    return NextResponse.redirect(new URL("/settings?discord_error=unknown", request.url));
  }
}