import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import {
  Cpu,
  BookOpen,
  Calendar,
  Bell,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  Activity,
  Sparkles,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  const featureItems = [
    {
      title: 'Resource Management',
      desc: 'Verify live availability charts for auditoriums, computing centers, and labs across departments.',
      icon: BookOpen,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Double-Booking Protection',
      desc: 'Conflict checking algorithms run automatically prior to submission, flagging schedule clashes.',
      icon: Calendar,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Gemini AI Advisory',
      desc: 'When conflicts occur, dynamically parse and select alternative slots or venue recommendations.',
      icon: Sparkles,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Real-Time Workspace Sockets',
      desc: 'In-app toasts and notification counters sync instantly as approval status reviews arrive.',
      icon: Bell,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    },
  ];

  return (
    <div className="dark min-h-screen bg-[#050506] text-foreground flex flex-col relative isolate overflow-hidden transition-colors duration-1000 selection:bg-orange-400/30">
      
      {/* Premium animated gradient mesh background */}
      <AnimatedBackground />

      {/* Global Header */}
      <header className="sticky top-3 z-50 mx-4 rounded-2xl border border-white/10 bg-card/75 px-6 py-4 shadow-2xl shadow-black/10 backdrop-blur-xl flex items-center justify-between transition-colors duration-1000">
        <div className="flex items-center gap-2">
      <div className="pointer-events-none absolute inset-0 -z-40 bg-[radial-gradient(circle_at_88%_38%,rgba(249,115,22,0.22),transparent_18%),radial-gradient(circle_at_70%_78%,rgba(234,88,12,0.14),transparent_30%),linear-gradient(135deg,#050506_5%,#0c0908_55%,#050506_100%)]" />
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">Campus<span className="text-muted-foreground">OS</span></span>
            <span className="ml-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              System Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-3 text-orange-500 hover:bg-orange-400/20 hover:text-orange-400"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <><Sun className="w-4 h-4" /><span className="hidden sm:inline">Day</span></> : <><Moon className="w-4 h-4" /><span className="hidden sm:inline">Night</span></>}
          </Button>

          <Link to="/login">
            <Button variant="outline" size="sm" className="cursor-pointer rounded-full border-orange-300/30 bg-white/5 px-4 text-xs text-white hover:border-orange-300/60 hover:bg-white/10 hover:text-orange-200">
              Sign In
            </Button>
          </Link>
          
          <Link to="/register">
            <Button variant="primary" size="sm" className="cursor-pointer rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 text-xs text-white shadow-lg shadow-orange-500/25 hover:from-orange-400 hover:to-rose-400">
              Register
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 text-center max-w-6xl mx-auto z-10">
        
        {/* Animated badge info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/80 text-foreground border border-border/40 mb-6 shadow-sm cursor-default"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span>Intelligent University Orchestration Platform</span>
        </motion.div>

        {/* Big Typography Header */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl font-black tracking-[-0.065em] max-w-5xl leading-[.95]"
        >
          The Operating System for{' '}
          <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 bg-clip-text text-transparent">
            Autonomous Campuses
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          Coordinate venue bookings, automate conflict checks, and query Gemini advisory models to resolve scheduling overlaps, complete with role-aware metrics dashboards.
        </motion.p>

        {/* Action Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <Link to="/login">
            <Button variant="primary" size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer font-bold">
              Initialize Console <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" size="lg" className="cursor-pointer">
              Explore Capabilities
            </Button>
          </a>
        </motion.div>

        {/* Live Metrics Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:border-emerald-400/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 bg-card/65 backdrop-blur-xl group overflow-hidden border border-white/10">
              <CardContent className="p-6 flex items-start gap-4 relative">
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-violet-500/2 blur-xl group-hover:bg-violet-500/5 transition-all" />
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 border border-violet-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Conflict-Free Bookings</p>
                  <h4 className="text-2xl font-extrabold mt-1">98.4%</h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">✓ Automated overlap validation</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:border-orange-400/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 bg-card/65 backdrop-blur-xl group overflow-hidden border border-white/10">
              <CardContent className="p-6 flex items-start gap-4 relative">
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-indigo-500/2 blur-xl group-hover:bg-indigo-500/5 transition-all" />
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Gemini Recommendations</p>
                  <h4 className="text-2xl font-extrabold mt-1">&lt; 150ms</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 font-medium">Latency in overlap scenarios</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:border-violet-400/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 bg-card/65 backdrop-blur-xl group overflow-hidden border border-white/10">
              <CardContent className="p-6 flex items-start gap-4 relative">
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-emerald-500/2 blur-xl group-hover:bg-emerald-500/5 transition-all" />
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Console Authentication</p>
                  <h4 className="text-2xl font-extrabold mt-1">Role-Based JWT</h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">✓ Admin & coordinator keys</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Feature Sections */}
        <section id="features" className="mt-24 w-full pt-12 border-t border-border/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Integrations Tailored for Campus Operations
          </h2>
          <p className="text-muted-foreground text-xs max-w-xl mx-auto mb-12">
            A unified suite of modules giving university administrators, faculty leads, and student clubs immediate access to conflict-free allocations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featureItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card
                  key={idx}
                  className="flex flex-col h-full hover:translate-y-[-6px] hover:border-orange-400/30 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300 bg-card/65 backdrop-blur-xl group overflow-hidden"
                >
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-left tracking-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 text-left leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-border/10 py-8 px-6 text-center text-xs text-muted-foreground bg-background/50 z-10 transition-colors duration-1000">
        <p>&copy; {new Date().getFullYear()} CampusOS Platform (Autonomous University Operating System). All rights reserved.</p>
        <div className="mt-2 flex gap-4 justify-center">
          <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
          <span>&middot;</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
          <span>&middot;</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">Console Logs</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
export { LandingPage };
