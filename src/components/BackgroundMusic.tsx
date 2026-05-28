import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// MUSIC CONTROLS
// ==========================================
interface MusicControlsProps {
  playerRef: React.MutableRefObject<any>;
  isReady: boolean;
}

const MusicControls: React.FC<MusicControlsProps> = ({ playerRef, isReady }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current || !isReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(18);
      playerRef.current.playVideo();
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
      setIsPlaying(false);
    }
  };

  if (!isReady) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full glass-panel-heavy flex items-center justify-center gap-2.5 cursor-pointer border shadow-2xl"
      style={{
        borderColor: isMuted ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.5)',
        boxShadow: isMuted ? '0 10px 30px rgba(0,0,0,0.4)' : '0 0 20px rgba(245,158,11,0.3), 0 10px 30px rgba(0,0,0,0.4)',
      }}
    >
      {isPlaying && !isMuted ? (
        <div className="flex items-end gap-[2px] h-3.5 w-4 px-[1px]">
          <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-1" style={{ height: '60%' }} />
          <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-2" style={{ height: '100%' }} />
          <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-3" style={{ height: '40%' }} />
          <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-4" style={{ height: '80%' }} />
        </div>
      ) : (
        <Music className="w-4 h-4 text-amber-400/50" />
      )}
      <div className="h-4 w-[1px] bg-white/10" />
      {isMuted ? <VolumeX className="w-4 h-4 text-amber-400/60" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
    </motion.button>
  );
};

// ==========================================
// VESAK LOADING SCREEN (auto-transition, no button)
// ==========================================
interface LoadingScreenProps {
  onDone: () => void;
}

const VesakLoadingScreen: React.FC<LoadingScreenProps> = ({ onDone }) => {
  // Auto-transition after 4 seconds
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  // Sky lanterns configuration
  const lanterns = [
    { id: 1, x: '65%', startY: '60%', size: 44, delay: 0,   duration: 6,   color: '#f97316' },
    { id: 2, x: '75%', startY: '72%', size: 34, delay: 0.6, duration: 7,   color: '#ef4444' },
    { id: 3, x: '82%', startY: '55%', size: 28, delay: 1.2, duration: 5.5, color: '#f59e0b' },
    { id: 4, x: '58%', startY: '80%', size: 22, delay: 1.8, duration: 8,   color: '#fb923c' },
    { id: 5, x: '88%', startY: '65%', size: 18, delay: 2.4, duration: 6.5, color: '#fcd34d' },
    { id: 6, x: '70%', startY: '88%', size: 16, delay: 0.9, duration: 9,   color: '#f97316' },
    { id: 7, x: '91%', startY: '78%', size: 14, delay: 3.0, duration: 7,   color: '#fbbf24' },
  ];

  // Bo leaves on branches
  const boLeaves = [
    { x: 62, y: 55, rx: 8, ry: 12, r: -25 }, { x: 45, y: 45, rx: 9, ry: 13, r: -15 },
    { x: 30, y: 38, rx: 10, ry: 14, r: -5  }, { x: 18, y: 32, rx: 8,  ry: 12, r: 10  },
    { x: 72, y: 62, rx: 7,  ry: 11, r: -35 }, { x: 55, y: 70, rx: 8,  ry: 13, r: -20 },
    { x: 40, y: 68, rx: 9,  ry: 12, r: -10 }, { x: 25, y: 58, rx: 7,  ry: 11, r: 5   },
    { x: 10, y: 50, rx: 8,  ry: 12, r: 15  }, { x: 78, y: 45, rx: 7,  ry: 10, r: -40 },
    { x: 65, y: 40, rx: 6,  ry: 10, r: -28 }, { x: 50, y: 30, rx: 8,  ry: 12, r: -12 },
    { x: 35, y: 22, rx: 7,  ry: 11, r: 0   }, { x: 20, y: 18, rx: 6,  ry: 9,  r: 12  },
    { x: 82, y: 55, rx: 6,  ry: 9,  r: -45 }, { x: 5,  y: 40, rx: 7,  ry: 11, r: 20  },
  ];

  // Falling bo leaf particles
  const fallingLeaves = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${8 + i * 9}%`,
    delay: i * 0.4,
    duration: 4 + (i % 4) * 1.2,
    size: 12 + (i % 3) * 5,
  }));

  // Lotus flowers
  const lotuses = [
    { x: '5%',  size: 72 },
    { x: '18%', size: 52 },
    { x: '32%', size: 44 },
    { x: '60%', size: 48 },
    { x: '74%', size: 62 },
    { x: '88%', size: 50 },
  ];

  // Firefly particles
  const fireflies = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${4 + (i * 4.7) % 92}%`,
    top: `${8 + (i * 8.3) % 75}%`,
    delay: i * 0.25,
    duration: 1.8 + (i % 5) * 0.7,
    size: 2 + (i % 3),
  }));

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 30% 40%, #0f0a1e 0%, #030712 45%, #060210 100%)',
      }}
    >
      {/* ── STARS / FIREFLIES ── */}
      {fireflies.map(f => (
        <motion.div
          key={f.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: f.size, height: f.size,
            left: f.left, top: f.top,
            background: f.id % 3 === 0 ? '#fde68a' : f.id % 3 === 1 ? '#6ee7b7' : '#c4b5fd',
            filter: 'blur(0.5px)',
          }}
          animate={{ opacity: [0.05, 0.9, 0.05], scale: [0.7, 1.5, 0.7] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── BO TREE BRANCH (top-left) ── */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{ width: '45%', maxWidth: 380, zIndex: 4 }}>
        <svg viewBox="0 0 380 280" fill="none" preserveAspectRatio="xMinYMin meet" className="w-full">
          {/* Main branches */}
          <path d="M0 280 Q80 200 160 140 Q200 100 280 60" stroke="#5c3a1a" strokeWidth="12" strokeLinecap="round" fill="none"/>
          <path d="M160 140 Q120 100 90 60" stroke="#5c3a1a" strokeWidth="7" strokeLinecap="round" fill="none"/>
          <path d="M220 100 Q260 70 290 30" stroke="#5c3a1a" strokeWidth="6" strokeLinecap="round" fill="none"/>
          <path d="M130 160 Q100 130 70 100" stroke="#5c3a1a" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <path d="M80 210 Q50 180 20 170" stroke="#5c3a1a" strokeWidth="5" strokeLinecap="round" fill="none"/>
          {/* Bo leaves */}
          {boLeaves.map((l, i) => (
            <g key={i} transform={`translate(${l.x}, ${l.y}) rotate(${l.r})`}>
              <ellipse cx="0" cy="0" rx={l.rx} ry={l.ry} fill="#16a34a" opacity="0.82"/>
              <ellipse cx="0" cy="0" rx={l.rx * 0.6} ry={l.ry * 0.7} fill="#15803d" opacity="0.5"/>
              {/* Leaf vein */}
              <line x1="0" y1={-l.ry + 1} x2="0" y2={l.ry - 1} stroke="#bbf7d0" strokeWidth="0.6" opacity="0.4"/>
              {/* Tip */}
              <path d={`M 0 ${l.ry} Q 0 ${l.ry + 4} 0 ${l.ry + 6}`} stroke="#15803d" strokeWidth="0.8" strokeLinecap="round"/>
            </g>
          ))}
          {/* String lights */}
          <path d="M60 180 Q90 190 120 175 Q150 165 180 155 Q210 145 250 130" stroke="#fde68a" strokeWidth="1" fill="none" opacity="0.5"/>
          {[60, 80, 100, 125, 150, 175, 200, 225, 250].map((x, i) => {
            const t = i / 8;
            const y = 180 + Math.sin(t * Math.PI) * (-30) - t * 55;
            return <circle key={i} cx={x} cy={y + 5} r="3.5" fill="#fde68a" opacity="0.9"/>;
          })}
        </svg>
      </div>

      {/* ── SKY LANTERNS (top-right rising) ── */}
      {lanterns.map(l => (
        <motion.div
          key={l.id}
          className="absolute pointer-events-none"
          style={{ left: l.x, top: l.startY, zIndex: 3 }}
          animate={{
            y: [0, -Math.random() * 40 - 80, -160],
            x: [0, (l.id % 2 === 0 ? 12 : -12), 0],
            opacity: [0, 0.9, 0.9, 0.5, 0],
          }}
          transition={{ duration: l.duration, delay: l.delay, repeat: Infinity, ease: 'easeInOut', times: [0, 0.1, 0.7, 0.9, 1] }}
        >
          <svg width={l.size} height={l.size * 1.5} viewBox="0 0 40 60" fill="none">
            {/* Glow */}
            <ellipse cx="20" cy="30" rx="18" ry="22" fill={l.color} opacity="0.15" style={{ filter: 'blur(6px)' }}/>
            {/* Body */}
            <path d="M8 15 Q4 28 6 38 Q10 52 20 54 Q30 52 34 38 Q36 28 32 15Z" fill={l.color} opacity="0.9"/>
            {/* Inner light */}
            <ellipse cx="20" cy="34" rx="9" ry="12" fill="rgba(255,240,100,0.5)"/>
            {/* Top cap */}
            <path d="M10 15 Q20 10 30 15 L28 20 Q20 16 12 20Z" fill={l.color} opacity="0.7"/>
            {/* Tassel */}
            <line x1="20" y1="54" x2="20" y2="60" stroke={l.color} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </motion.div>
      ))}

      {/* ── FALLING BO LEAVES ── */}
      {fallingLeaves.map(leaf => (
        <motion.div
          key={leaf.id}
          className="absolute pointer-events-none"
          style={{ left: leaf.left, top: -50, zIndex: 3 }}
          animate={{
            y: ['0px', '108vh'],
            x: [0, (leaf.id % 2 === 0 ? 35 : -35), 0, (leaf.id % 2 === 0 ? -20 : 20)],
            rotate: [0, 180, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.85, 1] }}
        >
          <svg width={leaf.size} height={leaf.size * 1.4} viewBox="0 0 30 42" fill="none">
            <path d="M15 1 C26 1 30 12 28 21 C26 30 20 39 15 41 C10 39 4 30 2 21 C0 12 4 1 15 1Z" fill="#16a34a" opacity="0.75"/>
            <line x1="15" y1="2" x2="15" y2="40" stroke="#bbf7d0" strokeWidth="0.7" opacity="0.5"/>
            <path d="M15 20 L6 12 M15 20 L24 12 M15 28 L8 22 M15 28 L22 22" stroke="#bbf7d0" strokeWidth="0.5" opacity="0.4"/>
          </svg>
        </motion.div>
      ))}

      {/* ── LOTUS FLOWERS (bottom) ── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end pointer-events-none" style={{ zIndex: 4, paddingBottom: 0 }}>
        {lotuses.map((lotus, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.85, y: [0, -4, 0] }}
            transition={{
              opacity: { delay: 0.5 + i * 0.15, duration: 0.8 },
              y: { delay: i * 0.3, duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{ width: lotus.size }}
          >
            <svg viewBox="0 0 80 55" fill="none" width="100%">
              {/* Petals */}
              {Array.from({ length: 7 }, (_, p) => {
                const angle = (p * 360) / 7;
                return (
                  <g key={p} transform={`rotate(${angle} 40 40)`}>
                    <ellipse cx="40" cy="22" rx="7" ry="18" fill="#fce7f3" opacity="0.85" transform="rotate(0 40 22)"/>
                    <ellipse cx="40" cy="22" rx="5" ry="15" fill="#fbcfe8" opacity="0.6" transform="rotate(0 40 22)"/>
                  </g>
                );
              })}
              {/* Center */}
              <circle cx="40" cy="38" r="8" fill="#fbbf24" opacity="0.9"/>
              <circle cx="40" cy="38" r="5" fill="#f59e0b"/>
              {/* Water ripple */}
              <ellipse cx="40" cy="52" rx="30" ry="4" fill="none" stroke="rgba(147,197,253,0.3)" strokeWidth="1"/>
              <ellipse cx="40" cy="52" rx="20" ry="2.5" fill="none" stroke="rgba(147,197,253,0.2)" strokeWidth="0.8"/>
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ── CENTER TEXT + PROGRESS ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
        {/* Glow backdrop */}
        <div className="absolute rounded-full pointer-events-none"
          style={{ width: 280, height: 280, background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
        />

        {/* Dharma Wheel */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="mb-5 opacity-50"
          style={{ fontSize: 36 }}
        >
          ☸️
        </motion.div>

        {/* Main Sinhala text */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
          className="text-center mb-1"
        >
          <h1
            className="font-sinhala font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
              background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 40%, #fb923c 70%, #fde68a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.5))',
            }}
          >
            සුභ වෙසක්
          </h1>
          <h1
            className="font-sinhala font-bold leading-tight"
            style={{
              fontSize: 'clamp(2rem, 6.5vw, 3.6rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.65))',
            }}
          >
            මංගල්‍යයක්
          </h1>
          <h1
            className="font-sinhala font-bold"
            style={{
              fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
              background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 40%, #fb923c 70%, #fde68a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.5))',
            }}
          >
            වේවා! 🌸
          </h1>
        </motion.div>


        {/* Loading progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-52 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.4, ease: 'easeInOut' }}
              style={{
                background: 'linear-gradient(90deg, #78350f, #f59e0b, #fde68a, #f59e0b, #78350f)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-amber-500/60 text-[10px] uppercase tracking-widest"
          >
            ☸ loading...
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN EXPORT
// ==========================================
export const BackgroundMusic: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerId = 'youtube-audio-container';

  useEffect(() => {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const first = document.getElementsByTagName('script')[0];
      first?.parentNode?.insertBefore(tag, first) ?? document.head.appendChild(tag);
    }

    const initPlayer = () => {
      playerRef.current = new (window as any).YT.Player(containerId, {
        height: '0', width: '0',
        videoId: 'k783W5arEI4',
        playerVars: {
          autoplay: 1, mute: 1, loop: 1,
          playlist: 'k783W5arEI4', controls: 0, disablekb: 1,
          fs: 0, modestbranding: 1, rel: 0,
          origin: window.location.origin, enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.setVolume(18);
            event.target.playVideo();
            setPlayerReady(true);

            // Auto-unmute on first user interaction anywhere
            const unmute = () => {
              try {
                event.target.unMute();
                event.target.setVolume(18);
                event.target.playVideo();
              } catch (_) {}
              window.removeEventListener('click', unmute, { capture: true });
              window.removeEventListener('touchstart', unmute, { capture: true });
            };
            window.addEventListener('click', unmute, { capture: true });
            window.addEventListener('touchstart', unmute, { capture: true });
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT?.PlayerState?.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => { prev?.(); initPlayer(); };
    }

    return () => { try { playerRef.current?.destroy(); } catch (_) {} };
  }, []);

  const handleLoadingDone = () => setShowLoading(false);

  return (
    <>
      {/* Hidden YouTube iframe */}
      <div style={{ position: 'fixed', top: -200, left: -200, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}>
        <div id={containerId} />
      </div>

      <AnimatePresence>
        {showLoading && <VesakLoadingScreen onDone={handleLoadingDone} />}
      </AnimatePresence>

      {!showLoading && <MusicControls playerRef={playerRef} isReady={playerReady} />}
    </>
  );
};
