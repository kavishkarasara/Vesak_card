import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);        // Start muted so browser allows autoplay
  const [isReady, setIsReady] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const playerRef = useRef<any>(null);
  const unmutedByUser = useRef(false);
  const containerId = 'youtube-audio-container';

  useEffect(() => {
    // Load YouTube Iframe Player API script if not present
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }

    const initPlayer = () => {
      try {
        playerRef.current = new (window as any).YT.Player(containerId, {
          height: '0',
          width: '0',
          videoId: 'k783W5arEI4',
          playerVars: {
            autoplay: 1,  // Autoplay muted - browsers ALLOW this
            mute: 1,      // Start muted
            loop: 1,
            playlist: 'k783W5arEI4',
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            origin: window.location.origin,
            enablejsapi: 1
          },
          events: {
            onReady: (event: any) => {
              // Start playing muted - ALL browsers allow this
              event.target.mute();
              event.target.setVolume(12);
              event.target.playVideo();
              setIsReady(true);
              setIsPlaying(true);
              setIsMuted(true);

              // Show the hint pulse after 1.5 seconds to attract user attention
              setTimeout(() => {
                if (!unmutedByUser.current) {
                  setShowHint(true);
                }
              }, 1500);

              // Auto-unmute after the first user interaction ANYWHERE on the page
              const autoUnmuteOnInteraction = () => {
                if (!unmutedByUser.current) {
                  try {
                    event.target.unMute();
                    event.target.setVolume(12);
                    event.target.playVideo();
                    setIsMuted(false);
                    setShowHint(false);
                    unmutedByUser.current = true;
                  } catch (e) {
                    console.warn('Auto-unmute failed', e);
                  }
                }
                window.removeEventListener('click', autoUnmuteOnInteraction, { capture: true });
                window.removeEventListener('touchstart', autoUnmuteOnInteraction, { capture: true });
                window.removeEventListener('keydown', autoUnmuteOnInteraction, { capture: true });
              };

              // Listen on ALL events, capturing phase so it fires before anything else
              window.addEventListener('click', autoUnmuteOnInteraction, { capture: true });
              window.addEventListener('touchstart', autoUnmuteOnInteraction, { capture: true });
              window.addEventListener('keydown', autoUnmuteOnInteraction, { capture: true });
            },
            onStateChange: (event: any) => {
              const YT = (window as any).YT;
              if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
                // Keep looping
                event.target.playVideo();
              }
            }
          }
        });
      } catch (err) {
        console.error('Failed to initialize YouTube player', err);
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playerRef.current || !isReady) return;
    unmutedByUser.current = true;
    setShowHint(false);

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(12);
      playerRef.current.playVideo();
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Invisible YouTube iframe container */}
      <div
        className="fixed pointer-events-none"
        style={{ width: 1, height: 1, opacity: 0, position: 'fixed', top: -100, left: -100 }}
      >
        <div id={containerId} />
      </div>

      {/* Floating music control button */}
      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
          >
            {/* Hint tooltip shown when muted (waiting for first click) */}
            <AnimatePresence>
              {showHint && isMuted && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  className="glass-panel-heavy border border-amber-500/40 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl"
                >
                  <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="font-sinhala text-[11px] text-amber-200 font-semibold whitespace-nowrap">
                    සංගීතය ක්‍රියාත්මක කරන්න
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main circular control button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleMute}
              className="p-3.5 rounded-full glass-panel-heavy border shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer transition-all"
              style={{
                borderColor: isMuted ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.5)',
                boxShadow: isMuted
                  ? '0 10px 30px rgba(0,0,0,0.4)'
                  : '0 0 20px rgba(245, 158, 11, 0.3), 0 10px 30px rgba(0,0,0,0.4)',
              }}
              title={isMuted ? 'Click to play music' : 'Click to mute music'}
            >
              {/* Animated sound wave bars when playing and not muted */}
              {isPlaying && !isMuted ? (
                <div className="flex items-end gap-[2px] h-3.5 w-4 px-[1px]">
                  <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-1" style={{ height: '60%' }} />
                  <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-2" style={{ height: '100%' }} />
                  <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-3" style={{ height: '40%' }} />
                  <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-4" style={{ height: '80%' }} />
                </div>
              ) : (
                <Music className="w-4 h-4 text-amber-400/50 animate-pulse" />
              )}

              {/* Inset Divider Line */}
              <div className="h-4 w-[1px] bg-white/10" />

              {isMuted ? (
                <VolumeX className="w-4 h-4 text-amber-400/60" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
