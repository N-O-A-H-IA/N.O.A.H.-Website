// src/app/api/discord/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Récupérer le code depuis les paramètres URL (Discord l'envoie en GET)
    const code = req.nextUrl.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Code manquant' }, { status: 400 });
    }

    // 1. Échanger le code contre un token d'accès
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/discord/callback`,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Erreur token Discord:', errorData);
      throw new Error('Échec de l\'authentification Discord');
    }
    
    const tokenData = await tokenResponse.json();

    // 2. Récupérer les infos de l'utilisateur
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error('Échec de la récupération utilisateur');
    }

    const user = await userResponse.json();

    // 3. Rediriger vers la page du règlement avec les infos utilisateur
    const redirectUrl = new URL('/reglement', req.url);
    redirectUrl.searchParams.set('userId', user.id);
    redirectUrl.searchParams.set('username', user.username);
    redirectUrl.searchParams.set('avatar', user.avatar 
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png');

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Erreur OAuth Discord:', error);
    return NextResponse.json({ error: 'Échec de la connexion' }, { status: 500 });
  }
}