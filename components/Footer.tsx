
import React from 'react';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#02050a]">
      {/* Decorative Top Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-theme-primary/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Brand & Author */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-black font-accent text-white tracking-widest uppercase">
              My Anime <span className="text-theme-primary neon-text">by Miraz</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Architected & Designed by <span className="text-white font-bold">Yasir Arafath</span>.
            </p>
            <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
              © {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://www.facebook.com/miraz.yasir.arafath" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 rounded-xl transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span className="font-bold text-sm">Contact on Facebook</span>
            </a>
            
            <a 
              href="mailto:mirazyasirarafath@gmail.com"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-xl transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="font-bold text-sm">Send Email</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
