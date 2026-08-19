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

  const renderRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />;
      case 'all':
        return <Repeat className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />;
      case 'none':
      default:
        return <Repeat className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 hover:text-zinc-300" aria-hidden="true" />;
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-5 select-none">
      
      {/* Shuffle Button */}
      <button
        onClick={toggleShuffle}
        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-all focus:outline-none touch-target"
        title={`Shuffle mode ${isShuffle ? 'enabled' : 'disabled'}`}
        aria-label={`Toggle Shuffle (${isShuffle ? 'On' : 'Off'})`}
      >
        <Shuffle 
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
            isShuffle 
              ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`} 
        />
      </button>

      {/* Skip Previous Button */}
      <button
        onClick={previousTrack}
        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none touch-target"
        title="Previous Track"
        aria-label="Skip to previous track"
      >
        <SkipBack className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
      </button>

      {/* Main Play / Pause Button */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-lg focus:outline-none relative group touch-target"
        style={{ 
          boxShadow: isPlaying 
            ? '0 0 20px 2px var(--accent-glow, rgba(255, 255, 255, 0.45))' 
            : '0 4px 14px rgba(0, 0, 0, 0.4)'
        }}
        title={isPlaying ? "Pause playback" : "Start playback"}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isLoading && (
          <div className="absolute inset-0 rounded-full border-2 border-zinc-900 border-t-white animate-spin" />
        )}
        
        {isPlaying ? (
          <Pause className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-black" aria-hidden="true" />
        ) : (
          <Play className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-black translate-x-[1px]" aria-hidden="true" />
        )}
      </button>

      {/* Skip Next Button */}
      <button
        onClick={nextTrack}
        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none touch-target"
        title="Next Track"
        aria-label="Skip to next track"
      >
        <SkipForward className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={toggleRepeat}
        className="p-1.5 sm:p-2 rounded-lg hover:bg-white/5 transition-all focus:outline-none touch-target"
        title={`Repeat mode: ${repeatMode}`}
        aria-label={`Toggle repeat mode (Current: ${repeatMode})`}
      >
        {renderRepeatIcon()}
      </button>
    </div>
  );
};

export default PlayerControls;
