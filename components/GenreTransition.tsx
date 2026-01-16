import React, { useEffect, useState } from 'react';
import { Genre } from '../types';
import { GENRE_PROMPTS } from '../constants';
import { generateGenreImage } from '../services/geminiService';

interface GenreTransitionProps {
  genre: Genre;
  onComplete: () => void;
}

type AIStyle = 'GEMINI' | 'MIDJOURNEY' | 'STABLE_DIFF';

const STYLE_MODIFIERS: Record<AIStyle, string> = {
  GEMINI: ', anime style, cinematic lighting, neon atmosphere',
  MIDJOURNEY: ', hyper-realistic anime, 8k, intricate details, volumetric lighting, unreal engine 5 render, photorealistic, v 6.0 style',
  STABLE_DIFF: ', masterpiece, best quality, ultra-detailed, illustration, dynamic angle, vibrant colors, artstation trending, studio ghibli style'
};

const GenreTransition: React.FC<GenreTransitionProps> = ({ genre, onComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState('Initializing Neural Network...');
  const [aiStyle, setAiStyle] = useState<AIStyle>(() => 
    (localStorage.getItem('neon_anime_ai_style') as AIStyle) || 'GEMINI'
  );

  useEffect(() => {
    let isMounted = true;
    const MIN_LOAD_TIME = 2500; // Minimum time to show the transition (ms)
    const startTime = Date.now();
    
    const generate = async () => {
      // 1. Get Base Prompt
      const basePrompt = GENRE_PROMPTS[genre] || `Anime style representation of ${genre}`;
      
      // 2. Apply Current Style Modifier
      const fullPrompt = `${basePrompt}${STYLE_MODIFIERS[aiStyle]}`;
      
      setStatus(`Generating ${genre} Visualization [${aiStyle} Mode]...`);
      
      try {
        // 3. Call API
        const url = await generateGenreImage(genre, fullPrompt);
        
        if (!isMounted) return;

        if (url) {
            setImage(url);
            setStatus('Rendering Immersive Environment...');
            setTimeout(() => {
                if (isMounted) onComplete();
            }, 2000); 
        } else {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
            setStatus('Optimizing Experience...');
            setTimeout(() => {
                if (isMounted) onComplete();
            }, remaining);
        }
      } catch (e) {
        if (!isMounted) return;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
        setTimeout(() => {
             if (isMounted) onComplete();
        }, remaining);
      }
    };

    generate();

    return () => { isMounted = false; };
  }, [genre, onComplete]); // aiStyle is deliberately excluded to prevent regen on toggle

  const handleStyleChange = (style: AIStyle) => {
    setAiStyle(style);
    localStorage.setItem('neon_anime_ai_style', style);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-theme-bg">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
             {image ? (
                 <div 
                    className="absolute inset-0 bg-cover bg-center animate-in fade-in zoom-in-110 duration-[2s]"
                    style={{ backgroundImage: `url(${image})` }}
                 >
                    <div className="absolute inset-0 bg-theme-bg/60 backdrop-blur-sm"></div>
                 </div>
             ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-theme-surface via-theme-bg to-black">
                    {/* Fallback Abstract Background */}
                    <div className="absolute inset-0 opacity-20" 
                        style={{ 
                            backgroundImage: 'radial-gradient(circle at 50% 50%, var(--color-primary) 0%, transparent 50%)',
                            animation: 'pulse 4s infinite ease-in-out'
                        }} 
                    />
                </div>
             )}
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-2xl px-8 text-center mb-20">
            
            {/* Hexagon Spinner */}
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-2 border-theme-primary/20 rounded-full animate-ping"></div>
                <div className="absolute inset-2 border-2 border-t-theme-primary border-r-theme-secondary border-b-theme-primary border-l-theme-secondary rounded-full animate-spin"></div>
                {image && (
                   <div className="absolute inset-4 rounded-full overflow-hidden border-2 border-white/20 animate-in fade-in zoom-in duration-500">
                      <img src={image} className="w-full h-full object-cover" alt="Generated" />
                   </div>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl sm:text-6xl font-black font-accent text-transparent bg-clip-text bg-gradient-to-r from-theme-primary to-theme-secondary uppercase tracking-widest neon-text">
                    {genre}
                </h2>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-theme-primary font-mono text-sm tracking-[0.2em] animate-pulse">
                        {status}
                    </p>
                    <div className="h-1 w-64 bg-theme-surface rounded-full overflow-hidden">
                        <div className="h-full bg-theme-secondary animate-[loading_2s_ease-in-out_infinite] w-full origin-left transform scale-x-0"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* AI Style Selection Panel */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 delay-500 z-20">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 max-w-lg w-full mx-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                        <svg className="w-3 h-3 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        Neural Style Configuration
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    </div>
                </div>
                
                <p className="font-mono text-[10px] text-theme-primary mb-4 opacity-80 leading-relaxed">
                    {`> Suggestion: Optimize prompt weights for target aesthetic.`}
                    <br/>
                    {`> Active Matrix: `} <span className="text-white font-bold bg-white/10 px-1 rounded">{aiStyle}</span>
                </p>

                <div className="grid grid-cols-3 gap-2">
                    {(['GEMINI', 'MIDJOURNEY', 'STABLE_DIFF'] as AIStyle[]).map((style) => (
                        <button
                            key={style}
                            onClick={() => handleStyleChange(style)}
                            className={`px-3 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all border flex flex-col items-center gap-1 ${
                                aiStyle === style 
                                ? 'bg-theme-primary/20 border-theme-primary text-theme-primary shadow-[0_0_15px_var(--color-primary)]' 
                                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-200'
                            }`}
                        >
                            <span>{style === 'STABLE_DIFF' ? 'Stable Diff' : style}</span>
                            <span className={`h-0.5 w-full rounded-full transition-all ${aiStyle === style ? 'bg-theme-primary' : 'bg-transparent'}`}></span>
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <style>{`
            @keyframes loading {
                0% { transform: scaleX(0); transform-origin: left; }
                50% { transform: scaleX(1); transform-origin: left; }
                51% { transform: scaleX(1); transform-origin: right; }
                100% { transform: scaleX(0); transform-origin: right; }
            }
            @keyframes pulse {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(1.2); }
            }
        `}</style>
    </div>
  );
};

export default GenreTransition;