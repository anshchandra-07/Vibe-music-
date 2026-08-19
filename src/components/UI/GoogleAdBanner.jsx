import React, { useEffect, useState, useRef } from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';

const GoogleAdBanner = ({
  client = "ca-pub-3607991187719913",
  slot = "6300978111",
  format = "horizontal",
  responsive = "true",
  className = "",
  style = {}
}) => {
  const [adError, setAdError] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
    
    if (!existingScript && client) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.onerror = () => setAdError(true);
      document.head.appendChild(script);
    }

    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } else {
        const timeout = setTimeout(() => {
          if (!window.adsbygoogle) {
            setAdError(true);
          }
        }, 1200);
        return () => clearTimeout(timeout);
      }
    } catch (e) {
      console.warn("AdSense load notice:", e);
      setAdError(true);
    }
  }, [client, slot]);

  if (isDismissed) return null;

  return (
    <div 
      className={`w-full max-w-[960px] mx-auto my-0.5 sm:my-1 px-1 sm:px-2 transition-all duration-300 ${className}`}
      style={style}
    >
      <div className="relative glass-panel rounded-xl p-1 sm:p-2 border border-white/10 shadow-md overflow-hidden flex flex-row items-center justify-between gap-2 text-xs font-mono-retro max-h-[52px] sm:max-h-[64px]">
        
        {/* Glowing indicator line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        {/* AdSense Live Slot Container - STRICT MAX HEIGHT to prevent viewport push */}
        {!adError ? (
          <div className="w-full flex justify-center items-center overflow-hidden max-h-[46px] sm:max-h-[56px]" ref={adRef}>
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '100%', maxHeight: '50px', overflow: 'hidden', textAlign: 'center', ...style }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format={format}
              data-full-width-responsive={responsive}
            />
          </div>
        ) : (
          /* Sleek Micro Fallback Banner */
          <div className="w-full flex flex-row items-center justify-between gap-2 py-0.5 px-1 select-none">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <div className="flex flex-col min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold bg-purple-950/40 px-1 py-0.2 rounded border border-purple-500/30 shrink-0">
                    AD
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-white truncate">
                    Vibe Premium
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="https://www.instagram.com/ansh_x079"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-[10px] sm:text-[11px] transition-all flex items-center gap-1 border border-white/10"
              >
                <span>SUPPORT</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                title="Dismiss ad"
                aria-label="Dismiss advertisement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAdBanner;
