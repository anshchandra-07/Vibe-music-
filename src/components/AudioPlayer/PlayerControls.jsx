import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

const PlayerControls = () => {
  const {
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isLoading
  } = useMusic();

  // Helper to determine the Repeat button styling and icon
  const renderRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 className="w-5 h-5 text-white" />;
      case 'all':
        return <Repeat className="w-5 h-5 text-white" />;
      case 'none':
      default:
        return <Repeat className="w-5 h-5 text-zinc-500 hover:text-zinc-300" />;
    }
  };

  return (
    <div className="flex items-center gap-3 sm:gap-5 select-none">
      
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        className={`p-2 rounded-lg hover:bg-white/5 transition-all focus:outline-none`}
        title="Shuffle"
      >
        <Shuffle 
          className={`w-4 h-4 sm:w-5 h-5 transition-colors ${
            isShuffle 
              ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`} 
        />
      </button>

      {/* Skip Previous Button */}
      <button
        onClick={previousTrack}
        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none"
        title="Previous Track"
      >
        <SkipBack className="w-5 h-5 sm:w-6 h-6" />
      </button>

      {/* Main Play / Pause Button with a retro circular framing */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-lg focus:outline-none relative group"
        style={{ 
          boxShadow: isPlaying 
            ? '0 0 24px 2px var(--accent-glow, rgba(255, 255, 255, 0.45))' 
            : '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}
        title={isPlaying ? "Pause" : "Play"}
      >
        {/* Loading Spinner overlay */}
        {isLoading && (
          <div className="absolute inset-0 rounded-full border-2 border-zinc-900 border-t-white animate-spin" />
        )}
        
        {isPlaying ? (
          <Pause className="w-5 h-5 sm:w-6 h-6 fill-black" />
        ) : (
          <Play className="w-5 h-5 sm:w-6 h-6 fill-black translate-x-[1px]" />
        )}
      </button>

      {/* Skip Next Button */}
      <button
        onClick={nextTrack}
        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none"
        title="Next Track"
      >
        <SkipForward className="w-5 h-5 sm:w-6 h-6" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        className="p-2 rounded-lg hover:bg-white/5 transition-all focus:outline-none"
        title={`Repeat mode: ${repeatMode}`}
      >
        {renderRepeatIcon()}
      </button>
    </div>
  );
};

export default PlayerControls;
