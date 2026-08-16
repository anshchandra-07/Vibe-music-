// Stations configuration
// Defines the visual themes, glow colors, and descriptions for each nostalgic environment.

export const stations = [
  {
    id: "night-drive",
    name: "Bombay Beats",
    description: "Pulsing Bollywood dance hits and upbeat midnight remixes.",
    mood: "Energetic",
    trackCount: 1,
    glowColor: "rgba(236, 72, 153, 0.5)", // Pink glow
    accentColor: "text-pink-400",
    bgColorClass: "from-pink-950/20 via-black to-slate-950",
    theme: {
      ambientBlobs: ["bg-pink-600/10", "bg-indigo-600/10"],
      particlesColor: "#ec4899",
      visualizerColor: "rgba(236, 72, 153, 0.8)",
      visualizerSecondary: "rgba(99, 102, 241, 0.5)"
    }
  },
  {
    id: "rainy-evening",
    name: "Shaam-e-Ghazal",
    description: "Smooth, soulful ghazals set against the backdrop of soft falling rain.",
    mood: "Soulful",
    trackCount: 2,
    glowColor: "rgba(185, 28, 28, 0.5)", // Red/Mahogany glow
    accentColor: "text-red-400",
    bgColorClass: "from-red-905/30 via-black to-zinc-950",
    theme: {
      ambientBlobs: ["bg-red-700/10", "bg-amber-900/15"],
      particlesColor: "#f87171",
      visualizerColor: "rgba(239, 68, 68, 0.7)",
      visualizerSecondary: "rgba(245, 158, 11, 0.4)"
    }
  },
  {
    id: "late-night",
    name: "Dil Se Lofi",
    description: "Nostalgic Bollywood classics wrapped in cozy, warm lo-fi beats.",
    mood: "Dreamy",
    trackCount: 2,
    glowColor: "rgba(139, 92, 246, 0.5)", // Violet glow
    accentColor: "text-violet-400",
    bgColorClass: "from-violet-950/20 via-black to-neutral-950",
    theme: {
      ambientBlobs: ["bg-violet-600/10", "bg-fuchsia-600/5"],
      particlesColor: "#a78bfa",
      visualizerColor: "rgba(139, 92, 246, 0.8)",
      visualizerSecondary: "rgba(236, 72, 153, 0.4)"
    }
  },
  {
    id: "morning-coffee",
    name: "Subah-e-Sangeet",
    description: "Uplifting acoustic melodies and sweet morning duets from golden eras.",
    mood: "Bright",
    trackCount: 1,
    glowColor: "rgba(245, 158, 11, 0.4)", // Amber glow
    accentColor: "text-amber-400",
    bgColorClass: "from-amber-950/15 via-black to-stone-950",
    theme: {
      ambientBlobs: ["bg-amber-500/10", "bg-yellow-500/5"],
      particlesColor: "#fbbf24",
      visualizerColor: "rgba(245, 158, 11, 0.7)",
      visualizerSecondary: "rgba(234, 179, 8, 0.4)"
    }
  },
  {
    id: "dreamscape",
    name: "Generative Raga",
    description: "Floating sitar echoes and ambient chords synthesized live in Yaman Thaat.",
    mood: "Mystical",
    trackCount: 2,
    glowColor: "rgba(168, 85, 247, 0.5)", // Purple glow
    accentColor: "text-purple-400",
    bgColorClass: "from-purple-950/20 via-black to-violet-950",
    theme: {
      ambientBlobs: ["bg-purple-600/15", "bg-indigo-600/10"],
      particlesColor: "#c084fc",
      visualizerColor: "rgba(168, 85, 247, 0.8)",
      visualizerSecondary: "rgba(99, 102, 241, 0.5)"
    }
  },
  {
    id: "retro-radio",
    name: "Purane Geet",
    description: "Tuning dial scanning legendary Bollywood melodies and vintage ads.",
    mood: "Retro",
    trackCount: 2,
    glowColor: "rgba(16, 185, 129, 0.5)", // Emerald glow
    accentColor: "text-emerald-400",
    bgColorClass: "from-emerald-950/15 via-black to-zinc-950",
    theme: {
      ambientBlobs: ["bg-emerald-600/10", "bg-teal-600/10"],
      particlesColor: "#34d399",
      visualizerColor: "rgba(16, 185, 129, 0.8)",
      visualizerSecondary: "rgba(20, 184, 166, 0.4)"
    }
  },
  {
    id: "deep-focus",
    name: "Meditative Drone",
    description: "Deep classical tanpura waves tuned to Bhairavi Thaat for intense focus.",
    mood: "Focused",
    trackCount: 1,
    glowColor: "rgba(6, 182, 212, 0.5)", // Cyan glow
    accentColor: "text-cyan-400",
    bgColorClass: "from-cyan-950/25 via-black to-zinc-950",
    theme: {
      ambientBlobs: ["bg-cyan-600/15", "bg-slate-700/10"],
      particlesColor: "#22d3ee",
      visualizerColor: "rgba(6, 182, 212, 0.8)",
      visualizerSecondary: "rgba(100, 116, 139, 0.4)"
    }
  },
  {
    id: "sunset",
    name: "Sufi & Soul",
    description: "Heartfelt Sufi melodies and emotional modern ballads under warm sunset skies.",
    mood: "Warm",
    trackCount: 1,
    glowColor: "rgba(244, 63, 94, 0.5)", // Rose glow
    accentColor: "text-rose-400",
    bgColorClass: "from-rose-950/20 via-black to-amber-950/10",
    theme: {
      ambientBlobs: ["bg-rose-500/10", "bg-orange-500/5"],
      particlesColor: "#f43f5e",
      visualizerColor: "rgba(244, 63, 94, 0.8)",
      visualizerSecondary: "rgba(245, 158, 11, 0.4)"
    }
  }
];

