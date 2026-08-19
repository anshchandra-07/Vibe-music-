import React from 'react';
import { useMusic } from '../../context/MusicContext';

const ProgressBar = () => {
  const { currentTrack, currentTime, duration, seek, isPlaying } = useMusic();

  // Helper to format seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  if (currentTrack?.isStream) {
    return (
      <div className="w-full flex flex-col items-center gap-1.5 py-1.5 select-none">
        {/* Live Broadcast Indicator */}
        <div className="w-full flex items-center justify-between text-xs font-mono-retro text-zinc-500">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full bg-red-500 ${isPlaying ? 'animate-pulse' : ''}`} aria-hidden="true" />
            <span className="text-red-400 font-semibold tracking-wider">LIVE STREAM</span>
          </div>
          <div className="tracking-wide text-zinc-400">TUNING INTERNET RADIO</div>
        </div>

        {/* Live Stream Line Visualizer */}
        <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden relative">
          <div 
            className="absolute top-0 bottom-0 left-0 bg-red-500/70 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            style={{ 
              width: isPlaying ? '35%' : '0%',
              animation: isPlaying ? 'live-sweep 2.5s infinite alternate ease-in-out' : 'none'
            }}
          />
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes live-sweep {
            0% { left: 0%; width: 15%; }
            50% { width: 40%; }
            100% { left: 75%; width: 25%; }
          }
        `}} />
      </div>
    );
  }

  // Calculate percentage for progress bar fill styling
  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-1 py-1 font-mono-retro">
      {/* Time Stamp readouts */}
      <div className="w-full flex justify-between text-[11px] text-zinc-500 select-none">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Seek Range Input */}
      <div className="w-full relative group flex items-center">
        {/* Background track fill helper (colored overlay) */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-white pointer-events-none rounded-l"
          style={{ 
            width: `${percent}%`,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.4)',
            backgroundColor: 'var(--accent-glow, #f5f5f5)'
          }}
        />
        
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeekChange}
          className="progress-slider w-full h-6 sm:h-8 cursor-pointer relative z-10"
          aria-label="Track progress slider"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration || 0)}
          aria-valuenow={Math.floor(currentTime || 0)}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
