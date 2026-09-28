import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  Briefcase, 
  Cpu, 
  HeartHandshake, 
  Star, 
  ShieldCheck,
  Zap,
  Target,
  Rocket,
  ChevronRight,
  IndianRupee,
  Layers,
  Code,
  Palette,
  Megaphone,
  Feather,
  Scissors,
  Check,
  BarChart3,
  Search,
  CheckCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function LandingSection({ onNavigate, onOpenAuth, theme }) {
  const [activeDashboardTab, setActiveDashboardTab] = useState('match');

  // Floating Skill Cards for Hero Section
  const floatingSkills = [
    { title: "Graphic Design", icon: Palette, color: "from-pink-500 to-rose-500", pos: "top-4 left-0 sm:-left-6" },
    { title: "Digital Marketing", icon: Megaphone, color: "from-purple-500 to-indigo-500", pos: "top-32 -right-2 sm:-right-8" },
    { title: "Content Writing", icon: Feather, color: "from-amber-500 to-orange-500", pos: "bottom-16 -left-4 sm:-left-8" },
    { title: "Tailoring", icon: Scissors, color: "from-emerald-500 to-teal-500", pos: "bottom-4 right-2 sm:right-10" },
    { title: "Web Development", icon: Code, color: "from-cyan-500 to-blue-500", pos: "-top-6 right-20 sm:right-32" }
  ];

  // Problem We Solve Highlights
  const problemHighlights = [
    { 
      title: "Learn Skills", 
      desc: "Market-relevant, bite-sized training with zero prerequisites.", 
      icon: BookOpen,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    },
    { 
      title: "Build Portfolio", 
      desc: "Verified digital showcase profiles proving real work capabilities.", 
      icon: Award,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20"
    },
    { 
      title: "Find Opportunities", 
      desc: "Direct access to freelance gigs, remote work & local orders.", 
      icon: Briefcase,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
    },
    { 
      title: "Earn Sustainable Income", 
      desc: "Independent payouts with escrow security and financial freedom.", 
      icon: IndianRupee,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
    }
  ];

  // Statistics
  const stats = [
    { label: "Skills Available", value: "50+", icon: BookOpen, color: "text-purple-600 dark:text-purple-400" },
    { label: "Income Opportunities", value: "100+", icon: Briefcase, color: "text-pink-600 dark:text-pink-400" },
    { label: "AI Career Matching", value: "AI-Powered", icon: Cpu, color: "text-amber-600 dark:text-amber-400" },
    { label: "Career Guidance", value: "24/7", icon: HeartHandshake, color: "text-emerald-600 dark:text-emerald-400" }
  ];

  // How It Works Steps
  const steps = [
    { 
      step: "01", 
      title: "Learn Skills", 
      desc: "Master high-demand digital, design, or craft tracks through short video modules.",
      icon: BookOpen 
    },
    { 
      step: "02", 
      title: "Build Portfolio", 
      desc: "Complete hands-on capstones to build a verified public showcase of work.",
      icon: Award 
    },
    { 
      step: "03", 
      title: "Get AI Recommendations", 
      desc: "Smart AI algorithm analyzes your skill level & pairs you with client needs.",
      icon: Cpu 
    },
    { 
      step: "04", 
      title: "Apply for Opportunities", 
      desc: "Submit your verified portfolio proof with 1-click to flexible remote gigs.",
      icon: Target 
    },
    { 
      step: "05", 
      title: "Start Earning", 
      desc: "Receive safe escrow payouts directly to your account & scale your income.",
      icon: IndianRupee 
    }
  ];

  // Features Section (6 Cards)
  const features = [
    {
      id: "feat-1",
      title: "AI Career Guidance",
      icon: Cpu,
      badge: "Smart AI",
      description: "Automated AI match engine evaluates learner strengths, tracks progress, and suggests personalized career pathways.",
      highlights: ["Skill Gap Analysis", "Income Recommendation", "Personalized Track"]
    },
    {
      id: "feat-2",
      title: "Skill Learning Hub",
      icon: BookOpen,
      badge: "High Demand",
      description: "Bite-sized practical modules covering Digital Marketing, Graphic Design, E-Commerce, Content Writing & Handicrafts.",
      highlights: ["Self-Paced Videos", "Practice Worksheets", "Industry Mentors"]
    },
    {
      id: "feat-3",
      title: "Portfolio Builder",
      icon: Award,
      badge: "Verified Credentials",
      description: "Convert your completed assignments into shareable, verified digital portfolios with QR capability proof.",
      highlights: ["Shareable Profile Link", "Verified Work Badges", "Project Artifact Showcase"]
    },
    {
      id: "feat-4",
      title: "Freelance Marketplace",
      icon: Briefcase,
      badge: "Escrow Protected",
      description: "Browse curated micro-gigs, remote projects, and part-time retainer opportunities tailored for women creators.",
      highlights: ["Fair Stipends", "Escrow Payout Safety", "Flexible Hours"]
    },
    {
      id: "feat-5",
      title: "Job Matching System",
      icon: Target,
      badge: "1-Click Apply",
      description: "Direct algorithmic matching connecting verified portfolio projects to small businesses seeking talent.",
      highlights: ["Client Recommendation", "Automated Ranking", "Fast Review Cycles"]
    },
    {
      id: "feat-6",
      title: "Entrepreneurship Support",
      icon: Rocket,
      badge: "Micro-Business",
      description: "Tools, templates, and guidance to transform personal skills into home-run micro-enterprises.",
      highlights: ["Business Registration", "UPI Payment Setup", "Marketing Templates"]
    }
  ];

  // Success Stories (3 Cards)
  const successStories = [
    {
      name: "Ananya Sharma",
      role: "Digital Marketing Specialist",
      location: "Jaipur, Rajasthan",
      incomeStart: "₹5,000",
      incomeCurrent: "₹20,000",
      growth: "+300% Growth",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      quote: "The AI recommendation matched me with local boutiques needing Instagram ads. I now retain 3 monthly clients from home!",
      track: "Digital Marketing",
      chartBars: [25, 40, 65, 100]
    },
    {
      name: "Sunita Patel",
      role: "Canva Brand Designer",
      location: "Ahmedabad, Gujarat",
      incomeStart: "₹0",
      incomeCurrent: "₹15,000",
      growth: "First Income Stream",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
      quote: "I started from scratch on Canva. Today I design product packaging and promotional flyers for 5 organic tea brands!",
      track: "Graphic Design",
      chartBars: [10, 30, 70, 95]
    },
    {
      name: "Priya Verma",
      role: "E-Commerce Store Manager",
      location: "Indore, Madhya Pradesh",
      incomeStart: "₹8,000",
      incomeCurrent: "₹30,000",
      growth: "+275% Growth",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      quote: "The portfolio builder showed clients my Shopify management skills. I manage online catalogs remotely for a handloom collective.",
      track: "E-Commerce",
      chartBars: [30, 50, 80, 100]
    }
  ];

  return (
    <div className="space-y-24 pb-20 animate-fade-in overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Ambient Animated Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 dark:bg-purple-600/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/20 dark:bg-pink-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>

        {/* Hero Badge below Navbar */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-amber-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-pink-500 animate-spin-slow" />
            <span>AI-Powered Skill-to-Income Recommendation Platform</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left relative">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Turn Skills Into <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                Sustainable Income
              </span>
            </h1>

            {/* Short Trust-Building Statement */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Bridging the gap between learning, opportunities, and financial independence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="btn-gradient-award text-sm py-3.5 px-8 shadow-xl cursor-pointer flex items-center gap-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('gigs')}
                className="btn-outline-award text-sm py-3.5 px-8 cursor-pointer"
              >
                Explore Opportunities
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-slate-200 dark:border-purple-500/20 grid grid-cols-3 gap-3 text-slate-700 dark:text-slate-300 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Escrow Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>Verified Badges</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span>AI Matching</span>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Skill Badges + Realistic AI Recommendation Dashboard Preview */}
          <div className="lg:col-span-6 relative">
            
            {/* Subtle Floating Glassmorphism Skill Cards */}
            <div className="hidden sm:block">
              {floatingSkills.map((sk, idx) => {
                const IconComp = sk.icon;
                return (
                  <div 
                    key={idx}
                    className={`absolute ${sk.pos} z-20 glass-card px-3.5 py-2 rounded-2xl border border-purple-500/30 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white animate-float`}
                    style={{ animationDelay: `${idx * 0.8}s` }}
                  >
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${sk.color} text-white flex items-center justify-center`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span>{sk.title}</span>
                  </div>
                );
              })}
            </div>

            {/* AI Recommendation Dashboard Preview */}
            <div className="bg-white/90 dark:bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl space-y-5 backdrop-blur-xl">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-purple-500/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">AI Recommendation Engine</h3>
                    <p className="text-[10px] text-purple-600 dark:text-purple-300 font-medium">Real-Time Career & Skill Optimizer</p>
                  </div>
                </div>
                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Live Match
                </span>
              </div>

              {/* Interactive Preview Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('match')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeDashboardTab === 'match'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Skill Match
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('opportunities')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeDashboardTab === 'opportunities'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Income Potential
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab('progress')}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeDashboardTab === 'progress'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Learning Path
                </button>
              </div>

              {/* Dashboard Content Container */}
              <div className="bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-5 border border-slate-200 dark:border-purple-500/20 space-y-4">
                
                {/* 1. Recommended Skill & AI Match Score */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">Recommended Skill</span>
                    <span className="text-base font-extrabold text-purple-600 dark:text-purple-300 flex items-center gap-1.5 mt-0.5">
                      Digital Marketing
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">AI Match Score</span>
                    <span className="text-xl font-extrabold text-pink-600 dark:text-pink-400">92%</span>
                  </div>
                </div>

                {/* 2. Available Opportunities & Portfolio Strength */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Available Gigs</span>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-amber-500" /> 24 Active
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Portfolio Strength</span>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                      <Award className="w-4 h-4 text-purple-500" /> 85% Verified
                    </p>
                  </div>
                </div>

                {/* 3. Estimated Monthly Income Banner */}
                <div className="bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 uppercase font-bold block">Estimated Monthly Income</span>
                    <span className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">₹15,000 - ₹35,000</span>
                  </div>
                  <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                    High Growth
                  </span>
                </div>

                {/* 4. Learning Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">Learning Progress</span>
                    <span className="text-purple-600 dark:text-purple-400">78%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill w-[78%]"></div>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Action */}
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="w-full btn-gradient-award justify-center text-xs py-3 cursor-pointer"
              >
                Start AI Skill Path
              </button>

            </div>
          </div>

        </div>

      </section>

      {/* 2. PROBLEM WE SOLVE SECTION (Immediately below Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-8 sm:p-12 shadow-xl backdrop-blur-md space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-rose-500 uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
              Addressing The Gap
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Problem We Solve
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              "Millions of women possess valuable skills but lack access to learning resources, portfolio visibility, job opportunities, freelancing projects, and career guidance."
            </p>
          </div>

          {/* 4 Core Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {problemHighlights.map((ph, idx) => {
              const IconComponent = ph.icon;
              return (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 hover:border-purple-500/50 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${ph.color} border`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {ph.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ph.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. IMPROVED STATISTICS SECTION */}
      <section className="bg-slate-100/90 dark:bg-slate-900/90 border-y border-slate-200 dark:border-purple-500/20 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <div key={idx} className="space-y-2 p-4 rounded-2xl bg-white/60 dark:bg-slate-950/60 border border-slate-200 dark:border-purple-500/20 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <p className={`text-3xl sm:text-4xl font-extrabold ${s.color} tracking-tight`}>{s.value}</p>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            Step-by-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            A seamless horizontal journey taking women from initial learning to regular payouts.
          </p>
        </div>

        {/* Modern Horizontal Workflow */}
        <div className="grid md:grid-cols-5 gap-4 relative">
          {steps.map((st, idx) => {
            const IconComp = st.icon;
            return (
              <div 
                key={idx} 
                className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-purple-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden backdrop-blur-md shadow-md card-hover-award flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Step {st.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-purple-400">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 5. FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-widest">Platform Modules</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Features Designed for Growth
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Comprehensive tools enabling women to learn, showcase, apply, and earn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.id}
                className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-7 card-hover-award space-y-5 flex flex-col justify-between shadow-lg backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{feat.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-purple-500/15">
                    {feat.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('learn')}
                  className="w-full text-xs font-bold text-purple-600 dark:text-purple-300 hover:text-pink-600 dark:hover:text-white flex items-center justify-between pt-2 group cursor-pointer"
                >
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SUCCESS STORIES SECTION */}
      <section id="success-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-purple-500/20 pb-4">
          <div>
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Real Results</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Success Stories</h2>
          </div>
          <button 
            type="button"
            onClick={() => onNavigate('portfolio')} 
            className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Verified Portfolios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, idx) => (
            <div key={idx} className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-7 space-y-5 flex flex-col justify-between card-hover-award shadow-lg backdrop-blur-md">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-md" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{story.name}</h4>
                    <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">{story.role}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{story.location}</p>
                  </div>
                </div>

                {/* Income Growth Badge */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Income Growth</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {story.incomeStart} → {story.incomeCurrent}
                    </span>
                  </div>
                  <span className="bg-emerald-500 text-white font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                    {story.growth}
                  </span>
                </div>

                {/* Mini Trajectory Progress Bar Chart */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Income Growth Trajectory</span>
                  <div className="flex items-end gap-1.5 h-10 pt-1">
                    {story.chartBars.map((val, bIdx) => (
                      <div key={bIdx} className="flex-1 bg-purple-500/20 rounded-t-xs overflow-hidden h-full flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-xs transition-all duration-500" 
                          style={{ height: `${val}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-purple-500/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Track: {story.track}</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">✓ Verified Learner</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-pink-950 border border-purple-500/40 rounded-3xl p-10 lg:p-16 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
              Ready to Start Earning?
            </h2>
            <p className="text-base text-slate-200 font-medium">
              "Empowering Women. Creating Opportunities. Building Futures."
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="btn-gradient-award text-base py-3.5 px-8 cursor-pointer flex items-center gap-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                className="btn-outline-award text-base py-3.5 px-8 cursor-pointer text-white border-white/40 hover:bg-white/10"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
