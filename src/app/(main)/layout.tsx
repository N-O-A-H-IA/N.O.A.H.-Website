import { Navbar } from "@/components/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-noah-black text-white">
            <Navbar />
            <div className="pt-24 pb-20 px-6">
                {children}
            </div>
        </main>
    );
}