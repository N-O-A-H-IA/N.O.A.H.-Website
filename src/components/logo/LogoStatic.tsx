interface LogoStaticProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function LogoStatic({ size = "md", showText = true, className = "" }: LogoStaticProps) {
  const sizes = {
    sm: { svg: 32, text: "text-base", gap: "gap-2" },
    md: { svg: 40, text: "text-xl", gap: "gap-3" },
    lg: { svg: 64, text: "text-2xl", gap: "gap-4" },
  };

  const currentSize = sizes[size];
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;

  return (
    <div className={`flex items-center ${currentSize.gap} ${className}`}>
      <svg
        width={currentSize.svg}
        height={currentSize.svg}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="n-gradient-static" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <filter id="planet-glow-static" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Orbites fixes */}
          <path
            id="orbit-1-static"
            d={`M ${center + 38},${center} A 38,16 -25 1,1 ${center - 38},${center} A 38,16 -25 1,1 ${center + 38},${center}`}
          />
          <path
            id="orbit-2-static"
            d={`M ${center + 32},${center} A 32,13 35 1,1 ${center - 32},${center} A 32,13 35 1,1 ${center + 32},${center}`}
          />
          <path
            id="orbit-3-static"
            d={`M ${center + 26},${center} A 26,10 -55 1,1 ${center - 26},${center} A 26,10 -55 1,1 ${center + 26},${center}`}
          />

          <path id="n-path-static" d="M 36 68 L 36 32 L 64 68 L 64 32" />
        </defs>

        {/* Halo de fond fixe */}
        <circle cx={center} cy={center} r="46" fill="#1E3A8A" opacity="0.15" />

        {/* Anneaux de fond */}
        <use href="#orbit-1-static" stroke="#60A5FA" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />
        <use href="#orbit-2-static" stroke="#A78BFA" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />
        <use href="#orbit-3-static" stroke="#F472B6" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />

        {/* Lettre N */}
        <use
          href="#n-path-static"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke="url(#n-gradient-static)"
        />

        {/* Anneaux principaux */}
        <use href="#orbit-1-static" stroke="#60A5FA" strokeWidth="1.5" opacity="0.75" />
        <use href="#orbit-2-static" stroke="#A78BFA" strokeWidth="1.5" opacity="0.75" />
        <use href="#orbit-3-static" stroke="#F472B6" strokeWidth="1.5" opacity="0.75" />

        {/* Planètes fixes (sans animation) */}
        <circle cx={center + 38} cy={center} r="2.2" fill="#67E8F9" filter="url(#planet-glow-static)" />
        <circle cx={center - 20} cy={center - 8} r="1.8" fill="#C4B5FD" filter="url(#planet-glow-static)" />
        <circle cx={center + 15} cy={center + 7} r="1.5" fill="#F9A8D4" filter="url(#planet-glow-static)" />
      </svg>

      {showText && (
        <span className={`font-display font-bold text-white tracking-[0.2em] ${currentSize.text}`}>
          N.O.A.H.
        </span>
      )}
    </div>
  );
}