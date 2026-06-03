import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineMilestone, Publication, NewsCutting, LiveVideo, Achievement, SliderPhoto, SocialLink, HomepageConfig } from './types';
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
  const [activeTab, setActiveTab] = useState<'intro' | 'timeline' | 'publications' | 'news' | 'achievements'>('intro');
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Custom states for bilingual system & live visit counter
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [pageViews, setPageViews] = useState<number>(1215);

  // Initialize and retrieve data from LocalStorage
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

    // Milestones
    const cachedMilestones = localStorage.getItem('db_milestones');
    if (cachedMilestones) {
      setMilestones(JSON.parse(cachedMilestones));
    } else {
      setMilestones(INITIAL_TIMELINE_MILESTONES);
      localStorage.setItem('db_milestones', JSON.stringify(INITIAL_TIMELINE_MILESTONES));
    }

    // Publications
    const cachedPubs = localStorage.getItem('db_publications');
    if (cachedPubs) {
      setPublications(JSON.parse(cachedPubs));
    } else {
      setPublications(INITIAL_PUBLICATIONS);
      localStorage.setItem('db_publications', JSON.stringify(INITIAL_PUBLICATIONS));
    }

    // News
    const cachedNews = localStorage.getItem('db_news');
    if (cachedNews) {
      setNewsCuttings(JSON.parse(cachedNews));
    } else {
      setNewsCuttings(INITIAL_NEWS_CUTTINGS);
      localStorage.setItem('db_news', JSON.stringify(INITIAL_NEWS_CUTTINGS));
    }

    // Videos
    const cachedVideos = localStorage.getItem('db_videos');
    if (cachedVideos) {
      setVideos(JSON.parse(cachedVideos));
    } else {
      setVideos(INITIAL_VIDEOS);
      localStorage.setItem('db_videos', JSON.stringify(INITIAL_VIDEOS));
    }

    // Achievements
    const cachedAchievements = localStorage.getItem('db_achievements');
    if (cachedAchievements) {
      setAchievements(JSON.parse(cachedAchievements));
    } else {
      setAchievements(INITIAL_ACHIEVEMENTS);
      localStorage.setItem('db_achievements', JSON.stringify(INITIAL_ACHIEVEMENTS));
    }

    // Slide images
    const cachedSlides = localStorage.getItem('db_slides');
    if (cachedSlides) {
      setSlides(JSON.parse(cachedSlides));
    } else {
      setSlides(INITIAL_SLIDER_PHOTOS);
      localStorage.setItem('db_slides', JSON.stringify(INITIAL_SLIDER_PHOTOS));
    }

    // Social Links
    const cachedSocial = localStorage.getItem('db_social_links');
    if (cachedSocial) {
      setSocialLinks(JSON.parse(cachedSocial));
    } else {
      setSocialLinks(INITIAL_SOCIAL_LINKS);
      localStorage.setItem('db_social_links', JSON.stringify(INITIAL_SOCIAL_LINKS));
    }

    // Homepage Config
    const cachedHomepage = localStorage.getItem('db_homepage_config');
    if (cachedHomepage) {
      setHomepageConfig(JSON.parse(cachedHomepage));
    } else {
      setHomepageConfig(INITIAL_HOMEPAGE_CONFIG);
      localStorage.setItem('db_homepage_config', JSON.stringify(INITIAL_HOMEPAGE_CONFIG));
    }

    // Hearts/Appreciations
    const cachedAppr = localStorage.getItem('db_appreciation');
    if (cachedAppr) {
      setAppreciationCount(Number(cachedAppr));
    }

    setIsMuted(getMuteState());
  }, []);

  // Update helper triggers
  const handleUpdateMilestones = (updated: TimelineMilestone[]) => {
    setMilestones(updated);
    localStorage.setItem('db_milestones', JSON.stringify(updated));
  };

  const handleUpdatePublications = (updated: Publication[]) => {
    setPublications(updated);
    localStorage.setItem('db_publications', JSON.stringify(updated));
  };

  const handleUpdateNews = (updated: NewsCutting[]) => {
    setNewsCuttings(updated);
    localStorage.setItem('db_news', JSON.stringify(updated));
  };

  const handleUpdateVideos = (updated: LiveVideo[]) => {
    setVideos(updated);
    localStorage.setItem('db_videos', JSON.stringify(updated));
  };

  const handleUpdateAchievements = (updated: Achievement[]) => {
    setAchievements(updated);
    localStorage.setItem('db_achievements', JSON.stringify(updated));
  };

  const handleUpdateSlides = (updated: SliderPhoto[]) => {
    setSlides(updated);
    localStorage.setItem('db_slides', JSON.stringify(updated));
  };

  const handleUpdateSocialLinks = (updated: SocialLink[]) => {
    setSocialLinks(updated);
    localStorage.setItem('db_social_links', JSON.stringify(updated));
  };

  const handleUpdateHomepageConfig = (updated: HomepageConfig) => {
    setHomepageConfig(updated);
    localStorage.setItem('db_homepage_config', JSON.stringify(updated));
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
        <div className="lg:hidden bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-around">
          {[
            { id: 'intro', label: lang === 'en' ? 'Home' : 'मुख्य' },
            { id: 'timeline', label: lang === 'en' ? 'Timeline' : 'यात्रा' },
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
