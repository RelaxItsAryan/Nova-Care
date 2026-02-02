import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Find a high-quality female AI voice for Nova
    // Priority: Google/Microsoft Neural voices > Apple voices > Other female voices
    const femaleVoiceKeywords = [
      'google us english',      // Google's natural female voice
      'google uk english female',
      'microsoft zira',         // Microsoft's female voice
      'microsoft aria',         // Microsoft Azure Neural female voice
      'microsoft jenny',        // Microsoft Neural female voice
      'samantha',               // Apple's default female voice (macOS/iOS)
      'karen',                  // Apple Australian female
      'moira',                  // Apple Irish female
      'tessa',                  // Apple South African female
      'fiona',                  // Apple Scottish female
      'victoria',               // Apple female voice
      'allison',                // Apple female voice
      'ava',                    // Apple female voice
      'susan',                  // Apple female voice
      'zira',                   // Windows female voice
      'hazel',                  // Windows UK female voice
      'female',                 // Generic female identifier
    ];

    // Find the best matching female voice
    let preferredVoice: SpeechSynthesisVoice | undefined;
    
    for (const keyword of femaleVoiceKeywords) {
      preferredVoice = voices.find(
        (voice) => 
          voice.lang.startsWith('en') && 
          voice.name.toLowerCase().includes(keyword)
      );
      if (preferredVoice) break;
    }

    // Fallback to any English voice, then any voice
    if (!preferredVoice) {
      preferredVoice = voices.find((voice) => voice.lang.startsWith('en')) || voices[0];
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log('Using voice:', preferredVoice.name);
    }

    // Slightly higher pitch for a more feminine, friendly tone
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
};
