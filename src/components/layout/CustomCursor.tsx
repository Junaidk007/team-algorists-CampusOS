import React, { useState, useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Track cursor hover on interactive components
    const handleMouseOverInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== 'function') {
        setIsHovered(false);
        return;
      }
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        (target.classList && target.classList.contains('cursor-pointer'));
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOverInteractive);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOverInteractive);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Smooth lagging outer ring animation
  useEffect(() => {
    let animationFrameId: number;
    
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Dampening factor
        const ease = 0.16; 
        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease,
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        className="fixed w-1.5 h-1.5 rounded-full bg-primary pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate3d(-50%, -50%, 0) scale(${isClicking ? 0.8 : 1})`,
          zIndex: 99999,
        }}
      />

      {/* Outer Ring */}
      <div
        ref={outerRef}
        className={`fixed rounded-full border border-primary/40 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
          isHovered 
            ? 'w-10 h-10 bg-primary/5 border-primary/60 shadow-lg scale-110' 
            : 'w-6 h-6 bg-transparent'
        }`}
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
          transform: `translate3d(-50%, -50%, 0) scale(${isClicking ? 0.9 : 1})`,
          zIndex: 99998,
        }}
      />
    </>
  );
};

export default CustomCursor;
export { CustomCursor };
