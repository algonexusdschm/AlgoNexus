import React from 'react';
import { Bell, ArrowRight, Calendar, CheckCircle2, Box } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function Announcement({ onOpenRegister }) {
  const { eventSettings } = useEvent();

  return (
    <section id="announcement" className="py-20 relative border-b-4 border-mc-border bg-[#0d121c]/75 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span>[OFFICIAL MISSION BRIEFING]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6">
            <span className="text-white drop-shadow-md block mb-2 tracking-wide text-xl sm:text-2xl font-bold">PREPARE FOR</span>
            <span className="doomsday-title text-[3rem] sm:text-[4rem] md:text-[5.5rem] leading-[0.9] block">{eventSettings.name}</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg font-light leading-relaxed">
            Assemble your squadrons for the ultimate collegiate hackathon. Three days of non-stop algorithmic sprints, architectural showdowns, and high-stakes coding duels in the heart of the Latverian Citadel.
          </p>
        </div>

        {/* Feature Highlight Card (Voxel Netherite Slate) */}
        <div className="voxel-box p-8 sm:p-12 mb-16 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 bg-mc-diamond/20 border border-mc-diamond text-mc-diamond text-[10px] font-mc tracking-wider uppercase">
                  FLAGSHIP EXPEDITION
                </span>
                <span className="text-xs text-slate-400 font-mono">Theme: {eventSettings.tagline}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                48-Hour Hackathon with {eventSettings.prizePool} Cash Bounties & VC Mentorship
              </h3>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-light">
                Whether you build autonomous neural agents, architect decentralized microservices, master competitive dynamic programming, or crack obsidian cybersecurity puzzles — {eventSettings.name} is your forge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-3.5 h-3.5 bg-mc-emerald/20 border border-mc-emerald flex items-center justify-center text-mc-emerald text-[9px] font-bold">✓</span>
                  <span>Complimentary Meals & Midnight Energy Rations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-3.5 h-3.5 bg-mc-diamond/20 border border-mc-diamond flex items-center justify-center text-mc-diamond text-[9px] font-bold">✓</span>
                  <span>Encrypted Digital Pass with QR Gate Check-in</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-3.5 h-3.5 bg-mc-gold/20 border border-mc-gold flex items-center justify-center text-mc-gold text-[9px] font-bold">✓</span>
                  <span>48-Hour Dedicated Workspace & High-Speed Power Setup</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-3.5 h-3.5 bg-mc-redstone/20 border border-mc-redstone flex items-center justify-center text-mc-redstone text-[9px] font-bold">✓</span>
                  <span>Official Certificate of Excellence & Achievement</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => onOpenRegister()}
                  className="px-7 py-3.5 btn-voxel-emerald text-xs uppercase flex items-center gap-2"
                >
                  <span>[BOOK EXPEDITION PASS]</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3-Day Schedule Snapshot (Minecraft Journal Style) */}
            <div className="lg:col-span-5 bg-[#0b0e14] p-5 border-2 border-mc-border space-y-3">
              <div className="flex items-center justify-between border-b border-mc-border pb-2">
                <h4 className="text-xs font-mc text-mc-diamond flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-mc-gold" />
                  <span>EXPEDITION TIMELINE</span>
                </h4>
                <span className="text-[10px] font-mono text-mc-emerald px-1.5 py-0.5 bg-mc-emerald/10 border border-mc-emerald/30">
                  {eventSettings.datesAnnounced ? '3 PHASES' : 'TO BE ANNOUNCED SOON'}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-mc-deepslate border border-mc-border">
                  <div className="flex items-center justify-between text-[11px] font-mc text-mc-diamond mb-1">
                    <span>{eventSettings.datesAnnounced ? 'PHASE 1 • DAY 1' : 'PHASE 1 • TO BE ANNOUNCED SOON'}</span>
                    <span className="font-mono text-[10px]">{eventSettings.datesAnnounced ? '09:00 AM' : 'KICKOFF'}</span>
                  </div>
                  <p className="font-bold text-white">Opening Ceremony & Inception Sprint</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Problem statements revealed, team setups, initial sprint check-ins.</p>
                </div>

                <div className="p-3 bg-mc-deepslate border border-mc-border">
                  <div className="flex items-center justify-between text-[11px] font-mc text-mc-redstone mb-1">
                    <span>{eventSettings.datesAnnounced ? 'PHASE 2 • DAY 2' : 'PHASE 2 • TO BE ANNOUNCED SOON'}</span>
                    <span className="font-mono text-[10px]">{eventSettings.datesAnnounced ? '24-HR PROGRESS' : '48-HR SPRINT'}</span>
                  </div>
                  <p className="font-bold text-white">Redstone Mentorship & Algorithmic Duels</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">1v1 Speed Coding, Obsidian CTF battles, midnight maker labs.</p>
                </div>

                <div className="p-3 bg-mc-deepslate border border-mc-border">
                  <div className="flex items-center justify-between text-[11px] font-mc text-mc-emerald mb-1">
                    <span>{eventSettings.datesAnnounced ? 'PHASE 3 • DAY 3' : 'PHASE 3 • TO BE ANNOUNCED SOON'}</span>
                    <span className="font-mono text-[10px]">GRAND FINALE</span>
                  </div>
                  <p className="font-bold text-white">Top 10 Demo Pitches & Bounties Distribution</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Live jury evaluation, cash prize distribution, after-party celebrations.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
