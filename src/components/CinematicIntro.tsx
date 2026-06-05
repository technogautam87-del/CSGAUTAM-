import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playKeyTap, playSuccessChime, playBubbleSound } from '../audio';

interface CinematicIntroProps {
  lang: 'en' | 'hi';
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ lang, onEnter }) => {
  const [liveTime, setLiveTime] = useState<string>('');
  const [cycleValue, setCycleValue] = useState<number>(2485);
  const [currentTextIdx, setCurrentTextIdx] = useState<number>(0);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [launchSequence, setLaunchSequence] = useState<boolean>(false);
  const audioIntervalRef = useRef<any>(null);

  // Typewriter Quotes in English and Hindi reflecting Space Video HUD but adjusted beautifully for CSG
  const quotes = lang === 'hi' ? [
    'शिक्षा असाधारण दिमागों के लिए सबसे बड़ा सपना है...',
    'सांकेतिक भाषा (ISL) मौन की सबसे खूबसूरत आवाज है...',
    'चन्द्रशेखर गौतम: दिव्यांगजनों के लिए समर्पित यात्रा मार्ग',
    'बाधारहित कक्षाओं का निर्माण और समावेशी शिक्षा का सवेरा',
    'स्पेशल मास्टर कंसोल: 100% पहुंच और सहयोग सक्रिय'
  ] : [
    'EDUCATION IS THE GREATEST DREAM OF EXCEPTIONAL MINDS...',
    'SIGN LANGUAGE IS THE MOST BEAUTIFUL VOICE OF SILENCE...',
    'CHANDRA SHEKHAR GAUTAM: DEDICATED JOURNEY FOR GIFTED HEARTS',
    'BUILDING BARRIERS-FREE CLASSROOMS & SENSORY EQUALITY',
    'SPECIAL PEDAGOGICAL PORTAL SYSTEM: DEPLOYED AND READY'
  ];

  // Dynamic Live UTC Time tracking
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${pad(now.getUTCMonth() + 1)}/${pad(now.getUTCDate())}/${now.getUTCFullYear()}`;
      const timeStr = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
      setLiveTime(`${dateStr} ${timeStr}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Soft random cycle counter ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCycleValue((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Accurate Typewriter Effect with Sound effects synchronized
  useEffect(() => {
    let index = 0;
    const fullText = quotes[currentTextIdx];
    setDisplayedText('');
    setIsTyping(true);

    const typeSpeed = Math.max(40, Math.min(80, 1500 / fullText.length)); // Speed based on quote length
    
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        // Soft audio feedback
        if (Math.random() > 0.45) {
          playKeyTap();
        }
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        // Delay before shifting to next text statement
        setTimeout(() => {
          setIsTyping(true);
          setCurrentTextIdx((prev) => (prev + 1) % quotes.length);
        }, 5500);
      }
    }, typeSpeed);

    return () => clearInterval(interval);
  }, [currentTextIdx, lang]);

  // Sound chime effects
  const handleLaunchClick = () => {
    setLaunchSequence(true);
    playSuccessChime();
    // Smooth hyperspace zoom-out transition
    setTimeout(() => {
      onEnter();
    }, 1200);
  };

  // Pre-generate stellar celestial stars backgrounds
  const starsArray = useRef(Array.from({ length: 65 }).map((_, idx) => ({
    id: idx,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: `${2 + Math.random() * 5}s`,
    delay: `${Math.random() * 4}s`,
    size: Math.random() > 0.7 ? 'w-[2px] h-[2px]' : 'w-[1px] h-[1px]',
  }))).current;

  return (
    <AnimatePresence>
      {!launchSequence && (
        <motion.div
          key="cinematic-backdrop"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-black text-slate-105 font-mono overflow-hidden select-none flex flex-col justify-between"
          style={{ backgroundImage: 'radial-gradient(circle at center, #0B0F19 0%, #020306 100%)' }}
        >
          {/* 1. ANIMATED COSMOS SPACE SCENE */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Stars cluster */}
            {starsArray.map((star) => (
              <div
                key={star.id}
                className={`absolute rounded-full bg-white/70 ${star.size} animate-pulse`}
                style={{
                  top: star.top,
                  left: star.left,
                  animationDuration: star.duration,
                  animationDelay: star.delay,
                }}
              />
            ))}
            
            {/* Soft Space Nebula Cloud */}
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 blur-[120px]" />
            <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-rose-500/5 to-purple-500/5 blur-[120px]" />
          </div>

          {/* 2. NASA HUD TOP SYSTEM HEADER BAR */}
          <header className="relative z-10 w-full border-b border-white/10 px-4 md:px-8 py-4 backdrop-blur-xs bg-black/40 flex items-center justify-between text-[10px] md:text-xs text-indigo-300">
            {/* Left Tickers */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-extrabold text-white">SMART-INCLUSIVE-EDU</span>
                <span className="text-white/40">/</span>
                <span className="text-emerald-450 font-bold">PORTAL C-49</span>
              </div>
              <div className="hidden md:flex items-center gap-4 text-indigo-400">
                <span>CYCLE: +{cycleValue}</span>
                <span>TIME: {liveTime}</span>
              </div>
            </div>

            {/* NASA Inspired Logo Block */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 flex items-center justify-center">
              <span className="text-sm md:text-[18px] font-black tracking-[0.25em] text-white hover:text-indigo-400 cursor-pointer transition-colors leading-none flex items-center gap-1">
                <span>⚡</span> CSG
              </span>
            </div>

            {/* Right Action Option */}
            <div className="flex items-center gap-2 tracking-widest text-[#D4AF37] font-bold">
              <span className="hidden md:inline uppercase text-white/50">{lang === 'hi' ? 'शिक्षण कंसोल' : 'DEAF INCLUSION PROGRAM'} &bull;</span>
              <span className="text-xs uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-sm text-yellow-400">{lang === 'hi' ? 'पहुंच योग्य' : 'SECURE HUB'}</span>
            </div>
          </header>

          {/* 3. CENTERPIECE: ROTATING EARTH GLOBE CONSTRUCT & DUAL HUD GAUGES */}
          <main className="relative z-10 flex-1 w-full flex flex-col md:flex-row items-center justify-center px-4 md:px-12 py-6 overflow-hidden">
            
            {/* SIDEBAR NAVIGATION GAUGES (LEFT) */}
            <div className="hidden lg:flex flex-col space-y-6 w-60 text-left border-l border-white/10 pl-4 tracking-widest text-[10px] text-white/50">
              <div>
                <h4 className="text-indigo-400 font-extrabold text-[11px] mb-2 uppercase tracking-widest">// SYSTEM PRE-FLIGHT DIAGNOSTICS</h4>
                <div className="space-y-1 font-mono text-[9px]">
                  <p>DEAF ACCESSIBILITY: <span className="text-emerald-400">OPTIMAL</span></p>
                  <p>SIGN LANGUAGE INTEGRITY: <span className="text-emerald-400 font-extrabold">100%</span></p>
                  <p>SENSORY DISTRIBUTION: <span className="text-emerald-400 font-extrabold">ONLINE</span></p>
                  <p>BARR-FREE DEPLOYMENT: <span className="text-cyan-400">ACTIVE</span></p>
                </div>
              </div>
              <div>
                <h4 className="text-indigo-400 font-extrabold text-[11px] mb-2 uppercase tracking-widest">// CHANNELS ENGAGED</h4>
                <div className="space-y-1 font-mono text-[9px]">
                  <p>VISITOR STATUS: <span className="text-amber-400">ENGAGED</span></p>
                  <p>BILINGUAL SYNCS: <span className="text-emerald-400">HI / EN LINKED</span></p>
                  <p>REALTIME DATA FEED: <span className="text-white">ON (FIRESTORE)</span></p>
                  <p>VETO-INDEX LEVEL: <span className="text-emerald-400 font-bold">SAFE (LEVEL-5)</span></p>
                </div>
              </div>
            </div>

            {/* CORE CENTRAL VIEWPORT: GLOWING HIGH-TECH GRID EARTH GLOBE */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl relative w-full h-full">
              
              {/* Spinning target circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                {/* Circular scanner rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  className="w-80 h-80 md:w-110 md:h-110 rounded-full border border-dashed border-white/5 opacity-20 flex items-center justify-center relative"
                >
                  <div className="absolute top-0 right-0 w-3 h-3 border border-white/20 rounded-full flex items-center justify-center">
                    <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  className="w-68 h-68 md:w-[23rem] md:h-[23rem] rounded-full border border-spaced border-indigo-500/10 opacity-30 absolute"
                />
                
                {/* Angle Tick Indicators */}
                <div className="absolute w-[20rem] md:w-[28rem] h-[20rem] md:h-[28rem] border border-white/5 rounded-full flex items-center justify-center">
                  <span className="absolute left-0 text-[8px] font-mono opacity-30">270&deg;W</span>
                  <span className="absolute right-0 text-[8px] font-mono opacity-30">090&deg;E</span>
                  <span className="absolute top-0 text-[8px] font-mono opacity-30">000&deg;N</span>
                  <span className="absolute bottom-0 text-[8px] font-mono opacity-30">180&deg;S</span>
                </div>
              </div>

              {/* Glowing Space Earth Sphere */}
              <div className="relative z-10 w-48 h-48 md:w-68 md:h-68 rounded-full flex items-center justify-center mb-8 group animate-fade-in">
                {/* Intense Cosmic atmosphere aura light glow */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.35)_0%,rgba(99,102,241,0.15)_100%)] blur-[40px] shadow-[0_0_90px_35px_rgba(56,189,248,0.4)] pointer-events-none z-0" />
                
                {/* 3D Glassy Atmosphere outer layer */}
                <div className="absolute inset-[-4px] rounded-full border border-indigo-400/30 bg-gradient-to-tr from-cyan-400/10 to-indigo-500/25 pointer-events-none z-20 shadow-[inset_0_4px_12px_rgba(255,255,255,0.35)]" />
                
                {/* Visual Earth Sphere with atmospheric ring */}
                <div className="w-full h-full rounded-full border-2 border-indigo-400/40 relative overflow-hidden backdrop-blur-3xs shadow-inner">
                  {/* Slow rotation 3D Space & Earth texture background */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ ease: 'linear', duration: 75, repeat: Infinity }}
                    className="absolute inset-[-10px] w-[120%] h-[120%] -left-[10%] -top-[10%]"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=85"
                      alt="3D Space Earth"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-95 pointer-events-none rounded-full"
                    />
                  </motion.div>
                  {/* Dynamic atmospheric neon scanned overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:12px_12px] opacity-70 pointer-events-none mix-blend-overlay z-12" />
                  
                  {/* Realistic atmospheric curve light shadow mapping to create the 3D Sphere volume effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,transparent_35%,rgba(2,3,6,0.92)_90%)] pointer-events-none mix-blend-multiply z-15" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-white/15 pointer-events-none mix-blend-screen z-16" />
                </div>

                {/* Satellite orbit tracker line */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-20px] md:inset-[-26px] border border-dashed border-cyan-400/30 rounded-full flex items-center justify-end z-20 pointer-events-none"
                >
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_12px_#facc15] mr-1 flex items-center justify-center">
                    <span className="w-1 h-1 bg-white rounded-full animate-ping" />
                  </span>
                </motion.div>
              </div>

              {/* HUD TYPEWRITER DIALOGUE BOX (Pulsing cyber terminal brackets) */}
              <div className="w-full max-w-xl text-center px-4 md:px-8 space-y-5">
                
                {/* Display Typewriter Quote inside technical square brackets */}
                <div className="min-h-[44px] flex items-center justify-center font-mono">
                  <div className="text-center font-bold tracking-wider text-white bg-slate-900/45 px-5 py-3 border border-indigo-500/15 rounded-xl inline-block max-w-[95%]">
                    <span className="text-indigo-400 mr-2 font-black text-xs md:text-sm">[</span>
                    <span className="text-[11px] md:text-xs text-slate-100 uppercase font-bold tracking-widest">{displayedText}</span>
                    <span className="text-indigo-400 ml-2 font-black text-xs md:text-sm">]</span>
                    
                    {/* Blinking CLI Cursor */}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="ml-1 w-2 h-3.5 bg-emerald-400 inline-block align-middle shadow-xs"
                    />
                  </div>
                </div>

                {/* PRIMARY CONSOLE LAUNCH BUTTON CONTAINER */}
                <div className="relative flex items-center justify-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLaunchClick}
                    className="relative group cursor-pointer z-20 px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-rose-600 text-white border border-white/20 rounded-xl font-mono text-[10px] md:text-xs font-black tracking-widest uppercase shadow-[0_4px_24px_rgba(30,144,255,0.35)] flex items-center gap-2 overflow-hidden"
                  >
                    {/* Scanning sheen light overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    
                    <span>🚀</span>
                    <span>{lang === 'hi' ? 'मंत्रालय कंसोल चालू करें (ENTER PROFILE)' : 'INITIALIZE PROFILE CONSOLE'}</span>
                    
                    {/* Glowing button indicators */}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block border border-white/25" />
                  </motion.button>
                  
                  {/* Concentric expanding background rings on hover */}
                  <div className="absolute w-44 h-44 rounded-full border border-indigo-500/10 pointer-events-none scale-100 animate-pulse" />
                </div>
              </div>
            </div>

            {/* SIDEBAR NAVIGATION GAUGES (RIGHT) */}
            <div className="hidden lg:flex flex-col space-y-6 w-60 text-right border-r border-white/10 pr-4 tracking-widest text-[10px] text-white/50">
              <div>
                <h4 className="text-[#D4AF37] font-extrabold text-[11px] mb-2 uppercase tracking-widest">// TYPES OF SPECIAL EDUCATION</h4>
                <div className="space-y-1 font-mono text-[9px]">
                  <p>DEAF-MUTISM RESEARCH: <span className="text-indigo-300">ACTIVE // SEC</span></p>
                  <p>INDIAN SIGN LANGUAGE ID: <span className="text-indigo-300 font-bold">120+ CODES</span></p>
                  <p>SENSORY ACTIVITY BLU: <span className="text-indigo-300">RELEASED</span></p>
                  <p>CLASSROOM SYNC RATE: <span className="text-emerald-450 font-bold">99.8% REAL</span></p>
                </div>
              </div>
              <div>
                <h4 className="text-indigo-400 font-extrabold text-[11px] mb-2 uppercase tracking-widest">// COGNITIVE DEVELOPMENT STATS</h4>
                <div className="space-y-1 font-mono text-[9px]">
                  <p>EXCEPTIONAL STUDENT OUTREACH: <span className="text-emerald-400 font-black">450+ PUPILS</span></p>
                  <p>SOCIETAL IMPACT METRICS: <span className="text-white">OUTSTANDING</span></p>
                  <p>BARRIERS SHREDDED: <span className="text-rose-450 font-black">MAX STATUS</span></p>
                  <p>INCLUSION LEVEL: <span className="text-emerald-400">STATE RECOGNIZED</span></p>
                </div>
              </div>
            </div>

          </main>

          {/* 4. NASA HUD BOTTOM DIAGNOSTIC CHART / RUNNING SENSOR FOOTER */}
          <footer className="relative z-10 w-full border-t border-white/10 px-4 md:px-8 py-3.5 backdrop-blur-xs bg-black/40 flex flex-col md:flex-row items-center justify-between text-[8px] md:text-[10px] text-slate-500">
            {/* Realtime dynamic graph spline simulation */}
            <div className="flex items-center gap-4 w-full md:w-auto mb-2 md:mb-0">
              <span className="uppercase text-white/40 tracking-wider">ACCESSIBILITY-WAVE-RADAR:</span>
              <svg className="w-24 md:w-44 h-6 text-cyan-400 stroke-current fill-none" viewBox="0 0 160 20">
                <motion.path
                  animate={{
                    d: [
                      "M 0 10 Q 20 2, 40 10 T 80 10 T 120 10 T 160 10",
                      "M 0 10 Q 20 18, 40 10 T 80 10 T 120 10 T 160 10",
                      "M 0 10 Q 20 2, 40 10 T 80 10 T 120 10 T 160 10"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  strokeWidth="1.5"
                />
                {/* High tech grid lines behind the wav line */}
                <line x1="0" y1="10" x2="160" y2="10" stroke="rgba(255,255,255,0.08)" strokeDasharray="2" />
              </svg>
              <span className="text-emerald-400 uppercase font-bold animate-pulse">SENSING DIAG: LIVE</span>
            </div>

            {/* Inclusivity Credentials */}
            <div className="text-center text-[9px] md:text-xs tracking-wider font-bold mb-2 md:mb-0">
              <span className="text-stone-300 uppercase">{lang === 'hi' ? 'दिव्यांगजन शिक्षक' : 'SPECIAL EDUCATOR'}</span>
              <span className="text-white/40 px-2">&bull;</span>
              <span className="text-sky-400 uppercase">{lang === 'hi' ? 'चन्द्रशेखर गौतम' : 'CHANDRA SHEKHAR GAUTAM'}</span>
            </div>

            {/* Bottom tickers (NASA status line equivalents) */}
            <div className="flex items-center gap-4 text-slate-500 uppercase font-bold">
              <span>SENSORS: ACTIVE</span>
              <span className="hidden md:inline">&bull;</span>
              <span>AUDIT ASSESSMENT: ENGAGED</span>
              <span>&bull;</span>
              <span className="text-white">{lang === 'hi' ? 'भारतीय सांकेतिक भाषा संगोष्ठी' : 'ISL CONSOLE ACTIVE'}</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
