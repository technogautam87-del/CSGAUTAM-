import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineMilestone } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound, playSuccessChime } from '../audio';
import { TRANSLATIONS } from '../translations';
import { InteractiveAvatar } from './InteractiveAvatar';

interface TimelineJourneyProps {
  milestones: TimelineMilestone[];
  onUpdateMilestones?: (updated: TimelineMilestone[]) => void;
  lang?: 'en' | 'hi';
}

export const TimelineJourney: React.FC<TimelineJourneyProps> = ({
  milestones,
  lang = 'hi',
}) => {
  // Sort milestones chronologically starting from 1998 (Birth)
  const sortedMilestones = [...milestones].sort((a, b) => a.year - b.year);
  
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [activeYear, setActiveYear] = useState<number>(sortedMilestones[0]?.year || 1998);

  const t = TRANSLATIONS[lang];

  // Colorful styling setup for card categories
  const getCardStyle = (category: string) => {
    switch (category) {
      case 'Birth':
        return {
          card: "bg-gradient-to-br from-amber-50/90 to-orange-100/30 hover:from-amber-100/90 hover:to-orange-200/40 border-amber-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-100/40",
          iconColor: "text-amber-500",
          borderLeft: "border-l-4 border-amber-500",
          accentText: "text-amber-600"
        };
      case 'Education':
        return {
          card: "bg-gradient-to-br from-emerald-50/90 to-teal-100/30 hover:from-emerald-100/90 hover:to-teal-200/40 border-emerald-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-100/40",
          iconColor: "text-emerald-500",
          borderLeft: "border-l-4 border-emerald-500",
          accentText: "text-emerald-600"
        };
      case 'Career':
        return {
          card: "bg-gradient-to-br from-sky-50/90 to-indigo-100/30 hover:from-sky-100/90 hover:to-indigo-200/40 border-sky-200 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-100/40",
          iconColor: "text-sky-500",
          borderLeft: "border-l-4 border-indigo-500",
          accentText: "text-indigo-600"
        };
      case 'Achievement':
        return {
          card: "bg-gradient-to-br from-purple-50/90 to-fuchsia-100/30 hover:from-purple-100/90 hover:to-fuchsia-200/40 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100/40",
          iconColor: "text-purple-500",
          borderLeft: "border-l-4 border-purple-500",
          accentText: "text-purple-600"
        };
      case 'Special Education':
        return {
          card: "bg-gradient-to-br from-pink-50/90 to-rose-100/30 hover:from-pink-100/90 hover:to-rose-200/40 border-pink-200 hover:border-pink-400 hover:shadow-xl hover:shadow-pink-100/40",
          iconColor: "text-pink-500",
          borderLeft: "border-l-4 border-pink-500",
          accentText: "text-pink-600"
        };
      default:
        return {
          card: "bg-gradient-to-br from-slate-50/90 to-slate-100/30 hover:from-slate-100/90 hover:to-slate-200/40 border-slate-200 hover:border-slate-450 hover:shadow-xl hover:shadow-slate-100/40",
          iconColor: "text-slate-500",
          borderLeft: "border-l-4 border-slate-500",
          accentText: "text-indigo-600"
        };
    }
  };

  // Colorful tags for category badges
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Birth':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Education':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Career':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Achievement':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Special Education':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Birth':
        return 'Heart';
      case 'Education':
        return 'GraduationCap';
      case 'Career':
        return 'Briefcase';
      case 'Achievement':
        return 'Award';
      case 'Special Education':
        return 'Sparkles';
      default:
        return 'Compass';
    }
  };

  const getLocalizedCategory = (ms: TimelineMilestone) => {
    if (lang === 'hi' && ms.categoryHi) return ms.categoryHi;
    return ms.category;
  };

  return (
    <div id="timeline-journey-section" className="py-12 bg-gradient-to-b from-white via-indigo-50/10 to-white overflow-hidden relative">
      
      {/* Interactive floating particles */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-pink-200/30 rounded-full blur-2xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-sky-200/30 rounded-full blur-2xl animate-pulse pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Metadata */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold uppercase tracking-wider border border-indigo-100 shadow-xs inline-block mb-3">
            {lang === 'en' ? 'Interactive Flying Walkway' : 'सजीव स्क्रोलिंग यात्रा संस्मरण'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            {t.journeyTitle}
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto">
            {t.journeySubtitle}
          </p>
          <div className="mt-4 text-xs font-semibold text-teal-600 animate-bounce">
            ⬇️ {lang === 'en' ? 'SCROLL DOWN TO REVEAL LANDMARKS' : 'विवरण देखने के लिए नीचे स्क्रोल करें'}
          </div>
        </div>

        {/* VERTICAL SCROLL TIMELINE MAIN BOX */}
        <div className="relative max-w-4xl mx-auto mt-12 pb-16">
          
          {/* Vertical Spine Central Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-teal-400 via-indigo-500 to-pink-500 rounded-full transform -translate-x-1/2" />
          
          <div className="space-y-16">
            {sortedMilestones.map((ms, idx) => {
              const isEven = idx % 2 === 0;
              const isHovered = ms.year === hoveredYear;
              const cardStyle = getCardStyle(ms.category);

              // Localized data
              const displayTitle = lang === 'hi' && ms.titleHi ? ms.titleHi : ms.title;
              const displaySubtitle = lang === 'hi' && ms.subtitleHi ? ms.subtitleHi : ms.subtitle;
              const displayNotes = lang === 'hi' && ms.notesHi ? ms.notesHi : ms.notes;
              const displayCategory = getLocalizedCategory(ms);

              return (
                <motion.div
                  key={ms.id}
                  id={`milestone-${ms.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-18% 0px -18% 0px" }}
                  onViewportEnter={() => {
                    setActiveYear(ms.year);
                  }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className={`relative flex flex-col md:flex-row items-stretch ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  
                  {/* Left Column (Relative space placeholder) */}
                  <div className="w-full md:w-1/2 px-4 md:px-8" />

                  {/* Central Node Circle representing the year */}
                  <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center top-0">
                    
                    {/* The Interactive Flying Kung-Fu Panda that glides dynamically to the active year */}
                    {activeYear === ms.year && (
                      <motion.div
                        layoutId="flying-airplane"
                        className="absolute -top-20 z-25 flex flex-col items-center pointer-events-none animate-bounce"
                        style={{ animationDuration: '4s' }}
                        transition={{ type: 'spring', stiffness: 95, damping: 13 }}
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -8, 0],
                            rotate: [0, -6, 6, 0]
                          }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative flex flex-col items-center"
                        >
                          <InteractiveAvatar
                            pose="flying"
                            size={72}
                            lang={lang}
                            className="drop-shadow-2xl hover:scale-110 transition-all"
                          />
                          <div className="absolute -bottom-1 text-[8px] font-black bg-gradient-to-r from-red-600 via-yellow-400 to-red-600 text-white px-2 py-0.5 rounded-full border border-white shadow-md uppercase tracking-wider scale-95 whitespace-nowrap">
                            Po Flight 🐼🥋
                          </div>
                        </motion.div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 animate-ping" />
                      </motion.div>
                    )}

                    <motion.button
                      onClick={() => {
                        setSelectedMilestone(ms);
                        setActiveYear(ms.year);
                        playSuccessChime();
                      }}
                      onMouseEnter={() => {
                        setHoveredYear(ms.year);
                        setActiveYear(ms.year);
                        playBubbleSound();
                      }}
                      onMouseLeave={() => setHoveredYear(null)}
                      whileHover={{ scale: 1.25, rotate: 360 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black border-2 shadow-lg cursor-pointer transition-all ${
                        activeYear === ms.year
                          ? 'bg-gradient-to-tr from-indigo-600 via-pink-500 to-amber-500 text-white border-transparent ring-4 ring-indigo-200'
                          : isHovered 
                          ? 'bg-gradient-to-tr from-pink-500 to-amber-400 text-white border-transparent'
                          : 'bg-white text-slate-800 border-teal-400 hover:border-indigo-500'
                      }`}
                    >
                      {ms.year}
                    </motion.button>
                    
                    {/* Small tag identifier */}
                    <span className="text-[9px] font-bold font-mono text-slate-400 bg-white/90 px-1.5 py-0.5 rounded border border-slate-100 shadow-xs mt-1">
                      {ms.category === 'Birth' ? '👶' : displayCategory}
                    </span>
                  </div>

                  {/* Right Column / Content Card Container */}
                  <div className="w-full md:w-1/2 px-4 pl-16 md:pl-8 text-left">
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      onMouseEnter={() => {
                        setActiveYear(ms.year);
                      }}
                      onClick={() => {
                        setSelectedMilestone(ms);
                        setActiveYear(ms.year);
                        playSuccessChime();
                      }}
                      className={`p-6 rounded-[32px] border-2 shadow-md transition-all duration-300 cursor-pointer relative group text-left ${cardStyle.card}`}
                    >
                      {/* Interactive flight overlay icon */}
                      <div className="absolute top-4 right-4 text-slate-300 opacity-20 group-hover:opacity-100 group-hover:text-indigo-400 transition-all duration-300">
                        <DynamicIcon name="PlaneTakeoff" size={16} />
                      </div>

                      {/* Header containing year badge & categories */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-extrabold tracking-widest uppercase">
                          {ms.year}
                        </span>
                        
                        <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wide rounded-md border uppercase ${getCategoryColor(ms.category)}`}>
                          {displayCategory}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-800 text-md tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                        {displayTitle}
                      </h3>
                      
                      {displaySubtitle && (
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                          {displaySubtitle}
                        </p>
                      )}

                      <p className={`text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed pl-2.5 font-sans ${cardStyle.borderLeft}`}>
                        "{displayNotes}"
                      </p>

                      {/* Timeline miniature achievements/events bullets list */}
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                        {ms.events.slice(0, 2).map((ev, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-slate-600">
                            <span className="w-1 h-1 bg-indigo-400 rounded-full flex-shrink-0" />
                            <span className="line-clamp-1">{lang === 'hi' && ms.eventsHi?.[i] ? ms.eventsHi[i] : ev}</span>
                          </div>
                        ))}
                      </div>

                      {/* Click to open details bar */}
                      <div className={`mt-4 pt-3 flex items-center justify-between text-[10px] font-extrabold uppercase ${cardStyle.accentText}`}>
                        <span>🚀 {lang === 'en' ? 'Open Year Dashboard' : 'वर्ष डैशबोर्ड खोलें'}</span>
                        <DynamicIcon name="ArrowRight" size={10} className="transform group-hover:translate-x-1.5 transition-transform" />
                      </div>

                    </motion.div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>

      {/* POPUP YEAR DASHBOARD: Immersive Dynamic Modal (Fully Bilingual) */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white rounded-[32px] shadow-2xl border border-indigo-100 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative text-left"
            >
              
              {/* Dynamic Header themed by Category */}
              <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden text-left">
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-0.5 bg-white/20 border border-white/30 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {getLocalizedCategory(selectedMilestone)}
                    </span>
                    <span className="text-white/80 text-[10px] font-mono">
                      {lang === 'en' ? 'Special Educator Log' : 'विशेष शिक्षक डायरी रिकॉर्ड'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight">
                    {lang === 'en' ? `Journey Dashboard for ${selectedMilestone.year}` : `${selectedMilestone.year} वर्ष का शैक्षणिक डैशबोर्ड`}
                  </h3>
                  <p className="text-indigo-100 text-xs md:text-sm mt-0.5 max-w-xl">
                    {lang === 'hi' && selectedMilestone.titleHi ? selectedMilestone.titleHi : selectedMilestone.title} &mdash; {lang === 'hi' && selectedMilestone.subtitleHi ? selectedMilestone.subtitleHi : (selectedMilestone.subtitle || 'Milestone')}
                  </p>
                </div>

                {/* Close Button top-right */}
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="md:relative absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full text-white cursor-pointer active:scale-95 transition-all"
                  title="Close Dashboard"
                >
                  <DynamicIcon name="X" size={18} />
                </button>
              </div>

              {/* Scrollable Contents Grid */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Events & Action steps */}
                  <div className="bg-white p-5 rounded-2xl border border-indigo-50/80 shadow-xs flex flex-col justify-between text-left">
                    <div>
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="bg-indigo-100 text-indigo-600 p-1 rounded-lg">
                          <DynamicIcon name="BookOpen" size={14} />
                        </span>
                        <span>{lang === 'en' ? 'Chronological Events' : 'मुख्य गतिविधियां और घटनाएं'}</span>
                      </h4>
                      <ul className="space-y-3.5">
                        {(lang === 'hi' && selectedMilestone.eventsHi ? selectedMilestone.eventsHi : selectedMilestone.events).map((ev, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-xs text-slate-600 leading-relaxed font-sans">{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Fun Teacher Note */}
                    <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/60">
                      <span className="text-[10px] font-extrabold font-mono tracking-wider text-indigo-600 uppercase block mb-1">
                        ✍️ {lang === 'en' ? 'Educator Personal Diary Notes' : 'गौतम सर की व्यक्तिगत डायरी टिप्पणी'}
                      </span>
                      <p className="text-xs text-indigo-900 leading-relaxed italic font-medium font-sans">
                        "{lang === 'hi' && selectedMilestone.notesHi ? selectedMilestone.notesHi : selectedMilestone.notes}"
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Achievements & Media */}
                  <div className="space-y-6 text-left">
                    
                    {/* Year Specific Achievements */}
                    {selectedMilestone.achievements && selectedMilestone.achievements.length > 0 && (
                      <div className="bg-white p-5 rounded-2xl border border-indigo-50/80 shadow-xs">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                          <span className="bg-yellow-100 text-yellow-600 p-1 rounded-lg">
                            <DynamicIcon name="Award" size={14} />
                          </span>
                          <span>{lang === 'en' ? 'Year Achievements' : 'वर्ष की विशेष प्राप्तियां'}</span>
                        </h4>
                        <div className="space-y-2.5">
                          {(lang === 'hi' && selectedMilestone.achievementsHi ? selectedMilestone.achievementsHi : selectedMilestone.achievements).map((ach, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-yellow-50/40 p-2.5 rounded-xl border border-yellow-100/60">
                              <DynamicIcon name="Sparkles" size={12} className="text-amber-500" />
                              <span className="text-xs text-slate-700 font-semibold">{ach}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Year Gallery from Google Drive */}
                    {selectedMilestone.photos && selectedMilestone.photos.length > 0 && (
                      <div className="bg-white p-5 rounded-2xl border border-indigo-50/80 shadow-xs">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2 pb-2 border-b border-slate-100">
                          <span className="bg-sky-100 text-sky-600 p-1 rounded-lg">
                            <DynamicIcon name="Image" size={14} />
                          </span>
                          <span>{lang === 'en' ? `Photo Album (${selectedMilestone.year})` : `छायाचित्र संकलन (${selectedMilestone.year})`}</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedMilestone.photos.map((ph, idx) => (
                            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-100 group">
                              <img
                                src={ph}
                                referrerPolicy="no-referrer"
                                alt="Milestone gallery view"
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 italic text-center font-mono">
                          Google Drive attached storage mirror
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick-scan Bar */}
              <div className="p-4 bg-slate-100 border-t border-slate-200/60 flex justify-between items-center px-6">
                <span className="text-xs text-slate-500 font-mono">
                  Chandrashekhar Gautam &bull; Academic Journey
                </span>
                
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all shadow-md shadow-indigo-100"
                >
                  {lang === 'en' ? 'Close Year View' : 'डैशबोर्ड बंद करें'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
