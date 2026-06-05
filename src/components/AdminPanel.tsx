import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineMilestone, Publication, NewsCutting, LiveVideo, Achievement, SliderPhoto, SocialLink, HomepageConfig, CustomPage } from '../types';
import { DynamicIcon, AVAILABLE_ACCENT_ICONS } from './DynamicIcon';
import { playBubbleSound, playSuccessChime, playKeyTap, playErrorAlert } from '../audio';

/**
 * Safely transforms a Google Drive sharing/viewer link into a direct public fast-rendering 
 * and optimized image URL using Google's high-speed usercontent system.
 * Accepts optional maxSize parameter to automatically "shrink" / compress image files on-the-fly.
 */
export function tryTransformGoogleDriveUrl(url: string, maxSize?: number): string {
  if (!url) return url;
  const trimmed = url.trim();

  // Return immediately if it does not belong to google drive domains
  if (
    !trimmed.includes('drive.google.com') &&
    !trimmed.includes('docs.google.com') &&
    !trimmed.includes('googleusercontent.com')
  ) {
    return trimmed;
  }

  let fileId = '';

  // 1. Match /file/d/FILE_ID or /d/FILE_ID formats
  const fileDRegex = /\/(?:file\/d|d)\/([a-zA-Z0-9_-]+)/;
  const fileDMatch = trimmed.match(fileDRegex);
  if (fileDMatch && fileDMatch[1]) {
    fileId = fileDMatch[1];
  }

  // 2. Match id=FILE_ID query parameters
  if (!fileId) {
    const idRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
    const idMatch = trimmed.match(idRegex);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    }
  }

  // 3. Match from existing googleusercontent direct paths
  if (!fileId && trimmed.includes('googleusercontent.com')) {
    const lh3Regex = /\/d\/([a-zA-Z0-9_-]+)/;
    const lh3Match = trimmed.match(lh3Regex);
    if (lh3Match && lh3Match[1]) {
      fileId = lh3Match[1];
    }
  }

  if (fileId) {
    // Return direct proxy link. If maxSize is requested, attach =s{maxSize} to shrink/minify the image asset size automatically.
    const sizeSuffix = maxSize ? `=s${maxSize}` : '';
    return `https://lh3.googleusercontent.com/d/${fileId}${sizeSuffix}`;
  }

  return trimmed;
}

/**
 * Reusable Single-Click Local File Upload Module with beautiful status indicators and audio cues.
 */
interface SingleClickUploadProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  labelEn?: string;
  labelHi?: string;
  className?: string;
}

export const SingleClickUpload: React.FC<SingleClickUploadProps> = ({
  onUploadSuccess,
  accept = "*",
  labelEn = "Upload File",
  labelHi = "फ़ाइल अपलोड करें",
  className = ""
}) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);
    playBubbleSound();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed. Status: " + response.status);
      }

      const result = await response.json();
      if (result.status === "success" && result.url) {
        onUploadSuccess(result.url);
        setSuccess(true);
        playSuccessChime();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || "Upload response error");
      }
    } catch (err: any) {
      console.error("Upload error details:", err);
      setError(err.message || "Failed to upload file");
      playErrorAlert();
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`inline-flex flex-col items-start gap-1 font-sans ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        onClick={triggerUpload}
        disabled={uploading}
        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          uploading
            ? 'bg-slate-700 text-slate-300 animate-pulse cursor-not-allowed'
            : success
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
            : error
            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
        }`}
      >
        <DynamicIcon
          name={uploading ? 'Loader' : success ? 'Check' : 'UploadCloud'}
          size={12}
          className={uploading ? 'animate-spin' : ''}
        />
        <span>
          {uploading
            ? 'Uploading...'
            : success
            ? 'Uploaded ✓'
            : error
            ? 'Failed, Retry'
            : `${labelEn} (${labelHi})`}
        </span>
      </button>
      {error && (
        <span className="text-[9px] text-rose-500 font-medium max-w-[200px] leading-tight block mt-0.5">{error}</span>
      )}
    </div>
  );
};

export const ADMIN_THEMES = {
  indigo: {
    sidebarActive: 'bg-indigo-600 text-white shadow-md shadow-indigo-100',
    textAccent: 'text-indigo-600',
    borderAccent: 'border-indigo-600',
    bgAccent: 'bg-indigo-50',
    bgSecondary: 'bg-indigo-50/70',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    focusRing: 'focus:ring-indigo-100 focus:border-indigo-500',
  },
  teal: {
    sidebarActive: 'bg-teal-600 text-white shadow-md shadow-teal-100',
    textAccent: 'text-teal-600',
    borderAccent: 'border-teal-600',
    bgAccent: 'bg-teal-50',
    bgSecondary: 'bg-teal-50/70',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
    focusRing: 'focus:ring-teal-100 focus:border-teal-500',
  },
  rose: {
    sidebarActive: 'bg-rose-600 text-white shadow-md shadow-rose-100',
    textAccent: 'text-rose-600',
    borderAccent: 'border-rose-600',
    bgAccent: 'bg-rose-50',
    bgSecondary: 'bg-rose-50/70',
    btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
    focusRing: 'focus:ring-rose-100 focus:border-rose-500',
  },
  emerald: {
    sidebarActive: 'bg-emerald-600 text-white shadow-md shadow-emerald-100',
    textAccent: 'text-emerald-600',
    borderAccent: 'border-emerald-600',
    bgAccent: 'bg-emerald-50',
    bgSecondary: 'bg-emerald-50/70',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    focusRing: 'focus:ring-emerald-100 focus:border-emerald-500',
  },
  amber: {
    sidebarActive: 'bg-amber-600 text-white shadow-md shadow-amber-100',
    textAccent: 'text-amber-600',
    borderAccent: 'border-amber-600',
    bgAccent: 'bg-amber-50',
    bgSecondary: 'bg-amber-50/70',
    btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
    focusRing: 'focus:ring-amber-100 focus:border-amber-500',
  },
  violet: {
    sidebarActive: 'bg-violet-600 text-white shadow-md shadow-violet-100',
    textAccent: 'text-violet-600',
    borderAccent: 'border-violet-600',
    bgAccent: 'bg-violet-50',
    bgSecondary: 'bg-violet-50/70',
    btnPrimary: 'bg-violet-600 hover:bg-violet-700 text-white',
    focusRing: 'focus:ring-violet-100 focus:border-violet-500',
  },
};

interface AdminPanelProps {
  milestones: TimelineMilestone[];
  publications: Publication[];
  newsCuttings: NewsCutting[];
  videos: LiveVideo[];
  achievements: Achievement[];
  slides: SliderPhoto[];
  socialLinks: SocialLink[];
  homepageConfig: HomepageConfig;
  customPages?: CustomPage[];

  onUpdateMilestones: (updated: TimelineMilestone[]) => void;
  onUpdatePublications: (updated: Publication[]) => void;
  onUpdateNewsCuttings: (updated: NewsCutting[]) => void;
  onUpdateVideos: (updated: LiveVideo[]) => void;
  onUpdateAchievements: (updated: Achievement[]) => void;
  onUpdateSlides: (updated: SliderPhoto[]) => void;
  onUpdateSocialLinks: (updated: SocialLink[]) => void;
  onUpdateHomepageConfig: (updated: HomepageConfig) => void;
  onUpdateCustomPages?: (updated: CustomPage[]) => void;

  onClose: () => void;
  lang?: 'en' | 'hi';
  onForceRefresh?: () => Promise<boolean>;
  
  activeThemeColor?: 'indigo' | 'teal' | 'rose' | 'emerald' | 'amber' | 'violet';
  onThemeColorChange?: (color: 'indigo' | 'teal' | 'rose' | 'emerald' | 'amber' | 'violet') => void;
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
  customPages = [],
  onUpdateMilestones,
  onUpdatePublications,
  onUpdateNewsCuttings,
  onUpdateVideos,
  onUpdateAchievements,
  onUpdateSlides,
  onUpdateSocialLinks,
  onUpdateHomepageConfig,
  onUpdateCustomPages,
  onClose,
  lang = 'hi',
  onForceRefresh,
  activeThemeColor = 'indigo',
  onThemeColorChange,
}) => {
  // Screen lock state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinCode, setPinCode] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Force Refresh states
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshSuccess, setRefreshSuccess] = useState<boolean | null>(null);

  // Section selectors
  const [activeAdminTab, setActiveAdminTab] = useState<'homepage' | 'timeline' | 'achievements' | 'publications' | 'slides' | 'social' | 'news' | 'videos' | 'customPages'>('homepage');

  // Custom pages form states
  const [editingPageId, setEditingPageId] = useState<string>('');
  const [pageUrlSlug, setPageUrlSlug] = useState<string>('');
  const [pageTitle, setPageTitle] = useState<string>('');
  const [pageTitleHi, setPageTitleHi] = useState<string>('');
  const [pageIcon, setPageIcon] = useState<string>('Sparkles');
  const [pageContent, setPageContent] = useState<string>('');
  const [pageContentHi, setPageContentHi] = useState<string>('');
  const [pageIsActive, setPageIsActive] = useState<boolean>(true);

  const currentTheme = ADMIN_THEMES[activeThemeColor] || ADMIN_THEMES.indigo;

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
  const [customAvatarImageUrl, setCustomAvatarImageUrl] = useState(homepageConfig.customAvatarImageUrl || '');
  const [usePhotoInsteadOfAvatar, setUsePhotoInsteadOfAvatar] = useState(homepageConfig.usePhotoInsteadOfAvatar || false);

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

  // Auto-save inline editing IDs
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [editingPublicationId, setEditingPublicationId] = useState<string | null>(null);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // Form states - News Cuttings
  const [newNewsTitle, setNewNewsTitle] = useState<string>('');
  const [newNewsTitleHi, setNewNewsTitleHi] = useState<string>('');
  const [newNewsImageUrl, setNewNewsImageUrl] = useState<string>('');
  const [newNewsSource, setNewNewsSource] = useState<string>('');
  const [newNewsSourceHi, setNewNewsSourceHi] = useState<string>('');
  const [newNewsDate, setNewNewsDate] = useState<string>('2026-06-03');
  const [newNewsSummary, setNewNewsSummary] = useState<string>('');
  const [newNewsSummaryHi, setNewNewsSummaryHi] = useState<string>('');

  // Form states - Videos
  const [newVideoTitle, setNewVideoTitle] = useState<string>('');
  const [newVideoTitleHi, setNewVideoTitleHi] = useState<string>('');
  const [newVideoUrl, setNewVideoUrl] = useState<string>('');
  const [newVideoDescription, setNewVideoDescription] = useState<string>('');
  const [newVideoDescriptionHi, setNewVideoDescriptionHi] = useState<string>('');
  const [newVideoBadge, setNewVideoBadge] = useState<string>('');
  const [newVideoBadgeHi, setNewVideoBadgeHi] = useState<string>('');

  // Instantly propagate homepage config edits on keypress
  const handleHomepageFieldChange = (field: keyof HomepageConfig, value: any) => {
    // 1. Update matching local state so form reflects typing instantly
    if (field === 'heroTitle') setHeroTitle(value);
    else if (field === 'heroTitleHi') setHeroTitleHi(value);
    else if (field === 'heroDesc') setHeroDesc(value);
    else if (field === 'heroDescHi') setHeroDescHi(value);
    else if (field === 'teacherName') setTeacherName(value);
    else if (field === 'teacherNameHi') setTeacherNameHi(value);
    else if (field === 'teacherRole') setTeacherRole(value);
    else if (field === 'teacherRoleHi') setTeacherRoleHi(value);
    else if (field === 'teacherBio') setTeacherBio(value);
    else if (field === 'teacherBioHi') setTeacherBioHi(value);
    else if (field === 'teacherImageUrl') setTeacherImageUrl(tryTransformGoogleDriveUrl(value, 400));
    else if (field === 'customAvatarImageUrl') setCustomAvatarImageUrl(tryTransformGoogleDriveUrl(value, 600));
    else if (field === 'usePhotoInsteadOfAvatar') setUsePhotoInsteadOfAvatar(!!value);
    else if (field === 'card1Title') setCard1Title(value);
    else if (field === 'card1TitleHi') setCard1TitleHi(value);
    else if (field === 'card1Desc') setCard1Desc(value);
    else if (field === 'card1DescHi') setCard1DescHi(value);
    else if (field === 'card1Color') setCard1Color(value);
    else if (field === 'card1Emoji') setCard1Emoji(value);
    else if (field === 'card2Title') setCard2Title(value);
    else if (field === 'card2TitleHi') setCard2TitleHi(value);
    else if (field === 'card2Desc') setCard2Desc(value);
    else if (field === 'card2DescHi') setCard2DescHi(value);
    else if (field === 'card2Color') setCard2Color(value);
    else if (field === 'card2Emoji') setCard2Emoji(value);
    else if (field === 'card3Title') setCard3Title(value);
    else if (field === 'card3TitleHi') setCard3TitleHi(value);
    else if (field === 'card3Desc') setCard3Desc(value);
    else if (field === 'card3DescHi') setCard3DescHi(value);
    else if (field === 'card3Color') setCard3Color(value);
    else if (field === 'card3Emoji') setCard3Emoji(value);

    // 2. Propagate full update back to parent instantly to live reflect on-the-spot
    onUpdateHomepageConfig({
      heroTitle: field === 'heroTitle' ? value : heroTitle,
      heroTitleHi: field === 'heroTitleHi' ? value : heroTitleHi,
      heroDesc: field === 'heroDesc' ? value : heroDesc,
      heroDescHi: field === 'heroDescHi' ? value : heroDescHi,
      teacherName: field === 'teacherName' ? value : teacherName,
      teacherNameHi: field === 'teacherNameHi' ? value : teacherNameHi,
      teacherRole: field === 'teacherRole' ? value : teacherRole,
      teacherRoleHi: field === 'teacherRoleHi' ? value : teacherRoleHi,
      teacherBio: field === 'teacherBio' ? value : teacherBio,
      teacherBioHi: field === 'teacherBioHi' ? value : teacherBioHi,
      teacherImageUrl: field === 'teacherImageUrl' ? tryTransformGoogleDriveUrl(value, 400) : teacherImageUrl,
      customAvatarImageUrl: field === 'customAvatarImageUrl' ? tryTransformGoogleDriveUrl(value, 600) : customAvatarImageUrl,
      usePhotoInsteadOfAvatar: field === 'usePhotoInsteadOfAvatar' ? !!value : usePhotoInsteadOfAvatar,
      card1Title: field === 'card1Title' ? value : card1Title,
      card1TitleHi: field === 'card1TitleHi' ? value : card1TitleHi,
      card1Desc: field === 'card1Desc' ? value : card1Desc,
      card1DescHi: field === 'card1DescHi' ? value : card1DescHi,
      card1Color: field === 'card1Color' ? value : card1Color,
      card1Emoji: field === 'card1Emoji' ? value : card1Emoji,
      card2Title: field === 'card2Title' ? value : card2Title,
      card2TitleHi: field === 'card2TitleHi' ? value : card2TitleHi,
      card2Desc: field === 'card2Desc' ? value : card2Desc,
      card2DescHi: field === 'card2DescHi' ? value : card2DescHi,
      card2Color: field === 'card2Color' ? value : card2Color,
      card2Emoji: field === 'card2Emoji' ? value : card2Emoji,
      card3Title: field === 'card3Title' ? value : card3Title,
      card3TitleHi: field === 'card3TitleHi' ? value : card3TitleHi,
      card3Desc: field === 'card3Desc' ? value : card3Desc,
      card3DescHi: field === 'card3DescHi' ? value : card3DescHi,
      card3Color: field === 'card3Color' ? value : card3Color,
      card3Emoji: field === 'card3Emoji' ? value : card3Emoji,
    });
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      playErrorAlert();
      alert('Please select an image file! (कृपया केवल फोटो फाइल चुनें)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 450;
        const MAX_HEIGHT = 450;
        
        let width = img.width;
        let height = img.height;

        // Perfect 1:1 ratio center crop
        const size = Math.min(width, height);
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;

        canvas.width = MAX_WIDTH;
        canvas.height = MAX_HEIGHT;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, MAX_WIDTH, MAX_HEIGHT);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82); // High quality, compact size
          
          handleHomepageFieldChange('teacherImageUrl', compressedDataUrl);
          playSuccessChime();
        }
      };
      
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomAvatarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      playErrorAlert();
      alert('Please select an image file! (कृपया केवल फोटो फाइल चुनें)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82); // High quality, compact size
          
          handleHomepageFieldChange('customAvatarImageUrl', compressedDataUrl);
          playSuccessChime();
        }
      };
      
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNewSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      playErrorAlert();
      alert('Please select an image file! (कृपया केवल फोटो फाइल चुनें)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setNewSlideUrl(compressedDataUrl);
          playSuccessChime();
        }
      };
      
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditingSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      playErrorAlert();
      alert('Please select an image file! (कृपया केवल फोटो फाइल चुनें)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setEditingSlideUrl(compressedDataUrl);
          playSuccessChime();
        }
      };
      
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

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
      customAvatarImageUrl,
      usePhotoInsteadOfAvatar,
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
      photos: newPhotosText.trim() ? [tryTransformGoogleDriveUrl(newPhotosText.trim(), 500)] : ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'],
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
      url: tryTransformGoogleDriveUrl(newSlideUrl, 800),
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
          url: tryTransformGoogleDriveUrl(editingSlideUrl, 800),
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

  const handleAddNewsCutting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim()) return;

    const added: NewsCutting = {
      id: 'news-' + Date.now(),
      title: newNewsTitle.trim(),
      titleHi: newNewsTitleHi.trim() || undefined,
      imageUrl: newNewsImageUrl.trim() || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600',
      source: newNewsSource.trim() || 'Media Source (मीडिया)',
      sourceHi: newNewsSourceHi.trim() || undefined,
      date: newNewsDate,
      summary: newNewsSummary.trim(),
      summaryHi: newNewsSummaryHi.trim() || undefined,
    };

    onUpdateNewsCuttings([...newsCuttings, added]);
    playSuccessChime();

    // Reset
    setNewNewsTitle('');
    setNewNewsTitleHi('');
    setNewNewsImageUrl('');
    setNewNewsSource('');
    setNewNewsSourceHi('');
    setNewNewsSummary('');
    setNewNewsSummaryHi('');
  };

  const handleDeleteNewsCutting = (id: string) => {
    const remaining = newsCuttings.filter(item => item.id !== id);
    onUpdateNewsCuttings(remaining);
    playBubbleSound();
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;

    const added: LiveVideo = {
      id: 'vid-' + Date.now(),
      title: newVideoTitle.trim(),
      titleHi: newVideoTitleHi.trim() || undefined,
      videoUrl: tryTransformGoogleDriveUrl(newVideoUrl.trim(), 800),
      description: newVideoDescription.trim(),
      descriptionHi: newVideoDescriptionHi.trim() || undefined,
      badge: newVideoBadge.trim() || undefined,
      badgeHi: newVideoBadgeHi.trim() || undefined,
    };

    onUpdateVideos([...videos, added]);
    playSuccessChime();

    // Reset
    setNewVideoTitle('');
    setNewVideoTitleHi('');
    setNewVideoUrl('');
    setNewVideoDescription('');
    setNewVideoDescriptionHi('');
    setNewVideoBadge('');
    setNewVideoBadgeHi('');
  };

  const handleDeleteVideo = (id: string) => {
    const remaining = videos.filter(item => item.id !== id);
    onUpdateVideos(remaining);
    playBubbleSound();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 admin-panel-container">
      <style>{`
        .admin-panel-container input,
        .admin-panel-container textarea,
        .admin-panel-container select {
          color: #0f172a !important;
          background-color: #ffffff !important;
        }
        .admin-panel-container input::placeholder,
        .admin-panel-container textarea::placeholder {
          color: #64748b !important;
        }
      `}</style>
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
                {onForceRefresh && (
                  <button
                    type="button"
                    onClick={async () => {
                      setIsRefreshing(true);
                      setRefreshSuccess(null);
                      playBubbleSound();
                      try {
                        const ok = await onForceRefresh();
                        if (ok) {
                          setRefreshSuccess(true);
                          playSuccessChime();
                          setTimeout(() => setRefreshSuccess(null), 3500);
                        } else {
                          setRefreshSuccess(false);
                          playErrorAlert();
                          setTimeout(() => setRefreshSuccess(null), 3500);
                        }
                      } catch (err) {
                        setRefreshSuccess(false);
                        playErrorAlert();
                        setTimeout(() => setRefreshSuccess(null), 3500);
                      } finally {
                        setIsRefreshing(false);
                      }
                    }}
                    disabled={isRefreshing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isRefreshing 
                        ? 'bg-slate-700 text-slate-300 animate-pulse cursor-not-allowed'
                        : refreshSuccess === true
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : refreshSuccess === false
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20'
                    }`}
                    title="Verify state consistency by manually pulling the absolute latest data from the live Firebase backend"
                  >
                    <DynamicIcon 
                      name={isRefreshing ? 'Loader' : refreshSuccess === true ? 'Check' : refreshSuccess === false ? 'AlertTriangle' : 'RefreshCw'} 
                      size={12} 
                      className={isRefreshing ? 'animate-spin' : ''} 
                    />
                    <span>
                      {isRefreshing 
                        ? 'Refreshing...' 
                        : refreshSuccess === true
                        ? 'Consistent ✓' 
                        : refreshSuccess === false
                        ? 'Failed'
                        : 'Force Refresh'}
                    </span>
                  </button>
                )}
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
                  { key: 'news', icon: 'FileText', label: 'News / Media Cuttings' },
                  { key: 'videos', icon: 'Tv', label: 'Video Broadcast' },
                  { key: 'social', icon: 'Globe', label: 'Social Networks' },
                  { key: 'customPages', icon: 'PlusSquare', label: 'Manage Pages (कस्टम पेज)' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveAdminTab(item.key as any);
                      playBubbleSound();
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activeAdminTab === item.key
                        ? currentTheme.sidebarActive
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <DynamicIcon name={item.icon} size={14} />
                    <span>{item.label}</span>
                  </button>
                ))}

                {/* Brand Color Theme Customizer */}
                <div className="pt-4 border-t border-slate-200 mt-4 px-1.5 text-left">
                  <span className="text-[9px] font-extrabold text-slate-400 font-mono uppercase block mb-1.5 tracking-wider">
                    {lang === 'hi' ? 'टैब का रंग बदलें' : 'Change Tab Color'}
                  </span>
                  <div className="flex flex-wrap gap-2 justify-start items-center">
                    {(['indigo', 'teal', 'rose', 'emerald', 'amber', 'violet'] as const).map((color) => {
                      const colorClassMap = {
                        indigo: 'bg-indigo-600 ring-indigo-200',
                        teal: 'bg-teal-600 ring-teal-200',
                        rose: 'bg-rose-600 ring-rose-200',
                        emerald: 'bg-emerald-600 ring-emerald-200',
                        amber: 'bg-amber-600 ring-amber-200',
                        violet: 'bg-violet-600 ring-violet-200',
                      };
                      const isActive = activeThemeColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            if (onThemeColorChange) {
                              onThemeColorChange(color);
                            }
                            playBubbleSound();
                          }}
                          className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center ${colorClassMap[color]} ${
                            isActive ? 'ring-4 ring-offset-2 scale-105' : 'opacity-85'
                          }`}
                          title={`Switch to ${color}`}
                        >
                          {isActive && (
                            <span className="text-[10px] text-white">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 mt-4 px-2 text-center">
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
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                          🏠 Homepage Hero & Pedagogy Settings
                        </h4>
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-200 shadow-xs animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Live Auto-Save ON
                        </span>
                      </div>
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
                            onChange={(e) => handleHomepageFieldChange('heroTitle', e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">मुख्य शीर्षक (Hindi)</label>
                          <input
                            type="text"
                            value={heroTitleHi}
                            onChange={(e) => handleHomepageFieldChange('heroTitleHi', e.target.value)}
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
                            onChange={(e) => handleHomepageFieldChange('heroDesc', e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">मुख्य विवरण (Hindi)</label>
                          <textarea
                            rows={3}
                            value={heroDescHi}
                            onChange={(e) => handleHomepageFieldChange('heroDescHi', e.target.value)}
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
                            onChange={(e) => handleHomepageFieldChange('teacherName', e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">नाम (Hindi)</label>
                          <input
                            type="text"
                            value={teacherNameHi}
                            onChange={(e) => handleHomepageFieldChange('teacherNameHi', e.target.value)}
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
                            onChange={(e) => handleHomepageFieldChange('teacherRole', e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">पद (Hindi)</label>
                          <input
                            type="text"
                            value={teacherRoleHi}
                            onChange={(e) => handleHomepageFieldChange('teacherRoleHi', e.target.value)}
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
                            onChange={(e) => handleHomepageFieldChange('teacherBio', e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase block">जीवनी विवरण (Hindi)</label>
                          <textarea
                            rows={2}
                            value={teacherBioHi}
                            onChange={(e) => handleHomepageFieldChange('teacherBioHi', e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 shadow-inner focus:outline-indigo-500"
                          />
                        </div>
                      </div>

                      {/* Comprehensive Dual-Mode Teacher Profile Image Uploader */}
                      <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200/60 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                            📸 PROFILE IMAGE CONTROLLER (प्रोफ़ाइल फ़ोटो नियंत्रक)
                          </span>
                          <span className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Auto-optimizes & Auto-shrinks / तत्काल संकुचन
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-5 items-center">
                          {/* Left: Professional 1:1 Live Preview */}
                          <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                            <span className="text-[9px] font-black text-indigo-900 mb-2 uppercase tracking-tight">Live Profile Preview</span>
                            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-indigo-50 shadow-md flex items-center justify-center bg-slate-50">
                              {teacherImageUrl ? (
                                <img
                                  src={teacherImageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    // Fallback for broken link
                                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300';
                                  }}
                                />
                              ) : (
                                <div className="text-slate-400 flex flex-col items-center gap-1">
                                  <DynamicIcon name="User" size={24} />
                                  <span className="text-[9px]">No Photo</span>
                                </div>
                              )}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 mt-2">450 x 450 px</span>
                          </div>

                          {/* Right: Direct File Upload Area & Web URL Field */}
                          <div className="flex-1 w-full space-y-3">
                            {/* Option 1: Direct Drop & Select File Uploader */}
                            <div>
                              <span className="text-[10px] font-extrabold text-slate-500 block mb-1">
                                Option A: Direct Local Photo Upload (सीधे फ़ोटो अपलोड करें)
                              </span>
                              
                              <label className="group flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/30 p-4 rounded-xl cursor-pointer transition-all duration-200 text-center shadow-xs">
                                <div className="p-2 bg-indigo-50 group-hover:bg-indigo-100/60 text-indigo-600 rounded-full transition-colors mb-2">
                                  <DynamicIcon name="Camera" size={18} className="animate-bounce" />
                                </div>
                                <span className="text-xs font-bold text-indigo-950 block">
                                  Select Photo from Device / फ़ोटो चुनें
                                </span>
                                <span className="text-[9px] text-slate-400 mt-1 uppercase font-mono tracking-tight block">
                                  JPEG / PNG / WEBP file (Auto Crop to Square)
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProfileImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Divider with local and web */}
                            <div className="flex items-center gap-2 py-0.5">
                              <span className="h-px bg-slate-200 flex-1" />
                              <span className="text-[9px] font-black text-slate-400 uppercase font-mono">OR / या</span>
                              <span className="h-px bg-slate-200 flex-1" />
                            </div>

                            {/* Option 2: Web Image / Drive URL Link */}
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-500 block mb-1">
                                Option B: Enter image link / Google Drive share link (वेब / ड्राइव लिंक)
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Paste Google Drive link or Web URL..."
                                  value={teacherImageUrl.startsWith('data:') ? '[Local Uploaded Base64 Image]' : teacherImageUrl}
                                  onChange={(e) => {
                                    // Only allow typing URL if not local uploaded placeholder
                                    if (e.target.value === '[Local Uploaded Base64 Image]') return;
                                    handleHomepageFieldChange('teacherImageUrl', e.target.value);
                                  }}
                                  className="w-full text-xs p-2.5 pr-8 border rounded-xl bg-white shadow-inner focus:outline-indigo-500 font-mono"
                                />
                                {teacherImageUrl.startsWith('data:') && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleHomepageFieldChange('teacherImageUrl', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300');
                                      playBubbleSound();
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors"
                                    title="Reset / रीसेट"
                                  >
                                    <DynamicIcon name="RefreshCcw" size={12} />
                                  </button>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 block mt-1 font-sans">
                                Drive links are automatically converted and optimized!
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2.5: Interactive Avatar & Custom Large Photo (अवतार या बड़ी फ़ोटो का चयन व अपलोड) */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                      <span className="text-xs font-black text-indigo-900 block border-b pb-1">
                        🌟 Welcome Companion Configuration (मुख्य अवतार बनाम बड़ी फ़ोटो नियंत्रक)
                      </span>

                      <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase block">Choose Display Mode (स्वागत स्क्रीन पर क्या दिखाएं):</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleHomepageFieldChange('usePhotoInsteadOfAvatar', false)}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                              !usePhotoInsteadOfAvatar
                                ? 'bg-indigo-50/70 border-indigo-400 text-indigo-950 shadow-xs'
                                : 'bg-slate-50/40 border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-2xl mt-0.5">🐼</span>
                            <div>
                              <h5 className="text-[11px] font-bold">Interactive Kung-Fu Panda Avatar</h5>
                              <p className="text-[9px] text-slate-400 font-medium">Bilingual live companion with real-time dynamic speech balloons and motions.</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleHomepageFieldChange('usePhotoInsteadOfAvatar', true)}
                            className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                              usePhotoInsteadOfAvatar
                                ? 'bg-indigo-50/70 border-indigo-400 text-indigo-950 shadow-xs'
                                : 'bg-slate-50/40 border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="text-2xl mt-0.5">📸</span>
                            <div>
                              <h5 className="text-[11px] font-bold">My Large Custom Photo (मेरी बड़ी फोटो)</h5>
                              <p className="text-[9px] text-slate-400 font-medium">Professional educator portrait with custom inspiring teaching values.</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Display custom photo uploader if customized photo is enabled, or allow always uploading */}
                      <div className="bg-slate-100/30 p-4 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                            🖼️ CHOOSE & UPLOAD TEACHER PHOTO (बड़ी फोटो अपलोड करें)
                          </span>
                          <span className="text-[8px] text-indigo-600 font-black bg-indigo-50 px-2 py-0.5 rounded-md">
                            Preserves Full Photo Aspect Ratio (पूरी फ़ोटो बिना कटे अपलोड होगी)
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-5 items-center">
                          {/* Left visual preview */}
                          <div className="flex flex-col items-center justify-center bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs shrink-0 w-full md:w-56">
                            <span className="text-[9px] font-bold text-indigo-950 mb-1.5 uppercase tracking-wide">Photo Preview (फ़ोटो का आकार)</span>
                            <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-indigo-150/85 shadow-md flex items-center justify-center bg-slate-50">
                              {customAvatarImageUrl ? (
                                <img
                                  src={customAvatarImageUrl}
                                  alt="Custom Avatar Preview"
                                  className="w-full h-full object-contain p-1"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600';
                                  }}
                                />
                              ) : (
                                <div className="text-slate-300 flex flex-col items-center gap-1">
                                  <DynamicIcon name="Camera" size={24} />
                                  <span className="text-[8px]">No Photo</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Upload operations */}
                          <div className="flex-1 w-full space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {/* Option A: Direct compressed canvas upload */}
                              <div>
                                <span className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-tight">Option 1: Direct File Selector</span>
                                <label className="group flex flex-col items-center justify-center border border-dashed border-slate-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 p-3.5 rounded-xl cursor-pointer transition-all duration-150 text-center shadow-xs">
                                  <DynamicIcon name="Upload" size={14} className="text-slate-400 group-hover:text-indigo-600 mb-1" />
                                  <span className="text-[11px] font-bold text-slate-700">Choose custom photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCustomAvatarImageUpload}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              {/* Option B: Quick Cloud Server Upload */}
                              <div>
                                <span className="text-[9px] font-black text-slate-400 block mb-1 uppercase tracking-tight">Option 2: Cloud Server Upload</span>
                                <div className="border border-dashed border-slate-300 bg-white p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
                                  <div className="mb-1">
                                    <SingleClickUpload
                                      onUploadSuccess={(url) => {
                                        handleHomepageFieldChange('customAvatarImageUrl', url);
                                      }}
                                      accept="image/*"
                                      labelEn="Upload to Cloud"
                                      labelHi="क्लाउड अपलोड"
                                    />
                                  </div>
                                  <span className="text-[8px] text-slate-400 mt-1">Stores on official server</span>
                                </div>
                              </div>
                            </div>

                            {/* Option C: Image URL Input */}
                            <div>
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-tight block mb-1">Option 3: External image url or Google Drive link (इंटरनेट / ड्राइव लिंक)</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Paste any Unsplash image link or Google Drive share link here..."
                                  value={customAvatarImageUrl.startsWith('data:') ? '[Local Uploaded Base64 Image / लोकल फोटो]' : customAvatarImageUrl}
                                  onChange={(e) => {
                                    if (e.target.value === '[Local Uploaded Base64 Image / लोकल फोटो]') return;
                                    handleHomepageFieldChange('customAvatarImageUrl', e.target.value);
                                  }}
                                  className="w-full text-xs p-2.5 pr-8 border rounded-xl bg-white shadow-inner focus:outline-indigo-500 font-mono"
                                />
                                {customAvatarImageUrl.startsWith('data:') && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleHomepageFieldChange('customAvatarImageUrl', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600');
                                      playBubbleSound();
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors"
                                    title="Reset"
                                  >
                                    <DynamicIcon name="RefreshCcw" size={11} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
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
                              onChange={(e) => handleHomepageFieldChange('card1Title', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-rose-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">शीर्षक (Hindi)</label>
                            <input
                              type="text"
                              value={card1TitleHi}
                              onChange={(e) => handleHomepageFieldChange('card1TitleHi', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card1Desc', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-rose-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">विवरण (Hindi)</label>
                            <input
                              type="text"
                              value={card1DescHi}
                              onChange={(e) => handleHomepageFieldChange('card1DescHi', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-rose-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-rose-700 uppercase block">Card Color Accent</label>
                            <select
                              value={card1Color}
                              onChange={(e) => handleHomepageFieldChange('card1Color', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card1Emoji', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card2Title', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-amber-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">शीर्षक (Hindi)</label>
                            <input
                              type="text"
                              value={card2TitleHi}
                              onChange={(e) => handleHomepageFieldChange('card2TitleHi', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card2Desc', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-amber-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">विवरण (Hindi)</label>
                            <input
                              type="text"
                              value={card2DescHi}
                              onChange={(e) => handleHomepageFieldChange('card2DescHi', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-amber-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-amber-700 uppercase block">Card Color Accent</label>
                            <select
                              value={card2Color}
                              onChange={(e) => handleHomepageFieldChange('card2Color', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card2Emoji', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card3Title', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-teal-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">शीर्षक (Hindi)</label>
                            <input
                              type="text"
                              value={card3TitleHi}
                              onChange={(e) => handleHomepageFieldChange('card3TitleHi', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card3Desc', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-teal-450"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">विवरण (Hindi)</label>
                            <input
                              type="text"
                              value={card3DescHi}
                              onChange={(e) => handleHomepageFieldChange('card3DescHi', e.target.value)}
                              className="w-full text-xs p-2 border rounded-lg bg-white mt-0.5 focus:outline-teal-450"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-black text-teal-700 uppercase block">Card Color Accent</label>
                            <select
                              value={card3Color}
                              onChange={(e) => handleHomepageFieldChange('card3Color', e.target.value)}
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
                              onChange={(e) => handleHomepageFieldChange('card3Emoji', e.target.value)}
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
                      <span>💾 Done Editing & Back to Homepage (मुख्यपृष्ठ पर वापस जाएँ)</span>
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
                            onChange={(e) => setNewPhotosText(tryTransformGoogleDriveUrl(e.target.value, 500))}
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

                    {/* Existing Milestones List with Inline Editing */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Present Timeline landmarks list:</span>
                        <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          ⚡ Auto-saves instantly on typing
                        </span>
                      </div>
                      {milestones.sort((a,b) => b.year - a.year).map((ms) => (
                        <div key={ms.id} className="bg-white border border-slate-100 p-3 rounded-2xl shadow-xs hover:shadow-xs transition-all">
                          {editingMilestoneId === ms.id ? (
                            <div className="space-y-3 pt-1">
                              <div className="grid grid-cols-4 gap-2">
                                <div className="col-span-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Year</label>
                                  <input 
                                    type="number" 
                                    value={ms.year} 
                                    onChange={(e) => {
                                      const updated = milestones.map(m => m.id === ms.id ? { ...m, year: Number(e.target.value) } : m);
                                      onUpdateMilestones(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-mono focus:bg-white"
                                  />
                                </div>
                                <div className="col-span-3">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Title</label>
                                  <input 
                                    type="text" 
                                    value={ms.title} 
                                    onChange={(e) => {
                                      const updated = milestones.map(m => m.id === ms.id ? { ...m, title: e.target.value } : m);
                                      onUpdateMilestones(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-semibold focus:bg-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Subtitle</label>
                                  <input 
                                    type="text" 
                                    value={ms.subtitle || ''} 
                                    onChange={(e) => {
                                      const updated = milestones.map(m => m.id === ms.id ? { ...m, subtitle: e.target.value || undefined } : m);
                                      onUpdateMilestones(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Category</label>
                                  <select 
                                    value={ms.category} 
                                    onChange={(e) => {
                                      const updated = milestones.map(m => m.id === ms.id ? { ...m, category: e.target.value as any } : m);
                                      onUpdateMilestones(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                  >
                                    <option value="Birth">👶 Birth</option>
                                    <option value="Education">🎓 Education</option>
                                    <option value="Career">💼 Career</option>
                                    <option value="Achievement">🏆 Achievement</option>
                                    <option value="Special Education">🧩 Special Education</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase block">Events (One line per bullet event)</label>
                                <textarea 
                                  rows={2}
                                  value={(ms.events || []).join('\n')}
                                  onChange={(e) => {
                                    const lines = e.target.value.split('\n');
                                    const updated = milestones.map(m => m.id === ms.id ? { ...m, events: lines } : m);
                                    onUpdateMilestones(updated);
                                  }}
                                  className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-sans focus:bg-white"
                                />
                              </div>

                              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Changes reflect live on background page!
                                </span>
                                <button 
                                  type="button"
                                  onClick={() => { setEditingMilestoneId(null); playSuccessChime(); }}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Done / हो गया ✓
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-extrabold text-indigo-600 font-mono text-xs">Year {ms.year}</span>
                                <span className="text-xs font-semibold text-slate-700 ml-3">{ms.title}</span>
                                <span className="text-[10px] text-slate-400 ml-2 italic">({ms.category})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => { setEditingMilestoneId(ms.id); playBubbleSound(); }}
                                  className="p-1 px-2.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <DynamicIcon name="LockOpen" size={10} />
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMilestone(ms.id)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <DynamicIcon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          )}
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

                     {/* Achievements Listing with Inline Editing */}
                     <div className="space-y-3">
                       <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Present Achievements accolades list:</span>
                         <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                           ⚡ Auto-saves instantly on typing
                         </span>
                       </div>
                       {achievements.map((ach) => (
                         <div key={ach.id} className="bg-white border border-slate-100 p-3 rounded-2xl shadow-xs transition-all">
                           {editingAchievementId === ach.id ? (
                             <div className="space-y-3 pt-1 text-left">
                               <div className="grid grid-cols-2 gap-2">
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Title</label>
                                   <input
                                     type="text"
                                     value={ach.title}
                                     onChange={(e) => {
                                       const updated = achievements.map(a => a.id === ach.id ? { ...a, title: e.target.value } : a);
                                       onUpdateAchievements(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-semibold focus:bg-white"
                                   />
                                 </div>
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Category</label>
                                   <input
                                     type="text"
                                     value={ach.category}
                                     onChange={(e) => {
                                       const updated = achievements.map(a => a.id === ach.id ? { ...a, category: e.target.value } : a);
                                       onUpdateAchievements(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                   />
                                 </div>
                               </div>

                               <div className="grid grid-cols-3 gap-2">
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Issuer</label>
                                   <input
                                     type="text"
                                     value={ach.issuer}
                                     onChange={(e) => {
                                       const updated = achievements.map(a => a.id === ach.id ? { ...a, issuer: e.target.value } : a);
                                       onUpdateAchievements(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                   />
                                 </div>
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Date</label>
                                   <input
                                     type="date"
                                     value={ach.date}
                                     onChange={(e) => {
                                       const updated = achievements.map(a => a.id === ach.id ? { ...a, date: e.target.value } : a);
                                       onUpdateAchievements(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-mono focus:bg-white"
                                   />
                                 </div>
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Icon</label>
                                   <select
                                     value={ach.iconName}
                                     onChange={(e) => {
                                       const updated = achievements.map(a => a.id === ach.id ? { ...a, iconName: e.target.value } : a);
                                       onUpdateAchievements(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                   >
                                     {AVAILABLE_ACCENT_ICONS.map(ic => (
                                       <option key={ic} value={ic}>{ic}</option>
                                     ))}
                                   </select>
                                 </div>
                               </div>

                               <div>
                                 <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Description</label>
                                 <input
                                   type="text"
                                   value={ach.desc}
                                   onChange={(e) => {
                                     const updated = achievements.map(a => a.id === ach.id ? { ...a, desc: e.target.value } : a);
                                     onUpdateAchievements(updated);
                                   }}
                                   className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                 />
                               </div>

                               <div>
                                 <label className="text-[9px] font-bold text-slate-400 block pb-0.5">External URL link</label>
                                 <input
                                   type="text"
                                   value={ach.linkUrl || ''}
                                   onChange={(e) => {
                                     const updated = achievements.map(a => a.id === ach.id ? { ...a, linkUrl: e.target.value || undefined } : a);
                                     onUpdateAchievements(updated);
                                   }}
                                   className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-mono focus:bg-white"
                                 />
                               </div>

                               <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                 <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   Reflects live behind dialog!
                                 </span>
                                 <button 
                                   type="button"
                                   onClick={() => { setEditingAchievementId(null); playSuccessChime(); }}
                                   className="px-3 py-1.5 bg-indigo-600 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                 >
                                   Done ✓
                                 </button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex justify-between items-center">
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
                               <div className="flex items-center gap-1">
                                 <button
                                   onClick={() => { setEditingAchievementId(ach.id); playBubbleSound(); }}
                                   className="p-1 px-2.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                 >
                                   <DynamicIcon name="LockOpen" size={10} />
                                   Edit
                                 </button>
                                 <button
                                   onClick={() => handleDeleteAchievement(ach.id)}
                                   className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                 >
                                   <DynamicIcon name="Trash2" size={14} />
                                 </button>
                               </div>
                             </div>
                           )}
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
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Resource weblink</label>
                            <SingleClickUpload
                              onUploadSuccess={(url) => setNewPubLink(url)}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                              labelEn="Upload PDF/Photo"
                              labelHi="पीडीएफ/फोटो"
                            />
                          </div>
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

                    {/* Publications Listing with Inline Editing */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Present Registered Publications / Notes:</span>
                        <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          ⚡ Auto-saves instantly on typing
                        </span>
                      </div>
                      {publications.map((p) => (
                        <div key={p.id} className="bg-white border border-slate-100 p-3 rounded-2xl shadow-xs transition-all">
                          {editingPublicationId === p.id ? (
                            <div className="space-y-3 pt-1 text-left">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Publication Title</label>
                                  <input
                                    type="text"
                                    value={p.title}
                                    onChange={(e) => {
                                      const updated = publications.map(pub => pub.id === p.id ? { ...pub, title: e.target.value } : pub);
                                      onUpdatePublications(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-semibold focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Asset Format Type</label>
                                  <select
                                    value={p.type}
                                    onChange={(e) => {
                                      const updated = publications.map(pub => pub.id === p.id ? { ...pub, type: e.target.value as any } : pub);
                                      onUpdatePublications(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                  >
                                    <option value="article">📄 Article Layout</option>
                                    <option value="pdf">📕 PDF Handbook</option>
                                    <option value="notes">📝 Classroom Notes</option>
                                    <option value="departmental">🏛️ Departmental Standard</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Author</label>
                                  <input
                                    type="text"
                                    value={p.author || ''}
                                    onChange={(e) => {
                                      const updated = publications.map(pub => pub.id === p.id ? { ...pub, author: e.target.value } : pub);
                                      onUpdatePublications(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Register Date</label>
                                  <input
                                    type="date"
                                    value={p.date}
                                    onChange={(e) => {
                                      const updated = publications.map(pub => pub.id === p.id ? { ...pub, date: e.target.value } : pub);
                                      onUpdatePublications(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-mono focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between items-center pb-0.5">
                                    <label className="text-[9px] font-bold text-slate-400">Resource Link</label>
                                    <SingleClickUpload
                                      onUploadSuccess={(url) => {
                                        const updated = publications.map(pub => pub.id === p.id ? { ...pub, link: url } : pub);
                                        onUpdatePublications(updated);
                                      }}
                                      accept=".pdf,.doc,.docx,image/*"
                                      labelEn="Upload File"
                                      labelHi="अपलोड"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={p.link}
                                    onChange={(e) => {
                                      const updated = publications.map(pub => pub.id === p.id ? { ...pub, link: e.target.value } : pub);
                                      onUpdatePublications(updated);
                                    }}
                                    className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-mono focus:bg-white"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Content Description Summary</label>
                                <textarea
                                  rows={2}
                                  value={p.desc}
                                  onChange={(e) => {
                                    const updated = publications.map(pub => pub.id === p.id ? { ...pub, desc: e.target.value } : pub);
                                    onUpdatePublications(updated);
                                  }}
                                  className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                />
                              </div>

                              <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Saved live! Updates on-the-spot!
                                </span>
                                <button 
                                  type="button"
                                  onClick={() => { setEditingPublicationId(null); playSuccessChime(); }}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Done ✓
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded capitalize">{p.type}</span>
                                <span className="text-xs font-semibold text-slate-700 ml-2">{p.title}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => { setEditingPublicationId(p.id); playBubbleSound(); }}
                                  className="p-1 px-2.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <DynamicIcon name="LockOpen" size={10} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePublication(p.id)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <DynamicIcon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          )}
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
                              onChange={(e) => setEditingSlideUrl(tryTransformGoogleDriveUrl(e.target.value, 800))}
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
                              onChange={(e) => setNewSlideUrl(tryTransformGoogleDriveUrl(e.target.value, 800))}
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

                {activeAdminTab === 'news' && (
                  <div className="md:col-span-9 p-6 overflow-y-auto max-h-[80vh] space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                          <DynamicIcon name="FileText" size={16} />
                          News & Media Cuttings (समाचार / मीडिया कतरन)
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Manage newspapers, press releases, media coverage graphics and write-ups shown on the front page.
                        </p>
                      </div>
                    </div>

                    {/* Add Form */}
                    <form onSubmit={handleAddNewsCutting} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 mb-6">
                      <div className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1">
                        <span>📰 Add New Media Cutting (नया समाचार पत्र कतरन जोड़ें)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Title (English) *</label>
                          <input
                            type="text"
                            placeholder="e.g. Special Educator Honored by Governor"
                            value={newNewsTitle}
                            onChange={(e) => setNewNewsTitle(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Title (हिन्दी)</label>
                          <input
                            type="text"
                            placeholder="जैसे: राज्यपाल द्वारा विशेष शिक्षक सम्मानित"
                            value={newNewsTitleHi}
                            onChange={(e) => setNewNewsTitleHi(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <div className="flex justify-between items-center pb-1">
                            <label className="text-[10px] font-bold text-slate-500 block">Image URL (Unsplash or direct link)</label>
                            <SingleClickUpload
                              onUploadSuccess={(url) => setNewNewsImageUrl(url)}
                              accept="image/*"
                              labelEn="Upload Photo"
                              labelHi="फोटो"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={newNewsImageUrl}
                            onChange={(e) => setNewNewsImageUrl(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Publishing Date</label>
                          <input
                            type="date"
                            value={newNewsDate}
                            onChange={(e) => setNewNewsDate(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Media House (English)</label>
                          <input
                            type="text"
                            placeholder="e.g. Dainik Bhaskar"
                            value={newNewsSource}
                            onChange={(e) => setNewNewsSource(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Media House (हिन्दी)</label>
                          <input
                            type="text"
                            placeholder="जैसे: दैनिक भास्कर"
                            value={newNewsSourceHi}
                            onChange={(e) => setNewNewsSourceHi(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Summary / Brief (English)</label>
                          <textarea
                            placeholder="Coverage outline..."
                            value={newNewsSummary}
                            onChange={(e) => setNewNewsSummary(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white h-16 resize-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Summary / Brief (हिन्दी)</label>
                          <textarea
                            placeholder="विवरण हिन्दी में..."
                            value={newNewsSummaryHi}
                            onChange={(e) => setNewNewsSummaryHi(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white h-16 resize-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          + Append Media Item
                        </button>
                      </div>
                    </form>

                    {/* News items list with inline editing inputs */}
                    <div className="space-y-3 font-sans">
                      <p className="text-xs font-bold text-slate-400 font-mono">Total Live Media Covers: {newsCuttings.length}</p>
                      
                      {newsCuttings.map((news) => (
                        <div 
                          key={news.id} 
                          className="p-4 bg-white rounded-2xl border border-slate-100/90 shadow-sm transition-all"
                        >
                          {editingNewsId === news.id ? (
                            <div className="space-y-3 text-left">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Title (EN)</label>
                                  <input
                                    type="text"
                                    value={news.title}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, title: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Title (HI)</label>
                                  <input
                                    type="text"
                                    value={news.titleHi || ''}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, titleHi: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white font-semibold"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div className="md:col-span-2">
                                  <div className="flex justify-between items-center pb-0.5">
                                    <label className="text-[9px] font-bold text-slate-400">Image URL</label>
                                    <SingleClickUpload
                                      onUploadSuccess={(url) => {
                                        const updated = newsCuttings.map(n => n.id === news.id ? { ...n, imageUrl: url } : n);
                                        onUpdateNewsCuttings(updated);
                                      }}
                                      accept="image/*"
                                      labelEn="Upload Photo"
                                      labelHi="अपलोड"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={news.imageUrl}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, imageUrl: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 font-mono focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Date</label>
                                  <input
                                    type="date"
                                    value={news.date}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, date: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Media House (EN)</label>
                                  <input
                                    type="text"
                                    value={news.source}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, source: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Media House (HI)</label>
                                  <input
                                    type="text"
                                    value={news.sourceHi || ''}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, sourceHi: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Summary (EN)</label>
                                  <textarea
                                    value={news.summary}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, summary: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white h-12"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Summary (HI)</label>
                                  <textarea
                                    value={news.summaryHi || ''}
                                    onChange={(e) => {
                                      const updated = newsCuttings.map(n => n.id === news.id ? { ...n, summaryHi: e.target.value } : n);
                                      onUpdateNewsCuttings(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white h-12"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => { setEditingNewsId(null); playSuccessChime(); }}
                                  className="px-3 py-1 bg-indigo-600 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Done ✓
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-4 items-center justify-between font-sans">
                              <div className="flex items-center gap-3">
                                {news.imageUrl && (
                                  <img 
                                    src={news.imageUrl} 
                                    className="w-12 h-12 object-cover rounded-xl border border-slate-100 placeholder-news" 
                                    alt={news.title}
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="text-left font-sans">
                                  <p className="text-xs font-extrabold text-slate-700 leading-tight">
                                    {news.title}
                                  </p>
                                  <p className="text-[10px] text-indigo-600 mt-1 font-semibold">
                                    {news.source} • {news.date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => { setEditingNewsId(news.id); playBubbleSound(); }}
                                  className="p-1 px-2.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <DynamicIcon name="LockOpen" size={10} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteNewsCutting(news.id)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <DynamicIcon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAdminTab === 'videos' && (
                  <div className="md:col-span-9 p-6 overflow-y-auto max-h-[80vh] space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                          <DynamicIcon name="Tv" size={16} />
                          Video Broadcasts (वीडियो प्रसारण)
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Manage video embeds, lectures, interviews, training webinars and live streams.
                        </p>
                      </div>
                    </div>

                    {/* Add Form */}
                    <form onSubmit={handleAddVideo} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 mb-6">
                      <div className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1">
                        <span>📹 Add New Video Link (नया वीडियो लिंक जोड़ें)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Title (English) *</label>
                          <input
                            type="text"
                            placeholder="e.g. Inclusive Education Speech"
                            value={newVideoTitle}
                            onChange={(e) => setNewVideoTitle(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Title (हिन्दी)</label>
                          <input
                            type="text"
                            placeholder="जैसे: समावेशी शिक्षा पर व्याख्यान"
                            value={newVideoTitleHi}
                            onChange={(e) => setNewVideoTitleHi(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Video Link (YouTube, Drive or embed url) *</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500 font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Video Badge Label</label>
                          <input
                            type="text"
                            placeholder="e.g. YouTube Live"
                            value={newVideoBadge}
                            onChange={(e) => setNewVideoBadge(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Description (English)</label>
                          <textarea
                            placeholder="Context / notes regarding this broadcast..."
                            value={newVideoDescription}
                            onChange={(e) => setNewVideoDescription(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white h-16 resize-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block pb-1">Description (हिन्दी)</label>
                          <textarea
                            placeholder="विवरण हिन्दी में..."
                            value={newVideoDescriptionHi}
                            onChange={(e) => setNewVideoDescriptionHi(e.target.value)}
                            className="w-full text-xs p-2 border rounded-xl bg-white h-16 resize-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          + Append Video Broadcast
                        </button>
                      </div>
                    </form>

                    {/* Videos items list with inline editing inputs */}
                    <div className="space-y-3 font-sans">
                      <p className="text-xs font-bold text-slate-400 font-mono">Total Live Videos: {videos.length}</p>
                      
                      {videos.map((vid) => (
                        <div 
                          key={vid.id} 
                          className="p-4 bg-white rounded-2xl border border-slate-100/90 shadow-sm transition-all"
                        >
                          {editingVideoId === vid.id ? (
                            <div className="space-y-3 text-left">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Title (EN)</label>
                                  <input
                                    type="text"
                                    value={vid.title}
                                    onChange={(e) => {
                                      const updated = videos.map(v => v.id === vid.id ? { ...v, title: e.target.value } : v);
                                      onUpdateVideos(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white font-semibold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Title (HI)</label>
                                  <input
                                    type="text"
                                    value={vid.titleHi || ''}
                                    onChange={(e) => {
                                      const updated = videos.map(v => v.id === vid.id ? { ...v, titleHi: e.target.value } : v);
                                      onUpdateVideos(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div className="md:col-span-2">
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Video URL</label>
                                  <input
                                    type="text"
                                    value={vid.videoUrl}
                                    onChange={(e) => {
                                      const updated = videos.map(v => v.id === vid.id ? { ...v, videoUrl: e.target.value } : v);
                                      onUpdateVideos(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 font-mono focus:bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Badge Label</label>
                                  <input
                                    type="text"
                                    value={vid.badge || ''}
                                    onChange={(e) => {
                                      const updated = videos.map(v => v.id === vid.id ? { ...v, badge: e.target.value } : v);
                                      onUpdateVideos(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Description (EN)</label>
                                  <textarea
                                    value={vid.description}
                                    onChange={(e) => {
                                      const updated = videos.map(v => v.id === vid.id ? { ...v, description: e.target.value } : v);
                                      onUpdateVideos(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white h-12"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Description (HI)</label>
                                  <textarea
                                    value={vid.descriptionHi || ''}
                                    onChange={(e) => {
                                      const updated = videos.map(v => v.id === vid.id ? { ...v, descriptionHi: e.target.value } : v);
                                      onUpdateVideos(updated);
                                    }}
                                    className="w-full text-xs p-1.5 border rounded-lg bg-slate-50 focus:bg-white h-12"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => { setEditingVideoId(null); playSuccessChime(); }}
                                  className="px-3 py-1 bg-indigo-600 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  Done ✓
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-4 items-center justify-between font-sans">
                              <div className="flex items-center gap-3">
                                <span className="p-2 bg-red-50 text-red-600 rounded-lg">
                                  <DynamicIcon name="Youtube" size={16} />
                                </span>
                                <div className="text-left font-sans">
                                  <p className="text-xs font-extrabold text-slate-700 leading-tight">
                                    {vid.title}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mt-1 font-semibold truncate max-w-sm font-mono">
                                    {vid.videoUrl}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => { setEditingVideoId(vid.id); playBubbleSound(); }}
                                  className="p-1 px-2.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <DynamicIcon name="LockOpen" size={10} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteVideo(vid.id)}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <DynamicIcon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. CUSTOM DYNAMIC PAGES ENGINE */}
                {activeAdminTab === 'customPages' && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b pb-2 flex justify-between items-center">
                      <span>Dynamic Custom Pages Engine</span>
                      <span className="text-xs text-slate-400 font-normal">({customPages.length} Pages Created)</span>
                    </h4>

                    {/* Left: Creator/Editor Desk Form, Right: Pages Directory */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                      
                      {/* Section A: Form Panel (8 cols) */}
                      <div className="xl:col-span-8 bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <span className="text-xs font-black text-slate-705 uppercase tracking-wider flex items-center gap-1.5">
                            <DynamicIcon name="Layout" size={14} className="text-teal-600" />
                            {editingPageId ? 'Edit Page / पेज विवरण बदलें' : 'Create New Custom Page / नया पेज बनाएं'}
                          </span>
                          {editingPageId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPageId('');
                                setPageUrlSlug('');
                                setPageTitle('');
                                setPageTitleHi('');
                                setPageIcon('Sparkles');
                                setPageContent('');
                                setPageContentHi('');
                                setPageIsActive(true);
                                playBubbleSound();
                              }}
                              className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer"
                            >
                              + New Page (नया पेज)
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Page URL Slug (Unique ID, e.g. "isl-glossary")</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. specialized-notes"
                              disabled={!!editingPageId}
                              value={pageUrlSlug}
                              onChange={(e) => setPageUrlSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                              className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 font-mono text-indigo-650 font-bold"
                            />
                            <p className="text-[9px] text-slate-400 mt-1">Unique alphanumeric identifier used as the route path link slug.</p>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Select Icon</label>
                            <select
                              value={pageIcon}
                              onChange={(e) => { setPageIcon(e.target.value); playBubbleSound(); }}
                              className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 font-bold text-slate-750"
                            >
                              {['Sparkles', 'BookOpen', 'GraduationCap', 'Award', 'Globe', 'Compass', 'Star', 'Smile', 'Lightbulb', 'Briefcase', 'Heart', 'Trophy', 'Gamepad2', 'Languages'].map(ic => (
                                <option key={ic} value={ic}>{ic}</option>
                              ))}
                            </select>
                            <p className="text-[9px] text-slate-400 mt-1">Icon displayed in the dock menu launcher.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Page Title (English) / शीर्षक (अंग्रेजी)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. My Custom Notes"
                              value={pageTitle}
                              onChange={(e) => setPageTitle(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 font-bold text-black"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Page Title (Hindi) / शीर्षक (हिंदी)</label>
                            <input
                              type="text"
                              required
                              placeholder="जैसे: मेरे महत्वपूर्ण नोट्स"
                              value={pageTitleHi}
                              onChange={(e) => setPageTitleHi(e.target.value)}
                              className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 font-bold text-black"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Page Content (English / Markdown Supported)</label>
                          <textarea
                            rows={6}
                            required
                            placeholder="Type English content here. You can use markdown titles, bullet points, etc. to format the custom view perfectly."
                            value={pageContent}
                            onChange={(e) => setPageContent(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 font-sans leading-relaxed text-black font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Page Content (Hindi / Markdown / हिंदी भाषा)</label>
                          <textarea
                            rows={6}
                            required
                            placeholder="यहाँ हिंदी में मुख्य सामग्री लिखें..."
                            value={pageContentHi}
                            onChange={(e) => setPageContentHi(e.target.value)}
                            className="w-full text-xs p-2.5 border rounded-xl bg-white mt-1 font-sans leading-relaxed text-black font-medium"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={pageIsActive}
                              onChange={(e) => { setPageIsActive(e.target.checked); playBubbleSound(); }}
                              className="rounded border-slate-300 bg-white"
                            />
                            <span className="text-xs font-bold text-slate-700">Display this page dynamically in the site navigation bar / dock menu</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              if (!pageUrlSlug || !pageTitle || !pageTitleHi || !pageContent || !pageContentHi) {
                                playErrorAlert();
                                alert('Please populate all required fields / सभी आवश्यक फ़ील्ड भरें');
                                return;
                              }

                              // Alphanumeric check
                              const cleanSlug = pageUrlSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
                              if (!cleanSlug) {
                                playErrorAlert();
                                alert('Invalid URL slug');
                                return;
                              }

                              const newPage: CustomPage = {
                                id: cleanSlug,
                                title: pageTitle.trim(),
                                titleHi: pageTitleHi.trim(),
                                iconName: pageIcon,
                                content: pageContent.trim(),
                                contentHi: pageContentHi.trim(),
                                isActive: pageIsActive,
                              };

                              let updatedList: CustomPage[] = [];

                              if (editingPageId) {
                                // update
                                updatedList = (customPages || []).map(p => p.id === editingPageId ? newPage : p);
                                playSuccessChime();
                              } else {
                                // insert check uniqueness
                                if ((customPages || []).some(p => p.id === cleanSlug)) {
                                  playErrorAlert();
                                  alert('A page with that Slug ID already exists! Please use a unique URL slug.');
                                  return;
                                }
                                updatedList = [...(customPages || []), newPage];
                                playSuccessChime();
                              }

                              if (onUpdateCustomPages) {
                                onUpdateCustomPages(updatedList);
                              }

                              // Reset
                              setEditingPageId('');
                              setPageUrlSlug('');
                              setPageTitle('');
                              setPageTitleHi('');
                              setPageIcon('Sparkles');
                              setPageContent('');
                              setPageContentHi('');
                              setPageIsActive(true);
                            }}
                            className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-black shadow-md md:w-auto w-full transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <DynamicIcon name="Save" size={14} />
                            <span>{editingPageId ? 'Update & Live Page' : 'Publish New Page (पेज प्रकाशित करें)'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Section B: Directory List Panel (4 cols) */}
                      <div className="xl:col-span-4 space-y-3.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Created Pages Directory</span>
                        {(!customPages || customPages.length === 0) ? (
                          <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center text-slate-400 text-xs shadow-inner">
                            <DynamicIcon name="File" size={24} className="mx-auto mb-2 text-slate-350 animate-pulse" />
                            <span>No dynamic pages built yet. Build your first custom project page using the creator deck!</span>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                            {customPages.map((page) => (
                              <div
                                key={page.id}
                                className={`p-3.5 rounded-2xl border transition-all ${
                                  editingPageId === page.id 
                                    ? 'bg-indigo-50 border-indigo-250 shadow-sm' 
                                    : 'bg-white hover:bg-slate-50 border-slate-150'
                                } flex items-center justify-between gap-3`}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="p-2 bg-slate-100 dark:bg-slate-850 rounded-xl text-slate-650 shrink-0">
                                    <DynamicIcon name={page.iconName || 'File'} size={14} />
                                  </div>
                                  <div className="overflow-hidden">
                                    <h5 className="font-extrabold text-xs text-slate-800 truncate">
                                      {lang === 'hi' ? page.titleHi || page.title : page.title}
                                    </h5>
                                    <span className="text-[9px] font-mono text-indigo-600 block truncate max-w-xs mt-0.5 font-bold">
                                      /{page.id}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-1">
                                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${page.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                      <span className="text-[8px] font-bold text-slate-450 uppercase tracking-widest leading-none">
                                        {page.isActive ? 'Public & Active' : 'Hidden'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      setEditingPageId(page.id);
                                      setPageUrlSlug(page.id);
                                      setPageTitle(page.title);
                                      setPageTitleHi(page.titleHi || '');
                                      setPageIcon(page.iconName || 'Sparkles');
                                      setPageContent(page.content);
                                      setPageContentHi(page.contentHi || '');
                                      setPageIsActive(page.isActive);
                                      playBubbleSound();
                                    }}
                                    className="p-1 px-2 text-indigo-650 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer"
                                  >
                                    Load
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete this page: /${page.id}? This cannot be undone.`)) {
                                        const updatedList = customPages.filter(p => p.id !== page.id);
                                        if (onUpdateCustomPages) onUpdateCustomPages(updatedList);
                                        if (editingPageId === page.id) {
                                          setEditingPageId('');
                                          setPageUrlSlug('');
                                          setPageTitle('');
                                          setPageTitleHi('');
                                          setPageIcon('Sparkles');
                                          setPageContent('');
                                          setPageContentHi('');
                                        }
                                        playSuccessChime();
                                      } else {
                                        playErrorAlert();
                                      }
                                    }}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                  >
                                    <DynamicIcon name="Trash2" size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

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

                     {/* Listing with Inline Editing */}
                     <div className="space-y-3">
                       <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Present Active Professional Handles:</span>
                         <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                           ⚡ Auto-saves instantly on typing
                         </span>
                       </div>
                       {socialLinks.map((soc) => (
                         <div key={soc.id} className="bg-white border border-slate-100 p-3 rounded-2xl shadow-xs transition-all">
                           {editingSocialId === soc.id ? (
                             <div className="space-y-3 pt-1 text-left">
                               <div className="grid grid-cols-2 gap-2">
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Channel Title</label>
                                   <input
                                     type="text"
                                     value={soc.name}
                                     onChange={(e) => {
                                       const updated = socialLinks.map(s => s.id === soc.id ? { ...s, name: e.target.value } : s);
                                       onUpdateSocialLinks(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-semibold focus:bg-white"
                                   />
                                 </div>
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Category Description</label>
                                   <input
                                     type="text"
                                     value={soc.category || ''}
                                     onChange={(e) => {
                                       const updated = socialLinks.map(s => s.id === soc.id ? { ...s, category: e.target.value } : s);
                                       onUpdateSocialLinks(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
                                   />
                                 </div>
                               </div>

                               <div className="grid grid-cols-2 gap-2">
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Full Webpage Handle Link</label>
                                   <input
                                     type="text"
                                     value={soc.url}
                                     onChange={(e) => {
                                       const updated = socialLinks.map(s => s.id === soc.id ? { ...s, url: e.target.value } : s);
                                       onUpdateSocialLinks(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 font-mono focus:bg-white"
                                   />
                                 </div>
                                 <div>
                                   <label className="text-[9px] font-bold text-slate-400 block pb-0.5">Vector Icon Accent</label>
                                   <select
                                     value={soc.iconName}
                                     onChange={(e) => {
                                       const updated = socialLinks.map(s => s.id === soc.id ? { ...s, iconName: e.target.value } : s);
                                       onUpdateSocialLinks(updated);
                                     }}
                                     className="w-full text-xs p-2 border rounded-xl bg-slate-50 focus:bg-white"
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

                               <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                 <span className="text-[9px] text-emerald-600 font-extrabold flex items-center gap-1">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   Reflects live behind dialog!
                                 </span>
                                 <button 
                                   type="button"
                                   onClick={() => { setEditingSocialId(null); playSuccessChime(); }}
                                   className="px-3 py-1.5 bg-indigo-600 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                 >
                                   Done ✓
                                 </button>
                               </div>
                             </div>
                           ) : (
                             <div className="flex gap-4 items-center justify-between">
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
                               <div className="flex items-center gap-1">
                                 <button
                                   onClick={() => { setEditingSocialId(soc.id); playBubbleSound(); }}
                                   className="p-1 px-2.5 text-indigo-600 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                 >
                                   <DynamicIcon name="LockOpen" size={10} />
                                   Edit
                                 </button>
                                 <button
                                   onClick={() => handleDeleteSocialLink(soc.id)}
                                   className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                 >
                                   <DynamicIcon name="Trash2" size={14} />
                                 </button>
                               </div>
                             </div>
                           )}
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
