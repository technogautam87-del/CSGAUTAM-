import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsCutting, LiveVideo } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound } from '../audio';
import { TRANSLATIONS } from '../translations';

interface NewsAndVideosProps {
  newsCuttings: NewsCutting[];
  videos: LiveVideo[];
  lang?: 'en' | 'hi';
}

export const NewsAndVideos: React.FC<NewsAndVideosProps> = ({
  newsCuttings,
  videos,
  lang = 'hi',
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'news' | 'videos'>('news');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  return (
    <div className="py-8 bg-white max-w-6xl mx-auto px-4 animate-fade-in">
      
      {/* Tab Header and Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-left">
          <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-rose-100 shadow-xs inline-block mb-3">
            {lang === 'en' ? 'Media & press Features' : 'प्रेस गैलरी और शिक्षण प्रदर्शन'}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {t.newsVideosTitle}
          </h2>
          <p className="text-slate-500 text-sm mt-1 max-w-xl font-sans">
            {t.newsVideosSubtitle}
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setActiveMediaTab('news');
              playBubbleSound();
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMediaTab === 'news'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <DynamicIcon name="FileText" size={14} />
            <span>{lang === 'en' ? 'News Clippings' : 'समाचार पत्र कतरनें'}</span>
          </button>
          <button
            onClick={() => {
              setActiveMediaTab('videos');
              playBubbleSound();
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMediaTab === 'videos'
                ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <DynamicIcon name="Video" size={14} />
            <span>{lang === 'en' ? 'Interactive Videos' : 'क्लासरूम लाइव वीडियो'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeMediaTab === 'news' ? (
          /* TAB 1: News Cuttings Section */
          <motion.div
            key="news-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left"
          >
            {newsCuttings.map((news) => {
              const displayTitle = lang === 'hi' && news.titleHi ? news.titleHi : news.title;
              const displaySummary = lang === 'hi' && news.summaryHi ? news.summaryHi : news.summary;
              const displaySource = lang === 'hi' && news.sourceHi ? news.sourceHi : news.source;

              return (
                <motion.div
                  key={news.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md shadow-slate-100/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-left flex flex-col justify-between"
                >
                  <div>
                    {/* Photo container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img
                        src={news.imageUrl}
                        referrerPolicy="no-referrer"
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[9px] font-bold text-indigo-600 shadow-xs border">
                        📰 {displaySource}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5">
                      <span className="text-[10px] font-mono font-medium text-slate-400">
                        {lang === 'en' ? 'Published on' : 'प्रकाशन तिथि:'} {news.date}
                      </span>
                      <h3 className="font-bold text-sm text-slate-800 leading-snug mt-1.5 hover:text-indigo-600 transition-colors">
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2.5 leading-relaxed font-sans line-clamp-4">
                        {displaySummary}
                      </p>
                    </div>
                  </div>

                  {/* Dummy trigger */}
                  <div className="p-5 pt-0 mt-2">
                    <button
                      onClick={() => playBubbleSound()}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-[10px] rounded-xl border border-slate-200/50 transition-colors cursor-pointer"
                    >
                      {lang === 'en' ? 'Read Clippings Article Note' : 'समाचार लेख विवरण / टिप्पणी देखें'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* TAB 2: Live Videos with alternating layout rules */
          <motion.div
            key="videos-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {videos.map((vid, idx) => {
              const isRightVideo = idx % 2 === 0;
              const isPlaying = playingVideoId === vid.id;
              
              const displayTitle = lang === 'hi' && vid.titleHi ? vid.titleHi : vid.title;
              const displayDesc = lang === 'hi' && vid.descriptionHi ? vid.descriptionHi : vid.description;
              const displayBadge = lang === 'hi' && vid.badgeHi ? vid.badgeHi : (lang === 'hi' ? 'विशेष वर्ग' : vid.badge);

              return (
                <div
                  key={vid.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50/50 p-6 md:p-8 rounded-[32px] border border-slate-100 text-left ${
                    isRightVideo ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  
                  {/* Text Column */}
                  <div className={`md:col-span-5 flex flex-col justify-center text-left ${
                    isRightVideo ? 'order-1' : 'order-1 md:order-2'
                  }`}>
                    {displayBadge && (
                      <span className="self-start px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg tracking-wide uppercase mb-3">
                        {displayBadge}
                      </span>
                    )}
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug tracking-tight">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium font-mono mt-1 italic">
                      {lang === 'en' ? 'Special Classroom Clip No.' : 'विशेष प्रशिक्षण प्रदर्शन क्लिप संख्या'} {idx + 1}
                    </p>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed font-sans">
                      {displayDesc}
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => {
                          setPlayingVideoId(isPlaying ? null : vid.id);
                          playBubbleSound();
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          isPlaying
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                        }`}
                      >
                        <DynamicIcon name={isPlaying ? 'X' : 'Video'} size={14} />
                        <span>{isPlaying ? (lang === 'en' ? 'Close Classroom Clip' : 'प्रदर्शन बंद करें') : (lang === 'en' ? 'Play Live Presentation' : 'वीडियो चालू करें')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Column */}
                  <div className={`md:col-span-7 ${
                    isRightVideo ? 'order-2' : 'order-2 md:order-1'
                  }`}>
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl shadow-indigo-100/20 group">
                      
                      {isPlaying ? (
                        <iframe
                          src={vid.videoUrl}
                          title={displayTitle}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        /* Preflight Video Poster Card */
                        <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center relative">
                          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 opacity-90" />
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                          <div className="z-10 text-center px-6">
                            <span className="text-3xl">🧩</span>
                            <h4 className="text-white text-xs font-bold mt-2 font-mono tracking-wider uppercase opacity-80">
                              {lang === 'en' ? 'Instructional Demonstration' : 'प्रशिक्षण व अधिगम प्रदर्शन'}
                            </h4>
                            <p className="text-indigo-200 text-[10px] mt-1 italic max-w-sm font-sans">
                              {lang === 'en' ? '"Watch interactive tactile guides supporting special child development."' : '"दिव्यांग बच्चों के सर्वांगीण विकास के लिए निर्मित विशेष शिक्षण सामग्री का अभ्यास देखें।"'}
                            </p>
                          </div>

                          {/* Pulsing play button */}
                          <button
                            onClick={() => {
                              setPlayingVideoId(vid.id);
                              playBubbleSound();
                            }}
                            className="absolute z-20 w-16 h-16 rounded-full bg-white hover:bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 cursor-pointer transition-all border-4 border-indigo-100/50"
                          >
                            <span className="text-lg translate-x-0.5">▶</span>
                          </button>

                          <span className="absolute bottom-4 right-4 z-10 text-[9px] font-mono text-white/50 bg-black/40 px-2 py-0.5 rounded-md">
                            {lang === 'en' ? 'Click to play demo' : 'प्ले करने के लिए दबाएं'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
