import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Anime, Genre, ListStatus, UserStats } from './types';
import { INITIAL_ANIME_DATA, AVATAR_PRESETS } from './constants';
import Header from './components/Header';
import AnimeCard from './components/AnimeCard';
import AnimeCarousel from './components/AnimeCarousel';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import AnimeChatCompanions from './components/AnimeChatCompanions';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import { fetchAnimeDetails, isGlobalRateLimited } from './services/geminiService';

type ViewType = 'home' | 'watching' | 'completed' | 'planning' | 'profile' | 'settings';
type ThemeFaction = 'NEON' | 'NETRUNNER' | 'ARASAKA' | 'ROYAL';
type SortOption = 'rating_desc' | 'date_newest' | 'date_oldest' | null;

const THEMES: Record<ThemeFaction, { primary: string; secondary: string; bg: string; surface: string }> = {
  NEON: { primary: '#00D1FF', secondary: '#F72585', bg: '#050B14', surface: '#0B1D3A' },
  NETRUNNER: { primary: '#39FF14', secondary: '#FFFF00', bg: '#000000', surface: '#111111' },
  ARASAKA: { primary: '#FF003C', secondary: '#FFFFFF', bg: '#050505', surface: '#1A1A1A' },
  ROYAL: { primary: '#9D00FF', secondary: '#FFD700', bg: '#0F0518', surface: '#241038' },
};

const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
};

const App: React.FC = () => {
  const STORAGE_KEY = 'neon_anime_list_v8';
  const THEME_KEY = 'neon_anime_theme_v1';
  const USER_PROFILE_KEY = 'neon_user_profile_v1';
  
  // --- PERSISTENCE LOGIC (MERGE STRATEGY) ---
  const [animeList, setAnimeList] = useState<Anime[]>(() => {
    try {
      const savedJSON = localStorage.getItem(STORAGE_KEY);
      if (!savedJSON) return INITIAL_ANIME_DATA;

      const savedList: Anime[] = JSON.parse(savedJSON);
      const savedMap = new Map(savedList.map(a => [a.title, a] as [string, Anime]));

      return INITIAL_ANIME_DATA.map(initialItem => {
        const savedItem = savedMap.get(initialItem.title);
        if (savedItem) {
          return {
            ...initialItem,
            ...savedItem,
            id: initialItem.id 
          };
        }
        return initialItem;
      });
    } catch (e) {
      console.error("Failed to load anime list", e);
      return INITIAL_ANIME_DATA;
    }
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeFaction>(() => {
    return (localStorage.getItem(THEME_KEY) as ThemeFaction) || 'NEON';
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        username: parsed.username || 'Miraz Arafath 1234',
        avatar: parsed.avatar || 'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
        watchedCount: 0,
        completedCount: 0,
        planningCount: 0,
        favoriteGenres: [Genre.Action, Genre.SciFi]
      };
    } catch (e) {
      return {
        username: 'Miraz Arafath 1234',
        avatar: 'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
        watchedCount: 0,
        completedCount: 0,
        planningCount: 0,
        favoriteGenres: [Genre.Action, Genre.SciFi]
      };
    }
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre>(Genre.All);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedAnimeId, setSelectedAnimeId] = useState<string | null>(null);
  
  // Filter States
  const [sortOption, setSortOption] = useState<SortOption>(null);
  const [filterStudio, setFilterStudio] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<string | null>(null);
  const [isTop10Mode, setIsTop10Mode] = useState(false);

  // UI States
  const [showStudioMenu, setShowStudioMenu] = useState(false);
  const [showYearMenu, setShowYearMenu] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const [ripples, setRipples] = useState<{x: number, y: number, id: number}[]>([]);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEnrichingRef = useRef(false);

  // Theme Handling
  useEffect(() => {
    const t = THEMES[currentTheme];
    const r = document.documentElement;
    r.style.setProperty('--color-primary', t.primary);
    r.style.setProperty('--color-secondary', t.secondary);
    r.style.setProperty('--color-bg', t.bg);
    r.style.setProperty('--color-surface', t.surface);
    r.style.setProperty('--color-primary-rgb', hexToRgb(t.primary));
    r.style.setProperty('--color-secondary-rgb', hexToRgb(t.secondary));
    r.style.setProperty('--color-bg-rgb', hexToRgb(t.bg));
    r.style.setProperty('--color-surface-rgb', hexToRgb(t.surface));
    localStorage.setItem(THEME_KEY, currentTheme);
  }, [currentTheme]);

  // DATA SAVE LOGIC
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animeList));
    
    const watching = animeList.filter(a => a.status === ListStatus.Watching).length;
    const completed = animeList.filter(a => a.status === ListStatus.Completed).length;
    const planning = animeList.filter(a => a.status === ListStatus.Planning).length;
    
    const newStats = { ...userStats, watchedCount: watching, completedCount: completed, planningCount: planning };
    
    if (newStats.watchedCount !== userStats.watchedCount || 
        newStats.completedCount !== userStats.completedCount || 
        newStats.planningCount !== userStats.planningCount) {
        setUserStats(newStats);
    }
  }, [animeList]); 

  // Profile Local Save
  useEffect(() => {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({ username: userStats.username, avatar: userStats.avatar }));
  }, [userStats.username, userStats.avatar]);

  useEffect(() => {
    if (currentView === 'home' && !isTransitioning) {
      setShowWelcome(true);
      const timer = setTimeout(() => { setShowWelcome(false); }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  useEffect(() => {
    const timer = setTimeout(() => { if (!heroLoaded) setHeroLoaded(true); }, 2500);
    return () => clearTimeout(timer);
  }, [heroLoaded]);

  // --- BACKUP & RESTORE FUNCTIONS ---
  const handleExportSave = () => {
    const saveData = {
        version: 1,
        date: new Date().toISOString(),
        animeList,
        userStats,
        currentTheme
    };
    const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neon-anime-save-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("Save file downloaded! Keep this file safe.");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target?.result as string);
            if (data.animeList && Array.isArray(data.animeList)) {
                // Merge logic for imported data
                const importedList = data.animeList as Anime[];
                const importedMap = new Map(importedList.map(a => [a.title, a] as [string, Anime]));
                
                const mergedList = INITIAL_ANIME_DATA.map(initialItem => {
                    const importedItem = importedMap.get(initialItem.title);
                    if (importedItem) {
                        return { ...initialItem, ...importedItem, id: initialItem.id };
                    }
                    return initialItem;
                });

                setAnimeList(mergedList);
                if (data.userStats) setUserStats(data.userStats);
                if (data.currentTheme) setCurrentTheme(data.currentTheme);
                
                alert("Data restored successfully!");
            } else {
                alert("Invalid save file format.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to parse save file.");
        }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleEnrich = (id: string, data: Partial<Anime>) => {
    setAnimeList(prev => prev.map(a => a.id === id ? { ...a, ...data, needsEnrichment: false } : a));
  };
  
  const updateAnimeStatus = (id: string, status: ListStatus) => {
    setAnimeList(prev => prev.map(anime => anime.id === id ? { ...anime, status } : anime));
    setSearchQuery('');
    setSelectedGenre(Genre.All);
    setFilterStudio(null);
    setFilterYear(null);
    setSortOption(null);

    if (status === ListStatus.Watching) { setCurrentView('watching'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (status === ListStatus.Completed) { setCurrentView('completed'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (status === ListStatus.Planning) { setCurrentView('planning'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const handleHeroClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, {x, y, id}]);
    setTimeout(() => { setRipples(prev => prev.filter(r => r.id !== id)); }, 800);
  };

  const handleFactoryReset = () => {
    if (window.confirm("SYSTEM WARNING: Factory Reset Initiated.\n\nThis will wipe all local data.\n\nAre you sure you want to proceed?")) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(THEME_KEY);
        localStorage.removeItem(USER_PROFILE_KEY);
        window.location.reload();
    }
  };

  const handleManualFetch = async () => {
    if (isSyncing || isEnrichingRef.current) return;
    const targets = animeList.filter(a => a.needsEnrichment !== false || (!a.synopsis || !a.studio || !a.releaseDate));
    if (targets.length === 0) { alert("All anime data is already synchronized."); return; }
    if (!window.confirm(`Syncing ${targets.length} entries with Global Databases.\n\nContinue?`)) return;

    setIsSyncing(true);
    isEnrichingRef.current = true;
    setSyncProgress({ current: 0, total: targets.length });

    for (let i = 0; i < targets.length; i++) {
        const anime = targets[i];
        setSyncProgress({ current: i + 1, total: targets.length });
        try {
            if (isGlobalRateLimited()) await new Promise(resolve => setTimeout(resolve, 5000));
            const details = await fetchAnimeDetails(anime.title);
            if (details) {
                setAnimeList(prev => prev.map(item => 
                    item.id === anime.id ? {
                        ...item,
                        poster: details.posterUrl || item.poster,
                        rating: details.malRating || item.rating,
                        studio: details.studio || item.studio,
                        releaseDate: details.releaseDate || item.releaseDate,
                        synopsis: details.synopsis || item.synopsis,
                        totalSeasons: details.totalSeasons,
                        episodes: details.totalEpisodes,
                        storyReview: details.storyReview,
                        seasonsDetails: details.seasonsDetails,
                        needsEnrichment: false
                    } : item
                ));
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) { console.error(`Failed to fetch for ${anime.title}`, e); }
    }
    setIsSyncing(false);
    isEnrichingRef.current = false;
    alert("Sync Complete.");
  };

  const handleNavigate = (view: ViewType) => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSortOption(null);
      setFilterStudio(null);
      setFilterYear(null);
      setIsTop10Mode(false);
      if (view !== 'home') { setSearchQuery(''); setSelectedGenre(Genre.All); }
      setTimeout(() => { setIsTransitioning(false); }, 50);
    }, 300);
  };

  const handleGenreSelect = (genre: Genre) => {
    if (currentView !== 'home') handleNavigate('home');
    setSelectedGenre(genre);
    setSortOption(null);
    setFilterStudio(null);
    setFilterYear(null);
    setIsTop10Mode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditingProfile = () => {
    setEditUsername(userStats.username);
    setSelectedAvatar(userStats.avatar);
    setIsEditingProfile(true);
  };

  const saveProfile = () => {
    setUserStats(prev => ({ ...prev, username: editUsername, avatar: selectedAvatar }));
    setIsEditingProfile(false);
  };

  useEffect(() => {
    const processEnrichment = async () => {
      if (isEnrichingRef.current || isGlobalRateLimited()) return;
      const target = animeList.find(a => a.needsEnrichment !== false && (!a.synopsis || !a.studio || !a.releaseDate));
      if (!target) return;
      isEnrichingRef.current = true;
      try {
        const enrichedData = await fetchAnimeDetails(target.title);
        if (enrichedData) {
          handleEnrich(target.id, {
            poster: enrichedData.posterUrl || target.poster,
            rating: enrichedData.malRating || target.rating,
            studio: enrichedData.studio || target.studio,
            releaseDate: enrichedData.releaseDate || target.releaseDate,
            synopsis: enrichedData.synopsis || target.synopsis,
            totalSeasons: enrichedData.totalSeasons,
            episodes: enrichedData.totalEpisodes,
            storyReview: enrichedData.storyReview,
            seasonsDetails: enrichedData.seasonsDetails,
          });
        }
      } catch (e) { console.warn(`[Enrichment] Error:`, e); } 
      finally { isEnrichingRef.current = false; }
    };
    const interval = setInterval(processEnrichment, 30000);
    return () => clearInterval(interval);
  }, [animeList]);

  const availableStudios = useMemo(() => {
    const studios = new Set<string>();
    animeList.forEach(a => { if (a.studio) studios.add(a.studio); });
    return Array.from(studios).sort();
  }, [animeList]);

  const availableYears = useMemo(() => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1980; i--) { years.push(i.toString()); }
    return years;
  }, []);

  const filteredAnime = useMemo(() => {
    let result = animeList.filter(a => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = a.title.toLowerCase().includes(query) || a.genres.some(g => g.toLowerCase().includes(query));
      const matchesGenre = selectedGenre === Genre.All || a.genres.includes(selectedGenre);
      let matchesView = true;
      if (currentView === 'watching') matchesView = a.status === ListStatus.Watching;
      if (currentView === 'completed') matchesView = a.status === ListStatus.Completed;
      if (currentView === 'planning') matchesView = a.status === ListStatus.Planning;
      const matchesStudio = filterStudio ? a.studio === filterStudio : true;
      const matchesYear = filterYear ? (a.releaseDate && a.releaseDate.includes(filterYear)) : true;
      return matchesSearch && matchesGenre && matchesView && matchesStudio && matchesYear;
    });

    if (isTop10Mode) {
        result.sort((a, b) => b.rating - a.rating);
        return result.slice(0, 10);
    }

    if (sortOption === 'rating_desc') {
        result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'date_newest') {
        result.sort((a, b) => {
            const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
            const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
            return dateB - dateA;
        });
    } else if (sortOption === 'date_oldest') {
        result.sort((a, b) => {
             const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
             const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
             return dateA - dateB;
        });
    }
    return result;
  }, [animeList, searchQuery, selectedGenre, currentView, sortOption, filterStudio, filterYear, isTop10Mode]);

  const selectedAnime = useMemo(() => { return animeList.find(a => a.id === selectedAnimeId) || null; }, [animeList, selectedAnimeId]);
  const HERO_BG_IMAGE = "https://wallpaperaccess.com/full/3378563.jpg";
  const HomeButton = () => (
    <button onClick={() => { setCurrentView('home'); setSelectedGenre(Genre.All); setSearchQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 px-3 py-1.5 bg-theme-primary/10 hover:bg-theme-primary text-theme-primary hover:text-theme-bg rounded-lg border border-theme-primary/20 transition-all group">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        <span className="text-xs font-bold uppercase tracking-wider">Home</span>
    </button>
  );

  const isListView = ['watching', 'completed', 'planning'].includes(currentView);
  const isSearchActive = searchQuery !== '' || selectedGenre !== Genre.All;
  const showHero = currentView === 'home' && !isSearchActive;
  const showGrid = isListView || (currentView === 'home' && isSearchActive);
  const showProfile = currentView === 'profile' || currentView === 'settings';

  return (
    <div className="min-h-screen text-gray-200">
      <Header onSearch={setSearchQuery} onGenreSelect={handleGenreSelect} onNavigate={handleNavigate} allAnime={animeList} onSelectAnime={(a) => setSelectedAnimeId(a.id)} />
      
      <main className={`container mx-auto px-4 lg:px-8 transition-all duration-300 ease-in-out transform ${isTransitioning ? 'opacity-0 translate-y-4 filter blur-sm scale-95' : 'opacity-100 translate-y-0 filter blur-0 scale-100'}`}>
        
        {/* --- HERO HOME VIEW --- */}
        {showHero && (
           <div className="space-y-20 pb-20 pt-6">
           <section onClick={handleHeroClick} className="relative h-[500px] sm:h-[650px] -mx-4 lg:-mx-8 overflow-hidden rounded-[2rem] shadow-2xl group cursor-pointer select-none ring-1 ring-white/10 bg-theme-bg">
             <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center bg-theme-bg transition-opacity duration-700 ${heroLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="relative w-20 h-20 mb-6">
                   <div className="absolute inset-0 border-2 border-theme-primary/10 rounded-full"></div>
                   <div className="absolute inset-0 border-2 border-t-theme-primary border-r-transparent border-b-theme-secondary border-l-transparent rounded-full animate-spin neon-glow"></div>
                   <div className="absolute inset-4 border-2 border-t-transparent border-r-theme-secondary border-b-transparent border-l-theme-primary rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                   <div className="absolute inset-[38%] bg-white rounded-full animate-pulse shadow-[0_0_15px_white]"></div>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="text-theme-primary font-mono text-xs tracking-[0.4em] uppercase">Initializing Visuals</div>
                </div>
             </div>
             <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-125 transition-opacity duration-1000 ${heroLoaded ? 'opacity-40' : 'opacity-0'}`} style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}></div>
                <img src={HERO_BG_IMAGE} className={`w-full h-full object-cover object-top transition-all duration-[2s] group-hover:scale-105 ${heroLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`} alt="Cyberpunk Anime Girl" onLoad={() => setHeroLoaded(true)} onError={() => setHeroLoaded(true)} />
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-theme-bg/40 to-transparent"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-theme-bg/90 via-theme-bg/30 to-transparent"></div>
             <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
             {ripples.map(ripple => (
               <div key={ripple.id} className="absolute rounded-full pointer-events-none mix-blend-screen z-20" style={{ left: ripple.x, top: ripple.y, transform: 'translate(-50%, -50%)', animation: 'lightning-burst 0.8s ease-out forwards' }} />
             ))}
             <div className={`absolute bottom-12 left-8 lg:left-16 max-w-3xl z-20 transition-all duration-1000 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
               <h2 className="text-6xl sm:text-8xl font-bold font-accent text-white mb-6 leading-[0.85] tracking-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">MY ANIME <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-theme-secondary neon-text">by miraz</span></h2>
               <div className="flex flex-wrap gap-4">
                 <button onClick={() => document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-theme-primary text-theme-bg font-black uppercase tracking-widest text-sm rounded-xl hover:bg-theme-secondary hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(0,209,255,0.4)]">Explore Collection</button>
               </div>
             </div>
           </section>
   
           <div id="browse-section" className="space-y-12 scroll-mt-24">
             <AnimeCarousel title="Action Frontline" animeList={animeList.filter(a => a.genres.includes(Genre.Action)).slice(0, 15)} onSelectAnime={(a) => setSelectedAnimeId(a.id)} onViewAll={() => handleGenreSelect(Genre.Action)} />
              <AnimeCarousel title="Cyber & Sci-Fi" animeList={animeList.filter(a => a.genres.includes(Genre.SciFi)).slice(0, 15)} onSelectAnime={(a) => setSelectedAnimeId(a.id)} onViewAll={() => handleGenreSelect(Genre.SciFi)} />
             <AnimeCarousel title="Romance & Slice of Life" animeList={animeList.filter(a => a.genres.includes(Genre.Romance) || a.genres.includes(Genre.SliceOfLife)).slice(0, 15)} onSelectAnime={(a) => setSelectedAnimeId(a.id)} onViewAll={() => handleGenreSelect(Genre.Romance)} />
           </div>
         </div>
        )}

        {/* --- GRID VIEW --- */}
        {showGrid && (
          <div className="pt-8 pb-20 px-0 lg:px-4 min-h-screen animate-in fade-in duration-500">
             <div className="flex flex-col gap-6 mb-8 border-b border-white/10 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {isListView && (
                           <button onClick={() => { setCurrentView('home'); setSelectedGenre(Genre.All); setSearchQuery(''); }} className="p-3 bg-white/5 hover:bg-theme-primary hover:text-theme-bg rounded-xl transition-all group">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                        )}
                        {!isListView && isSearchActive && (
                             <button onClick={() => { setSelectedGenre(Genre.All); setSearchQuery(''); }} className="p-3 bg-white/5 hover:bg-theme-primary hover:text-theme-bg rounded-xl transition-all group">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                        )}
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{isListView ? 'Personal Archive' : 'Browsing Database'}</div>
                            <h2 className="text-3xl font-black font-accent text-white uppercase tracking-wider">
                            {currentView === 'watching' ? 'Watching List' : currentView === 'completed' ? 'Completed Log' : currentView === 'planning' ? 'Plan to Watch' : searchQuery ? `Search: "${searchQuery}"` : selectedGenre}
                            <span className="text-theme-primary text-lg align-top ml-2">{filteredAnime.length}</span>
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                     <button onClick={() => { setIsTop10Mode(!isTop10Mode); if(!isTop10Mode) { setSortOption(null); } }} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${isTop10Mode ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> Top 10 Ranked
                    </button>
                    <div className="h-6 w-[1px] bg-white/10 mx-1 hidden sm:block"></div>
                    <select disabled={isTop10Mode} value={sortOption || ''} onChange={(e) => setSortOption(e.target.value as SortOption || null)} className={`px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-300 outline-none focus:border-theme-primary ${isTop10Mode ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <option value="">Sort By: Default</option>
                        <option value="rating_desc">Highest Rated</option>
                        <option value="date_newest">Newest Release</option>
                        <option value="date_oldest">Oldest Release</option>
                    </select>
                    <div className="relative">
                        <button onClick={() => setShowStudioMenu(!showStudioMenu)} className={`px-3 py-2 border rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${filterStudio ? 'bg-theme-primary/10 border-theme-primary text-theme-primary' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}>
                            {filterStudio ? `Studio: ${filterStudio}` : 'Filter Studio'} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {showStudioMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowStudioMenu(false)}></div>
                                <div className="absolute top-full left-0 mt-2 w-48 max-h-60 overflow-y-auto bg-black/90 border border-white/10 rounded-xl backdrop-blur-xl z-50 scrollbar-thin scrollbar-thumb-gray-700">
                                    <button onClick={() => { setFilterStudio(null); setShowStudioMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10">All Studios</button>
                                    {availableStudios.map(studio => (
                                        <button key={studio} onClick={() => { setFilterStudio(studio); setShowStudioMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-theme-primary/20 ${filterStudio === studio ? 'text-theme-primary font-bold' : 'text-gray-300'}`}>{studio}</button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowYearMenu(!showYearMenu)} className={`px-3 py-2 border rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${filterYear ? 'bg-theme-secondary/10 border-theme-secondary text-theme-secondary' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}>
                            {filterYear ? `Year: ${filterYear}` : 'Filter Year'} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {showYearMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowYearMenu(false)}></div>
                                <div className="absolute top-full left-0 mt-2 w-32 max-h-60 overflow-y-auto bg-black/90 border border-white/10 rounded-xl backdrop-blur-xl z-50 scrollbar-thin scrollbar-thumb-gray-700">
                                    <button onClick={() => { setFilterYear(null); setShowYearMenu(false); }} className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10">All Years</button>
                                    {availableYears.map(year => (
                                        <button key={year} onClick={() => { setFilterYear(year); setShowYearMenu(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-theme-secondary/20 ${filterYear === year ? 'text-theme-secondary font-bold' : 'text-gray-300'}`}>{year}</button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {(filterStudio || filterYear || isTop10Mode) && (
                        <button onClick={() => { setFilterStudio(null); setFilterYear(null); setIsTop10Mode(false); setSortOption(null); }} className="text-xs text-red-400 hover:text-red-300 underline decoration-red-400/50">Reset Filters</button>
                    )}
                </div>
             </div>
             {filteredAnime.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 justify-items-center">
                   {filteredAnime.map((anime, index) => (
                      <AnimeCard key={anime.id} anime={anime} onClick={() => setSelectedAnimeId(anime.id)} rank={isTop10Mode ? index + 1 : undefined} />
                   ))}
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/5">
                   <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 neon-glow">
                      <svg className="w-10 h-10 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">{isListView ? 'Log Empty' : 'No Signals Found'}</h3>
                   <p className="text-gray-400 max-w-md mb-8">{isListView ? `Your ${currentView} list is currently empty. Start exploring to add signals.` : `Your neural search for "${searchQuery || selectedGenre}" returned 0 results in the current archive.`}</p>
                   <button onClick={() => { if(isListView) { setCurrentView('home'); setSelectedGenre(Genre.All); } else { setSelectedGenre(Genre.All); setSearchQuery(''); setFilterStudio(null); setFilterYear(null); } }} className="px-8 py-3 bg-theme-primary text-theme-bg font-bold rounded-xl hover:bg-theme-secondary hover:text-white transition-all">{isListView ? 'Explore Anime' : 'Reset Search Parameters'}</button>
                </div>
             )}
          </div>
        )}
        
        {/* --- PROFILE & SETTINGS SECTION (UNLOCKED) --- */}
        {showProfile && (
           <div className="pt-10 pb-20 max-w-4xl mx-auto space-y-8">
             <div className="flex items-center justify-between border-b border-white/10 pb-4">
                 <h2 className="text-4xl font-bold font-accent text-white">Neural Profile</h2>
                 <HomeButton />
             </div>
             
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-theme-surface/50 rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center">
                    <div className="relative group mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-theme-primary/30 shadow-[0_0_20px_rgba(0,209,255,0.2)]">
                        <img src={isEditingProfile ? selectedAvatar : userStats.avatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        {isEditingProfile && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-xs font-bold text-white uppercase">Change</span>
                        </div>
                        )}
                    </div>
                    {isEditingProfile ? (
                        <div className="w-full space-y-4">
                        <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-black/30 border border-theme-primary text-white text-center rounded px-2 py-1 outline-none" />
                        <div className="grid grid-cols-5 gap-2 mt-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                            {AVATAR_PRESETS.map((url) => (
                                <img key={url} src={url} onClick={() => setSelectedAvatar(url)} className={`w-8 h-8 rounded-full cursor-pointer border-2 object-cover ${selectedAvatar === url ? 'border-theme-primary' : 'border-transparent'}`} />
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={saveProfile} className="flex-1 bg-theme-primary text-theme-bg font-bold py-1 rounded text-xs hover:bg-theme-secondary transition-colors">SAVE</button>
                            <button onClick={() => setIsEditingProfile(false)} className="flex-1 bg-white/10 text-white font-bold py-1 rounded text-xs hover:bg-white/20">CANCEL</button>
                        </div>
                        </div>
                    ) : (
                        <>
                        <h3 className="text-xl font-bold text-white mb-1">{userStats.username}</h3>
                        <button onClick={startEditingProfile} className="text-xs text-theme-secondary font-bold uppercase tracking-wider hover:underline">Edit Profile</button>
                        </>
                    )}
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-theme-surface/50 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-2xl font-black text-white">{userStats.watchedCount}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Watching</div>
                        </div>
                        <div className="bg-theme-surface/50 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-2xl font-black text-theme-primary">{userStats.completedCount}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Completed</div>
                        </div>
                        <div className="bg-theme-surface/50 p-4 rounded-xl border border-white/5 text-center">
                        <div className="text-2xl font-black text-theme-secondary">{userStats.planningCount}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Planning</div>
                        </div>
                    </div>

                    <div className="bg-theme-surface/30 p-6 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">System Interface Theme</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.keys(THEMES) as ThemeFaction[]).map((themeName) => (
                            <button key={themeName} onClick={() => setCurrentTheme(themeName)} className={`relative h-12 rounded-lg border overflow-hidden transition-all ${currentTheme === themeName ? 'border-white ring-2 ring-theme-primary/50' : 'border-white/10 opacity-70 hover:opacity-100'}`} style={{ background: THEMES[themeName].bg }}>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] tracking-wider z-10" style={{ color: THEMES[themeName].primary }}>
                                    {themeName === 'NEON' ? 'NEON' : themeName === 'NETRUNNER' ? 'GREEN' : themeName === 'ARASAKA' ? 'RED' : 'ROYAL'}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: THEMES[themeName].secondary }}></div>
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* NEW DATA MANAGEMENT SECTION */}
                    <div className="bg-blue-500/5 p-6 rounded-xl border border-blue-500/20">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Data Management (Phone Storage)</h4>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={handleExportSave} className="flex-1 px-4 py-3 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/30 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Backup Save Data
                            </button>
                            <button onClick={handleImportClick} className="flex-1 px-4 py-3 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/30 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Restore Save Data
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">Download a file to your phone to save progress. Upload it later to restore.</p>
                    </div>

                    <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20">
                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">Danger Zone</h4>
                        <div className="flex flex-wrap gap-4">
                        <button onClick={handleFactoryReset} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-lg text-xs font-bold uppercase transition-all">Factory Reset Data</button>
                        <button onClick={handleManualFetch} className="px-4 py-2 bg-theme-primary/10 hover:bg-theme-primary text-theme-primary hover:text-black border border-theme-primary/30 rounded-lg text-xs font-bold uppercase transition-all">{isSyncing ? `Syncing (${syncProgress.current}/${syncProgress.total})` : "Sync Global Databases"}</button>
                        </div>
                    </div>
                </div>
            </div>
           </div>
        )}
      </main>
      <Footer />
      {selectedAnimeId && selectedAnime && (
        <AnimeDetailModal anime={selectedAnime} onClose={() => setSelectedAnimeId(null)} onUpdateStatus={updateAnimeStatus} onEnrich={handleEnrich} />
      )}
      <AnimeChatCompanions />
      <ScrollToTop />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-[9999]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};

export default App;