import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineMilestone, Publication, NewsCutting, LiveVideo, Achievement, SliderPhoto, SocialLink, HomepageConfig } from '../types';
import { DynamicIcon, AVAILABLE_ACCENT_ICONS } from './DynamicIcon';
import { playBubbleSound, playSuccessChime, playKeyTap, playErrorAlert } from '../audio';

interface AdminPanelProps {
  milestones: TimelineMilestone[];
  publications: Publication[];
  newsCuttings: NewsCutting[];
  videos: LiveVideo[];
  achievements: Achievement[];
  slides: SliderPhoto[];
  socialLinks: SocialLink[];
  homepageConfig: HomepageConfig;

  onUpdateMilestones: (updated: TimelineMilestone[]) => void;
  onUpdatePublications: (updated: Publication[]) => void;
  onUpdateNewsCuttings: (updated: NewsCutting[]) => void;
  onUpdateVideos: (updated: LiveVideo[]) => void;
  onUpdateAchievements: (updated: Achievement[]) => void;
  onUpdateSlides: (updated: SliderPhoto[]) => void;
  onUpdateSocialLinks: (updated: SocialLink[]) => void;
  onUpdateHomepageConfig: (updated: HomepageConfig) => void;

  onClose: () => void;
  lang?: 'en' | 'hi';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  milestones,
  publications,
  newsCuttings,
  videos,
  achievements,
  slides,
  socialLinks = [],
  homepageConfig,
  onUpdateMilestones,
  onUpdatePublications,
  onUpdateNewsCuttings,
  onUpdateVideos,
  onUpdateAchievements,
  onUpdateSlides,
  onUpdateSocialLinks,
  onUpdateHomepageConfig,
  onClose,
  lang = 'hi',
}) => {
  // Screen lock state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Section selectors
  const [activeAdminTab, setActiveAdminTab] = useState<'homepage' | 'timeline' | 'achievements' | 'publications' | 'slides' | 'social'>('homepage');

  // Form states - Homepage & Pedagogy Cards Editing
  const [heroTitle, setHeroTitle] = useState(homepageConfig.heroTitle || '');
  const [heroTitleHi, setHeroTitleHi] = useState(homepageConfig.heroTitleHi || '');
  const [heroDesc, setHeroDesc] = useState(homepageConfig.heroDesc || '');
  const [heroDescHi, setHeroDescHi] = useState(homepageConfig.heroDescHi || '');

  const [teacherName, setTeacherName] = useState(homepageConfig.teacherName || '');
  const [teacherNameHi, setTeacherNameHi] = useState(homepageConfig.teacherNameHi || '');
  const [teacherRole, setTeacherRole] = useState(homepageConfig.teacherRole || '');
  const [teacherRoleHi, setTeacherRoleHi] = useState(homepageConfig.teacherRoleHi || '');
  const [teacherBio, setTeacherBio] = useState(homepageConfig.teacherBio || '');
  const [teacherBioHi, setTeacherBioHi] = useState(homepageConfig.teacherBioHi || '');
  const [teacherImageUrl, setTeacherImageUrl] = useState(homepageConfig.teacherImageUrl || '');

  const [card1Title, setCard1Title] = useState(homepageConfig.card1Title || '');
  const [card1TitleHi, setCard1TitleHi] = useState(homepageConfig.card1TitleHi || '');
  const [card1Desc, setCard1Desc] = useState(homepageConfig.card1Desc || '');
  const [card1DescHi, setCard1DescHi] = useState(homepageConfig.card1DescHi || '');
  const [card1Color, setCard1Color] = useState(homepageConfig.card1Color || 'rose');
  const [card1Emoji, setCard1Emoji] = useState(homepageConfig.card1Emoji || '🧠');

  const [card2Title, setCard2Title] = useState(homepageConfig.card2Title || '');
  const [card2TitleHi, setCard2TitleHi] = useState(homepageConfig.card2TitleHi || '');
  const [card2Desc, setCard2Desc] = useState(homepageConfig.card2Desc || '');
  const [card2DescHi, setCard2DescHi] = useState(homepageConfig.card2DescHi || '');
  const [card2Color, setCard2Color] = useState(homepageConfig.card2Color || 'amber');
  const [card2Emoji, setCard2Emoji] = useState(homepageConfig.card2Emoji || '❤️');

  const [card3Title, setCard3Title] = useState(homepageConfig.card3Title || '');
  const [card3TitleHi, setCard3TitleHi] = useState(homepageConfig.card3TitleHi || '');
  const [card3Desc, setCard3Desc] = useState(homepageConfig.card3Desc || '');
  const [card3DescHi, setCard3DescHi] = useState(homepageConfig.card3DescHi || '');
  const [card3Color, setCard3Color] = useState(homepageConfig.card3Color || 'teal');
  const [card3Emoji, setCard3Emoji] = useState(homepageConfig.card3Emoji || '🤝');

  // Form states - Timeline Milestone Add
  const [newYear, setNewYear] = useState<number>(2027);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Birth' | 'Education' | 'Career' | 'Achievement' | 'Special Education'>('Special Education');
  const [newEventsText, setNewEventsText] = useState<string>('');
  const [newNotesText, setNewNotesText] = useState<string>('');
  const [newPhotosText, setNewPhotosText] = useState<string>('');

  // Form states - Achievements Add
  const [newAchTitle, setNewAchTitle] = useState<string>('');
  const [newAchCategory, setNewAchCategory] = useState<string>('');
  const [newAchIssuer, setNewAchIssuer] = useState<string>('');
  const [newAchDate, setNewAchDate] = useState<string>('2026-06-03');
  const [newAchDesc, setNewAchDesc] = useState<string>('');
  const [newAchIcon, setNewAchIcon] = useState<string>('Award');
  const [newAchLinkUrl, setNewAchLinkUrl] = useState<string>('');
  const [newAchLinkText, setNewAchLinkText] = useState<string>('');

  // Form states - Publications Add
  const [newPubTitle, setNewPubTitle] = useState<string>('');
  const [newPubType, setNewPubType] = useState<'article' | 'pdf' | 'notes' | 'departmental'>('article');
  const [newPubDesc, setNewPubDesc] = useState<string>('');
  const [newPubLink, setNewPubLink] = useState<string>('');
  const [newPubDate, setNewPubDate] = useState<string>('2026-06-03');
  const [newPubAuthor, setNewPubAuthor] = useState<string>('Chandrashekhar Gautam');

  // Form states - Social Links Add
  const [newSocName, setNewSocName] = useState<string>('');
  const [newSocUrl, setNewSocUrl] = useState<string>('');
  const [newSocIcon, setNewSocIcon] = useState<string>('Globe');
  const [newSocCategory, setNewSocCategory] = useState<string>('Social Network');
  const [newSlideUrl, setNewSlideUrl] = useState<string>('');
  const [newSlideCaption, setNewSlideCaption] = useState<string>('');
  const [newSlideCaptionHi, setNewSlideCaptionHi] = useState<string>('');
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editingSlideUrl, setEditingSlideUrl] = useState<string>('');
  const [editingSlideCaption, setEditingSlideCaption] = useState<string>('');
  const [editingSlideCaptionHi, setEditingSlideCaptionHi] = useState<string>('');

  // Keypad processing
  const handleKeyPress = (num: string) => {
    if (pinCode.length >= 4) return;
    playKeyTap();
    setPinError(false);
    const updated = pinCode + num;
    setPinCode(updated);

    // Auto check lock code upon hitting 4 digits length
    if (updated.length === 4) {
      if (updated === '2026') {
        setTimeout(() => {
          setIsAuthenticated(true);
          playSuccessChime();
        }, 300);
      } else {
        setTimeout(() => {
          setPinError(true);
          setPinCode('');
          playErrorAlert();
        }, 300);
      }
    }
  };

  const handleClear = () => {
    playKeyTap();
    setPinCode('');
    setPinError(false);
  };

  // Saved success state for Homepage
  const [isHomeConfigSaved, setIsHomeConfigSaved] = useState<boolean>(false);

  const handleSaveHomepageConfigAction = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HomepageConfig = {
      heroTitle,
      heroTitleHi,
      heroDesc,
      heroDescHi,
      teacherName,
      teacherNameHi,
      teacherRole,
      teacherRoleHi,
      teacherBio,
      teacherBioHi,
      teacherImageUrl,
      card1Title,
      card1TitleHi,
      card1Desc,
      card1DescHi,
      card1Color,
      card1Emoji,
      card2Title,
      card2TitleHi,
      card2Desc,
      card2DescHi,
      card2Color,
      card2Emoji,
      card3Title,
      card3TitleHi,
      card3Desc,
      card3DescHi,
      card3Color,
      card3Emoji,
    };
    onUpdateHomepageConfig(updated);
    playSuccessChime();
    setIsHomeConfigSaved(true);
    setTimeout(() => setIsHomeConfigSaved(false), 3000);
  };

  // Add Handlers
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const added: TimelineMilestone = {
      id: 'm-' + Date.now(),
      year: Number(newYear),
      title: newTitle,
      subtitle: newSubtitle || undefined,
      category: newCategory,
      events: newEventsText.split('\n').filter(line => line.trim() !== ''),
      photos: newPhotosText.trim() ? [newPhotosText.trim()] : ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'],
      notes: newNotesText || 'Standard diary records.',
      achievements: []
    };

    onUpdateMilestones([...milestones, added]);
    playSuccessChime();

    // Reset Fields
    setNewTitle('');
    setNewSubtitle('');
    setNewEventsText('');
    setNewNotesText('');
    setNewPhotosText('');
  };

  const handleDeleteMilestone = (id: string) => {
    const remaining = milestones.filter(m => m.id !== id);
    onUpdateMilestones(remaining);
    playBubbleSound();
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;

    const added: Achievement = {
      id: 'ach-' + Date.now(),
      title: newAchTitle,
      category: newAchCategory || 'General Recognition',
      issuer: newAchIssuer || 'Education Board',
      date: newAchDate,
      description: newAchDesc,
      iconName: newAchIcon,
      linkUrl: newAchLinkUrl ? newAchLinkUrl.trim() : undefined,
      linkText: newAchLinkText ? newAchLinkText.trim() : undefined,
      linkTextHi: newAchLinkText ? newAchLinkText.trim() : undefined
    };

    onUpdateAchievements([...achievements, added]);
    playSuccessChime();

    // Reset
    setNewAchTitle('');
    setNewAchCategory('');
    setNewAchIssuer('');
    setNewAchDesc('');
    setNewAchLinkUrl('');
    setNewAchLinkText('');
  };

  const handleDeleteAchievement = (id: string) => {
    const remaining = achievements.filter(a => a.id !== id);
    onUpdateAchievements(remaining);
    playBubbleSound();
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle.trim()) return;

    const added: Publication = {
      id: 'pub-' + Date.now(),
      title: newPubTitle,
      type: newPubType,
      description: newPubDesc,
      link: newPubLink || 'https://example.com/resources',
      date: newPubDate,
      author: newPubAuthor || 'Chandrashekhar Gautam'
    };

    onUpdatePublications([...publications, added]);
    playSuccessChime();

    setNewPubTitle('');
    setNewPubDesc('');
    setNewPubLink('');
  };

  const handleDeletePublication = (id: string) => {
    onUpdatePublications(publications.filter(p => p.id !== id));
    playBubbleSound();
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideUrl.trim() || !newSlideCaption.trim()) return;

    const added: SliderPhoto = {
      id: 'slide-' + Date.now(),
      url: newSlideUrl,
      caption: newSlideCaption,
      captionHi: newSlideCaptionHi || newSlideCaption
    };

    onUpdateSlides([...slides, added]);
    playSuccessChime();

    setNewSlideUrl('');
    setNewSlideCaption('');
    setNewSlideCaptionHi('');
  };

  const handleStartEditSlide = (slide: SliderPhoto) => {
    setEditingSlideId(slide.id);
    setEditingSlideUrl(slide.url);
    setEditingSlideCaption(slide.caption);
    setEditingSlideCaptionHi(slide.captionHi || '');
    playBubbleSound();
  };

  const handleSaveEditedSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlideId || !editingSlideUrl.trim() || !editingSlideCaption.trim()) return;

    const updated = slides.map(s => {
      if (s.id === editingSlideId) {
        return {
          ...s,
          url: editingSlideUrl,
          caption: editingSlideCaption,
          captionHi: editingSlideCaptionHi || editingSlideCaption
        };
      }
      return s;
    });

    onUpdateSlides(updated);
    playSuccessChime();

    // Reset editing states
    setEditingSlideId(null);
    setEditingSlideUrl('');
    setEditingSlideCaption('');
    setEditingSlideCaptionHi('');
  };

  const handleCancelEditSlide = () => {
    setEditingSlideId(null);
    setEditingSlideUrl('');
    setEditingSlideCaption('');
    setEditingSlideCaptionHi('');
    playBubbleSound();
  };

  const handleDeleteSlide = (id: string) => {
    onUpdateSlides(slides.filter(s => s.id !== id));
    if (editingSlideId === id) {
      setEditingSlideId(null);
    }
    playBubbleSound();
  };

  const handleAddSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocName.trim() || !newSocUrl.trim()) return;

    const added: SocialLink = {
      id: 'soc-' + Date.now(),
      name: newSocName.trim(),
      url: newSocUrl.trim(),
      iconName: newSocIcon,
      category: newSocCategory.trim() || 'Social Network'
    };

    onUpdateSocialLinks([...socialLinks, added]);
    playSuccessChime();

    // Reset
    setNewSocName('');
    setNewSocUrl('');
    setNewSocIcon('Globe');
  };

  const handleDeleteSocialLink = (id: string) => {
    const remaining = socialLinks.filter(s => s.id !== id);
    onUpdateSocialLinks(remaining);
    playBubbleSound();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        
        {/* VIEW A: SECURE LOCK KEYPAD SCREEN */}
        {!isAuthenticated ? (
          <motion.div
            key="lock-screen"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white p-8 rounded-[40px] shadow-2xl border border-indigo-100 max-w-sm w-full text-center relative"
          >
            {/* Absolute close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 cursor-pointer"
            >
              <DynamicIcon name="X" size={16} />
            </button>

            {/* Header Identity */}
            <div className="mb-6 flex flex-col items-center">
              <span className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-100 mb-3 animate-bounce">
                🔑
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Admin Console Access
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
                Please enter the secure numeric system code to manage records.
              </p>
            </div>

            {/* Bubble Dots Password Indicator (NO PLAIN PASSWORD TEXT VISIBLE) */}
            <div className={`flex justify-center gap-4 py-4 mb-4 rounded-3xl ${pinError ? 'animate-shake' : ''}`}>
              {[0, 1, 2, 3].map((dotIdx) => {
                const filled = pinCode.length > dotIdx;
                return (
                  <motion.div
                    key={dotIdx}
                    animate={{
                      scale: filled ? [1, 1.3, 1.1] : 1,
                      backgroundColor: pinError ? '#f87171' : filled ? '#6366f1' : '#e2e8f0'
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-4.5 h-4.5 rounded-full border border-slate-100 shadow-inner"
                  />
                );
              })}
            </div>

            {/* Error alerts */}
            {pinError && (
              <span className="text-xs text-rose-500 font-extrabold font-mono uppercase block mb-3 animate-pulse">
                Verification Failed! Try Again.
              </span>
            )}

            {/* Secure Keys Grid (Tactile Grid Block) */}
            <div className="grid grid-cols-3 gap-3 mb-4 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((numKey) => (
                <button
                  key={numKey}
                  onClick={() => handleKeyPress(numKey)}
                  className="w-16 h-16 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-100 hover:border-indigo-300 shadow-xs cursor-pointer font-extrabold text-lg flex items-center justify-center active:scale-90 transition-all"
                >
                  {numKey}
                </button>
              ))}
              
              {/* Reset key */}
              <button
                onClick={handleClear}
                className="w-16 h-16 rounded-full bg-rose-50/70 hover:bg-rose-100 text-rose-600 cursor-pointer font-bold text-xs flex items-center justify-center active:scale-90 transition-all"
              >
                Clear
              </button>
              
              <button
                onClick={() => handleKeyPress('0')}
                className="w-16 h-16 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-100 hover:border-indigo-300 shadow-xs cursor-pointer font-extrabold text-lg flex items-center justify-center active:scale-90 transition-all"
              >
                0
              </button>

              {/* Close helper key */}
              <button
                onClick={onClose}
                className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 cursor-pointer font-bold text-xs flex items-center justify-center active:scale-90 transition-all border border-slate-200"
              >
                Exit
              </button>
            </div>

            <p className="text-[10px] text-slate-400 font-mono italic">
              Hint: Numeric Code is current year standard (2026)
            </p>
          </motion.div>
        ) : (
          
          /* VIEW B: FULLY UNLOCKED ADMIN CONTROL CENTRE INTERFACE */
          <motion.div
            key="admin-workspace"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[32px] border border-indigo-100 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header Area */}
            <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-lg shadow-sm">
                  🛠️
                </span>
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight flex items-center gap-2">
                    <span>Admin Central Management</span>
                    <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[9px] font-mono animate-pulse">Unlocked</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Logged in as Chandrashekhar Gautam. Edit, insert, or discard website items.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setPinCode('');
                    playBubbleSound();
                  }}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  🔒 Lock Station
                </button>
                <button
                  onClick={onClose}
                  className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-teal-500/20"
                >
                  Apply & Exit
                </button>
              </div>
            </div>

            {/* Inner Layout Container */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
              
              {/* Left Side-rail Selector links */}
              <div className="md:col-span-3 bg-slate-50 border-r border-slate-100 p-4 space-y-1">
                {[
                  { key: 'homepage', icon: 'Home', label: 'Home & Pedagogy' },
                  { key: 'timeline', icon: 'Compass', label: 'Timeline Path' },
                  { key: 'achievements', icon: 'Award', label: 'Achievements' },
                  { key: 'publications', icon: 'BookOpen', label: 'Publications' },
                  { key: 'slides', icon: 'Image', label: 'Photo Gallery (फोटो गैलरी)' },
                  { key: 'social', icon: 'Globe', label: 'Social Networks' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveAdminTab(item.key as any);
                      playBubbleSound();
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeAdminTab === item.key
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <DynamicIcon name={item.icon} size={14} />
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="pt-6 border-t border-slate-200 mt-6 px-2 text-center">
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase block mb-1">
                    System Cache
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Do you want to clear localStorage cache and reset database values?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="text-[10px] text-rose-500 hover:underline cursor-pointer font-semibold"
                  >
                    Reset defaults database
                  </button>
                </div>
              </div>

              {/* Right Side-panel dynamic details container */}
              <div className="md:col-span-9 p-6 md:p-8 overflow-y-auto space-y-6">
                
                {/* 0. HOMEPAGE CONFIGURATION MODULE */}
                {activeAdminTab === 'homepage' && (
                  <form onSubmit={handleSaveHomepageConfigAction} className="space-y-6 text-left">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                        🏠 Homepage Hero & Pedagogy Settings
                      </h4>
                      {isHomeConfigSaved && (
                        <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold font-sans animate-bounce">
                          ✓ Saved Successfully! / सहेजा गया!
                        </span>
                      )}
                    </div>

                    {/* Section 1: Hero Banner */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                      <span className="text-xs font-black text-indigo-900 block border-b pb-1">
                        🎯 Hero Greeting Section (मुख्य स्वागत भाग)
                      </span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">Hero Title (English)</label>
                          <input
                            type="text"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">मुख्य शीर्षक (Hindi)</label>
                          <input
                            type="text"
                            value={heroTitleHi}
                            onChange={(e) => setHeroTitleHi(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">Hero Description (English)</label>
                          <textarea
                            rows={3}
                            value={heroDesc}
                            onChange={(e) => setHeroDesc(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">मुख्य विवरण (Hindi)</label>
                          <textarea
                            rows={3}
                            value={heroDescHi}
                            onChange={(e) => setHeroDescHi(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Teacher/Educator Bio */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                      <span className="text-xs font-black text-indigo-900 block border-b pb-1">
                        👨 Educator Introduction Card (शिक्षक परिचय कार्ड)
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">Name (English)</label>
                          <input
                            type="text"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">नाम (Hindi)</label>
                          <input
                            type="text"
                            value={teacherNameHi}
                            onChange={(e) => setTeacherNameHi(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">Role (English)</label>
                          <input
                            type="text"
                            value={teacherRole}
                            onChange={(e) => setTeacherRole(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">पद (Hindi)</label>
                          <input
                            type="text"
                            value={teacherRoleHi}
                            onChange={(e) => setTeacherRoleHi(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">Sensory Profile Bio (English)</label>
                          <textarea
                            rows={2}
                            value={teacherBio}
                            onChange={(e) => setTeacherBio(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">जीवनी विवरण (Hindi)</label>
                          <textarea
                            rows={2}
                            value={teacherBioHi}
                            onChange={(e) => setTeacherBioHi(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase block">Teacher Profile Image URL</label>
                        <input
                          type="text"
                          value={teacherImageUrl}
                          onChange={(e) => setTeacherImageUrl(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Section 3: Pedagogy Cards (Three Elements) */}
                    <div className="space-y-4">
                      <span className="text-xs font-black text-indigo-900 block border-b pb-1">
                        🧩 Interactive Pedagogy Cards Settings (सेंसरी व समावेशी शिक्षा के डब्बे)
                      </span>

                      {/* Card 1 */}
                      <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-150 space-y-3">
                        <span className="text-xs font-black text-rose-800 block"> डब्बा 1: Sensory Pathways (सेंसरी डब्बा) 🧠</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">Title (English)</label>
                            <input
                              type="text"
                              value={card1Title}
                              onChange={(e) => setCard1Title(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-rose-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">शीर्षक (Hindi)</label>
                            <input
                              type="text"
                              value={card1TitleHi}
                              onChange={(e) => setCard1TitleHi(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-rose-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">Description (English)</label>
                            <input
                              type="text"
                              value={card1Desc}
                              onChange={(e) => setCard1Desc(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-rose-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">विवरण (Hindi)</label>
                            <input
                              type="text"
                              value={card1DescHi}
                              onChange={(e) => setCard1DescHi(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-rose-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">Card Color Accent</label>
                            <select
                              value={card1Color}
                              onChange={(e) => setCard1Color(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:border-rose-400"
                            >
                              <option value="rose">🌹 Rose / Pink</option>
                              <option value="amber">💛 Amber / Yellow</option>
                              <option value="teal">💚 Teal / Green</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">Card Emoji Symbol</label>
                            <input
                              type="text"
                              value={card1Emoji}
                              onChange={(e) => setCard1Emoji(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-150 space-y-3">
                        <span className="text-xs font-black text-amber-800 block"> डब्बा 2: IEP Guidance (आईईपी मार्गदर्शन डब्बा) ❤️</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">Title (English)</label>
                            <input
                              type="text"
                              value={card2Title}
                              onChange={(e) => setCard2Title(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-amber-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">शीर्षक (Hindi)</label>
                            <input
                              type="text"
                              value={card2TitleHi}
                              onChange={(e) => setCard2TitleHi(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-amber-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">Description (English)</label>
                            <input
                              type="text"
                              value={card2Desc}
                              onChange={(e) => setCard2Desc(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-amber-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">विवरण (Hindi)</label>
                            <input
                              type="text"
                              value={card2DescHi}
                              onChange={(e) => setCard2DescHi(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-amber-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">Card Color Accent</label>
                            <select
                              value={card2Color}
                              onChange={(e) => setCard2Color(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:border-amber-400"
                            >
                              <option value="rose">🌹 Rose / Pink</option>
                              <option value="amber">💛 Amber / Yellow</option>
                              <option value="teal">💚 Teal / Green</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">Card Emoji Symbol</label>
                            <input
                              type="text"
                              value={card2Emoji}
                              onChange={(e) => setCard2Emoji(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 text-center"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-teal-50/60 p-5 rounded-2xl border border-teal-150 space-y-3">
                        <span className="text-xs font-black text-teal-800 block"> डब्बा 3: Inclusive Communities (समावेशी डब्बा) 🤝</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">Title (English)</label>
                            <input
                              type="text"
                              value={card3Title}
                              onChange={(e) => setCard3Title(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-teal-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">शीर्षक (Hindi)</label>
                            <input
                              type="text"
                              value={card3TitleHi}
                              onChange={(e) => setCard3TitleHi(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-teal-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">Description (English)</label>
                            <input
                              type="text"
                              value={card3Desc}
                              onChange={(e) => setCard3Desc(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-teal-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">विवरण (Hindi)</label>
                            <input
                              type="text"
                              value={card3DescHi}
                              onChange={(e) => setCard3DescHi(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-teal-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">Card Color Accent</label>
                            <select
                              value={card3Color}
                              onChange={(e) => setCard3Color(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:border-teal-400"
                            >
                              <option value="rose">🌹 Rose / Pink</option>
                              <option value="amber">💛 Amber / Yellow</option>
                              <option value="teal">💚 Teal / Green</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">Card Emoji Symbol</label>
                            <input
                              type="text"
                              value={card3Emoji}
                              onChange={(e) => setCard3Emoji(e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
                    >
                      <span>💾 Save Settings & Update Homepage (सहेजें और मुख्यपृष्ठ बदलें)</span>
                    </button>
                  </form>
                )}

                {/* 1. TIMELINE MANAGEMENT MODULE */}
                {activeAdminTab === 'timeline' && (
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b pb-2 flex justify-between items-center">
                      <span>Timeline Journey Landmark Nodes</span>
                      <span className="text-xs text-slate-400 font-normal">({milestones.length} Years)</span>
                    </h4>

                    {/* Milestone insert form */}
                    <form onSubmit={handleAddMilestone} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 mb-6">
                      <span className="text-xs font-extrabold text-slate-700 block">➕ Add New Timeline Node Year</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Year</label>
                          <input
                            type="number"
                            value={newYear}
                            onChange={(e) => setNewYear(Number(e.target.value))}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Category</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as any)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          >
                            <option value="Birth">👶 Birth</option>
                            <option value="Education">🎓 Education</option>
                            <option value="Career">💼 Career</option>
                            <option value="Achievement">🏆 Achievement</option>
                            <option value="Special Education">🧩 Special Education</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Title</label>
                          <input
                            type="text"
                            placeholder="e.g. A New Horizon"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Subtitle</label>
                          <input
                            type="text"
                            placeholder="e.g. Mastered Sign Language"
                            value={newSubtitle}
                            onChange={(e) => setNewSubtitle(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Events list (One event per line)</label>
                        <textarea
                          rows={2}
                          placeholder="Event line item 1&#10;Event line item 2"
                          value={newEventsText}
                          onChange={(e) => setNewEventsText(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Diary personal notes</label>
                          <input
                            type="text"
                            placeholder="Interactive details about how students reacted..."
                            value={newNotesText}
                            onChange={(e) => setNewNotesText(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Google Drive Image URL</label>
                          <input
                            type="text"
                            placeholder="https://images.unsplash.com/photo-..."
                            value={newPhotosText}
                            onChange={(e) => setNewPhotosText(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Insert Timeline Milestone Year &rarr;
                      </button>
                    </form>

                    {/* Existing Milestones List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Present Timeline landmarks list:</span>
                      {milestones.sort((a,b) => b.year - a.year).map((ms) => (
                        <div key={ms.id} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl hover:bg-slate-50">
                          <div>
                            <span className="font-extrabold text-indigo-600 font-mono text-xs">Year {ms.year}</span>
                            <span className="text-xs font-semibold text-slate-700 ml-3">{ms.title}</span>
                            <span className="text-[10px] text-slate-400 ml-2 italic">({ms.category})</span>
                          </div>
                          <button
                            onClick={() => handleDeleteMilestone(ms.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <DynamicIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. ACHIEVEMENTS SYSTEM */}
                {activeAdminTab === 'achievements' && (
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b pb-2 flex justify-between items-center">
                      <span>Accolades & Achievements</span>
                      <span className="text-xs text-slate-400 font-normal">({achievements.length} Items)</span>
                    </h4>

                    {/* Form block */}
                    <form onSubmit={handleAddAchievement} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 mb-6">
                      <span className="text-xs font-extrabold text-slate-700 block">🏆 Insert New Achievement Record</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Achievement Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Unified Sports Champion Award"
                            value={newAchTitle}
                            onChange={(e) => setNewAchTitle(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Award Category</label>
                          <input
                            type="text"
                            placeholder="e.g. State Recognition"
                            value={newAchCategory}
                            onChange={(e) => setNewAchCategory(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Issuer Board</label>
                          <input
                            type="text"
                            placeholder="e.g. Directorate of Education"
                            value={newAchIssuer}
                            onChange={(e) => setNewAchIssuer(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                          <input
                            type="date"
                            value={newAchDate}
                            onChange={(e) => setNewAchDate(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Visual Icon</label>
                          <select
                            value={newAchIcon}
                            onChange={(e) => setNewAchIcon(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          >
                            {AVAILABLE_ACCENT_ICONS.map(ic => (
                              <option key={ic} value={ic}>{ic}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Brief Accompanying Description</label>
                        <input
                          type="text"
                          placeholder="Detail who presented it, why the award was conferred, and its community value..."
                          value={newAchDesc}
                          onChange={(e) => setNewAchDesc(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Verification link / Document URL (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Drive PDF or website certificate link"
                            value={newAchLinkUrl}
                            onChange={(e) => setNewAchLinkUrl(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Document link Label (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. View State Certificate"
                            value={newAchLinkText}
                            onChange={(e) => setNewAchLinkText(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Save Achievement Accolade &rarr;
                      </button>
                    </form>

                    {/* Achievements Listing */}
                    <div className="space-y-2">
                      {achievements.map((ach) => (
                        <div key={ach.id} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="p-1 rounded bg-yellow-50 text-yellow-600">
                              <DynamicIcon name={ach.iconName} size={14} />
                            </span>
                            <div>
                              <p className="text-xs font-extrabold text-slate-700 leading-none">{ach.title}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                                {ach.category} &bull; {ach.issuer}
                                {ach.linkUrl && <span className="text-teal-600 font-bold ml-2">(🔗 Has Verification File)</span>}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAchievement(ach.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <DynamicIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PUBLICATIONS DIRECTORY */}
                {activeAdminTab === 'publications' && (
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b pb-2 flex justify-between items-center">
                      <span>Publications Library</span>
                    </h4>

                    {/* Add form */}
                    <form onSubmit={handleAddPublication} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 mb-6">
                      <span className="text-xs font-extrabold text-slate-700 block">📄 Register New publication / notes Entry</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Publication Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Teaching Kit Guide"
                            value={newPubTitle}
                            onChange={(e) => setNewPubTitle(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Asset Format Type</label>
                          <select
                            value={newPubType}
                            onChange={(e) => setNewPubType(e.target.value as any)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          >
                            <option value="article">📄 Article Layout</option>
                            <option value="pdf">📕 PDF Handbook</option>
                            <option value="notes">📝 Classroom Notes</option>
                            <option value="departmental">🏛️ Departmental Standard</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Author Name</label>
                          <input
                            type="text"
                            value={newPubAuthor}
                            onChange={(e) => setNewPubAuthor(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Registration Date</label>
                          <input
                            type="date"
                            value={newPubDate}
                            onChange={(e) => setNewPubDate(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Resource weblink</label>
                          <input
                            type="text"
                            placeholder="https://example.com/..."
                            value={newPubLink}
                            onChange={(e) => setNewPubLink(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Brief Content Description Summary</label>
                        <textarea
                          rows={2}
                          placeholder="Sum up what special education research topic is covered inside..."
                          value={newPubDesc}
                          onChange={(e) => setNewPubDesc(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Publish Resource Entry &rarr;
                      </button>
                    </form>

                    {/* Listing */}
                    <div className="space-y-2">
                      {publications.map((p) => (
                        <div key={p.id} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl">
                          <div>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded capitalize">{p.type}</span>
                            <span className="text-xs font-semibold text-slate-700 ml-2">{p.title}</span>
                          </div>
                          <button
                            onClick={() => handleDeletePublication(p.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <DynamicIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. COVER PHOTO SLIDER / PHOTO GALLERY */}
                {activeAdminTab === 'slides' && (
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b pb-2 flex justify-between items-center">
                      <span>🖼️ Photo Gallery & Slider Database (चित्र गैलरी)</span>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">
                        {slides.length} {lang === 'en' ? 'Photos' : 'चित्र'}
                      </span>
                    </h4>

                    {/* DYNAMIC EDITING FORM VS ADDING FORM */}
                    {editingSlideId ? (
                      <form onSubmit={handleSaveEditedSlide} className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-4 mb-6 text-left">
                        <div className="flex justify-between items-center border-b border-amber-200 pb-1.5">
                          <span className="text-xs font-black text-amber-900 block">✏️ Edit Photo Gallery Item (बदलाव करें)</span>
                          <button
                            type="button"
                            onClick={handleCancelEditSlide}
                            className="text-xs text-amber-800 hover:underline hover:text-amber-950 font-bold"
                          >
                            Cancel / रद्द करें ×
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">Image URL (चित्र का लिंक)</label>
                            <input
                              type="text"
                              required
                              value={editingSlideUrl}
                              onChange={(e) => setEditingSlideUrl(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl border-amber-200 bg-white mt-1 focus:outline-inner focus:outline-amber-500 shadow-inner"
                            />
                            {editingSlideUrl && (
                              <div className="mt-2 flex justify-start">
                                <img src={editingSlideUrl} alt="Preview" className="w-24 h-16 object-cover rounded-xl border-2 border-white shadow-md" />
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">Caption Content (English)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Tactile materials classroom demonstration"
                              value={editingSlideCaption}
                              onChange={(e) => setEditingSlideCaption(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl border-amber-200 bg-white mt-1 focus:outline-inner focus:outline-amber-500 shadow-inner"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">कैप्शन / शीर्षक (Hindi)</label>
                            <input
                              type="text"
                              placeholder="जैसे: स्पर्श संवेदी कक्षा में चर्चा"
                              value={editingSlideCaptionHi}
                              onChange={(e) => setEditingSlideCaptionHi(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl border-amber-200 bg-white mt-1 focus:outline-inner focus:outline-amber-500 shadow-inner"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-200"
                          >
                            💾 Update Photo (जानकारी अपडेट करें)
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditSlide}
                            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            {lang === 'en' ? 'Cancel' : 'रद्द करें'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleAddSlide} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4 mb-6 text-left">
                        <span className="text-xs font-black text-indigo-950 block border-b pb-1.5">➕ Add Image to Photo Gallery (नई तस्वीर जोड़ें)</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block animate-pulse">Photo URL Link (तस्वीर का वेब लिंक)</label>
                            <input
                              type="text"
                              required
                              placeholder="https://images.unsplash.com/photo-..."
                              value={newSlideUrl}
                              onChange={(e) => setNewSlideUrl(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 focus:outline-indigo-500 shadow-inner"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Caption Label (English)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Inclusive sports day run celebration"
                              value={newSlideCaption}
                              onChange={(e) => setNewSlideCaption(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 focus:outline-indigo-500 shadow-inner"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">तस्वीर स्पष्टीकरण / कैप्शन (Hindi)</label>
                            <input
                              type="text"
                              placeholder="जैसे: खेल दिवस पर विशेष बच्चों की दौड़"
                              value={newSlideCaptionHi}
                              onChange={(e) => setNewSlideCaptionHi(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 focus:outline-indigo-500 shadow-inner"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                        >
                          <span>🌈 Add to Public Gallery & Slider (गैलरी में शामिल करें)</span>
                        </button>
                      </form>
                    )}

                    {/* Listing of Existing Photos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {slides.map((s) => (
                        <div key={s.id} className="group relative flex flex-col bg-white border border-slate-150 p-3 rounded-2xl shadow-xs transition-all hover:shadow-md hover:border-slate-300">
                          
                          {/* Image preview box */}
                          <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border">
                            <img src={s.url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" referrerPolicy="no-referrer" />
                            <div className="absolute top-2 right-2 flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEditSlide(s)}
                                className="p-1.5 rounded-lg bg-amber-500/90 text-white hover:bg-amber-600 transition-colors shadow-xs cursor-pointer"
                                title="Edit properties"
                              >
                                <DynamicIcon name="Edit" size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteSlide(s.id)}
                                className="p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                                title="Delete from gallery"
                              >
                                <DynamicIcon name="Trash2" size={12} />
                              </button>
                            </div>
                          </div>

                          <div className="text-left space-y-1">
                            <div className="flex items-start gap-1">
                              <span className="text-[9px] bg-indigo-50 text-indigo-700 font-bold px-1 rounded flex-shrink-0 mt-0.5">EN</span>
                              <span className="text-[11px] font-semibold text-slate-800 line-clamp-2">{s.caption}</span>
                            </div>
                            {s.captionHi && (
                              <div className="flex items-start gap-1 border-t pt-1 border-slate-50 mt-1">
                                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1 rounded flex-shrink-0 mt-0.5">HI</span>
                                <span className="text-[11px] font-medium text-slate-600 line-clamp-2">{s.captionHi}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. SOCIAL MEDIA DIRECTORY */}
                {activeAdminTab === 'social' && (
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b pb-2 flex justify-between items-center">
                      <span>Social Media Directory & Handles</span>
                      <span className="text-xs text-slate-400 font-normal">({socialLinks.length} Accounts)</span>
                    </h4>

                    {/* Add Form */}
                    <form onSubmit={handleAddSocialLink} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-4 mb-6">
                      <span className="text-xs font-extrabold text-slate-700 block">🌐 Add Social Media Handle Profile</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Channel / App Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Facebook, Instagram, YouTube"
                            required
                            value={newSocName}
                            onChange={(e) => setNewSocName(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Channel Category</label>
                          <input
                            type="text"
                            placeholder="e.g. Professional Portal, Educational Network"
                            value={newSocCategory}
                            onChange={(e) => setNewSocCategory(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Full Account URL</label>
                          <input
                            type="url"
                            placeholder="https://facebook.com/gautam..."
                            required
                            value={newSocUrl}
                            onChange={(e) => setNewSocUrl(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Brand Vector Icon</label>
                          <select
                            value={newSocIcon}
                            onChange={(e) => setNewSocIcon(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1"
                          >
                            <option value="Facebook">Facebook (Icon)</option>
                            <option value="Instagram">Instagram (Icon)</option>
                            <option value="Youtube">YouTube (Icon)</option>
                            <option value="Globe">Global Website (Icon)</option>
                            <option value="Twitter">Twitter / X (Icon)</option>
                            <option value="Compass">Compass (Icon)</option>
                            <option value="Link">Simple Link (Icon)</option>
                            <option value="Shield">Secure Badge (Icon)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Register New Social Account &rarr;
                      </button>
                    </form>

                    {/* Listing */}
                    <div className="space-y-3">
                      {socialLinks.map((soc) => (
                        <div key={soc.id} className="flex gap-4 items-center bg-white border border-slate-100 p-3 rounded-xl justify-between">
                          <div className="flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-teal-50 text-teal-600">
                              <DynamicIcon name={(soc.iconName || 'Globe') as any} size={15} />
                            </span>
                            <div>
                              <p className="text-xs font-extrabold text-slate-700 leading-none">{soc.name}</p>
                              <a 
                                href={soc.url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[10px] text-teal-600 hover:underline mt-1 block truncate max-w-sm font-mono"
                              >
                                {soc.url}
                              </a>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSocialLink(soc.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <DynamicIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
