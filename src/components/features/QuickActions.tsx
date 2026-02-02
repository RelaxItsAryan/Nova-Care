import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Pill, 
  Apple, 
  Moon, 
  Activity, 
  Brain,
  Heart,
  Thermometer
} from 'lucide-react';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  prompt: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    icon: Stethoscope,
    label: 'Symptom Check',
    prompt: "I'd like to describe some symptoms I'm experiencing and get your medical opinion.",
    color: 'hsl(180, 60%, 50%)',
  },
  {
    icon: Pill,
    label: 'Medication Info',
    prompt: "Can you help me understand a medication, its uses, and potential side effects?",
    color: 'hsl(260, 60%, 60%)',
  },
  {
    icon: Apple,
    label: 'Nutrition Advice',
    prompt: "I'd like personalized nutrition advice for my health goals.",
    color: 'hsl(140, 60%, 45%)',
  },
  {
    icon: Moon,
    label: 'Sleep Tips',
    prompt: "I've been having trouble sleeping. Can you give me some evidence-based tips?",
    color: 'hsl(220, 60%, 55%)',
  },
  {
    icon: Activity,
    label: 'Fitness Plan',
    prompt: "Help me create a safe exercise routine based on my fitness level.",
    color: 'hsl(350, 60%, 55%)',
  },
  {
    icon: Brain,
    label: 'Mental Health',
    prompt: "I'd like to discuss some mental health concerns and coping strategies.",
    color: 'hsl(45, 70%, 50%)',
  },
  {
    icon: Heart,
    label: 'Heart Health',
    prompt: "What are the best practices for maintaining good cardiovascular health?",
    color: 'hsl(0, 70%, 55%)',
  },
  {
    icon: Thermometer,
    label: 'First Aid',
    prompt: "What should I do in case of a minor injury or illness at home?",
    color: 'hsl(30, 70%, 50%)',
  },
];

interface QuickActionsProps {
  onSelectAction: (prompt: string) => void;
}

const QuickActions = ({ onSelectAction }: QuickActionsProps) => {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectAction(action.prompt)}
            className="glass-card p-3 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${action.color}20` }}
            >
              <action.icon 
                className="w-5 h-5 transition-colors" 
                style={{ color: action.color }}
              />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
