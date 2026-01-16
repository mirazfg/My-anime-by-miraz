
import React, { useState, useEffect, useRef } from 'react';
import { Anime } from '../types';
import { getShortAiSummary, isGlobalRateLimited } from '../services/geminiService';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  rank?: number; // Optional rank for Top 10 display
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick, rank }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0, cX: 0, cY: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate normalized position (-1 to 1) from center
    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;
    
    setParallax({ 
      x: xPct * -20, // Background deep movement (opposite to mouse)
      y: yPct * -20,
      cX: xPct * 8,  // Content floating movement (with mouse, feels closer)
      cY: yPct * 8
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth reset
    setParallax({ x: 0, y: 0, cX: 0, cY: 0 });
  };

  // Fetch short AI summary on hover if not already cached
  useEffect(() => {
    let isMounted = true;
    if (isHovered && !aiSummary && !loadingSummary && !isGlobalRateLimited()) {
      setLoadingSummary(true);
      getShortAiSummary(anime.title, anime.id)
        .then((summary) => {
          if (isMounted) {
            setAiSummary(summary);
            setLoadingSummary(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingSummary(false);
        });
    }
    return () => { isMounted = false; };
  }, [isHovered, anime.id, anime.title, aiSummary, loadingSummary]);

  const getRankSuffix = (n: number) => {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const getRankStyle = (r: number) => {
      if (r === 1) return { bg: 'bg-gradient-to-br from-yellow-300 to-yellow-600', text: 'text-black', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]' };
      if (r === 2) return { bg: 'bg-gradient-to-br from-gray-300 to-gray-500', text: 'text-black', shadow: 'shadow-[0_0_20px_rgba(209,213,219,0.6)]' };
      if (r === 3) return { bg: 'bg-gradient-to-br from-orange-400 to-amber-700', text: 'text-white', shadow: 'shadow-[0_0_20px_rgba(180,83,9,0.6)]' };
      return { bg: 'bg-theme-surface/90 border border-theme-primary/50', text: 'text-theme-primary', shadow: 'shadow-lg' };
  };

  const rankStyle = rank ? getRankStyle(rank) : null;

  return (
    <div 
      ref={cardRef}
      className="relative flex-shrink-0 w-[160px] sm:w-[200px] h-[240px] sm:h-[300px] rounded-xl overflow-hidden cursor-pointer group transition-all duration-500 hover:shadow-[0_0_25px_var(--color-primary)] ring-1 ring-white/10 hover:ring-theme-primary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={() => onClick(anime)}
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 bg-gray-900 overflow-hidden">
        <img 
          src={anime.poster} 
          alt={anime.title} 
          loading="lazy"
          style={{
            transform: `scale(1.2) translate(${parallax.x}px, ${parallax.y}px)`,
            transition: isHovered ? 'transform 0.1s linear' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 will-change-transform" 
        />
      </div>

      {/* Elegant Rank Badge */}
      {rank && rankStyle && (
        <div className={`absolute top-0 left-0 z-30 ${rankStyle.bg} px-3 py-1.5 rounded-br-2xl ${rankStyle.shadow} flex flex-col items-center justify-center min-w-[50px] transition-transform group-hover:scale-110`}>
          <div className={`text-2xl font-black font-accent leading-none ${rankStyle.text}`}>
             {rank}<span className="text-[10px] align-top ml-0.5 opacity-80 uppercase">{getRankSuffix(rank)}</span>
          </div>
          {(rank <= 3) && <div className="w-full h-0.5 bg-white/40 mt-0.5 rounded-full"></div>}
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-theme-bg/40 to-transparent opacity-90 transition-opacity duration-300 pointer-events-none" />

      {/* Hover Glassmorphism Overlay with Parallax (Floating Effect) */}
      <div 
        className={`absolute inset-0 bg-theme-surface/90 backdrop-blur-md transition-all duration-300 flex flex-col p-4 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}
        style={{
          transform: `translate(${parallax.cX}px, ${parallax.cY}px)`,
          transition: isHovered ? 'transform 0.1s linear, opacity 0.3s ease' : 'transform 0.5s ease, opacity 0.3s ease'
        }}
      >
         <div className="flex-1 overflow-hidden relative flex flex-col">
            <h4 className="text-theme-primary font-bold text-xs uppercase tracking-widest mb-3 border-b border-theme-primary/20 pb-2 flex-shrink-0">Neural Hook</h4>
            
            {loadingSummary ? (
              <div className="flex-1 relative overflow-hidden rounded-lg bg-theme-primary/5 border border-theme-primary/10 p-2 flex flex-col justify-center gap-2">
                 {/* Grid Background */}
                 <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: 'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)', 
                    backgroundSize: '16px 16px' 
                 }}></div>

                 {/* Scanning Bar */}
                 <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-transparent via-theme-primary/20 to-transparent animate-[scan_2s_linear_infinite] border-b border-theme-primary/50 shadow-[0_0_15px_var(--color-primary)] z-10"></div>
                 
                 {/* Abstract Data Lines (Skeleton) */}
                 <div className="space-y-2 relative z-0 px-1">
                    <div className="h-1.5 bg-theme-primary/30 rounded w-[85%] animate-pulse"></div>
                    <div className="h-1.5 bg-theme-primary/20 rounded w-[95%] animate-pulse delay-75"></div>
                    <div className="h-1.5 bg-theme-primary/10 rounded w-[70%] animate-pulse delay-150"></div>
                    <div className="h-1.5 bg-theme-primary/20 rounded w-[90%] animate-pulse delay-100"></div>
                 </div>

                 {/* Status Text */}
                 <div className="absolute bottom-2 right-2 z-20">
                    <span className="text-[9px] font-bold text-theme-primary animate-pulse tracking-widest">
                      SCANNING...
                    </span>
                 </div>

                 <style>{`
                    @keyframes scan {
                      0% { transform: translateY(-150%); opacity: 0; }
                      10% { opacity: 1; }
                      90% { opacity: 1; }
                      100% { transform: translateY(400%); opacity: 0; }
                    }
                 `}</style>
              </div>
            ) : (
               <p className="text-gray-200 text-sm leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-theme-primary/30">
                 {aiSummary || "Click card to initialize data stream and view full details."}
               </p>
            )}
         </div>

         {/* Footer Actions */}
         <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between flex-shrink-0">
            <span className="text-[10px] text-gray-500 font-accent uppercase tracking-widest">System Ready</span>
            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-theme-secondary border border-white/10 hover:border-theme-secondary transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <svg className="w-4 h-4 text-gray-300 transform rotate-[-45deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
         </div>
      </div>

      {/* Default Content (Visible when not hovered) */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 ${isHovered ? 'translate-y-full' : 'translate-y-0'} pointer-events-none`}>
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md mb-2 group-hover:text-theme-primary transition-colors">
            {rank ? <span className="text-theme-secondary mr-1">#{rank}</span> : ''} {anime.title}
        </h3>
        
        <div className="flex flex-col gap-2">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 shadow-sm w-fit">
              <svg className="w-3 h-3 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-xs font-bold text-white">{anime.rating}</span>
            </div>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1.5">
            {anime.genres.slice(0, 3).map((genre) => (
              <span 
                key={genre} 
                className="text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md border border-theme-primary/30 bg-theme-primary/10 text-theme-primary uppercase tracking-wider backdrop-blur-sm shadow-[0_0_5px_rgba(0,209,255,0.1)]"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
