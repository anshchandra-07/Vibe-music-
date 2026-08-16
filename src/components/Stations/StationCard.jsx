import React from 'react';
import { Radio } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

const StationCard = ({ station }) => {
  const { currentStation, changeStation, isPlaying } = useMusic();
  const isActive = currentStation?.id === station.id;

  const handleCardClick = () => {
    changeStation(station.id);
  };

  return (
    <button
      onClick={handleCardClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 relative group flex items-start gap-3.5 focus:outline-none ${
        isActive 
          ? 'glass-panel border-white/20 shadow-md bg-white/5' 
          : 'border-white/5 bg-transparent hover:bg-white/[0.02] hover:border-white/10'
      }`}
      style={{
        boxShadow: isActive ? `0 0 20px -5px ${station.glowColor}` : 'none'
      }}
    >
      {/* Station Icon / Active Indicator */}
      <div 
        className={`p-2 rounded-lg flex items-center justify-center transition-all ${
          isActive 
            ? 'bg-white text-black scale-105' 
            : 'bg-white/5 text-zinc-400 group-hover:text-zinc-200'
        }`}
      >
        <Radio className="w-4 h-4" />
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-zinc-300'}`}>
            {station.name}
          </h4>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 font-mono-retro">
            {station.mood.toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {station.description}
        </p>
      </div>

      {/* Pulsing Dot for playing state */}
      {isActive && isPlaying && (
        <span className="absolute right-3.5 top-3.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: station.particlesColor }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: station.particlesColor }} />
        </span>
      )}
    </button>
  );
};

export default StationCard;
