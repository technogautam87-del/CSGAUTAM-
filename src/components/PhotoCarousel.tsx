import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SliderPhoto } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { playBubbleSound } from '../audio';

interface PhotoCarouselProps {
  photos: SliderPhoto[];
  autoPlayInterval?: number;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  autoPlayInterval = 4000,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % photos.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length, autoPlayInterval]);

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % photos.length);
    playBubbleSound();
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + photos.length) % photos.length);
    playBubbleSound();
  };

  if (photos.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/60 group">
      
      {/* Autoplay status bar */}
      {isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/20 z-20">
          <motion.div
            key={currentIdx}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-teal-400 to-indigo-400"
          />
        </div>
      )}

      {/* Main Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={photos[currentIdx].id}
          initial={{ opacity: 0.8, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Cover Image */}
          <img
            src={photos[currentIdx].url}
            referrerPolicy="no-referrer"
            alt={photos[currentIdx].caption}
            className="w-full h-full object-cover"
          />

          {/* Gradients Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/40" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Controls */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handlePrev}
          className="pointer-events-auto p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md cursor-pointer transition-all active:scale-90"
        >
          <DynamicIcon name="ChevronLeft" size={20} />
        </button>
        <button
          onClick={handleNext}
          className="pointer-events-auto p-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md cursor-pointer transition-all active:scale-90"
        >
          <DynamicIcon name="ChevronRight" size={20} />
        </button>
      </div>

      {/* Text Info Overlay (Elegant Bottom Corner Panel) */}
      <div className="absolute bottom-6 left-6 right-6 md:left-8 md:right-8 bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 transition-all hover:bg-slate-900/50">
        <div className="max-w-xl">
          <span className="px-2.5 py-0.5 bg-gradient-to-r from-pink-500 to-amber-500 text-white font-extrabold text-[10px] rounded-md tracking-wider uppercase inline-block mb-2">
            Google Drive Mirror &bull; Cover Slide {currentIdx + 1}
          </span>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
            {photos[currentIdx].caption}
          </h3>
          <p className="text-[11px] text-slate-300 mt-0.5 italic">
            Curated highlight from Chandrashekhar's school program archive.
          </p>
        </div>

        {/* Indicators and Play/Pause */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Play / Pause Toggle Button */}
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              playBubbleSound();
            }}
            className="p-2 bg-white/15 hover:bg-white/25 rounded-lg text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
            title={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Dots group indicator */}
          <div className="flex gap-1.5">
            {photos.map((ph, idx) => (
              <button
                key={ph.id}
                onClick={() => {
                  setCurrentIdx(idx);
                  playBubbleSound();
                }}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  idx === currentIdx ? 'w-6 bg-teal-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
