import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const SECTORS = [
  { id: 'hero', name: '01 // TECHASTRA WORLD', short: '01' },
  { id: 'tracks', name: '02 // 5 TECH PILLARS', short: '02' },
  { id: 'announcement', name: '03 // 48-HR ROADMAP', short: '03' },
  { id: 'gallery', name: '04 // MEMORIES VAULT', short: '04' },
  { id: 'passes', name: '05 // DELEGATE PASSES', short: '05' },
  { id: 'faq', name: '06 // INTEL & FAQS', short: '06' }
];

export default function ScrollRadar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSector, setActiveSector] = useState(SECTORS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const currentY = window.scrollY || window.pageYOffset;
        const progress = Math.min(Math.max(currentY / docHeight, 0), 1);
        setScrollProgress(Math.round(progress * 100));

        const scrollPosition = currentY + 300;
        for (let i = SECTORS.length - 1; i >= 0; i--) {
          const el = document.getElementById(SECTORS[i].id);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSector(SECTORS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSector = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSectorObj = SECTORS.find((s) => s.id === activeSector) || SECTORS[0];

  return (
    // Hidden on mobile/tablets (<1280px) to give mobile users 100% full-width touch real estate
    <aside aria-label="3D Orbital Sector Navigation" className="fixed right-2 sm:right-3 2xl:right-6 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-end gap-2.5 select-none pointer-events-auto">
      {/* Active Sector Compact Tag (Prevents collision on laptops) */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-slate-200/90 shadow-md text-slate-800 font-mono text-[10px] font-bold tracking-wider transition-all">
        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-sky-500 animate-pulse shrink-0" />
        <span className="hidden 2xl:inline text-slate-900 font-black">{currentSectorObj.name}</span>
        <span className="2xl:hidden text-slate-900 font-black">{currentSectorObj.short}</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-amber-600 font-black pl-0.5">{scrollProgress}%</span>
      </div>

      {/* Slim Vertical Waypoint Track */}
      <div className="relative py-2.5 px-1.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-md flex flex-col items-center gap-2.5">
        {/* Progress Fill Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2.5 bottom-2.5 w-[2px] bg-slate-200 -z-0">
          <div 
            className="w-full bg-gradient-to-b from-sky-500 via-amber-400 to-indigo-600 transition-all duration-150 rounded-full"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        {/* Waypoint Dots */}
        {SECTORS.map((sector) => {
          const isActive = sector.id === activeSector;
          return (
            <button
              key={sector.id}
              onClick={() => scrollToSector(sector.id)}
              className="group relative z-10 p-0.5 flex items-center justify-center cursor-pointer focus:outline-none"
              title={sector.name}
            >
              <span 
                className={`block rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-3 h-3 bg-gradient-to-tr from-sky-500 to-blue-600 ring-2 ring-sky-100 shadow-sm scale-110' 
                    : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400 group-hover:scale-125'
                }`}
              />

              {/* Hover Tooltip Label */}
              <span className="absolute right-6 px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border border-slate-700">
                {sector.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Back to Top */}
      {scrollProgress > 15 && (
        <button
          onClick={scrollToTop}
          className="p-1.5 rounded-xl bg-white/95 hover:bg-white border border-slate-200/90 shadow-sm hover:shadow text-slate-600 hover:text-blue-600 transition-all cursor-pointer group"
          title="Return to Top"
        >
          <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </aside>
  );
}
