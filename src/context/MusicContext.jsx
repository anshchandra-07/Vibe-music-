import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { tracks as initialTracks } from '../data/tracks';
import { stations } from '../data/stations';
import AmbientSynthesizer from '../utils/audioUtils';

const MusicContext = createContext(null);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within a MusicProvider");
  return context;
};

export const MusicProvider = ({ children }) => {
  // Central State
  const [playlist, setPlaylist] = useState(initialTracks);
  const [queue, setQueue] = useState(initialTracks);
  const [currentStation, setCurrentStation] = useState(stations[0]);
  const [currentTrack, setCurrentTrack] = useState(initialTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none' | 'one' | 'all'
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  
  // Web Audio Context State
  const [isAudioContextInitialized, setIsAudioContextInitialized] = useState(false);

  // Audio References
  const audioRef = useRef(new Audio());
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const synthRef = useRef(null);

  // Virtual progress interval for synthesizer (generative tracks)
  const synthIntervalRef = useRef(null);

  // 1. Initialize HTML5 Audio listeners on mount
  useEffect(() => {
    const audio = audioRef.current;
    audio.crossOrigin = "anonymous";

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setAudioError(null);
    };
    
    const handleTimeUpdate = () => {
      if (currentTrack && !currentTrack.isSynthesized) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (currentTrack && !currentTrack.isSynthesized) {
        setDuration(audio.duration || 0);
      }
    };

    const handleError = (e) => {
      console.error("Audio error event:", e);
      setIsLoading(false);
      
      // Don't crash for autoplay blocks
      if (audio.src && audio.src !== window.location.href) {
        setAudioError("Unable to load audio. Retrying or falling back...");
        // Auto fallback to synthesizer after a short delay if stream fails
        setTimeout(() => {
          triggerSynthesizerFallback();
        }, 1500);
      }
    };

    const handleEnded = () => {
      handleTrackEnded();
    };

    // Attach listeners
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      // Cleanup listeners
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    };
  }, [currentTrack, queue, isShuffle, repeatMode]);

  // Sync volume state to audio element
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
    if (synthRef.current) {
      synthRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Synchronize synth volume adjustments
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [isAudioContextInitialized]);

  // 2. Initialize Web Audio API on first user interaction
  const initAudioContext = async () => {
    if (isAudioContextInitialized) return true;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Create Analyser Node
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Connect HTML5 Audio Source to Analyser
      // Need to handle browser limitations: MediaElementAudioSourceNode can only be created once per element
      if (!sourceNodeRef.current) {
        sourceNodeRef.current = ctx.createMediaElementSource(audioRef.current);
      }
      sourceNodeRef.current.connect(analyser);
      analyser.connect(ctx.destination);

      // Create Synth connected to Analyser
      synthRef.current = new AmbientSynthesizer(ctx, analyser);
      synthRef.current.setVolume(volume);

      // Resume context if suspended (browser security)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      setIsAudioContextInitialized(true);
      return true;
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
      return false;
    }
  };

  // Helper: Trigger synth fallback if a network stream fails
  const triggerSynthesizerFallback = () => {
    if (currentTrack && currentTrack.isStream) {
      console.warn("Stream failed, falling back to generative synth...");
      setAudioError("Stream unavailable. Activating ambient generative synthesizer...");
      
      // Modify current track to act as synth
      const fallbackTrack = {
        ...currentTrack,
        title: `${currentTrack.title} (Generative Synth)`,
        artist: "Antigravity Ambient Engine",
        isSynthesized: true,
        synthType: "dreamscape",
        duration: 600
      };
      
      setCurrentTrack(fallbackTrack);
      playTrack(fallbackTrack);
    }
  };

  // 3. Main Play / Pause controls
  const play = async () => {
    setAudioError(null);
    
    // Auto initialize audio context on play if not already done
    if (!isAudioContextInitialized) {
      const success = await initAudioContext();
      if (!success) return;
    }

    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (currentTrack.isSynthesized) {
      if (synthRef.current) {
        synthRef.current.start(currentTrack.synthType);
        setIsPlaying(true);
        startVirtualTimeline();
      }
    } else {
      try {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback block / error:", err);
        setIsPlaying(false);
        setIsLoading(false);
        setAudioError("Autoplay restricted. Press Play to start.");
      }
    }
  };

  const pause = () => {
    if (currentTrack.isSynthesized) {
      if (synthRef.current) {
        synthRef.current.stop();
        setIsPlaying(false);
        stopVirtualTimeline();
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // 4. Playback Navigation
  const playTrack = (track) => {
    // Clean up current track
    if (synthRef.current) synthRef.current.stop();
    audioRef.current.pause();
    stopVirtualTimeline();
    
    setAudioError(null);
    setCurrentTrack(track);
    setCurrentTime(0);

    if (track.isSynthesized) {
      setDuration(track.duration || 600);
      setIsLoading(false);
      
      // If we are already playing or context is active, start synthesizer
      if (isPlaying || isAudioContextInitialized) {
        if (synthRef.current) {
          synthRef.current.start(track.synthType);
          setIsPlaying(true);
          startVirtualTimeline();
        }
      }
    } else {
      setIsLoading(true);
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      
      if (isPlaying || isAudioContextInitialized) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(err => {
            console.warn("Playback delayed until interaction:", err);
            // Don't flag error, just set state to paused
            setIsPlaying(false);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    }
  };

  const selectTrack = (track) => {
    // Add to queue if not present, and play
    if (!queue.find(t => t.id === track.id)) {
      setQueue(prev => [...prev, track]);
    }
    playTrack(track);
  };

  const nextTrack = () => {
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playTrack(queue[randomIndex]);
    } else if (currentIndex < queue.length - 1) {
      playTrack(queue[currentIndex + 1]);
    } else if (repeatMode === 'all') {
      playTrack(queue[0]);
    } else {
      // No more tracks, stop playback
      pause();
      setCurrentTime(0);
    }
  };

  const previousTrack = () => {
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1) return;

    if (audioRef.current.currentTime > 5) {
      // Restart current track if played past 5s
      seek(0);
    } else if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    } else if (repeatMode === 'all') {
      playTrack(queue[queue.length - 1]);
    } else {
      seek(0);
    }
  };

  // 5. Track End Handling
  const handleTrackEnded = () => {
    if (repeatMode === 'one') {
      if (currentTrack.isSynthesized) {
        setCurrentTime(0);
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    } else {
      nextTrack();
    }
  };

  // 6. Seek & Volume Controls
  const seek = (time) => {
    setCurrentTime(time);
    if (!currentTrack.isSynthesized) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (vol) => {
    const clampedVol = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVol);
    if (clampedVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  // 7. Station Changing
  const changeStation = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    setCurrentStation(station);

    // Filter tracks for this station
    const stationTracks = initialTracks.filter(t => t.stationId === stationId);
    if (stationTracks.length > 0) {
      setPlaylist(stationTracks);
      setQueue(stationTracks);
      // Play first track of new station
      playTrack(stationTracks[0]);
    }
  };

  // 8. Virtual Progress Timeline for Generative Tracks (since synth has no native duration)
  const startVirtualTimeline = () => {
    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    
    synthIntervalRef.current = setInterval(() => {
      setCurrentTime(prevTime => {
        const nextTime = prevTime + 1;
        if (nextTime >= duration) {
          handleTrackEnded();
          return 0;
        }
        return nextTime;
      });
    }, 1000);
  };

  const stopVirtualTimeline = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Helper functions for Queue panel adjustments
  const removeTrackFromQueue = (trackId) => {
    if (currentTrack.id === trackId) {
      nextTrack();
    }
    setQueue(prev => prev.filter(t => t.id !== trackId));
  };

  const reorderQueue = (startIndex, endIndex) => {
    const result = Array.from(queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setQueue(result);
  };

  return (
    <MusicContext.Provider
      value={{
        // State
        playlist,
        queue,
        currentStation,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        isLoading,
        audioError,
        isAudioContextInitialized,
        analyser: analyserRef.current,
        audioContext: audioContextRef.current,

        // Actions
        initAudioContext,
        play,
        pause,
        togglePlay,
        nextTrack,
        previousTrack,
        selectTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        changeStation,
        removeTrackFromQueue,
        reorderQueue
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
export default MusicContext;
