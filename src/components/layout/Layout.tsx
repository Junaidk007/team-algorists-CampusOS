import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import UtilityBar from './UtilityBar';
import CustomCursor from './CustomCursor';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('campusos-sidebar-collapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Sync collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('campusos-sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  return (
    <div className="dark min-h-screen bg-[#050506] text-foreground flex relative isolate overflow-hidden transition-colors duration-300">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,180,110,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,110,.22) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="fixed -right-40 top-24 z-0 h-[460px] w-[460px] rounded-full bg-orange-500/20 blur-[120px] pointer-events-none animate-float-slow" />
      {/* Awwwards Custom interactive cursor */}
      <CustomCursor />

      {/* Dynamic theme-aware Awwwards animated backdrop mesh & noise */}
      <AnimatedBackground />

      {/* Awwwards top floating utility bar */}
      <UtilityBar />

      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Panel Viewport */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 pt-[60px] ${
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}
      >
        {/* Top Navbar sitting below UtilityBar */}
        <Navbar setIsMobileOpen={setIsMobileOpen} />

        {/* Viewport Content */}
        <main className="flex-1 w-full mx-auto px-6 py-8 relative z-10 flex flex-col justify-between">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Creative agency luxury footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
export { Layout };
