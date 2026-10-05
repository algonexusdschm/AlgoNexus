import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function Hero({ onOpenRegister }) {
  const { eventSettings } = useEvent();

  // Live Countdown to Event
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = eventSettings.targetDate || '2026-10-16T09:00:00+05:30';
      const difference = +new Date(target) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 16, hours: 8, minutes: 22, seconds: 45 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventSettings.targetDate]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden bg-transparent">
      
      {/* Subtle Ambient Backlight (Matching the Arcane Hall) */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-amber-500/5 blur-[120px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[40rem] h-[40rem] bg-emerald-500/5 blur-[120px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Main Content (Matching Image 1: DOOMSDAY Hackathon) */}
        <div className="relative text-center space-y-3 sm:space-y-4 pt-4 md:pt-8">
          {/* Subtle radial shadow to ensure maximum sharpness over the monument */}
          <div className="absolute -inset-4 sm:-inset-10 bg-radial from-slate-950/80 via-slate-950/40 to-transparent -z-10 rounded-full blur-2xl pointer-events-none" />

          {/* Institutional Presentation Header: Smt. CHM College & Dept of Data Science Presents */}
          <div className="space-y-1 sm:space-y-1.5 select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            <div className="font-space text-xs sm:text-sm md:text-base tracking-[0.25em] sm:tracking-[0.35em] text-slate-200 uppercase font-bold">
              SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE (CHM)
            </div>
            <div className="font-space text-[11px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.28em] text-emerald-400 uppercase font-semibold">
              DEPARTMENT OF DATA SCIENCE
            </div>
            <div className="flex items-center justify-center gap-3 pt-0.5">
              <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-r from-transparent to-emerald-400/70" />
              <span className="font-chakra text-[10px] sm:text-xs tracking-[0.4em] text-slate-300 uppercase font-bold">
                PRESENTS
              </span>
              <span className="w-8 sm:w-14 h-[1px] bg-gradient-to-l from-transparent to-emerald-400/70" />
            </div>
          </div>

          {/* Top Line: ALGO NEXUS 2026 */}
          <div className="font-space font-medium text-xs sm:text-sm tracking-[0.35em] sm:tracking-[0.45em] text-slate-300 uppercase flex items-center justify-center gap-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <span>ALGO NEXUS</span>
            <span className="text-emerald-400 font-bold">2026</span>
          </div>

          {/* Giant DOOMSDAY Title with Integrated Avengers 'A' & Green Laser Baseline */}
          <div className="relative inline-flex flex-col items-center justify-center py-1 sm:py-2 select-none">
            <div className="font-bebas flex items-center justify-center leading-none text-6xl sm:text-8xl md:text-[7.5rem] lg:text-[8.5rem]">
              <span className="doomsday-metal-word">DOOMSD</span>
              
              {/* Iconic Avengers 'A' Symbol */}
              <span className="relative inline-block mx-0.5 sm:mx-1 top-[-0.04em] shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-[0.92em] h-[0.92em] inline-block align-middle overflow-visible drop-shadow-[0_6px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(34,197,94,0.65)]"
                >
                  <defs>
                    <linearGradient id="avengersMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="25%" stopColor="#e2e8f0" />
                      <stop offset="45%" stopColor="#94a3b8" />
                      <stop offset="52%" stopColor="#334155" />
                      <stop offset="68%" stopColor="#64748b" />
                      <stop offset="88%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                  {/* Outer Circular Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="url(#avengersMetalGrad)"
                    strokeWidth="8.5"
                    strokeLinecap="round"
                  />
                  {/* Main 'A' Diagonal Legs */}
                  <path
                    d="M 27 83 L 50 16 L 73 83"
                    fill="none"
                    stroke="url(#avengersMetalGrad)"
                    strokeWidth="10"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                  {/* Arrow Crossbar pointing right */}
                  <path
                    d="M 28 58 L 84 58 L 70 45 M 84 58 L 70 71"
                    fill="none"
                    stroke="url(#avengersMetalGrad)"
                    strokeWidth="8.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />
                </svg>
              </span>

              <span className="doomsday-metal-word">Y</span>
            </div>

            {/* Radiant Emerald Laser Baseline with central flare (Image 1) */}
            <div className="relative w-full max-w-2xl h-[3px] mt-2 sm:mt-3 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-[#22c55e] to-transparent shadow-[0_0_12px_#22c55e]" />
              <div className="absolute w-12 sm:w-16 h-2 bg-[#4ade80] rounded-full blur-[2px] shadow-[0_0_18px_#22c55e]" />
              <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#ffffff]" />
            </div>
          </div>

          {/* Subtitle: 48-HOUR HACKATHON */}
          <div className="font-orbitron text-base sm:text-xl md:text-2xl font-black text-white tracking-[0.3em] sm:tracking-[0.4em] uppercase pt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            48-HOUR HACKATHON
          </div>

          {/* Tagline (Image 1) */}
          <div className="font-space text-xs sm:text-sm text-slate-300 tracking-[0.2em] sm:tracking-[0.25em] uppercase space-y-1 pt-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            <p className="font-semibold text-slate-200">BEFORE THE BREAKING POINT</p>
            <p className="text-slate-400 font-light text-[11px] sm:text-xs">REAL PROBLEMS. BOLD SOLUTIONS.</p>
          </div>

          {/* Organised by Data Decoders */}
          <div className="pt-2 sm:pt-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-slate-950/80 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <span className="text-[10px] sm:text-xs font-space tracking-[0.25em] text-slate-300 uppercase">
                ORGANISED BY
              </span>
              <span className="text-xs sm:text-sm font-chakra font-black tracking-[0.2em] text-emerald-400 uppercase drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]">
                DATA DECODERS
              </span>
            </div>
          </div>

          {/* Tactical Chamfered Register Button (Image 1) */}
          <div className="flex items-center justify-center pt-4 sm:pt-5">
            <button
              onClick={() => onOpenRegister()}
              className="btn-doomsday-cyber group relative px-10 sm:px-14 py-3 sm:py-3.5 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span className="font-chakra text-xs sm:text-sm font-bold tracking-[0.25em] text-emerald-400 group-hover:text-emerald-300 uppercase flex items-center gap-2.5">
                <span>REGISTER NOW</span>
                <span className="text-base group-hover:translate-x-1.5 transition-transform duration-200">→</span>
              </span>
            </button>
          </div>
        </div>

          {/* Live Countdown HUD */}
          <div className="pt-8 max-w-2xl mx-auto w-full">
            {eventSettings.datesAnnounced ? (
              <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 mb-4 tracking-widest">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>HACKATHON COMMENCES IN</span>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:gap-4 text-center">
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-white font-mono">{timeLeft.days}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">DAYS</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-amber-400 font-mono">{timeLeft.hours}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">HOURS</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-emerald-400 font-mono">{timeLeft.minutes}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">MINS</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 sm:p-4 rounded-xl border border-white/5">
                    <span className="block text-3xl sm:text-4xl font-black text-cyan-400 font-mono">{timeLeft.seconds}</span>
                    <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1 block">SECS</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 shadow-xl">
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 mb-3">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>EVENT TIMELINE STATUS</span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 tracking-wider">
                  DATES TO BE ANNOUNCED
                </div>
                <p className="text-sm text-slate-300 mt-2 font-light">
                  Official hackathon dates will be revealed soon. Registrations are currently open.
                </p>
              </div>
            )}
          </div>

        {/* Bottom Tactical Metric HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto">
          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">{eventSettings.prizePool}</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Prize Pool</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">48 HOURS</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Non-Stop Hackathon</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">OPEN FOR ALL</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">All Branches & Years</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">CERTIFIED</div>
                <div className="text-[11px] text-slate-400 font-light uppercase tracking-wider">Participation Certs</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Atmospheric bottom fade into consecutive sections */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070913] to-transparent pointer-events-none" />
    </section>
  );
}
