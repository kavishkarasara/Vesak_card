import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { CoverInfo } from './CardCovers';

interface CoverCardProps {
  cover: CoverInfo;
  index: number;
  onSelect: () => void;
}

export const CoverCard: React.FC<CoverCardProps> = ({ cover, index, onSelect }) => {
  const [loaded, setLoaded] = useState(false);

  // First 4 cards get eager + high priority loading; rest get lazy deferred loading
  const isAboveFold = index < 4;

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -8, scale: 1.03 }}
      className="cursor-pointer rounded-3xl overflow-hidden shadow-xl border border-amber-500/25 relative aspect-[2/3] w-full"
    >
      {/* Shimmer skeleton — visible while image loads */}
      {!loaded && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden z-10">
          <div className="w-full h-full bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-900 animate-pulse" />
          {/* Animated shimmer sweep */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(110deg, transparent 30%, rgba(245,158,11,0.06) 50%, transparent 70%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.8s infinite',
            }}
          />
          {/* Skeleton title line */}
          <div className="absolute bottom-6 left-4 right-4 flex flex-col items-center gap-2">
            <div className="h-2.5 w-24 rounded-full bg-amber-500/15 animate-pulse" />
          </div>
        </div>
      )}

      {/* Actual full-quality image — lazy loaded beyond fold */}
      <img
        src={cover.imagePath}
        alt={cover.title}
        loading={isAboveFold ? 'eager' : 'lazy'}
        fetchPriority={isAboveFold ? 'high' : 'low'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dark gradient overlay for title legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/25 to-black/85 pointer-events-none z-20" />

      {/* Luxury gold-framed overlays */}
      <div className="absolute inset-2 border border-amber-500/35 rounded-2xl pointer-events-none z-20" />
      <div className="absolute inset-2.5 border border-white/5 rounded-[14px] pointer-events-none z-20" />


    </motion.div>
  );
};
