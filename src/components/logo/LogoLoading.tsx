export function LogoLoading() {
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <svg
        width="120"
        height="120"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="n-gradient-loading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <filter id="planet-glow-loading" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <path
            id="orbit-1-loading"
            d={`M ${center + 38},${center} A 38,16 -25 1,1 ${center - 38},${center} A 38,16 -25 1,1 ${center + 38},${center}`}
          />
          <path
            id="orbit-2-loading"
            d={`M ${center + 32},${center} A 32,13 35 1,1 ${center - 32},${center} A 32,13 35 1,1 ${center + 32},${center}`}
          />
          <path
            id="orbit-3-loading"
            d={`M ${center + 26},${center} A 26,10 -55 1,1 ${center - 26},${center} A 26,10 -55 1,1 ${center + 26},${center}`}
          />

          <path id="n-path-loading" d="M 36 68 L 36 32 L 64 68 L 64 32" />
        </defs>

        {/* Halo qui pulse rapidement */}
        <circle cx={center} cy={center} r="46" fill="#1E3A8A" opacity="0.2">
          <animate attributeName="opacity" values="0.15;0.3;0.15" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="44;48;44" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Anneaux qui tournent vite */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="10s"
            repeatCount="indefinite"
          />
          <use href="#orbit-1-loading" stroke="#60A5FA" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" />
          <use href="#orbit-2-loading" stroke="#A78BFA" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" />
          <use href="#orbit-3-loading" stroke="#F472B6" strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" />
        </g>

        {/* Planètes qui orbitent très vite */}
        <g>
          <circle r="3" fill="#67E8F9" filter="url(#planet-glow-loading)">
            <animate attributeName="r" values="2.5;3.5;2.5" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
            <mpath href="#orbit-1-loading" />
          </animateMotion>
        </g>

        <g>
          <circle r="2.5" fill="#C4B5FD" filter="url(#planet-glow-loading)">
            <animate attributeName="r" values="2;3;2" dur="0.7s" repeatCount="indefinite" />
          </circle>
          <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
            <mpath href="#orbit-2-loading" />
          </animateMotion>
        </g>

        <g>
          <circle r="2" fill="#F9A8D4" filter="url(#planet-glow-loading)">
            <animate attributeName="r" values="1.5;2.5;1.5" dur="0.6s" repeatCount="indefinite" />
          </circle>
          <animateMotion dur="1.5s" repeatCount="indefinite" rotate="auto">
            <mpath href="#orbit-3-loading" />
          </animateMotion>
        </g>

        {/* Lettre N avec fade-in */}
        <g opacity="0">
          <animate attributeName="opacity" values="0;1" dur="0.8s" fill="freeze" />
          <use
            href="#n-path-loading"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="url(#n-gradient-loading)"
          />
        </g>
      </svg>

      {/* Texte avec animation */}
      <div className="text-white font-display font-bold text-2xl tracking-[0.3em] opacity-0">
        <span style={{ animation: "fadeInUp 1s ease-out 0.5s forwards" }}>N.O.A.H.</span>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}