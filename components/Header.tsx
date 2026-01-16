import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Genre, Anime } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onGenreSelect: (genre: Genre) => void;
  onNavigate: (view: 'home' | 'watching' | 'completed' | 'planning' | 'profile' | 'settings') => void;
  allAnime: Anime[];
  onSelectAnime: (anime: Anime) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onGenreSelect, onNavigate, allAnime, onSelectAnime }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
    setShowSuggestions(val.length > 0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  const suggestions = useMemo(() => {
    if (searchQuery.trim().length === 0) return [];
    
    const query = searchQuery.toLowerCase().trim();

    // Scoring system:
    // 100: Exact Title Match
    // 80: Title Starts With Query
    // 60: Title Contains Query
    // 40: Exact Genre Match
    // 20: Partial Genre Match
    // 10: Rating Match
    
    const scored = allAnime.map(anime => {
      let score = 0;
      const titleLower = anime.title.toLowerCase();
      
      // Title Scoring
      if (titleLower === query) score = 100;
      else if (titleLower.startsWith(query)) score = 80;
      else if (titleLower.includes(query)) score = 60;

      // Genre Scoring
      const hasExactGenre = anime.genres.some(g => g.toLowerCase() === query);
      const hasPartialGenre = anime.genres.some(g => g.toLowerCase().includes(query));
      
      if (hasExactGenre) score = Math.max(score, 40);
      else if (hasPartialGenre) score = Math.max(score, 20);

      // Rating Scoring (Low Priority)
      if (anime.rating.toString().startsWith(query)) score = Math.max(score, 10);

      return { anime, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.anime)
      .slice(0, 8);
      
  }, [searchQuery, allAnime]);

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/5 px-4 py-4 lg:px-8 flex items-center justify-between transition-all duration-300"
      style={{ backgroundColor: 'rgba(var(--color-bg-rgb), 0.8)' }}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('home')}>
        <div className="w-10 h-10 bg-theme-primary rounded-lg flex items-center justify-center neon-glow group-hover:bg-theme-secondary group-hover:neon-glow-secondary transition-all duration-500">
          <span className="text-theme-bg font-black text-xl">N</span>
        </div>
        <h1 className="text-2xl font-bold font-accent text-white hidden sm:block tracking-wide group-hover:tracking-wider transition-all">
          NEON<span className="text-theme-primary group-hover:text-theme-secondary transition-colors neon-text">ANIME</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
        <div className="relative z-10 group">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            placeholder="Search database..."
            className="w-full bg-theme-surface/30 border border-white/10 focus:border-theme-primary outline-none rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 transition-all focus:bg-theme-surface/50 focus:neon-glow"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-theme-primary transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-500 hover:text-theme-secondary hover:bg-white/5 transition-all"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-4 bg-theme-surface/95 border border-theme-primary/20 rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-2xl">
            <div className="p-2">
              {suggestions.map((anime) => (
                <div 
                  key={anime.id}
                  onClick={() => {
                    onSelectAnime(anime);
                    setShowSuggestions(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-theme-secondary/10 rounded-xl cursor-pointer transition-all group/item"
                >
                  <div className="relative flex-shrink-0">
                    <img src={anime.poster} alt={anime.title} className="w-10 h-14 object-cover rounded-md group-hover/item:ring-2 ring-theme-secondary transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-200 font-bold text-sm truncate group-hover/item:text-theme-secondary transition-colors">{anime.title}</h4>
                    <div className="flex items-center gap-2 mt-1 overflow-hidden">
                      <span className="text-[10px] text-theme-primary bg-theme-primary/5 px-1.5 py-0.5 rounded border border-theme-primary/20">
                         {anime.genres[0]}
                      </span>
                      <span className="text-[10px] text-gray-500">★ {anime.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-white/5 bg-black/20 flex justify-between items-center">
              <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Global Search</span>
              <span className="text-[9px] text-theme-primary font-mono">{suggestions.length} Results</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 text-white hover:text-theme-primary transition-all rounded-xl hover:bg-white/5 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {isMenuOpen && (
          <div 
            className="absolute right-0 mt-4 w-64 border border-theme-primary/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl ring-1 ring-theme-primary/20"
            style={{ backgroundColor: 'rgba(var(--color-surface-rgb), 0.8)' }}
          >
            <div className="p-2 border-b border-white/5">
              <button onClick={() => { onNavigate('watching'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-theme-secondary hover:text-theme-bg rounded-xl transition-all flex items-center gap-3 font-bold text-sm group">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Watching
              </button>
              <button onClick={() => { onNavigate('completed'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-theme-primary hover:text-theme-bg rounded-xl transition-all flex items-center gap-3 font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Completed
              </button>
              <button onClick={() => { onNavigate('planning'); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-white hover:text-theme-bg rounded-xl transition-all flex items-center gap-3 font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Planning
              </button>
            </div>
            
            <div className="p-2 border-b border-white/5 flex gap-2">
               <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-center bg-white/5 hover:bg-theme-primary hover:text-theme-bg rounded-lg transition-all">Profile</button>
               <button onClick={() => { onNavigate('settings'); setIsMenuOpen(false); }} className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-center bg-white/5 hover:bg-theme-secondary hover:text-theme-bg rounded-lg transition-all">Settings</button>
            </div>

            <div className="p-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              <span className="px-3 py-2 text-[10px] text-gray-500 uppercase font-black tracking-widest block">Categories</span>
              <div className="grid grid-cols-1 gap-1">
                {Object.values(Genre).map((g) => (
                  <button
                    key={g}
                    onClick={() => { onGenreSelect(g); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 hover:text-theme-primary rounded-lg transition-all text-xs font-bold"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;