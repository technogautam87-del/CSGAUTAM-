import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playBubbleSound, playSuccessChime } from '../audio';

export type AvatarPose = 'namaste' | 'speaking' | 'wave' | 'pointing' | 'idle' | 'walking' | 'stance' | 'punch' | 'kick' | 'flying';

interface InteractiveAvatarProps {
  pose: AvatarPose;
  className?: string;
  size?: number;
  lang?: 'en' | 'hi';
}

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  pose: externalPose,
  className = '',
  size = 230,
  lang = 'hi',
}) => {
  const [internalPose, setInternalPose] = useState<AvatarPose | null>(null);
  const [combatText, setCombatText] = useState<string>('');

  // Use clicked override pose if active, else fallback to external framework pose
  const activePose = internalPose || externalPose;

  const handlePandaClick = () => {
    // Cycle random fighter moves
    const moves: AvatarPose[] = ['punch', 'kick', 'stance'];
    const chosenMove = moves[Math.floor(Math.random() * moves.length)];
    
    const sounds = lang === 'en' 
      ? ['💥 SKADOOSH!', '💥 HI-YAH!', '💥 KAPOW!', '💥 DRAGON FIST!', '💥 KUNG FU!']
      : ['💥 स्काडूश!', '💥 हियाह!', '💥 कपाओ!', '💥 ड्रैगन मुक्का!', '💥 कुंग फू!'];
    const chosenText = sounds[Math.floor(Math.random() * sounds.length)];

    setInternalPose(chosenMove);
    setCombatText(chosenText);
    playSuccessChime();

    setTimeout(() => {
      setInternalPose(null);
      setCombatText('');
    }, 850);
  };

  // Breathing and physics-based skeleton transforms
  const headAnimation = {
    idle: {
      y: [0, -2.5, 0],
      rotate: [0, 0.6, -0.6, 0],
      transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
    },
    speaking: {
      y: [0, -3.5, 1.5, -3.5, 0],
      rotate: [0, 1.2, -1.2, 0.8, -0.8, 0],
      transition: { repeat: Infinity, duration: 1.0, ease: 'easeInOut' },
    },
    namaste: {
      y: 3,
      rotate: 0,
      transition: { duration: 0.3 },
    },
    wave: {
      y: -1,
      rotate: [0, -0.8, 0.8, 0],
      transition: { repeat: Infinity, duration: 3.0, ease: 'easeInOut' },
    },
    pointing: {
      y: -0.5,
      rotate: -1.5,
      transition: { duration: 0.4 },
    },
    walking: {
      y: [0, -3, 0],
      rotate: [-1.2, 1.2, -1.2],
      transition: { repeat: Infinity, duration: 0.6, ease: 'linear' },
    },
    stance: {
      y: 5,
      rotate: 0,
      transition: { type: 'spring', stiffness: 120 },
    },
    punch: {
      x: 10,
      y: 2,
      rotate: 1.5,
      transition: { type: 'spring', stiffness: 350, damping: 14 },
    },
    kick: {
      x: -6,
      y: 5,
      rotate: -6,
      transition: { type: 'spring', stiffness: 220 },
    },
    flying: {
      rotate: 15,
      x: 3,
      y: -6,
      transition: { duration: 0.4 },
    },
  };

  const bodyAnimation = {
    idle: {
      scaleY: [1, 1.025, 1],
      y: [0, -1, 0],
      transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
    },
    speaking: {
      scaleY: [1, 1.015, 1],
      y: [0, -1.5, 0],
      transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
    },
    namaste: { y: 2, scaleY: 0.98, transition: { duration: 0.3 } },
    wave: { y: 0, scaleY: 1 },
    pointing: { y: 0, scaleY: 1 },
    walking: {
      y: [0, 3, 0],
      scaleY: [1, 0.97, 1],
      transition: { repeat: Infinity, duration: 0.6, ease: 'linear' },
    },
    stance: { y: 4, scaleY: 0.96, transition: { type: 'spring' } },
    punch: {
      x: 8,
      y: 2,
      scaleY: 0.98,
      rotate: 3,
      transition: { type: 'spring', stiffness: 350, damping: 15 },
    },
    kick: {
      x: -10,
      y: 5,
      rotate: -10,
      scaleY: 0.96,
      transition: { type: 'spring', stiffness: 250 },
    },
    flying: {
      rotate: 45,
      y: -12,
      scale: 0.95,
      transition: { duration: 0.4 },
    },
  };

  const mouthAnimation = {
    speaking: {
      scaleY: [1, 2.6, 0.6, 2.2, 0.8, 2.0, 1],
      transition: { repeat: Infinity, duration: 0.42, ease: 'easeInOut' },
    },
    idle: { scaleY: 1 },
    namaste: { scaleY: 0.8 },
    wave: { scaleY: 1.1 },
    pointing: { scaleY: 1 },
    walking: { scaleY: 1 },
    stance: { scaleY: 0.6 },
    punch: { scaleY: 2.2 }, // Wide battle roar
    kick: { scaleY: 2.5 },  // battle roar
    flying: { scaleY: 1.2 },
  };

  const leftArmAnimation = {
    idle: { rotate: [0, 3, 0], x: 0, y: 0, transition: { repeat: Infinity, duration: 4.5 } },
    speaking: { rotate: [0, -5, 3, -3, 0], transition: { repeat: Infinity, duration: 2.2 } },
    namaste: {
      x: 24,
      y: -2,
      rotate: 65,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
    wave: { rotate: -10, x: 0, y: 4 },
    pointing: { rotate: -18, x: -1, y: 4 },
    walking: {
      rotate: [-32, 24, -32],
      transition: { repeat: Infinity, duration: 1.2, ease: 'linear' },
    },
    stance: {
      x: 20,
      y: -22,
      rotate: 72,
      transition: { type: 'spring', stiffness: 150, damping: 15 },
    },
    punch: {
      x: 6,
      y: -3,
      rotate: 18,
      transition: { type: 'spring', stiffness: 200 },
    },
    kick: {
      x: -15,
      y: -10,
      rotate: -35,
      transition: { type: 'spring', stiffness: 120 },
    },
    flying: {
      x: 6,
      y: -35,
      rotate: 100,
      transition: { duration: 0.4 },
    },
  };

  const rightArmAnimation = {
    idle: { rotate: [0, -3, 0], x: 0, y: 0, transition: { repeat: Infinity, duration: 4.5 } },
    speaking: { rotate: [0, 5, -3, 3, 0], transition: { repeat: Infinity, duration: 2.5 } },
    namaste: {
      x: -24,
      y: -2,
      rotate: -65,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
    wave: {
      x: 22,
      y: -44,
      rotate: [30, 75, 30, 75, 30],
      transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
    },
    pointing: {
      x: 28,
      y: -14,
      rotate: 65,
      transition: { type: 'spring', stiffness: 100 },
    },
    walking: {
      rotate: [24, -32, 24],
      transition: { repeat: Infinity, duration: 1.2, ease: 'linear' },
    },
    stance: {
      x: -6,
      y: -16,
      rotate: -40,
      transition: { type: 'spring', stiffness: 150, damping: 15 },
    },
    punch: {
      x: 52, // Extreme punch extension!
      y: -50,
      rotate: 110,
      scale: 1.3, // Hand enlarges on impact!
      transition: { type: 'spring', stiffness: 380, damping: 10 },
    },
    kick: {
      x: 6,
      y: -8,
      rotate: -15,
      transition: { type: 'spring', stiffness: 120 },
    },
    flying: {
      x: -6,
      y: -35,
      rotate: -100,
      transition: { duration: 0.4 },
    },
  };

  const leftFootAnimation = {
    idle: { x: 0, y: 0, rotate: 0 },
    speaking: { x: 0, y: 0, rotate: 0 },
    namaste: { x: 0, y: 0, rotate: 0 },
    wave: { x: 0, y: 0, rotate: 0 },
    pointing: { x: 0, y: 0, rotate: 0 },
    walking: {
      y: [0, -10, 0],
      x: [-6, 6, -6],
      transition: { repeat: Infinity, duration: 0.6, ease: 'linear' },
    },
    stance: {
      x: -12,
      y: -1,
      rotate: 12,
      transition: { type: 'spring' },
    },
    punch: {
      x: -8,
      y: 1,
      rotate: 4,
      transition: { type: 'spring' },
    },
    kick: {
      x: -4,
      y: 2,
      rotate: 8,
      transition: { type: 'spring' },
    },
    flying: {
      x: -5,
      y: 10,
      rotate: -20,
      transition: { duration: 0.4 },
    },
  };

  const rightFootAnimation = {
    idle: { x: 0, y: 0, rotate: 0 },
    speaking: { x: 0, y: 0, rotate: 0 },
    namaste: { x: 0, y: 0, rotate: 0 },
    wave: { x: 0, y: 0, rotate: 0 },
    pointing: { x: 0, y: 0, rotate: 0 },
    walking: {
      y: [-10, 0, -10],
      x: [6, -6, 6],
      transition: { repeat: Infinity, duration: 0.6, ease: 'linear' },
    },
    stance: {
      x: 12,
      y: -1,
      rotate: -12,
      transition: { type: 'spring' },
    },
    punch: {
      x: 10,
      y: 1,
      rotate: -8,
      transition: { type: 'spring' },
    },
    kick: {
      x: 32,
      y: -58,
      rotate: -68,
      scale: 1.22, // Magnify high kick foot paw!
      transition: { type: 'spring', stiffness: 300, damping: 11 },
    },
    flying: {
      x: 5,
      y: 10,
      rotate: 20,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div
      onClick={handlePandaClick}
      className={`relative flex items-center justify-center select-none active:scale-95 transition-all outline-none ${className}`}
      style={{ width: size, height: size + 20 }}
      title={lang === 'en' ? 'Click Panda to trigger custom kung fu moves!' : 'कुंग फू मुक्के शुरू करने के लिए पांडा पर क्लिक करें!'}
    >
      <svg
        viewBox="0 0 200 225"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          {/* Po's golden warrior high-energy glow */}
          <radialGradient id="poGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          
          {/* Panda Black Fur Gradient */}
          <linearGradient id="pandaBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0a0f1d" />
          </linearGradient>

          {/* Slashed Jade Red Vest Gradient */}
          <linearGradient id="vestGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          {/* Belt Waistband Yellow Accent */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* White Fur shading */}
          <radialGradient id="pandaWhite" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>
        </defs>

        {/* Golden Halo background reflection */}
        <circle cx="100" cy="110" r="90" fill="url(#poGlow)" />

        {/* 1. ANIMATED FEET / BLACK PAWS */}
        {/* Left Leg/Paw */}
        <motion.g
          animate={leftFootAnimation[activePose]}
          style={{ originX: '75px', originY: '185px' }}
        >
          {/* Leg thigh */}
          <path d="M55 185 C55 200, 65 210, 75 210 C85 210, 85 195, 80 185 Z" fill="url(#pandaBlack)" />
          {/* Foot paw */}
          <ellipse cx="73" cy="214" rx="15" ry="9" fill="url(#pandaBlack)" />
          {/* Soft pink pads for cute realistic details */}
          <circle cx="73" cy="214" r="4.5" fill="#fda4af" fillOpacity="0.8" />
          <circle cx="63" cy="209" r="1.8" fill="#fda4af" fillOpacity="0.8" />
          <circle cx="73" cy="205" r="1.8" fill="#fda4af" fillOpacity="0.8" />
          <circle cx="83" cy="209" r="1.8" fill="#fda4af" fillOpacity="0.8" />
        </motion.g>

        {/* Right Leg/Paw */}
        <motion.g
          animate={rightFootAnimation[activePose]}
          style={{ originX: '125px', originY: '185px' }}
        >
          {/* Leg thigh */}
          <path d="M145 185 C145 200, 135 210, 125 210 C115 210, 115 195, 120 185 Z" fill="url(#pandaBlack)" />
          {/* Foot paw */}
          <ellipse cx="127" cy="214" rx="15" ry="9" fill="url(#pandaBlack)" />
          {/* Pads */}
          <circle cx="127" cy="214" r="4.5" fill="#fda4af" fillOpacity="0.8" />
          <circle cx="117" cy="209" r="1.8" fill="#fda4af" fillOpacity="0.8" />
          <circle cx="127" cy="205" r="1.8" fill="#fda4af" fillOpacity="0.8" />
          <circle cx="137" cy="209" r="1.8" fill="#fda4af" fillOpacity="0.8" />
        </motion.g>

        {/* 2. BACK EAR SHADOWS */}
        <circle cx="55" cy="55" r="22" fill="url(#pandaBlack)" />
        <circle cx="55" cy="55" r="14" fill="#020617" />

        <circle cx="145" cy="55" r="22" fill="url(#pandaBlack)" />
        <circle cx="145" cy="55" r="14" fill="#020617" />

        {/* 3. DOCK ROUND SOLID TORSO WRAPPER */}
        <motion.g
          animate={bodyAnimation[activePose]}
          style={{ originX: '100px', originY: '150px' }}
        >
          {/* Oval plush white body base */}
          <path
            d="M40 145 C40 115, 60 110, 100 110 C140 110, 160 115, 160 145 L165 190 L35 190 Z"
            fill="url(#pandaWhite)"
          />

          {/* Black Fur harness overlay */}
          <path
            d="M38 148 C38 122, 55 120, 75 120 C85 132, 115 132, 125 120 C145 120, 162 122, 162 148 L165 190 L35 190 Z"
            fill="url(#pandaBlack)"
          />

          {/* Traditional Red Dragon Warrior Robe Vest */}
          <path
            d="M60 128 C55 145, 60 178, 60 190 L140 190 C140 178, 145 145, 140 128 C135 124, 115 140, 100 140 C85 140, 65 124, 60 128 Z"
            fill="url(#vestGrad)"
          />

          {/* Central Gold trim border */}
          <path
            d="M100 140 L100 190"
            stroke="url(#goldGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Left / Right Collar trimmings */}
          <path d="M60 128 C74 134, 88 140, 100 140" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
          <path d="M140 128 C126 134, 112 140, 100 140" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />

          {/* 4. COLORFUL COLORFUL WAISTBAND (RED & YELLOW) WITH HANGING FLAPS */}
          <rect x="52" y="180" width="96" height="12" rx="3.5" fill="#dc2626" />
          <rect x="52" y="184" width="96" height="4" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
          
          {/* Hanging sashes of the warrior headband belt floating to the bottom */}
          <path
            d="M93 186 Q86 202 80 211"
            stroke="#dc2626"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M100 186 Q106 202 113 213"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* 5. DYNAMIC ARMS */}
        {/* LEFT ARM */}
        <motion.g
          animate={leftArmAnimation[activePose]}
          style={{ originX: '55px', originY: '135px' }}
        >
          {/* Black sleeve */}
          <path
            d="M55 132 C38 135, 26 154, 40 167 L52 156 Z"
            fill="url(#pandaBlack)"
          />
          {/* Hand paw circle */}
          <circle cx="38" cy="165" r="9" fill="url(#pandaBlack)" />
          {/* Soft white claws */}
          <circle cx="31" cy="163" r="2.2" fill="#ffffff" />
          <circle cx="34" cy="170" r="2.2" fill="#ffffff" />
          <circle cx="39" cy="173" r="2.2" fill="#ffffff" />
        </motion.g>

        {/* RIGHT ARM (Punches fully forward in punch pose) */}
        <motion.g
          animate={rightArmAnimation[activePose]}
          style={{ originX: '145px', originY: '135px' }}
        >
          {/* Black sleeve */}
          <path
            d="M145 132 C162 135, 174 154, 160 167 L148 156 Z"
            fill="url(#pandaBlack)"
          />
          {/* Hand paw */}
          <circle cx="162" cy="165" r="9" fill="url(#pandaBlack)" />
          {/* Cute white soft claws */}
          <circle cx="169" cy="163" r="2.2" fill="#ffffff" />
          <circle cx="166" cy="170" r="2.2" fill="#ffffff" />
          <circle cx="161" cy="173" r="2.2" fill="#ffffff" />
        </motion.g>

        {/* 6. ENORMOUS SEVERE WHITE HEAD WITH DETERMINED EXPRESSIONS */}
        <motion.g
          variants={headAnimation}
          animate={activePose}
          style={{ originX: '100px', originY: '100px' }}
        >
          {/* Neck tube */}
          <path d="M84 95 L116 95 L108 116 L92 116 Z" fill="url(#pandaWhite)" />

          {/* Chubby cheeks head base */}
          <path
            d="M58 84 C48 70, 152 70, 142 84 C146 102, 134 118, 100 118 C66 118, 54 102, 58 84 Z"
            fill="url(#pandaWhite)"
          />

          {/* Cheek extensions */}
          <path d="M55 83 C50 90, 52 100, 62 104 C64 96, 60 88, 55 83 Z" fill="url(#pandaWhite)" />
          <path d="M145 83 C150 90, 148 100, 138 104 C136 96, 140 88, 145 83 Z" fill="url(#pandaWhite)" />

          {/* PANDA PATCHES around eyes */}
          <ellipse cx="80" cy="83" rx="14" ry="17" fill="url(#pandaBlack)" transform="rotate(-15, 80, 83)" />
          <ellipse cx="120" cy="83" rx="14" ry="17" fill="url(#pandaBlack)" transform="rotate(15, 120, 83)" />

          {/* Shining Jade-Green Dragon Warrior Eyes (Blink cycles) */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 4.8, times: [0, 0.93, 0.95, 0.97, 0.99, 1] }}
            style={{ originY: '83px' }}
          >
            {/* Left Eye */}
            <circle cx="83" cy="83" r="7.8" fill="#ffffff" />
            <circle cx="83" cy="83" r="5.2" fill="#10b981" /> {/* Emerald Iris */}
            <circle cx="83" cy="83" r="3.2" fill="#091d15" /> {/* Pupil */}
            <circle cx="81" cy="81" r="1.5" fill="#ffffff" />

            {/* Right Eye */}
            <circle cx="117" cy="83" r="7.8" fill="#ffffff" />
            <circle cx="117" cy="83" r="5.2" fill="#10b981" />
            <circle cx="117" cy="83" r="3.2" fill="#091d15" />
            <circle cx="115" cy="81" r="1.5" fill="#ffffff" />
          </motion.g>

          {/* CUTE BLUSHING CHEEKS */}
          <circle cx="69" cy="94" r="5.5" fill="#f43f5e" fillOpacity="0.14" />
          <circle cx="131" cy="94" r="5.5" fill="#f43f5e" fillOpacity="0.14" />

          {/* DETERMINED DETERMINED EYEBROW ROTATIONS (Tilted down inward for determination look) */}
          <motion.g
            animate={
              activePose === 'stance' || activePose === 'punch' || activePose === 'kick'
                ? { rotate: 12, y: 1.5, x: 2 }
                : { rotate: 0, y: 0, x: 0 }
            }
            style={{ originX: '80px', originY: '66px' }}
          >
            {/* Heavy left eyebrow */}
            <path d="M70 66 Q81 61 88 68" stroke="#000000" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          </motion.g>

          <motion.g
            animate={
              activePose === 'stance' || activePose === 'punch' || activePose === 'kick'
                ? { rotate: -12, y: 1.5, x: -2 }
                : { rotate: 0, y: 0, x: 0 }
            }
            style={{ originX: '120px', originY: '66px' }}
          >
            {/* Heavy right eyebrow */}
            <path d="M130 66 Q119 61 112 68" stroke="#000000" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          </motion.g>

          {/* Snout Area Area overlay */}
          <ellipse cx="100" cy="94" rx="14" ry="10" fill="#fdfdfd" />

          {/* Little triangular nose */}
          <path d="M96 90 Q100 86 104 90 Q100 95 96 90 Z" fill="#090a10" />
          <circle cx="98.5" cy="89" r="1" fill="#ffffff" />

          {/* Smiling, Roaring, or speaking mouth */}
          <motion.g
            variants={mouthAnimation}
            animate={activePose}
            style={{ originX: '100px', originY: '98px' }}
          >
            {activePose === 'speaking' || activePose === 'punch' || activePose === 'kick' ? (
              <g>
                <path
                  d="M92 97 Q100 113 108 97 Z"
                  fill="#991b1b"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                <path
                  d="M95 106 Q100 101 105 106"
                  fill="#fb7185"
                />
              </g>
            ) : (
              <path
                d="M91 97 Q100 106 109 97"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </motion.g>

          {/* Chin shadow dimple */}
          <path d="M98 110 Q100 112 102 110" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" fill="none" />
        </motion.g>

        {/* 7. RADHE NAMASTE SALUTE GLOW EFFECT */}
        {activePose === 'namaste' && (
          <motion.g
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="origin-center"
          >
            <circle cx="100" cy="138" r="14" fill="#fbbf24" fillOpacity="0.15" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3" className="animate-spin" />
            <path d="M93 138 Q100 125 107 138 Z" fill="url(#pandaBlack)" stroke="#fbbf24" strokeWidth="1.2" />
            <circle cx="100" cy="131" r="3.5" fill="#f59e0b" />
          </motion.g>
        )}
      </svg>

      {/* DYNAMIC COMBAT POPUPS (KAPOW, SKADOOSH on click punches and kicks) */}
      <AnimatePresence>
        {combatText && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 15 }}
            animate={{ scale: 1.1, opacity: 1, y: -20 }}
            exit={{ scale: 0.8, opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute -top-12 z-20 px-4 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 text-white text-xs font-black uppercase rounded-2xl shadow-xl border-2 border-white flex items-center gap-1 leading-none font-mono tracking-wider"
          >
            <span>🥋</span>
            <span>{combatText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing sound waves on speaking */}
      {activePose === 'speaking' && (
        <div className="absolute -bottom-2.5 flex gap-1 justify-center z-10 w-full px-4">
          {[0.2, 0.4, 0.1, 0.5, 0.3, 0.2].map((delay, ind) => (
            <motion.div
              key={ind}
              animate={{ height: [6, 15, 6] }}
              transition={{ repeat: Infinity, duration: 0.5, delay }}
              className="w-1 rounded-full bg-gradient-to-t from-red-500 to-amber-500 shadow-xs"
            />
          ))}
        </div>
      )}
    </div>
  );
};
