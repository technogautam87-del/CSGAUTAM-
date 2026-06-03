import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { TimelineMilestone, Publication, NewsCutting, LiveVideo, Achievement, SliderPhoto, SocialLink, HomepageConfig } from './types';
import { InteractiveAvatar } from './components/InteractiveAvatar';
import {
  INITIAL_TIMELINE_MILESTONES,
  INITIAL_PUBLICATIONS,
  INITIAL_NEWS_CUTTINGS,
  INITIAL_VIDEOS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SLIDER_PHOTOS,
  INITIAL_SOCIAL_LINKS,
  INITIAL_HOMEPAGE_CONFIG
} from './initialData';
import { IntroSection } from './components/IntroSection';
import { TimelineJourney } from './components/TimelineJourney';
import { PublicationsTab } from './components/PublicationsTab';
import { NewsAndVideos } from './components/NewsAndVideos';
import { AchievementsTab } from './components/AchievementsTab';
import { PhotoGalleryTab } from './components/PhotoGalleryTab';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { DynamicIcon } from './components/DynamicIcon';
import { toggleMute, playSuccessChime, playBubbleSound, getMuteState } from './audio';
import { TRANSLATIONS } from './translations';
import { GuidedTour } from './components/GuidedTour';

export default function App() {
  // LocalStorage Core Persistence States
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [newsCuttings, setNewsCuttings] = useState<NewsCutting[]>([]);
  const [videos, setVideos] = useState<LiveVideo[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [slides, setSlides] = useState<SliderPhoto[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(INITIAL_HOMEPAGE_CONFIG);
  
  const [appreciationCount, setAppreciationCount] = useState<number>(128);
  const [activeTab, setActiveTab] = useState<'intro' | 'timeline' | 'publications' | 'news' | 'achievements' | 'gallery'>('intro');
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Custom states for bilingual system & live visit counter
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [pageViews, setPageViews] = useState<number>(1215);

  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  useEffect(() => {
    let timeout: any;
    const handleScroll = () => {
      setIsScrolling(true);
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(pct);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Initialize and retrieve data from LocalStorage & Live Firebase Firestore Realtime Database
  useEffect(() => {
    // Language preference
    const cachedLang = localStorage.getItem('db_lang');
    if (cachedLang === 'en' || cachedLang === 'hi') {
      setLang(cachedLang);
    } else {
      setLang('hi'); // Hindi default
    }

    // Page views tracking increment
    const cachedViews = localStorage.getItem('db_page_views');
    const viewed = cachedViews ? Number(cachedViews) + 1 : 1245;
    setPageViews(viewed);
    localStorage.setItem('db_page_views', String(viewed));

    // Load initial fallbacks from LocalStorage or constants to avoid layout lag
    const cMilestones = localStorage.getItem('db_milestones');
    setMilestones(cMilestones ? JSON.parse(cMilestones) : INITIAL_TIMELINE_MILESTONES);

    const cPubs = localStorage.getItem('db_publications');
    setPublications(cPubs ? JSON.parse(cPubs) : INITIAL_PUBLICATIONS);

    const cNews = localStorage.getItem('db_news');
    setNewsCuttings(cNews ? JSON.parse(cNews) : INITIAL_NEWS_CUTTINGS);

    const cVideos = localStorage.getItem('db_videos');
    setVideos(cVideos ? JSON.parse(cVideos) : INITIAL_VIDEOS);

    const cAchievements = localStorage.getItem('db_achievements');
    setAchievements(cAchievements ? JSON.parse(cAchievements) : INITIAL_ACHIEVEMENTS);

    const cSlides = localStorage.getItem('db_slides');
    setSlides(cSlides ? JSON.parse(cSlides) : INITIAL_SLIDER_PHOTOS);

    const cSocial = localStorage.getItem('db_social_links');
    setSocialLinks(cSocial ? JSON.parse(cSocial) : INITIAL_SOCIAL_LINKS);

    const cHomepage = localStorage.getItem('db_homepage_config');
    setHomepageConfig(cHomepage ? JSON.parse(cHomepage) : INITIAL_HOMEPAGE_CONFIG);

    // Hearts/Appreciations
    const cachedAppr = localStorage.getItem('db_appreciation');
    if (cachedAppr) {
      setAppreciationCount(Number(cachedAppr));
    }
    
    setIsMuted(getMuteState());

    // Subscribe to global real-time cloud data updates from Firestore
    console.log("Subscribing to Firestore real-time updates for global educator profile...");
    const unsubscribe = onSnapshot(collection(db, 'global_data'), (snapshot) => {
      snapshot.forEach((doc) => {
        const key = doc.id;
        const data = doc.data();
        const value = data.value;
        if (!value) return;

        if (key === 'milestones' && Array.isArray(value)) {
          setMilestones(value);
          localStorage.setItem('db_milestones', JSON.stringify(value));
        } else if (key === 'publications' && Array.isArray(value)) {
          setPublications(value);
          localStorage.setItem('db_publications', JSON.stringify(value));
        } else if (key === 'newsCuttings' && Array.isArray(value)) {
          setNewsCuttings(value);
          localStorage.setItem('db_news', JSON.stringify(value));
        } else if (key === 'videos' && Array.isArray(value)) {
          setVideos(value);
          localStorage.setItem('db_videos', JSON.stringify(value));
        } else if (key === 'achievements' && Array.isArray(value)) {
          setAchievements(value);
          localStorage.setItem('db_achievements', JSON.stringify(value));
        } else if (key === 'slides' && Array.isArray(value)) {
          setSlides(value);
          localStorage.setItem('db_slides', JSON.stringify(value));
        } else if (key === 'socialLinks' && Array.isArray(value)) {
          setSocialLinks(value);
          localStorage.setItem('db_social_links', JSON.stringify(value));
        } else if (key === 'homepageConfig' && typeof value === 'object') {
          setHomepageConfig(value);
          localStorage.setItem('db_homepage_config', JSON.stringify(value));
        }
      });
    }, (error) => {
      console.warn("Firestore collection subscription failed:", error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Helper to save server-side and Firestore immediately for true global updates
  const saveKeyToServer = async (key: string, value: any) => {
    // 1. Back up to the local express server JSON file (non-blocking)
    fetch('/api/global_data', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    })
    .catch(err => console.warn("API Server fallback save failed (non-blocking):", err));

    // 2. Commit directly to global Cloud Firestore so every browser tab globally is updated in real-time
    try {
      await setDoc(doc(db, "global_data", key), { value });
      console.log(`Successfully persisted ${key} to Cloud Firestore globally!`);
    } catch (err) {
      console.error(`Error saving ${key} to Cloud Firestore:`, err);
    }
  };

  // Update helper triggers with server-side live sync
  const handleUpdateMilestones = (updated: TimelineMilestone[]) => {
    setMilestones(updated);
    localStorage.setItem('db_milestones', JSON.stringify(updated));
    saveKeyToServer('milestones', updated);
  };

  const handleUpdatePublications = (updated: Publication[]) => {
    setPublications(updated);
    localStorage.setItem('db_publications', JSON.stringify(updated));
    saveKeyToServer('publications', updated);
  };

  const handleUpdateNews = (updated: NewsCutting[]) => {
    setNewsCuttings(updated);
    localStorage.setItem('db_news', JSON.stringify(updated));
    saveKeyToServer('newsCuttings', updated);
  };

  const handleUpdateVideos = (updated: LiveVideo[]) => {
    setVideos(updated);
    localStorage.setItem('db_videos', JSON.stringify(updated));
    saveKeyToServer('videos', updated);
  };

  const handleUpdateAchievements = (updated: Achievement[]) => {
    setAchievements(updated);
    localStorage.setItem('db_achievements', JSON.stringify(updated));
    saveKeyToServer('achievements', updated);
  };

  const handleUpdateSlides = (updated: SliderPhoto[]) => {
    setSlides(updated);
    localStorage.setItem('db_slides', JSON.stringify(updated));
    saveKeyToServer('slides', updated);
  };

  const handleUpdateSocialLinks = (updated: SocialLink[]) => {
    setSocialLinks(updated);
    localStorage.setItem('db_social_links', JSON.stringify(updated));
    saveKeyToServer('socialLinks', updated);
  };

  const handleUpdateHomepageConfig = (updated: HomepageConfig) => {
    setHomepageConfig(updated);
    localStorage.setItem('db_homepage_config', JSON.stringify(updated));
    saveKeyToServer('homepageConfig', updated);
  };

  const handleSendAppreciation = () => {
    const updated = appreciationCount + 1;
    setAppreciationCount(updated);
    localStorage.setItem('db_appreciation', String(updated));
  };

  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white antialiased flex flex-col justify-between">
      
      {/* 1. TOP DUAL HEADER BAR (Navigation System) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Left Brand Area */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setActiveTab('intro');
              playSuccessChime();
            }}
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">🧩</span>
            <div>
              <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
                {lang === 'en' ? 'Chandrashekhar Gautam' : 'चंद्रशेखर गौतम'}
              </h1>
              <p className="text-[10px] text-teal-600 font-bold tracking-wide mt-0.5 uppercase">
                {t.specialTeacherHub}
              </p>
            </div>
          </div>

          {/* Central responsive links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'intro', label: t.welcome },
              { id: 'timeline', label: t.journey },
              { id: 'gallery', label: t.photoGallery },
              { id: 'publications', label: t.publications },
              { id: 'news', label: t.newsAndVideos },
              { id: 'achievements', label: t.achievements }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playBubbleSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600 bg-indigo-50/70'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Area: Languages toggler, sound, admin lock */}
          <div className="flex items-center gap-2">
            
            {/* Bilingual toggle button (English / हिंदी) */}
            <button
              onClick={() => {
                const nextLang = lang === 'en' ? 'hi' : 'en';
                setLang(nextLang);
                localStorage.setItem('db_lang', nextLang);
                playSuccessChime();
              }}
              className="px-3 py-2 text-xs font-bold border border-emerald-500/20 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
              title={lang === 'en' ? 'हिंदी भाषा में बदलें' : 'Switch to English'}
            >
              <span className="text-sm">🌐</span>
              <span className="text-[10px] uppercase font-bold tracking-wide">
                {lang === 'en' ? 'हिंदी' : 'English'}
              </span>
            </button>

            {/* Mute toggle button */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all cursor-pointer text-xs flex items-center gap-1.5 font-bold ${
                isMuted
                  ? 'bg-slate-50 border-slate-200 text-slate-400'
                  : 'bg-indigo-50 border-indigo-100 text-indigo-600'
              }`}
              title={isMuted ? 'Unmute Sensory Audio Feedback' : 'Mute Sensory Audio Feedback'}
            >
              <DynamicIcon name={isMuted ? 'VolumeX' : 'Volume2'} size={14} />
              <span className="hidden sm:inline text-[10px]">{isMuted ? t.muted : t.sensoryFx}</span>
            </button>

            {/* Admin toggle icon */}
            <button
              onClick={() => {
                setShowAdminPanel(true);
                playSuccessChime();
              }}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <DynamicIcon name="Lock" size={12} />
              <span className="hidden sm:inline">{lang === 'en' ? 'Admin' : 'एडमिन'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar snippet */}
        <div className="lg:hidden bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-around overflow-x-auto gap-2">
          {[
            { id: 'intro', label: lang === 'en' ? 'Home' : 'मुख्य' },
            { id: 'timeline', label: lang === 'en' ? 'Timeline' : 'यात्रा' },
            { id: 'gallery', label: lang === 'en' ? 'Gallery' : 'गैलरी' },
            { id: 'publications', label: lang === 'en' ? 'Pubs' : 'पुस्तकें' },
            { id: 'news', label: lang === 'en' ? 'Media' : 'समाचार' },
            { id: 'achievements', label: lang === 'en' ? 'Awards' : 'पुरस्कार' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                playBubbleSound();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'text-indigo-600 bg-indigo-100/50'
                  : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE BODY CONTAINER COMPONENT SLIDER WITH ANIMATE PRESENCE FADE */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            {activeTab === 'intro' && (
              <IntroSection
                slides={slides}
                onExploreTimeline={() => setActiveTab('timeline')}
                onSendAppreciation={handleSendAppreciation}
                appreciationCount={appreciationCount}
                lang={lang}
                homepageConfig={homepageConfig}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineJourney
                milestones={milestones}
                onUpdateMilestones={handleUpdateMilestones}
                lang={lang}
              />
            )}

            {activeTab === 'publications' && (
              <PublicationsTab
                publications={publications}
                lang={lang}
              />
            )}

            {activeTab === 'news' && (
              <NewsAndVideos
                newsCuttings={newsCuttings}
                videos={videos}
                lang={lang}
              />
            )}

            {activeTab === 'gallery' && (
              <PhotoGalleryTab
                photos={slides}
                lang={lang}
              />
            )}

            {activeTab === 'achievements' && (
              <AchievementsTab
                achievements={achievements}
                lang={lang}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. ADMIN PANEL SCREEN TRIGGER DRAWER OVERLAY */}
      <AnimatePresence>
        {showAdminPanel && (
          <AdminPanel
            milestones={milestones}
            publications={publications}
            newsCuttings={newsCuttings}
            videos={videos}
            achievements={achievements}
            slides={slides}
            socialLinks={socialLinks}
            homepageConfig={homepageConfig}
            onUpdateMilestones={handleUpdateMilestones}
            onUpdatePublications={handleUpdatePublications}
            onUpdateNewsCuttings={handleUpdateNews}
            onUpdateVideos={handleUpdateVideos}
            onUpdateAchievements={handleUpdateAchievements}
            onUpdateSlides={handleUpdateSlides}
            onUpdateSocialLinks={handleUpdateSocialLinks}
            onUpdateHomepageConfig={handleUpdateHomepageConfig}
            onClose={() => {
              setShowAdminPanel(false);
              playBubbleSound();
            }}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* 3.1 GUIDED TOUR AND WELCOME MODAL CONTROLLER OVERLAYS */}
      <GuidedTour
        lang={lang}
        milestones={milestones}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 3.2 SCROLL-PAL WALKING FLOATING KUNG-FU PANDA COMPANION */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', delay: 1 }}
          whileHover={{ scale: 1.1, translateY: -4 }}
          className="relative bg-white/95 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-2xl flex items-center justify-center cursor-pointer group"
        >
          {/* Circular progress bar around scroll pal */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none scale-102">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke="#f1f5f9"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              stroke="url(#scrollGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * scrollPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
            <defs>
              <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>

          {/* Interactive Panda Companion */}
          <div className="w-18 h-20 flex items-center justify-center overflow-visible relative">
            <InteractiveAvatar
              pose={isScrolling ? 'walking' : 'stance'}
              size={64}
              lang={lang}
              className="transform -translate-y-1.5"
            />
          </div>

          {/* Mini Percentage Floating Tag */}
          <span className="absolute -bottom-1 bg-gradient-to-r from-red-600 to-yellow-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full border border-white shadow-xs leading-none">
            {Math.round(scrollPercent)}%
          </span>

          {/* Floating Action Hint Bubble on Hover */}
          <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md whitespace-nowrap pointer-events-none border border-white/10">
            <span>{lang === 'en' ? 'Click to hit!' : 'मुक्का मारने के लिए क्लिक करें!'} 🥋🐼</span>
          </div>
        </motion.div>
      </div>

      {/* 4. FOOTER CREDENTIALS & COLORFUL LIVE VISITOR COUNTER */}
      <Footer
        onToggleAdmin={() => setShowAdminPanel(!showAdminPanel)}
        isAdminUnlocked={false}
        lang={lang}
        pageViews={pageViews}
        socialLinks={socialLinks}
      />
    </div>
  );
}
