import React from 'react';
import { Bell, BrainCircuit, Globe, Code2, ShieldAlert, Cpu, ArrowRight, Calendar, CheckCircle2, Box } from 'lucide-react';
import { EVENT_TRACKS } from '../data/eventData';
import { useEvent } from '../context/EventContext';

export default function Announcement({ onOpenRegister }) {
  const { eventSettings } = useEvent();
  
  const iconMap = {
    BrainCircuit: <BrainCircuit className="w-6 h-6 text-mc-diamond" />,
    Globe: <Globe className="w-6 h-6 text-mc-lapis" />,
    Code2: <Code2 className="w-6 h-6 text-mc-emerald" />,
    ShieldAlert: <ShieldAlert className="w-6 h-6 text-mc-redstone" />,
    Cpu: <Cpu className="w-6 h-6 text-mc-gold" />
  };

  return (
    <section id="announcement" className="py-20 relative border-b-4 border-mc-border bg-[#0d121c]/75 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-mc-deepslate border border-mc-redstone/40 text-mc-redstone text-xs font-mc mb-3">
            <span className="w-2 h-2 bg-mc-redstone animate-pulse-redstone" />
            <span>[OFFICIAL QUEST ANNOUNCEMENT]</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            ANNOUNCING <span className="text-mc-diamond font-mc">{eventSettings.name}</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Prepare your squads for the national voxel conclave. Three days of non-stop algorithmic sprint, architecture showdowns, and high-stakes coding duels.
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
                36-Hour Hackathon with {eventSettings.prizePool} Cash Bounties & VC Mentorship
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
                  <span>Official AlgoNexus Swag Box & Cloud Credits</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-3.5 h-3.5 bg-mc-redstone/20 border border-mc-redstone flex items-center justify-center text-mc-redstone text-[9px] font-bold">✓</span>
                  <span>Direct Hiring Fast-Track with Sponsor Startups</span>
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
                <span className="text-[10px] font-mono text-slate-500">3 PHASES</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-mc-deepslate border border-mc-border">
                  <div className="flex items-center justify-between text-[11px] font-mc text-mc-diamond mb-1">
                    <span>PHASE 1 • OCT 16</span>
                    <span className="font-mono text-[10px]">09:00 AM</span>
                  </div>
                  <p className="font-bold text-white">Opening Ceremony & Inception Sprint</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Problem statements revealed, team setups, initial sprint check-ins.</p>
                </div>

                <div className="p-3 bg-mc-deepslate border border-mc-border">
                  <div className="flex items-center justify-between text-[11px] font-mc text-mc-redstone mb-1">
                    <span>PHASE 2 • OCT 17</span>
                    <span className="font-mono text-[10px]">24-HR PROGRESS</span>
                  </div>
                  <p className="font-bold text-white">Redstone Mentorship & Algorithmic Duels</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">1v1 Speed Coding, Obsidian CTF battles, midnight maker labs.</p>
                </div>

                <div className="p-3 bg-mc-deepslate border border-mc-border">
                  <div className="flex items-center justify-between text-[11px] font-mc text-mc-emerald mb-1">
                    <span>PHASE 3 • OCT 18</span>
                    <span className="font-mono text-[10px]">GRAND FINALE</span>
                  </div>
                  <p className="font-bold text-white">Top 10 Demo Pitches & Bounties Distribution</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Live jury evaluation, cash prize distribution, after-party concert.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tracks Grid (Styled as 3D Voxel Quest Modules) */}
        <div id="tracks" className="pt-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              COMPETITION TRACKS & <span className="text-mc-diamond font-mc">BOUNTY POOLS</span>
            </h3>
            <p className="text-slate-400 text-xs">Choose your specialization or compete across multi-domain challenges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {EVENT_TRACKS.map((track) => (
              <div key={track.id} className="voxel-box p-5 rounded-xl flex flex-col justify-between group">
                <div>
                  <div className="p-3 bg-mc-deepslate border border-mc-border w-fit mb-4 group-hover:scale-110 transition-transform">
                    {iconMap[track.icon] || <Box className="w-6 h-6 text-mc-diamond" />}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{track.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{track.desc}</p>
                </div>
                <div className="pt-3 border-t border-mc-border flex items-center justify-between">
                  <span className="text-[11px] font-mc font-bold text-mc-emerald">{track.prize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
