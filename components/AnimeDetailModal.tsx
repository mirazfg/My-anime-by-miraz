
import React, { useEffect, useState, useCallback } from 'react';
import { Anime, ListStatus } from '../types';
import { fetchAnimeDetails, isGlobalRateLimited } from '../services/geminiService';

interface AnimeDetailModalProps {
  anime: Anime;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ListStatus) => void;
  onEnrich?: (id: string, data: Partial<Anime>) => void;
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({ anime, onClose, onUpdateStatus, onEnrich }) => {
  const [loading, setLoading] = useState(false);
  const [currentPoster, setCurrentPoster] = useState(anime.poster);
  const [localAiDetails, setLocalAiDetails] = useState<any>(null);

  const loadDetails = useCallback(async (force = false) => {
    // Check if we have extended details including season details
    const hasData = anime.synopsis && anime.studio && anime.releaseDate && anime.seasonsDetails;
    if (hasData && !force) return;
    
    if (isGlobalRateLimited()) return;

    setLoading(true);
    try {
      const details = await fetchAnimeDetails(anime.title);
      if (details) {
        setLocalAiDetails(details);
        if (details.posterUrl) setCurrentPoster(details.posterUrl);
        
        // PERSIST BACK TO GLOBAL STATE
        if (onEnrich) {
          onEnrich(anime.id, {
            synopsis: details.synopsis,
            studio: details.studio,
            releaseDate: details.releaseDate,
            rating: details.malRating || anime.rating,
            poster: details.posterUrl || anime.poster,
            totalSeasons: details.totalSeasons,
            episodes: details.totalEpisodes,
            storyReview: details.storyReview,
            seasonsDetails: details.seasonsDetails, // Save season timeline
          });
        }
      }
    } catch (e) {
      console.error("Modal fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [anime, onEnrich]);

  useEffect(() => {
    loadDetails();
  }, [anime.id]); 

  const displaySynopsis = localAiDetails?.synopsis || anime.synopsis;
  const displayStudio = localAiDetails?.studio || anime.studio;
  const displayRelease = localAiDetails?.releaseDate || anime.releaseDate;
  const displayRating = localAiDetails?.malRating || anime.rating;
  const displaySeasons = localAiDetails?.totalSeasons || anime.totalSeasons;
  const displayEpisodes = localAiDetails?.totalEpisodes || anime.episodes;
  const displayReview = localAiDetails?.storyReview || anime.storyReview;
  const seasonTimeline = localAiDetails?.seasonsDetails || anime.seasonsDetails;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      {/* Immersive Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" onClick={onClose}></div>
      <div 
        className="absolute inset-0 bg-cover bg-center z-[-1] opacity-20 blur-3xl scale-110 transition-all duration-1000"
        style={{ backgroundImage: `url(${currentPoster})` }}
      ></div>

      <div 
        className="relative w-full max-w-6xl h-[90vh] sm:h-[85vh] bg-theme-surface/60 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-black/20 hover:bg-theme-secondary text-white rounded-full transition-all duration-300 backdrop-blur-md group"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Left Column: Visuals */}
        <div className="w-full md:w-5/12 lg:w-4/12 h-64 md:h-full relative overflow-hidden group">
          <img 
            src={currentPoster} 
            alt={anime.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== anime.poster) target.src = anime.poster;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-theme-surface via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-theme-surface/80"></div>
          
          {/* Mobile Overlay Title (Hidden on Desktop) */}
          <div className="absolute bottom-4 left-4 right-4 md:hidden">
            <h2 className="text-3xl font-bold font-accent text-white drop-shadow-md truncate">{anime.title}</h2>
          </div>
        </div>

        {/* Right Column: Data Stream */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="hidden md:block mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres.map(g => (
                <span key={g} className="px-3 py-1 rounded-md bg-theme-primary/5 text-theme-primary border border-theme-primary/20 text-[10px] font-bold uppercase tracking-widest hover:bg-theme-primary hover:text-theme-bg transition-colors cursor-default">
                  {g}
                </span>
              ))}
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold font-accent text-white leading-none tracking-tight mb-2 uppercase neon-text-secondary">{anime.title}</h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="text-center border-r border-white/10 last:border-0">
               <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Rating</span>
               <span className="text-xl md:text-2xl font-black font-accent text-theme-primary flex items-center justify-center gap-1">
                 {displayRating} <span className="text-xs md:text-sm text-gray-500">/ 10</span>
               </span>
            </div>
            <div className="text-center border-r border-white/10 last:border-0 md:border-r">
               <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Franchise</span>
               <span className="text-xl md:text-2xl font-black font-accent text-white">
                 {displaySeasons || (loading ? '-' : '?')} <span className="text-xs text-gray-500">Parts</span>
               </span>
            </div>
            <div className="text-center border-r border-white/10 last:border-0">
               <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Eps</span>
               <span className="text-xl md:text-2xl font-black font-accent text-white">
                 {displayEpisodes || (loading ? '-' : '?')}
               </span>
            </div>
             <div className="text-center">
               <span className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Year</span>
               <span className="text-lg md:text-xl font-bold text-white">
                 {displayRelease ? displayRelease.split('-')[0] : (loading ? '...' : 'TBA')}
               </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <h3 className="text-theme-secondary font-black uppercase tracking-[0.25em] text-xs mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-theme-secondary"></span> Synopsis
              </h3>
              <p className="text-gray-300 leading-relaxed text-base lg:text-lg font-light">
                {loading && !displaySynopsis ? (
                   <span className="animate-pulse text-gray-500">Downloading narrative data from secure archives...</span>
                ) : (
                  displaySynopsis || "No synopsis available."
                )}
              </p>
            </div>

            {/* Studio & Review Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Studio</h3>
                  <p className="text-white font-bold text-lg">{displayStudio || "Unknown"}</p>
               </div>
               
               {displayReview && (
                 <div className="p-4 rounded-xl bg-theme-primary/10 border-l-2 border-theme-primary">
                    <h3 className="text-theme-primary font-bold text-[10px] uppercase tracking-widest mb-1">Story Insight</h3>
                    <p className="text-gray-200 text-sm italic">"{displayReview}"</p>
                 </div>
               )}
            </div>

            {/* SEASON HISTORY LIST */}
            {seasonTimeline && seasonTimeline.length > 0 && (
                <div className="mt-4 p-5 bg-black/40 rounded-xl border border-white/10">
                    <h3 className="text-theme-primary font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Season Chronology
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-theme-secondary/30">
                        {seasonTimeline.map((season, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm border-b border-white/5 pb-2 last:border-0 gap-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-theme-secondary font-mono text-xs opacity-70">S{season.seasonNumber}</span>
                                    <span className="text-white font-medium">{season.title}</span>
                                </div>
                                <div className="flex gap-4 text-xs text-gray-400 pl-8 sm:pl-0">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {season.releaseDate || 'TBA'}
                                    </span>
                                    <span className="flex items-center gap-1 text-theme-primary">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {season.episodes || '?'} Eps
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Action Bar */}
            <div className="pt-6 mt-8 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => { onUpdateStatus(anime.id, ListStatus.Watching); onClose(); }}
                  className="group relative overflow-hidden rounded-xl bg-theme-primary p-[1px] focus:outline-none"
                >
                  <div className="relative bg-theme-bg group-hover:bg-theme-primary transition-colors rounded-xl px-6 py-4 flex items-center justify-center gap-3">
                    <span className="text-theme-primary group-hover:text-theme-bg font-black uppercase tracking-widest text-sm transition-colors">Start Watching</span>
                    <svg className="w-5 h-5 text-theme-primary group-hover:text-theme-bg transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </button>
                
                <div className="flex gap-2">
                   <button 
                    onClick={() => { onUpdateStatus(anime.id, ListStatus.Planning); onClose(); }}
                    className="flex-1 px-4 py-4 bg-white/5 border border-white/10 hover:border-white/40 text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all hover:bg-white/10"
                  >
                    + Plan
                  </button>
                  <button 
                    onClick={() => { onUpdateStatus(anime.id, ListStatus.Completed); onClose(); }}
                    className="flex-1 px-4 py-4 bg-white/5 border border-white/10 hover:border-theme-secondary/50 text-white hover:text-theme-secondary font-bold uppercase text-xs tracking-widest rounded-xl transition-all hover:bg-theme-secondary/10"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
