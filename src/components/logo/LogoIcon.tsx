interface LogoIconProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function LogoIcon({ size = 32, animated = false, className = "" }: LogoIconProps) {
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={`n-gradient-icon-${animated ? "anim" : "static"}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <filter id="planet-glow-icon" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <path
          id="orbit-1-icon"
          d={`M ${center + 38},${center} A 38,16 -25 1,1 ${center - 38},${center} A 38,16 -25 1,1 ${center + 38},${center}`}
        />
        <path
          id="orbit-2-icon"
          d={`M ${center + 32},${center} A 32,13 35 1,1 ${center - 32},${center} A 32,13 35 1,1 ${center + 32},${center}`}
        />
        <path
          id="orbit-3-icon"
          d={`M ${center + 26},${center} A 26,10 -55 1,1 ${center - 26},${center} A 26,10 -55 1,1 ${center + 26},${center}`}
        />

        <path id="n-path-icon" d="M 36 68 L 36 32 L 64 68 L 64 32" />
      </defs>

      {/* Halo */}
      <circle cx={center} cy={center} r="46" fill="#1E3A8A" opacity="0.15">
        {animated && <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite" />}
      </circle>

      {/* Anneaux */}
      <use href="#orbit-1-icon" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
      <use href="#orbit-2-icon" stroke="#A78BFA" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
      <use href="#orbit-3-icon" stroke="#F472B6" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />

      {/* Planètes */}
      {animated ? (
        <>
          <g>
            <circle r="2" fill="#67E8F9" filter="url(#planet-glow-icon)" />
            <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
              <mpath href="#orbit-1-icon" />
            </animateMotion>
          </g>
          <g>
            <circle r="1.6" fill="#C4B5FD" filter="url(#planet-glow-icon)" />
            <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
              <mpath href="#orbit-2-icon" />
            </animateMotion>
          </g>
          <g>
            <circle r="1.3" fill="#F9A8D4" filter="url(#planet-glow-icon)" />
            <animateMotion dur="3.5s" repeatCount="indefinite" rotate="auto">
              <mpath href="#orbit-3-icon" />
            </animateMotion>
          </g>
        </>
      ) : (
        <>
          <circle cx={center + 38} cy={center} r="2" fill="#67E8F9" filter="url(#planet-glow-icon)" />
          <circle cx={center - 20} cy={center - 8} r="1.6" fill="#C4B5FD" filter="url(#planet-glow-icon)" />
          <circle cx={center + 15} cy={center + 7} r="1.3" fill="#F9A8D4" filter="url(#planet-glow-icon)" />
        </>
      )}

      {/* Lettre N */}
      <use
        href="#n-path-icon"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={`url(#n-gradient-icon-${animated ? "anim" : "static"})`}
      />
    </svg>
  );
}