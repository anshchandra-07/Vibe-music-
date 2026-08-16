// Web Audio Synthesizer Engine
// Generates ambient, retro pad chords and resonant chimes in real-time.
// Connected to the main AudioContext analyser for visualizer support.

class AmbientSynthesizer {
  constructor(audioContext, destinationNode) {
    this.ctx = audioContext;
    this.destination = destinationNode; // This should be the AnalyserNode
    this.activeNodes = [];
    this.isPlaying = false;
    this.chordInterval = null;
    this.chimeInterval = null;
    this.synthType = "dreamscape";
    this.masterVolumeNode = null;
    
    // Scale for chimes (Raga Yaman, Bhairavi, and Madhyamad Sarang)
    this.scales = {
      dreamscape: [130.81, 146.83, 164.81, 185.00, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25], // C Yaman (Kalyan Thaat)
      deepfocus: [130.81, 138.59, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63, 277.18, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25],  // C Bhairavi Thaat
      cosmic: [130.81, 146.83, 174.61, 196.00, 233.08, 261.63, 293.66, 349.23, 392.00, 466.16, 523.25]                       // Madhyamad Sarang
    };
  }

  start(synthType = "dreamscape") {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.synthType = synthType;

    // Create a local master gain node for the synth to allow smooth fade-in/out
    this.masterVolumeNode = this.ctx.createGain();
    this.masterVolumeNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterVolumeNode.connect(this.destination);
    
    // Smooth master fade in
    this.masterVolumeNode.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 3.0);

    // Setup delay node for ambient space/echo
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayFeedback = this.ctx.createGain();
    
    this.delayNode.delayTime.setValueAtTime(0.8, this.ctx.currentTime);
    this.delayFeedback.gain.setValueAtTime(0.6, this.ctx.currentTime);
    
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);
    this.delayNode.connect(this.masterVolumeNode);

    // Play initial pad drone
    this.playDrone();

    // Start scheduling random chimes
    this.scheduleChimes();

    // Schedule slow chord changes
    let chordIndex = 0;
    this.chordInterval = setInterval(() => {
      if (!this.isPlaying) return;
      chordIndex++;
      this.playDrone(chordIndex);
    }, 12000); // Change chord every 12 seconds
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    
    // Clear intervals
    if (this.chordInterval) clearInterval(this.chordInterval);
    if (this.chimeInterval) clearInterval(this.chimeInterval);

    // Fade out master volume
    if (this.masterVolumeNode) {
      const fadeTime = 2.0;
      this.masterVolumeNode.gain.setValueAtTime(this.masterVolumeNode.gain.value, this.ctx.currentTime);
      this.masterVolumeNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeTime);

      setTimeout(() => {
        // Stop all active synthesizers
        this.activeNodes.forEach(nodes => {
          try {
            nodes.oscillators.forEach(osc => osc.stop());
          } catch (e) {}
        });
        this.activeNodes = [];
        this.masterVolumeNode.disconnect();
        this.masterVolumeNode = null;
        if (this.delayNode) {
          this.delayNode.disconnect();
          this.delayFeedback.disconnect();
        }
      }, fadeTime * 1000);
    }
  }

  // Plays a rich ambient pad chord
  playDrone(chordIndex = 0) {
    const chordTime = this.ctx.currentTime;
    const notes = this.getChordNotes(chordIndex);
    
    // Fade out previous active chord nodes slowly
    const previousChordNodes = [...this.activeNodes];
    this.activeNodes = [];
    
    previousChordNodes.forEach(nodes => {
      try {
        const fadeTime = 4.0;
        nodes.gainNode.gain.setValueAtTime(nodes.gainNode.gain.value, chordTime);
        nodes.gainNode.gain.linearRampToValueAtTime(0, chordTime + fadeTime);
        setTimeout(() => {
          nodes.oscillators.forEach(osc => {
            try { osc.stop(); } catch (err) {}
          });
        }, fadeTime * 1000);
      } catch (e) {}
    });

    // Create new gains and oscillators for notes in the chord
    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0, chordTime);
    chordGain.connect(this.masterVolumeNode);

    // Smooth chord fade-in
    chordGain.gain.linearRampToValueAtTime(0.15, chordTime + 4.0);

    const oscillators = [];

    // Create a lowpass filter with an LFO-driven cutoff
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.setValueAtTime(3.0, chordTime);
    filter.frequency.setValueAtTime(180, chordTime);
    
    chordGain.connect(filter);
    filter.connect(this.masterVolumeNode);

    // LFO to modulate filter cutoff (gives that breathing synth effect)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, chordTime); // very slow modulation (12.5s cycle)
    lfoGain.gain.setValueAtTime(120, chordTime); // modulate by +/- 120Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    oscillators.push(lfo);

    notes.forEach(freq => {
      // Base oscillator
      const osc = this.ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, chordTime);

      // Fine tuning / Detune (gives a warm chorus effect)
      osc.detune.setValueAtTime((Math.random() - 0.5) * 15, chordTime);

      // Sub sub oscillator (sine) for extra warm low-end
      const subOsc = this.ctx.createOscillator();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(freq / 2, chordTime);
      subOsc.detune.setValueAtTime((Math.random() - 0.5) * 8, chordTime);

      osc.connect(chordGain);
      subOsc.connect(chordGain);

      osc.start();
      subOsc.start();
      oscillators.push(osc, subOsc);
    });

    this.activeNodes.push({ oscillators, gainNode: chordGain });
  }

  // Returns frequency values based on index and synthType
  getChordNotes(chordIndex) {
    // 4 chords cycle
    const cycle = chordIndex % 4;

    if (this.synthType === "deepfocus") {
      // Meditative Bhairavi Phrygian drone chords
      switch (cycle) {
        case 0: return [65.41, 130.81, 196.00, 207.65]; // Sa-Pa-Dha_flat (C2, C3, G3, Ab3)
        case 1: return [69.30, 138.59, 196.00, 233.08]; // Re_flat-Pa-Ni_flat (Db2, Db3, G3, Bb3)
        case 2: return [77.78, 155.56, 207.65, 261.63]; // Ga_flat-Dha_flat-Sa (Eb2, Eb3, Ab3, C4)
        case 3: return [98.00, 196.00, 233.08, 277.18]; // Pa-Ni_flat-Re_flat (G2, G3, Bb3, Db4)
        default: return [65.41, 130.81, 196.00, 207.65];
      }
    } else if (this.synthType === "cosmic") {
      // Floating Madhyamad Sarang chords
      switch (cycle) {
        case 0: return [65.41, 130.81, 174.61, 196.00, 233.08]; // C, F, G, Bb
        case 1: return [73.42, 146.83, 196.00, 220.00, 261.63]; // D, G, A, C
        case 2: return [87.31, 174.61, 233.08, 261.63, 311.13]; // F, Bb, C, Eb
        case 3: return [98.00, 196.00, 261.63, 293.66, 349.23]; // G, C, D, F
        default: return [65.41, 130.81, 174.61, 196.00, 233.08];
      }
    } else {
      // "dreamscape" warm Yaman Kalyan drone chords
      switch (cycle) {
        case 0: return [65.41, 130.81, 196.00, 329.63];         // Sa-Pa-Sa-Ga (C2, C3, G3, E4)
        case 1: return [73.42, 146.83, 196.00, 246.94, 293.66]; // Re-Pa-Ni-Re (D2, D3, G3, B3, D4)
        case 2: return [82.41, 164.81, 220.00, 246.94, 329.63]; // Ga-Dha-Ni-Ga (E2, E3, A3, B3, E4)
        case 3: return [98.00, 196.00, 246.94, 293.66, 392.00];  // Pa-Ni-Re-Pa (G2, G3, B3, D4, G4)
        default: return [65.41, 130.81, 196.00, 329.63];
      }
    }
  }

  // Schedules random chime triggers
  scheduleChimes() {
    const triggerChime = () => {
      if (!this.isPlaying) return;
      
      const delayTime = 3000 + Math.random() * 5000; // Trigger chime every 3-8 seconds
      this.chimeInterval = setTimeout(() => {
        this.playRandomChime();
        triggerChime();
      }, delayTime);
    };

    triggerChime();
  }

  // Plays a single chime note with an envelope and delay routing
  playRandomChime() {
    const time = this.ctx.currentTime;
    
    // Choose random note from active scale
    const activeScale = this.scales[this.synthType] || this.scales.dreamscape;
    const randomFreq = activeScale[Math.floor(Math.random() * activeScale.length)];

    // Create gain node for ADSR
    const chimeGain = this.ctx.createGain();
    chimeGain.gain.setValueAtTime(0, time);
    
    // Dynamic routing: 60% direct to master volume, 40% to echo delay
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const sendDirect = this.ctx.createGain();
    const sendDelay = this.ctx.createGain();
    
    sendDirect.gain.setValueAtTime(0.4, time);
    sendDelay.gain.setValueAtTime(0.6, time);

    chimeGain.connect(sendDirect);
    chimeGain.connect(sendDelay);
    
    if (panner) {
      // Pan randomly for spatial dimension
      panner.pan.setValueAtTime((Math.random() - 0.5) * 1.6, time);
      sendDirect.connect(panner);
      panner.connect(this.masterVolumeNode);
    } else {
      sendDirect.connect(this.masterVolumeNode);
    }
    
    sendDelay.connect(this.delayNode);

    // Simple bell-like envelope: fast attack, medium decay, slow release
    const attack = 0.1 + Math.random() * 0.15;
    const decay = 0.5 + Math.random() * 0.5;
    const sustain = 0.2;
    const release = 2.0 + Math.random() * 1.5;
    const peakVolume = 0.05 + Math.random() * 0.08;

    chimeGain.gain.linearRampToValueAtTime(peakVolume, time + attack);
    chimeGain.gain.exponentialRampToValueAtTime(peakVolume * sustain, time + attack + decay);
    chimeGain.gain.setValueAtTime(peakVolume * sustain, time + attack + decay + 0.5);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay + 0.5 + release);

    // Create bell frequency tone (sine wave)
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(randomFreq, time);

    // Add a soft overtone (1 octave higher, quieter)
    const overtone = this.ctx.createOscillator();
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(randomFreq * 2, time);
    
    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.15, time); // 15% of the main volume
    
    osc.connect(chimeGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(chimeGain);

    osc.start(time);
    overtone.start(time);
    
    const totalDuration = attack + decay + 0.5 + release;
    osc.stop(time + totalDuration);
    overtone.stop(time + totalDuration);

    setTimeout(() => {
      osc.disconnect();
      overtone.disconnect();
      overtoneGain.disconnect();
      chimeGain.disconnect();
      sendDirect.disconnect();
      sendDelay.disconnect();
      if (panner) panner.disconnect();
    }, (totalDuration + 0.5) * 1000);
  }

  setVolume(volume) {
    if (this.masterVolumeNode && this.ctx) {
      this.masterVolumeNode.gain.setValueAtTime(volume * 0.6, this.ctx.currentTime);
    }
  }
}

export default AmbientSynthesizer;

