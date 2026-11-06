import React, { useState, useEffect } from 'react';
import { Compass, ChevronUp } from 'lucide-react';

const SECTORS = [
  { id: 'hero', name: '01 // TECHASTRA WORLD', short: 'WORLD' },
  { id: 'tracks', name: '02 // 5 TECH PILLARS (CV·AI·ML·RAG·NLP)', short: 'TRACKS' },
  { id: 'announcement', name: '03 // 48-HR ROADMAP', short: 'ROADMAP' },
  { id: 'gallery', name: '04 // MEMORIES VAULT', short: 'GALLERY' },
  { id: 'passes', name: '05 // DELEGATE PASSES', short: 'PASSES' },
  { id: 'faq', name: '06 // INTEL & FAQS', short: 'FAQS' }
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

        // Determine current active section
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
    <aside aria-label="3D Orbital Sector Navigation" className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3 select-none pointer-events-auto">
      {/* Active Sector Holographic Tag */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-md text-slate-800 font-mono text-[10px] font-bold tracking-wider transition-all">
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
        <span className="text-slate-900">{currentSectorObj.name}</span>
        <span className="text-sky-600 font-black pl-1">{scrollProgress}%</span>
      </div>

      {/* Vertical Waypoint Track */}
      <div className="relative py-3 px-2 rounded-2xl bg-white/90 border border-slate-200/90 shadow-md flex flex-col items-center gap-3">
        {/* Progress Fill Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-[2px] bg-slate-200 -z-0">
          <div 
            className="w-full bg-gradient-to-b from-sky-500 via-blue-600 to-indigo-600 transition-all duration-150"
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
              className="group relative z-10 p-1 flex items-center justify-center cursor-pointer focus:outline-none"
              title={sector.name}
            >
              <span 
                className={`block rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-3.5 h-3.5 bg-blue-600 ring-4 ring-blue-100 shadow-md scale-110' 
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400 group-hover:scale-125'
                }`}
              />

              {/* Hover Tooltip Label */}
              <span className="absolute right-7 px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                {sector.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Back to Zenith Button */}
      {scrollProgress > 15 && (
        <button
          onClick={scrollToTop}
          className="p-2 rounded-xl bg-white/95 hover:bg-white border border-slate-200/90 shadow-md hover:shadow-lg text-slate-600 hover:text-blue-600 transition-all cursor-pointer group"
          title="Return to Apex Zenith (Hero)"
        >
          <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </aside>
  );
}
