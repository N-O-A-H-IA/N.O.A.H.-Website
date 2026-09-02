"use client";

import { useState, useEffect } from "react";
import { Clock, Flame, Zap, AlertTriangle } from "lucide-react";

interface UrgencyBannerProps {
    discountName: string;
    discountPercent: number;
    endsAt: string; // ISO date string
    onTimeUp?: () => void;
}

export function UrgencyBanner({ discountName, discountPercent, endsAt, onTimeUp }: UrgencyBannerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isUrgent: false,
        isExpired: false,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(endsAt) - +new Date();

            if (difference <= 0) {
                setTimeLeft((prev) => ({ ...prev, isExpired: true }));
                onTimeUp?.();
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            // Mode urgent si moins de 24h
            const isUrgent = difference < 1000 * 60 * 60 * 24;

            setTimeLeft({ days, hours, minutes, seconds, isUrgent, isExpired: false });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000); // Mise à jour chaque seconde

        return () => clearInterval(timer);
    }, [endsAt, onTimeUp]);

    if (timeLeft.isExpired) {
        return (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Cette offre est expirée</span>
            </div>
        );
    }

    return (
        <div
            className={`relative mb-8 overflow-hidden rounded-2xl border ${
                timeLeft.isUrgent
                    ? "bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border-red-500/30 animate-pulse"
                    : "bg-gradient-to-r from-violet-500/10 via-blue-500/10 to-violet-500/10 border-violet-500/20"
            }`}
        >
            {/* Effet de brillance animé */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="relative p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Partie gauche : Info promo */}
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                timeLeft.isUrgent
                                    ? "bg-red-500/20 border border-red-500/30"
                                    : "bg-violet-500/20 border border-violet-500/30"
                            }`}
                        >
                            {timeLeft.isUrgent ? (
                                <Flame className="w-7 h-7 text-red-400 animate-pulse" />
                            ) : (
                                <Zap className="w-7 h-7 text-violet-400" />
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-display text-xl font-bold text-white">
                                    {discountName}
                                </h3>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                        timeLeft.isUrgent
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-violet-500/20 text-violet-400"
                                    }`}
                                >
                  -{discountPercent}%
                </span>
                            </div>
                            <p className="text-sm text-white/60 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {timeLeft.isUrgent ? (
                                    <span className="text-red-400 font-medium">
                    ⚠️ Dernière chance ! L'offre expire bientôt
                  </span>
                                ) : (
                                    "Offre à durée limitée"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Partie droite : Compte à rebours */}
                    <div className="flex items-center gap-2">
                        <TimeBlock value={timeLeft.days} label="Jours" isUrgent={timeLeft.isUrgent} />
                        <span className="text-2xl font-bold text-white/40 animate-pulse">:</span>
                        <TimeBlock value={timeLeft.hours} label="Heures" isUrgent={timeLeft.isUrgent} />
                        <span className="text-2xl font-bold text-white/40 animate-pulse">:</span>
                        <TimeBlock value={timeLeft.minutes} label="Min" isUrgent={timeLeft.isUrgent} />
                        <span className="text-2xl font-bold text-white/40 animate-pulse">:</span>
                        <TimeBlock value={timeLeft.seconds} label="Sec" isUrgent={timeLeft.isUrgent} showSeconds />
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                            timeLeft.isUrgent
                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                : "bg-gradient-to-r from-violet-500 to-blue-500"
                        }`}
                        style={{
                            width: `${Math.max(
                                0,
                                100 - (timeLeft.days * 24 * 60 * 60 + timeLeft.hours * 60 * 60 + timeLeft.minutes * 60 + timeLeft.seconds) / (7 * 24 * 60 * 60) * 100
                            )}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function TimeBlock({ value, label, isUrgent, showSeconds = false }: { value: number; label: string; isUrgent: boolean; showSeconds?: boolean }) {
    return (
        <div
            className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[60px] ${
                showSeconds
                    ? isUrgent
                        ? "bg-red-500/20 border border-red-500/30"
                        : "bg-violet-500/20 border border-violet-500/30"
                    : "bg-white/5 border border-white/10"
            }`}
        >
      <span
          className={`font-display text-2xl font-bold tabular-nums ${
              showSeconds
                  ? isUrgent
                      ? "text-red-400"
                      : "text-violet-400"
                  : "text-white"
          }`}
      >
        {String(value).padStart(2, "0")}
      </span>
            <span className="text-[10px] uppercase tracking-wider text-white/50 mt-0.5">
        {label}
      </span>
        </div>
    );
}