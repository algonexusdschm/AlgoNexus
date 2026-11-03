import React, { useState, useEffect } from 'react';
import { Camera, ZoomIn, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { PAST_YEAR_GALLERY } from '../data/eventData';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  const categories = ['All', 'Organizers & Council', 'Core Leads', 'Faculty & Mentors', 'Celebrations & Faculty', 'Stage & Ceremonies', 'Celebrations'];

  const filteredPhotos = selectedCategory === 'All'
    ? PAST_YEAR_GALLERY
    : PAST_YEAR_GALLERY.filter(item => item.category === selectedCategory);

  // Lock body scroll and handle keyboard navigation when modal is open
  useEffect(() => {
    if (activePhotoIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [activePhotoIndex, filteredPhotos.length]);

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <section id="gallery" className="py-24 relative bg-transparent border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold shadow-sm">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>EVENT MEMORIES & HIGHLIGHTS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-chakra font-black tracking-tight text-slate-900 uppercase">
              GALLERY OF PAST EDITIONS
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl font-mono">
              Relive the high-voltage coding battles, late-night hackathon sprints, faculty mentorship, and victory celebrations.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer bg-white/90 border border-slate-200 shadow-md hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur-md">
                    {photo.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    {photo.year}
                  </span>
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-blue-600 transform group-hover:scale-110 transition-transform">
                    <ZoomIn className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Text Meta Content */}
              <div className="p-5 bg-white">
                <h3 className="text-sm font-chakra font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-mono">
                  {photo.caption}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {photo.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Instant Modal Lightbox (No Scrolling Needed on Mobile!) */}
        {activePhoto && (
          <div 
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xl p-3 sm:p-6 overflow-hidden"
          >
            {/* Top Close Button (Prominent for Mobile) */}
            <button
              onClick={() => setActivePhotoIndex(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 transition-all z-60 shadow-lg cursor-pointer"
              title="Close Image"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 z-50 transition-all shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActivePhotoIndex((prev) => (prev + 1) % filteredPhotos.length);
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 z-50 transition-all shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Dialog Content (Centered in viewport, max size constrained) */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto"
            >
              {/* Image Frame */}
              <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] sm:max-h-[65vh] overflow-hidden">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                />
              </div>

              {/* Text Description inside Modal */}
              <div className="p-4 sm:p-6 bg-white border-t border-slate-100 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {activePhoto.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Edition {activePhoto.year}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {activePhotoIndex + 1} of {filteredPhotos.length}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-chakra font-bold text-slate-900">
                  {activePhoto.title}
                </h3>
                <p className="text-xs text-slate-600 font-mono leading-relaxed">
                  {activePhoto.caption}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
