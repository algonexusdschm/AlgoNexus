import React, { useState, useRef } from 'react';
import { Sparkles, Shield, Zap, Volume2, VolumeX } from 'lucide-react';

export default function CosmicSorcererHero({ onOpenRegister }) {
  const [isHovered, setIsHovered] = useState(false);
  const [castCount, setCastCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Synthesize ethereal cosmic spell sound via Web Audio API
  const playArcaneSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Dual harmonic oscillators for magical chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency
      osc1.frequency.exponentialRampToValueAtTime(1056, ctx.currentTime + 0.4);

      osc2.frequency.setValueAtTime(792, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1584, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.7);
      osc2.stop(ctx.currentTime + 0.7);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate subtle 3D tilt angles
    const tiltX = ((y - centerY) / centerY) * -10;
    const tiltY = ((x - centerX) / centerX) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const triggerSpellCast = () => {
    setCastCount(prev => prev + 1);
    playArcaneSound();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      
      {/* Ambient Cosmic & Arcane Rim Glow */}
      <div 
        className="absolute -inset-4 rounded-3xl opacity-75 blur-2xl transition-all duration-700 pointer-events-none -z-10"
        style={{
          background: isHovered 
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(16, 185, 129, 0.35) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(168, 85, 247, 0.20) 45%, transparent 70%)'
        }}
      />

      {/* 3D Tilt Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={triggerSpellCast}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1, 1, 1)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="relative rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-[0_15px_40px_rgba(0,0,0,0.85)] cursor-pointer group bg-slate-950"
      >
        {/* Aspect Ratio Box (Square 1:1) */}
        <div className="relative w-full pb-[100%] overflow-hidden">
          
          {/* Base Sorcerer Image */}
          <img
            src="/images/characters/cosmic_sorcerer.jpg"
            alt="Mystic Cosmic Sorcerer"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/characters/cosmic_sorcerer.jpg';
            }}
          />

          {/* ═══════════════════════════════════════════════════════════
              ROTATING MANDALA 1: RIGHT HAND (Viewer Left)
              Position: center at ~25% X, ~30% Y
              ═══════════════════════════════════════════════════════════ */}
          <div 
            className="absolute pointer-events-none"
            style={{
              left: '9%',
              top: '13%',
              width: '33%',
              height: '33%',
            }}
          >
            {/* Outer Golden 8-Pointed Star Mandala (Spins Clockwise) */}
            <div className={`absolute inset-0 ${isHovered ? 'animate-spin-fast' : 'animate-spin-clockwise'} animate-arcane-pulse`}>
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(251,191,36,0.95)]">
                <defs>
                  <linearGradient id="goldArcaneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>

                {/* Outer Concentric Rune Circles */}
                <circle cx="100" cy="100" r="92" fill="none" stroke="url(#goldArcaneGrad)" strokeWidth="1.8" strokeDasharray="4 2 8 2" />
                <circle cx="100" cy="100" r="84" fill="none" stroke="url(#goldArcaneGrad)" strokeWidth="1.2" />
                <circle cx="100" cy="100" r="76" fill="none" stroke="url(#goldArcaneGrad)" strokeWidth="1.5" strokeDasharray="6 4" />

                {/* 8-Pointed Sacred Geometry Star */}
                <polygon points="100,12 118,65 174,65 128,98 146,152 100,119 54,152 72,98 26,65 82,65" fill="none" stroke="url(#goldArcaneGrad)" strokeWidth="2" />
                <polygon points="100,24 114,68 160,68 122,96 137,140 100,113 63,140 78,96 40,68 86,68" fill="rgba(245,158,11,0.08)" stroke="url(#goldArcaneGrad)" strokeWidth="1.2" />

                {/* Cardinal Runic Points */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <circle
                    key={i}
                    cx={100 + 84 * Math.cos((deg * Math.PI) / 180)}
                    cy={100 + 84 * Math.sin((deg * Math.PI) / 180)}
                    r="3.5"
                    fill="#fef08a"
                    stroke="#d97706"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>

            {/* Inner Runic Inscription Ring (Spins Counter-Clockwise) */}
            <div className={`absolute inset-[15%] ${isHovered ? 'animate-spin-fast-counter' : 'animate-spin-counter'}`}>
              <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
                <circle cx="70" cy="70" r="58" fill="none" stroke="#fde047" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="70,18 115,95 25,95" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <polygon points="70,122 115,45 25,45" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="70" cy="70" r="28" fill="rgba(251,191,36,0.2)" stroke="#fef08a" strokeWidth="2" />
              </svg>
            </div>

            {/* Glowing Core Heartbeat Spark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-amber-200 blur-[2px] animate-ping opacity-80" />
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#fff]" />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              ROTATING MANDALA 2: LEFT HAND (Viewer Right)
              Position: center at ~79% X, ~34% Y
              ═══════════════════════════════════════════════════════════ */}
          <div 
            className="absolute pointer-events-none"
            style={{
              right: '9%',
              top: '21%',
              width: '26%',
              height: '26%',
            }}
          >
            {/* Concentric Mystic Spell Disc (Spins Counter-Clockwise) */}
            <div className={`absolute inset-0 ${isHovered ? 'animate-spin-fast-counter' : 'animate-spin-counter'} animate-arcane-pulse`}>
              <svg viewBox="0 0 160 160" className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]">
                <defs>
                  <linearGradient id="leftRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>

                <circle cx="80" cy="80" r="74" fill="none" stroke="url(#leftRingGrad)" strokeWidth="2" strokeDasharray="8 4 2 4" />
                <circle cx="80" cy="80" r="62" fill="none" stroke="url(#leftRingGrad)" strokeWidth="1.2" />
                <circle cx="80" cy="80" r="48" fill="rgba(251,146,60,0.12)" stroke="url(#leftRingGrad)" strokeWidth="1.8" strokeDasharray="5 3" />

                {/* Interlocking Triangles / Tao Seal */}
                <polygon points="80,24 122,98 38,98" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                <polygon points="80,136 122,62 38,62" fill="none" stroke="#fef08a" strokeWidth="1.5" />

                {/* Glyphic Orbs */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <circle
                    key={i}
                    cx={80 + 62 * Math.cos((deg * Math.PI) / 180)}
                    cy={80 + 62 * Math.sin((deg * Math.PI) / 180)}
                    r="3"
                    fill="#fef08a"
                  />
                ))}
              </svg>
            </div>

            {/* Inner Fast Ring (Spins Clockwise) */}
            <div className={`absolute inset-[18%] ${isHovered ? 'animate-spin-fast' : 'animate-spin-clockwise'}`}>
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#fde047" strokeWidth="1.5" strokeDasharray="3 5" />
                <circle cx="50" cy="50" r="24" fill="rgba(251,191,36,0.3)" stroke="#fff" strokeWidth="1.2" />
              </svg>
            </div>

            {/* Glowing Core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-300 blur-[2px] animate-ping opacity-75" />
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />
            </div>
          </div>

          {/* Spellcast Shockwave Ripple (triggers on card click) */}
          {castCount > 0 && (
            <div
              key={castCount}
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
              <div className="w-32 h-32 rounded-full border-4 border-amber-300/80 animate-ping" />
              <div className="w-64 h-64 rounded-full border-2 border-emerald-400/60 animate-ping [animation-duration:1s]" />
            </div>
          )}

          {/* Top Status & Audio Control Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-amber-400/40 rounded-full text-[11px] font-mono text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
              <span className="font-semibold tracking-wider">REALITY WEAVER</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-1.5 bg-slate-950/80 backdrop-blur-md border border-white/20 rounded-full text-slate-300 hover:text-amber-300 transition-colors shadow-lg"
              title={soundEnabled ? 'Mute spellcast chime' : 'Enable spellcast chime'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Bottom Interactive HUD Bar */}
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-950/85 backdrop-blur-md border border-amber-400/30 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <div>
                <p className="text-white font-bold tracking-wide flex items-center gap-1.5">
                  <span>INCURSION VANGUARD</span>
                  <Shield className="w-3 h-3 text-emerald-400" />
                </p>
                <p className="text-[10px] text-amber-300/90 font-mono">
                  {isHovered ? '⚡ ARCANE SHIELDS ACCELERATING' : 'CLICK / HOVER TO CHANNEL'}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-400/40 text-amber-300 rounded font-mono text-[10px] font-bold">
                SPELL #{castCount || 1}
              </span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Interactive Helper Subtitle */}
      <p className="text-center text-[11px] text-slate-400 font-mono mt-3 flex items-center justify-center gap-1.5">
        <Zap className="w-3 h-3 text-amber-400" />
        <span>Interactive 3D Avatar • Hover to accelerate mandalas • Click to cast</span>
      </p>

    </div>
  );
}
