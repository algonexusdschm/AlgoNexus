import React, { useState } from 'react';
import { Shield, Sparkles, Cpu, Eye, Zap, Crosshair, ChevronRight, CheckCircle2 } from 'lucide-react';

const CHARACTERS = [
  {
    id: 'sorcerer',
    name: 'The Mystic Sorcerer',
    alias: 'Reality Weaver & Incursion Vanguard',
    faction: 'Sanctum of the Cosmos',
    image: '/images/characters/cosmic_sorcerer.jpg',
    fallback: 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/characters/cosmic_sorcerer.jpg',
    color: 'amber',
    borderColor: 'border-amber-400/50',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-400/40',
    description: 'Master of high cosmic sorcery. Channels dual sacred geometry mandalas to seal multiversal fractures, manipulate probability grids, and bend dimensional coordinates.',
    stats: {
      arcanePower: 98,
      realityControl: 96,
      algorithmicLogic: 88,
    },
    specialAbility: 'Chronal Rift Inversion',
    icon: Sparkles
  },
  {
    id: 'doom',
    name: 'Doctor Doom',
    alias: 'Supreme Sovereign of Latveria',
    faction: 'Latverian Royal Citadel',
    image: '/images/characters/doctor_doom.jpg',
    fallback: 'https://vcswkusqdkyhyanytjlc.supabase.co/storage/v1/object/public/organizer-assets/wallpapers/doomsday_multiverse_rift.jpg',
    color: 'emerald',
    borderColor: 'border-emerald-400/50',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
    description: 'Supreme monarch uniting quantum nanotechnology with primordial eldritch sorcery. Commands the Latverian Citadel, sovereign legions, and reality-altering cosmic incursion engines.',
    stats: {
      arcanePower: 99,
      realityControl: 97,
      algorithmicLogic: 100,
    },
    specialAbility: 'Titanium Incursion Reign',
    icon: Shield
  },
  {
    id: 'doombot',
    name: 'Doombot Sentinel',
    alias: 'Cybernetic Combat Enforcer Mk-IV',
    faction: 'Latverian Autonomous Legion',
    image: '/images/characters/doombot_sentinel.jpg',
    fallback: '/images/characters/doombot_sentinel.jpg',
    color: 'cyan',
    borderColor: 'border-cyan-400/50',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-400/40',
    description: 'Autonomous titanium sentinels hardcoded with Doom’s supreme strategic intelligence. Features micro-quantum computation matrices and rapid predictive anomaly interception.',
    stats: {
      arcanePower: 82,
      realityControl: 85,
      algorithmicLogic: 99,
    },
    specialAbility: 'Algorithmic Counter-Pulse',
    icon: Cpu
  }
];

export default function DoomsdayCharacters({ onSelectFaction }) {
  const [activeChar, setActiveChar] = useState(CHARACTERS[0]);
  const [inspectedChar, setInspectedChar] = useState(null);

  return (
    <section id="characters" className="relative py-20 md:py-28 overflow-hidden bg-slate-950/60 border-t border-b border-white/10">
      
      {/* Background Radial Glow Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-mono tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>MULTIVERSE INVASION ROSTER</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            CHAMPIONS OF THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">
              DOOMSDAY NEXUS
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            As the multiversal rift expands across the Latverian horizon, sovereign rulers, cosmic sorcerers, and cybernetic sentinels converge to claim algorithmic supremacy.
          </p>
        </div>

        {/* 3D Character Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {CHARACTERS.map((char) => {
            const Icon = char.icon;
            const isSelected = activeChar.id === char.id;

            return (
              <div
                key={char.id}
                onClick={() => setActiveChar(char)}
                style={{
                  boxShadow: isSelected ? `0 0 35px ${char.glowColor}` : undefined
                }}
                className={`relative group rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer doomsday-glass-card border-2 ${
                  isSelected ? `${char.borderColor} -translate-y-2` : 'border-white/10 hover:border-white/30 hover:-translate-y-1'
                }`}
              >
                {/* Image Showcase Container */}
                <div className="relative w-full pb-[105%] overflow-hidden bg-slate-900">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = char.fallback;
                    }}
                  />

                  {/* Top Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Rotating Arcane Halo Behind Badge on Hover */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
                    <Icon className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-500" />
                  </div>

                  {/* Faction Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border backdrop-blur-md ${char.badgeBg}`}>
                      {char.faction}
                    </span>
                  </div>

                  {/* Floating Ability Highlight */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-md">
                        {char.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-mono">
                        {char.alias}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedChar(char);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all shadow-md"
                      title="Inspect Dossier"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content & Stats */}
                <div className="p-5 space-y-4 bg-slate-950/90">
                  <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                    {char.description}
                  </p>

                  {/* Attribute Progress Bars */}
                  <div className="space-y-2 pt-1 border-t border-white/10 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>Arcane Energy</span>
                        <span className="font-bold text-amber-400">{char.stats.arcanePower}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
                          style={{ width: `${char.stats.arcanePower}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>Reality Warp</span>
                        <span className="font-bold text-emerald-400">{char.stats.realityControl}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000"
                          style={{ width: `${char.stats.realityControl}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                        <span>Algorithmic Logic</span>
                        <span className="font-bold text-cyan-400">{char.stats.algorithmicLogic}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-1000"
                          style={{ width: `${char.stats.algorithmicLogic}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>{char.specialAbility}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Dossier Modal Inspection */}
      {inspectedChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-white/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)]">
            <div className="relative h-64 overflow-hidden bg-slate-900">
              <img
                src={inspectedChar.image}
                alt={inspectedChar.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.currentTarget.src = inspectedChar.fallback;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              <button
                onClick={() => setInspectedChar(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-6">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${inspectedChar.badgeBg}`}>
                  {inspectedChar.faction}
                </span>
                <h3 className="text-3xl font-black text-white mt-1">
                  {inspectedChar.name}
                </h3>
                <p className="text-xs text-amber-300 font-mono">
                  {inspectedChar.alias}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {inspectedChar.description}
              </p>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/80 border border-white/10 text-center">
                <div>
                  <p className="text-xs text-slate-400 font-mono">Arcane Rating</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">{inspectedChar.stats.arcanePower}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">Reality Grid</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{inspectedChar.stats.realityControl}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">Logic Core</p>
                  <p className="text-2xl font-black text-cyan-400 mt-1">{inspectedChar.stats.algorithmicLogic}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setInspectedChar(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
