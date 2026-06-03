import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineMilestone } from '../types';
import { InteractiveAvatar } from './InteractiveAvatar';
import { DynamicIcon } from './DynamicIcon';
import { playSuccessChime, playBubbleSound, playKeyTap, playErrorAlert } from '../audio';

interface GuidedTourProps {
  lang: 'en' | 'hi';
  milestones: TimelineMilestone[];
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  lang,
  milestones,
  activeTab,
  setActiveTab,
}) => {
  // Sort chronological
  const sortedMilestones = [...milestones].sort((a, b) => a.year - b.year);

  // Tour States
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Web Speech API refs
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  // Po's energetic yet peaceful Kung-Fu Panda welcome greeting with phonetic delays
  const speakWelcomeGreeting = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Punctuation like commas and ellipses are crucial for TTS pausing & stress
      const txt = "राधे-राधे प्रिय भाई! , , आपका... चंद्रशेखर गौतम जी के, , विशेष शिक्षण डिजीटल हब में... हार्दिक स्वागत है। , , मैं हूँ पो, , आपका कुंग-फू पांडा और आपका मार्गदर्शक! , , यदि आप... चंद्रशेखर सर की... प्रेरणादायक और अद्भुत समावेशी यात्रा को, , बोलती हुई मधुर कुंग-फू आवाज़ के साथ... अनुभव करना चाहते हैं, , तो अभी... 'ऑडियो के साथ जर्नी' बटन पर... क्लिक करें! , , अन्यथा... 'मैन्युअल खुद देखें' बटन दबाकर... स्वयं अपनी मर्जी से घूम लें। , , चलिए शुरू करते हैं! , , स्काडूश!";
      const utterance = new SpeechSynthesisUtterance(txt);
      const chosenVoice = getSubtleVoice('hi');
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
      utterance.pitch = 1.0;  // Natural realistic male pitch (1.0 is standard, highly realistic)
      utterance.rate = 0.95;  // Natural, human-like cadence & rhythm
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Po greeting error:', err);
    }
  };

  // Show welcome pop up on initial reload
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('has_seen_welcome_gautam');
    if (!hasSeenWelcome) {
      // Small graceful delay to let screen compile
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
        playSuccessChime();
        speakWelcomeGreeting();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync up voice/cancel speech when tour is aborted or state changes
  useEffect(() => {
    return () => {
      cancelCurrentSpeech();
    };
  }, []);

  // Main loop driver triggered on index or pause state change
  useEffect(() => {
    if (isTourActive && !isPaused) {
      speakStep(currentStepIndex);
    } else if (isPaused) {
      pauseSpeech();
    }
  }, [currentStepIndex, isTourActive, isPaused]);

  // Cancel speech helper
  const cancelCurrentSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setIsSpeaking(false);
  };

  // Pause speech helper
  const pauseSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    setIsSpeaking(false);
  };

  // Resume helper
  const resumeSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsSpeaking(true);
        setIsPaused(false);
      } else {
        setIsPaused(false);
      }
    } else {
      setIsPaused(false);
    }
  };

  // Filter for natural MALE voices for bilingual narration (not robotic, realistically paced)
  const getSubtleVoice = (localLang: 'en' | 'hi'): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    
    const langPattern = localLang === 'hi' ? 'hi' : 'en';
    const langVoices = voices.filter(v => 
      v.lang.toLowerCase().includes(langPattern) || 
      v.lang.toLowerCase().startsWith(langPattern)
    );

    const targetVoices = langVoices.length > 0 ? langVoices : voices;

    // 1. Prioritize explicit high-quality male voices
    const maleVoice = targetVoices.find(v => {
      const name = v.name.toLowerCase();
      return (name.includes('male') || name.includes('man') || name.includes('rishi') || name.includes('hemant') || name.includes('david') || name.includes('ravi') || name.includes('hari') || name.includes('google-hindi-m') || name.includes('microsoft heman')) &&
             !name.includes('female') && !name.includes('kalpana') && !name.includes('vaani') && !name.includes('sabina') && !name.includes('hazel') && !name.includes('zira');
    });
    if (maleVoice) return maleVoice;

    // 2. Reject known female voices
    const nonFemale = targetVoices.filter(v => {
      const name = v.name.toLowerCase();
      return !name.includes('female') && !name.includes('woman') && !name.includes('girl') && !name.includes('kalpana') && !name.includes('vaani') && !name.includes('sabina') && !name.includes('hazel') && !name.includes('zira') && !name.includes('heera') && !name.includes('ekta') && !name.includes('swara') && !name.includes('siri') && !name.includes('samantha') && !name.includes('susan');
    });
    if (nonFemale.length > 0) return nonFemale[0];

    return targetVoices[0];
  };

  // Compile narration paragraph for speech synthesis in the authentic tone of Po, the Kung-Fu Panda
  const compileNarrationText = (ms: TimelineMilestone): string => {
    if (lang === 'hi') {
      const titleText = ms.titleHi || ms.title;
      const yearIntro = `सुनो भाई सुनो! , , साल... ${ms.year}... का धमाकेदार मील का पत्थर! , , शीर्षक है: , , ${titleText}। , , `;
      
      const details = ms.eventsHi && ms.eventsHi.length > 0 ? ms.eventsHi : ms.events;
      // Join detail sentences with soft pauses in TTS
      const detailStr = details.map(item => `${item}। , `).join(' , ');
      
      const noteStr = ms.notesHi 
        ? ` , , चंद्रशेखर सर का... विशेष संदेश है: , , "${ms.notesHi}"। , , भाई ये तो कमाल की कुंग-फू तकनीक जैसी है!` 
        : ' , , यह वाकई... एक अतुल्य और शानदार प्रयास है!';
        
      return `${yearIntro}${ms.subtitleHi ? ms.subtitleHi + '। , ' : ''}${detailStr}${noteStr} , , स्काडूश! , , आइये... अब अगले मील के पत्थर की ओर बढ़ते हैं!`;
    } else {
      const yearIntro = `Hey look! Let's reflect on Year ${ms.year}... The remarkable milestone is: , , "${ms.title}". , , `;
      const detailStr = ms.events ? ms.events.join('. , ') : '';
      const noteStr = ms.notes ? ` , , Chandrashekhar Sir writes: , , "${ms.notes}". , , Truly inspiring kung-fu magic!` : ' Excellent!';
      return `${yearIntro}${ms.subtitle ? ms.subtitle + '. , ' : ''}${detailStr}${noteStr} , , Skadoosh! , , Now, let's step forward.`;
    }
  };

  // Play narration of a step
  const speakStep = (index: number) => {
    cancelCurrentSpeech();

    if (index < 0 || index >= sortedMilestones.length) {
      // Tour completed nicely
      handleCompletedTour();
      return;
    }

    const currentMs = sortedMilestones[index];

    // 1. Smooth physical scrolling to milestone element
    setTimeout(() => {
      const element = document.getElementById(`milestone-${currentMs.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);

    const speakText = compileNarrationText(currentMs);
    setIsSpeaking(true);

    // 2. Play Audio Speech via Web SpeechSynthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(speakText);
        
        // Select custom responsive voice
        const chosenVoice = getSubtleVoice(lang);
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }

        // Calibrate pitch and speed specifically for a realistic, clear male tone
        utterance.pitch = lang === 'hi' ? 1.0 : 1.0; 
        utterance.rate = lang === 'hi' ? 0.96 : 0.98; 

        utterance.onend = () => {
          setIsSpeaking(false);
          // Wait 2.5 seconds, then move to next step automatically
          fallbackTimerRef.current = window.setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
          }, 2500);
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis utterance error:', e);
          setIsSpeaking(false);
          startFallbackTimer(speakText);
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);

      } catch (err) {
        console.warn('Speech engine failed, using visual timer:', err);
        startFallbackTimer(speakText);
      }
    } else {
      startFallbackTimer(speakText);
    }
  };

  // Fallback timer if browser blocks Speech Synthesis
  const startFallbackTimer = (text: string) => {
    const wordCount = text.split(/\s+/).length;
    // Assume average 140 words per minute reading speed for Hindi/English
    const readDurationMs = Math.max(4000, (wordCount / 140) * 60 * 1000);
    
    fallbackTimerRef.current = window.setTimeout(() => {
      setIsSpeaking(false);
      setCurrentStepIndex(prev => prev + 1);
    }, readDurationMs);
  };

  const handleCompletedTour = () => {
    cancelCurrentSpeech();
    setIsTourActive(false);
    playSuccessChime();
    
    // Nice success alert
    alert(
      lang === 'hi'
        ? 'राधे-राधे! चंद्रशेखर सर की जीवन यात्रा का टूर पूरा हुआ। आप अपनी इच्छानुसार मैन्युअल एक्सप्लोर कर सकते हैं!'
        : 'Radhe-Radhe! The guided audio journey is completed successfully. Feel free to explore on your own!'
    );
  };

  // Start the Audio tour handler
  const triggerAudioTour = () => {
    setShowWelcomeModal(false);
    sessionStorage.setItem('has_seen_welcome_gautam', 'true');
    setActiveTab('timeline'); // Switch to journey timeline
    
    // Graceful animation transition delay
    setTimeout(() => {
      setIsTourActive(true);
      setCurrentStepIndex(0);
      setIsPaused(false);
      playSuccessChime();
    }, 450);
  };

  // Close welcome modal and do normal explore
  const triggerManualExplore = () => {
    setShowWelcomeModal(false);
    sessionStorage.setItem('has_seen_welcome_gautam', 'true');
    playBubbleSound();
  };

  const currentMs = sortedMilestones[currentStepIndex];

  return (
    <>
      {/* 1. INITIAL IMMERSIVE WELCOME MODAL POPUP */}
      <AnimatePresence>
        {showWelcomeModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4">
            
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              className="bg-white rounded-[40px] shadow-2xl border-4 border-indigo-150/40 max-w-2xl w-full p-8 md:p-10 text-center relative overflow-hidden"
            >
              {/* Radhe decorative particles */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

              {/* Dynamic folded hands Character */}
              <div className="flex flex-col items-center justify-center mb-6">
                <InteractiveAvatar
                  pose="namaste"
                  size={200}
                  className="animate-bounce"
                />
              </div>

              {/* High Contrast Welcome message */}
              <div className="space-y-3.5 max-w-lg mx-auto">
                <span className="px-3.5 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                  🐼 {lang === 'en' ? 'PANDA COMPANION GUIDE' : 'कुंग-फू पांडा गाइड: पो'}
                </span>

                <h2 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight leading-none">
                  {lang === 'en'
                    ? "Let's Speak with Po, your Kung-Fu Companion!"
                    : "अरे वाह! चंद्रशेखर सर के समावेशी हब में आपका स्वागत है!"
                  }
                </h2>

                <p className="text-slate-600 text-xs md:text-sm font-sans leading-relaxed">
                  {lang === 'en'
                    ? "I am Po, your legendary Dragon Warrior! I can guide you through an energetic, auto-scrolling spoken tour of Chandrashekhar Sir's key teaching milestones with linguistic pauses, or you can explore manually! Skadoosh!"
                    : "मैं हूँ पो, आपका सबसे प्रिय और सुपर-फनी कुंग-फू पांडा! मैं आपको चंद्रशेखर सर के असाधारण समावेशी शिक्षण अभ्यासों, संवेदी टूलकिट्स और अद्भुत उपलब्धियों को स्वयं ठहर-ठहर कर बोलकर सुनाने के लिए बिल्कुल तैयार हूँ। स्काडूश!"
                  }
                </p>
              </div>

              {/* Interactive Audio Selection button panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {/* Audio Path Button */}
                <button
                  onClick={triggerAudioTour}
                  className="p-5 bg-gradient-to-tr from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-3xl cursor-pointer transition-all hover:-translate-y-1 active:translate-y-0 text-left space-y-1.5 shadow-xl shadow-indigo-100 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg shadow-inner">
                    🎙️
                  </div>
                  <h4 className="font-extrabold text-sm group-hover:underline">
                    {lang === 'en' ? 'Audio-Guided Auto Tour' : 'ऑडियो के साथ जर्नी'}
                  </h4>
                  <p className="text-[10px] text-indigo-100 font-sans leading-snug">
                    {lang === 'en'
                      ? 'Character speaks and auto-scrolls down milestone by milestone chronologically.'
                      : 'कैरेक्टर पूरा टाइमलाइन बोलते चले और खुद-ब-खुद ऑटो स्क्रोल होकर सफर दिखाता रहे।'
                    }
                  </p>
                </button>

                {/* Manual Path Button */}
                <button
                  onClick={triggerManualExplore}
                  className="p-5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 active:translate-y-0 text-left space-y-1.5 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-200/60 flex items-center justify-center text-lg">
                    🔍
                  </div>
                  <h4 className="font-extrabold text-sm group-hover:underline">
                    {lang === 'en' ? 'Explore Manually' : 'मैन्युअल खुद देखें'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-sans leading-snug">
                    {lang === 'en'
                      ? 'Browse the complete workspace at your own comfortable pace without speech.'
                      : 'बिना वॉइस गाइडेंस के, अपनी गति से प्रत्येक शैक्षणिक कड़ियों को स्वयं ब्राउज़ करें।'
                    }
                  </p>
                </button>
              </div>

              {/* Help tip */}
              <p className="text-[10px] font-mono font-medium text-slate-400 mt-6 text-center">
                Radhe-Radhe &copy; 2026 inclusive specialized education initiative
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. FLOATING CONTROL WIDGET DURING ACTIVE SPEAKING TOUR */}
      <AnimatePresence>
        {isTourActive && currentMs && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 sm:px-0">
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              className="bg-white p-5 rounded-[36px] shadow-2xl border-2 border-indigo-150 relative flex gap-4 items-center overflow-hidden"
            >
              {/* Behind highlights */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-indigo-50/20 pointer-events-none" />

              {/* Dynamic closeup talk active character */}
              <div className="flex-shrink-0 relative z-10">
                <InteractiveAvatar
                  pose={isSpeaking ? 'speaking' : 'idle'}
                  size={105}
                  className="rounded-2xl border border-indigo-10s0/50 bg-indigo-50/40 p-1"
                />
              </div>

              {/* Right Side contents & playback controls */}
              <div className="flex-1 space-y-2.5 text-left relative z-10">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-mono font-black rounded-md uppercase tracking-wide">
                    {lang === 'en' ? 'SPEAKING TOUR' : 'ऑटो वॉइस गाइड'}
                  </span>
                  
                  {/* Status Indicator */}
                  <span className="text-[10px] font-black text-slate-700">
                    {currentStepIndex + 1} / {sortedMilestones.length} ({currentMs.year})
                  </span>
                </div>

                {/* Simulated speech balloon narrative snippet */}
                <div className="max-h-24 overflow-y-auto pr-1">
                  <p className="text-[11px] font-extrabold text-slate-700 leading-normal font-sans italic">
                    {lang === 'hi'
                      ? `"${currentMs.titleHi || currentMs.title}" &bull; ${currentMs.eventsHi && currentMs.eventsHi[0] ? currentMs.eventsHi[0] : (currentMs.events[0] || '')}`
                      : `"${currentMs.title}" &bull; ${currentMs.events[0] || ''}`
                    }
                  </p>
                </div>

                {/* Primary navigation toolbar */}
                <div className="flex items-center justify-between pt-1">
                  
                  {/* Step forward/backward dials */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 p-0.5 rounded-xl">
                    <button
                      onClick={() => {
                        playKeyTap();
                        setCurrentStepIndex(prev => Math.max(0, prev - 1));
                      }}
                      disabled={currentStepIndex === 0}
                      className="p-1.5 hover:bg-slate-250 hover:text-slate-900 disabled:opacity-40 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title="Back Milestone"
                    >
                      <DynamicIcon name="ArrowLeft" size={12} />
                    </button>

                    {/* Pause/Resume play controllers */}
                    {isPaused ? (
                      <button
                        onClick={() => {
                          playBubbleSound();
                          resumeSpeech();
                        }}
                        className="p-1.5 bg-teal-500 text-white rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        title="Resume Speech"
                      >
                        <DynamicIcon name="Play" size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playBubbleSound();
                          setIsPaused(true);
                        }}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        title="Pause Speech"
                      >
                        <DynamicIcon name="Pause" size={12} />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playKeyTap();
                        if (currentStepIndex + 1 < sortedMilestones.length) {
                          setCurrentStepIndex(prev => prev + 1);
                        } else {
                          handleCompletedTour();
                        }
                      }}
                      className="p-1.5 hover:bg-slate-250 hover:text-slate-900 rounded-lg text-slate-600 transition-colors cursor-pointer"
                      title="Skip / Skip Forward"
                    >
                      <DynamicIcon name="ArrowRight" size={12} />
                    </button>
                  </div>

                  {/* Red cancel escape button */}
                  <button
                    onClick={() => {
                      cancelCurrentSpeech();
                      setIsTourActive(false);
                      playErrorAlert();
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-[10px] uppercase rounded-xl tracking-tight border border-rose-200 transition-all cursor-pointer"
                    title="Exit tour and browse manually"
                  >
                    <span>🛑 {lang === 'en' ? 'Stop Tour' : 'टूर बंद करें'}</span>
                  </button>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual tour reactivation helper trigger floating button on journey timeline page */}
      {activeTab === 'timeline' && !isTourActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => {
              setIsTourActive(true);
              setCurrentStepIndex(0);
              setIsPaused(false);
              playSuccessChime();
            }}
            className="px-4 py-3 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-black rounded-full cursor-pointer shadow-xl flex items-center gap-2 hover:-translate-y-1 transition-all active:scale-95 border-2 border-white"
          >
            <span>🎙️</span>
            <span>{lang === 'en' ? 'Play Guided Audio Tour' : 'ऑडियो गाइड चलाएं'}</span>
          </button>
        </motion.div>
      )}
    </>
  );
};
