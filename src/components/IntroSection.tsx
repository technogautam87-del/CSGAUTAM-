import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SliderPhoto, HomepageConfig, TimelineMilestone } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { playSuccessChime, playBubbleSound, playKeyTap } from '../audio';
import { TRANSLATIONS } from '../translations';

interface IntroSectionProps {
  slides: SliderPhoto[];
  milestones?: TimelineMilestone[];
  onExploreTimeline: () => void;
  onExploreTimelineYear?: (year: number) => void;
  onExplorePublications: () => void;
  onExploreNews: () => void;
  onExploreGallery: () => void;
  onExploreAchievements: () => void;
  onSendAppreciation: () => void;
  appreciationCount: number;
  lang?: 'en' | 'hi';
  homepageConfig: HomepageConfig;
}

export const IntroSection: React.FC<IntroSectionProps> = ({
  slides,
  milestones = [],
  onExploreTimeline,
  onExploreTimelineYear,
  onExplorePublications,
  onExploreNews,
  onExploreGallery,
  onExploreAchievements,
  onSendAppreciation,
  appreciationCount,
  lang = 'hi',
  homepageConfig,
}) => {
  const t = TRANSLATIONS[lang];
  const [showPhilosophy, setShowPhilosophy] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  React.useEffect(() => {
    if (!isAutoplay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoplay, slides.length]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[70vh] md:min-h-[78vh] relative">
      
      {/* Immersive Profile Glassmorphic Container Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }}
        className="w-full bg-white border border-slate-200/85 rounded-[40px] shadow-[0_15px_45px_rgba(0,0,0,0.03)] p-6 md:p-10 flex flex-col gap-8"
      >
        
        {/* 1. TOP SECTION: Premium Full-width Photo Slider */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
              🖼️ {lang === 'hi' ? 'विशेष क्षण चित्र दीर्घा' : 'Special Moments Photo Gallery'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAutoplay(!isAutoplay);
                  playBubbleSound();
                }}
                className="text-[9px] font-mono px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 font-extrabold cursor-pointer transition"
              >
                {isAutoplay ? (lang === 'hi' ? '⏸ ऑटो प्ले बंद' : '⏸ Pause') : (lang === 'hi' ? '▶ ऑटो प्ले शुरू' : '▶ Play')}
              </button>
            </div>
          </div>

          {slides && slides.length > 0 ? (
            <div className="relative w-full h-64 md:h-80 rounded-[28px] overflow-hidden bg-slate-100 border border-slate-200/80 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlideIdx}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <img
                    src={slides[activeSlideIdx].url}
                    referrerPolicy="no-referrer"
                    alt={slides[activeSlideIdx].caption}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Caption details overlay at the bottom */}
                  <div className="absolute bottom-0 inset-x-0 p-5 md:p-6 text-left text-white space-y-1">
                    <p className="text-[13px] md:text-sm font-black tracking-wide leading-snug">
                      {lang === 'hi' && slides[activeSlideIdx].captionHi
                        ? slides[activeSlideIdx].captionHi
                        : slides[activeSlideIdx].caption}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Navigation Arrows - Hidden on mobile, visible on desktop hover */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button
                  onClick={() => {
                    setActiveSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
                    setIsAutoplay(false);
                    playBubbleSound();
                  }}
                  className="pointer-events-auto p-2 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-lg cursor-pointer transition duration-200 active:scale-90"
                >
                  <DynamicIcon name="ChevronLeft" size={18} />
                </button>
                <button
                  onClick={() => {
                    setActiveSlideIdx((prev) => (prev + 1) % slides.length);
                    setIsAutoplay(false);
                    playBubbleSound();
                  }}
                  className="pointer-events-auto p-2 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-lg cursor-pointer transition duration-200 active:scale-90"
                >
                  <DynamicIcon name="ChevronRight" size={18} />
                </button>
              </div>

              {/* Bullet Indicators / Dots */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-md px-2.5 py-1.5 rounded-full z-10">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveSlideIdx(idx);
                      setIsAutoplay(false);
                      playKeyTap();
                    }}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeSlideIdx ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-48 rounded-[28px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-6">
              <span className="text-3xl mb-2">📷</span>
              <p className="text-xs font-bold">{lang === 'hi' ? 'कोई चित्र उपलब्ध नहीं है। एडमिन पैनल से चित्र अपलोड करें।' : 'No photos available. Upload pictures from the Admin Panel.'}</p>
            </div>
          )}
        </div>

        {/* 2. BOTTOM SECTION: 2-Column layout: Left side Photo, Right side Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center border-t border-slate-100 pt-6">
          
          {/* Left Column: Teacher Photograph (Left Side) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group/photo overflow-visible w-56 h-56 md:w-64 md:h-64 rounded-[36px] bg-gradient-to-tr from-yellow-400 via-emerald-400 to-indigo-600 p-[3px] shadow-lg hover:scale-[1.02] transition-transform duration-300">
              <div className="w-full h-full rounded-[33px] overflow-hidden bg-white border-4 border-white relative">
                <img
                  src={homepageConfig.customAvatarImageUrl || homepageConfig.teacherImageUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=350"}
                  alt={lang === 'hi' ? homepageConfig.teacherNameHi : homepageConfig.teacherName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[29px]"
                  style={{ contentVisibility: 'auto' }}
                />
                
                {/* Subtle light mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none rounded-[29px]" />
              </div>

              {/* Professional Verified Teacher Badge at the bottom center */}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500 border-2 border-white text-white font-extrabold text-[10px] md:text-[11px] rounded-full shadow-md whitespace-nowrap block">
                ⭐ {lang === 'hi' ? 'Special Teacher & ISL Interpreter' : 'Special Teacher & ISL Interpreter'}
              </span>
            </div>
          </div>

          {/* Right Column: Bio Details, Name, and Philosophy Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 text-left">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-655 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest border border-indigo-100">
                  🤟 {lang === 'hi' ? 'विशेष शिक्षक और ISL दुभाषिया' : 'Special Teacher & ISL Interpreter'}
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {lang === 'hi' ? 'चन्द्रशेखर गौतम' : 'Chandra Shekhar Gautam'}
              </h1>
              
              <p className="text-slate-600 text-xs md:text-[13.5px] leading-relaxed font-bold">
                {lang === 'hi'
                  ? 'नमस्ते! 🤟 भारतीय सांकेतिक भाषा (ISL) और समावेशी शिक्षा हब में आपका स्वागत है। यह मंच दिव्यांगजनों, विशेष शिक्षकों व सामान्य शिक्षकों हेतु संवेदी किट वितरण, क्रियात्मक ब्लू-प्रिंट संकलन और ऐतिहासिक मील के पत्षरों को संजोने में समर्पित है।'
                  : 'Welcome! 🤟 Promoting barriers-free classrooms and Indian Sign Language (ISL) guidelines for teachers, sensory builders, and exceptional minds.'}
              </p>
            </div>

            {/* Symmetrical Mini Quick Actions at the bottom */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowPhilosophy(true);
                  playBubbleSound();
                }}
                className="text-xs font-black text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-100 transition"
              >
                <span>📖 {lang === 'hi' ? 'दर्शन और सिद्धांत देखें' : 'View Philosophy & Values'}</span>
              </button>
              
              <button
                onClick={() => {
                  onSendAppreciation();
                  playSuccessChime();
                }}
                className="text-xs font-black text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1.5 cursor-pointer bg-rose-50/50 hover:bg-rose-50 px-3 py-2 rounded-xl border border-rose-100 transition"
              >
                <span>❤️ {lang === 'hi' ? 'सराहना भेजें' : 'Send Appreciation'} ({appreciationCount})</span>
              </button>
            </div>
          </div>

        </div>

      </motion.div>

      {/* Floating Ambient Starlets just to add a refined backdrop aura */}
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-indigo-300/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* 📖 OVERLAY SCREEN DRAWER FOR PHILOSOPHY & GRATITUDE */}
      <AnimatePresence>
        {showPhilosophy && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-end">
            
            {/* Backdrop Glass Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPhilosophy(false);
                playBubbleSound();
              }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md cursor-pointer"
            />

            {/* Drawer Body panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl h-full bg-slate-50 shadow-2xl border-l border-slate-200/50 overflow-y-auto flex flex-col p-6 md:p-10 font-sans text-left"
            >
              
              {/* Header inside modal */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-8">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">
                    {lang === 'hi' ? 'दृष्टिकोण और शिक्षण आदर्श' : 'Philosophy, Core Values & Gratitude'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    {lang === 'hi' ? 'मेरा दृष्टिकोण और आभार' : 'Our Pedagogical Beliefs'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPhilosophy(false);
                    playBubbleSound();
                  }}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer text-slate-550 transition-colors"
                  title="Close Screen"
                >
                  <DynamicIcon name="X" size={16} />
                </button>
              </div>

              {/* 1. CORE PHILOSOPHY CARDS */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                  {lang === 'hi' ? 'शिक्षण दर्शन के मुख्य स्तंभ' : 'Primary Pillars of Special Care'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      emoji: homepageConfig.card1Emoji || "🧠",
                      title: lang === 'hi' ? homepageConfig.card1TitleHi : homepageConfig.card1Title,
                      desc: lang === 'hi' ? homepageConfig.card1DescHi : homepageConfig.card1Desc,
                      color: homepageConfig.card1Color || "rose"
                    },
                    {
                      emoji: homepageConfig.card2Emoji || "❤️",
                      title: lang === 'hi' ? homepageConfig.card2TitleHi : homepageConfig.card2Title,
                      desc: lang === 'hi' ? homepageConfig.card2DescHi : homepageConfig.card2Desc,
                      color: homepageConfig.card2Color || "amber"
                    },
                    {
                      emoji: homepageConfig.card3Emoji || "🤝",
                      title: lang === 'hi' ? homepageConfig.card3TitleHi : homepageConfig.card3Title,
                      desc: lang === 'hi' ? homepageConfig.card3DescHi : homepageConfig.card3Desc,
                      color: homepageConfig.card3Color || "teal"
                    }
                  ].map((card, i) => {
                    const isRose = card.color.toLowerCase() === 'rose' || card.color.toLowerCase() === 'pink' || card.color.toLowerCase() === 'red';
                    const isAmber = card.color.toLowerCase() === 'amber' || card.color.toLowerCase() === 'yellow' || card.color.toLowerCase() === 'orange';
                    const isTeal = card.color.toLowerCase() === 'teal' || card.color.toLowerCase() === 'emerald' || card.color.toLowerCase() === 'green';
                    
                    let cardBg = "from-indigo-50/90 to-indigo-100/40 border-indigo-200/80 text-indigo-955";
                    let emojiBg = "bg-indigo-100 text-indigo-600 border-indigo-200";
                    let descColor = "text-indigo-900/90";

                    if (isRose) {
                      cardBg = "from-rose-50/90 to-rose-100/40 border-rose-200/80 text-rose-955";
                      emojiBg = "bg-rose-100 text-rose-600 border-rose-200";
                      descColor = "text-rose-900/90";
                    } else if (isAmber) {
                      cardBg = "from-amber-50/90 to-amber-100/40 border-amber-200/80 text-amber-955";
                      emojiBg = "bg-amber-100 text-amber-600 border-amber-200";
                      descColor = "text-amber-900/90";
                    } else if (isTeal) {
                      cardBg = "from-teal-50/90 to-teal-100/40 border-teal-200/80 text-teal-955";
                      emojiBg = "bg-teal-100 text-teal-600 border-teal-200";
                      descColor = "text-teal-900/90";
                    }

                    return (
                      <div
                        key={i}
                        className={`p-5 rounded-[24px] bg-gradient-to-br border-2 flex flex-col text-left space-y-3 shadow-xs ${cardBg}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${emojiBg}`}>
                          {card.emoji}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-xs md:text-sm">{card.title}</h4>
                          <p className={`text-[11px] leading-relaxed font-sans ${descColor}`}>
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. DEDICATED GRATITUDE MULTIPLIER BUTTON & STORY PANEL */}
              <div className="mt-10 pt-8 border-t border-slate-200 space-y-6 flex-1 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                    {lang === 'hi' ? 'आभार एवं कृतज्ञता' : 'Gratitude & Appreciations'}
                  </h3>

                  <div className="p-6 bg-gradient-to-tr from-indigo-50/50 via-rose-50/50 to-amber-50/50 border border-white/60 rounded-[28px] relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center">
                    
                    {/* Floating hands decoration */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-md">
                      🙏
                    </div>

                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-wider">
                        {t.gratitudeTitle}
                      </span>
                      <h4 className="font-black text-sm text-slate-800 leading-none">
                        {t.gratitudeSubtitle}
                      </h4>
                      <p className="text-[11px] text-slate-550 leading-normal font-sans">
                        {t.gratitudeDesc}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Submitting support feedback button */}
                <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{lang === 'hi' ? 'कुल प्राप्त स्नेह' : 'Total Appreciations received'}</p>
                    <p className="text-lg font-black text-indigo-600 font-mono">{appreciationCount} ❤️</p>
                  </div>

                  <button
                    onClick={() => {
                      onSendAppreciation();
                      playSuccessChime();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer animate-bounce"
                  >
                    <span>{t.sendAppreciation}</span>
                    <span className="px-1.5 py-0.5 bg-white/20 text-white rounded text-[10px]">
                      {appreciationCount}
                    </span>
                  </button>
                </div>

              </div>
              
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
