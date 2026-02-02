import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface VoiceOrbProps {
  isListening: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
  size?: 'sm' | 'md' | 'lg';
}

const VoiceOrb = ({ 
  isListening, 
  isSpeaking = false,
  audioLevel = 0, 
  size = 'lg' 
}: VoiceOrbProps) => {
  const [pulseScale, setPulseScale] = useState(1);
  const [ringOffsets, setRingOffsets] = useState([0, 0, 0]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isListening || isSpeaking) {
      const animate = () => {
        // Pulse based on audio level
        const targetScale = 1 + (audioLevel * 0.3);
        setPulseScale(prev => prev + (targetScale - prev) * 0.2);

        // Animate rings
        setRingOffsets(prev => prev.map((offset, i) => {
          const speed = 0.02 + i * 0.01;
          const amplitude = 0.02 + audioLevel * 0.05;
          return Math.sin(Date.now() * speed) * amplitude;
        }));

        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    } else {
      setPulseScale(1);
      setRingOffsets([0, 0, 0]);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isSpeaking, audioLevel]);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  const isActive = isListening || isSpeaking;
  const activeColor = isSpeaking ? 'hsl(200 70% 65%)' : 'hsl(180 60% 55%)';

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size === 'lg' ? `${320 + i * 40}px` : size === 'md' ? `${220 + i * 30}px` : `${140 + i * 20}px`,
            height: size === 'lg' ? `${320 + i * 40}px` : size === 'md' ? `${220 + i * 30}px` : `${140 + i * 20}px`,
            background: `radial-gradient(circle, ${activeColor.replace(')', ` / ${0.15 - i * 0.04})`)}, transparent 70%)`,
          }}
          animate={{
            scale: isActive ? 1 + ringOffsets[i] : 1,
            opacity: isActive ? 0.8 - i * 0.2 : 0.3,
          }}
          transition={{ duration: 0.1 }}
        />
      ))}

      {/* Main orb */}
      <motion.div
        className={`relative rounded-full ${sizeClasses[size]}`}
        style={{
          background: `radial-gradient(
            circle at 30% 30%,
            ${isSpeaking ? 'hsl(200 70% 70% / 0.9)' : 'hsl(180 65% 60% / 0.9)'},
            ${isSpeaking ? 'hsl(200 60% 55% / 0.6)' : 'hsl(185 70% 55% / 0.6)'},
            ${isSpeaking ? 'hsl(200 50% 50% / 0.3)' : 'hsl(175 60% 65% / 0.3)'}
          )`,
          boxShadow: `
            0 0 60px ${activeColor.replace(')', ' / 0.5)')},
            0 0 120px ${activeColor.replace(')', ' / 0.3)')},
            inset 0 0 60px ${activeColor.replace(')', ' / 0.2)')}
          `,
        }}
        animate={{
          scale: pulseScale,
        }}
        transition={{ duration: 0.1 }}
      >
        {/* Inner highlight */}
        <div 
          className="absolute inset-[15%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, hsl(0 0% 100% / 0.4), transparent 60%)',
          }}
        />
        
        {/* Frosted glass inner layer */}
        <motion.div 
          className="absolute inset-[20%] rounded-full backdrop-blur-sm"
          style={{
            background: `radial-gradient(circle, ${activeColor.replace(')', ' / 0.4)')}, ${activeColor.replace(')', ' / 0.1)')})`,
          }}
          animate={{
            opacity: isActive ? 0.8 + audioLevel * 0.2 : 0.5,
          }}
        />

        {/* Listening indicator ring */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: `3px solid ${activeColor}`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Speaking indicator waves */}
        {isSpeaking && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${activeColor}`,
                }}
                animate={{
                  scale: [1, 1.3 + i * 0.1],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Status label */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >

      </motion.div>
    </div>
  );
};

export default VoiceOrb;