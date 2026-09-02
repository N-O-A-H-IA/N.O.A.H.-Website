import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppearanceProvider } from "@/contexts/AppearanceContext";
import {PayPalProvider} from "@/contexts/PayPalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "N.O.A.H.",
    description: "Neural Operational Assistant Hub",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr">
        <body className={inter.className}>
        <LanguageProvider>
            <AppearanceProvider>
                <PayPalProvider> {/* ✅ Ajoute ça */}
                    {children}
                </PayPalProvider>
            </AppearanceProvider>
        </LanguageProvider>
        </body>
        </html>
    );
}