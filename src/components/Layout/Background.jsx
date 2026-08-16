import React from 'react';
import { useMusic } from '../../context/MusicContext';

const Background = () => {
  const { currentStation } = useMusic();
  const theme = currentStation?.theme || {
    ambientBlobs: ["bg-rose-600/10", "bg-blue-600/10"]
  };

  return (
    <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none select-none">
      {/* Dynamic Ambient Blur Container */}
      <div className="ambient-container absolute inset-0">
        {/* Blob 1 (Top Left) */}
        <div 
          className={`ambient-blob blob-1 ${theme.ambientBlobs[0] || 'bg-rose-600/10'}`} 
          style={{ transition: 'background-color 3s ease' }}
        />
        {/* Blob 2 (Bottom Right) */}
        <div 
          className={`ambient-blob blob-2 ${theme.ambientBlobs[1] || 'bg-blue-600/10'}`}
          style={{ transition: 'background-color 3s ease' }}
        />
      </div>

      {/* Screen Vignette for Cinematic Feel */}
      <div className="vignette" />

      {/* Retro TV Scanlines */}
      <div className="scanlines" />

      {/* Animated Film Grain Noise */}
      <div className="noise-overlay" />
    </div>
  );
};

export default Background;
