import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => onComplete(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex items-center justify-center transition-opacity duration-700 ${
        phase >= 4 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full border transition-all duration-1000 ${
              phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
            style={{
              width: `${(i + 1) * 200}px`,
              height: `${(i + 1) * 200}px`,
              borderColor: i % 2 === 0 ? "hsl(var(--nova-cyan) / 0.3)" : "hsl(var(--nova-violet) / 0.2)",
              transitionDelay: `${i * 150}ms`,
              animation: phase >= 1 ? `pulse ${2 + i * 0.5}s ease-in-out infinite` : "none",
            }}
          />
        ))}
      </div>

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated heart icon */}
        <div
          className={`relative transition-all duration-700 ${
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 0 30px hsl(var(--nova-cyan) / 0.6)) drop-shadow(0 0 60px hsl(var(--nova-violet) / 0.4))",
            }}
          >
            <defs>
              <linearGradient id="introHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--nova-cyan))" />
                <stop offset="50%" stopColor="hsl(var(--nova-blue))" />
                <stop offset="100%" stopColor="hsl(var(--nova-violet))" />
              </linearGradient>
            </defs>
            <g transform="translate(60, 65)">
              <path
                d="M0 -25
                   C-18 -45 -45 -38 -45 -15
                   C-45 12 -30 28 0 50
                   C30 28 45 12 45 -15
                   C45 -38 18 -45 0 -25Z"
                fill="url(#introHeartGradient)"
                className={`transition-all duration-500 ${phase >= 1 ? "animate-pulse" : ""}`}
              />
            </g>
            {/* EKG line across heart */}
            <path
              d="M10 60 L35 60 L42 45 L50 75 L58 40 L66 70 L74 55 L85 60 L110 60"
              fill="none"
              stroke="hsl(var(--background))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-all duration-1000 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}
              style={{
                strokeDasharray: 200,
                strokeDashoffset: phase >= 2 ? 0 : 200,
                transition: "stroke-dashoffset 0.8s ease-out",
              }}
            />
          </svg>

          {/* Orbiting particles */}
          {phase >= 2 && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "hsl(var(--nova-cyan))" : "hsl(var(--nova-violet))",
                    boxShadow: i % 2 === 0
                      ? "0 0 10px hsl(var(--nova-cyan))"
                      : "0 0 10px hsl(var(--nova-violet))",
                    animation: `orbit ${3 + i * 0.3}s linear infinite`,
                    animationDelay: `${-i * 0.5}s`,
                    left: "50%",
                    top: "50%",
                    transformOrigin: `${60 + i * 10}px center`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Logo text */}
        <div
          className={`mt-8 transition-all duration-700 delay-300 ${
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">N</span>
            </div>
            <span className="font-display font-bold text-3xl">
              Nova<span className="text-gradient-nova">Care</span>
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          className={`mt-4 text-muted-foreground text-lg transition-all duration-700 ${
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          The Future of Healthcare
        </p>

        {/* Loading bar */}
        <div
          className={`mt-8 w-48 h-1 rounded-full overflow-hidden bg-muted transition-opacity duration-500 ${
            phase >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-1500 ease-out"
            style={{
              width: phase >= 3 ? "100%" : "0%",
              backgroundSize: "200% 100%",
              animation: phase >= 2 ? "shimmer 1.5s linear infinite" : "none",
            }}
          />
        </div>
      </div>

      {/* Corner decorations */}
      <div
        className={`absolute top-10 left-10 transition-all duration-700 ${
          phase >= 1 ? "opacity-40 translate-x-0" : "opacity-0 -translate-x-10"
        }`}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M0 30 L30 0 L30 10 L10 30 L30 50 L30 60 L0 30Z" fill="hsl(var(--nova-cyan))" opacity="0.5" />
        </svg>
      </div>
      <div
        className={`absolute bottom-10 right-10 transition-all duration-700 ${
          phase >= 1 ? "opacity-40 translate-x-0" : "opacity-0 translate-x-10"
        }`}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M60 30 L30 0 L30 10 L50 30 L30 50 L30 60 L60 30Z" fill="hsl(var(--nova-violet))" opacity="0.5" />
        </svg>
      </div>

      {/* Floating DNA strands */}
      <div
        className={`absolute left-1/4 top-1/4 transition-all duration-1000 ${
          phase >= 1 ? "opacity-30" : "opacity-0"
        }`}
      >
        <svg width="40" height="120" viewBox="0 0 40 120" className="animate-float">
          {[...Array(6)].map((_, i) => {
            const y = i * 20 + 10;
            const offset = Math.sin((i * Math.PI) / 2.5) * 10;
            return (
              <g key={i}>
                <circle cx={20 + offset} cy={y} r="3" fill="hsl(var(--nova-cyan))" />
                <circle cx={20 - offset} cy={y} r="3" fill="hsl(var(--nova-violet))" />
                <line x1={20 + offset} y1={y} x2={20 - offset} y2={y} stroke="hsl(var(--nova-blue))" strokeWidth="1" opacity="0.5" />
              </g>
            );
          })}
        </svg>
      </div>
      <div
        className={`absolute right-1/4 bottom-1/4 transition-all duration-1000 delay-300 ${
          phase >= 1 ? "opacity-30" : "opacity-0"
        }`}
      >
        <svg width="40" height="120" viewBox="0 0 40 120" className="animate-float" style={{ animationDelay: "-2s" }}>
          {[...Array(6)].map((_, i) => {
            const y = i * 20 + 10;
            const offset = Math.sin((i * Math.PI) / 2.5) * 10;
            return (
              <g key={i}>
                <circle cx={20 + offset} cy={y} r="3" fill="hsl(var(--nova-violet))" />
                <circle cx={20 - offset} cy={y} r="3" fill="hsl(var(--nova-cyan))" />
                <line x1={20 + offset} y1={y} x2={20 - offset} y2={y} stroke="hsl(var(--nova-blue))" strokeWidth="1" opacity="0.5" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default IntroAnimation;
