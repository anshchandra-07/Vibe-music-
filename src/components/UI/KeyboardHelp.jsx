import React from 'react';
import { X, Keyboard } from 'lucide-react';

const KeyboardHelp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "SPACE", desc: "Toggle Play / Pause" },
    { key: "← / →", desc: "Previous / Next Track" },
    { key: "↑ / ↓", desc: "Increase / Decrease Volume" },
    { key: "M", desc: "Mute / Unmute Volume" },
    { key: "S", desc: "Toggle Playlist Shuffle" },
    { key: "R", desc: "Cycle Repeat Mode (None / All / One)" },
    { key: "Q", desc: "Toggle Current Queue Drawer" },
    { key: "H", desc: "Toggle Radio Stations Drawer" },
    { key: "F", desc: "Toggle Fullscreen Immersive Mode" },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-[450px] glass-panel border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl relative"
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
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 mb-5 select-none">
          <Keyboard className="w-5 h-5 text-zinc-400" />
          <h2 className="text-base font-bold text-white font-mono-retro tracking-wider">
            KEYBOARD SHORTCUTS
          </h2>
        </div>

        {/* Shortcuts List */}
        <div className="flex flex-col gap-3 font-mono-retro">
          {shortcuts.map((s, index) => (
            <div key={index} className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.02]">
              <span className="text-zinc-400 text-left pr-4">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-white/10 text-white font-semibold text-[10px] min-w-[50px] text-center border border-white/5 shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        
        {/* Info footer */}
        <div className="text-[10px] text-zinc-500 font-mono-retro text-center pt-5 select-none">
          PRESS ESCAPE OR CLICK CLOSE TO EXIT
        </div>
      </div>
    </div>
  );
};

export default KeyboardHelp;
