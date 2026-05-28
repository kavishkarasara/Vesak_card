import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { CoverType, CARD_COVERS } from './CardCovers';
import { Sparkles, RotateCcw, X } from 'lucide-react';
import buddhaImage from '../image1/edited-photo.png';

interface CardEnvelopeProps {
  cover: CoverType;
  sender: string;
  receiver: string;
  poem: string;
  initiallyOpen?: boolean;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export const CardEnvelope: React.FC<CardEnvelopeProps> = ({
  cover,
  sender,
  receiver,
  poem,
  initiallyOpen = false,
  onOpenStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const activeCover = CARD_COVERS.find((c) => c.id === cover) || CARD_COVERS[0];
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setIsOpen(initiallyOpen);
  }, [initiallyOpen]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (isOpen) {
        if (width < 360) {
          // Extremely narrow screen
          // Opened card width is 560px (280 * 2).
          setScale(Math.max(0.48, (width - 20) / 560));
        } else if (width < 640) {
          // Mobile screens
          // Scale to occupy 95% of the viewport width
          setScale(Math.min(0.95, (width * 0.95) / 560));
        } else {
          // Tablet / Desktop screens
          // Base width is 320px, opened width is 640px.
          setScale(Math.min(1.0, (width * 0.9) / 640));
        }
      } else {
        // Closed state scaling for very small screens
        if (width < 300) {
          setScale(width / 320);
        } else {
          setScale(1.0);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    if (onOpenStateChange) {
      onOpenStateChange(true);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid double triggering
    setIsOpen(false);
    if (onOpenStateChange) {
      onOpenStateChange(false);
    }
  };

  // Determine font size based on poem length to prevent any vertical scrolling
  const getPoemFontSizeClass = (text: string) => {
    const lines = text.split('\n').length;
    const length = text.length;
    
    if (lines > 6 || length > 120) {
      return 'text-[9px] xs:text-[10px] sm:text-xs leading-normal';
    }
    if (lines > 4 || length > 90) {
      return 'text-[10px] xs:text-[11px] sm:text-[13px] leading-relaxed';
    }
    return 'text-xs sm:text-sm leading-relaxed';
  };

  // Determine poem padding/margins based on length to optimize space on mobile
  const getPoemContainerClass = (text: string) => {
    const lines = text.split('\n').length;
    const length = text.length;
    
    if (lines > 4 || length > 95) {
      return 'relative p-2 sm:p-4 rounded-xl bg-black/60 border border-amber-500/10 text-center shadow-inner my-1 sm:my-2 z-10';
    }
    return 'relative p-3 sm:p-4 rounded-xl bg-black/60 border border-amber-500/10 text-center shadow-inner my-1.5 sm:my-2.5 z-10';
  };

  return (
    <div 
      className="relative w-full flex items-center justify-center min-h-[460px] sm:min-h-[500px] perspective-3d py-8 select-none"
      onClick={isOpen ? (e) => {
        // If the user clicks the outer wrapper background (outside the card), close the card
        if (e.target === e.currentTarget) {
          handleClose(e);
        }
      } : undefined}
    >
      {/* 3D Greeting Card Container */}
      <motion.div
        layout
        className="relative preserve-3d flex w-[280px] h-[420px] sm:w-[320px] sm:h-[460px] rounded-3xl shadow-xl"
        style={{
          boxShadow: isOpen ? `0 0 50px ${activeCover.shadowColor}` : '0 15px 35px rgba(0,0,0,0.5)',
          originX: isOpen ? 0 : 0.5,
          originY: 0.5,
        }}
        animate={{
          x: isOpen ? '50%' : '0%',
          scale: scale,
        }}
        whileHover={{
          scale: !isOpen ? 1.02 : scale,
        }}
        transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        onClick={!isOpen ? handleOpen : undefined}
      >
        {/* A. INSIDE RIGHT PAGE: Static Base Page containing the text */}
        <div 
          className={`absolute inset-0 glass-panel-heavy border border-amber-500/25 rounded-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-inner transition-opacity duration-300 ${
            isOpen ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Gold paper texture aura */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Inset Luxury Gold Border */}
          <div className="absolute inset-1.5 border border-amber-500/10 rounded-[22px] pointer-events-none z-0" />

          {/* Top Close button */}
          <button
            onClick={handleClose}
            className={`absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-40 cursor-pointer ${
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            }`}
            title="Close Card"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Sender Name (විසින්) - Placed at the Top */}
          <div className="z-10 flex flex-col items-start w-full">
            <span className="font-sinhala text-[9px] uppercase tracking-widest text-amber-400/60 block mb-0.5">විසින් (From)</span>
            <h3 className="font-name italic text-lg sm:text-xl font-bold text-glow-gold text-white tracking-wide truncate max-w-full drop-shadow-md pr-4">
              {sender}
            </h3>
            {/* Golden Star Divider */}
            <div className="flex items-center gap-1 mt-1 opacity-80">
              <div className="h-[1px] w-12 bg-gradient-to-r from-amber-500 to-transparent" />
              <span className="text-[6px] text-amber-500/80 -translate-y-[0.5px]">✦</span>
            </div>
          </div>

          {/* Poem Container */}
          <div className={getPoemContainerClass(poem)}>
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-amber-500/40 rounded-tl" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-amber-500/40 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-amber-500/40 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-amber-500/40 rounded-br" />

            <p className={`font-sinhala text-amber-100 font-medium whitespace-pre-line text-glow-gold ${getPoemFontSizeClass(poem)}`}>
              {poem}
            </p>
          </div>

          {/* Receiver Name (වෙත) - Placed at the Bottom */}
          <div className="z-10 flex flex-col items-end text-right w-full">
            <span className="font-sinhala text-[9px] uppercase tracking-widest text-amber-400/60 block mb-0.5">වෙත (To)</span>
            <h3 className="font-name italic text-lg sm:text-xl font-bold text-glow-gold text-white tracking-wide truncate max-w-full drop-shadow-md pl-4">
              {receiver}
            </h3>
            {/* Golden Star Divider (Right Aligned) */}
            <div className="flex items-center gap-1 mt-1 opacity-80 ml-auto">
              <span className="text-[6px] text-amber-500/80 -translate-y-[0.5px]">✦</span>
              <div className="h-[1px] w-12 bg-gradient-to-l from-amber-500 to-transparent" />
            </div>
          </div>
        </div>

        {/* B. 3D ROTATING LEAF: Covers right page when closed, swings left to open */}
        <motion.div
          className="absolute inset-0 origin-left z-20 preserve-3d pointer-events-auto cursor-pointer"
          animate={{ rotateY: isOpen ? -180 : 0 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* B.1: FRONT FACE (Cover design, visible when closed) */}
          <div
            className="absolute inset-0 backface-hidden z-10 flex flex-col justify-between items-center text-center p-5 sm:p-6 rounded-3xl border border-amber-500/25 overflow-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            {/* Full-bleed high-res cover image */}
            <img 
              src={activeCover.imagePath} 
              alt={activeCover.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            
            {/* Dark glass overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/80 pointer-events-none" />

            {/* Luxury Golden Border Overlay */}
            <div className="absolute inset-2 border border-amber-500/35 rounded-2xl pointer-events-none z-10" />
            <div className="absolute inset-2.5 border border-white/5 rounded-[14px] pointer-events-none z-10" />

            {/* Top Emblems */}
            <div className="flex justify-between w-full opacity-60 px-1 pointer-events-none z-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* Removed Title */}
            <div className="z-10 mt-auto mb-2 text-center"></div>

            {/* Click to open indicator */}
            <div className="mt-2 z-10 text-[8px] sm:text-[9px] font-sinhala text-amber-300 font-semibold animate-pulse bg-black/75 px-3 py-1 rounded-full border border-amber-500/20 shadow-md">
              ක්ලික් කර විවෘත කරන්න (Tap to Open)
            </div>
          </div>

          {/* B.2: BACK FACE (Inside Left cover page, visible when open) */}
          <div
            className={`absolute inset-0 backface-hidden glass-panel-heavy border border-amber-500/25 rounded-3xl p-4 sm:p-5 flex flex-col justify-between items-center text-center shadow-2xl transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Background texture gradient */}
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Inset Luxury Gold Border */}
            <div className="absolute inset-1.5 border border-amber-500/10 rounded-[22px] pointer-events-none z-0" />

            {/* Top Corner decorations */}
            <div className="flex justify-between w-full opacity-30 z-10">
              <span className="text-[10px]">✨</span>
              <span className="text-[10px]">✨</span>
            </div>

            {/* Meditating Lord Buddha PNG with rotating Dharma Chakra halo */}
            <div className="relative flex flex-col items-center justify-center w-40 h-40 sm:w-48 sm:h-48 z-10 my-auto">
              
              {/* Dynamic rotating golden Dharma Chakra in the background */}
              <svg viewBox="0 0 100 100" className="absolute w-40 h-40 sm:w-48 sm:h-48 text-amber-500/35 animate-spin pointer-events-none z-0" style={{ animationDuration: '30s' }}>
                <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-40" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.75" />
                <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="6" fill="currentColor" />
                <circle cx="50" cy="50" r="2" fill="#fff" />
                
                {/* 8 Spokes */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI) / 4;
                  const x1 = 50 + 10 * Math.cos(angle);
                  const y1 = 50 + 10 * Math.sin(angle);
                  const x2 = 50 + 34 * Math.cos(angle);
                  const y2 = 50 + 34 * Math.sin(angle);
                  const bx = 50 + 22 * Math.cos(angle);
                  const by = 50 + 22 * Math.sin(angle);
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.2" />
                      <circle cx={bx} cy={by} r="1.2" fill="currentColor" />
                    </g>
                  );
                })}
                
                {/* Outer Rim Knobs */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * Math.PI) / 4;
                  const cx = 50 + 39 * Math.cos(angle);
                  const cy = 50 + 39 * Math.sin(angle);
                  return (
                    <circle key={i} cx={cx} cy={cy} r="1.5" fill="currentColor" />
                  );
                })}
              </svg>

              {/* Meditating Lord Buddha PNG image in the foreground - Stationary, Enlarged & Full Solid Opacity */}
              <img 
                src={buddhaImage} 
                alt="Lord Buddha"
                className="w-34 h-34 sm:w-42 sm:h-42 object-contain z-10 relative drop-shadow-[0_0_15px_rgba(245,158,11,0.45)] select-none pointer-events-none"
              />
            </div>
            <span className="text-[8px] xs:text-[9px] uppercase font-bold tracking-widest text-gray-500/75 z-10 -mt-2 mb-2 sm:mb-3">
              Peace & Devotion
            </span>

            {/* Blessings message & Close button */}
            <div className="z-10 flex flex-col items-center space-y-2.5 xs:space-y-3.5 pb-1 sm:pb-2">
              <div className="flex items-center gap-1 text-[10px] xs:text-xs text-amber-200">
                <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-amber-400 animate-pulse" />
                <span className="font-sinhala font-medium">පින්බර වෙසක් මංගල්‍යයක් වේවා!</span>
                <Sparkles className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-amber-400 animate-pulse" />
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="px-3.5 py-1.5 xs:px-4 xs:py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[9px] xs:text-[10px] font-sinhala font-semibold border border-amber-500/25 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>පත පියවන්න (Close Card)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

