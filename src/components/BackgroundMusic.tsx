import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const hasInteracted = useRef(false);
  const containerId = 'youtube-audio-container';

  // Define the interaction handler
  const handleInteraction = () => {
    hasInteracted.current = true;
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
        // Clean up listeners once played
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
      } catch (e) {
        console.warn('Autoplay failed to trigger on interaction', e);
      }
    }
  };

  useEffect(() => {
    // 1. Add global interaction listeners immediately on mount
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    // 2. Load YouTube Iframe Player API script if not present
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

    // 3. Define the callback for YouTube API
    const initPlayer = () => {
      try {
        playerRef.current = new (window as any).YT.Player(containerId, {
          height: '0',
          width: '0',
          videoId: 'k783W5arEI4',
          playerVars: {
            autoplay: 1, // Try to autoplay immediately
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
              event.target.setVolume(12); // Set very soft volume (12% for ambient feel)
              setIsReady(true);
              
              // If the user has already clicked somewhere, start playing immediately!
              if (hasInteracted.current) {
                event.target.playVideo();
                setIsPlaying(true);
                window.removeEventListener('click', handleInteraction);
                window.removeEventListener('touchstart', handleInteraction);
              } else {
                // Otherwise, try to autoplay (some browsers allow muted or direct autoplay depending on permissions)
                event.target.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (event: any) => {
              // Loop play if video ends
              if (event.data === (window as any).YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            }
          }
        });
      } catch (err) {
        console.error('Failed to initialize YouTube player', err);
      }
    };

    // Bind API ready callback
    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      // API is still loading
      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    }

    return () => {
      // Clean up event listeners and player on unmount
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;

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
      <div className="absolute w-0 h-0 overflow-hidden pointer-events-none opacity-0 invisible" style={{ width: 0, height: 0 }}>
        <div id={containerId} />
      </div>

      {/* Floating control button - active globally across the site */}
      <AnimatePresence>
        {isReady && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-50 p-3 sm:p-3.5 rounded-full glass-panel-heavy border border-amber-500/30 text-amber-400 hover:text-amber-200 hover:border-amber-400 shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95"
            title={isMuted ? 'Play Music' : 'Mute Music'}
          >
            {/* Animated sound wave bars when playing */}
            {isPlaying && !isMuted ? (
              <div className="flex items-end gap-[2px] h-3.5 w-4 px-[1px]">
                <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-1" style={{ height: '60%' }} />
                <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-2" style={{ height: '100%' }} />
                <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-3" style={{ height: '40%' }} />
                <span className="w-[2.5px] bg-amber-400 rounded-full animate-music-bar-4" style={{ height: '80%' }} />
              </div>
            ) : (
              <Music className="w-4 h-4 text-amber-400/60" />
            )}

            {/* Inset Divider Line */}
            <div className="h-4 w-[1px] bg-white/10" />

            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
