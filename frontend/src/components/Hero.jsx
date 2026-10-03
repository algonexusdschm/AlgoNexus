import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Trophy, Users, Clock, ShieldCheck, Flame, Box } from 'lucide-react';
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
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-transparent border-b-4 border-mc-border">
      
      {/* Subtle Redstone Ambient Glow */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-mc-redstone/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-mc-diamond/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges with Bright Red & Green Accents */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/80 border-2 border-emerald-400/80 text-emerald-300 text-xs font-mc shadow-[0_0_15px_rgba(16,185,129,0.35)]">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-none animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>LIVE REGISTRATIONS OPEN</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-950/80 border-2 border-rose-500/80 text-rose-300 text-xs font-mc shadow-[0_0_15px_rgba(244,63,94,0.35)]">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-none animate-pulse-redstone" />
            <span>REDSTONE ENGINE: ONLINE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-mc-deepslate/90 border-2 border-mc-border text-slate-200 text-xs font-medium shadow-voxel-sm">
            <Calendar className="w-3.5 h-3.5 text-mc-diamond" />
            <span>{eventSettings.datesAnnounced ? eventSettings.dates : 'Dates To Be Announced Soon'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-mc-deepslate/90 border-2 border-mc-border text-slate-200 text-xs font-medium shadow-voxel-sm">
            <MapPin className="w-3.5 h-3.5 text-mc-gold" />
            <span>{eventSettings.venue}</span>
          </div>
        </div>

        {/* Hero Content (Centered & Clean) */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border-2 border-emerald-400/50 text-emerald-300 font-mc text-xs tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {eventSettings.edition} • Department of Data Science, Smt. CHM College
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] break-words">
            BUILD. CODE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.55)] font-mc">
              DOMINATE THE NEXUS.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-light px-2 sm:px-0">
            Welcome to <strong className="font-bold text-white font-mc tracking-wide">{eventSettings.name}</strong>. India's premier collegiate tech conclave. Forge breakthrough algorithms, engineer 48-hour solutions, and claim legendary bounties in our national arena.
          </p>

          {/* Tactile Minecraft 3D Action Buttons (Bright Emerald & Redstone) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full px-2 sm:px-0">
            <button
              onClick={() => onOpenRegister()}
              className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 btn-voxel-emerald text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.65)]"
            >
              <span>[CLAIM YOUR PASS]</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <a
              href="#passes"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 btn-voxel-redstone text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,42,75,0.4)] hover:shadow-[0_0_30px_rgba(255,42,75,0.6)]"
            >
              <span>[EXPLORE PASSES & PRIZES]</span>
            </a>
          </div>

          {/* Minecraft Inventory-Style Live Countdown HUD */}
          <div className="pt-4 max-w-xl mx-auto w-full px-2 sm:px-0">
            {eventSettings.datesAnnounced ? (
              <div className="p-3 sm:p-4 voxel-box rounded-xl">
                <div className="flex items-center justify-between text-xs font-mc text-mc-diamond mb-3 border-b border-mc-border pb-2">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-mc-redstone animate-spin" />
                    <span className="text-[11px] sm:text-xs">COUNTDOWN TO INCEPTION</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">T-MINUS</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                  <div className="bg-[#0b0e14] p-1.5 sm:p-2.5 border border-mc-border">
                    <span className="block text-xl sm:text-3xl font-black text-white font-mc">{timeLeft.days}</span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-mono">DAYS</span>
                  </div>
                  <div className="bg-[#0b0e14] p-1.5 sm:p-2.5 border border-mc-border">
                    <span className="block text-xl sm:text-3xl font-black text-mc-diamond font-mc drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">{timeLeft.hours}</span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-mono">HOURS</span>
                  </div>
                  <div className="bg-[#0b0e14] p-1.5 sm:p-2.5 border border-mc-border">
                    <span className="block text-xl sm:text-3xl font-black text-emerald-400 font-mc drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">{timeLeft.minutes}</span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-mono">MINS</span>
                  </div>
                  <div className="bg-[#0b0e14] p-1.5 sm:p-2.5 border border-mc-border">
                    <span className="block text-xl sm:text-3xl font-black text-rose-400 font-mc drop-shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse">{timeLeft.seconds}</span>
                    <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-mono">SECS</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 voxel-box rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#0e1628] to-rose-950/40 border-2 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <div className="flex items-center justify-between text-xs font-mc text-emerald-300 mb-2.5 border-b border-mc-border/80 pb-2">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-mc-gold animate-pulse" />
                    <span>COUNTDOWN STATUS</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/50 uppercase font-semibold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    REVEALING SOON
                  </span>
                </div>

                <div className="py-2.5 text-center">
                  <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-rose-300 font-mc tracking-wider drop-shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                    [DATES TO BE ANNOUNCED SOON]
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-light">
                    Official dates unlocking soon! Pass bookings and pre-registrations are live.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Voxel Metric HUD with Glowing Red & Green Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          <div className="voxel-box p-4 rounded-xl border-2 border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.35)]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-300 font-mc drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">{eventSettings.prizePool}</div>
                <div className="text-[11px] text-slate-300">Total Bounty Pool</div>
              </div>
            </div>
          </div>

          <div className="voxel-box p-4 rounded-xl border-2 border-rose-500/60 bg-rose-950/30 shadow-[0_0_20px_rgba(244,63,94,0.25)] hover:border-rose-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-400 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.35)]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-rose-300 font-mc drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]">48 HOURS</div>
                <div className="text-[11px] text-slate-300">Non-Stop Sprint</div>
              </div>
            </div>
          </div>

          <div className="voxel-box p-4 rounded-xl border-2 border-cyan-500/50 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:border-cyan-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-300 font-mc drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">2,000+</div>
                <div className="text-[11px] text-slate-300">Voxel Innovators</div>
              </div>
            </div>
          </div>

          <div className="voxel-box p-4 rounded-xl border-2 border-amber-500/50 bg-amber-950/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:border-amber-400 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-amber-300 font-mc drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]">BEDROCK</div>
                <div className="text-[11px] text-slate-300">Encrypted Check-in</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
