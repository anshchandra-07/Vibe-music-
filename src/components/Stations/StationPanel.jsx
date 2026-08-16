import React from 'react';
import { motion } from 'framer-motion';
import { X, Radio } from 'lucide-react';
import { stations } from '../../data/stations';
import StationCard from './StationCard';

const StationPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      <motion.div
        initial={{ x: -350, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -350, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 bottom-0 w-full max-w-[340px] md:w-[320px] glass-panel border-r border-white/5 z-40 p-5 flex flex-col gap-4 shadow-2xl h-full"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-zinc-400" />
            <h2 className="text-base font-bold text-white font-mono-retro tracking-wide">
              RADIO STATIONS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none"
            title="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stations List (Scrollable) */}
        <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-3 custom-scrollbar">
          {stations.map(station => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
        
        {/* Retro Info footer */}
        <div className="text-[10px] text-zinc-600 font-mono-retro select-none text-center pt-2 border-t border-white/5">
          BROADCASTING IN STEREO · 320KBPS
        </div>
      </motion.div>
    </>
  );
};

export default StationPanel;
