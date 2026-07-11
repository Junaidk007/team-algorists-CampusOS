import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none transition-colors duration-1000 bg-background">
      
      {/* Aurora Ambient Glow Blobs */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30 blur-[130px] md:blur-[180px] transition-opacity duration-1000">
        
        {/* Blob 1 */}
        <div
          className={`absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] min-w-[300px] min-h-[300px] rounded-full transition-all duration-1000 animate-float-slow ${
            theme === 'dark'
              ? 'bg-orange-500/20 dark:bg-orange-500/15'
              : 'bg-orange-400/15'
          }`}
          style={{ animationDelay: '0s' }}
        />

        {/* Blob 2 */}
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] min-w-[350px] min-h-[350px] rounded-full transition-all duration-1000 animate-float-slow ${
            theme === 'dark'
              ? 'bg-rose-500/15 dark:bg-rose-500/10'
              : 'bg-rose-400/10'
          }`}
          style={{ animationDelay: '-5s' }}
        />

        {/* Blob 3 */}
        <div
          className={`absolute top-[40%] right-[20%] w-[25vw] h-[25vw] min-w-[200px] min-h-[200px] rounded-full transition-all duration-1000 animate-float-slow ${
            theme === 'dark'
              ? 'bg-violet-600/12'
              : 'bg-violet-300/10'
          }`}
          style={{ animationDelay: '-10s' }}
        />
      </div>
        <div className="absolute left-[42%] top-[12%] h-[26vw] w-[26vw] min-h-[240px] min-w-[240px] rounded-full border border-orange-300/20 bg-gradient-to-br from-orange-400/18 via-orange-300/5 to-transparent shadow-[0_0_90px_rgba(251,146,60,0.18)] backdrop-blur-3xl animate-float-slow dark:border-orange-300/10 dark:from-orange-500/14" style={{ animationDelay: '-13s' }} />

      {/* Modern High-End Noise Overlay */}
      <div className="absolute inset-0 w-full h-full opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay pointer-events-none bg-noise-pattern" />

      {/* Grid Mesh lines */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.04] pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `linear-gradient(to right, var(--muted-foreground) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--muted-foreground) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Custom styles inject for keyframe animations if needed */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(50px, -55px, 0) scale(1.1);
          }
          66% {
            transform: translate3d(-45px, 32px, 0) scale(0.92);
          }
        }
        .animate-float-slow {
          animation: floatSlow 20s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
export { AnimatedBackground };
