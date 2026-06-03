import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound, playSuccessChime } from '../audio';
import { TRANSLATIONS } from '../translations';

interface AchievementsTabProps {
  achievements: Achievement[];
  lang?: 'en' | 'hi';
}

// Convert date (YYYY-MM-DD) beautifully to e.g. "05 Sep,24" or "12 Apr,23"
const formatDateToRibbon = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0].substring(2);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${months[monthIndex] || 'Sep'},${year}`;
    }
  } catch (e) {}
  return dateStr;
};

// Returns a premium Unsplash image reflecting the specific achievement/award
const getAchievementImage = (id: string): string => {
  switch (id) {
    case 'ach-1': // Best Special Teacher Award
      return 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600'; // Award ceremony teacher desk
    case 'ach-2': // fellowship
      return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'; // Learning fellowship workspace
    case 'ach-3': // community initiative
      return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600'; // Unified play sports children
    default:
      return 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600';
  }
};

interface HonorTheme {
  primaryColor: string;
  headerBg: string;
  ribbonBg: string;
  accentBorder: string;
  glowColor: string;
  btnBg: string;
  badgeStyle: string;
  bulletIcon: string;
  bgOrb: string;
}

// Custom theme mapping function based on Category or ID
const getHonorTheme = (ach: Achievement): HonorTheme => {
  const cat = (ach.category || '').toLowerCase();
  const id = ach.id;
  
  if (cat.includes('state') || cat.includes('national') || cat.includes('award') || cat.includes('विशेष शिक्षक') || id === 'ach-1') {
    return {
      primaryColor: 'amber',
      headerBg: 'bg-gradient-to-r from-[#12103e] via-[#211a5b] to-[#3f2112]',
      ribbonBg: 'from-amber-500 via-amber-600 to-orange-500',
      accentBorder: 'border-amber-200/60 group-hover:border-amber-400/80',
      glowColor: 'shadow-amber-500/5 hover:shadow-[0_20px_40px_-5px_rgba(245,158,11,0.25)]',
      btnBg: 'bg-amber-400 hover:bg-amber-500 text-slate-950',
      badgeStyle: 'bg-amber-100/80 text-amber-800 border-amber-300/40',
      bulletIcon: '🏆',
      bgOrb: 'bg-amber-400/10'
    };
  } else if (cat.includes('fellowship') || cat.includes('scholarly') || cat.includes('फैलोशिप') || id === 'ach-2') {
    return {
      primaryColor: 'purple',
      headerBg: 'bg-gradient-to-r from-[#12103e] via-[#2a1a5b] to-[#45104d]',
      ribbonBg: 'from-purple-500 via-indigo-500 to-pink-500',
      accentBorder: 'border-purple-200/60 group-hover:border-purple-400/80',
      glowColor: 'shadow-purple-500/5 hover:shadow-[0_20px_40px_-5px_rgba(168,85,247,0.25)]',
      btnBg: 'bg-fuchsia-400 hover:bg-fuchsia-500 text-slate-950',
      badgeStyle: 'bg-purple-100/80 text-purple-800 border-purple-300/40',
      bulletIcon: '🎓',
      bgOrb: 'bg-purple-400/10'
    };
  } else {
    // Community Outreach or Special Initiatives
    return {
      primaryColor: 'teal',
      headerBg: 'bg-gradient-to-r from-[#12103e] via-[#103a4d] to-[#0d5940]',
      ribbonBg: 'from-teal-400 via-emerald-500 to-emerald-600',
      accentBorder: 'border-teal-200/60 group-hover:border-teal-400/80',
      glowColor: 'shadow-teal-500/5 hover:shadow-[0_20px_40px_-5px_rgba(20,184,166,0.25)]',
      btnBg: 'bg-cyan-400 hover:bg-cyan-500 text-slate-950',
      badgeStyle: 'bg-emerald-100/80 text-emerald-800 border-emerald-300/40',
      bulletIcon: '🎖️',
      bgOrb: 'bg-emerald-400/10'
    };
  }
};

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  achievements,
  lang = 'hi',
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedHonor, setSelectedHonor] = useState<Achievement | null>(null);

  return (
    <div className="py-12 bg-slate-50/40 max-w-6xl mx-auto px-4 animate-fade-in relative overflow-hidden">
      
      {/* Dynamic Background Glassy Blur Orbs - Creates depth behind glass cards */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-64 h-64 bg-pink-100/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Intro section */}
      <div className="text-center mb-12 relative z-10">
        <span className="px-4 py-1.5 bg-amber-50/90 text-amber-800 rounded-full text-xs font-black uppercase tracking-wider border border-amber-250 shadow-xs inline-block mb-3">
          🎖️ {lang === 'en' ? 'Accolades & Merits' : 'असाधारण सम्मान व उपलब्धियां'}
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
          {t.accoladesTitle}
        </h2>
        <p className="text-slate-500 mt-3 text-sm max-w-xl mx-auto font-sans font-medium leading-relaxed">
          {t.accoladesSubtitle}
        </p>
      </div>

      {/* Glassmorphic Stats Counters bento style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16 relative z-10">
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="backdrop-blur-md bg-white/70 p-6 rounded-[28px] border border-white/55 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-amber-200 text-center relative overflow-hidden group transition-all"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <span className="text-3xl font-black text-amber-600 block tracking-tight font-sans">
            {achievements.length}
          </span>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-1.5">
            {lang === 'en' ? '🏅 Total Accolades' : '🏅 कुल संचित पुरस्कार'}
          </span>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="backdrop-blur-md bg-white/70 p-6 rounded-[28px] border border-white/55 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-purple-200 text-center relative overflow-hidden group transition-all"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <span className="text-3xl font-black text-purple-600 block tracking-tight font-sans">
            {achievements.filter(a => a.category.toLowerCase().includes('state') || a.category.toLowerCase().includes('national') || a.category.toLowerCase().includes('राज') || a.category.toLowerCase().includes('राष्ट्रीय')).length}
          </span>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-1.5">
            {lang === 'en' ? '🏛️ State & National Honors' : '🏛️ राज्य / राष्ट्रीय गौरव'}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="backdrop-blur-md bg-white/70 p-6 rounded-[28px] border border-white/55 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-emerald-200 text-center relative overflow-hidden group transition-all"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <span className="text-3xl font-black text-emerald-600 block tracking-tight font-sans">
            {achievements.filter(a => a.category.toLowerCase().includes('community') || a.category.toLowerCase().includes('impact') || a.category.toLowerCase().includes('प्रभाव') || a.category.toLowerCase().includes('सामुदायिक')).length || 1}
          </span>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mt-1.5">
            {lang === 'en' ? '🤝 Community Impact' : '🤝 लोक कल्याणकारी प्रभाव'}
          </span>
        </motion.div>
      </div>

      {/* Main Beautiful Structured Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {achievements.map((ach) => (
          <AchievementCard
            key={ach.id}
            ach={ach}
            lang={lang}
            onOpenDetails={(item) => {
              setSelectedHonor(item);
              playSuccessChime();
            }}
          />
        ))}
      </div>

      {/* POPUP VIEW MODAL: Glassmorphic Credential Seal Certificate Screen */}
      <AnimatePresence>
        {selectedHonor && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white rounded-[32px] shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col relative text-left"
            >
              {/* Responsive Gold dynamic gradient header */}
              <div className="p-6 bg-gradient-to-r from-[#12103e] via-amber-950 to-amber-900 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                
                <div>
                  <span className="px-2.5 py-0.5 bg-white/20 border border-white/30 text-white rounded-full text-[9px] font-black uppercase tracking-widest block w-max">
                    {lang === 'hi' && selectedHonor.categoryHi ? selectedHonor.categoryHi : selectedHonor.category}
                  </span>
                  <h3 className="text-xl font-black mt-1.5 tracking-tight pr-4">
                    {lang === 'hi' && selectedHonor.titleHi ? selectedHonor.titleHi : selectedHonor.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedHonor(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white cursor-pointer active:scale-90 transition-transform"
                >
                  <DynamicIcon name="X" size={16} />
                </button>
              </div>

              {/* Certificate Inner Glass layout */}
              <div className="p-6 space-y-5 bg-slate-50/50">
                
                {/* Embedded Visual Plate */}
                <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md border-4 border-amber-100 flex items-center justify-center bg-slate-900 text-white relative group">
                  <img
                    src={getAchievementImage(selectedHonor.id)}
                    referrerPolicy="no-referrer"
                    alt={selectedHonor.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Watermark security marker */}
                  <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] text-amber-300 font-extrabold tracking-widest border border-white/10">
                    🔒 METRIC REGISTERED
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[9px] text-amber-400 font-bold font-mono">
                    Official Merit Record System
                  </div>
                </div>

                {/* Substantive Registry fields */}
                <div className="space-y-3.5 font-sans">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">
                        Conferring Institution
                      </span>
                      <span className="text-xs font-bold text-slate-800 leading-tight block">
                        {lang === 'hi' && selectedHonor.issuerHi ? selectedHonor.issuerHi : selectedHonor.issuer}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-0.5">
                        Date Granted
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-700 block mt-1">
                        🗓️ {selectedHonor.date}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4.5 rounded-2xl border border-slate-150/60 shadow-xs">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      Credential Citations & Narrative
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                      {lang === 'hi' && selectedHonor.descriptionHi ? selectedHonor.descriptionHi : selectedHonor.description}
                    </p>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-100 p-4 border-t border-slate-200/80 flex flex-wrap justify-between items-center gap-3 px-6">
                <span className="text-[10px] text-slate-400 font-bold font-mono tracking-wider">
                  OFFICIAL SEAL REGISTRY
                </span>
                
                <div className="flex gap-2">
                  {selectedHonor.linkUrl && (
                    <a
                      href={selectedHonor.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 rounded-xl text-xs font-black transition-colors cursor-pointer shadow-sm inline-flex items-center gap-1.5"
                    >
                      <span>🔗</span>
                      <span>
                        {selectedHonor.linkText || (lang === 'en' ? 'Open Verification File' : 'सत्यापन दस्तावेज खोलें')}
                      </span>
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedHonor(null)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors shadow-md"
                  >
                    {lang === 'en' ? 'Close Seal Record' : 'अभिलेख पत्रक बंद करें'}
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

// COMPRESSED INDIVIDUAL BEAUTY CARD COMPONENT (Matching screenshot structure with highly custom animations)
interface AchievementCardProps {
  ach: Achievement;
  lang: 'en' | 'hi';
  onOpenDetails: (item: Achievement) => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  ach,
  lang,
  onOpenDetails
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  
  // Dynamically obtain colored theme based on the dynamic categories 
  const theme = getHonorTheme(ach);

  const displayTitle = lang === 'hi' && ach.titleHi ? ach.titleHi : ach.title;
  const displayDesc = lang === 'hi' && ach.descriptionHi ? ach.descriptionHi : ach.description;
  const displayIssuer = lang === 'hi' && ach.issuerHi ? ach.issuerHi : ach.issuer;
  const displayCategory = lang === 'hi' && ach.categoryHi ? ach.categoryHi : ach.category;

  // Header Title mapping in bold uppercase representation (mimics screenshot's Class-9 style)
  const getHeaderLabel = (): string => {
    if (lang === 'hi') {
      if (ach.id === 'ach-1') return '🏆 राजकीय विशेष शिक्षक सम्मान पत्र';
      if (ach.id === 'ach-2') return '🎓 राष्ट्रीय शोध अध्यापन फैलोशिप';
      if (ach.id === 'ach-3') return '🎖️ ग्रामीण समावेशी खेलकूद प्रशस्ति पत्र';
      return ach.titleHi || ach.title;
    } else {
      if (ach.id === 'ach-1') return '🏆 STATE SPECIAL TEACHER MEDAL';
      if (ach.id === 'ach-2') return '🎓 NATIONAL PEDAGOGICAL FELLOWSHIP';
      if (ach.id === 'ach-3') return '🎖️ PUBLIC UNIFIED OUTREACH SHIELD';
      return ach.title.toUpperCase();
    }
  };

  const getSubHeaderBadgeName = (): string => {
    if (lang === 'hi') {
      return `सम्मान कोटि (${displayCategory.split(' ')[0]})`;
    } else {
      return `CONFERRED REGISTRY (${displayCategory.split(' ')[0].toUpperCase()})`;
    }
  };

  const ribbonDate = formatDateToRibbon(ach.date);

  return (
    <motion.div
      layout
      whileHover={{ 
        y: -12,
        scale: 1.025,
        rotateY: -1,
        rotateX: 1
      }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`backdrop-blur-md bg-white/70 rounded-[32px] border ${theme.accentBorder} flex flex-col justify-between ${theme.glowColor} transition-all text-left overflow-hidden relative group font-sans`}
    >
      
      {/* Dynamic Backing Ambient Orb inside the card */}
      <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${theme.bgOrb} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700`} />

      {/* 1. TOP HEADER COLORED BANNER WINDOW (faithfully modeled after user screenshot header) */}
      <div className={`${theme.headerBg} text-white p-5 pb-4.5 pr-20 relative flex items-center gap-2.5 border-b border-white/5`}>
        <motion.span 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-amber-400 text-lg flex-shrink-0 font-bold"
        >
          {theme.bulletIcon}
        </motion.span>
        
        <h3 className="font-black text-[11px] md:text-xs text-slate-100 tracking-wide leading-tight truncate uppercase" title={getHeaderLabel()}>
          {getHeaderLabel()}
        </h3>
      </div>

      {/* 2. DIAGONAL OVERLAY CORNER RIBBON (faithful diagonal corner of physical artifact) */}
      <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
        <div className={`absolute transform rotate-45 translate-x-7 translate-y-5 bg-gradient-to-r ${theme.ribbonBg} border border-white/20 text-white font-mono text-[8px] font-black tracking-widest text-center py-1 w-32 shadow-md uppercase`}>
          {ribbonDate}
        </div>
      </div>

      {/* 3. CARD WORKSPACE BODY AREA */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-10">
        <div>
          
          {/* Subheader type indicator bag item */}
          <div className="flex items-center gap-2 mb-3.5 text-slate-600">
            <span className="text-xs">🎖️</span>
            <span className="font-extrabold text-[9.5px] tracking-wider uppercase">
              {getSubHeaderBadgeName()}
            </span>
          </div>

          {/* Golden Image Plate / Vector Icon illustration frame */}
          <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner flex items-center justify-center p-1.5 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
            <img
              src={getAchievementImage(ach.id)}
              referrerPolicy="no-referrer"
              alt={displayTitle}
              className="w-full h-full object-cover rounded-xl shadow-xs"
            />
            
            {/* Soft border layers */}
            <div className="absolute inset-0 border border-white/20 rounded-xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Text Summary Writer & and Dropdown Accordion Panel */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex gap-2 items-start text-slate-800">
              <span className="text-sm flex-shrink-0 pt-0.5">✍️</span>
              <p className="text-[12.5px] font-black leading-tight text-slate-900 group-hover:text-indigo-900 transition-colors">
                {displayTitle}
              </p>
            </div>
            
            {/* Toggle dropdown action trigger */}
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                playBubbleSound();
              }}
              className={`px-2.5 py-1.5 ${theme.btnBg} hover:opacity-90 text-[9px] font-black tracking-wider rounded-lg transition-all shadow-xs flex-shrink-0 cursor-pointer flex items-center gap-1 uppercase active:scale-95`}
            >
              <span>{isExpanded ? (lang === 'en' ? 'less' : 'कम') : (lang === 'en' ? 'more now' : 'और देखें')}</span>
              <span>{isExpanded ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Expandable Slide-open Drawer for credential details */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mt-3"
              >
                <div className="p-3.5 bg-white/80 border border-slate-150 rounded-2xl space-y-2 text-[11px] text-slate-600 shadow-inner leading-relaxed">
                  <p className="font-medium text-slate-600 font-sans">
                    {displayDesc}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400 font-bold">
                    <span>{lang === 'en' ? 'CONFERRED BY' : 'प्रदाता'}: {displayIssuer}</span>
                    <span>{ach.date}</span>
                  </div>

                  <div className={`text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-1.5 text-slate-500 font-medium`}>
                    <span className="text-xs">🏆</span>
                    <span>
                      {lang === 'en' 
                        ? 'Features verified citation credentials in state registry portfolio.' 
                        : 'इस पुरस्कार में स्वर्ण पदक प्रशस्ति पट्टिका और स्मृति चिन्ह प्रदान किया गया।'
                      }
                    </span>
                  </div>

                  {ach.linkUrl && (
                    <a
                      href={ach.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSuccessChime();
                      }}
                      className="mt-2 text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-800 p-2 rounded-xl border border-teal-200 flex items-center justify-between font-bold cursor-pointer transition-all"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>🔗</span>
                        <span>
                          {ach.linkText || (lang === 'en' ? 'Open Verification Document' : 'सत्यापन प्रमाण-पत्र खोलें')}
                        </span>
                      </span>
                      <span className="text-[8px] uppercase bg-teal-200 px-1.5 py-0.5 rounded text-teal-900">Open &rarr;</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. SOLID ACTION NAVIGATION FOOTER BAR (faithful bottom navy panel with view indicators) */}
      <div className="bg-[#12103e] p-4 flex items-center justify-between border-t border-white/5 relative z-10">
        <span className="text-[9.5px] font-extrabold text-slate-300 tracking-wide truncate max-w-[55%] uppercase font-mono">
          {lang === 'en' ? 'BY' : 'द्वारा'}: {displayIssuer?.split(' ')[0] || 'DEPARTMENT'}
        </span>
        
        <button
          onClick={() => onOpenDetails(ach)}
          className="px-4.5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black tracking-wider text-[9.5px] uppercase rounded-xl transition-all shadow-md shadow-cyan-400/15 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 text-center justify-center"
        >
          <span>👁️ {lang === 'en' ? 'Review details' : 'विवरण देखें'}</span>
        </button>
      </div>

    </motion.div>
  );
};
