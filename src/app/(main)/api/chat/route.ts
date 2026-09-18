import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("Clé API Gemini manquante dans le fichier .env.local");
        }

        // 1. Formater l'historique
        const contents = (history || []).map((msg: any) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        // 2. Ajouter le message courant
        contents.push({ role: "user", parts: [{ text: message }] });

        // 3. Modèle actif 3.6 Flash sur endpoint v1beta
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: contents,
                    systemInstruction: {
                        parts: [
                            {
                                text: "Tu es N.O.A.H., un assistant IA utile, concis et professionnel. Réponds toujours en français de manière claire.",
                            },
                        ],
                    },
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Erreur Gemini:", data);
            throw new Error(data.error?.message || "Erreur lors de l'appel à l'IA");
        }

        // 4. Extraction du texte de réponse
        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Désolé, je n'ai pas pu générer de réponse.";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Erreur Chat:", error);
        return NextResponse.json(
            { error: error.message || "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}