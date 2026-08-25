// src/app/api/discord/grant-access/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const token = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID;
    const memberRoleId = process.env.DISCORD_MEMBER_ROLE_ID;
    const unverifiedRoleId = process.env.DISCORD_UNVERIFIED_ROLE_ID;

    if (!token || !guildId || !memberRoleId || !unverifiedRoleId) {
      throw new Error('Variables d\'environnement manquantes');
    }

    const baseUrl = `https://discord.com/api/v10/guilds/${guildId}/members/${userId}`;
    const headers = {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    };

    // 1. Retirer le rôle "Non vérifié"
    await fetch(`${baseUrl}/roles/${unverifiedRoleId}`, {
      method: 'DELETE',
      headers,
    });

    // 2. Ajouter le rôle "Membre"
    await fetch(`${baseUrl}/roles/${memberRoleId}`, {
      method: 'PUT',
      headers,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur attribution rôle:', error);
    return NextResponse.json({ error: 'Échec de l\'attribution du rôle' }, { status: 500 });
  }
}