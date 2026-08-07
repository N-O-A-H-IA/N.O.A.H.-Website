"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";

export default function ChatPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-noah-muted">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <h1 className="text-3xl font-bold mb-4">Chat N.O.A.H.</h1>
        <div className="glass rounded-2xl p-8 text-center text-noah-muted">
          L'interface de chat sera connectée ici.
        </div>
      </div>
    </main>
  );
}