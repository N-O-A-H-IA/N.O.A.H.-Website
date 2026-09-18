"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Send, Bot, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// Fonction simple pour convertir le markdown en HTML basique
function renderMarkdown(text: string): string {
  let html = text
      // Titres
      .replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold mt-2 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-base font-bold mt-2 mb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-lg font-bold mt-2 mb-1">$1</h1>')
      // Gras
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Italique
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code inline
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      // Listes à puces
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d\. (.*$)/gim, '<li class="ml-4">$1</li>')
      // Sauts de ligne
      .replace(/\n/g, '<br/>');

  return html;
}

export default function ChatPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setLoading(false);
    };
    checkUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map(msg => ({ role: msg.role, content: msg.content }))
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error("Erreur:", error);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "Erreur. Réessaie plus tard.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
        <main className="h-dvh flex items-center justify-center bg-noah-black">
          <Loader2 className="w-5 h-5 animate-spin text-noah-violet" />
        </main>
    );
  }

  return (
      <div className="fixed inset-0 flex flex-col bg-noah-black overflow-hidden">
        <Navbar />

        {/* Header */}
        <div className="flex-shrink-0 border-b border-white/5 px-4 py-2 bg-noah-black/80 backdrop-blur-sm z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-noah-violet/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-noah-violet" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">N.O.A.H.</h1>
              <p className="text-[10px] text-noah-muted">En ligne</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col min-h-full">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                  <Bot className="w-8 h-8 text-noah-violet opacity-50" />
                  <p className="text-sm text-noah-muted">Comment puis-je t'aider ?</p>
                </div>
            ) : (
                <div className="space-y-2 pb-4">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                            msg.role === "user" ? "bg-noah-violet text-white" : "glass text-white border border-white/10"
                        }`}>
                          {msg.role === "user" ? (
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                              <div
                                  className="markdown-content space-y-1"
                                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                              />
                          )}
                        </div>
                      </div>
                  ))}

                  {isTyping && (
                      <div className="flex justify-start">
                        <div className="glass rounded-lg px-3 py-2 flex items-center gap-2">
                          <Loader2 className="w-3 h-3 text-noah-violet animate-spin" />
                          <span className="text-xs text-noah-muted">N.O.A.H. réfléchit...</span>
                        </div>
                      </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 border-t border-white/5 px-4 py-3 bg-noah-black/80 backdrop-blur-sm z-10">
          <div className="max-w-4xl mx-auto flex gap-2">
          <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écris ton message..."
              rows={1}
              className="flex-1 bg-white/5 text-white text-sm placeholder-noah-muted outline-none resize-none rounded-lg px-3 py-2 max-h-20 custom-scrollbar"
              style={{ minHeight: "36px" }}
          />
            <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 rounded-lg bg-noah-violet hover:bg-noah-violet/80 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  );
}