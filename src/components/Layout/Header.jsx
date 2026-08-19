import React, { useState, useEffect } from 'react';
import { Info, Keyboard, Radio } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

// SVG representation of the Instagram logo for standalone rendering
const InstagramIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Header = ({ onOpenAbout, onOpenHelp }) => {
  const { currentStation, isPlaying } = useMusic();
  const [timeStr, setTimeStr] = useState('');

  // Retro Clock updating loop
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      const s = d.getSeconds().toString().padStart(2, '0');
      setTimeStr(`${h}:${m}:${s}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 border-b border-white/5 select-none relative z-20 z-header">
      
      {/* Screen Reader accessible primary heading for SEO */}
      <h1 className="sr-only">Vibe - Retro Internet Radio & Ambient Synthesizer</h1>

      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <Radio className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${isPlaying ? 'animate-pulse' : ''}`} aria-hidden="true" />
        <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white font-mono-retro">
          VIBE
        </span>
      </div>

      {/* Active Station Banner (Hidden on narrow mobile screens) */}
      <div className="hidden sm:flex items-center gap-3.5 glass-panel py-1.5 px-4 rounded-full border border-white/5 font-mono-retro text-[10px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-zinc-600'}`} />
          TUNED:
        </span>
        <span className="text-white font-semibold uppercase tracking-wider">
          {currentStation?.name || "OFFLINE"}
        </span>
      </div>

      {/* Actions & Real-Time Clock */}
      <div className="flex items-center gap-1.5 sm:gap-4 text-xs font-mono-retro">
        
        {/* Help Icon button */}
        <button
          onClick={onOpenHelp}
          className="p-2 sm:p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 focus:outline-none touch-target"
          title="Keyboard Shortcuts"
          aria-label="Open Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden md:inline text-[11px] tracking-wider text-zinc-500 hover:text-zinc-300">SHORTCUTS</span>
        </button>

        {/* Info Icon button */}
        <button
          onClick={onOpenAbout}
          className="p-2 sm:p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 focus:outline-none touch-target"
          title="About Vibe"
          aria-label="Open About Information"
        >
          <Info className="w-4 h-4" />
          <span className="hidden md:inline text-[11px] tracking-wider text-zinc-500 hover:text-zinc-300">ABOUT</span>
        </button>

        {/* Instagram Follow Button */}
        <a
          href="https://www.instagram.com/ansh_x079?igsh=MTVmbTVsM2MyeTJ4bQ==&igsi=MTVmbTVsM2MyeTJ4bQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 sm:p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 focus:outline-none touch-target"
          title="Follow on Instagram"
          aria-label="Follow Vibe on Instagram"
        >
          <InstagramIcon className="w-4 h-4 text-pink-400/80 hover:text-pink-400 transition-colors" />
          <span className="hidden md:inline text-[11px] tracking-wider text-zinc-500 hover:text-zinc-300">FOLLOW</span>
        </a>

        {/* Clock display */}
        <div className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 tracking-wider w-[54px] sm:w-[64px] text-right font-mono-retro select-none border-l border-white/5 pl-2 sm:pl-4 ml-0.5 sm:ml-1">
          {timeStr}
        </div>
      </div>
    </header>
  );
};

export default Header;
