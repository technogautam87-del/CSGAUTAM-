import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, collection, getDocsFromServer, deleteDoc } from 'firebase/firestore';
import { TimelineMilestone, Publication, NewsCutting, LiveVideo, Achievement, SliderPhoto, SocialLink, HomepageConfig, CustomPage, FeedbackItem } from './types';
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
import { DynamicPageRenderer } from './components/DynamicPageRenderer';
import { PoetryRahbarTab, DEFAULT_POEMS, PoemItem } from './components/PoetryRahbarTab';
import { Footer } from './components/Footer';
import { DynamicIcon } from './components/DynamicIcon';
import { DockMenu } from './components/DockMenu';
import { FeedbackWidget } from './components/FeedbackWidget';
import { toggleMute, playSuccessChime, playBubbleSound, getMuteState } from './audio';
import { TRANSLATIONS } from './translations';
import { GuidedTour } from './components/GuidedTour';
import { CinematicIntro } from './components/CinematicIntro';

const TAB_THEMES = {
  indigo: {
    textActive: 'text-indigo-600 bg-indigo-50/70',
    mobileBgActive: 'text-indigo-600 bg-indigo-100/50',
    hoverText: 'hover:text-indigo-600',
    selectionBg: 'selection:bg-indigo-500',
    ringIcon: 'ring-indigo-500/85',
  },
  teal: {
    textActive: 'text-teal-600 bg-teal-50/70',
    mobileBgActive: 'text-teal-600 bg-teal-100/50',
    hoverText: 'hover:text-teal-600',
    selectionBg: 'selection:bg-teal-500',
    ringIcon: 'ring-teal-500/85',
  },
  rose: {
    textActive: 'text-rose-600 bg-rose-50/70',
    mobileBgActive: 'text-rose-600 bg-rose-100/50',
    hoverText: 'hover:text-rose-600',
    selectionBg: 'selection:bg-rose-500',
    ringIcon: 'ring-rose-500/85',
  },
  emerald: {
    textActive: 'text-emerald-600 bg-emerald-50/70',
    mobileBgActive: 'text-emerald-600 bg-emerald-100/50',
    hoverText: 'hover:text-emerald-600',
    selectionBg: 'selection:bg-emerald-500',
    ringIcon: 'ring-emerald-500/85',
  },
  amber: {
    textActive: 'text-amber-600 bg-amber-50/70',
    mobileBgActive: 'text-amber-600 bg-amber-100/50',
    hoverText: 'hover:text-amber-600',
    selectionBg: 'selection:bg-amber-500',
    ringIcon: 'ring-amber-500/85',
  },
  violet: {
    textActive: 'text-violet-600 bg-violet-50/70',
    mobileBgActive: 'text-violet-600 bg-violet-100/50',
    hoverText: 'hover:text-violet-600',
    selectionBg: 'selection:bg-violet-500',
    ringIcon: 'ring-violet-500/85',
  }
};

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
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [rahbarPoems, setRahbarPoems] = useState<PoemItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  
  const [appreciationCount, setAppreciationCount] = useState<number>(128);
  const [activeTab, setActiveTab] = useState<'intro' | 'timeline' | 'publications' | 'news' | 'achievements' | 'gallery'>('intro');
  const [selectedTimelineYear, setSelectedTimelineYear] = useState<number | undefined>(undefined);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCinematic, setShowCinematic] = useState<boolean>(false);
  
  // Custom states for bilingual system & live visit counter
  const [lang, setLang] = useState<'en' | 'hi'>('hi');
  const [pageViews, setPageViews] = useState<number>(1215);

  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // Global Search System states
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);

  // Tab accent theme color configuration
  const [themeTabColor, setThemeTabColor] = useState<'indigo' | 'teal' | 'rose' | 'emerald' | 'amber' | 'violet'>(() => {
    return (localStorage.getItem('theme_tab_color') || 'indigo') as any;
  });

  // Security prevention state and listeners
  const [securityWarning, setSecurityWarning] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  useEffect(() => {
    if (securityWarning.show) {
      const timer = setTimeout(() => {
        setSecurityWarning({ show: false, msg: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [securityWarning.show]);

  useEffect(() => {
    const triggerWarning = (msgHi: string, msgEn: string) => {
      setSecurityWarning({
        show: true,
        msg: lang === 'hi' ? msgHi : msgEn
      });
      playBubbleSound();
    };

    const handleCopyCutPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );
      if (isInput) return;

      e.preventDefault();
      triggerWarning(
        'सुरक्षा कारणों से इस वेबसाइट पर कट, कॉपी और पेस्ट करना प्रतिबंधित है!',
        'Cut, copy, and paste are restricted on this website for security reasons!'
      );
    };

    const handleContextMenu = (e: MouseEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );
      if (isInput) return;

      e.preventDefault();
      triggerWarning(
        'सुरक्षा कारणों से राईट-क्लिक (कंटेक्स्ट मेनू) प्रतिबंधित है!',
        'Right-click context menu is restricted for security reasons!'
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );

      // Block Ctrl+C, Ctrl+V, Ctrl+X, Cmd+C, Cmd+V, Cmd+X
      const isCopyPasteKey = (e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x');
      if (isCopyPasteKey && !isInput) {
        e.preventDefault();
        triggerWarning(
          'शॉर्टकट द्वारा कॉपी, पेस्ट या कट करना प्रतिबंधित है!',
          'Copy, paste, or cut via keyboard shortcuts is restricted!'
        );
        return;
      }

      // Block print Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerWarning(
          'इस वेबसाइट को प्रिंट करना या पीडीएफ बनाना प्रतिबंधित है!',
          'Printing or generating PDF of this website is restricted!'
        );
        return;
      }

      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Cmd+Opt+I
      const isDevTools = e.key === 'F12' || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'I' || e.key === 'i'));
      
      if (isDevTools) {
        e.preventDefault();
        triggerWarning(
          'डेवलपर टूल्स का उपयोग सुरक्षा कारणों से प्रतिबंधित है!',
          'Access to Developer Tools is restricted for security reasons!'
        );
        return;
      }

      // Detect PrintScreen or Snipping tool keys
      if (e.key === 'PrintScreen' || e.key === 'PrtScn') {
        e.preventDefault();
        try {
          if (document.hasFocus()) {
            navigator.clipboard?.writeText?.(' ')?.catch?.(() => {});
          }
        } catch (err) {
          // ignore error
        }
        triggerWarning(
          'स्क्रीनशॉट लेना प्रतिबंधित है! क्लिपबोर्ड साफ़ कर दिया गया है।',
          'Screenshots are restricted! Clipboard has been cleared.'
        );
      }
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'hidden') {
        try {
          if (document.hasFocus()) {
            navigator.clipboard?.writeText?.(' ')?.catch?.(() => {});
          }
        } catch (err) {
          // ignore error
        }
      }
    };

    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('blur', handleVisibilityOrFocus);

    return () => {
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('blur', handleVisibilityOrFocus);
    };
  }, [lang]);

  // Comprehensive page and scrolling metrics tracker
  useEffect(() => {
    let timeout: any;
    
    const handleScrollAndMeasure = () => {
      setIsScrolling(true);
      
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      const docHeight = scrollHeight - clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(pct);

      // Compute page reading progress metrics
      const total = Math.max(1, Math.ceil(scrollHeight / (clientHeight || 1)));
      const current = Math.min(total, Math.max(1, Math.floor((scrollTop + (clientHeight / 2)) / (clientHeight || 1)) + 1));
      
      setTotalPages(total);
      setCurrentPage(current);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 400);
    };

    window.addEventListener('scroll', handleScrollAndMeasure, { passive: true });
    window.addEventListener('resize', handleScrollAndMeasure);

    // Initial measure
    handleScrollAndMeasure();

    return () => {
      window.removeEventListener('scroll', handleScrollAndMeasure);
      window.removeEventListener('resize', handleScrollAndMeasure);
      clearTimeout(timeout);
    };
  }, []);

  // Sync measurement on activeTab changes with a minor offset to allow DOM to paint
  useEffect(() => {
    const timer = setTimeout(() => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      const total = Math.max(1, Math.ceil(scrollHeight / (clientHeight || 1)));
      const current = Math.min(total, Math.max(1, Math.floor((scrollTop + (clientHeight / 2)) / (clientHeight || 1)) + 1));
      
      setTotalPages(total);
      setCurrentPage(current);
    }, 120);

    return () => clearTimeout(timer);
  }, [activeTab]);

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
    const parsedHomepage = cHomepage ? JSON.parse(cHomepage) : INITIAL_HOMEPAGE_CONFIG;
    if (parsedHomepage) {
      parsedHomepage.usePhotoInsteadOfAvatar = true;
    }
    setHomepageConfig(parsedHomepage);

    const cCustomPages = localStorage.getItem('db_custom_pages');
    let loadedPages: CustomPage[] = cCustomPages ? JSON.parse(cCustomPages) : [];
    const hasRahbar = loadedPages.some(p => p.id === 'rahbar');
    if (!hasRahbar) {
      const rahbarPage: CustomPage = {
        id: 'rahbar',
        title: 'Rahbar (Poetry)',
        titleHi: 'रहबर (काव्य संग्रह)',
        iconName: 'HeartHandshake',
        content: '# Rahbar Poetry Collection\nWelcome to my poetry sanctuary.',
        contentHi: '# रहबर काव्य संग्रह\nयहाँ मेरी कविताएँ और ग़ज़लें सहेजी हुई हैं।',
        isActive: true
      };
      loadedPages = [rahbarPage, ...loadedPages];
      localStorage.setItem('db_custom_pages', JSON.stringify(loadedPages));
    }
    setCustomPages(loadedPages);

    const cPoems = localStorage.getItem('db_poems');
    setRahbarPoems(cPoems ? JSON.parse(cPoems) : DEFAULT_POEMS);

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
        } else if (key === 'customPages' && Array.isArray(value)) {
          setCustomPages(value);
          localStorage.setItem('db_custom_pages', JSON.stringify(value));
        } else if (key === 'rahbar_poems' && Array.isArray(value)) {
          setRahbarPoems(value);
          localStorage.setItem('db_poems', JSON.stringify(value));
        }
      });
    }, (error) => {
      console.warn("Firestore collection subscription failed:", error);
    });

    const unsubscribeFeedbacks = onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
      const list: FeedbackItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || undefined,
          rating: typeof data.rating === 'number' ? data.rating : 5,
          message: data.message || '',
          date: data.date || ''
        });
      });
      // Sort by date descending
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setFeedbacks(list);
    }, (error) => {
      console.warn("Firestore feedbacks subscription failed:", error);
    });

    return () => {
      unsubscribe();
      unsubscribeFeedbacks();
    };
  }, []);

  // Helper to save server-side and Firestore immediately for true global updates
  const saveKeyToServer = async (key: string, value: any) => {
    // Recursively clean object to remove any keys with 'undefined' values (which crash Firestore)
    const cleanValue = (val: any): any => {
      if (Array.isArray(val)) {
        return val.map(item => cleanValue(item));
      } else if (val !== null && typeof val === 'object') {
        const cleaned: any = {};
        for (const k of Object.keys(val)) {
          if (val[k] !== undefined) {
            cleaned[k] = cleanValue(val[k]);
          }
        }
        return cleaned;
      }
      return val;
    };

    const sanitizedValue = cleanValue(value);

    // 1. Back up to the local express server JSON file (non-blocking)
    fetch('/api/global_data', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: sanitizedValue }),
    })
    .catch(err => console.warn("API Server fallback save failed (non-blocking):", err));

    // 2. Commit directly to global Cloud Firestore so every browser tab globally is updated in real-time
    try {
      await setDoc(doc(db, "global_data", key), { value: sanitizedValue });
      console.log(`Successfully persisted ${key} to Cloud Firestore globally!`);
    } catch (err) {
      console.error(`Error saving ${key} to Cloud Firestore:`, err);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'feedbacks', id));
      console.log(`Successfully deleted feedback document: ${id}`);
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  // Update helper triggers with server-side live sync
  const handleUpdateCustomPages = (updated: CustomPage[]) => {
    setCustomPages(updated);
    localStorage.setItem('db_custom_pages', JSON.stringify(updated));
    saveKeyToServer('customPages', updated);
  };

  const handleUpdatePoems = (updated: PoemItem[]) => {
    setRahbarPoems(updated);
    localStorage.setItem('db_poems', JSON.stringify(updated));
    saveKeyToServer('rahbar_poems', updated);
  };

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

  const handleExploreTimeline = () => {
    setSelectedTimelineYear(undefined);
    setActiveTab('timeline');
    // Wait for the tab to change and mount in the DOM for smooth scrolling
    setTimeout(() => {
      const element = document.getElementById('timeline-journey-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleExploreTimelineYear = (year: number) => {
    setSelectedTimelineYear(year);
    setActiveTab('timeline');
    // Wait for the tab to change and mount in the DOM for smooth scrolling
    setTimeout(() => {
      const element = document.getElementById('timeline-journey-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  const handleToggleMute = () => {
    const muted = toggleMute();
    setIsMuted(muted);
  };

  const handleForceRefresh = async (): Promise<boolean> => {
    try {
      console.log("Manually force-refreshing latest global state from Firebase backend...");
      const snapshot = await getDocsFromServer(collection(db, 'global_data'));
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
        } else if (key === 'customPages' && Array.isArray(value)) {
          setCustomPages(value);
          localStorage.setItem('db_custom_pages', JSON.stringify(value));
        } else if (key === 'rahbar_poems' && Array.isArray(value)) {
          setRahbarPoems(value);
          localStorage.setItem('db_poems', JSON.stringify(value));
        }
      });
      return true;
    } catch (err) {
      console.error("Force refresh from Firebase backend failed:", err);
      return false;
    }
  };

  // Compute live search results across Journey, Publications, and News Cuttings
  const cleanSearchQuery = globalSearchQuery.trim().toLowerCase();

  const matchedMilestones = cleanSearchQuery ? milestones.filter(ms => {
    const title = (lang === 'hi' && ms.titleHi ? ms.titleHi : ms.title).toLowerCase();
    const notes = (lang === 'hi' && ms.notesHi ? ms.notesHi : ms.notes || '').toLowerCase();
    const category = (lang === 'hi' && ms.categoryHi ? ms.categoryHi : ms.category).toLowerCase();
    return title.includes(cleanSearchQuery) || notes.includes(cleanSearchQuery) || category.includes(cleanSearchQuery);
  }) : [];

  const matchedPublications = cleanSearchQuery ? publications.filter(pub => {
    const title = (lang === 'hi' && pub.titleHi ? pub.titleHi : pub.title).toLowerCase();
    const desc = (lang === 'hi' && pub.descriptionHi ? pub.descriptionHi : pub.description || '').toLowerCase();
    const author = (pub.author || '').toLowerCase();
    return title.includes(cleanSearchQuery) || desc.includes(cleanSearchQuery) || author.includes(cleanSearchQuery);
  }) : [];

  const matchedNews = cleanSearchQuery ? newsCuttings.filter(news => {
    const title = (lang === 'hi' && news.titleHi ? news.titleHi : news.title).toLowerCase();
    const summary = (lang === 'hi' && news.summaryHi ? news.summaryHi : news.summary || '').toLowerCase();
    const source = (lang === 'hi' && news.sourceHi ? news.sourceHi : news.source || '').toLowerCase();
    return title.includes(cleanSearchQuery) || summary.includes(cleanSearchQuery) || source.includes(cleanSearchQuery);
  }) : [];

  const hasSearchResults = matchedMilestones.length > 0 || matchedPublications.length > 0 || matchedNews.length > 0;
  const totalMatches = matchedMilestones.length + matchedPublications.length + matchedNews.length;

  const handleSelectSearchResult = (targetTab: 'timeline' | 'publications' | 'news', targetId: string) => {
    setActiveTab(targetTab);
    setGlobalSearchQuery('');
    setShowMobileSearch(false);
    playSuccessChime();

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-indigo-500/80', 'ring-offset-2', 'outline-none');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-indigo-500/80', 'ring-offset-2');
        }, 2200);
      }
    }, 400);
  };

  const t = TRANSLATIONS[lang];
  const currentTabTheme = TAB_THEMES[themeTabColor] || TAB_THEMES.indigo;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-500 selection:text-white antialiased flex flex-col justify-between relative overflow-hidden">
      
      {/* 0. SEO & SOCIAL META TAGS (React Helmet) */}
      <Helmet>
        <title>
          {lang === 'hi'
            ? `${homepageConfig.teacherNameHi || 'चंद्रशेखर गौतम'} | ${homepageConfig.teacherRoleHi || 'समावेशी विशेष शिक्षक'}`
            : `${homepageConfig.teacherName || 'Chandrashekhar Gautam'} | ${homepageConfig.teacherRole || 'Inclusive Special Educator'}`
          }
        </title>
        <meta
          name="description"
          content={lang === 'hi'
            ? (homepageConfig.heroDescHi || `${homepageConfig.teacherNameHi || 'चंद्रशेखर गौतम'} की यात्रा, अनुसंधान, प्रकाशनों, और उनके द्वारा विकसित की गई विशेष खेल सामग्री (toys for learning) के बारे में जानें।`)
            : (homepageConfig.heroDesc || `Discover the inclusive teaching journey, publications, academic achievements, and customized educational toys developed by ${homepageConfig.teacherName || 'Chandrashekhar Gautam'}.`)
          }
        />
        <meta
          name="keywords"
          content={lang === 'hi'
            ? "चंद्रशेखर गौतम, विशेष शिक्षक, समावेशी शिक्षा, खेल द्वारा अधिगम, शिक्षण विधियां, अनुसंधान, विशेष विद्यालय, खिलौने, दिव्यांग बच्चे"
            : "Chandrashekhar Gautam, Special Educator, Inclusive Education, Toy-based learning, Pedagogy, Research, Inclusive Toys, Special Needs, Autism, ADHD, Teaching Aid"
          }
        />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta
          property="og:title"
          content={lang === 'hi'
            ? `${homepageConfig.teacherNameHi || 'चंद्रशेखर गौतम'} | ${homepageConfig.teacherRoleHi || 'समावेशी विशेष शिक्षक'}`
            : `${homepageConfig.teacherName || 'Chandrashekhar Gautam'} | ${homepageConfig.teacherRole || 'Inclusive Special Educator'}`
          }
        />
        <meta
          property="og:description"
          content={lang === 'hi'
            ? (homepageConfig.heroDescHi || `${homepageConfig.teacherNameHi || 'चंद्रशेखर गौतम'} की यात्रा और समावेशी शिक्षण विधियों के बारे में जानें।`)
            : (homepageConfig.heroDesc || `Discover the inclusive teaching journey and custom learning toys developed by ${homepageConfig.teacherName || 'Chandrashekhar Gautam'}.`)
          }
        />
        <meta
          property="og:image"
          content={homepageConfig.teacherImageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta
          name="twitter:title"
          content={lang === 'hi'
            ? `${homepageConfig.teacherNameHi || 'चंद्रशेखर गौतम'} | ${homepageConfig.teacherRoleHi || 'समावेशी विशेष शिक्षक'}`
            : `${homepageConfig.teacherName || 'Chandrashekhar Gautam'} | ${homepageConfig.teacherRole || 'Inclusive Special Educator'}`
          }
        />
        <meta
          name="twitter:description"
          content={lang === 'hi'
            ? (homepageConfig.heroDescHi || `${homepageConfig.teacherNameHi || 'चंद्रशेखर गौतम'} की यात्रा और समावेशी शिक्षण विधियों के बारे में जानें।`)
            : (homepageConfig.heroDesc || `Discover the inclusive teaching journey and custom learning toys developed by ${homepageConfig.teacherName || 'Chandrashekhar Gautam'}.`)
          }
        />
        <meta
          name="twitter:image"
          content={homepageConfig.teacherImageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'}
        />
      </Helmet>

      {/* Dynamic Security Policy Restriction Overlay Banner */}
      <AnimatePresence>
        {securityWarning.show && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md bg-rose-500/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-[0_15px_40px_rgba(244,63,94,0.35)] border border-rose-400 flex items-start gap-3.5 select-none"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg">
              🛡️
            </div>
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-100">
                {lang === 'hi' ? 'सुरक्षा चेतावनी' : 'Security Alert'}
              </h4>
              <p className="text-[12px] leading-relaxed font-semibold">
                {securityWarning.msg}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Space NASA Intro welcome console */}
      {showCinematic && (
        <CinematicIntro lang={lang} onEnter={() => {
          setShowCinematic(false);
          sessionStorage.setItem('has_seen_cinematic', 'true');
        }} />
      )}

      
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
              { id: 'achievements', label: t.achievements },
              ...customPages.filter(p => p.isActive).map(p => ({
                id: p.id,
                label: lang === 'hi' ? p.titleHi || p.title : p.title
              }))
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playBubbleSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                  activeTab === tab.id
                    ? currentTabTheme.textActive
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

            {/* New Desktop Search Input with real-time autocompleting results dropdown */}
            <div className="relative hidden lg:block w-40 xl:w-56 z-50">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DynamicIcon name="Search" size={13} />
              </div>
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search here...' : 'यहाँ खोजें...'}
                className="w-full text-xs pl-8.5 pr-8 py-2 rounded-xl border border-slate-200/80 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-sans outline-none font-medium text-slate-850"
              />
              {globalSearchQuery && (
                <button
                  onClick={() => setGlobalSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  title={lang === 'en' ? 'Clear' : 'साफ करें'}
                >
                  <DynamicIcon name="X" size={12} />
                </button>
              )}

              {/* Results Dropdown popup */}
              <AnimatePresence>
                {globalSearchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-[380px] sm:w-[410px] bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[460px] overflow-y-auto p-3.5 text-left font-sans"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-455">
                        🔎 {lang === 'en' ? 'Search results' : 'खोज परिणाम'}
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-black">
                        {totalMatches} {lang === 'en' ? 'found' : 'मिले'}
                      </span>
                    </div>

                    {!hasSearchResults ? (
                      <div className="py-8 text-center text-slate-400 flex flex-col items-center justify-center gap-1">
                        <span className="text-xl">💨</span>
                        <p className="text-xs font-bold">{lang === 'en' ? 'No matches found' : 'कोई परिणाम नहीं मिला'}</p>
                        <p className="text-[10px] text-slate-400">{lang === 'en' ? 'Try search keywords' : 'कीवर्ड बदल कर प्रयास करें'}</p>
                      </div>
                    ) : (
                      <div className="space-y-4 divide-y divide-slate-100/50">
                        {/* 1. Milestones */}
                        {matchedMilestones.length > 0 && (
                          <div className="pt-2 first:pt-0">
                            <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest pl-1 mb-1.5 block">
                              📅 {lang === 'en' ? 'Milestones' : 'मील के पत्थर'}
                            </span>
                            <div className="space-y-1">
                              {matchedMilestones.map(ms => (
                                <button
                                  key={ms.id}
                                  onClick={() => handleSelectSearchResult('timeline', `milestone-${ms.id}`)}
                                  className="w-full hover:bg-slate-50 focus:bg-slate-50 p-2 rounded-xl text-left transition-colors flex items-start gap-2.5 group cursor-pointer"
                                >
                                  <span className="text-xs font-black text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                                    {ms.year}
                                  </span>
                                  <div>
                                    <h5 className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                      {lang === 'hi' && ms.titleHi ? ms.titleHi : ms.title}
                                    </h5>
                                    <p className="text-[9px] text-slate-400 font-medium line-clamp-1">
                                      {lang === 'hi' && ms.notesHi ? ms.notesHi : ms.notes}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2. Publications */}
                        {matchedPublications.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest pl-1 mb-1.5 block">
                              📚 {lang === 'en' ? 'Publications' : 'प्रकाशन एवं सामग्री'}
                            </span>
                            <div className="space-y-1">
                              {matchedPublications.map(pub => (
                                <button
                                  key={pub.id}
                                  onClick={() => handleSelectSearchResult('publications', `publication-${pub.id}`)}
                                  className="w-full hover:bg-slate-50 focus:bg-slate-50 p-2 rounded-xl text-left transition-colors flex items-start gap-2.5 group cursor-pointer"
                                >
                                  <span className="text-xs bg-blue-50 text-blue-600 p-1 rounded-md flex-shrink-0">
                                    📖
                                  </span>
                                  <div>
                                    <h5 className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                      {lang === 'hi' && pub.titleHi ? pub.titleHi : pub.title}
                                    </h5>
                                    <p className="text-[9px] text-slate-400 font-medium line-clamp-1">
                                      {lang === 'hi' && pub.descriptionHi ? pub.descriptionHi : pub.description}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. News Articles */}
                        {matchedNews.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest pl-1 mb-1.5 block">
                              📰 {lang === 'en' ? 'News & Media' : 'मीडिया समाचार कतरनें'}
                            </span>
                            <div className="space-y-1">
                              {matchedNews.map(news => (
                                <button
                                  key={news.id}
                                  onClick={() => handleSelectSearchResult('news', `news-${news.id}`)}
                                  className="w-full hover:bg-slate-50 focus:bg-slate-50 p-2 rounded-xl text-left transition-colors flex items-start gap-2.5 group cursor-pointer"
                                >
                                  <span className="text-xs bg-rose-50 text-rose-600 p-1 rounded-md flex-shrink-0">
                                    📰
                                  </span>
                                  <div>
                                    <h5 className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                      {lang === 'hi' && news.titleHi ? news.titleHi : news.title}
                                    </h5>
                                    <p className="text-[9px] text-slate-400 font-medium line-clamp-1">
                                      {lang === 'hi' && news.summaryHi ? news.summaryHi : news.summary}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Area: Languages toggler, sound, admin lock */}
            <div className="flex items-center gap-2">
              {/* Mobile Search toggler button */}
              <button
                onClick={() => {
                  setShowMobileSearch(!showMobileSearch);
                  playBubbleSound();
                }}
                className="lg:hidden p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-855 cursor-pointer transition-all flex items-center justify-center"
                title={lang === 'en' ? 'Search' : 'खोजें'}
              >
                <DynamicIcon name={showMobileSearch ? 'X' : 'Search'} size={14} />
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
          <div className="lg:hidden bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-start overflow-x-auto gap-2 max-w-full">
            {[
              { id: 'intro', label: lang === 'en' ? 'Home' : 'मुख्य' },
              { id: 'timeline', label: lang === 'en' ? 'Timeline' : 'यात्रा' },
              { id: 'gallery', label: lang === 'en' ? 'Gallery' : 'गैलरी' },
              { id: 'publications', label: lang === 'en' ? 'Pubs' : 'पुस्तकें' },
              { id: 'news', label: lang === 'en' ? 'Media' : 'समाचार' },
              { id: 'achievements', label: lang === 'en' ? 'Awards' : 'पुरस्कार' },
              ...customPages.filter(p => p.isActive).map(p => ({
                id: p.id,
                label: lang === 'hi' ? p.titleHi || p.title : p.title
              }))
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playBubbleSound();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? currentTabTheme.mobileBgActive
                    : 'text-slate-500 hover:bg-slate-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Search Input and Results */}
          <AnimatePresence>
            {showMobileSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden bg-white border-t border-slate-100 overflow-hidden font-sans"
              >
                <div className="p-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <DynamicIcon name="Search" size={14} />
                    </div>
                    <input
                      type="text"
                      value={globalSearchQuery}
                      onChange={(e) => setGlobalSearchQuery(e.target.value)}
                      placeholder={lang === 'en' ? 'Search milestones, publications, news...' : 'खोजें मील के पत्थर, प्रकाशन, समाचार पत्र...'}
                      className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-medium text-slate-800"
                      autoFocus
                    />
                    {globalSearchQuery && (
                      <button
                        onClick={() => setGlobalSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        <DynamicIcon name="X" size={14} />
                      </button>
                    )}
                  </div>

                  {globalSearchQuery && (
                    <div className="mt-3 max-h-[300px] overflow-y-auto divide-y divide-slate-100/50">
                      <div className="flex justify-between items-center pb-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          {lang === 'en' ? 'Results' : 'खोज परिणाम'}
                        </span>
                        <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                          {totalMatches} {lang === 'en' ? 'found' : 'मिले'}
                        </span>
                      </div>

                      {!hasSearchResults ? (
                        <div className="py-6 text-center text-slate-455 text-xs font-bold">
                          {lang === 'en' ? 'No matches found' : 'कोई परिणाम नहीं मिला'}
                        </div>
                      ) : (
                        <div className="space-y-4 pb-2 text-left divide-y divide-slate-100/50">
                          {/* Milestones */}
                          {matchedMilestones.length > 0 && (
                            <div className="pt-2 first:pt-0">
                              <span className="text-[9px] font-extrabold text-teal-600 uppercase tracking-widest mb-1.5 block">
                                📅 {lang === 'en' ? 'Milestones' : 'मील के पत्थर'}
                              </span>
                              <div className="space-y-1">
                                {matchedMilestones.map(ms => (
                                  <button
                                    key={ms.id}
                                    onClick={() => handleSelectSearchResult('timeline', `milestone-${ms.id}`)}
                                    className="w-full p-2 hover:bg-slate-50 rounded-lg text-left flex items-start gap-2 cursor-pointer"
                                  >
                                    <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-1 py-0.5 rounded-md">
                                      {ms.year}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                                      {lang === 'hi' && ms.titleHi ? ms.titleHi : ms.title}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Publications */}
                          {matchedPublications.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-widest mb-1.5 block">
                                📚 {lang === 'en' ? 'Publications' : 'प्रकाशन'}
                              </span>
                              <div className="space-y-1">
                                {matchedPublications.map(pub => (
                                  <button
                                    key={pub.id}
                                    onClick={() => handleSelectSearchResult('publications', `publication-${pub.id}`)}
                                    className="w-full p-2 hover:bg-slate-50 rounded-lg text-left flex items-start gap-2 cursor-pointer"
                                  >
                                    <span className="text-[10px]">📖</span>
                                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                                      {lang === 'hi' && pub.titleHi ? pub.titleHi : pub.title}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* News */}
                          {matchedNews.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-widest mb-1.5 block">
                                📰 {lang === 'en' ? 'News' : 'समाचार पत्र'}
                              </span>
                              <div className="space-y-1">
                                {matchedNews.map(news => (
                                  <button
                                    key={news.id}
                                    onClick={() => handleSelectSearchResult('news', `news-${news.id}`)}
                                    className="w-full p-2 hover:bg-slate-50 rounded-lg text-left flex items-start gap-2 cursor-pointer"
                                  >
                                    <span className="text-[10px]">📰</span>
                                    <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                                      {lang === 'hi' && news.titleHi ? news.titleHi : news.title}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
                milestones={milestones}
                onExploreTimeline={handleExploreTimeline}
                onExploreTimelineYear={handleExploreTimelineYear}
                onExplorePublications={() => setActiveTab('publications')}
                onExploreNews={() => setActiveTab('news')}
                onExploreGallery={() => setActiveTab('gallery')}
                onExploreAchievements={() => setActiveTab('achievements')}
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
                initialActiveYear={selectedTimelineYear}
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

            {/* Dynamic customPages rendering container */}
            {customPages.filter(p => p.isActive).map((page) => {
              if (activeTab === page.id) {
                if (page.id === 'rahbar') {
                  return (
                    <PoetryRahbarTab
                      key={page.id}
                      poems={rahbarPoems}
                      onUpdatePoems={handleUpdatePoems}
                      lang={lang}
                      isAdminOpen={showAdminPanel}
                    />
                  );
                }
                return (
                  <DynamicPageRenderer
                    key={page.id}
                    page={page}
                    lang={lang}
                  />
                );
              }
              return null;
            })}
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
            customPages={customPages}
            poems={rahbarPoems}
            feedbacks={feedbacks}
            onDeleteFeedback={handleDeleteFeedback}
            onUpdateCustomPages={handleUpdateCustomPages}
            onUpdatePoems={handleUpdatePoems}
            activeThemeColor={themeTabColor}
            onThemeColorChange={(color) => {
              setThemeTabColor(color);
              localStorage.setItem('theme_tab_color', color);
            }}
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
            onForceRefresh={handleForceRefresh}
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
        isAdminUnlocked={showAdminPanel}
        lang={lang}
        pageViews={pageViews}
        socialLinks={socialLinks}
        onSelectTab={setActiveTab}
      />

      {/* 5. FLOATING FEEDBACK SYSTEM */}
      <FeedbackWidget lang={lang} />
    </div>
  );
}
