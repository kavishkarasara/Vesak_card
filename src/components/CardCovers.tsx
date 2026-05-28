import React from 'react';

export type CoverType = string;

export interface CoverInfo {
  id: CoverType;
  titleSinhala: string;
  title: string;
  description: string;
  colorClass: string;
  accentColor: string;
  shadowColor: string;
  imagePath: string;
}

// Dynamically scan the "image" folder in the project root for images
const imageModules = import.meta.glob('../../image/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', { eager: true }) as Record<string, { default: string }>;

// Poetic Sinhala and style mapping helper based on filename keywords
const getCoverDetails = (id: string, index: number, imagePath: string): CoverInfo => {
  const lowerName = id.toLowerCase();

  // Format a beautiful, readable title from the filename
  let cleanTitle = id
    .replace(/_\d+$/, '') // Remove timestamps if any (e.g. _202605281600)
    .replace(/[_,.-]/g, ' ') // Replace underscores/dashes with spaces
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  // Capitalize the first letter of each word
  cleanTitle = cleanTitle.replace(/\b\w/g, c => c.toUpperCase());

  if (cleanTitle.length > 25) {
    cleanTitle = cleanTitle.substring(0, 22) + '...';
  }

  if (!cleanTitle) {
    cleanTitle = `Vesak Theme ${index + 1}`;
  }

  // Default theme properties (Golden Lantern-style)
  let titleSinhala = '';
  let accentColor = '#f59e0b';
  let shadowColor = 'rgba(245, 158, 11, 0.4)';
  let colorClass = 'from-amber-500/20 to-orange-600/20 border-orange-500/30';

  // Dynamic keyword checking for high-fidelity custom styles
  if (lowerName.includes('stupa') || lowerName.includes('sthoopa') || lowerName.includes('chaitya')) {
    titleSinhala = 'පිංබර චෛත්‍යය';
    accentColor = '#38bdf8';
    shadowColor = 'rgba(56, 189, 248, 0.4)';
    colorClass = 'from-sky-500/20 to-indigo-600/20 border-sky-500/30';
  } else if (lowerName.includes('bo_leaf') || lowerName.includes('bo-leaf') || lowerName.includes('bo_pat') || lowerName.includes('bopat')) {
    titleSinhala = 'පූජනීය බෝ පත';
    accentColor = '#eab308';
    shadowColor = 'rgba(234, 179, 8, 0.4)';
    colorClass = 'from-yellow-500/20 to-amber-500/20 border-amber-400/30';
  } else if (lowerName.includes('lantern') || lowerName.includes('kudu') || lowerName.includes('pahan_kudu')) {
    titleSinhala = 'වෙසක් පහන් කූඩුව';
    accentColor = '#f97316';
    shadowColor = 'rgba(249, 115, 22, 0.4)';
    colorClass = 'from-orange-500/20 to-red-600/20 border-orange-400/30';
  } else if (lowerName.includes('lamp') || lowerName.includes('pahana') || lowerName.includes('mati_pahan')) {
    titleSinhala = 'දැල්වූ මැටි පහන';
    accentColor = '#fbbf24';
    shadowColor = 'rgba(251, 191, 36, 0.4)';
    colorClass = 'from-red-500/20 to-yellow-600/20 border-yellow-500/30';
  } else if (lowerName.includes('buddha') || lowerName.includes('pilimaya') || lowerName.includes('lord') || lowerName.includes('statue')) {
    titleSinhala = 'ශාන්ත බුදු පියාණන්';
    accentColor = '#fbbf24';
    shadowColor = 'rgba(251, 191, 36, 0.4)';
    colorClass = 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
  } else if (lowerName.includes('enlightenment') || lowerName.includes('aura') || lowerName.includes('glowing')) {
    titleSinhala = 'රන්වන් බුදුරැස්';
    accentColor = '#fbbf24';
    shadowColor = 'rgba(251, 191, 36, 0.4)';
    colorClass = 'from-amber-500/20 to-orange-500/20 border-yellow-400/30';
  } else if (lowerName.includes('stone')) {
    titleSinhala = 'ශෛලමය බුදු පිළිමය';
    accentColor = '#78716c';
    shadowColor = 'rgba(120, 113, 108, 0.4)';
    colorClass = 'from-stone-500/20 to-neutral-600/20 border-stone-500/30';
  } else if (lowerName.includes('bodhi') || lowerName.includes('bodhiya')) {
    titleSinhala = 'ශ්‍රී මහා බෝධිය';
    accentColor = '#10b981';
    shadowColor = 'rgba(16, 185, 129, 0.4)';
    colorClass = 'from-emerald-500/20 to-green-600/20 border-emerald-500/30';
  }

  return {
    id,
    titleSinhala,
    title: cleanTitle,
    description: `සුන්දර වෙසක් ආලෝකයෙන් හැඩවුණු කලාත්මක සිතුවම - ${cleanTitle}`,
    colorClass,
    accentColor,
    shadowColor,
    imagePath
  };
};

// Default fallback covers if no images are found in the directory
const FALLBACK_COVERS: CoverInfo[] = [
  {
    id: 'default-cover',
    titleSinhala: 'පිංබර වෙසක් මංගල්‍යයක්',
    title: 'Blessed Vesak Glow',
    description: 'පින්බර වෙසක් මංගල්‍යයක් වේවා!',
    colorClass: 'from-amber-500/20 to-orange-600/20 border-orange-500/30',
    accentColor: '#f59e0b',
    shadowColor: 'rgba(245, 158, 11, 0.4)',
    imagePath: ''
  }
];

export const CARD_COVERS: CoverInfo[] = Object.keys(imageModules).length > 0
  ? Object.keys(imageModules).map((filePath, index) => {
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    const id = fileName.replace(/\.[^/.]+$/, ""); // Remove extension to get unique ID
    const imagePath = imageModules[filePath].default;
    return getCoverDetails(id, index, imagePath);
  })
  : FALLBACK_COVERS;

interface CardCoverProps {
  id: CoverType;
  className?: string;
  isAnimated?: boolean;
}

export const CardCover: React.FC<CardCoverProps> = ({ id, className = '' }) => {
  const activeCover = CARD_COVERS.find((c) => c.id === id) || CARD_COVERS[0];

  return (
    <img
      src={activeCover.imagePath}
      alt={activeCover.title}
      className={`${className} object-cover rounded-2xl w-full h-full shadow-md border border-amber-500/25`}
    />
  );
};
