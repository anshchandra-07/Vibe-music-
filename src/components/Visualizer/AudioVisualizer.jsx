import React, { useEffect, useRef } from 'react';
import { useMusic } from '../../context/MusicContext';

const AudioVisualizer = () => {
  const { isPlaying, analyser, isAudioContextInitialized } = useMusic();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Store particle locations
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    // Handle high-DPI screen adjustments
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize floating ambient particles
    const particleCount = 40;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 120 + Math.random() * 80,
        speed: 0.2 + Math.random() * 0.4,
        size: 1 + Math.random() * 3,
        opacity: 0.1 + Math.random() * 0.4,
        colorSeed: Math.random()
      });
    }
    particlesRef.current = particles;

    // Analyzer buffers
    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);

    // Simulated waveform timers
    let simTime = 0;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      // Clear with very light trails for a glowing neon trace look
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      
      // Determine glow and color themes from active context CSS variables
      const rawGlow = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
      const accentRGB = rawGlow || '244, 63, 94'; // default rose
      const primaryColor = `rgb(${accentRGB})`;

      // 1. Fetch Frequency Data or Setup Simulated Fallback
      let averageFreq = 0;
      let hasData = false;

      if (isPlaying && isAudioContextInitialized && analyser) {
        analyser.getByteFrequencyData(dataArray);
        
        // Check if we are receiving actual data (CORS blocks can result in all zeroes)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        averageFreq = sum / bufferLength;
        
        if (averageFreq > 1.5) {
          hasData = true;
        }
      }

      // If playing but no data (e.g. CORS block on icecast streams), simulate frequencies
      if (isPlaying && !hasData) {
        simTime += 0.05;
        // Generate mock data mimicking lofi frequencies
        for (let i = 0; i < bufferLength; i++) {
          // Low frequencies have higher amplitude, high frequencies lower
          const factor = Math.max(0, 1 - (i / bufferLength));
          const wave = Math.sin(simTime + i * 0.12) * Math.cos(simTime * 0.7 + i * 0.05);
          const noise = Math.sin(simTime * 2.1 + i * 0.4) * 0.3;
          dataArray[i] = Math.max(10, Math.floor((wave + noise + 1.2) * 55 * factor));
        }
        averageFreq = 40; // Simulated average frequency
      } else if (!isPlaying) {
        // Paused visualizer breathing pulse
        simTime += 0.015;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.floor(10 + Math.sin(simTime + i * 0.05) * 6);
        }
        averageFreq = 8;
      }

      // Update global CSS custom properties for music-reactive animations
      const normalizedPulse = isPlaying ? 1 + (averageFreq / 180) * 0.08 : 1; // scale from 1.0 to 1.08
      document.documentElement.style.setProperty('--music-pulse', normalizedPulse);
      document.documentElement.style.setProperty('--music-pulse-raw', averageFreq);

      // 2. Draw Floating Orbiting Particles
      particles.forEach(p => {
        // Particles speed up/glow depending on sound amplitude
        const speedMultiplier = 1 + (averageFreq / 60);
        p.angle += (p.speed * 0.005) * speedMultiplier;
        
        // Pulse distance slightly with audio
        const pulse = isPlaying ? (dataArray[Math.floor(p.colorSeed * 10)] || 0) * 0.15 : 0;
        const currentDistance = p.distance + pulse;

        const px = cx + Math.cos(p.angle) * currentDistance;
        const py = cy + Math.sin(p.angle) * currentDistance;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        
        // Alternating particle colors (primary accent or secondary soft blue/indigo)
        ctx.fillStyle = p.colorSeed > 0.5 
          ? `rgba(${accentRGB}, ${p.opacity * (1 + (averageFreq / 100))})`
          : `rgba(99, 102, 241, ${p.opacity * 0.6})`;
          
        ctx.shadowBlur = isPlaying ? p.size * 2 : 0;
        ctx.shadowColor = primaryColor;
        ctx.fill();
      });

      // Reset shadows for main lines
      ctx.shadowBlur = 0;

      // 3. Draw Inner Circular Frequencies Waveform
      const innerRadius = Math.min(width, height) * 0.28; // Fits around album art
      
      // Draw outer secondary rings
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 10, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${accentRGB}, 0.05)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 20, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.02)`;
      ctx.stroke();

      // Plot circular wave path
      ctx.beginPath();
      const points = 72; // Circular subdivisions
      const step = (Math.PI * 2) / points;

      for (let i = 0; i <= points; i++) {
        const angle = i * step;
        
        // Sample frequency array mapped symmetrically around the circle
        const index = Math.floor(Math.abs(Math.sin(angle)) * (bufferLength / 2));
        const amplitude = dataArray[index] || 0;
        
        // Dampen higher frequency spikes to make it smoother
        const scale = isPlaying ? 0.25 : 0.08;
        const offset = amplitude * scale;
        const r = innerRadius + offset;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      
      // Styling the waveform path
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = isPlaying ? 15 : 4;
      ctx.shadowColor = primaryColor;
      ctx.stroke();

      // Reset shadow glow
      ctx.shadowBlur = 0;

      // 4. Draw Radial Bar Graph (Spikes pointing outward)
      const graphRadius = innerRadius + 6;
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < points; i++) {
        const angle = i * step;
        const index = Math.floor((i / points) * (bufferLength / 3));
        const amplitude = dataArray[index] || 0;

        if (amplitude < 10) continue;

        const length = isPlaying ? amplitude * 0.12 : 2;
        
        const x1 = cx + Math.cos(angle) * graphRadius;
        const y1 = cy + Math.sin(angle) * graphRadius;
        const x2 = cx + Math.cos(angle) * (graphRadius + length);
        const y2 = cy + Math.sin(angle) * (graphRadius + length);

        // Gradient color for spikes (fading out)
        const alpha = isPlaying ? Math.max(0.1, Math.min(0.65, amplitude / 180)) : 0.08;
        ctx.strokeStyle = `rgba(${accentRGB}, ${alpha})`;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    // Begin loop
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.documentElement.style.setProperty('--music-pulse', 1);
      document.documentElement.style.setProperty('--music-pulse-raw', 0);
    };
  }, [isPlaying, analyser, isAudioContextInitialized]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}
    />
  );
};

export default AudioVisualizer;
