import React from 'react';
import { motion } from 'motion/react';

export type AvatarPose = 'namaste' | 'speaking' | 'wave' | 'pointing' | 'idle';

interface InteractiveAvatarProps {
  pose: AvatarPose;
  className?: string;
  size?: number;
}

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  pose,
  className = '',
  size = 230,
}) => {
  // Breathing and idle/speaking bobbing motion for Po's round adorable head
  const headAnimation = {
    idle: {
      y: [0, -2, 0],
      rotate: [0, 0.5, -0.5, 0],
      transition: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
    },
    speaking: {
      y: [0, -4, 2, -4, 0],
      rotate: [0, 1.2, -1.2, 0.8, -0.8, 0],
      transition: { repeat: Infinity, duration: 1.0, ease: 'easeInOut' },
    },
    namaste: {
      y: [0, 1, 0],
      rotate: [0, 0.2, -0.2, 0],
      transition: { repeat: Infinity, duration: 3.8, ease: 'easeInOut' },
    },
    wave: {
      y: [0, -2.5, 0],
      rotate: [0, 0.8, -0.4, 0],
      transition: { repeat: Infinity, duration: 3.0, ease: 'easeInOut' },
    },
    pointing: {
      y: [0, -1.5, 0],
      rotate: [0, 0.4, -0.4, 0],
      transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
    },
  };

  const mouthAnimation = {
    speaking: {
      scaleY: [1, 2.6, 0.6, 2.2, 0.8, 2.0, 1],
      transition: { repeat: Infinity, duration: 0.42, ease: 'easeInOut' },
    },
    idle: { scaleY: 1 },
    namaste: { scaleY: 0.9 },
    wave: { scaleY: 1.15 },
    pointing: { scaleY: 1 },
  };

  const leftArmAnimation = {
    idle: { rotate: 0, x: 0, y: 0 },
    namaste: {
      x: 18,
      y: -20,
      rotate: 42,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
    wave: {
      x: -3,
      y: -3,
      rotate: -8,
      transition: { duration: 0.5 },
    },
    speaking: {
      rotate: [0, -3, 0],
      transition: { repeat: Infinity, duration: 2.2 }
    },
    pointing: {
      x: -2,
      y: 4,
      rotate: -10,
      transition: { duration: 0.5 }
    },
  };

  const rightArmAnimation = {
    idle: { rotate: 0, x: 0, y: 0 },
    namaste: {
      x: -18,
      y: -20,
      rotate: -42,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
    wave: {
      x: 30,
      y: -46,
      rotate: [30, 65, 30, 65, 30],
      transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
    },
    speaking: {
      rotate: [0, 4, 0],
      transition: { repeat: Infinity, duration: 1.9 }
    },
    pointing: {
      x: 28,
      y: -14,
      rotate: 65,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          {/* Po's special high-energy golden dragon warrior glow */}
          <radialGradient id="poGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#ef4444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          
          {/* Panda Black Fur Gradient */}
          <linearGradient id="pandaBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Dragon Warrior Vest Gradient */}
          <linearGradient id="vestGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>

          {/* Gold Trim Gradient */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Panda White Fur Gradient */}
          <radialGradient id="pandaWhite" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>
        </defs>

        {/* Golden Halo Arena Glow */}
        <circle cx="100" cy="110" r="90" fill="url(#poGlow)" />

        {/* 1. KUNG-FU PARADE BACK EAR SHADOWS */}
        {/* Left Ear */}
        <circle cx="55" cy="55" r="22" fill="url(#pandaBlack)" />
        <circle cx="55" cy="55" r="14" fill="#020617" />

        {/* Right Ear */}
        <circle cx="145" cy="55" r="22" fill="url(#pandaBlack)" />
        <circle cx="145" cy="55" r="14" fill="#020617" />

        {/* BACKGROUND HAIR TAIL FOR CUTE PANDA ROUND CHEEKS */}

        {/* 2. CHUNKY DRAGON WARRIOR ROUND BODY */}
        <path
          d="M40 145 C40 115, 60 110, 100 110 C140 110, 160 115, 160 145 L165 198 L35 198 Z"
          fill="url(#pandaWhite)"
        />

        {/* Black Shoulders Overlay */}
        <path
          d="M38 148 C38 122, 55 120, 75 120 C85 132, 115 132, 125 120 C145 120, 162 122, 162 148 L165 198 L35 198 Z"
          fill="url(#pandaBlack)"
        />

        {/* Dragon Warrior Red Traditional Gilet/Vest */}
        <path
          d="M60 128 C55 145, 60 185, 60 198 L140 198 C140 185, 145 145, 140 128 C135 124, 115 140, 100 140 C85 140, 65 124, 60 128 Z"
          fill="url(#vestGrad)"
        />

        {/* Golden Embroidered Dragon Trim along vest center split */}
        <path
          d="M100 140 L100 198"
          stroke="url(#goldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Left Collar Trim */}
        <path
          d="M60 128 C74 134, 88 140, 100 140"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
          fill="none"
        />
        {/* Right Collar Trim */}
        <path
          d="M140 128 C126 134, 112 140, 100 140"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
          fill="none"
        />

        {/* Traditional Martial Arts Belt (Green Jade Sash) */}
        <rect x="52" y="185" width="96" height="12" rx="3" fill="#047857" />
        {/* Gold buckle ornament */}
        <circle cx="100" cy="191" r="5" fill="none" stroke="url(#goldGrad)" strokeWidth="3" />

        {/* LEFT ARM / PAW */}
        <motion.g
          animate={leftArmAnimation[pose]}
          style={{ originX: '55px', originY: '135px' }}
        >
          {/* Black Giant arm sleeve */}
          <path
            d="M55 132 C38 135, 28 155, 42 168 L52 158 Z"
            fill="url(#pandaBlack)"
          />
          {/* Hand paw */}
          <circle cx="38" cy="166" r="8" fill="url(#pandaBlack)" />
          {/* Cute white soft claws details */}
          <circle cx="32" cy="164" r="2.2" fill="#ffffff" />
          <circle cx="34" cy="171" r="2.2" fill="#ffffff" />
          <circle cx="39" cy="174" r="2.2" fill="#ffffff" />
        </motion.g>

        {/* RIGHT ARM / PAW */}
        <motion.g
          animate={rightArmAnimation[pose]}
          style={{ originX: '145px', originY: '135px' }}
        >
          {/* Black Giant arm sleeve */}
          <path
            d="M145 132 C162 135, 172 155, 158 168 L148 158 Z"
            fill="url(#pandaBlack)"
          />
          {/* Hand paw */}
          <circle cx="162" cy="166" r="8" fill="url(#pandaBlack)" />
          {/* Cute claws */}
          <circle cx="168" cy="164" r="2.2" fill="#ffffff" />
          <circle cx="166" cy="171" r="2.2" fill="#ffffff" />
          <circle cx="161" cy="174" r="2.2" fill="#ffffff" />
        </motion.g>

        {/* 3. PO'S ENORMOUS ENERGETIC WHITE HEAD */}
        <motion.g
          variants={headAnimation}
          animate={pose}
          style={{ originX: '100px', originY: '100px' }}
        >
          {/* Neck */}
          <path
            d="M84 95 L116 95 L108 116 L92 116 Z"
            fill="url(#pandaWhite)"
          />

          {/* Plump chubby face oval */}
          <path
            d="M58 84 C48 70, 152 70, 142 84 C146 102, 134 118, 100 118 C66 118, 54 102, 58 84 Z"
            fill="url(#pandaWhite)"
          />

          {/* Cute chubby cheeks extension */}
          <path
            d="M55 83 C50 90, 52 100, 62 104 C64 96, 60 88, 55 83 Z"
            fill="url(#pandaWhite)"
          />
          <path
            d="M145 83 C150 90, 148 100, 138 104 C136 96, 140 88, 145 83 Z"
            fill="url(#pandaWhite)"
          />

          {/* PO'S ICONIC BLACK PANDA EYE RINGS (PANDA PATCHES) */}
          {/* Left Eye Black Patch */}
          <ellipse cx="80" cy="83" rx="14" ry="17" fill="url(#pandaBlack)" transform="rotate(-15, 80, 83)" />
          {/* Right Eye Black Patch */}
          <ellipse cx="120" cy="83" rx="14" ry="17" fill="url(#pandaBlack)" transform="rotate(15, 120, 83)" />

          {/* Shiny Friendly Green Eyes of the Dragon Warrior */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1, 1] }}
            transition={{ repeat: Infinity, duration: 4.8, times: [0, 0.93, 0.95, 0.97, 0.99, 1] }}
            style={{ originY: '83px' }}
          >
            {/* Left Eye White + Iris */}
            <circle cx="83" cy="83" r="7.5" fill="#ffffff" />
            <circle cx="83" cy="83" r="5" fill="#10b981" /> {/* Jade Green Iris */}
            <circle cx="83" cy="83" r="3.2" fill="#061f14" /> {/* Pupil */}
            <circle cx="81.2" cy="81.2" r="1.5" fill="#ffffff" /> {/* Highlight */}

            {/* Right Eye White + Iris */}
            <circle cx="117" cy="83" r="7.5" fill="#ffffff" />
            <circle cx="117" cy="83" r="5" fill="#10b981" /> {/* Jade Green Iris */}
            <circle cx="117" cy="83" r="3.2" fill="#061f14" /> {/* Pupil */}
            <circle cx="115.2" cy="81.2" r="1.5" fill="#ffffff" /> {/* Highlight */}
          </motion.g>

          {/* Cute expressive eyebrows */}
          <path d="M72 66 Q82 62 88 69" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M128 66 Q118 62 112 69" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Round soft baby cheeks outline blush */}
          <circle cx="69" cy="94" r="5" fill="#f43f5e" fillOpacity="0.12" />
          <circle cx="131" cy="94" r="5" fill="#f43f5e" fillOpacity="0.12" />

          {/* Snout Area White Overlay */}
          <ellipse cx="100" cy="94" rx="14" ry="10" fill="#f8fafc" />

          {/* Soft little black shiny nose */}
          <path
            d="M96 90 C96 88, 104 88, 104 90 C104 93, 100 96, 100 96 C100 96, 96 93, 96 90 Z"
            fill="#090d16"
          />
          {/* Nose reflection */}
          <circle cx="98.5" cy="89.5" r="1.1" fill="#ffffff" />

          {/* Playful smiling mouth that opens/closes when speaking */}
          <motion.g
            variants={mouthAnimation}
            animate={pose}
            style={{ originX: '100px', originY: '98px' }}
          >
            {pose === 'speaking' ? (
              // Po saying "Skadoosh!" with deep mouth cavity and pink tongue
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
              // Wide dumpling loving cozy smile
              <path
                d="M91 97 Q100 106 109 97"
                stroke="#0f172a"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </motion.g>

          {/* Cute chin dimple contour */}
          <path
            d="M98 109 Q100 111 102 109"
            stroke="#cbd5e1"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Namaste Kung Fu Dragon Warrior Fist-Palm salute gesture overlay */}
        {pose === 'namaste' && (
          <motion.g
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="origin-center"
          >
            {/* Left fist pressed against open right palm overlay index */}
            <circle cx="100" cy="138" r="15" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3" className="animate-spin" />
            <path
              d="M92 138 C90 134, 100 125, 100 125 L108 138 C108 138, 98 142, 92 138 Z"
              fill="url(#pandaBlack)"
              stroke="#fbbf24"
              strokeWidth="1.2"
            />
            {/* Martial Arts greeting glow sparkles */}
            <circle cx="100" cy="132" r="3.5" fill="#fbbf24" />
          </motion.g>
        )}
      </svg>

      {/* Dynamic Dragon Warrior / Skadoosh Speech Bubble overlay label */}
      {pose === 'namaste' && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="absolute -top-7 px-3.5 py-1 bg-amber-500 border-2 border-white text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center gap-1.5"
        >
          <span>🐼🥋</span>
          <span>स्काडूश! (Skadoosh!)</span>
        </motion.div>
      )}

      {/* Kung-Fu sound rhythm bars visualization */}
      {pose === 'speaking' && (
        <div className="absolute -bottom-1 flex gap-1 justify-center z-10 w-full">
          {[0.2, 0.4, 0.3, 0.6, 0.3, 0.1].map((delay, index) => (
            <motion.div
              key={index}
              animate={{ height: [5, 14, 5] }}
              transition={{ repeat: Infinity, duration: 0.5, delay }}
              className="w-1 rounded-full bg-amber-500 shadow-sm"
            />
          ))}
        </div>
      )}
    </div>
  );
};
