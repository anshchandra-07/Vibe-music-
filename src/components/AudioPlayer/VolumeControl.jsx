import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

const VolumeControl = () => {
  const { volume, isMuted, setVolume, toggleMute } = useMusic();

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

  return (
    <div className="flex items-center gap-3 w-[110px] sm:w-[130px] select-none font-mono-retro">
      
      {/* Mute toggle button */}
      <button
        onClick={toggleMute}
        className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors focus:outline-none"
        title={isMuted ? "Unmute" : "Mute"}
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
        />
      </div>
    </div>
  );
};

export default VolumeControl;
