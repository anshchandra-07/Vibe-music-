import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { getDominantColor } from '../../utils/colorExtractor';

const AlbumArtwork = ({ children }) => {
  const { currentTrack, isPlaying, currentStation } = useMusic();
  const [glowColor, setGlowColor] = useState('rgba(244, 63, 94, 0.4)');
  const artworkRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let active = true;

    const extractColor = async () => {
      if (!currentTrack?.coverUrl) return;

      const colors = await getDominantColor(currentTrack.coverUrl);
      if (!active) return;

      if (colors) {
        setGlowColor(colors.rgba);
        document.documentElement.style.setProperty('--accent-glow', colors.rgba);
        document.documentElement.style.setProperty('--accent-rgb', colors.rgb);
      } else {
        const fallback = currentStation?.glowColor || 'rgba(244, 63, 94, 0.4)';
        setGlowColor(fallback);
        document.documentElement.style.setProperty('--accent-glow', fallback);
      }
    };

    extractColor();

    return () => {
      active = false;
    };
  }, [currentTrack, currentStation]);

  const handleMouseMove = (e) => {
    if (isMobile || !artworkRef.current) return;
    
    const card = artworkRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    setRotateX(-y / (box.height / 2) * 12);
    setRotateY(x / (box.width / 2) * 12);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-[170px] xs:max-w-[200px] sm:max-w-[340px] aspect-square my-2 sm:my-6 mx-auto z-10">
      
      {/* Dynamic Visualizer Canvas Wrapper */}
      <div className="absolute inset-[-25px] sm:inset-[-60px] pointer-events-none select-none z-0">
        {children}
      </div>

      {/* Floating 3D Artwork Frame */}
      <motion.div
        ref={artworkRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          scale: isPlaying ? 1.02 : 0.98
        }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full relative rounded-2xl overflow-visible cursor-pointer z-10"
      >
        {/* Dynamic Glow Shadow behind Artwork */}
        <div 
          className="absolute inset-0 rounded-2xl blur-xl sm:blur-3xl opacity-60 transition-all duration-[3000ms] -z-10"
          style={{ 
            backgroundColor: glowColor,
            boxShadow: `0 0 45px 6px ${glowColor}`
          }}
        />

        {/* 3D Vinyl Record Disc (slides out when playing) */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: isPlaying ? (isMobile ? '16%' : '38%') : 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 22 }}
          className="absolute top-[8%] bottom-[8%] right-0 aspect-square rounded-full z-0 pointer-events-none"
        >
          {/* Rotating Disc */}
          <div className={`w-full h-full rounded-full relative overflow-hidden vinyl-record ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <div className="absolute inset-0 rounded-full vinyl-grooves w-full h-full" />
            <div className="absolute inset-0 rounded-full vinyl-glare w-full h-full" />
            
            {/* Center Label (Miniature album art) */}
            <div className="absolute inset-[32%] rounded-full bg-zinc-900 border border-black/40 overflow-hidden flex items-center justify-center">
              <img 
                src={currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80'} 
                alt={currentTrack?.title ? `${currentTrack.title} cover label` : "Record label"} 
                className="w-full h-full object-cover rounded-full select-none"
                loading="eager"
              />
              <div className="absolute inset-[38%] rounded-full bg-[#030303] border border-black shadow-inner flex items-center justify-center">
                <div className="w-[60%] h-[60%] rounded-full border border-zinc-700 bg-zinc-900" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Frame border (Glass effect) */}
        <div className="w-full h-full rounded-2xl overflow-hidden glass-panel glass-panel-glow p-1.5 sm:p-2 shadow-2xl flex items-center justify-center relative z-10">
          <div className="w-full h-full rounded-xl overflow-hidden relative bg-black/40">
            
            <AnimatePresence mode="wait">
              <motion.img
                key={currentTrack?.id || 'empty'}
                src={currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80'}
                alt={currentTrack?.title ? `${currentTrack.title} - ${currentTrack.artist}` : 'Vibe Retro Radio Album Artwork'}
                initial={{ opacity: 0, x: 30, scale: 1.05 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover select-none"
                loading="eager"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlbumArtwork;
