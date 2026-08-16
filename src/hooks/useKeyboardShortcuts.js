import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  togglePlay,
  nextTrack,
  previousTrack,
  volume,
  setVolume,
  toggleMute,
  toggleShuffle,
  toggleRepeat,
  toggleQueue,
  toggleStations,
  toggleFullscreen
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not trigger shortcuts when typing in inputs or textareas
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === 'input' || 
        activeTag === 'textarea' || 
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault(); // Stop page scrolling
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousTrack();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyS':
          toggleShuffle();
          break;
        case 'KeyR':
          toggleRepeat();
          break;
        case 'KeyQ':
          toggleQueue();
          break;
        case 'KeyH':
          toggleStations();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlay,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    repeatMode => {}, // Dependency checking
    toggleRepeat,
    toggleQueue,
    toggleStations,
    toggleFullscreen
  ]);
};
