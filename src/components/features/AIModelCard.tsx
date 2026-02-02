import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Sparkles } from 'lucide-react';

interface AIModelCardProps {
  name: string;
  specialty: string;
  description: string;
  capabilities: string[];
  color: string;
  delay?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const AIModelCard = ({ 
  name, 
  specialty, 
  description, 
  capabilities, 
  color, 
  delay = 0,
  isActive = false,
  onClick 
}: AIModelCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.15, duration: 0.4 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`glass-card p-5 cursor-pointer relative overflow-hidden group ${
        isActive ? 'border-primary border-2' : ''
      }`}
    >
      {/* Background pulse for active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-primary/5"
          animate={{ opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)` }}
        >
          <Brain className="w-7 h-7" style={{ color }} />
        </div>
        {isActive && (
          <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            Active
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {name}
        </h3>
        <p className="text-sm font-medium mb-3" style={{ color }}>
          {specialty}
        </p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Capabilities */}
        <div className="flex flex-wrap gap-2">
          {capabilities.slice(0, 3).map((cap, i) => (
            <span 
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
      
      {/* Hover effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 origin-left"
        style={{ background: color }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AIModelCard;
