interface LogoAnimatedProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function LogoAnimated({ size = "md", showText = true, className = "" }: LogoAnimatedProps) {
  const sizes = {
    sm: { svg: 48, text: "text-lg", gap: "gap-2" },
    md: { svg: 64, text: "text-xl", gap: "gap-3" },
    lg: { svg: 96, text: "text-2xl", gap: "gap-4" },
    xl: { svg: 160, text: "text-4xl", gap: "gap-6" },
  };

  const currentSize = sizes[size];
  const viewBoxSize = 100;
  const center = viewBoxSize / 2; // 50

  return (
    <div className={`flex items-center ${currentSize.gap} ${className} transition-all duration-300`}>
      <svg
        width={currentSize.svg}
        height={currentSize.svg}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Dégradé du N */}
          <linearGradient id="n-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* Filtre de lueur pour les planètes */}
          <filter id="planet-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Orbites complètes centrées exactement sur (50, 50) */}
          <path
            id="orbit-1"
            d={`M ${center + 38},${center} A 38,16 -25 1,1 ${center - 38},${center} A 38,16 -25 1,1 ${center + 38},${center}`}
          />
          <path
            id="orbit-2"
            d={`M ${center + 32},${center} A 32,13 35 1,1 ${center - 32},${center} A 32,13 35 1,1 ${center + 32},${center}`}
          />
          <path
            id="orbit-3"
            d={`M ${center + 26},${center} A 26,10 -55 1,1 ${center - 26},${center} A 26,10 -55 1,1 ${center + 26},${center}`}
          />

          {/* Forme du N parfaitement centrée */}
          <path id="n-path" d="M 36 68 L 36 32 L 64 68 L 64 32" />
        </defs>

        {/* Halo de fond pulsant */}
        <circle cx={center} cy={center} r="46" fill="#1E3A8A" opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* ================= 1. ANNEAUX DE FOND ================= */}
        <use href="#orbit-1" stroke="#60A5FA" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />
        <use href="#orbit-2" stroke="#A78BFA" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />
        <use href="#orbit-3" stroke="#F472B6" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />

        {/* ================= 2. LETTRE N (Cœur du logo) ================= */}
        <use
          href="#n-path"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="url(#n-gradient)"
        />

        {/* ================= 3. ANNEAUX PRINCIPAUX ================= */}
        <use href="#orbit-1" stroke="#60A5FA" strokeWidth="1.5" opacity="0.75" />
        <use href="#orbit-2" stroke="#A78BFA" strokeWidth="1.5" opacity="0.75" />
        <use href="#orbit-3" stroke="#F472B6" strokeWidth="1.5" opacity="0.75" />

        {/* ================= 4. PARTICULES / PLANÈTES EN ORBITE ================= */}
        <g>
          {/* Planète 1 (Cyan) */}
          <circle r="2.2" fill="#67E8F9" filter="url(#planet-glow)">
            <animate attributeName="r" values="2;2.5;2" dur="2s" repeatCount="indefinite" />
            <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
              <mpath href="#orbit-1" />
            </animateMotion>
          </circle>

          {/* Planète 2 (Violet) */}
          <circle r="1.8" fill="#C4B5FD" filter="url(#planet-glow)">
            <animate attributeName="r" values="1.5;2;1.5" dur="1.8s" repeatCount="indefinite" />
            <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
              <mpath href="#orbit-2" />
            </animateMotion>
          </circle>

          {/* Planète 3 (Rose) */}
          <circle r="1.5" fill="#F9A8D4" filter="url(#planet-glow)">
            <animate attributeName="r" values="1.2;1.8;1.2" dur="1.5s" repeatCount="indefinite" />
            <animateMotion dur="3.5s" repeatCount="indefinite" rotate="auto">
              <mpath href="#orbit-3" />
            </animateMotion>
          </circle>
        </g>
      </svg>

      {showText && (
        <span className={`font-display font-bold text-white tracking-[0.2em] ${currentSize.text}`}>
          N.O.A.H.
        </span>
      )}
    </div>
  );
}