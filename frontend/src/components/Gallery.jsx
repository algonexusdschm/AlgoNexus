import React, { useState, useEffect } from 'react';
import { Camera, ZoomIn, X, ChevronLeft, ChevronRight, Download, Share2, Tag, Calendar, Box } from 'lucide-react';
import { PAST_YEAR_GALLERY } from '../data/eventData';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  const categories = ['All', 'Hackathons', 'Stage & Keynotes', 'Competitions', 'Prize Ceremony', 'Campus Vibes'];

  const filteredPhotos = selectedCategory === 'All'
    ? PAST_YEAR_GALLERY
    : PAST_YEAR_GALLERY.filter(item => item.category === selectedCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <section id="gallery" className="py-24 relative bg-[#0b0e14]/75 backdrop-blur-sm border-b-4 border-mc-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-mc-deepslate border border-mc-diamond/40 text-mc-diamond text-xs font-mc mb-3">
              <Camera className="w-3.5 h-3.5 text-mc-diamond" />
              <span>[LAST EVENT MEMORIES]</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl flex flex-col items-start mb-6">
              <span className="avengers-chrome block pb-1">PHOTO GALLERY OF</span>
              <span className="doomsday-neon block text-xl sm:text-2xl md:text-3xl mt-1">LAST EVENT MEMORIES</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl font-light">
              Relive the high-voltage coding battles, late-night hackathon sprints, and victory celebrations from our last event memories.
            </p>
          </div>

          {/* Filter Chips with Doomsday Cyber Button Styling */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-chakra font-bold uppercase tracking-wider rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-400'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid with Doomsday Cyber Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="group relative rounded-xl overflow-hidden cursor-pointer bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all"
            >
              {/* Image Container with Aspect Ratio */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/40 to-transparent opacity-80 group-hover:opacity-50 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-chakra font-bold px-2.5 py-0.5 rounded bg-black/80 text-emerald-400 border border-emerald-500/40 shadow-sm">
                    {photo.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-slate-300 border border-slate-700">
                    {photo.year}
                  </span>
                </div>

                {/* Zoom Icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/60 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)] transform group-hover:scale-110 transition-transform">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Text Meta Content */}
              <div className="p-4 bg-slate-900/90 border-t border-slate-800">
                <h3 className="text-sm font-chakra font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-light">
                  {photo.caption}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-mc-border">
                  {photo.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-slate-400 bg-mc-deepslate px-2 py-0.5 border border-mc-border font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            
            {/* Close Button */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
              }}
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-slate-900/90 border border-slate-700 hover:border-emerald-400 text-white z-10 transition-all shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
              }}
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-slate-900/90 border border-slate-700 hover:border-emerald-400 text-white z-10 transition-all shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content Container */}
            <div className="max-w-4xl w-full bg-slate-950 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="relative aspect-[16/10] w-full bg-black max-h-[65vh]">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-chakra font-bold border border-emerald-500/40">
                      {activePhoto.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Edition {activePhoto.year}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {activePhotoIndex + 1} of {filteredPhotos.length}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5">{activePhoto.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{activePhoto.caption}</p>

                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-mc-border">
                  {activePhoto.tags.map((tag) => (
                    <span key={tag} className="text-xs text-mc-diamond bg-mc-deepslate px-2.5 py-1 border border-mc-border font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
