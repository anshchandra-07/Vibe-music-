import React from 'react';
import { motion } from 'framer-motion';
import { X, ListMusic, Trash2, Play } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

const QueuePanel = ({ isOpen, onClose }) => {
  const { 
    queue, 
    currentTrack, 
    selectTrack, 
    removeTrackFromQueue, 
    isPlaying 
  } = useMusic();

  if (!isOpen) return null;

  const upcomingTracks = queue.filter(t => t.id !== currentTrack?.id);

  return (
    <>
      {/* Backdrop overlay for mobile & tablet */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
        onClick={onClose}
        aria-label="Close queue panel backdrop"
      />

      <motion.div
        initial={{ x: 350, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 350, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed top-0 right-0 bottom-0 w-[88vw] max-w-[340px] sm:w-[320px] glass-panel border-l border-white/10 z-50 p-4 sm:p-5 flex flex-col gap-4 shadow-2xl h-full"
        role="dialog"
        aria-modal="true"
        aria-label="Playback Queue panel"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-zinc-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-white font-mono-retro tracking-wide">
              PLAYBACK QUEUE
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors focus:outline-none touch-target"
            title="Close panel"
            aria-label="Close playback queue panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Queue Content */}
        <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-5 custom-scrollbar">
          
          {/* NOW PLAYING section */}
          {currentTrack && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-zinc-500 font-mono-retro tracking-wider">
                NOW PLAYING
              </h3>
              
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.title ? `${currentTrack.title} cover` : "Track cover"} 
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate glow-text-soft">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate font-mono-retro">
                    {currentTrack.artist}
                  </p>
                </div>
                {isPlaying && (
                  <div className="flex gap-0.5 items-end h-3" aria-label="Audio playing indicator">
                    <span className="w-[2px] bg-white animate-audio-bar-1 rounded-t" />
                    <span className="w-[2px] bg-white animate-audio-bar-2 rounded-t" />
                    <span className="w-[2px] bg-white animate-audio-bar-3 rounded-t" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* UPCOMING TRACKS section */}
          <div className="flex flex-col gap-2 flex-grow">
            <h3 className="text-xs font-bold text-zinc-500 font-mono-retro tracking-wider">
              UPCOMING ({upcomingTracks.length})
            </h3>
            
            {upcomingTracks.length === 0 ? (
              <div className="text-center text-xs text-zinc-600 py-8 font-mono-retro select-none">
                QUEUE IS EMPTY
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingTracks.map((track) => (
                  <div 
                    key={track.id}
                    className="p-2.5 rounded-lg border border-transparent hover:border-white/5 hover:bg-white/[0.02] flex items-center gap-3 group transition-all"
                  >
                    {/* Tiny Play Button overlay on cover */}
                    <div 
                      className="relative w-9 h-9 cursor-pointer rounded-md overflow-hidden flex-shrink-0"
                      onClick={() => selectTrack(track)}
                    >
                      <img 
                        src={track.coverUrl} 
                        alt={track.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    </div>

                    <div className="flex-grow min-w-0" onClick={() => selectTrack(track)}>
                      <h4 className="text-xs font-medium text-zinc-300 truncate group-hover:text-white transition-colors cursor-pointer">
                        {track.title}
                      </h4>
                      <p className="text-[10px] text-zinc-500 truncate cursor-pointer font-mono-retro">
                        {track.artist}
                      </p>
                    </div>

                    {/* Delete item action */}
                    <button
                      onClick={() => removeTrackFromQueue(track.id)}
                      className="p-2 rounded-md hover:bg-red-500/10 text-zinc-600 hover:text-red-400 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all focus:outline-none touch-target"
                      title="Remove from queue"
                      aria-label={`Remove ${track.title} from queue`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Animation overrides */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes audio-bar-pulse {
            0%, 100% { height: 4px; }
            50% { height: 12px; }
          }
          .animate-audio-bar-1 { animation: audio-bar-pulse 0.8s infinite ease-in-out; }
          .animate-audio-bar-2 { animation: audio-bar-pulse 0.5s infinite ease-in-out 0.2s; }
          .animate-audio-bar-3 { animation: audio-bar-pulse 0.7s infinite ease-in-out 0.1s; }
        `}} />
      </motion.div>
    </>
  );
};

export default QueuePanel;
