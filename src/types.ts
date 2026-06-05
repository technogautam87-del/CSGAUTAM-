export interface TimelineMilestone {
  id: string;
  year: number;
  sortOrder?: number;
  title: string;
  titleHi?: string;
  subtitle?: string;
  subtitleHi?: string;
  category: 'Birth' | 'Education' | 'Career' | 'Achievement' | 'Special Education';
  categoryHi?: string;
  events: string[];
  eventsHi?: string[];
  photos: string[];
  notes: string;
  notesHi?: string;
  achievements: string[];
  achievementsHi?: string[];
}

export interface Publication {
  id: string;
  title: string;
  titleHi?: string;
  type: 'article' | 'pdf' | 'notes' | 'departmental';
  description: string;
  descriptionHi?: string;
  link: string;
  date: string;
  author: string;
}

export interface NewsCutting {
  id: string;
  title: string;
  titleHi?: string;
  imageUrl: string;
  source: string;
  sourceHi?: string;
  date: string;
  summary: string;
  summaryHi?: string;
}

export interface LiveVideo {
  id: string;
  title: string;
  titleHi?: string;
  videoUrl: string; // iframe embed friendly or generic link
  description: string;
  descriptionHi?: string;
  badge?: string;
  badgeHi?: string;
}

export interface Achievement {
  id: string;
  title: string;
  titleHi?: string;
  category: string;
  categoryHi?: string;
  date: string;
  description: string;
  descriptionHi?: string;
  iconName: string; // matches Lucide icon keys
  issuer?: string;
  issuerHi?: string;
  linkUrl?: string; // Optional document or verification link
  linkText?: string; // Link description
  linkTextHi?: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconName: string;
  category: string;
}

export interface SliderPhoto {
  id: string;
  url: string;
  caption: string;
  captionHi?: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroTitleHi: string;
  heroDesc: string;
  heroDescHi: string;
  
  teacherName: string;
  teacherNameHi: string;
  teacherRole: string;
  teacherRoleHi: string;
  teacherBio: string;
  teacherBioHi: string;
  teacherImageUrl: string;

  card1Title: string;
  card1TitleHi: string;
  card1Desc: string;
  card1DescHi: string;
  card1Color: string;
  card1Emoji: string;

  card2Title: string;
  card2TitleHi: string;
  card2Desc: string;
  card2DescHi: string;
  card2Color: string;
  card2Emoji: string;

  card3Title: string;
  card3TitleHi: string;
  card3Desc: string;
  card3DescHi: string;
  card3Color: string;
  card3Emoji: string;

  customAvatarImageUrl?: string;
  usePhotoInsteadOfAvatar?: boolean;
}

