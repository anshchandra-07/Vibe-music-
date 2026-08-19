import React, { useEffect, useState, useRef } from 'react';
import { X, ExternalLink, Sparkles } from 'lucide-react';

const GoogleAdBanner = ({
  client = "ca-pub-3607991187719913", // User AdSense Publisher ID
  slot = "6300978111",                // Responsive ad slot ID
  format = "auto",
  responsive = "true",
  className = "",
  style = {}
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    // Attempt to load Google Adsense script if not present
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
        setAdLoaded(true);
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
      className={`w-full max-w-[960px] mx-auto my-2 px-2 transition-all duration-300 ${className}`}
      style={style}
    >
      <div className="relative glass-panel rounded-xl p-2.5 sm:p-3 border border-white/10 shadow-lg overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-retro">
        
        {/* Top or background indicator line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        {/* AdSense Live Slot Container */}
        {!adError ? (
          <div className="w-full flex justify-center items-center overflow-hidden min-h-[50px] sm:min-h-[60px]" ref={adRef}>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', textAlign: 'center', ...style }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format={format}
              data-full-width-responsive={responsive}
            />
          </div>
        ) : (
          /* Aesthetic Fallback Banner when script is offline or in test mode */
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 py-1 px-2 select-none">
            <div className="flex items-center gap-2.5 text-zinc-300">
              <span className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-500/30">
                    SPONSORED
                  </span>
                  <span className="text-xs font-semibold text-white">
                    Upgrade Your Vibe Experience
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  Stream uninterrupted high-fidelity audio & Support independent radio creators.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/ansh_x079"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-all flex items-center gap-1 border border-white/10"
              >
                <span>SUPPORT</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                title="Dismiss ad"
                aria-label="Dismiss advertisement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAdBanner;
