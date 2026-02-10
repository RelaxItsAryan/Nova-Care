import { useEffect, useState } from 'react';

interface CoreOrbProps {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CoreOrb = ({ isActive = true, size = 'lg' }: CoreOrbProps) => {
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isActive) return;
    
    const beat = () => {
      // First beat
      setScale(1.3);
      setTimeout(() => setScale(1), 200);
      
      // Second beat after short pause
      setTimeout(() => {
        setScale(1.3);
        setTimeout(() => setScale(1), 200);
      }, 400);
      
      // Repeat every 2 seconds
      setTimeout(beat, 2000);
    };
    
    beat();
    
    // Keep the original pulse intensity for subtle breathing effect
    const interval = setInterval(() => {
      setPulseIntensity(0.8 + Math.random() * 0.4);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      <div 
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: size === 'lg' ? '320px' : size === 'md' ? '220px' : '140px',
          height: size === 'lg' ? '320px' : size === 'md' ? '220px' : '140px',
          background: 'radial-gradient(circle, hsl(180 60% 55% / 0.15), transparent 70%)',
        }}
      />
      
      {/* Secondary glow */}
      <div 
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: size === 'lg' ? '280px' : size === 'md' ? '190px' : '120px',
          height: size === 'lg' ? '280px' : size === 'md' ? '190px' : '120px',
          background: 'radial-gradient(circle, hsl(185 70% 55% / 0.2), transparent 60%)',
          animationDelay: '-1s',
        }}
      />

      {/* Main orb */}
      <div 
        className={`core-orb ${sizeClasses[size]}`}
        style={{
          opacity: isActive ? pulseIntensity : 0.5,
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease-in-out, opacity 1s ease-in-out',
        }}
      >
        {/* Inner highlight */}
        <div 
          className="absolute inset-[15%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, hsl(0 0% 100% / 0.4), transparent 60%)',
          }}
        />
        
        {/* Frosted glass inner layer */}
        <div 
          className="absolute inset-[20%] rounded-full backdrop-blur-sm"
          style={{
            background: 'radial-gradient(circle, hsl(180 65% 70% / 0.3), hsl(185 60% 55% / 0.1))',
          }}
        />
      </div>

      {/* Floating particles around orb */}
      {isActive && (
        <>
          <div 
            className="ambient-particle w-2 h-2"
            style={{ 
              top: '10%', 
              left: '20%',
              animationDelay: '0s',
            }}
          />
          <div 
            className="ambient-particle w-1.5 h-1.5"
            style={{ 
              top: '70%', 
              right: '15%',
              animationDelay: '-2s',
            }}
          />
          <div 
            className="ambient-particle w-1 h-1"
            style={{ 
              bottom: '20%', 
              left: '30%',
              animationDelay: '-4s',
            }}
          />
        </>
      )}
    </div>
  );
};

export default CoreOrb;