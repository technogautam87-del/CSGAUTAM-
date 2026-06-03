import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Publication } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound } from '../audio';
import { TRANSLATIONS } from '../translations';

interface PublicationsTabProps {
  publications: Publication[];
  lang?: 'en' | 'hi';
}

// Convert date (YYYY-MM-DD) beautifully to e.g. "15 Mar,24" or "30 May,25"
const formatDateToRibbon = (dateStr: string): string => {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0].substring(2);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${months[monthIndex] || 'Oct'},${year}`;
    }
  } catch (e) {}
  return dateStr;
};

// Returns an exquisite high-quality educational illustration Unsplash image reflecting the publication
const getPublicationImage = (id: string): string => {
  switch (id) {
    case 'pub-1':
      return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600'; // ADHD kit sensory toy hands
    case 'pub-2':
      return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600'; // Inclusive board classroom
    case 'pub-3':
      return 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600'; // Children tactile touch study
    case 'pub-4':
      return 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600'; // Indian Sign Language group
    case 'pub-5':
      return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600'; // Dynamic planning IEP grid
    case 'pub-6':
      return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600'; // Official exam book shelf
    default:
      return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600';
  }
};

export const PublicationsTab: React.FC<PublicationsTabProps> = ({
  publications,
  lang = 'hi',
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const t = TRANSLATIONS[lang];

  const filteredPubs = publications.filter((pub) => {
    const matchesFilter = filter === 'all' || pub.type === filter;
    
    // Support localized title and description search
    const titleText = (lang === 'hi' && pub.titleHi ? pub.titleHi : pub.title).toLowerCase();
    const descText = (lang === 'hi' && pub.descriptionHi ? pub.descriptionHi : pub.description).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return matchesFilter && (titleText.includes(query) || descText.includes(query));
  });

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pdf':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'notes':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'departmental':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Localized badges
  const getLocalizedBadgeLabel = (type: string) => {
    if (lang === 'hi') {
      switch (type) {
        case 'article': return 'लेख (Article)';
        case 'pdf': return 'पीडीएफ (PDF)';
        case 'notes': return 'कक्षा नोट्स';
        case 'departmental': return 'शासकीय दिशानिर्देश';
        default: return type;
      }
    }
    return type;
  };

  return (
    <div className="py-8 bg-white max-w-6xl mx-auto px-4 animate-fade-in">
      {/* Intro section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="text-left">
          <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-teal-100 shadow-xs inline-block mb-3">
            {lang === 'en' ? 'Scholarly Assets' : 'अकादमिक पाठ्यसामग्री'}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {t.publicationsTitle}
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-sans">
            {t.publicationsSubtitle}
          </p>
        </div>

        {/* Live Search bar */}
        <div className="relative max-w-xs w-full flex-shrink-0">
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search resources...' : 'सामग्री खोजें...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 bg-slate-50 text-slate-700 font-sans"
          />
          <div className="absolute left-2.5 top-3.5 text-slate-400">
            <DynamicIcon name="Search" size={14} />
          </div>
        </div>
      </div>

      {/* Grid Filter Bar */}
      <div className="flex gap-2 flex-wrap pb-4 mb-6 border-b border-slate-100">
        {[
          { key: 'all', label: lang === 'en' ? '📖 All Resources' : '📖 सभी पाठ्यसामग्री' },
          { key: 'article', label: lang === 'en' ? '📄 Articles' : '📄 लेख' },
          { key: 'pdf', label: lang === 'en' ? '📕 PDFs' : '📕 पीडीएफ पुस्तकें' },
          { key: 'notes', label: lang === 'en' ? '📝 Classroom Notes' : '📝 क्लास नोट्स' },
          { key: 'departmental', label: lang === 'en' ? '🏛️ Departmental' : '🏛️ शासकीय प्रलेख' },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => {
              setFilter(btn.key);
              playBubbleSound();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filter === btn.key
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-transparent shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/60'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grid Layout: 3 blocks per row on desktop */}
      <AnimatePresence mode="popLayout animate-fade-in">
        {filteredPubs.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPubs.map((pub, idx) => (
              <PublicationCard
                key={pub.id}
                pub={pub}
                lang={lang}
                getBadgeStyle={getBadgeStyle}
                getLocalizedBadgeLabel={getLocalizedBadgeLabel}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <span className="text-4xl">📚</span>
            <h3 className="font-bold text-slate-700 mt-2">
              {lang === 'en' ? 'No publications found' : 'कोई पाठ्यसामग्री नहीं मिली'}
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              {lang === 'en' ? 'Try simplifying your search keywords!' : 'कृपया अलग खोज शब्दों का प्रयोग करें!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// INDIVIDUAL BEAUTY CARD COMPONENT (Replicating user screenshot faithfully)
interface PublicationCardProps {
  pub: Publication;
  lang: 'en' | 'hi';
  getBadgeStyle: (type: string) => string;
  getLocalizedBadgeLabel: (type: string) => string;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  pub,
  lang,
  getBadgeStyle,
  getLocalizedBadgeLabel
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const displayTitle = lang === 'hi' && pub.titleHi ? pub.titleHi : pub.title;
  const displayDesc = lang === 'hi' && pub.descriptionHi ? pub.descriptionHi : pub.description;
  const displayAuthor = lang === 'hi' && pub.author === 'Chandrashekhar Gautam' ? 'चंद्रशेखर गौतम' : pub.author;

  // Header Title mapping in bold uppercase representation (like QUESTION BANK CLASS-9)
  const getHeaderLabel = (): string => {
    if (lang === 'hi') {
      if (pub.id === 'pub-1') return '🎒 संवेदी अधिगम किट (ADHD)';
      if (pub.id === 'pub-2') return '🏛️ समावेशी दिशानिर्देश';
      if (pub.id === 'pub-3') return '📕 ब्रेल स्पर्श टूलकिट';
      if (pub.id === 'pub-4') return '🤟 सांकेतिक भाषा संकेत नोट्स';
      if (pub.id === 'pub-5') return '📝 रेडी-टु-यूज़ IEP फॉर्मैट';
      if (pub.id === 'pub-6') return '🎓 बोर्ड परीक्षा रियायत नियम';
      return pub.titleHi || pub.title;
    } else {
      if (pub.id === 'pub-1') return '🎒 Adaptive ADHD Kit';
      if (pub.id === 'pub-2') return '🏛️ Inclusivity Rules';
      if (pub.id === 'pub-3') return '📕 Braille Tactile Guide';
      if (pub.id === 'pub-4') return '🤟 Indian Sign Language';
      if (pub.id === 'pub-5') return '📝 Ready IEP Templates';
      if (pub.id === 'pub-6') return '🎓 Exam Exemption Book';
      return pub.title.toUpperCase();
    }
  };

  const getSubHeaderBadgeName = (): string => {
    if (lang === 'hi') {
      switch (pub.type) {
        case 'article': return 'पब्लिकेशन (RESEARCH)';
        case 'pdf': return 'हैंडबुक (RESOURCES)';
        case 'notes': return 'क्लास नोट्स (TEACHING)';
        case 'departmental': return 'शासकीय प्रलेख (BOARD)';
        default: return 'अकादमिक प्रलेख';
      }
    } else {
      switch (pub.type) {
        case 'article': return 'PUBLICATION (RESEARCH)';
        case 'pdf': return 'HANDBOOK (RESOURCES)';
        case 'notes': return 'CLASSROOM NOTES (TEACHING)';
        case 'departmental': return 'DEPARTMENTAL BRIEF (BOARD)';
        default: return 'EDUCATIONAL RESOURCE';
      }
    }
  };

  const ribbonDate = formatDateToRibbon(pub.date);

  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      className="bg-white rounded-[32px] border border-slate-200/80 flex flex-col justify-between shadow-lg shadow-indigo-150/10 hover:shadow-2xl hover:border-slate-300 transition-all text-left overflow-hidden relative group"
    >
      {/* 1. TOP HEADER BLUE BANNER WINDOW */}
      <div className="bg-[#1e1b4b] text-white p-5 pb-4.5 pr-16 relative flex items-center gap-2 border-b border-white/5">
        <span className="text-teal-400 text-lg flex-shrink-0 font-bold">⁝≡</span>
        <h3 className="font-extrabold text-[12px] md:text-xs text-slate-100 tracking-wide leading-tight truncate uppercase" title={getHeaderLabel()}>
          {getHeaderLabel()}
        </h3>
      </div>

      {/* 2. DIAGONAL OVERLAY CORNER RIBBON */}
      <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none z-10">
        <div className="absolute transform rotate-45 translate-x-7 translate-y-5 bg-gradient-to-r from-teal-500 to-indigo-600 border border-white/20 text-white font-mono text-[8px] font-black tracking-widest text-center py-1 w-32 shadow-md uppercase">
          {ribbonDate}
        </div>
      </div>

      {/* 3. CARD WORKSPACE BODY AREA */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subheader category with Shopping Bag/folder icon */}
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <span className="text-sm">🛍️</span>
            <span className="font-extrabold text-[10px] tracking-wider uppercase">
              {getSubHeaderBadgeName()}
            </span>
          </div>

          {/* Centered visual graphic mock with rounded corners and light shadow */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center p-1.5 mb-4 group-hover:scale-[1.01] transition-transform duration-300">
            <img
              src={getPublicationImage(pub.id)}
              referrerPolicy="no-referrer"
              alt={displayTitle}
              className="w-full h-full object-cover rounded-xl shadow-xs"
            />
            {/* Ambient vignette background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none rounded-xl" />
          </div>

          {/* Writer note with finger pointer and dropdown */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div className="flex gap-2 items-start text-slate-800">
              <span className="text-sm flex-shrink-0 pt-0.5">✍️</span>
              <p className="text-xs font-black leading-tight font-sans text-slate-900 group-hover:text-indigo-900 transition-colors">
                {displayTitle}
              </p>
            </div>
            
            {/* Toggle show dropdown info */}
            <button
              onClick={() => {
                setIsExpanded(!isExpanded);
                playBubbleSound();
              }}
              className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-[9px] font-black tracking-wider rounded-lg transition-colors shadow-xs flex-shrink-0 cursor-pointer flex items-center gap-1 uppercase"
            >
              <span>{isExpanded ? (lang === 'en' ? 'less' : 'कम') : (lang === 'en' ? 'more now' : 'और देखें')}</span>
              <span>{isExpanded ? '▲' : '▼'}</span>
            </button>
          </div>

          {/* Expandable Slide-open Drawer for details */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mt-3"
              >
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-[11px] text-slate-600">
                  <p className="leading-relaxed font-sans font-medium text-slate-600">
                    {displayDesc}
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[9px] font-mono text-slate-400 font-bold">
                    <span>{lang === 'en' ? 'AUTHOR' : 'रचयिता'}: {displayAuthor}</span>
                    <span>{pub.date}</span>
                  </div>
                  <div className="text-[10px] text-teal-700 font-bold bg-teal-50/50 p-2 rounded-lg border border-teal-100 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>
                      {lang === 'en' 
                        ? 'Features custom interactive sensory sheets & physical stimulation exercises.' 
                        : 'इस टूलकिट फ़ाइल में संवेदी सहायक पुस्तिका और अभ्यास प्रलेख सम्मिलित हैं।'
                      }
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. SOLID BOTTOM SOLID NAVY BAR FOR ACTIONS */}
      <div className="bg-[#1e1b4b] p-4 flex items-center justify-between border-t border-white/5 relative z-10">
        <span className="text-[10px] font-bold text-slate-300 tracking-wide truncate max-w-[55%] uppercase font-mono">
          {lang === 'en' ? 'BY' : 'द्वारा'}: {displayAuthor.split(' ')[0]}
        </span>
        
        <a
          href={pub.link}
          target="_blank"
          rel="noreferrer"
          onClick={() => playBubbleSound()}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-wider text-[10px] uppercase rounded-xl transition-all shadow-md shadow-cyan-500/15 flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 text-center justify-center"
        >
          <span>👁️ {lang === 'en' ? 'View' : 'देखें'}</span>
        </a>
      </div>
    </motion.div>
  );
};
