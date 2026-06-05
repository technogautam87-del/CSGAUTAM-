import React from 'react';
import { motion } from 'motion/react';
import { TimelineMilestone } from '../types';
import { playSuccessChime } from '../audio';

interface BottomTimelineStepperProps {
  milestones: TimelineMilestone[];
  lang?: 'en' | 'hi';
  selectedYear?: number;
  onSelectYear: (year: number) => void;
}

export const BottomTimelineStepper: React.FC<BottomTimelineStepperProps> = ({
  milestones,
  lang = 'hi',
  selectedYear,
  onSelectYear,
}) => {
  // Sort milestones chronologically
  const sortedMilestones = [...milestones].sort((a, b) => {
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    return a.year - b.year;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-8 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] dark:shadow-none text-center"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-4 text-left">
          <div>
            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest border border-indigo-500/10">
              🕒 {lang === 'hi' ? 'त्वरित यात्रा संकलन' : 'Quick Journey Timeline'}
            </span>
            <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-slate-200 mt-2">
              {lang === 'hi'
                ? 'चन्द्रशेखर गौतम के मुख्य ऐतिहासिक मील के पत्थर'
                : 'Key Milestones of Chandra Shekhar Gautam'}
            </h3>
          </div>
          <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-medium">
            {lang === 'hi'
              ? 'किसी भी वर्ष पर क्लिक करके उस समय चक्र का पूरा विवरण खोलें'
              : '* Click any year to view the full chronicle description'}
          </p>
        </div>

        {/* Dynamic Horizontal Clickable Timeline Stepper Row */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 py-2">
          {sortedMilestones.map((ms, idx) => {
            const displayTitle = lang === 'hi' && ms.titleHi ? ms.titleHi : ms.title;
            const isActive = selectedYear === ms.year;

            // Highly distinctive color maps matching the timeline's joyful identity
            const colors = [
              // Emerald
              {
                active: 'from-emerald-500 via-teal-500 to-emerald-400 text-white ring-4 ring-emerald-500/40 shadow-lg shadow-emerald-500/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-emerald-500/8 to-emerald-500/3 border-emerald-500/20 hover:border-emerald-500/50 hover:from-emerald-500 hover:to-teal-500 hover:text-white text-emerald-800 dark:text-emerald-400'
              },
              // Indigo
              {
                active: 'from-indigo-500 via-sky-500 to-indigo-400 text-white ring-4 ring-indigo-500/40 shadow-lg shadow-indigo-500/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-indigo-500/8 to-indigo-500/3 border-indigo-500/20 hover:border-indigo-500/50 hover:from-indigo-500 hover:to-sky-500 hover:text-white text-indigo-800 dark:text-indigo-400'
              },
              // Pink
              {
                active: 'from-pink-500 via-rose-500 to-pink-400 text-white ring-4 ring-pink-500/40 shadow-lg shadow-pink-500/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-pink-500/8 to-pink-500/3 border-pink-500/20 hover:border-pink-500/50 hover:from-pink-500 hover:to-rose-500 hover:text-white text-pink-800 dark:text-pink-400'
              },
              // Amber
              {
                active: 'from-amber-400 via-yellow-500 to-orange-400 text-white ring-4 ring-amber-500/40 shadow-lg shadow-amber-500/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-amber-400/8 to-amber-400/3 border-amber-400/20 hover:border-amber-500/50 hover:from-amber-500 hover:to-orange-500 hover:text-white text-amber-850 dark:text-amber-400'
              },
              // Purple
              {
                active: 'from-purple-500 via-fuchsia-500 to-purple-400 text-white ring-4 ring-purple-500/40 shadow-lg shadow-purple-500/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-purple-500/8 to-purple-500/3 border-purple-500/20 hover:border-purple-500/50 hover:from-purple-500 hover:to-fuchsia-500 hover:text-white text-purple-800 dark:text-purple-400'
              },
              // Sky
              {
                active: 'from-sky-500 via-cyan-500 to-sky-400 text-white ring-4 ring-sky-500/40 shadow-lg shadow-sky-500/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-sky-500/8 to-sky-500/3 border-sky-500/20 hover:border-sky-500/50 hover:from-sky-500 hover:to-cyan-400 hover:text-white text-sky-850 dark:text-sky-400'
              },
              // Rose
              {
                active: 'from-rose-500 via-orange-500 to-rose-450 text-white ring-4 ring-rose-500/40 shadow-lg shadow-rose-500/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-rose-500/8 to-rose-500/3 border-rose-500/20 hover:border-rose-500/50 hover:from-rose-500 hover:to-orange-500 hover:text-white text-rose-800 dark:text-rose-400'
              },
              // Violet
              {
                active: 'from-violet-550 via-violet-650 to-fuchsia-450 text-white ring-4 ring-violet-550/40 shadow-lg shadow-violet-550/30 font-black scale-110 active-node border-transparent',
                inactive: 'from-violet-550/8 to-violet-550/3 border-violet-550/20 hover:border-violet-550/50 hover:from-violet-550 hover:to-fuchsia-450 hover:text-white text-violet-850 dark:text-violet-400'
              }
            ];

            const theme = colors[idx % colors.length];
            const activeColorClass = isActive ? theme.active : theme.inactive;

            return (
              <motion.button
                key={ms.id}
                onClick={() => {
                  onSelectYear(ms.year);
                  playSuccessChime();
                }}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className={`group/btn relative px-4 py-2.5 rounded-2xl border text-xs font-extrabold cursor-pointer transition-all duration-300 flex items-center gap-1.5 bg-gradient-to-tr ${activeColorClass}`}
                title={displayTitle}
              >
                <span className="text-xs">📅</span>
                <span>{ms.year}</span>
                
                {/* Micro tooltip containing description highlight on hover */}
                <span className="absolute bottom-full mb-2 scale-0 group-hover/btn:scale-100 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-lg shadow-md transition-all duration-150 whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover/btn:opacity-100 border border-white/10">
                  <span>{displayTitle}</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
