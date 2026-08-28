import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "N.O.A.H. — Neural Operational Assistant Hub",
    description: "L'assistant IA qui respecte votre vie privée",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
        <body className="bg-noah-black antialiased">
        {children}
        </body>
        </html>
    );
}