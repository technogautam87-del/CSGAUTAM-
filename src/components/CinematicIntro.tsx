import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playKeyTap, playSuccessChime, playBubbleSound } from '../audio';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

interface CinematicIntroProps {
  lang: 'en' | 'hi';
  onEnter: () => void;
}

interface ExplosionParticle {
  id: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  duration: number;
}

interface ActiveExplosion {
  id: number;
  type: 'earth' | 'violet' | 'amber';
  particles: ExplosionParticle[];
}

/* 1. SEPARATE ACCELERATED BACKGROUND NEBULA MODULE WITH MEMO */
const BackgroundNebula: React.FC = React.memo(() => {
  const starsArray = useRef(Array.from({ length: 65 }).map((_, idx) => ({
    id: idx,
    top: `${Math.random() * 105}%`,
    left: `${Math.random() * 105}%`,
    duration: `${2.5 + Math.random() * 4.5}s`,
    delay: `${Math.random() * 3}s`,
    size: Math.random() > 0.72 ? 'w-[2px] h-[2px]' : 'w-[1px] h-[1px]',
  }))).current;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
      {/* Stars cluster */}
      {starsArray.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white/70 ${star.size} animate-pulse transform-gpu`}
          style={{
            top: star.top,
            left: star.left,
            animationDuration: star.duration,
            animationDelay: star.delay,
            willChange: 'opacity',
          }}
        />
      ))}
      
      {/* High performance low-weight Space Nebula Cloud */}
      <div 
        className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 blur-[120px] pointer-events-none transform-gpu"
        style={{ willChange: 'transform' }}
      />
      <div 
        className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-rose-500/5 to-purple-500/5 blur-[120px] pointer-events-none transform-gpu"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
});
BackgroundNebula.displayName = 'BackgroundNebula';

/* 2. OPTIMIZED SYSTEM DIAGNOSTIC HEADER (Pushes 1000ms and 4500ms intervals down) */
interface DiagnosticHeaderProps {
  lang: 'en' | 'hi';
}

const DiagnosticHeader: React.FC<DiagnosticHeaderProps> = React.memo(({ lang }) => {
  const [liveTime, setLiveTime] = useState<string>('');
  const [cycleValue, setCycleValue] = useState<number>(2485);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleValue((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-10 w-full border-b border-white/10 px-4 md:px-8 py-4 bg-black/40 backdrop-blur-[1px] flex items-center justify-between text-[10px] md:text-xs text-indigo-300 transform-gpu">
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
  );
});
DiagnosticHeader.displayName = 'DiagnosticHeader';

/* 3. TYPEWRITER CLI SYSTEM CONSOLE (Pushes high-speed 40-80ms render updates down) */
interface TypewriterConsoleProps {
  lang: 'en' | 'hi';
  quotes: string[];
}

const TypewriterConsole: React.FC<TypewriterConsoleProps> = React.memo(({ lang, quotes }) => {
  const [currentTextIdx, setCurrentTextIdx] = useState<number>(0);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        setCurrentTextIdx((prev) => (prev + 1) % quotes.length);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [lang, quotes]);

  const currentQuote = quotes[currentTextIdx] || '';

  return (
    <div className="min-h-[44px] flex items-center justify-center font-mono transform-gpu">
      <div className="text-center font-bold tracking-wider text-white bg-slate-900/60 px-5 py-3 border border-indigo-500/15 rounded-xl inline-block max-w-[95%] shadow-[0_0_15px_rgba(99,102,241,0.05)]">
        <span className="text-indigo-400 mr-2 font-black text-xs md:text-sm">[</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentTextIdx}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-[11px] md:text-xs text-slate-100 uppercase font-bold tracking-widest inline-block"
          >
            {currentQuote}
          </motion.span>
        </AnimatePresence>
        <span className="text-indigo-400 ml-2 font-black text-xs md:text-sm">]</span>
        
        {/* Blinking CLI Cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="ml-1 w-2 h-3.5 bg-emerald-400 inline-block align-middle"
        />
      </div>
    </div>
  );
});
TypewriterConsole.displayName = 'TypewriterConsole';

/* Helper to calculate the lunar cycle phase value (0 to 1) for any Date */
const getLunarPhase = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = Math.floor(A / 4);
  const C = 2 - A + B;
  const E = Math.floor(365.25 * (y + 4716));
  const F = Math.floor(30.6001 * (m + 1));
  const jd = C + day + E + F - 1524.5;

  const synodicMonth = 29.530588853;
  const baseJD = 2451550.1; // Known new moon JD: Jan 6, 2000
  const daysSinceBase = jd - baseJD;
  const cycles = daysSinceBase / synodicMonth;
  const phaseValue = cycles - Math.floor(cycles); // 0.0 to 1.0

  return phaseValue;
};

/* Helper to get translated lunar phase metadata and illumination percentage */
const getLunarPhaseDetails = (p: number, lang: 'hi' | 'en') => {
  if (p < 0.04 || p > 0.96) {
    return {
      name: lang === 'hi' ? 'अमावस्या (NEW MOON)' : 'NEW MOON',
      illumination: 0,
    };
  } else if (p >= 0.04 && p < 0.22) {
    return {
      name: lang === 'hi' ? 'बाल चंद्र (WAXING CRESCENT)' : 'WAXING CRESCENT',
      illumination: Math.round(p * 200),
    };
  } else if (p >= 0.22 && p < 0.28) {
    return {
      name: lang === 'hi' ? 'अर्ध चंद्र (FIRST QUARTER)' : 'FIRST QUARTER',
      illumination: 50,
    };
  } else if (p >= 0.28 && p < 0.46) {
    return {
      name: lang === 'hi' ? 'गिब्बस चंद्र (WAXING GIBBOUS)' : 'WAXING GIBBOUS',
      illumination: Math.round(60 + (p - 0.28) * 220),
    };
  } else if (p >= 0.46 && p < 0.54) {
    return {
      name: lang === 'hi' ? 'पूर्णिमा (FULL MOON)' : 'FULL MOON',
      illumination: 100,
    };
  } else if (p >= 0.54 && p < 0.72) {
    return {
      name: lang === 'hi' ? 'गिब्बस चंद्र (WANING GIBBOUS)' : 'WANING GIBBOUS',
      illumination: Math.round(100 - (p - 0.54) * 220),
    };
  } else if (p >= 0.72 && p < 0.78) {
    return {
      name: lang === 'hi' ? 'अर्ध चंद्र (LAST QUARTER)' : 'LAST QUARTER',
      illumination: 50,
    };
  } else {
    return {
      name: lang === 'hi' ? 'कृष्ण पक्ष बाल चंद्र (WANING CRESCENT)' : 'WANING CRESCENT',
      illumination: Math.round((1 - p) * 200),
    };
  }
};

/* 4. SEPARATE CORE CELESTIAL ROTATION GRAPHIC WITH DYNAMIC LUNAR PHASE SHAPE */
interface InteractiveStarSystemProps {
  lang: 'en' | 'hi';
}

const InteractiveStarSystem: React.FC<InteractiveStarSystemProps> = React.memo(({ lang }) => {
  const [explosions, setExplosions] = useState<ActiveExplosion[]>([]);
  const [dateOffset, setDateOffset] = useState<number>(0);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const simulatedDate = new Date(Date.now() + dateOffset * 24 * 60 * 60 * 1000);
  const phase = getLunarPhase(simulatedDate);
  const phaseMeta = getLunarPhaseDetails(phase, lang);

  // Generate dynamic SVG mask path for standard lunar terminator line
  const rx = 50 * Math.abs(1 - 2 * phase);
  let pathD = "";
  if (phase < 0.5) {
    // Waxing Moon: Light on right, shadow on left
    const sweep = phase < 0.25 ? 1 : 0;
    pathD = `M 50 0 A 50 50 0 0 0 50 100 A ${rx} 50 0 0 ${sweep} 50 0 Z`;
  } else {
    // Waning Moon: Light on left, shadow on right
    const sweep = phase < 0.75 ? 0 : 1;
    pathD = `M 50 0 A ${rx} 50 0 0 ${sweep} 50 100 A 50 50 0 0 0 50 0 Z`;
  }

  const handleMoonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Progress date offset by 3 days for easy visual phase exploration
    setDateOffset((prev) => prev + 3);
    triggerExplosion('earth');
  };

  const triggerExplosion = (type: 'earth' | 'violet' | 'amber') => {
    // Play custom audio feedback
    playBubbleSound();

    let colors: string[] = [];
    let particleCount = 18;
    let baseSpread = 110;
    
    if (type === 'earth') {
      colors = ['#cbd5e1', '#94a3b8', '#e2e8f0', '#38bdf8', '#ffffff'];
      particleCount = 26;
      baseSpread = 145;
    } else if (type === 'violet') {
      colors = ['#c084fc', '#e879f9', '#a78bfa', '#f472b6', '#ffffff'];
      particleCount = 14;
      baseSpread = 65;
    } else {
      colors = ['#fbbf24', '#f59e0b', '#fb7185', '#fb923c', '#ffffff'];
      particleCount = 14;
      baseSpread = 65;
    }

    const newParticles: ExplosionParticle[] = Array.from({ length: particleCount }).map((_, i) => {
      const angle = (i * (360 / particleCount) + Math.random() * 15) * (Math.PI / 180);
      const distance = (baseSpread * 0.42) + Math.random() * (baseSpread * 0.58);
      const dx = Math.sin(angle) * distance;
      const dy = Math.cos(angle) * distance;
      const size = 2.5 + Math.random() * 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 0.4 + Math.random() * 0.45;
      return { id: i, dx, dy, size, color, duration };
    });

    const explosionId = Date.now() + Math.random();
    setExplosions((prev) => [...prev, { id: explosionId, type, particles: newParticles }]);

    setTimeout(() => {
      if (isMountedRef.current) {
        setExplosions((prev) => prev.filter((exp) => exp.id !== explosionId));
      }
    }, 950);
  };

  const formattedsimulatedDate = simulatedDate.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-2xl relative w-full h-full transform-gpu z-10 mb-8 md:mb-10">
      
      {/* Spinning target circles - hardware-accelerated via transform-gpu & willChange */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 transform-gpu">
        {/* Outer orbital wire */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="w-80 h-80 md:w-110 md:h-110 rounded-full border border-dashed border-white/5 opacity-20 flex items-center justify-center relative transform-gpu"
          style={{ willChange: 'transform' }}
        >
          <div className="absolute top-0 right-0 w-3 h-3 border border-white/20 rounded-full flex items-center justify-center">
            <span className="w-1 h-1 bg-cyan-400 rounded-full" />
          </div>
        </motion.div>
        
        {/* Inner reverse orbital wire */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="w-68 h-68 md:w-[23rem] md:h-[23rem] rounded-full border border-spaced border-indigo-500/10 opacity-35 absolute transform-gpu"
          style={{ willChange: 'transform' }}
        />
        
        {/* Angle Tick Indicators */}
        <div className="absolute w-[20rem] md:w-[28rem] h-[20rem] md:h-[28rem] border border-white/5 rounded-full flex items-center justify-center">
          <span className="absolute left-0 text-[8px] font-mono opacity-30">270&deg;W</span>
          <span className="absolute right-0 text-[8px] font-mono opacity-30">090&deg;E</span>
          <span className="absolute top-0 text-[8px] font-mono opacity-30">000&deg;N</span>
          <span className="absolute bottom-0 text-[8px] font-mono opacity-30">180&deg;S</span>
        </div>
      </div>

      {/* Main Core 3D Moon Globe Sphere with dynamic shadow shape mask */}
      <div
        onClick={handleMoonClick}
        className="relative z-10 w-48 h-48 md:w-68 md:h-68 rounded-full flex items-center justify-center group animate-fade-in cursor-pointer transform-gpu transition-transform duration-350 hover:scale-[1.02]"
        style={{ willChange: 'transform' }}
      >
        {/* Cosmic high contrast atmosphere aura golden-white moon glow */}
        <div 
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,241,190,0.18)_0%,rgba(99,102,241,0.04)_100%)] blur-[35px] shadow-[0_0_80px_20px_rgba(255,255,255,0.22)] pointer-events-none z-0 transform-gpu"
          style={{ willChange: 'transform' }}
        />
        
        {/* 3D Glassy atmosphere refraction outer layer */}
        <div className="absolute inset-[-4px] rounded-full border border-slate-400/20 bg-gradient-to-tr from-indigo-300/5 to-slate-200/10 pointer-events-none z-20 shadow-[inset_0_4px_10px_rgba(255,255,255,0.15)]" />
        
        {/* Sphere Container */}
        <div className="w-full h-full rounded-full border border-slate-500/30 relative overflow-hidden shadow-inner transform-gpu">
          {/* Moon texture spinning layer */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ ease: 'linear', duration: 180, repeat: Infinity }}
            className="absolute inset-[-10px] w-[120%] h-[120%] -left-[10%] -top-[10%] transform-gpu"
            style={{ willChange: 'transform' }}
          >
            <img
              src="https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=450&q=80"
              alt="3D Space Moon"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-95 pointer-events-none rounded-full select-none"
            />
          </motion.div>

          {/* DYNAMIC SVG terminator vector shadow overlay inside the Moon circle */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-10" viewBox="0 0 100 100">
            <defs>
              <filter id="moon-blur-filter">
                <feGaussianBlur stdDeviation="1.8" />
              </filter>
            </defs>
            <path
              d={pathD}
              fill="#030612"
              fillOpacity="0.95"
              filter="url(#moon-blur-filter)"
            />
          </svg>

          {/* Subtle tech horizontal matrix mesh grids overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25 pointer-events-none mix-blend-overlay z-12" />
          
          {/* Dimensional sphere volumetric shadow map styling */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,transparent_50%,rgba(2,3,6,0.95)_100%)] pointer-events-none mix-blend-multiply z-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-white/10 pointer-events-none mix-blend-screen z-16" />
        </div>

        {/* Moon Planet's dynamic explosive particle layers */}
        <AnimatePresence>
          {explosions.filter(exp => exp.type === 'earth').map(exp => (
            <div key={exp.id} className="absolute inset-0 pointer-events-none z-50 overflow-visible transform-gpu">
              {exp.particles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{ x: p.dx, y: p.dy, scale: [1, 1.25, 0], opacity: [1, 0.75, 0] }}
                  transition={{ duration: p.duration, ease: 'easeOut' }}
                  className="absolute left-1/2 top-1/2 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.65)] transform-gpu"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                    willChange: 'transform, opacity',
                  }}
                />
              ))}
            </div>
          ))}
        </AnimatePresence>

        {/* Satellite orbit tracker wire rings */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-20px] md:inset-[-26px] border border-dashed border-cyan-400/20 rounded-full flex items-center justify-end z-20 pointer-events-none transform-gpu"
          style={{ willChange: 'transform' }}
        >
          <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-[0_0_8px_#facc15] mr-1 flex items-center justify-center">
            <span className="w-1 h-1 bg-white rounded-full animate-ping" />
          </span>
        </motion.div>

        {/* INTERACTIVE TOOLTIP FOR MAIN MOON GLOBE */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-700/30 px-3.5 py-2 rounded-lg text-[9px] md:text-xs text-white shadow-xl opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-30 flex flex-col items-center gap-0.5 whitespace-nowrap min-w-[200px]">
          <div className="flex items-center gap-1.5 font-bold font-mono">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
            <span>{phaseMeta.name} ({phaseMeta.illumination}%)</span>
          </div>
          <div className="text-[8px] md:text-[9px] text-slate-400 italic">
            {lang === 'hi' ? 'क्लिक करें: चन्द्रकला बदलें (+३ दिन)' : 'Click to advance phase (+3 days)'}
          </div>
        </div>

        {/* Secondary Orb 1: Violet/Teal Gas Giant (Top Right) */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            triggerExplosion('violet');
          }}
          className="absolute -top-10 -right-10 md:-top-14 md:-right-14 w-8 h-8 md:w-12 md:h-12 rounded-full border border-violet-400/20 bg-gradient-to-br from-indigo-900 to-purple-800 cursor-pointer overflow-visible z-25 group/violet hover:scale-105 transition-all duration-200 transform-gpu"
          style={{ willChange: 'transform' }}
        >
          <img
            src="https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=100&q=80"
            alt="Violet Planet"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full opacity-80 mix-blend-screen"
          />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,transparent_30%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          
          {/* Violet Planet's Particle Explosion */}
          <AnimatePresence>
            {explosions.filter(exp => exp.type === 'violet').map(exp => (
              <div key={exp.id} className="absolute inset-0 pointer-events-none z-50 overflow-visible transform-gpu">
                {exp.particles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: p.dx, y: p.dy, scale: [1, 1.2, 0], opacity: [1, 0.75, 0] }}
                    transition={{ duration: p.duration, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 rounded-full shadow-[0_0_5px_rgba(167,139,250,0.4)] transform-gpu"
                    style={{
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      marginLeft: -p.size / 2,
                      marginTop: -p.size / 2,
                      willChange: 'transform, opacity',
                    }}
                  />
                ))}
              </div>
            ))}
          </AnimatePresence>

          {/* Tooltip on individual planet hover & group hover */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-violet-500/30 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] text-violet-300 font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/violet:opacity-100 -translate-y-1 group-hover/violet:translate-y-0 transition-all duration-200 pointer-events-none z-30 flex items-center gap-1.5 font-mono">
            <span className="w-1 h-1 bg-violet-400 rounded-full animate-ping" />
            <span>{lang === 'hi' ? "चन्द्रशेखर गौतम" : "Chandra Shekhar"}</span>
          </div>
        </motion.div>

        {/* Secondary Orb 2: Golden Warm Desert Planet (Bottom Left) */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            triggerExplosion('amber');
          }}
          className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 w-6 h-6 md:w-10 md:h-10 rounded-full border border-amber-400/20 bg-gradient-to-br from-amber-900 to-red-800 cursor-pointer overflow-visible z-25 group/amber hover:scale-105 transition-all duration-200 transform-gpu"
          style={{ willChange: 'transform' }}
        >
          <img
            src="https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=100&q=80"
            alt="Amber Planet"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full opacity-80 mix-blend-screen"
          />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,transparent_30%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          
          {/* Amber Planet's Particle Explosion */}
          <AnimatePresence>
            {explosions.filter(exp => exp.type === 'amber').map(exp => (
              <div key={exp.id} className="absolute inset-0 pointer-events-none z-50 overflow-visible transform-gpu">
                {exp.particles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: p.dx, y: p.dy, scale: [1, 1.2, 0], opacity: [1, 0.75, 0] }}
                    transition={{ duration: p.duration, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 rounded-full shadow-[0_0_5px_rgba(245,158,11,0.4)] transform-gpu"
                    style={{
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      marginLeft: -p.size / 2,
                      marginTop: -p.size / 2,
                      willChange: 'transform, opacity',
                    }}
                  />
                ))}
              </div>
            ))}
          </AnimatePresence>

          {/* Tooltip on individual planet hover */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-amber-500/30 px-2.5 py-1 rounded-md text-[9px] md:text-[10px] text-amber-300 font-bold whitespace-nowrap shadow-lg opacity-0 group-hover/amber:opacity-100 translate-y-1 group-hover/amber:translate-y-0 transition-all duration-200 pointer-events-none z-30 flex items-center gap-1.5 font-mono">
            <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping" />
            <span>{lang === 'hi' ? "भारतीय सांकेतिक भाषा" : "ISL Trainer"}</span>
          </div>
        </motion.div>
      </div>

      {/* DYNAMIC LUNAR DATA FIELD DISPLAY */}
      <motion.div
        key={dateOffset}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex flex-col items-center gap-1 text-center font-mono select-none"
      >
        <span className="text-[10px] md:text-xs text-amber-400 tracking-widest font-bold uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          {lang === 'hi' ? 'चंद्रकला स्थिति:' : 'LUNAR PHASE STATUS:'} {phaseMeta.name}
        </span>
        <span className="text-[9px] md:text-[10px] text-slate-400 tracking-widest font-semibold">
          {formattedsimulatedDate} &bull; {lang === 'hi' ? 'दीप्ति:' : 'ILLUM:'} {phaseMeta.illumination}%
        </span>
      </motion.div>
    </div>
  );
});
InteractiveStarSystem.displayName = 'InteractiveStarSystem';

/* 5. MAIN PARENT EXPORT COMPONENT (Removes high frequency ticking, preserves entrance/exit states safely) */
export const CinematicIntro: React.FC<CinematicIntroProps> = ({ lang, onEnter }) => {
  const [launchSequence, setLaunchSequence] = useState<boolean>(false);
  const [visitorCount, setVisitorCount] = useState<number>(312);

  useEffect(() => {
    const docRef = doc(db, 'global_data', 'space_console_visitors');

    // Real-time synchronization
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.value && typeof data.value.count === 'number') {
          setVisitorCount(data.value.count);
        }
      }
    }, (error) => {
       console.warn("Error streaming cinematic visitors count:", error);
    });

    // Lazy increment once per session
    if (sessionStorage.getItem('has_counted_cinematic_visit') !== 'true') {
      getDoc(docRef).then((snapshot) => {
        if (snapshot.exists()) {
          updateDoc(docRef, { 'value.count': increment(1) });
        } else {
          setDoc(docRef, { value: { count: 312 } });
        }
        sessionStorage.setItem('has_counted_cinematic_visit', 'true');
      }).catch((err) => {
        console.warn('Error reading/updating visitor count:', err);
      });
    }

    return () => {
      unsubscribe();
    };
  }, []);

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

  const handleLaunchClick = () => {
    setLaunchSequence(true);
    playSuccessChime();
    // Smooth hyperspace zoom-out transition
    setTimeout(() => {
      onEnter();
    }, 1150);
  };

  return (
    <AnimatePresence>
      {!launchSequence && (
        <motion.div
          key="cinematic-backdrop"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-black text-slate-100 font-mono overflow-hidden select-none flex flex-col justify-between transform-gpu"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, #0B0F19 0%, #020306 100%)',
            willChange: 'opacity, transform'
          }}
        >
          {/* 1. ANIMATED COSMOS SPACE SCECE (Optimized) */}
          <BackgroundNebula />

          {/* 2. NASA HUD TOP SYSTEM HEADER BAR */}
          <DiagnosticHeader lang={lang} />

          {/* 3. CENTERPIECE: ROTATING EARTH GLOBE CONSTRUCT & DUAL HUD GAUGES */}
          <main className="relative z-10 flex-1 w-full flex flex-col lg:flex-row items-center justify-center px-4 md:px-12 py-4 overflow-hidden transform-gpu">
            
            {/* SIDEBAR NAVIGATION GAUGES (LEFT) */}
            <div className="hidden lg:flex flex-col space-y-6 w-60 text-left border-l border-white/10 pl-4 tracking-widest text-[10px] text-white/50">
              <div>
                <h4 className="text-indigo-400 font-extrabold text-[11px] mb-2 uppercase tracking-widest">// SYSTEM PRE-FLIGHT DIAGNOSTICS</h4>
                <div className="space-y-1 font-mono text-[9px]">
                  <p>DEAF ACCESSIBILITY: <span className="text-emerald-400 font-bold">OPTIMAL</span></p>
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
                  <p>TOTAL EXPLORERS: <span className="text-cyan-400 font-extrabold">{visitorCount}</span></p>
                </div>
              </div>
            </div>

            {/* CORE CENTRAL VIEWPORT: GLOWING HIGH-TECH GRID EARTH GLOBE */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-2xl relative w-full h-full transform-gpu">
              
              {/* Star System with encapsulated explosions & orbits */}
              <InteractiveStarSystem lang={lang} />

              {/* HUD TYPEWRITER DIALOGUE BOX (Pulsing cyber terminal brackets) */}
              <div className="w-full max-w-xl text-center px-4 md:px-8 space-y-5 transform-gpu z-10">

                {/* PRIMARY CONSOLE LAUNCH BUTTON CONTAINER */}
                <div className="relative flex flex-col items-center justify-center pt-1.5 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleLaunchClick}
                    className="relative group cursor-pointer z-20 px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-rose-600 text-white border border-white/20 rounded-xl font-mono text-[10px] md:text-xs font-black tracking-widest uppercase shadow-[0_4px_24px_rgba(99,102,241,0.25)] flex items-center gap-2 overflow-hidden"
                  >
                    {/* Scanning sheen light overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                    
                    <span>🚀</span>
                    <span>{lang === 'hi' ? 'मंत्रालय कंसोल चालू करें (ENTER PROFILE)' : 'INITIALIZE PROFILE CONSOLE'}</span>
                    
                    {/* Glowing button indicators */}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block border border-white/25" />
                  </motion.button>
                  
                  {/* Concentric expanding background rings on hover */}
                  <div className="absolute w-44 h-44 rounded-full border border-indigo-500/5 pointer-events-none scale-100 animate-pulse pointer-events-none" />

                  {/* VISITOR COUNTER DIRECTLY BELOW BUTTON */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative z-20 flex items-center gap-2 px-4 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/45 backdrop-blur-[2px] text-[9px] md:text-[10px] font-bold tracking-widest text-cyan-400 font-mono"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{lang === 'hi' ? 'विशेष कंसॉल दर्शक संख्या:' : 'SPACE CONSOLE EXPLORERS:'}</span>
                    <span className="text-white font-extrabold">{visitorCount.toLocaleString()}</span>
                  </motion.div>
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
                  <p>SOCIETAL IMPACT METRICS: <span className="text-white font-bold">OUTSTANDING</span></p>
                  <p>BARRIERS SHREDDED: <span className="text-rose-450 font-black font-bold">MAX STATUS</span></p>
                  <p>INCLUSION LEVEL: <span className="text-emerald-400 font-bold">STATE RECOGNIZED</span></p>
                </div>
              </div>
            </div>

          </main>

          {/* 4. NASA HUD BOTTOM DIAGNOSTIC CHART / RUNNING SENSOR FOOTER */}
          <footer className="relative z-10 w-full border-t border-white/10 px-4 md:px-8 py-3.5 bg-black/40 backdrop-blur-[1px] flex flex-col md:flex-row items-center justify-between text-[8px] md:text-[10px] text-slate-500 transform-gpu">
            {/* Realtime dynamic graph spline simulation */}
            <div className="flex items-center gap-4 w-full md:w-auto mb-2 md:mb-0">
              <span className="uppercase text-white/40 tracking-wider">ACCESSIBILITY-WAVE-RADAR:</span>
              <svg className="w-24 md:w-44 h-6 text-cyan-400 stroke-current fill-none transform-gpu" viewBox="0 0 160 20">
                <motion.path
                  animate={{
                    d: [
                      "M 0 10 Q 20 2, 40 10 T 80 10 T 120 10 T 160 10",
                      "M 0 10 Q 20 18, 40 10 T 80 10 T 120 10 T 160 10",
                      "M 0 10 Q 20 2, 40 10 T 80 10 T 120 10 T 160 10"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  strokeWidth="1.5"
                  style={{ willChange: 'transform' }}
                />
                {/* High tech grid lines behind the wav line */}
                <line x1="0" y1="10" x2="160" y2="10" stroke="rgba(255,255,255,0.08)" strokeDasharray="2" />
              </svg>
              <span className="text-emerald-400 uppercase font-bold animate-pulse">SENSING DIAG: LIVE</span>
            </div>

            {/* Inclusivity Credentials */}
            <div className="text-center text-[9px] md:text-xs tracking-wider font-bold mb-2 md:mb-0 font-mono">
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
              <span>EXPLORERS: <strong className="text-cyan-400">{visitorCount}</strong></span>
              <span>&bull;</span>
              <span className="text-white">{lang === 'hi' ? 'भारतीय सांकेतिक भाषा संगोष्ठी' : 'ISL CONSOLE ACTIVE'}</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
