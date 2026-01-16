import React, { useRef, useState, useEffect } from 'react';
import { Anime } from '../types';
import AnimeCard from './AnimeCard';

interface AnimeCarouselProps {
  title: string;
  animeList: Anime[];
  onSelectAnime: (anime: Anime) => void;
  onViewAll?: () => void;
}

const AnimeCarousel: React.FC<AnimeCarouselProps> = ({ title, animeList, onSelectAnime, onViewAll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [animeList]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="group/carousel relative space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-2xl font-bold font-accent text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-theme-primary rounded-full neon-glow"></span>
          {title}
        </h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-theme-primary text-sm hover:underline transition-all hover:neon-text cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-theme-surface/80 backdrop-blur-md border border-theme-primary/30 text-theme-primary rounded-full shadow-2xl transition-all hover:scale-110 hover:bg-theme-primary hover:text-theme-bg hover:neon-glow -ml-4"
            aria-label="Scroll Left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-theme-surface/80 backdrop-blur-md border border-theme-primary/30 text-theme-primary rounded-full shadow-2xl transition-all hover:scale-110 hover:bg-theme-primary hover:text-theme-bg hover:neon-glow -mr-4"
            aria-label="Scroll Right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Masking Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-theme-bg to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-theme-bg to-transparent z-10 pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"></div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} onClick={onSelectAnime} />
          ))}
          <div className="flex-shrink-0 w-1 sm:w-8"></div> {/* End spacing */}
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default AnimeCarousel;