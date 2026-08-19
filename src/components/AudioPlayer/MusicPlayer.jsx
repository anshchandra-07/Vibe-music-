import React from 'react';
import { Maximize2, Minimize2, ListMusic, Radio } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

const MusicPlayer = ({ onToggleQueue, onToggleStations, isFullscreen, onToggleFullscreen }) => {
  const { currentTrack } = useMusic();

  return (
    <div className="w-full glass-panel glass-panel-glow rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col gap-1 sm:gap-2 relative shadow-2xl">
      
      {/* 1. Track Metadata Section (Mobile View Header) */}
      <div className="flex items-center justify-between md:hidden w-full mb-0.5">
        <div className="flex flex-col min-w-0 pr-2">
          <h3 className="text-xs sm:text-sm font-semibold text-white truncate glow-text-soft">
            {currentTrack?.title || "No Track Selected"}
          </h3>
          <p className="text-[10px] sm:text-xs text-zinc-400 truncate font-mono-retro">
            {currentTrack?.artist || "Unknown Artist"}
          </p>
        </div>
        
        {/* Quick action buttons for mobile */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <button
            onClick={onToggleStations}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors touch-target"
            title="Browse Radio Stations"
            aria-label="Browse Radio Stations"
          >
            <Radio className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleQueue}
            className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors touch-target"
            title="Open Queue"
            aria-label="Open Playback Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Compact Volume Control for Mobile */}
          <VolumeControl compact={true} />
        </div>
      </div>

      {/* 2. Seek timeline bar */}
      <ProgressBar />

      {/* 3. Main Player Grid Layout */}
      <div className="flex items-center justify-between mt-0.5 sm:mt-1 gap-2 sm:gap-4">
        
        {/* Left Side: Desktop-Only Metadata */}
        <div className="hidden md:flex flex-col min-w-0 w-[200px] text-left">
          <h3 className="text-base font-semibold text-white truncate glow-text-soft">
            {currentTrack?.title || "No Track Selected"}
          </h3>
          <p className="text-xs text-zinc-400 truncate font-mono-retro">
            {currentTrack?.artist || "Unknown Artist"}
          </p>
        </div>

        {/* Center: Playback Buttons */}
        <div className="flex-grow flex justify-center">
          <PlayerControls />
        </div>

        {/* Right Side: Volume & Special Actions (Desktop & Fullscreen) */}
        <div className="flex items-center gap-1 sm:gap-3 md:w-[200px] justify-end">
          {/* Desktop volume slider */}
          <div className="hidden sm:block">
            <VolumeControl compact={false} />
          </div>

          {/* Desktop Queue & Station Drawer Toggles */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={onToggleStations}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors touch-target"
              title="Radio Stations"
              aria-label="Open Radio Stations Panel"
            >
              <Radio className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onToggleQueue}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors touch-target"
              title="Current Queue"
              aria-label="Open Current Queue Panel"
            >
              <ListMusic className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Fullscreen view toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors touch-target"
            title={isFullscreen ? "Exit Immersive Mode" : "Enter Immersive Mode"}
            aria-label={isFullscreen ? "Exit Immersive Mode" : "Enter Immersive Mode"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
