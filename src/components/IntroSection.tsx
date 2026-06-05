import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SliderPhoto, HomepageConfig, TimelineMilestone } from '../types';
import { InteractiveAvatar, AvatarPose } from './InteractiveAvatar';
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
  const [currentPose, setCurrentPose] = useState<AvatarPose>('speaking');
  const [showPhilosophy, setShowPhilosophy] = useState(false);

  // Rich pedagogical quotes spoken interactively using Indian Sign Language greeting markers
  const avatarSpokenQuotes = {
    en: {
      namaste: "Namaste! 🤟 Welcoming you in Indian Sign Language (ISL)! Let's explore inclusive education guidelines together!",
      speaking: "Every child holds a brilliant, unique voice. Supportive environments and ISL unlock their true potential!",
      wave: "Warm greetings with ISL symbols! 🤟 Find adaptive visual and tactile worksheets in our library.",
      pointing: "Read through my publications and historical milestones right in the dock below!",
      idle: "Enjoy exploring our barrier-free learning guides in this digital playground!"
    },
    hi: {
      namaste: "नमस्ते! 🤟 भारतीय सांकेतिक भाषा (ISL) में आपका आदरपूर्वक स्वागत है! चलो कुछ नया सीखें!",
      speaking: "विशेष श्रेणी के प्रत्येक बच्चे के पास एक महान आंतरिक शक्ति है। हमारा हौसला उन्हें पंख देता है!",
      wave: "भारतीय सांकेतिक भाषा (ISL) में सप्रेम नमस्कार! 🤟 न्यूरोडाइवर्जेंट बच्चों की बेहतर शिक्षा हेतु समाधानों को देखें।",
      pointing: "नीचे दिये गए गोलाई मेनू (Dock) से मेरी ऐतिहासिक समयरेखा और प्रकाशनों को खोजें।",
      idle: "आराम से सभी शैक्षणिक उपकरणों और टूल्स को समझें एवं रचनात्मक शिक्षा का प्रचार करें।"
    }
  };

  const teacherSpokenQuotes = {
    en: {
      namaste: "Namaste! 🤟 Welcoming you in Indian Sign Language (ISL). Every student is uniquely capable with absolute potential.",
      speaking: "Active sensory learning is the blueprint of deep understanding. Inclusive teaching changes lives.",
      wave: "Warm greetings in ISL! 🤟 Dive into my interactive tools and resource blueprints designed for divergent thinkers.",
      pointing: "Explore my milestones timeline and publications. Together, we can construct barrier-free classrooms.",
      idle: "Take your time to download materials and adapt them for your exceptional classrooms!"
    },
    hi: {
      namaste: "नमस्ते! 🤟 मैं भारतीय सांकेतिक भाषा (Indian Sign Language - ISL) में आपका सस्नेह स्वागत करता हूँ!",
      speaking: "संवेदी और क्रियात्मक शिक्षण ही समावेशी शिक्षा की धुरी है। हमारा निरंतर प्रयास ही हमारा संकल्प है।",
      wave: "भारतीय सांकेतिक भाषा (ISL) में सप्रेम नमस्कार! 🤟 न्यूरोडाइवर्जेंट बच्चों की शिक्षा के लिए उत्तम किटों का अध्ययन करें।",
      pointing: "मेरे ऐतिहासिक मील के पत्थरों और शोध लेखों को देखें। मिलकर हम सब नए आयाम स्थापित कर सकते हैं।",
      idle: "आराम से सभी शैक्षणिक सामग्रियों और समावेशी टूल्स को समझें एवं अपनी कक्षाओं के लिए अनुकूलित करें!"
    }
  };

  // Select appropriate interactive quotes
  const quotes = homepageConfig.usePhotoInsteadOfAvatar !== false ? teacherSpokenQuotes[lang] : avatarSpokenQuotes[lang];

  // Sort milestones chronologically (prefers custom sortOrder if present)
  const sortedMilestones = [...milestones].sort((a, b) => {
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    return a.year - b.year;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[70vh] md:min-h-[78vh] relative">
      
      {/* Immersive Profile Glassmorphic Container Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100, damping: 15 }}
        className="w-full bg-gradient-to-br from-white/90 via-indigo-50/50 to-pink-50/55 dark:from-slate-900/90 dark:via-indigo-950/40 dark:to-purple-950/65 backdrop-blur-3xl border border-indigo-100/60 dark:border-indigo-500/15 rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_rgba(99,102,241,0.06)] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        
        {/* Left column: Highly Polished Bio & Signature branding */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left order-2 lg:order-1">
          
          {/* Proactive Name Identity & Special Teacher, ISL Interpreter Branding */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 bg-gradient-to-r from-red-500/10 to-yellow-500/10 text-red-655 dark:text-yellow-450 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest border border-red-500/15">
                🤟 {lang === 'hi' ? 'विशेष शिक्षक और ISL दुभाषिया (Special Teacher & ISL Interpreter)' : 'Special Teacher & ISL Interpreter'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {lang === 'hi' ? 'चन्द्रशेखर गौतम' : 'Chandra Shekhar Gautam'}
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-xs md:text-[14px] leading-relaxed font-bold">
              {lang === 'hi'
                ? 'नमस्ते! 🤟 भारतीय सांकेतिक भाषा (ISL) और समावेशी शिक्षा हब में आपका स्वागत है। यह मंच दिव्यांगजनों, विशेष शिक्षकों व सामान्य शिक्षकों हेतु संवेदी किट वितरण, क्रियात्मक ब्लू-प्रिंट संकलन और ऐतिहासिक मील के पत्थरों को संजोने में समर्पित है।'
                : 'Welcome! 🤟 Promoting barriers-free classrooms and Indian Sign Language (ISL) guidelines for teachers, sensory builders, and exceptional minds.'}
            </p>
          </div>

          {/* Symmetrical Mini Quick Actions replacing the removed timeline stepper to avoid clutter */}
          <div className="space-y-4 py-2 text-left w-full border-t border-slate-100 dark:border-slate-800/60 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Philosophy & Values Card */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => {
                  setShowPhilosophy(true);
                  playBubbleSound();
                }}
                className="p-4 bg-slate-50/85 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer flex flex-col justify-between group/action transition-all"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold mb-3">
                    📖
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {lang === 'hi' ? 'दर्शन और सिद्धांत' : 'Philosophy & Values'}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium leading-relaxed">
                    {lang === 'hi'
                      ? 'गौतम सर के शिक्षण दर्शन, मूल्यों और आदर्शों का अध्ययन करें।'
                      : "Explore Chandra Shekhar Gautam Sir's pedagogical vision & core values."}
                  </p>
                </div>
                <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 mt-3 flex items-center gap-1 group-hover/action:translate-x-1 transition-transform">
                  <span>{lang === 'hi' ? 'खोलें' : 'Read details'} &rarr;</span>
                </div>
              </motion.div>

              {/* Heart & Support Card */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => {
                  onSendAppreciation();
                  playSuccessChime();
                }}
                className="p-4 bg-slate-50/85 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] cursor-pointer flex flex-col justify-between group/action transition-all"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold mb-3">
                    ❤️
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {lang === 'hi' ? 'सराहना व समर्थन' : 'Send Appreciation'}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium leading-relaxed">
                    {lang === 'hi'
                      ? 'शिक्षण के प्रति उनके अतुलनीय योगदान की सराहना करें।'
                      : 'Recognize & applaud his relentless dedication to special education.'}
                  </p>
                </div>
                <div className="text-[10px] font-black text-rose-600 dark:text-rose-400 mt-3 flex items-center gap-1.5 justify-between">
                  <span className="bg-rose-500/10 px-2 py-0.5 rounded-md font-extrabold text-[9px] uppercase tracking-wider">
                    {appreciationCount} {lang === 'hi' ? 'समर्थक' : 'Cheers'}
                  </span>
                  <span className="group-hover/action:scale-110 transition-transform">❤️</span>
                </div>
              </motion.div>
            </div>
            
            <div className="pt-2 text-right">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Inclusive Education Hub &copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Right column: Immersive educator photo & Speech interaction */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="relative w-full max-w-[340px] md:max-w-[380px] flex flex-col items-center">
            
            {/* Elegant luxury frame for his photograph */}
            <div
              onClick={() => {
                onExploreTimeline();
                playSuccessChime();
              }}
              className="relative group/photo overflow-visible w-60 h-60 md:w-68 md:h-68 rounded-[36px] bg-gradient-to-tr from-yellow-400 via-emerald-400 to-indigo-600 p-[3px] shadow-2xl hover:scale-[1.03] transition-transform duration-300 cursor-pointer"
              title={lang === 'hi' ? 'समयरेखा पर जाने के लिए क्लिक करें' : 'Click to explore my timeline'}
            >
              
              <div className="w-full h-full rounded-[33px] overflow-hidden bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 relative">
                <img
                   src={homepageConfig.customAvatarImageUrl || homepageConfig.teacherImageUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=350"}
                  alt={lang === 'hi' ? homepageConfig.teacherNameHi : homepageConfig.teacherName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[29px] group-hover/photo:scale-105 transition-transform duration-500"
                  style={{ contentVisibility: 'auto' }}
                />
                
                {/* Accent lighting mask overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent pointer-events-none rounded-[29px]" />
              </div>

              {/* Floating Action Hint Bubble on Hover */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider py-2 px-3.5 rounded-2xl opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 shadow-xl whitespace-nowrap pointer-events-none border border-white/15 z-20 flex items-center gap-1.5">
                <span>📅</span>
                <span>{lang === 'hi' ? 'यात्रा समयरेखा देखने के लिए क्लिक करें!' : 'Click to view my journey timeline!'}</span>
              </div>

              {/* Verified special educator status floating tag showing Special Teacher & ISL Interpreter */}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500 border-2 border-white dark:border-slate-800 text-white font-extrabold text-[10px] md:text-[11px] rounded-full shadow-md whitespace-nowrap block">
                ⭐ {lang === 'hi' ? 'Special Teacher & ISL Interpreter' : 'Special Teacher & ISL Interpreter'}
              </span>
            </div>

            {/* Speeches Interactive Bubble */}
            <motion.div
              key={currentPose + lang}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mt-7 p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/60 rounded-2xl shadow-md text-center relative max-w-[310px]"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-t-2 border-l-2 border-slate-100 dark:border-slate-700/60 rotate-45" />
              <p className="text-[12px] md:text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{quotes[currentPose]}"
              </p>
            </motion.div>

            {/* Minimal expression switches to change ideas */}
            <div className="mt-4 flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-850">
              {[
                { key: 'speaking', label: lang === 'hi' ? '🗣️ विचार' : '🗣️ Thought' },
                { key: 'namaste', label: lang === 'hi' ? '🙏 स्वागत' : '🙏 Hello' },
                { key: 'wave', label: lang === 'hi' ? '👋 संदेश' : '👋 Greeting' },
                { key: 'pointing', label: lang === 'hi' ? '👉 सहयोग' : '👉 Guide' },
                { key: 'idle', label: lang === 'hi' ? '😴 ध्यान' : '😴 Pause' },
              ].map((poseBtn) => (
                <button
                  key={poseBtn.key}
                  onClick={() => {
                    setCurrentPose(poseBtn.key as AvatarPose);
                    playKeyTap();
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black transition-all uppercase tracking-tight cursor-pointer ${
                    currentPose === poseBtn.key
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {poseBtn.label.split(' ')[1]}
                </button>
              ))}
            </div>

          </div>
        </div>

      </motion.div>

      {/* Floating Ambient Starlets just to add a refined backdrop aura */}
      <div className="absolute -top-10 -left-10 w-44 h-44 bg-indigo-300/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none" />

      {/* 📖 OVERLAY SCREEN DRAWER FOR PHILOSOPHY & GRATITUDE - 100% LINKED AS REQUESTED */}
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
              className="relative w-full max-w-2xl h-full bg-slate-50 dark:bg-slate-950 shadow-2xl border-l border-slate-200/50 dark:border-slate-800 overflow-y-auto flex flex-col p-6 md:p-10 font-sans text-left"
            >
              
              {/* Header inside modal */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-8">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                    {lang === 'hi' ? 'दृष्टिकोण और शिक्षण आदर्श' : 'Philosophy, Core Values & Gratitude'}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'मेरा दृष्टिकोण और आभार' : 'Our Pedagogical Beliefs'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPhilosophy(false);
                    playBubbleSound();
                  }}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center cursor-pointer text-slate-550 transition-colors"
                  title="Close Screen"
                >
                  <DynamicIcon name="X" size={16} />
                </button>
              </div>

              {/* 1. CORE PHILOSOPHY CARDS */}
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
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
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6 flex-1 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                    {lang === 'hi' ? 'आभार एवं कृतज्ञता' : 'Gratitude & Appreciations'}
                  </h3>

                  <div className="p-6 bg-gradient-to-tr from-indigo-50/50 via-rose-50/50 to-amber-50/50 dark:from-slate-900 dark:to-indigo-950/40 border border-white/60 dark:border-slate-805 rounded-[28px] relative overflow-hidden flex flex-col sm:flex-row gap-5 items-center">
                    
                    {/* Floating hands decoration */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-4xl shadow-md">
                      🙏
                    </div>

                    <div className="space-y-2">
                      <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-[9px] font-black uppercase tracking-wider">
                        {t.gratitudeTitle}
                      </span>
                      <h4 className="font-black text-sm text-slate-800 dark:text-white leading-none">
                        {t.gratitudeSubtitle}
                      </h4>
                      <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal font-sans">
                        {t.gratitudeDesc}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Submitting support feedback button */}
                <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{lang === 'hi' ? 'कुल प्राप्त स्नेह' : 'Total Appreciations received'}</p>
                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{appreciationCount} ❤️</p>
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
