import React, { useState, useEffect } from 'react';
import { Terminal, Radio } from 'lucide-react';

const LoadingScreen = ({ onEnter }) => {
  const [bootLogs, setBootLogs] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const logs = [
    "LOADING VIBE OS v1.2...",
    "DETECTING WEB AUDIO HARDWARE...",
    "INIT AUDIO CONTEXT... OK",
    "CONNECTING ANALOG SYNTHESIZER... READY",
    "POLLING STREAM ENDPOINTS... SYNCED",
    "TUNING NOSTALGIC FREQUENCIES...",
    "READY TO LAUNCH."
  ];

  // Progressive console output animation
  useEffect(() => {
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBootLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 350); // fast log printing

    return () => clearInterval(interval);
  }, []);

  const handleEnterClick = () => {
    setIsFading(true);
    // Let fade-out animation play before unlocking
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div 
      className={`fixed inset-0 bg-[#030303] z-[9999] flex flex-col items-center justify-center p-6 text-emerald-400 font-mono-retro transition-opacity duration-500 ease-out select-none screen-flicker ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Visual overlays mirroring the main site */}
      <div className="vignette" />
      <div className="scanlines animate-[crt-flicker_0.15s_infinite]" />

      <div className="w-full max-w-[500px] flex flex-col gap-6">
        
        {/* Logo and Boot Headers */}
        <div className="flex flex-col gap-2 border-b border-emerald-950 pb-4">
          <div className="flex items-center gap-3">
            <Radio className="w-8 h-8 text-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-widest text-white">
              VIBE RADIO SYSTEM
            </h1>
          </div>
          <div className="text-[10px] text-emerald-600 flex justify-between">
            <span>STEREOPHONIC TRANSMISSION</span>
            <span>MODEL 2026</span>
          </div>
        </div>

        {/* Boot Terminal Output logs */}
        <div className="h-[180px] bg-black/60 border border-emerald-950 p-4 rounded-lg flex flex-col gap-1.5 overflow-hidden text-xs text-left shadow-2xl relative">
          {bootLogs.map((log, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="text-emerald-700">{">"}</span>
              <span>{log}</span>
            </div>
          ))}
          {!showButton && (
            <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-blink ml-6 mt-1" />
          )}
        </div>

        {/* Enter Button */}
        <div className="h-[60px] flex items-center justify-center">
          {showButton && (
            <button
              onClick={handleEnterClick}
              className="px-8 py-3 rounded-lg border border-emerald-400/30 hover:border-emerald-400 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 transition-all font-semibold tracking-widest cursor-pointer shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_25px_rgba(52,211,153,0.3)] active:scale-95 duration-200"
            >
              ▶ ENTER ROOM
            </button>
          )}
        </div>
      </div>

      {/* Styles for flashing cursor */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-blink { animation: blink 0.8s infinite; }
      `}} />
    </div>
  );
};

export default LoadingScreen;
