const DISCORD_API = "https://discord.com/api/v10";
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

const PLAN_ROLE_MAP: Record<string, string> = {
    student: process.env.DISCORD_ROLE_STUDENT || "",
    plus: process.env.DISCORD_ROLE_PLUS || "",
    pro: process.env.DISCORD_ROLE_PRO || "",
    ultimate: process.env.DISCORD_ROLE_ULTIMATE || "",
};

export async function addDiscordRole(discordId: string, roleId: string) {
    if (!BOT_TOKEN || !GUILD_ID) return { success: false };

    const response = await fetch(
        `${DISCORD_API}/guilds/${GUILD_ID}/members/${discordId}/roles/${roleId}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );

    return { success: response.status === 204 };
}

export async function removeDiscordRole(discordId: string, roleId: string) {
    if (!BOT_TOKEN || !GUILD_ID) return { success: false };

    const response = await fetch(
        `${DISCORD_API}/guilds/${GUILD_ID}/members/${discordId}/roles/${roleId}`,
        {
            method: "DELETE",
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
        }
    );

    return { success: response.status === 204 };
}

export async function syncUserDiscordRoles(discordId: string, plan: string) {
    if (!discordId) return { success: false };

    // Retirer tous les rôles de plan
    for (const roleId of Object.values(PLAN_ROLE_MAP)) {
        if (roleId) await removeDiscordRole(discordId, roleId);
    }

    // Ajouter le rôle correspondant
    const newRoleId = PLAN_ROLE_MAP[plan];
    if (newRoleId) {
        await addDiscordRole(discordId, newRoleId);
    }

    return { success: true };
}