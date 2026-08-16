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
  const [showUI, setShowUI] = useState(true); // Fades UI on mouse inactivity in fullscreen

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
      
      // Only hide if music is playing
      if (isPlaying) {
        timeoutId = setTimeout(() => {
          setShowUI(false);
        }, 3000); // 3 seconds timeout
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
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between z-10 select-none">
      {/* 1. Cinematic Background Overlays */}
      <Background />

      {/* 2. Top Header Bar */}
      <div 
        className={`transition-opacity duration-700 ease-in-out ${
          showUI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Header 
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      </div>

      {/* 3. Main Center Segment (Album Artwork & Visualizer) */}
      <main className="flex-grow flex items-center justify-center relative p-4">
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

      {/* 4. Bottom Player Controls Deck */}
      <div 
        className={`w-full max-w-[960px] mx-auto p-4 sm:p-6 transition-all duration-700 ease-in-out ${
          showUI 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <MusicPlayer 
          onToggleQueue={() => setIsQueueOpen(prev => !prev)}
          onToggleStations={() => setIsStationsOpen(prev => !prev)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>

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
