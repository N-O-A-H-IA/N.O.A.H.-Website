"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface AppearanceContextType {
    theme: string;
    accentColor: string;
    density: string;
    fontSize: string;
    animations: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
}

const defaultPrefs: AppearanceContextType = {
    theme: "midnight",
    accentColor: "violet",
    density: "standard",
    fontSize: "medium",
    animations: true,
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
};

const AppearanceContext = createContext<AppearanceContextType>(defaultPrefs);

export function AppearanceProvider({ children }: { children: ReactNode }) {
    const supabase = createClient();
    const [prefs, setPrefs] = useState<AppearanceContextType>(defaultPrefs);

    useEffect(() => {
        loadPrefs();
    }, []);

    // Dès que les préférences changent, on les applique au HTML
    useEffect(() => {
        applyStyles(prefs);
    }, [prefs]);

    const loadPrefs = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("profiles")
                .select("theme, accent_color, density, font_size, animations, reduced_motion, high_contrast, screen_reader")
                .eq("id", user.id)
                .single();

            if (data) {
                setPrefs({
                    theme: data.theme || "midnight",
                    accentColor: data.accent_color || "violet",
                    density: data.density || "standard",
                    fontSize: data.font_size || "medium",
                    animations: data.animations ?? true,
                    reducedMotion: data.reduced_motion ?? false,
                    highContrast: data.high_contrast ?? false,
                    screenReader: data.screen_reader ?? false,
                });
            }
        } catch (err) {
            console.error("Erreur chargement apparence", err);
        }
    };

    const applyStyles = (p: AppearanceContextType) => {
        const html = document.documentElement;
        const body = document.body;

        // 1. Thème (via data-attribute)
        html.setAttribute("data-theme", p.theme);
        body.setAttribute("data-theme", p.theme);

        // 2. Densité
        html.setAttribute("data-density", p.density);
        body.setAttribute("data-density", p.density);

        // 3. Couleur d'accent
        const colors: Record<string, string> = {
            violet: "#8b5cf6", blue: "#3b82f6", cyan: "#06b6d4", emerald: "#10b981",
            amber: "#f59e0b", rose: "#f43f5e", fuchsia: "#d946ef", indigo: "#6366f1",
        };
        html.style.setProperty("--accent-color", colors[p.accentColor] || colors.violet);

        // 4. Taille de police
        const sizes: Record<string, string> = { small: "14px", medium: "16px", large: "18px", xlarge: "20px" };
        html.style.fontSize = sizes[p.fontSize] || "16px";

        // 5. Animations
        if (p.reducedMotion || !p.animations) {
            html.classList.add("reduce-motion");
        } else {
            html.classList.remove("reduce-motion");
        }

        // 6. Contraste
        if (p.highContrast) {
            html.classList.add("high-contrast");
        } else {
            html.classList.remove("high-contrast");
        }
    };

    return (
        <AppearanceContext.Provider value={prefs}>
            {children}
        </AppearanceContext.Provider>
    );
}

export const useAppearance = () => useContext(AppearanceContext);