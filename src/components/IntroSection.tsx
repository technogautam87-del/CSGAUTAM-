import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SliderPhoto, HomepageConfig } from '../types';
import { InteractiveAvatar, AvatarPose } from './InteractiveAvatar';
import { DynamicIcon } from './DynamicIcon';
import { playSuccessChime, playBubbleSound, playKeyTap } from '../audio';
import { TRANSLATIONS } from '../translations';

interface IntroSectionProps {
  slides: SliderPhoto[];
  onExploreTimeline: () => void;
  onSendAppreciation: () => void;
  appreciationCount: number;
  lang?: 'en' | 'hi';
  homepageConfig: HomepageConfig;
}

export const IntroSection: React.FC<IntroSectionProps> = ({
  slides,
  onExploreTimeline,
  onSendAppreciation,
  appreciationCount,
  lang = 'hi',
  homepageConfig,
}) => {
  const t = TRANSLATIONS[lang];
  const [currentPose, setCurrentPose] = useState<AvatarPose>('speaking');

  // Interactive quotes spoken by Po, the Kung-Fu Panda
  const avatarSpokenQuotes = {
    en: {
      namaste: "Radhe-Radhe! I am Po, your Kung-Fu Panda! Let's conquer this learning path!",
      speaking: "Every single kid has a special inner power. Guided support unleashes the true Dragon Warrior!",
      wave: "Hey! Look around at these custom sensory tools. They are as satisfying as a big bowl of dumplings!",
      pointing: "Check out the timeline of Chandrashekhar Sir. That is pure legendary teaching brilliance, Skadoosh!",
      idle: "I'll go eat some noodles, while you leisurely explore these awesome inclusive toolkits!"
    },
    hi: {
      namaste: "राधे-राधे! मैं हूँ पो, आपका अपना कुंग-फू पांडा! इस प्यारे डिजिटल हब में आपका स्वागत है, चलो सीखें!",
      speaking: "प्रत्येक बच्चे के अंदर एक अनोखी छुपी हुई ताकत होती है। सही हौसले से सब के सब ड्रैगन वॉरियर बन सकते हैं!",
      wave: "नमस्कार भाई! चंद्रशेखर सर के इन कमाल के संवेदी टूल्स को देखो, ये तो मोमोज़ और नूडल्स जितने शानदार हैं!",
      pointing: "चंद्रशेखर सर की समयरेखा को देखें। वह विशुद्ध रूप से दिव्य शिक्षण प्रतिभा है, स्काडूश!",
      idle: "जब तक आप इन शानदार समावेशी टूलकिटों की खोज कर रहे हैं, तब तक मैं कुछ नूडल्स खा लेता हूँ!"
    }
  };

  const teacherSpokenQuotes = {
    en: {
      namaste: "Radhe-Radhe! Welcome to my inclusive hub. Every student is uniquely capable; they just need our belief.",
      speaking: "Active sensory learning is the blueprint of deep understanding. Inclusive teaching changes lives.",
      wave: "Warm greetings! Dive into my interactive tools and resource blueprints designed for divergent thinkers.",
      pointing: "Explore my milestones timeline and publications. Together, we can construct barrier-free classrooms.",
      idle: "Take your time to download materials and adapt them for your exceptional classrooms!"
    },
    hi: {
      namaste: "राधे-राधे! मेरे समावेशी हब में आपका स्वागत है। प्रत्येक बच्चा अपनी योग्यता के साथ अद्वितीय है!",
      speaking: "संवेदी और क्रियात्मक शिक्षण ही समावेशी शिक्षा की धुरी है। हमारा निरंतर प्रयास ही हमारा संकल्प है।",
      wave: "सस्नेह नमस्कार! न्यूरोडाइवर्जेंट बच्चों की शिक्षा के लिए आसान बने इन हस्तनिर्मित समाधानों का अध्ययन करें।",
      pointing: "मेरे ऐतिहासिक मील के पत्थरों और शोध लेखों को देखें। मिलकर हम सब नए आयाम स्थापित कर सकते हैं।",
      idle: "आराम से सभी शैक्षणिक सामग्रियों और समावेशी टूल्स को समझें एवं अपनी कक्षाओं के लिए अनुकूलित करें!"
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. HERO HEADER INTRO & AVATAR CHARACTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* Left Side: Editorial Typography Greeting & Profile Signature Card */}
        <div className="lg:col-span-6 text-left flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="px-3.5 py-1 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-xs">
              ✨ {lang === 'en' ? 'Live Interactive Hub' : 'लाइव समावेशी डिजिटल अनुभव'}
            </span>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none"
            >
              {lang === 'hi' ? homepageConfig.heroTitleHi : homepageConfig.heroTitle}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-slate-600 text-sm md:text-[15px] leading-relaxed font-sans"
            >
              {lang === 'hi' ? homepageConfig.heroDescHi : homepageConfig.heroDesc}
            </motion.p>

            <div className="flex gap-4 pt-1">
              <button
                onClick={() => {
                  onExploreTimeline();
                  playSuccessChime();
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black rounded-2xl cursor-pointer shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <span>{t.exploreTimeline}</span>
                <DynamicIcon name="ArrowRight" size={14} />
              </button>
              
              <button
                onClick={() => {
                  onExploreTimeline();
                  playBubbleSound();
                }}
                className="px-5 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 cursor-pointer transition-all flex items-center gap-2"
              >
                <span>{t.quickPreview}</span>
              </button>
            </div>
          </div>

          {/* CHANDRASHEKHAR GAUTAM - MINIATURE PROFILE PICTURE & DETAILED BIO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5, transition: { duration: 0.2 } }}
            onClick={() => playBubbleSound()}
            className="p-5 bg-gradient-to-r from-teal-50/60 to-indigo-50/60 hover:from-teal-100/60 hover:to-indigo-100/60 rounded-[28px] border-2 border-indigo-100/80 shadow-md flex flex-col sm:flex-row gap-4 items-center cursor-pointer transition-all duration-300"
          >
            {/* Round Mini Profile */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              <img
                src={homepageConfig.teacherImageUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300"}
                referrerPolicy="no-referrer"
                alt="Representative Portrait of Chandrashekhar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-indigo-200/45 rounded-full" />
            </div>

            {/* Profile Intro narrative */}
            <div className="text-left space-y-1">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">
                {lang === 'en' ? 'Educator Profile' : 'शिक्षक परिचय'}
              </span>
              <h4 className="font-extrabold text-sm text-slate-800">
                {lang === 'hi' ? homepageConfig.teacherNameHi : homepageConfig.teacherName}
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal font-sans font-medium">
                {lang === 'hi' ? homepageConfig.teacherBioHi : homepageConfig.teacherBio}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: LIVE LARGE COMPANION AVATAR DASHBOARD */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-50 via-slate-50 to-indigo-50/40 rounded-[36px] border border-slate-200 shadow-md relative overflow-hidden">
          {/* Ambient visual decorations inside dashboard */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute" />
              <span className="text-[10px] font-black text-indigo-900 tracking-wider uppercase font-mono">
                {homepageConfig.usePhotoInsteadOfAvatar
                  ? (lang === 'en' ? 'TEACHER PHOTO LIVE' : 'विशिष्ट शिक्षक चंद्रशेखर गौतम लाइव')
                  : (lang === 'en' ? 'BILINGUAL LIVE AVATAR ACTIVE' : 'द्विभाषी इंटरएक्टिव अवतार सक्रिय')}
              </span>
            </div>
            
            <span className="px-2 py-0.5 bg-indigo-500 text-white font-mono text-[8px] font-black rounded-md uppercase tracking-wider">
              Ver 2.6
            </span>
          </div>

          {/* Central Character & Interactive Bubble area */}
          <div className="flex flex-col items-center justify-center py-6 relative">
            
            {homepageConfig.usePhotoInsteadOfAvatar && homepageConfig.customAvatarImageUrl ? (
              <div className="relative group/avatar cursor-pointer w-full max-w-[360px] flex justify-center">
                <img
                  src={homepageConfig.customAvatarImageUrl}
                  alt={lang === 'hi' ? homepageConfig.teacherNameHi : homepageConfig.teacherName}
                  className="w-full h-auto max-h-[300px] md:max-h-[350px] object-contain rounded-[24px] border-4 border-white bg-white/90 p-1.5 shadow-xl scale-100 hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onClick={() => {
                    const poses: AvatarPose[] = ['speaking', 'namaste', 'wave', 'pointing', 'idle'];
                    const nextIndex = (poses.indexOf(currentPose) + 1) % poses.length;
                    setCurrentPose(poses[nextIndex]);
                    playKeyTap();
                  }}
                />
                <span className="absolute bottom-2 right-4 bg-emerald-500 border-2 border-white text-white font-black text-[9px] px-2.5 py-1 rounded-full shadow-md">
                  {lang === 'hi' ? 'विशेष शिक्षक' : 'Educator'}
                </span>
              </div>
            ) : (
              <InteractiveAvatar
                pose={currentPose}
                size={240}
                className="hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            )}

            {/* Dynamic Interactive Speech Tooltip Bubble */}
            <motion.div
              key={currentPose + lang + (homepageConfig.usePhotoInsteadOfAvatar ? '-photo' : '-avatar')}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mt-4 p-4 bg-white border-2 border-indigo-100 rounded-2xl shadow-sm max-w-sm text-center relative"
            >
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-indigo-100 rotate-45" />
              <p className="text-[12px] md:text-xs font-bold font-sans text-slate-700 leading-relaxed italic pr-1">
                " {homepageConfig.usePhotoInsteadOfAvatar ? teacherSpokenQuotes[lang][currentPose] : avatarSpokenQuotes[lang][currentPose]} "
              </p>
            </motion.div>
          </div>

          {/* Bottom Pose Switcher buttons bar */}
          <div className="space-y-2.5 relative z-10 pt-3 border-t border-indigo-100/60">
            <span className="text-[8px] font-black text-slate-450 tracking-widest uppercase block text-center font-sans">
              {homepageConfig.usePhotoInsteadOfAvatar
                ? (lang === 'en' ? 'CHANGE INTERACTIVE QUOTE EXPRESSION' : 'विशेष शिक्षक के संदेश और विचार बदलें')
                : (lang === 'en' ? 'SWITCH AVATAR INTERACTIVE MOTIONS' : 'अवतार की क्रियाएं व हाव-भाव बदलें')}
            </span>

            <div className="grid grid-cols-5 gap-1.5 p-1 bg-indigo-100/30 border border-indigo-100/50 rounded-xl">
              {[
                { key: 'speaking', label: lang === 'hi' ? '🗣️ विचार' : '🗣️ Thought' },
                { key: 'namaste', label: lang === 'hi' ? '🙏 स्वागत' : '🙏 Hello' },
                { key: 'wave', label: lang === 'hi' ? '👋 संदेश' : '👋 Greeting' },
                { key: 'pointing', label: lang === 'hi' ? '👉 सहयोग' : '👉 Guide' },
                { key: 'idle', label: lang === 'hi' ? '😴 धैर्य' : '😴 Pause' },
              ].map((poseBtn) => (
                <button
                  key={poseBtn.key}
                  onClick={() => {
                    setCurrentPose(poseBtn.key as AvatarPose);
                    playKeyTap();
                  }}
                  className={`py-1.5 rounded-lg text-[9px] font-black transition-all uppercase tracking-tight cursor-pointer ${
                    currentPose === poseBtn.key
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-indigo-700 hover:text-indigo-900'
                  }`}
                >
                  {poseBtn.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 2. CORE PEDAGOGY PHILOSOPHY BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            emoji: homepageConfig.card1Emoji || "🧠",
            title: lang === 'hi' ? homepageConfig.card1TitleHi : homepageConfig.card1Title,
            desc: lang === 'hi' ? homepageConfig.card1DescHi : homepageConfig.card1Desc,
            color: homepageConfig.card1Color || "rose",
            delay: 0.1
          },
          {
            emoji: homepageConfig.card2Emoji || "❤️",
            title: lang === 'hi' ? homepageConfig.card2TitleHi : homepageConfig.card2Title,
            desc: lang === 'hi' ? homepageConfig.card2DescHi : homepageConfig.card2Desc,
            color: homepageConfig.card2Color || "amber",
            delay: 0.2
          },
          {
            emoji: homepageConfig.card3Emoji || "🤝",
            title: lang === 'hi' ? homepageConfig.card3TitleHi : homepageConfig.card3Title,
            desc: lang === 'hi' ? homepageConfig.card3DescHi : homepageConfig.card3Desc,
            color: homepageConfig.card3Color || "teal",
            delay: 0.3
          }
        ].map((card, i) => {
          const cStyle = card.color.toLowerCase() === 'rose' || card.color.toLowerCase() === 'pink' || card.color.toLowerCase() === 'red'
            ? {
                card: "bg-gradient-to-br from-rose-50/90 to-rose-100/40 hover:from-rose-100/80 hover:to-rose-200/50 border-rose-200/80 hover:border-rose-450 hover:shadow-xl hover:shadow-rose-100/50",
                emojiBg: "bg-rose-100 text-rose-600 border border-rose-200",
                title: "text-rose-955 font-black text-sm md:text-base",
                desc: "text-rose-900/90"
              }
            : card.color.toLowerCase() === 'amber' || card.color.toLowerCase() === 'yellow' || card.color.toLowerCase() === 'orange'
            ? {
                card: "bg-gradient-to-br from-amber-50/90 to-amber-100/40 hover:from-amber-100/80 hover:to-amber-200/50 border-amber-200/80 hover:border-amber-450 hover:shadow-xl hover:shadow-amber-100/50",
                emojiBg: "bg-amber-100 text-amber-600 border border-amber-200",
                title: "text-amber-955 font-black text-sm md:text-base",
                desc: "text-amber-900/90"
              }
            : card.color.toLowerCase() === 'teal' || card.color.toLowerCase() === 'emerald' || card.color.toLowerCase() === 'green'
            ? {
                card: "bg-gradient-to-br from-teal-50/90 to-teal-100/40 hover:from-teal-100/80 hover:to-teal-200/50 border-teal-200/80 hover:border-teal-450 hover:shadow-xl hover:shadow-teal-100/50",
                emojiBg: "bg-teal-100 text-teal-600 border border-teal-200",
                title: "text-teal-955 font-black text-sm md:text-base",
                desc: "text-teal-900/90"
              }
            : {
                card: "bg-gradient-to-br from-indigo-50/90 to-indigo-100/40 hover:from-indigo-100/80 hover:to-indigo-200/50 border-indigo-200/80 hover:border-indigo-450 hover:shadow-xl hover:shadow-indigo-100/50",
                emojiBg: "bg-indigo-100 text-indigo-600 border border-indigo-200",
                title: "text-indigo-955 font-black text-sm md:text-base",
                desc: "text-indigo-900/90"
              };

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: card.delay, ease: "easeOut" }}
              whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.25 } }}
              onClick={() => playBubbleSound()}
              className={`p-6 rounded-[32px] border-2 flex flex-col text-left space-y-4 cursor-pointer transition-all duration-300 md:min-h-[200px] ${cStyle.card}`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs ${cStyle.emojiBg}`}>
                {card.emoji}
              </div>
              <div className="space-y-1.5 flex-grow">
                <h3 className={`${cStyle.title}`}>{card.title}</h3>
                <p className={`text-xs leading-relaxed font-sans ${cStyle.desc}`}>
                  {card.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. DEDICATED "THANK YOU" INTERACTIVE VIEW */}
      <div className="bg-gradient-to-tr from-indigo-50 via-rose-50 to-amber-50 p-8 md:p-12 rounded-[40px] border border-white/60 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
        
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-300 rounded-full blur-[100px] opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-300 rounded-full blur-[80px] opacity-30 pointer-events-none" />

        {/* Greeting Icon Illustration */}
        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center text-5xl md:text-6xl shadow-xl shadow-indigo-100 animate-pulse relative z-10">
          🙏
        </div>

        {/* Informative words */}
        <div className="text-left space-y-4 max-w-xl relative z-10">
          <span className="px-3 py-1 bg-white text-indigo-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-xs">
            {t.gratitudeTitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-none pt-1">
            {t.gratitudeSubtitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans mt-1">
            {t.gratitudeDesc}
          </p>

          <div className="flex items-center gap-3 pt-2">
            {/* Appreciation heart multiplier button */}
            <button
              onClick={() => {
                onSendAppreciation();
                playSuccessChime();
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <span>{t.sendAppreciation}</span>
              <span className="px-1.5 py-0.5 bg-white/20 text-white rounded text-[10px]">
                {appreciationCount}
              </span>
            </button>
            
            <button
              onClick={() => {
                onExploreTimeline();
                playBubbleSound();
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              {t.browseJourney} &rarr;
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
