import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SliderPhoto } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound, playSuccessChime } from '../audio';
import { TRANSLATIONS } from '../translations';

interface PhotoGalleryTabProps {
  photos: SliderPhoto[];
  lang?: 'en' | 'hi';
}

export const PhotoGalleryTab: React.FC<PhotoGalleryTabProps> = ({
  photos,
  lang = 'hi',
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    playSuccessChime();
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
    playBubbleSound();
  };

  const handleNavigate = (direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null || photos.length === 0) return;

    if (direction === 'next') {
      setSelectedPhotoIndex((prev) => (prev! + 1) % photos.length);
    } else {
      setSelectedPhotoIndex((prev) => (prev! - 1 + photos.length) % photos.length);
    }
    playBubbleSound();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 text-left">
      
      {/* 1. SECTION HEADER */}
      <div className="text-center md:text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-150 text-indigo-700 rounded-full text-xs font-bold leading-none">
          <DynamicIcon name="Image" size={14} />
          <span>{lang === 'en' ? 'PORTFOLIO MEMORIES' : 'डिजिटल यादें'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-none mt-2">
          {t.photoGallery}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm max-w-2xl font-sans font-medium">
          {t.gallerySubtitle}
        </p>
      </div>

      {/* 2. GALLERY GRID */}
      {photos.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm space-y-4">
          <span className="text-4xl block">🖼️</span>
          <h3 className="font-bold text-slate-800 text-sm">
            {lang === 'en' ? 'No photos in gallery yet' : 'गैलरी में कोई फोटो उपलब्ध नहीं है'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            {lang === 'en' 
              ? 'Please access the Admin Panel (with code 2026) and add photos under the "Photo Gallery" tab!' 
              : 'कृपया एडमिन पैनल खोलें (कोड 2026 दर्ज करें) और "Photo Gallery / चित्र गैलरी" टैब के तहत फोटो जोड़ें!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => handleOpenLightbox(index)}
              className="group bg-white border border-slate-150 rounded-[28px] overflow-hidden cursor-pointer shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              id={`photo-card-${photo.id}`}
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b">
                <img
                  src={photo.url}
                  referrerPolicy="no-referrer"
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Visual hovering indicator */}
                <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-white/90 text-slate-800 rounded-full shadow-lg backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform duration-300">
                    <DynamicIcon name="Maximize2" size={16} />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur-xs text-white text-[9px] font-bold px-2.5 py-1 rounded-lg">
                  {index + 1} / {photos.length}
                </div>
              </div>

              {/* Caption details box */}
              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md shrink-0 mt-0.5">EN</span>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed font-sans line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>
                  {photo.captionHi && (
                    <div className="flex gap-2 items-start border-t border-slate-100 pt-2.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-md shrink-0 mt-0.5">HI</span>
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed font-sans line-clamp-2">
                        {photo.captionHi}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 text-right">
                  <span className="text-[10px] text-teal-600 font-bold group-hover:underline transition-all">
                    {lang === 'en' ? 'View Large' : 'बड़ा चित्र देखें'} &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 3. LIGHTBOX WINDOW MODAL */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseLightbox}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 md:p-6 select-none"
            id="gallery-lightbox-overlay"
          >
            {/* Header control buttons */}
            <div className="flex items-center justify-between w-full max-w-5xl mx-auto pt-2">
              <div className="text-left text-white/80">
                <p className="text-[10px] font-black tracking-widest uppercase text-teal-400">
                  {lang === 'en' ? 'INCLUSION GALLERY PREVIEW' : 'इंटरएक्टिव चित्र गैलरी'}
                </p>
                <p className="text-xs text-white mt-0.5">
                  📁 {lang === 'en' ? 'Photo' : 'चित्र'} {selectedPhotoIndex + 1} {lang === 'en' ? 'of' : 'में से'} {photos.length}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseLightbox}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer border border-white/10 active:scale-95"
                title="Close overlay"
              >
                <DynamicIcon name="X" size={20} />
              </button>
            </div>

            {/* Central Slide Display Image and Navigation Arrow Rings */}
            <div className="flex-1 w-full max-w-5xl mx-auto flex items-center justify-between relative gap-2 my-4">
              
              {/* Left Arrow */}
              <button
                onClick={(e) => handleNavigate('prev', e)}
                className="p-3 md:p-4 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all cursor-pointer border border-white/10 z-10 hidden sm:block"
                title="Previous photo"
              >
                <DynamicIcon name="ChevronLeft" size={24} />
              </button>

              {/* Central Img Box */}
              <motion.div 
                key={selectedPhotoIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()} // don't close when clicking photo itself
                className="flex-1 h-full max-h-[60vh] md:max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl relative"
              >
                <img
                  src={photos[selectedPhotoIndex].url}
                  referrerPolicy="no-referrer"
                  alt={photos[selectedPhotoIndex].caption}
                  className="max-w-full max-h-full object-contain rounded-2xl border border-white/10 shadow-2xl"
                />
              </motion.div>

              {/* Right Arrow */}
              <button
                onClick={(e) => handleNavigate('next', e)}
                className="p-3 md:p-4 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all cursor-pointer border border-white/10 z-10 hidden sm:block"
                title="Next photo"
              >
                <DynamicIcon name="ChevronRight" size={24} />
              </button>
            </div>

            {/* Mobile quick swipe fallback/tap areas */}
            <div className="sm:hidden flex justify-center gap-6 mb-4">
              <button
                onClick={(e) => handleNavigate('prev', e)}
                className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1 active:scale-95"
              >
                &larr; {lang === 'en' ? 'Prev' : 'पिछला'}
              </button>
              <button
                onClick={(e) => handleNavigate('next', e)}
                className="px-5 py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1 active:scale-95"
              >
                {lang === 'en' ? 'Next' : 'अगला'} &rarr;
              </button>
            </div>

            {/* Bottom Caption and info layout */}
            <div className="w-full max-w-3xl mx-auto bg-slate-900/60 p-5 rounded-2xl border border-white/10 text-white text-left space-y-2 mb-2">
              <div className="flex gap-2 items-start">
                <span className="text-[9px] bg-indigo-600 font-extrabold text-white px-1.5 py-0.5 rounded leading-none">EN</span>
                <p className="text-xs md:text-sm font-semibold tracking-wide">
                  {photos[selectedPhotoIndex].caption}
                </p>
              </div>
              {photos[selectedPhotoIndex].captionHi && (
                <div className="flex gap-2 items-start border-t border-white/10 pt-2">
                  <span className="text-[9px] bg-emerald-600 font-extrabold text-white px-1.5 py-0.5 rounded leading-none">HI</span>
                  <p className="text-xs md:text-sm font-semibold tracking-wide text-slate-250">
                    {photos[selectedPhotoIndex].captionHi}
                  </p>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};
