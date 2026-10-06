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
          <div className="inline-flex flex-col items-center justify-center px-6 sm:px-10 py-3.5 rounded-2xl bg-slate-950/85 border border-emerald-500/30 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.9)] max-w-3xl mx-auto space-y-1.5 select-none">
            {/* College Name: Ultra-crisp Pure White with high-contrast shadow */}
            <div className="font-space text-xs sm:text-sm md:text-base tracking-[0.22em] sm:tracking-[0.3em] text-white uppercase font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              SMT. CHANDIBAI HIMATHMAL MANSUKHANI COLLEGE (CHM)
            </div>

            {/* Department: High-Voltage Electric Cyan for 100% visibility against green backdrop */}
            <div className="font-space text-xs sm:text-sm md:text-[15px] tracking-[0.2em] sm:tracking-[0.25em] text-cyan-300 uppercase font-bold drop-shadow-[0_0_12px_rgba(6,182,212,0.7)]">
              DEPARTMENT OF DATA SCIENCE
            </div>

            {/* Presents Divider: Radiant Amber Gold */}
            <div className="flex items-center justify-center gap-3 pt-0.5 w-full">
              <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-amber-400/20" />
              <span className="font-chakra text-[10px] sm:text-xs tracking-[0.45em] text-amber-300 uppercase font-black drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">
                PRESENTS
              </span>
              <span className="w-10 sm:w-16 h-[1.5px] bg-gradient-to-l from-transparent via-amber-400 to-amber-400/20" />
            </div>
          </div>

          {/* Top Line: TECH ASTRA 2026 */}
          <div className="font-space font-bold text-xs sm:text-sm tracking-[0.35em] sm:tracking-[0.45em] text-slate-100 uppercase flex items-center justify-center gap-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,1)] pt-1">
            <span className="text-white">TECH ASTRA</span>
            <span className="text-emerald-400 font-extrabold drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]">2026</span>
          </div>

          {/* Monumental DOOMSDAY Title (Authentic Avengers Avengeance Font) */}
          <div className="relative flex flex-col items-center justify-center py-2 sm:py-3 select-none w-full max-w-5xl mx-auto">
            <h1 className="font-avengers text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[11rem] tracking-[0.05em] sm:tracking-[0.08em] md:tracking-[0.12em] leading-[0.9] uppercase text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 via-45% to-slate-400 drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(34,197,94,0.45)] transition-transform duration-300 hover:scale-[1.01]">
              DOOMSDAY
            </h1>

            {/* Glowing Emerald Laser Baseline */}
            <div className="relative w-full max-w-xl sm:max-w-2xl md:max-w-3xl flex items-center justify-center mt-2 sm:mt-3">
              <div className="absolute inset-x-0 h-[8px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent blur-[4px]" />
              <div className="w-full h-[2px] sm:h-[2.5px] bg-gradient-to-r from-transparent via-emerald-300 via-50% to-transparent shadow-[0_0_15px_rgba(52,211,153,1)]" />
              <div className="absolute w-2 h-2 rotate-45 bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,1)]" />
            </div>
          </div>

          {/* Subtitle: 48-HOUR HACKATHON (Wide Geometric Sans-Serif / Eurostile / Syncopate) */}
          <div className="font-syncopate text-sm sm:text-lg md:text-xl font-bold text-white tracking-[0.35em] sm:tracking-[0.45em] uppercase pt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            48-HOUR HACKATHON
          </div>

          {/* Tagline: Wide Geometric Sans-Serif */}
          <div className="font-syncopate text-xs sm:text-sm text-slate-200 tracking-[0.25em] sm:tracking-[0.35em] uppercase space-y-1.5 pt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            <p className="font-bold text-white tracking-[0.3em]">BEFORE THE BREAKING POINT</p>
            <p className="text-cyan-300 font-bold text-[10px] sm:text-xs tracking-[0.28em] drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">REAL PROBLEMS. BOLD SOLUTIONS.</p>
          </div>

          {/* Organised by Data Decoders */}
          <div className="pt-2 sm:pt-3 flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-slate-950/90 border border-cyan-500/50 backdrop-blur-md shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <span className="text-[10px] sm:text-xs font-space tracking-[0.25em] text-slate-200 uppercase font-medium">
                ORGANISED BY
              </span>
              <span className="text-xs sm:text-sm font-chakra font-black tracking-[0.22em] text-cyan-300 uppercase drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]">
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
