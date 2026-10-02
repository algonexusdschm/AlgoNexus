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
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mc-deepslate border-2 border-mc-redstone/60 text-mc-redstone text-xs font-mc shadow-voxel-sm">
            <span className="w-2 h-2 bg-mc-redstone rounded-none animate-pulse-redstone" />
            <span>REDSTONE ENGINE: ONLINE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mc-deepslate border-2 border-mc-border text-slate-300 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-mc-diamond" />
            <span>{eventSettings.datesAnnounced ? eventSettings.dates : 'Dates To Be Announced Soon'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mc-deepslate border-2 border-mc-border text-slate-300 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-mc-gold" />
            <span>{eventSettings.venue}</span>
          </div>
        </div>

        {/* Hero Content (Centered & Clean) */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-3.5 py-1 bg-mc-diamond/10 border border-mc-diamond/40 text-mc-diamond font-mc text-xs tracking-wider">
            {eventSettings.edition} • Department of Data Science, Smt. CHM College
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.08]">
            BUILD. CODE. <br />
            <span className="text-mc-diamond drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              DOMINATE THE NEXUS.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Welcome to <strong className="font-bold text-white font-mc tracking-wide">{eventSettings.name}</strong>. India's premier collegiate tech conclave. Forge breakthrough algorithms, engineer 48-hour solutions, and claim legendary bounties in our national arena.
          </p>

          {/* Tactile Minecraft 3D Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenRegister()}
              className="w-full sm:w-auto px-8 py-4 btn-voxel-diamond text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg"
            >
              <span>[CLAIM YOUR PASS]</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <a
              href="#gallery"
              className="w-full sm:w-auto px-7 py-4 btn-voxel-dark text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>LAST EVENT MEMORIES</span>
            </a>
          </div>

          {/* Minecraft Inventory-Style Live Countdown HUD */}
          <div className="pt-4 max-w-xl mx-auto">
            {eventSettings.datesAnnounced ? (
              <div className="p-4 voxel-box rounded-xl">
                <div className="flex items-center justify-between text-xs font-mc text-mc-diamond mb-3 border-b border-mc-border pb-2">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-mc-redstone animate-spin" />
                    <span>COUNTDOWN TO INCEPTION</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">T-MINUS</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#0b0e14] p-2.5 border border-mc-border">
                    <span className="block text-2xl sm:text-3xl font-black text-white font-mc">{timeLeft.days}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">DAYS</span>
                  </div>
                  <div className="bg-[#0b0e14] p-2.5 border border-mc-border">
                    <span className="block text-2xl sm:text-3xl font-black text-mc-diamond font-mc">{timeLeft.hours}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">HOURS</span>
                  </div>
                  <div className="bg-[#0b0e14] p-2.5 border border-mc-border">
                    <span className="block text-2xl sm:text-3xl font-black text-mc-emerald font-mc">{timeLeft.minutes}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">MINS</span>
                  </div>
                  <div className="bg-[#0b0e14] p-2.5 border border-mc-border">
                    <span className="block text-2xl sm:text-3xl font-black text-mc-redstone font-mc">{timeLeft.seconds}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">SECS</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 voxel-box rounded-xl bg-gradient-to-r from-[#0b0e14] via-[#0e1628] to-[#0b0e14] border-2 border-mc-diamond/50">
                <div className="flex items-center justify-between text-xs font-mc text-mc-diamond mb-2.5 border-b border-mc-border pb-2">
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-mc-gold animate-pulse" />
                    <span>COUNTDOWN STATUS</span>
                  </span>
                  <span className="text-[10px] text-mc-emerald font-mono px-2 py-0.5 bg-mc-emerald/10 border border-mc-emerald/30 uppercase font-semibold">
                    REVEALING SOON
                  </span>
                </div>

                <div className="py-2.5 text-center">
                  <div className="text-xl sm:text-2xl font-black text-mc-diamond font-mc tracking-wider">
                    [DATES TO BE ANNOUNCED SOON]
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-light">
                    Official dates unlocking soon! Pass bookings and pre-registrations are live.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Voxel Metric HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          <div className="voxel-box p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mc-emerald/10 border border-mc-emerald/40 text-mc-emerald">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mc">{eventSettings.prizePool}</div>
                <div className="text-[11px] text-slate-400">Total Bounty Pool</div>
              </div>
            </div>
          </div>

          <div className="voxel-box p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mc-redstone/10 border border-mc-redstone/40 text-mc-redstone">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mc">48 HOURS</div>
                <div className="text-[11px] text-slate-400">Non-Stop Sprint</div>
              </div>
            </div>
          </div>

          <div className="voxel-box p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mc-diamond/10 border border-mc-diamond/40 text-mc-diamond">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mc">2,000+</div>
                <div className="text-[11px] text-slate-400">Voxel Innovators</div>
              </div>
            </div>
          </div>

          <div className="voxel-box p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mc-gold/10 border border-mc-gold/40 text-mc-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mc">BEDROCK</div>
                <div className="text-[11px] text-slate-400">Encrypted Check-in</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
