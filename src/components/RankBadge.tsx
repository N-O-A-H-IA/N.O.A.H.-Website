"use client";

import { ReactNode } from "react";

// Configuration des rangs avec couleurs plus douces et transparentes
interface RankConfig {
  name: string;
  icon: ReactNode;
  gradient: string;
  shadow: string;
  border: string;
  glow: string;
  textColor: string;
  description: string;
  dotColor: string;
}

const rankConfigs: Record<string, RankConfig> = {
  free: {
    name: "Free",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    gradient: "from-gray-600/40 via-gray-700/30 to-gray-800/40",
    shadow: "shadow-gray-500/20",
    border: "border-gray-500/30",
    glow: "from-gray-500/20 to-gray-600/20",
    textColor: "text-gray-300",
    description: "Découverte",
    dotColor: "bg-gray-400",
  },
  student: {
    name: "Student",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    gradient: "from-emerald-600/30 via-emerald-700/25 to-emerald-800/30",
    shadow: "shadow-emerald-500/15",
    border: "border-emerald-500/30",
    glow: "from-emerald-500/15 to-emerald-600/15",
    textColor: "text-emerald-300",
    description: "Étudiant",
    dotColor: "bg-emerald-400",
  },
  plus: {
    name: "Plus",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: "from-blue-600/30 via-blue-700/25 to-blue-800/30",
    shadow: "shadow-blue-500/15",
    border: "border-blue-500/30",
    glow: "from-blue-500/15 to-blue-600/15",
    textColor: "text-blue-300",
    description: "Régulier",
    dotColor: "bg-blue-400",
  },
  pro: {
    name: "Pro",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    gradient: "from-violet-600/30 via-violet-700/25 to-violet-800/30",
    shadow: "shadow-violet-500/15",
    border: "border-violet-500/30",
    glow: "from-violet-500/15 to-violet-600/15",
    textColor: "text-violet-300",
    description: "Professionnel",
    dotColor: "bg-violet-400",
  },
  ultimate: {
    name: "Ultimate",
    icon: (
      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    gradient: "from-amber-600/30 via-amber-700/25 to-amber-800/30",
    shadow: "shadow-amber-500/15",
    border: "border-amber-500/30",
    glow: "from-amber-500/15 to-amber-600/15",
    textColor: "text-amber-300",
    description: "Ultime",
    dotColor: "bg-amber-400",
  },
};

interface RankBadgeProps {
  plan: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  asTitle?: boolean;
}

export function RankBadge({ plan, size = "md", animated = true, asTitle = false }: RankBadgeProps) {
  const config = rankConfigs[plan] || rankConfigs.free;

  const sizeClasses = {
    sm: "px-4 py-2 gap-2",
    md: "px-6 py-3 gap-3",
    lg: "px-8 py-4 gap-4",
    xl: "px-10 py-5 gap-5",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
    xl: "w-9 h-9",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const iconContainerSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  };

  return (
    <div
      className={`
        relative inline-flex items-center ${sizeClasses[size]}
        bg-gradient-to-br ${config.gradient}
        rounded-2xl shadow-2xl ${config.shadow}
        border-2 ${config.border}
        overflow-hidden group
        ${animated ? "hover:scale-105 transition-transform duration-300" : ""}
        ${asTitle ? "w-full justify-center" : ""}
      `}
    >
      {/* Effet de brillance */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}

      {/* Icône avec cercle */}
      <div className={`relative flex items-center justify-center ${iconContainerSizes[size]} rounded-full bg-white/10 backdrop-blur-sm border border-white/20`}>
        <div className={`${iconSizes[size]} ${config.textColor} drop-shadow-md`}>
          {config.icon}
        </div>
      </div>

      {/* Texte */}
      <div className="relative flex flex-col items-start">
        <span className={`${textSizes[size]} ${config.textColor} font-extrabold tracking-wider drop-shadow-lg`}>
          {config.name}
        </span>
        {size !== "sm" && (
          <span className="text-xs text-white/60 font-medium">
            {config.description}
          </span>
        )}
      </div>

      {/* Effet de lueur */}
      {animated && (
        <div className={`absolute -inset-1 bg-gradient-to-r ${config.glow} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10`} />
      )}
    </div>
  );
}

// Version compacte pour la navbar
export function RankBadgeCompact({ plan }: { plan: string }) {
  const config = rankConfigs[plan] || rankConfigs.free;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${config.gradient} rounded-full shadow-lg ${config.shadow} border ${config.border}`}>
      <div className={`w-4 h-4 ${config.textColor}`}>
        {config.icon}
      </div>
      <span className="text-xs font-bold text-white/90">
        {config.name}
      </span>
    </div>
  );
}

// Version pour affichage dans le profil
export function RankBadgeProfile({ plan }: { plan: string }) {
  const config = rankConfigs[plan] || rankConfigs.free;

  return (
    <div className={`relative inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-br ${config.gradient} rounded-2xl shadow-2xl ${config.shadow} border-2 ${config.border} overflow-hidden`}>
      {/* Effet de brillance statique */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Icône */}
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
        <div className={`w-6 h-6 ${config.textColor} drop-shadow-md`}>
          {config.icon}
        </div>
      </div>

      {/* Infos */}
      <div className="relative flex flex-col">
        <span className="text-xl text-white font-extrabold tracking-wider drop-shadow-lg">
          Plan {config.name}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
          <span className="text-sm text-white/80 font-medium">
            {config.description}
          </span>
        </div>
      </div>

      {/* Effet de lueur */}
      <div className={`absolute -inset-2 bg-gradient-to-r ${config.glow} rounded-2xl blur opacity-15 -z-10`} />
    </div>
  );
}