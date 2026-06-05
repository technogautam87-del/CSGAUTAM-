import React from 'react';
import { CustomPage } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface DynamicPageRendererProps {
  page: CustomPage;
  lang?: 'en' | 'hi';
}

export const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ 
  page, 
  lang = 'hi' 
}) => {
  const title = lang === 'hi' ? page.titleHi || page.title : page.title;
  const content = lang === 'hi' ? page.contentHi || page.content : page.content;

  // Simple, robust text to formatted HTML block parser to support standard headers and bullets cleanly
  const renderFormattedBlocks = (text: string) => {
    if (!text) return null;
    
    // Split by single or multiple line breaks to extract structural lines / paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H1 Header `# Header`
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-2xl md:text-3xl font-black text-slate-100 mt-6 mb-3 border-b border-white/10 pb-2 tracking-tight">
            {trimmed.slice(2)}
          </h1>
        );
      }

      // H2 Header `## Header`
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl md:text-2xl font-extrabold text-slate-200 mt-5 mb-2.5 tracking-tight">
            {trimmed.slice(3)}
          </h2>
        );
      }

      // H3 Header `### Header`
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg md:text-xl font-bold text-slate-350 mt-4 mb-2">
            {trimmed.slice(4)}
          </h3>
        );
      }

      // Bullet List `- Item` or `* Item`
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const lines = trimmed.split('\n');
        return (
          <ul key={idx} className="list-disc pl-5 my-3 space-y-1.5 text-slate-300 text-sm md:text-base leading-relaxed">
            {lines.map((ln, lidx) => {
              const cleanLn = ln.trim().replace(/^[-*]\s+/, '');
              return <li key={lidx}>{cleanLn}</li>;
            })}
          </ul>
        );
      }

      // Blockquote `> quote`
      if (trimmed.startsWith('> ')) {
        const lines = trimmed.split('\n');
        const quoteContent = lines.map(ln => ln.trim().replace(/^>\s*/, '')).join(' ');
        return (
          <blockquote key={idx} className="border-l-4 border-teal-500 bg-teal-900/10 p-4 rounded-r-xl my-4 text-xs md:text-sm text-slate-300 italic leading-relaxed">
            {quoteContent}
          </blockquote>
        );
      }

      // Standard paragraph text (preserving inline carriage returns)
      const lines = trimmed.split('\n');
      return (
        <p key={idx} className="text-sm md:text-base text-slate-300 my-3 leading-relaxed font-normal">
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Absolute decorative ambient glow orb */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Navigation Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold text-teal-400 bg-teal-400/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {lang === 'hi' ? 'विशेष पन्ना' : 'Dynamic Page'}
          </span>
          <span className="text-slate-500 text-xs text-bold">/</span>
          <span className="text-xs font-mono text-slate-400">
            {page.id}
          </span>
        </div>

        {/* Title and Icon Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5 pb-6 border-b border-white/10 mb-6 md:mb-8">
          <div className="p-3.5 bg-gradient-to-br from-teal-500/20 to-indigo-500/25 rounded-2xl text-teal-400 border border-white/10 shrink-0 w-fit self-start md:self-center shadow-lg shadow-teal-500/5">
            <DynamicIcon name={page.iconName || 'Sparkles'} size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xs md:text-sm text-slate-450 mt-1">
              {lang === 'hi' ? 'कस्टम स्पेस गैलरी' : 'Specially compiled cinematic workspace container'}
            </p>
          </div>
        </div>

        {/* Styled Content Area */}
        <div className="prose prose-invert max-w-none text-slate-300">
          {renderFormattedBlocks(content)}
        </div>

      </div>
    </div>
  );
};
