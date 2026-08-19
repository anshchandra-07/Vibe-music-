import React, { useState } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

const VolumeControl = ({ compact = false }) => {
  const { volume, isMuted, setVolume, toggleMute } = useMusic();
  const [showMobileSlider, setShowMobileSlider] = useState(false);

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
  };

  // Select icon based on volume state
  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 text-zinc-500" />;
    }
    if (volume < 0.4) {
      return <Volume1 className="w-4 h-4 text-zinc-400" />;
    }
    return <Volume2 className="w-4 h-4 text-zinc-300" />;
  };

  const percent = isMuted ? 0 : volume * 100;

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMobileSlider(!showMobileSlider)}
          className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none touch-target"
          title={isMuted ? "Unmute" : "Volume Control"}
          aria-label="Volume Control"
        >
          {renderVolumeIcon()}
        </button>

        {showMobileSlider && (
          <div className="absolute bottom-full right-0 mb-2 p-3 glass-panel rounded-xl border border-white/10 shadow-2xl flex flex-col items-center gap-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[10px] font-mono-retro text-zinc-400">
              {Math.round(percent)}%
            </span>
            <div className="relative flex items-center w-28">
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white pointer-events-none rounded-l"
                style={{ 
                  width: `${percent}%`,
                  backgroundColor: isMuted ? 'rgba(255,255,255,0.1)' : 'var(--accent-glow, #f5f5f5)'
                }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="progress-slider w-full h-6 cursor-pointer relative z-10"
                aria-label="Volume slider"
              />
            </div>
            <button
              onClick={toggleMute}
              className="text-[10px] font-mono-retro text-zinc-400 hover:text-white pt-1 border-t border-white/5 w-full text-center"
            >
              {isMuted ? "UNMUTE" : "MUTE"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-[100px] sm:w-[130px] select-none font-mono-retro">
      
      {/* Mute toggle button */}
      <button
        onClick={toggleMute}
        className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors focus:outline-none touch-target"
        title={isMuted ? "Unmute" : "Mute"}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      >
        {renderVolumeIcon()}
      </button>

      {/* Volume slider track */}
      <div className="relative flex-grow flex items-center group">
        
        {/* Visual progress track fill */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white pointer-events-none rounded-l"
          style={{ 
            width: `${percent}%`,
            backgroundColor: isMuted ? 'rgba(255,255,255,0.1)' : 'var(--accent-glow, #f5f5f5)'
          }}
        />

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="progress-slider w-full h-6 cursor-pointer relative z-10"
          aria-label="Volume level slider"
        />
      </div>
    </div>
  );
};

export default VolumeControl;
