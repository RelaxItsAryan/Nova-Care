import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AmbientBackground from '@/components/AmbientBackground';
import VoiceOrb from '@/components/voice/VoiceOrb';
import WaveformVisualizer from '@/components/voice/WaveformVisualizer';
import GlassWidget from '@/components/GlassWidget';
import ChatPanel from '@/components/chat/ChatPanel';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import useAudioVisualization from '@/hooks/useAudioVisualization';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, MessageCircle, LogOut, LogIn } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const {
    isListening,
    audioLevel,
    audioData,
    startListening,
    stopListening,
  } = useAudioVisualization();

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

  const toggleVoice = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
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
      
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onVoiceStart={startListening}
        onVoiceStop={stopListening}
        isListening={isListening}
      />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6 flex items-center justify-between">
          <motion.div 
            className={`flex items-center gap-3 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border-glow">
              <Sparkles className="w-5 h-5 text-primary" /> <img src="/favicon.ico" alt="logo" className="rounded-xl"/>
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground">
                Nova Care
              </h1>
              <p className="text-xs text-muted-foreground">Medical AI Assistant</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 md:gap-3">
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

        {/* Main Interface - Simplified */}
        <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-8">
          <div className="flex flex-col items-center gap-8 max-w-lg w-full">
            {/* Center - Voice Orb */}
            <motion.div 
              className={`relative transition-all duration-1000 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <VoiceOrb 
                isListening={isListening}
                audioLevel={audioLevel}
                size="lg"
              />
            </motion.div>

            {/* Status text */}
            <motion.div
              className={`text-center transition-all duration-1000 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
                {user ? `Welcome back` : 'Your AI Health Companion'}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {isListening 
                  ? 'Listening... speak your question' 
                  : 'Tap below to start your consultation'}
              </p>
            </motion.div>

            {/* Waveform Visualizer */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="w-full"
                >
                  <GlassWidget floating={false} className="p-4">
                    <WaveformVisualizer 
                      isActive={isListening}
                      audioData={audioData}
                      barCount={40}
                    />
                  </GlassWidget>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <motion.div 
              className={`flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto transition-all duration-1000 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVoice}
                className={`w-full sm:w-auto glass-card px-6 py-3 flex items-center justify-center gap-3 haptic-glow cursor-pointer transition-all duration-300 ${
                  isListening ? 'border-glow' : ''
                }`}
                style={{
                  boxShadow: isListening ? '0 0 20px hsl(180 60% 55% / 0.4)' : undefined,
                }}
              >
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                <span className="text-sm font-medium text-foreground">
                  {isListening ? 'Stop Listening' : 'Voice Mode'}
                </span>
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConsultationClick}
                className="w-full sm:w-auto glass-card px-6 py-3 flex items-center justify-center gap-3 haptic-glow cursor-pointer group border-glow"
              >
                <MessageCircle className="w-5 h-5 text-primary transition-colors duration-300" />
                <span className="text-sm font-medium text-foreground">
                  Start Consultation
                </span>
              </motion.button>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer 
          className={`p-4 md:p-6 flex justify-center transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-xs text-muted-foreground text-center">
            Powered by Advanced Medical AI • Built with NovaCare <br/>
            Still Loading © {new Date().getFullYear()}

          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;