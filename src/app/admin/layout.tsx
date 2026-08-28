import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {AdminSidebar} from "@/components/admin/Sidebar";

export default async function AdminLayout({
                                              children
                                          }: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const allowedRoles = ['admin', 'staff', 'boutique_manager'];
    if (!profile || !allowedRoles.includes(profile.role)) {
        redirect("/");
    }

    // ⚠️ IMPORTANT : Pas de <html> ou <body> ici !
    // Juste une div ou un fragment qui contient le contenu
    return (
        <div className="flex min-h-screen bg-[#050505]">
            <AdminSidebar userRole={profile.role} />
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}