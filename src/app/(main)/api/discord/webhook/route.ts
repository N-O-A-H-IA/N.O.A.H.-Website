import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { domain, institution, email, userName } = await request.json();

        // Validation basique des champs obligatoires
        if (!domain || !userName) {
            return NextResponse.json(
                { error: 'Champs manquants : domain et userName sont requis' },
                { status: 400 }
            );
        }

        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl) {
            return NextResponse.json(
                { error: 'Webhook URL not configured' },
                { status: 500 }
            );
        }

        const embed = {
            author: {
                name: 'N.O.A.H. — Demandes de domaine',
                icon_url: 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
            },
            title: '🌐 Nouvelle demande de domaine',
            description: `> Une nouvelle demande vient d'être soumise via le formulaire du site.\n> Merci de la traiter dans les meilleurs délais. ⏳`,
            color: 0x5865f2,
            thumbnail: {
                url: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
            },
            fields: [
                {
                    name: '🔗 Domaine demandé',
                    value: `\`${domain}\``,
                    inline: true,
                },
                {
                    name: '👤 Utilisateur',
                    value: `**${userName}**`,
                    inline: true,
                },
                {
                    name: '\u200B', // champ vide pour forcer un saut de ligne visuel
                    value: '\u200B',
                    inline: true,
                },
                {
                    name: '🏫 Établissement',
                    value: institution ? `**${institution}**` : '*Non renseigné*',
                    inline: true,
                },
                {
                    name: '📧 Email de contact',
                    value: email ? `[${email}](mailto:${email})` : '*Non renseigné*',
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true,
                },
                {
                    name: '📋 Statut',
                    value: '🟡 **En attente de traitement**',
                    inline: false,
                },
            ],
            footer: {
                text: 'N.O.A.H. · Système de demandes automatisé',
                icon_url: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
            },
            timestamp: new Date().toISOString(),
        };

        const discordResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });

        if (!discordResponse.ok) {
            console.error('Erreur Discord webhook:', await discordResponse.text());
            return NextResponse.json(
                { error: "Échec de l'envoi vers Discord" },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur webhook domaine:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors du traitement de la demande' },
            { status: 500 }
        );
    }
}