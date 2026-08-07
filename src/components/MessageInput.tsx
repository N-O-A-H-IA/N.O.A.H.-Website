// src/components/MessageInput.tsx
"use client";

import { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSend(message);
    setMessage("");
  };

  return (
    <div className="px-6 pb-6">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="glass-strong rounded-2xl border border-noah-border focus-within:border-noah-violet/40 transition">
          <div className="flex items-end gap-2 p-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Posez une question à N.O.A.H..."
              rows={1}
              disabled={disabled}
              className="flex-1 bg-transparent outline-none resize-none text-sm py-2 max-h-40 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="p-2 rounded-lg btn-primary text-white disabled:opacity-50"
              title="Envoyer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}