import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Cpu, Bell } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/20 pt-16 pb-8 mt-20 relative z-10 transition-colors duration-1000 bg-card/20 backdrop-blur-sm rounded-xl">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & Slogan Column */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Campus<span className="text-muted-foreground">OS</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            The next-generation autonomous university operating system. Orchestrating campus scheduling, conflict management, and resource allocation through artificial intelligence models.
          </p>
        </div>

        {/* Console Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            Console Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                Dashboard Overview
              </Link>
            </li>
            <li>
              <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                Facility Catalog
              </Link>
            </li>
            <li>
              <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors">
                Active Events Log
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="text-muted-foreground hover:text-primary transition-colors">
                Reservations Ledger
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials & Actions */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            Connect & Documents
          </h4>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
            <Link
              to="/notifications"
              className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent border border-border/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Bell className="w-4 h-4" />
            </Link>
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase bg-secondary text-foreground hover:bg-accent border border-border/40 px-3 py-1.5 rounded-full cursor-pointer transition-all shadow-sm"
          >
            <ArrowUp className="w-3 h-3" />
            <span>Back to Top</span>
          </button>
        </div>

      </div>

      {/* Footer copyright section */}
      <div className="max-w-7xl mx-auto px-6 border-t border-border/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-medium">
        <p>&copy; {new Date().getFullYear()} CampusOS Platform. Engineered with React & Tailwind CSS.</p>
        <div className="flex gap-4">
          <span className="hover:text-foreground cursor-pointer transition-colors">Security Audit</span>
          <span>&middot;</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">API Endpoint Logs</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };
