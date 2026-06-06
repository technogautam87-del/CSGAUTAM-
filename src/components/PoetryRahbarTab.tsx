import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound, playSuccessChime } from '../audio';

export interface PoemItem {
  id: string;
  title: string;
  titleHi?: string;
  category: 'Ghazal' | 'Nazm' | 'Rubai' | 'Kavita' | 'Sher' | 'Other';
  categoryHi?: string;
  verses: string;
  date: string;
  likes?: number;
}

interface PoetryRahbarTabProps {
  poems: PoemItem[];
  onUpdatePoems: (updated: PoemItem[]) => void;
  lang?: 'en' | 'hi';
  isAdminOpen?: boolean;
}

// Initial seed poems
export const DEFAULT_POEMS: PoemItem[] = [
  {
    id: 'poem-1',
    title: 'The Divine Guide',
    titleHi: 'रहबर की छांव',
    category: 'Ghazal',
    categoryHi: 'ग़ज़ल',
    verses: `राहों में कांटे हों चाहे जितने, राह समझाने कोई तो आएगा,
उदास दिल से पुकारोगे रहबर को, अंधेरा चीर रास्ता मिल जाएगा।

चिरागों की लौ भले ही मद्धम पड़ जाए तूफानों के दरमियां,
किताबों के पन्नों से उम्मीद का नया सवेरा फिर मुस्कुराएगा।

कलम जो थामी है रहबर ने तो हौसले भी बुलंद होंगे,
अज्ञान का ये कोहरा ज्ञान की तेज किरणों से पिघल जाएगा।`,
    date: '2026-06-01',
    likes: 24
  },
  {
    id: 'poem-2',
    title: 'The Silent Lamp',
    titleHi: 'मौन शिक्षक का दीप',
    category: 'Kavita',
    categoryHi: 'कविता',
    verses: `मौन रहकर जो राह दिखाता,
वही तो सच्चा शिक्षक कहलाता।
स्याही के गहरे सागर में डूबकर,
जो बच्चों के भाग को चमकाता।

खुद जलकर जो रोशन करता,
दूसरों के जीवन का हर कोना,
रहबर बनकर वो साथ चलता,
सिखाता है मुश्किलों में भी न रोना।`,
    date: '2026-05-15',
    likes: 18
  },
  {
    id: 'poem-3',
    title: 'Light of Effort',
    titleHi: 'कोशिश का उजाला',
    category: 'Sher',
    categoryHi: 'शेर',
    verses: `मंजिलें लाख कठिन हों पर हौसला कम मत करना,
हर अंधेरी रात के पीछे सुबह का उजाला है सजना।

जो पसीने की बूंदों से सींचते हैं अपने सपनों को,
उनके कदमों में ही सारा जहाँ झुकता है मेरे रहनुमा।`,
    date: '2026-04-20',
    likes: 31
  },
  {
    id: 'poem-4',
    title: 'Path of Wisdom',
    titleHi: 'रहबर की रुबाई',
    category: 'Rubai',
    categoryHi: 'रुबाई',
    verses: `हर इक मंज़र को अपनी आँख से आसान कर देना,
जहाँ नफ़रत धधकती हो वहाँ पर प्यार भर देना।
सिखाया है हमें रहबर ने इंसानियत का ये सबक,
कि भूखे लब की खातिर अपनी रोटी दान कर देना।`,
    date: '2026-03-10',
    likes: 42
  }
];

export const PoetryRahbarTab: React.FC<PoetryRahbarTabProps> = ({
  poems = [],
  onUpdatePoems,
  lang = 'hi',
  isAdminOpen = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Compose item states
  const [showComposer, setShowComposer] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTitleHi, setNewTitleHi] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Ghazal' | 'Nazm' | 'Rubai' | 'Kavita' | 'Sher' | 'Other'>('Ghazal');
  const [newVerses, setNewVerses] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Edit item states
  const [editingPoemId, setEditingPoemId] = useState<string | null>(null);

  const displayPoems = poems.length > 0 ? poems : DEFAULT_POEMS;

  // Filter and search
  const filteredPoems = displayPoems.filter((p) => {
    const categoryMatch = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = (p.title || '').toLowerCase().includes(searchLower) || (p.titleHi || '').toLowerCase().includes(searchLower);
    const versesMatch = (p.verses || '').toLowerCase().includes(searchLower);
    
    return categoryMatch && (titleMatch || versesMatch);
  });

  const categories = [
    { key: 'all', labelHi: 'सभी काव्य', labelEn: 'All Poetry' },
    { key: 'ghazal', labelHi: 'ग़ज़ल', labelEn: 'Ghazal' },
    { key: 'nazm', labelHi: 'नज़्म', labelEn: 'Nazm' },
    { key: 'rubai', labelHi: 'रुबाई', labelEn: 'Rubai' },
    { key: 'kavita', labelHi: 'कविता', labelEn: 'Kavita' },
    { key: 'sher', labelHi: 'शेर व शायरी', labelEn: 'Couplets (Sher)' },
    { key: 'other', labelHi: 'अन्य रचनाएँ', labelEn: 'Other' },
  ];

  // Copy verses helper
  const handleCopy = (poem: PoemItem) => {
    navigator.clipboard.writeText(`${poem.titleHi || poem.title}\n\n${poem.verses}`);
    setCopiedId(poem.id);
    playBubbleSound();
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Like a poem (+1 Appreciation)
  const handleLike = (poemId: string) => {
    const updated = displayPoems.map((p) => {
      if (p.id === poemId) {
        return { ...p, likes: (p.likes || 0) + 1 };
      }
      return p;
    });
    playSuccessChime();
    onUpdatePoems(updated);
  };

  // Save new poem
  const handleSavePoem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleHi.trim() && !newTitle.trim()) return;
    if (!newVerses.trim()) return;

    const newPoem: PoemItem = {
      id: `poem-${Date.now()}`,
      title: newTitle.trim() || newTitleHi.trim(),
      titleHi: newTitleHi.trim() || newTitle.trim(),
      category: newCategory,
      categoryHi: getCategoryHindi(newCategory),
      verses: newVerses.trim(),
      date: newDate || new Date().toISOString().split('T')[0],
      likes: 0
    };

    const updated = [newPoem, ...displayPoems];
    onUpdatePoems(updated);
    
    // Clear forms
    setNewTitle('');
    setNewTitleHi('');
    setNewVerses('');
    setShowComposer(false);
    playSuccessChime();
  };

  // Delete poem
  const handleDeletePoem = (id: string) => {
    if (confirm(lang === 'hi' ? 'क्या आप इस सुंदर कविता को काव्य संग्रह से हटाना चाहते हैं?' : 'Are you sure you want to delete this poetry?')) {
      const updated = displayPoems.filter(p => p.id !== id);
      onUpdatePoems(updated);
      playBubbleSound();
    }
  };

  // Start edit mode
  const startEditing = (p: PoemItem) => {
    setEditingPoemId(p.id);
    setNewTitle(p.title || '');
    setNewTitleHi(p.titleHi || '');
    setNewCategory(p.category);
    setNewVerses(p.verses);
    setNewDate(p.date);
    setShowComposer(true);
    playBubbleSound();
  };

  // Save edits
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoemId) return;

    const updated = displayPoems.map((p) => {
      if (p.id === editingPoemId) {
        return {
          ...p,
          title: newTitle.trim(),
          titleHi: newTitleHi.trim(),
          category: newCategory,
          categoryHi: getCategoryHindi(newCategory),
          verses: newVerses.trim(),
          date: newDate
        };
      }
      return p;
    });

    onUpdatePoems(updated);
    setEditingPoemId(null);
    setNewTitle('');
    setNewTitleHi('');
    setNewVerses('');
    setShowComposer(false);
    playSuccessChime();
  };

  const getCategoryHindi = (cat: string) => {
    switch (cat) {
      case 'Ghazal': return 'ग़ज़ल';
      case 'Nazm': return 'नज़्म';
      case 'Rubai': return 'रुबाई';
      case 'Kavita': return 'कविता';
      case 'Sher': return 'शेर';
      default: return 'अन्य';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 relative">
      
      {/* Decorative ambient glowing backdrops representing literary wisdom */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container with stronger, high-contrast, more solid background for ultimate legibility */}
      <div className="bg-slate-900/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Card Header Decoration */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-rose-500/30 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            {lang === 'hi' ? 'विशेष रचना संग्रह' : 'Featured Collection'}
          </span>
          <span className="text-slate-500 text-xs font-bold">/</span>
          <span className="text-xs font-mono text-slate-300">rahbar_poetry</span>
        </div>

        {/* Title and Ink Splash Intro */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-rose-500/35 to-amber-500/35 rounded-2xl text-rose-300 border border-white/20 shrink-0 shadow-lg shadow-rose-500/10">
              <DynamicIcon name="Sparkles" size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-rose-200 tracking-tight leading-tight font-sans">
                {lang === 'hi' ? 'रहबर काव्य-साधना' : 'Rahbar Poetry Sanctuary'}
              </h1>
              <p className="text-sm md:text-base text-slate-300 mt-1.5 max-w-2xl font-normal leading-relaxed">
                {lang === 'hi' 
                  ? 'शब्दों से सजी गजलें, कविताएं, नज्में और जज्बातों की रूहानी सरगम।' 
                  : 'A divine sanctuary of Ghazals, Kavitas, Nazms, and couplets composed from the soul.'}
              </p>
            </div>
          </div>

          {/* Admin composition toggle - show if admin is open */}
          {isAdminOpen && (
            <button
              onClick={() => {
                setEditingPoemId(null);
                setNewTitle('');
                setNewTitleHi('');
                setNewVerses('');
                setShowComposer(!showComposer);
                playBubbleSound();
              }}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white hover:text-white font-extrabold text-sm md:text-base rounded-2xl shadow-xl hover:shadow-rose-500/25 border-t border-white/30 cursor-pointer transform-gpu active:scale-95 transition-all duration-200 shrink-0 self-start md:self-center"
            >
              <DynamicIcon name={showComposer ? 'X' : 'SquarePen'} size={18} />
              {showComposer 
                ? (lang === 'hi' ? 'लेखक मंच बंद करें' : 'Close Composer') 
                : (lang === 'hi' ? 'नई कविता लिखें (लेखन)' : 'Write New Poem')}
            </button>
          )}
        </div>

        {/* Inline Poetry Composer Panel */}
        <AnimatePresence>
          {showComposer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8 border-b border-white/15 pb-8"
            >
              <form 
                onSubmit={editingPoemId ? handleEditSave : handleSavePoem}
                className="bg-slate-950/70 border border-white/20 p-5 md:p-8 rounded-2xl space-y-4 shadow-2xl relative z-20"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-rose-300 font-black text-sm uppercase tracking-wider">
                    <DynamicIcon name="Feather" size={20} />
                    <span>{editingPoemId ? (lang === 'hi' ? 'कविता संपादित करें' : 'Edit Poem') : (lang === 'hi' ? 'लेखन कक्ष (Write Verse)' : 'Poetry Workspace')}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setShowComposer(false); setEditingPoemId(null); }}
                    className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 p-1 rounded-full transition-colors"
                  >
                    <DynamicIcon name="X" size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title Hindi */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">कविता/ग़ज़ल का शीर्षक (Hindi)</label>
                    <input
                      type="text"
                      required
                      value={newTitleHi}
                      onChange={(e) => setNewTitleHi(e.target.value)}
                      placeholder="उदा. रहबर की छांव"
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-450 focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all placeholder:text-slate-500 font-medium"
                    />
                  </div>

                  {/* Title English */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">Title (English / Phonetic)</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Rahbar Ki Chhaon"
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-450 focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all placeholder:text-slate-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category select */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">विधा / प्रकार (Category)</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-450 focus:outline-none transition-all font-medium"
                    >
                      <option value="Ghazal" className="bg-slate-900 text-white">ग़ज़ल (Ghazal)</option>
                      <option value="Nazm" className="bg-slate-900 text-white">नज़्म (Nazm)</option>
                      <option value="Rubai" className="bg-slate-900 text-white">रुबाई (Rubai)</option>
                      <option value="Kavita" className="bg-slate-900 text-white">कविता (Kavita)</option>
                      <option value="Sher" className="bg-slate-900 text-white">शेर (Sher/Shayari)</option>
                      <option value="Other" className="bg-slate-900 text-white">अन्य (Other)</option>
                    </select>
                  </div>

                  {/* Optional Date */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">तिथि (Date)</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-450 focus:outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Verses Text Area */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">काव्य पंक्तियाँ (Poem Verses - Supports Line Breaks)</label>
                  <textarea
                    required
                    rows={6}
                    value={newVerses}
                    onChange={(e) => setNewVerses(e.target.value)}
                    placeholder="अपनी कविता या शेरो-शायरी यहाँ लिखें। पंक्तियों को बदलने के लिए Enter दबाएं।"
                    className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors font-serif italic text-center whitespace-pre-wrap leading-relaxed select-all"
                  />
                  <span className="text-[10px] text-slate-450 block font-medium">पंक्तियों को सुंदर दिखने के लिए मध्य में केंद्रित (centered) किया जाएगा।</span>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => { setShowComposer(false); setEditingPoemId(null); }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-lg border border-white/15 hover:shadow-emerald-500/15 cursor-pointer active:scale-95 transition-all duration-150"
                  >
                    <span className="flex items-center gap-1.5">
                      <DynamicIcon name="Sparkles" size={14} />
                      {editingPoemId 
                        ? (lang === 'hi' ? 'सुधार सहेजें' : 'Save Changes') 
                        : (lang === 'hi' ? 'संग्रह में सहेजें (Save)' : 'Save to Sanctuary')}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Tabs & Search Panel */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between mb-8">
          {/* Scrollable category selection with highly visible border-solid cards */}
          <div className="flex items-center gap-2 self-start overflow-x-auto pb-2 md:pb-0 w-full md:w-auto max-w-full scrollbar-hidden">
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    playBubbleSound();
                  }}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 border transform active:scale-95 ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 border-rose-400 text-white shadow-xl shadow-rose-500/10 scale-102 font-black'
                      : 'bg-slate-800 hover:bg-slate-700/90 border-slate-700/80 text-slate-100 hover:text-white font-bold'
                  }`}
                >
                  {lang === 'hi' ? cat.labelHi : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Quick Search with high visibility borders */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
              <DynamicIcon name="Search" size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'शीर्षक या शब्द खोजें...' : 'Search poetry content...'}
              className="w-full bg-slate-950 border-2 border-slate-700/90 rounded-xl pl-9 pr-8 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-450 focus:border-rose-450 focus:outline-none transition-all focus:ring-1 focus:ring-rose-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <DynamicIcon name="X" size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filtered Poetry List Grid */}
        <AnimatePresence mode="popLayout">
          {filteredPoems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center text-slate-300 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950/40"
            >
              <div className="w-14 h-14 bg-slate-800 border border-slate-700 text-rose-300 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <DynamicIcon name="Compass" size={24} />
              </div>
              <p className="font-extrabold text-base md:text-lg text-slate-100">
                {lang === 'hi' ? 'कोई काव्य रचना नहीं मिली' : 'No Poetry Matches'}
              </p>
              <p className="text-xs text-slate-400 mt-1.5 font-medium">
                {lang === 'hi' ? 'कृपया अन्य श्रेणी या शब्दों का उपयोग करें।' : 'Try checking another tag or clearing your search.'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPoems.map((poem, index) => {
                const isCopied = copiedId === poem.id;
                
                return (
                  <motion.div
                    key={poem.id}
                    layoutProps={{ transition: { duration: 0.25 } }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: Math.min(0.1, index * 0.04) }}
                    className="bg-slate-950 border-2 border-slate-800/85 hover:border-rose-500/40 rounded-2.5xl overflow-hidden shadow-2xl hover:shadow-rose-500/5 group relative transform-gpu duration-300 flex flex-col justify-between"
                  >
                    
                    {/* Header: Category Badge and Date */}
                    <div className="px-5 py-4 border-b border-slate-850 flex items-center justify-between text-xs bg-slate-900/40">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 px-3 rounded-lg font-black text-[10px] uppercase tracking-widest bg-rose-500/15 border border-rose-500/35 text-rose-200 shadow-sm">
                          {lang === 'hi' ? poem.categoryHi || getCategoryHindi(poem.category) : poem.category}
                        </span>
                        
                        {/* Optional marker */}
                        {poem.likes && poem.likes > 25 && (
                          <span className="text-[10px] text-amber-300 font-extrabold flex items-center gap-1 bg-amber-400/15 border border-amber-400/35 px-2 py-0.5 rounded-lg shadow-sm">
                            ⭐ Popular
                          </span>
                        )}
                      </div>
                      
                      <div className="text-slate-350 hover:text-slate-200 font-semibold font-mono flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                        <DynamicIcon name="CalendarDays" size={11} className="text-rose-300" />
                        <span>{poem.date}</span>
                      </div>
                    </div>

                    {/* Poetry Content Scroll (Body) - Enhanced with superior print contrast & warmth */}
                    <div className="p-6 md:p-8 flex-grow flex flex-col items-center justify-center relative min-h-[170px] bg-gradient-to-b from-slate-950 to-slate-900/60 overflow-hidden">
                      
                      {/* Stylized background watermark for literary accent */}
                      <span className="absolute text-8xl md:text-9xl text-white/[0.025] font-serif select-none pointer-events-none top-4 left-4 font-mono leading-none">
                        ✍️
                      </span>

                      {/* Poetry verses centered beautifully with vibrant, ultra-legible ivory-gold color */}
                      <div className="whitespace-pre-line font-serif italic text-center text-amber-50 font-medium text-sm md:text-lg leading-8 md:leading-9 tracking-widest my-3 max-w-md relative z-10 select-all font-sans px-4">
                        {poem.verses}
                      </div>
                    </div>

                    {/* Footer Row: Title, appreciates/likes and active admin edits */}
                    <div className="px-5 py-4 border-t border-slate-850 bg-slate-900/50 flex items-center justify-between flex-wrap gap-3">
                      <div className="text-left">
                        <h4 className="font-extrabold text-sm md:text-base text-white tracking-tight leading-tight group-hover:text-amber-200 transition-colors">
                          {lang === 'hi' ? poem.titleHi || poem.title : poem.title}
                        </h4>
                      </div>

                      {/* Action Triggers with robust borders and crisp high-visibility text */}
                      <div className="flex items-center gap-2">
                        {/* Likes trigger */}
                        <button
                          onClick={() => handleLike(poem.id)}
                          className="flex items-center gap-1.5 text-xs font-black text-slate-200 hover:text-rose-300 cursor-pointer bg-slate-800 border-2 border-slate-700/90 hover:border-rose-450 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl active:scale-90 transition-all duration-150 shadow-md"
                        >
                          <DynamicIcon 
                            name="Heart" 
                            size={14} 
                            className={`transition-colors ${(poem.likes || 0) > 0 ? 'fill-rose-500 text-rose-400 animate-pulse' : 'text-slate-300'}`} 
                          />
                          <span>{poem.likes || 0}</span>
                        </button>

                        {/* Copy trigger */}
                        <button
                          onClick={() => handleCopy(poem)}
                          title={lang === 'hi' ? 'कॉपी करें' : 'Copy verses'}
                          className="p-2 rounded-xl text-slate-200 hover:text-teal-300 cursor-pointer bg-slate-800 border-2 border-slate-700/90 hover:border-teal-450 hover:bg-teal-500/10 active:scale-90 transition-all duration-150 shadow-md"
                        >
                          <DynamicIcon name={isCopied ? 'Check' : 'Copy'} size={14} className={isCopied ? 'text-teal-450' : 'text-slate-200'} />
                        </button>

                        {/* Admin Action Box */}
                        {isAdminOpen && (
                          <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2 ml-1">
                            {/* Edit */}
                            <button
                              onClick={() => startEditing(poem)}
                              title={lang === 'hi' ? 'संपादित करें' : 'Edit poetry'}
                              className="p-2 rounded-xl text-slate-200 hover:text-amber-300 cursor-pointer bg-slate-800 border-2 border-slate-700/90 hover:border-amber-450 hover:bg-amber-500/10 active:scale-95 transition-all shadow-md"
                            >
                              <DynamicIcon name="FilePen" size={14} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeletePoem(poem.id)}
                              title={lang === 'hi' ? 'डिलीट करें' : 'Delete'}
                              className="p-2 rounded-xl text-slate-200 hover:text-rose-400 cursor-pointer bg-slate-800 border-2 border-slate-700/90 hover:border-rose-450 hover:bg-rose-500/10 active:scale-95 transition-all shadow-md"
                            >
                              <DynamicIcon name="Trash2" size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
