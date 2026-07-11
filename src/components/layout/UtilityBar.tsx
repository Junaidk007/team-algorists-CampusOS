import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Download, Sun, Moon } from 'lucide-react';

const UtilityBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Page title mapping
  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith('/dashboard')) return 'CONSOLE HUB';
    if (pathname.startsWith('/resources')) return 'FACILITY INVENTORY';
    if (pathname.startsWith('/events')) return 'EVENTS DIRECTORY';
    if (pathname.startsWith('/bookings')) return 'RESERVATIONS LEDGER';
    if (pathname.startsWith('/notifications')) return 'NOTIFICATIONS';
    return 'CAMPUSOS CONTROLLER';
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div
      className={`fixed top-3 left-4 right-4 z-50 h-[45px] transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'
      }`}
    >
      <div className="w-full h-full bg-card/60 backdrop-blur-md border border-border/40 rounded-full px-5 flex items-center justify-between shadow-lg">
        
        {/* Left: Back Button with slide hover animation */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-muted-foreground hover:text-primary transition-all duration-300 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="opacity-80 group-hover:opacity-100 transition-opacity">Back</span>
        </button>

        {/* Center: Dynamic page title */}
        <div className="absolute left-1/2 -translate-x-1/2 text-[10px] font-extrabold tracking-[0.2em] uppercase text-foreground/80 font-mono">
          {getPageTitle(location.pathname)}
        </div>

        {/* Right: Theme Toggle, Socials, Resume */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Divider */}
          <span className="h-3 w-[1px] bg-border/40" />

          {/* Github placeholder */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            title="GitHub"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
          </a>

          {/* Linkedin placeholder */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            title="LinkedIn"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
          </a>

          {/* Resume Download */}
          <button
            onClick={() => alert('Downloading CampusOS Documentation PDF...')}
            className="flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-primary text-primary-foreground hover:bg-opacity-95 px-2.5 py-1 rounded-full shadow-sm cursor-pointer transition-all"
            title="Download Documentation"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Docs</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default UtilityBar;
export { UtilityBar };
