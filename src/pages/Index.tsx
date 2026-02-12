import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';
import VoiceOrb from '@/components/voice/VoiceOrb';
import GlassWidget from '@/components/GlassWidget';
import ChatPanel from '@/components/chat/ChatPanel';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import IntroAnimation from '@/components/IntroAnimation';
import CoreOrb from '@/components/CoreOrb';
import useAudioVisualization from '@/hooks/useAudioVisualization';
import { useAuth } from '@/hooks/useAuth';
import AIModelCard from '@/components/features/AIModelCard';
import FeatureCard from '@/components/features/FeatureCard';
import { 
  Sparkles, 
  MessageCircle, 
  LogOut, 
  LogIn, 
  User,
  Stethoscope,
  Brain,
  Heart,
  Pill,
  Activity,
  Shield,
  Zap
} from 'lucide-react';



const features = [
];

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(0);
  
  const { audioLevel } = useAudioVisualization();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('nova-care-onboarded');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    setIsLoaded(true);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('nova-care-onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleConsultationClick = () => {
    setIsChatOpen(true);
  };

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />
      
      {/* Intro Animation */}
      {showIntro && (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6 flex items-center justify-between">
          <motion.div 
            className={`flex items-center gap-3 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="w-19 h-19 rounded-full bg-primary/20 flex items-center justify-center border-glow logo-glow overflow-hidden">
              <img src="/Nova-Care-logo.png" alt="Nova Care Logo" className="w-16 h-16 object-contain" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground">
                Nova Care
              </h1>
              <p className="text-xs text-muted-foreground">Medical AI Assistant</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full glass-card haptic-glow cursor-pointer transition-all duration-700 delay-100 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground hidden sm:inline">Profile</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAuthAction}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full glass-card haptic-glow cursor-pointer transition-all duration-700 delay-150 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground hidden sm:inline">Sign Out</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground hidden sm:inline">Sign In</span>
                </>
              )}
            </motion.button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 px-4 md:px-6 py-4 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero */}
            <section className="text-center py-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-6"
              >
                <CoreOrb size="lg" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {user ? `Welcome back` : 'Your AI Health Companion'}
                </h2>
                <p className="text-muted-foreground text-lg mb-6 max-w-xl mx-auto">
                  Powered by advanced medical AI models. Get personalized health insights, 
                  symptom analysis, and wellness guidance 24/7.
                </p>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConsultationClick}
                  className="glass-card px-8 py-4 flex items-center justify-center gap-3 haptic-glow cursor-pointer group border-glow mx-auto"
                >
                  <MessageCircle className="w-5 h-5 text-primary transition-colors duration-300" />
                  <span className="text-base font-medium text-foreground">
                    Start Consultation
                  </span>
                  <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </motion.div>
            </section>

            {/* AI Models Section */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >

              </motion.div>
              
              
            </section>


            {/* Stats Section */}
            <section>
              <GlassWidget className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {[
                    { label: 'AI Models', value: '4+', icon: Brain },
                    { label: 'Health Topics', value: '100+', icon: Heart },
                    { label: 'Response Time', value: '<1s', icon: Zap },
                    { label: 'Accuracy Rate', value: '98%', icon: Activity },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <stat.icon className="w-6 h-6 text-primary" />
                      <span className="font-display text-2xl font-bold text-foreground">
                        {stat.value}
                      </span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassWidget>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer 
          className={`p-4 md:p-6 flex justify-center transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-xs text-muted-foreground text-center">
            Powered by Advanced Medical AI • HIPAA Compliant • Available 24/7 
            <br></br>
            Made with 💙 by Still Loading Team
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
