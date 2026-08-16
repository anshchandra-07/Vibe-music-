import React from 'react';
import { X, Info, Heart } from 'lucide-react';

const AboutPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-[480px] glass-panel border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 mb-4">
          <Info className="w-5 h-5 text-zinc-400" />
          <h2 className="text-base font-bold text-white font-mono-retro tracking-wider">
            ABOUT VIBE RADIO
          </h2>
        </div>

        {/* Project Description */}
        <div className="flex flex-col gap-4 text-xs sm:text-sm text-zinc-400 leading-relaxed text-left">
          <p>
            Welcome to <strong className="text-white">Vibe</strong>, a nostalgic digital audio room designed for night listening, deep coding sessions, and relaxed contemplation.
          </p>
          
          <p>
            Vibe maps curated Hindi internet radio stations, legendary retro classics (Kishore Kumar, R.D. Burman, Lata Mangeshkar, and Jagjit Singh's ghazals), and <strong className="text-white">browser-synthesized generative nodes</strong> into a unified, minimal listening deck.
          </p>

          {/* Synth Highlights */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-1.5">
            <h3 className="font-semibold text-white text-xs font-mono-retro">
              GENERATIVE RAGA & DRONE SYNTH
            </h3>
            <p className="text-[11px] text-zinc-500">
              When playing tracks on the <em>Generative Raga</em> or <em>Meditative Drone</em> stations, audio is synthesized dynamically in your browser. Using multiple detuned oscillators, delay lines, and low-frequency modulations, Vibe compiles peaceful sitar-like chimes and tanpura drones tuned to Yaman and Bhairavi raga scales.
            </p>
          </div>

          <p>
            Stream feeds and audio files are compiled from open archives, Internet Archive collections, and public radio relays.
          </p>
        </div>

        {/* Credits Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-5 text-[10px] text-zinc-500 font-mono-retro">
          <span className="flex items-center gap-1">
            MADE WITH <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> FOR LATE NIGHTS
          </span>
          <span>v1.2.0</span>
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
