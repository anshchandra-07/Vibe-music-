import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// Layout & UI components
import Header from '../components/Layout/Header';
import Background from '../components/Layout/Background';
import AlbumArtwork from '../components/Artwork/AlbumArtwork';
import AudioVisualizer from '../components/Visualizer/AudioVisualizer';
import MusicPlayer from '../components/AudioPlayer/MusicPlayer';
import GoogleAdBanner from '../components/UI/GoogleAdBanner';

// Drawer Panels
import StationPanel from '../components/Stations/StationPanel';
import QueuePanel from '../components/Queue/QueuePanel';

// Overlay Modals
import KeyboardHelp from '../components/UI/KeyboardHelp';
import AboutPanel from '../components/UI/AboutPanel';

const Home = () => {
  const {
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    currentStation
  } = useMusic();

  // Drawer & Modal States
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isStationsOpen, setIsStationsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Fullscreen Immersive State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUI, setShowUI] = useState(true);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fullscreen Mouse Inactivity UI Hider
  useEffect(() => {
    if (!isFullscreen) {
      setShowUI(true);
      return;
    }

    let timeoutId;
    const resetTimer = () => {
      setShowUI(true);
      clearTimeout(timeoutId);
      
      if (isPlaying) {
        timeoutId = setTimeout(() => {
          setShowUI(false);
        }, 3000);
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeoutId);
    };
  }, [isFullscreen, isPlaying]);

  // Fullscreen toggle action
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Could not activate fullscreen:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error("Could not exit fullscreen:", err));
    }
  };

  // Keyboard Shortcuts Bindings
  useKeyboardShortcuts({
    togglePlay,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleQueue: () => setIsQueueOpen(prev => !prev),
    toggleStations: () => setIsStationsOpen(prev => !prev),
    toggleFullscreen
  });

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col justify-between z-10 select-none">
      {/* 1. Cinematic Background Overlays */}
      <Background />

      {/* 2. Top Header Bar */}
      <div 
        className={`transition-opacity duration-700 ease-in-out shrink-0 ${
          showUI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Header 
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      </div>

      {/* 3. Main Center Segment (Album Artwork & Visualizer) */}
      <main className="flex-grow min-h-0 flex flex-col items-center justify-center relative p-1 sm:p-4 overflow-hidden">
        {/* Glowing Atmosphere Vibe Label (Fullscreen Mode indicator) */}
        {isFullscreen && !showUI && (
          <div className="absolute top-6 left-6 font-mono-retro text-[10px] text-white/20 uppercase tracking-[0.3em] transition-opacity duration-1000">
            {currentStation?.name} // {isPlaying ? "BROADCASTING" : "STANDBY"}
          </div>
        )}

        <AlbumArtwork>
          <AudioVisualizer />
        </AlbumArtwork>
      </main>

      {/* 4. Bottom Player Controls Deck & Google Ad Banner */}
      <footer 
        className={`w-full max-w-[960px] mx-auto px-2 pb-2 sm:px-6 sm:pb-6 transition-all duration-700 ease-in-out flex flex-col gap-1 sm:gap-2 shrink-0 ${
          showUI 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Responsive Google Ads Banner */}
        {!isFullscreen && (
          <GoogleAdBanner 
            client="ca-pub-3607991187719913" 
            slot="6300978111" 
            className="w-full"
          />
        )}

        <MusicPlayer 
          onToggleQueue={() => setIsQueueOpen(prev => !prev)}
          onToggleStations={() => setIsStationsOpen(prev => !prev)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </footer>

      {/* 5. Sidebar Drawers (AnimatePresence transitions) */}
      <AnimatePresence>
        {isStationsOpen && (
          <StationPanel 
            isOpen={isStationsOpen} 
            onClose={() => setIsStationsOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isQueueOpen && (
          <QueuePanel 
            isOpen={isQueueOpen} 
            onClose={() => setIsQueueOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* 6. Centered Modals */}
      <KeyboardHelp 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

      <AboutPanel 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </div>
  );
};

export default Home;
