import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  LayoutGrid,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  Pause,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface PhotoItem {
  id: string;
  category: string;
  src: string;
  width?: number;
  height?: number;
  titleHi?: string;
  titleEn?: string;
}

interface Category {
  id: string;
  hi: string;
  en: string;
}

interface SankalpGalleryProps {
  onBackToHome: () => void;
  language: 'hi' | 'en';
  onToggleLanguage: (lang: 'hi' | 'en') => void;
}

export const SankalpGallery: React.FC<SankalpGalleryProps> = ({
  onBackToHome,
  language,
  onToggleLanguage,
}) => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', hi: 'सभी छायाचित्र', en: 'All Photos' },
    { id: 'leadership', hi: 'शासन एवं नेतृत्व', en: 'Governance & leadership' },
    { id: 'development', hi: 'विकास की झलक', en: 'Development highlights' },
    { id: 'infrastructure', hi: 'आधारभूत परियोजनाएँ', en: 'Infrastructure projects' },
    { id: 'schools', hi: 'सरस्वती विद्या निकेतन', en: 'Model schools' },
    { id: 'colleges', hi: 'नव सृजित डिग्री कॉलेज', en: 'New degree colleges' },
  ]);

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'coverflow' | 'grid'>('coverflow');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Load manifest.js
  useEffect(() => {
    fetch('/gallery/manifest.js')
      .then((res) => res.text())
      .then((code) => {
        try {
          const jsonText = code.substring(code.indexOf('{'), code.lastIndexOf('}') + 1);
          const manifest = JSON.parse(jsonText);
          if (manifest.categories) {
            setCategories([
              { id: 'all', hi: 'सभी छायाचित्र', en: 'All Photos' },
              ...manifest.categories,
            ]);
          }
          if (manifest.photos && manifest.photos.length > 0) {
            setPhotos(
              manifest.photos.map((p: any) => ({
                id: p.id,
                category: p.category,
                src: `/${p.src.replace(/^\//, '')}`,
                width: p.width,
                height: p.height,
              }))
            );
          }
        } catch (e) {
          console.warn('Could not parse manifest, falling back to static images', e);
        }
      })
      .catch(() => {});
  }, []);

  // Filter photos by selected category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return photos;
    return photos.filter((p) => p.category === activeCategory);
  }, [photos, activeCategory]);

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  // Autoplay for Coverflow
  useEffect(() => {
    if (!isPlaying || viewMode !== 'coverflow' || filteredPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredPhotos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, viewMode, filteredPhotos.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  }, [filteredPhotos.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % filteredPhotos.length);
  }, [filteredPhotos.length]);

  // Keyboard navigation for Coverflow & Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) =>
            prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
          );
        }
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) =>
            prev !== null ? (prev + 1) % filteredPhotos.length : 0
          );
        }
      } else if (viewMode === 'coverflow') {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === ' ') {
          e.preventDefault();
          setIsPlaying((p) => !p);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, viewMode, handlePrev, handleNext, filteredPhotos.length]);

  const activeCategoryObj = categories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18327b] via-[#152a65] to-[#1e133d] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-900">
      
      {/* 1. Official Header Bar */}
      <header className="sticky top-0 z-40 bg-[#18327b]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Back Button & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToHome}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform active:scale-95 border border-white/15"
              title={language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएँ' : 'Back to Home'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div
              onClick={onBackToHome}
              className="cursor-pointer flex items-center gap-2 group"
            >
              <span className="text-3xl font-black text-[#f97316] group-hover:text-[#fb923c] transition-colors font-serif">
                सम्मोहन
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/10">
                {language === 'hi' ? 'फोटो गैलरी' : 'Photo Gallery'}
              </span>
            </div>
          </div>

          {/* Navigation Items (Center) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md">
            <button
              onClick={onBackToHome}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-blue-100 hover:text-white hover:bg-white/10 transition"
            >
              {language === 'hi' ? 'होम' : 'Home'}
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-blue-100 hover:text-white hover:bg-white/10 transition"
            >
              {language === 'hi' ? 'परिचय' : 'About'}
            </button>
            <button
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#f59e0b] text-slate-900 shadow"
            >
              {language === 'hi' ? 'फोटो गैलरी' : 'Photo Gallery'}
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-blue-100 hover:text-white hover:bg-white/10 transition"
            >
              {language === 'hi' ? 'संपर्क' : 'Contact'}
            </button>
          </nav>

          {/* Language Switcher & Bihar Emblem */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => onToggleLanguage('hi')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-white text-[#18327b] shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-[#18327b] shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white px-2.5 py-1 rounded-xl shadow-sm border border-gray-100">
              <img
                src="/images/bihar-government-logo.png"
                alt="बिहार सरकार"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main Gallery Arena */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex flex-col justify-center">
        
        {/* Top Control Bar: Mode Toggle & Source Link */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15">
            <button
              onClick={() => setViewMode('coverflow')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'coverflow'
                  ? 'bg-amber-400 text-slate-900 shadow-md'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
              title="3D Coverflow View"
            >
              <BookOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-400 text-slate-900 shadow-md'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          <a
            href="https://www.dashboard.bihar.gov.in/sankalpdashboard/default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-blue-200 hover:text-amber-300 font-medium transition"
          >
            <span>
              {language === 'hi' ? 'स्रोत: मुख्यमंत्री सम्मोहन डैशबोर्ड' : 'Source: CM Sammohana Dashboard'}
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Section Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-serif">
            {language === 'hi' ? activeCategoryObj?.hi : activeCategoryObj?.en}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/80 max-w-xl mx-auto">
            {language === 'hi'
              ? 'सम्मोहन — विकास की झलक, आधिकारिक फोटो गैलरी'
              : 'Sammohana — Glimpses of development, official photographic archive'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-blue-100 border border-white/10'
                }`}
              >
                {language === 'hi' ? cat.hi : cat.en}
              </button>
            );
          })}
        </div>

        {/* --- VIEW MODE 1: 3D COVERFLOW --- */}
        {viewMode === 'coverflow' && (
          <div className="relative py-6">
            {filteredPhotos.length > 0 ? (
              <div className="relative h-[340px] sm:h-[420px] md:h-[480px] w-full flex items-center justify-center coverflow-container overflow-hidden">
                {filteredPhotos.map((photo, index) => {
                  const offset = index - activeIndex;
                  const absOffset = Math.abs(offset);

                  // Show visible window of up to 4 items on each side
                  if (absOffset > 4) return null;

                  const translateX = offset * 140;
                  const rotateY = offset * -35;
                  const scale = Math.max(0.65, 1 - absOffset * 0.12);
                  const zIndex = 50 - absOffset;
                  const opacity = Math.max(0.2, 1 - absOffset * 0.25);

                  const isActive = offset === 0;

                  return (
                    <div
                      key={photo.id || index}
                      onClick={() => {
                        if (isActive) {
                          setLightboxIndex(index);
                        } else {
                          setActiveIndex(index);
                        }
                      }}
                      className="absolute coverflow-card cursor-pointer select-none rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 ease-out"
                      style={{
                        transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                        zIndex,
                        opacity,
                        width: 'min(90vw, 680px)',
                        height: 'min(55vw, 420px)',
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover object-center pointer-events-none"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to sample photo if local asset not downloaded
                          (e.currentTarget as HTMLImageElement).src = '/images/hero/1.jpg';
                        }}
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-black/50 px-3 py-1 rounded-full border border-amber-300/30">
                              {language === 'hi' ? activeCategoryObj?.hi : activeCategoryObj?.en}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex(index);
                              }}
                              className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg backdrop-blur-md transition"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'पूर्ण स्क्रीन' : 'Fullscreen'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-300">
                <Sparkles className="w-8 h-8 mx-auto text-amber-400 mb-2 opacity-60" />
                <p>{language === 'hi' ? 'इस श्रेणी में कोई चित्र उपलब्ध नहीं है।' : 'No photos available in this category.'}</p>
              </div>
            )}

            {/* Carousel Controls */}
            {filteredPhotos.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90"
                  aria-label="Toggle Autoplay"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setLightboxIndex(activeIndex)}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90"
                  aria-label="Open Fullscreen Lightbox"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-amber-400 hover:text-slate-900 border border-white/20 flex items-center justify-center transition-all shadow-lg active:scale-90"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW MODE 2: RESPONSIVE GRID --- */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900/40 border border-white/15 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={photo.src}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/hero/1.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-amber-300">
                      #{index + 1}
                    </span>
                    <span className="p-1.5 rounded-lg bg-white/20 text-white backdrop-blur-sm">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-white/10 py-4 px-6 text-center text-xs text-blue-200/70 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div>
          {language === 'hi'
            ? 'आधिकारिक फोटो गैलरी · बिहार सरकार'
            : 'Official Photo Gallery · Government of Bihar'}
        </div>
        <div className="flex items-center gap-2">
          <img
            src="/images/bihar-government-logo.png"
            alt="Emblem"
            className="h-6 w-auto object-contain"
          />
          <span className="font-semibold text-white/90">सत्यमेव जयते</span>
        </div>
      </footer>

      {/* 4. Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-white">
            <div className="text-sm font-semibold text-gray-300">
              {lightboxIndex + 1} / {filteredPhotos.length}
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Left Arrow */}
          {filteredPhotos.length > 1 && (
            <button
              onClick={() =>
                setLightboxIndex(
                  (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95 z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Main Large Image */}
          <div className="max-w-5xl max-h-[85vh] flex items-center justify-center p-2">
            <img
              src={filteredPhotos[lightboxIndex].src}
              alt="Fullscreen Preview"
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/hero/1.jpg';
              }}
            />
          </div>

          {/* Right Arrow */}
          {filteredPhotos.length > 1 && (
            <button
              onClick={() =>
                setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95 z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

        </div>
      )}

    </div>
  );
};
