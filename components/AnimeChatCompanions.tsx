import React, { useState, useRef, useEffect } from 'react';
import { chatWithCharacter } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Character {
  id: string;
  name: string;
  anime: string;
  avatar: string;
  systemPrompt: string;
  greeting: string;
  themeColor: string;
}

const CHARACTERS: Character[] = [
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    anime: 'One Piece',
    avatar: 'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
    themeColor: '#FF4500', // Orange-Red
    greeting: "Yo! I'm gonna be the King of the Pirates! You got any meat?",
    systemPrompt: "You are Monkey D. Luffy. You are energetic, carefree, and simple-minded. You love meat and adventure. You speak informally. Your goal is to be Pirate King. Refer to the user as 'nakama' (friend). Keep responses short and enthusiastic."
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    anime: 'Naruto',
    avatar: 'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
    themeColor: '#FF8C00', // Orange
    greeting: "Hey! I'm Naruto Uzumaki, and I'm gonna be the best Hokage ever! Believe it!",
    systemPrompt: "You are Naruto Uzumaki. You are determined, loud, and value friendship above all. Use the catchphrase 'Dattebayo' or 'Believe it!'. You want to become Hokage. You are optimistic and never give up."
  },
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    anime: 'Jujutsu Kaisen',
    avatar: 'https://cdn.myanimelist.net/images/characters/16/427603.jpg',
    themeColor: '#00BFFF', // Deep Sky Blue
    greeting: "Yo. You look lost. Lucky for you, I'm the strongest.",
    systemPrompt: "You are Satoru Gojo. You are extremely cocky, playful, and relaxed because you are the strongest sorcerer. You often tease others. You say 'Yowaimo' (You're weak) sometimes. You are intelligent but act goofy."
  },
  {
    id: 'makima',
    name: 'Makima',
    anime: 'Chainsaw Man',
    avatar: 'https://cdn.myanimelist.net/images/characters/2/439665.jpg',
    themeColor: '#FF69B4', // Hot Pink
    greeting: "Hello. I assume you're here to be useful?",
    systemPrompt: "You are Makima. You are calm, polite, soft-spoken, but incredibly manipulative and controlling. You view others as pets or tools. You never raise your voice. You are mysterious and slightly unsettling."
  },
  {
    id: 'l',
    name: 'L Lawliet',
    anime: 'Death Note',
    avatar: 'https://cdn.myanimelist.net/images/characters/10/249647.jpg',
    themeColor: '#A9A9A9', // Dark Gray
    greeting: "I am L. There is a 97% chance you need my help with a case.",
    systemPrompt: "You are L from Death Note. You are highly analytical, logical, and socially awkward. You speak formally and often mention percentages or probabilities. You love sweets. You are suspicious of everyone."
  }
];

const AnimeChatCompanions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !selectedChar) {
      // Don't auto select, let them choose
    }
  };

  const selectCharacter = (char: Character) => {
    setSelectedChar(char);
    setMessages([{ role: 'model', text: char.greeting }]);
  };

  const handleBack = () => {
    setSelectedChar(null);
    setMessages([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedChar || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Filter out the initial greeting from history sent to API to avoid format issues if needed, 
      // but usually it's fine. We send relevant history.
      const conversationHistory = messages.map(m => ({ role: m.role, text: m.text }));
      
      const response = await chatWithCharacter(selectedChar.systemPrompt, conversationHistory, userMsg);
      
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Signal lost... (Error)" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end pointer-events-none">
      
      {/* CHAT WINDOW */}
      <div 
        className={`pointer-events-auto w-[90vw] sm:w-[350px] h-[500px] bg-theme-bg/90 backdrop-blur-xl border border-theme-primary/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 origin-bottom-right transform ${isOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 mb-0'}`}
      >
        {/* HEADER */}
        <div className="h-16 bg-theme-surface/80 border-b border-white/10 flex items-center px-4 justify-between relative overflow-hidden">
          {selectedChar ? (
             <>
               <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors z-10 text-gray-400 hover:text-white">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
               </button>
               <div className="flex items-center gap-3 z-10">
                 <div className="relative">
                    <img src={selectedChar.avatar} className="w-10 h-10 rounded-full border border-white/20 object-cover" alt="Avatar" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black"></div>
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{selectedChar.name}</h3>
                    <p className="text-[10px] text-theme-primary uppercase tracking-wider font-mono">Online</p>
                 </div>
               </div>
               <div className="w-8"></div> {/* Spacer for alignment */}
               
               {/* Ambient Glow based on char theme */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 opacity-50 blur-xl pointer-events-none" style={{ backgroundColor: selectedChar.themeColor, mixBlendMode: 'overlay' }}></div>
             </>
          ) : (
             <div className="w-full flex items-center justify-between z-10">
                <h3 className="text-white font-bold text-lg font-accent tracking-wide pl-2">Neural Link</h3>
                <span className="text-[10px] bg-theme-primary/10 text-theme-primary px-2 py-1 rounded border border-theme-primary/20">SELECT PERSONA</span>
             </div>
          )}
        </div>

        {/* BODY */}
        <div className="h-[370px] bg-black/20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 p-4 relative">
            {!selectedChar ? (
                // CHARACTER SELECTION GRID
                <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {CHARACTERS.map(char => (
                        <div 
                            key={char.id}
                            onClick={() => selectCharacter(char)}
                            className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-theme-primary/30 cursor-pointer transition-all group"
                        >
                            <img src={char.avatar} className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform" alt={char.name} />
                            <div>
                                <h4 className="text-white font-bold text-sm group-hover:text-theme-primary transition-colors">{char.name}</h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{char.anime}</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-600 ml-auto group-hover:text-theme-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    ))}
                </div>
            ) : (
                // CHAT HISTORY
                <div className="space-y-4 pb-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <img src={selectedChar.avatar} className="w-6 h-6 rounded-full mr-2 mt-1 object-cover" alt="Bot" />
                            )}
                            <div 
                                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm font-medium leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-theme-primary/20 text-white border border-theme-primary/30 rounded-tr-none' 
                                    : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <img src={selectedChar.avatar} className="w-6 h-6 rounded-full mr-2 mt-1 object-cover" alt="Bot" />
                             <div className="bg-white/5 rounded-2xl px-4 py-3 rounded-tl-none flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>

        {/* FOOTER INPUT */}
        {selectedChar && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-theme-surface border-t border-white/10 px-4 flex items-center gap-2">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Message ${selectedChar.name}...`}
                    className="flex-1 bg-theme-bg border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:border-theme-primary outline-none transition-colors"
                />
                <button 
                    onClick={handleSend}
                    disabled={!inputText.trim() || isLoading}
                    className="p-2 bg-theme-primary text-theme-bg rounded-full hover:bg-theme-secondary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        )}
      </div>

      {/* FAB TOGGLE BUTTON */}
      <button 
        onClick={toggleChat}
        className="pointer-events-auto group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-theme-bg border-2 border-theme-primary flex items-center justify-center shadow-[0_0_20px_var(--color-primary)] hover:shadow-[0_0_30px_var(--color-secondary)] hover:border-theme-secondary transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-theme-primary/20 animate-ping group-hover:bg-theme-secondary/20"></span>
        {isOpen ? (
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-theme-primary group-hover:text-theme-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-theme-primary group-hover:text-theme-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
        
        {/* Notification Badge (Always active for aesthetic) */}
        {!isOpen && <span className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-theme-secondary rounded-full border-2 border-theme-bg"></span>}
      </button>
    </div>
  );
};

export default AnimeChatCompanions;