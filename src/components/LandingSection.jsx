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
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export default function LandingSection({ onNavigate, onOpenAuth, theme }) {

  // Floating Skill Cards for Hero Section
  const floatingSkills = [
    { title: "Graphic Design", icon: Palette, color: "from-pink-500 to-rose-500", pos: "top-4 left-0 sm:-left-6" },
    { title: "Digital Marketing", icon: Megaphone, color: "from-purple-500 to-indigo-500", pos: "top-32 -right-2 sm:-right-8" },
    { title: "Content Writing", icon: Feather, color: "from-amber-500 to-orange-500", pos: "bottom-16 -left-4 sm:-left-8" },
    { title: "Tailoring", icon: Scissors, color: "from-emerald-500 to-teal-500", pos: "bottom-4 right-2 sm:right-10" },
    { title: "Web Development", icon: Code, color: "from-cyan-500 to-blue-500", pos: "-top-6 right-20 sm:right-32" }
  ];

  // Honest Pilot Stats Strip Values
  const stats = [
    { value: "100+", label: "Pilot Learners", sublabel: "(Launching 2026)", icon: Users, color: "text-purple-600 dark:text-purple-400" },
    { value: "4", label: "Skill Tracks", sublabel: "Curated Modules", icon: BookOpen, color: "text-pink-600 dark:text-pink-400" },
    { value: "8+", label: "Partner Opportunities", sublabel: "Gigs & Internships", icon: Briefcase, color: "text-amber-600 dark:text-amber-400" },
    { value: "Free", label: "To Start", sublabel: "Zero Hidden Fees", icon: ShieldCheck, color: "text-emerald-600 dark:text-emerald-400" }
  ];

  // How It Works (3 Core Cards)
  const howItWorksThreeCards = [
    {
      step: "01",
      title: "1. Learn Market Skills",
      desc: "Pick a skill track and complete short, practical video lessons at your own pace.",
      icon: BookOpen,
      badge: "Self-Paced Tracks",
      color: "from-purple-600 to-indigo-600",
      targetTab: "learn",
      ctaText: "Go to Learning Hub"
    },
    {
      step: "02",
      title: "2. Build & Showcase Portfolio",
      desc: "Create real portfolio projects to showcase your verified work to potential clients.",
      icon: Award,
      badge: "Verified Proof",
      color: "from-pink-600 to-rose-600",
      targetTab: "portfolio",
      ctaText: "Go to Skill Showcase"
    },
    {
      step: "03",
      title: "3. Earn from Real Work",
      desc: "Apply to flexible gigs, freelance projects, and remote client opportunities.",
      icon: IndianRupee,
      badge: "Direct Payouts",
      color: "from-amber-500 to-emerald-500",
      targetTab: "gigs",
      ctaText: "Go to Opportunity Board"
    }
  ];

  // Problem We Solve Highlights
  const problemHighlights = [
    { 
      title: "Learn Skills", 
      desc: "Market-relevant, bite-sized training with zero prerequisites.", 
      icon: BookOpen,
      color: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30"
    },
    { 
      title: "Build Portfolio", 
      desc: "Verified digital showcase profiles proving real work capabilities.", 
      icon: Award,
      color: "bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-500/30"
    },
    { 
      title: "Find Opportunities", 
      desc: "Direct access to freelance gigs, remote work & local orders.", 
      icon: Briefcase,
      color: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/30"
    },
    { 
      title: "Earn Sustainable Income", 
      desc: "Independent payouts with escrow security and financial freedom.", 
      icon: IndianRupee,
      color: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30"
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
      name: "Aarti Sharma",
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
    <div className="space-y-16 sm:space-y-20 pb-20 animate-fade-in overflow-x-hidden text-slate-900 dark:text-slate-100">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Ambient Animated Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/15 dark:bg-purple-600/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/15 dark:bg-pink-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>




        <div
  className="absolute inset-0 pointer-events-none opacity-20"
  style={{
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(168,85,247,0.7) 1px, transparent 0)',
    backgroundSize: '28px 28px',
    maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)'
  }}
></div>



        {/* Hero Badge below Navbar */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-200 text-xs font-extrabold uppercase tracking-wider shadow-xs backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400 animate-pulse" />
            <span>AI-Powered Skill-to-Income Recommendation Platform</span>
          </div>
        </div>

        <div className="relative z-10">
          
          {/* Full-Width Column: Headline & Value Proposition */}
          <div className="w-full space-y-8 text-center lg:text-left relative">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900 dark:text-white max-w-4xl">
              Turn Skills Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                Sustainable Income
              </span>
            </h1>

            {/* Short Trust-Building Statement - High Contrast in both light & dark mode */}
            <p className="text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-3xl leading-relaxed font-semibold">
              Bridging the gap between learning, opportunities, and financial independence.
            </p>

            {/* CTA Buttons & Testimonial story */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="w-full sm:w-auto btn-gradient-award text-sm py-4 px-8 shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('gigs')}
                className="w-full sm:w-auto btn-outline-award text-sm py-4 px-8 cursor-pointer flex items-center justify-center"
              >
                Explore Opportunities
              </button>

              {/* Testimonial story under Hero buttons */}
              <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-purple-200 dark:border-purple-500/30 backdrop-blur-md shadow-lg">
                <div className="flex items-center -space-x-2">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120" 
                    alt="Learner" 
                    className="w-8 h-8 rounded-full border-2 border-purple-500 object-cover shadow-md"
                  />
                </div>
                <div className="text-left text-xs">
                  <p className="text-slate-800 dark:text-slate-100 font-bold leading-tight">
                    "I earned my first ₹5,000 within 3 weeks of learning."
                  </p>
                  <span className="inline-block text-[10px] bg-purple-100 dark:bg-purple-500/30 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40 px-2 py-0.5 rounded-md font-extrabold uppercase mt-0.5">
                    Example story
                  </span>
                </div>
              </div>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-purple-200 dark:border-purple-500/30 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Escrow Safe Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span>Verified Badges</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                <span>AI Matching</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* STATS STRIP (Honest Pilot Launch Values) */}
      <section className="bg-slate-100/90 dark:bg-slate-900/95 border-y border-purple-200 dark:border-purple-500/30 py-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {stats.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <div 
                  key={idx} 
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2 hover:border-purple-400/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-400/40 flex items-center justify-center mx-auto text-purple-700 dark:text-purple-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <p className={`text-3xl sm:text-4xl font-extrabold ${s.color} tracking-tight`}>{s.value}</p>
                  
                  {/* High Contrast Stat Label */}
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">{s.label}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 mt-0.5">{s.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Small Note Under Stats Strip */}
          <div className="text-center pt-2">
            <p className="text-xs font-bold text-purple-900 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 inline-block px-4 py-1 rounded-full border border-purple-300 dark:border-purple-500/30">
              📌 Pilot stage: numbers reflect our launch goals.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION (3 Core Cards Right Below Stats Strip) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-pink-700 dark:text-pink-400 uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/10 border border-pink-300 dark:border-pink-500/20">
            Simple 3-Step Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 font-semibold">
            From picking your first skill module to taking on real paying client opportunities.
          </p>
        </div>

        {/* 3 Cards in a Row (Responsive: stacks on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorksThreeCards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div 
                key={idx}
                onClick={() => onNavigate(card.targetTab)}
                className="bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-500/30 hover:border-purple-500/60 rounded-3xl p-7 space-y-4 shadow-xl card-hover-award flex flex-col justify-between relative overflow-hidden text-slate-900 dark:text-white cursor-pointer group transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30 px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-100 dark:border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
                    <span>Step {card.step}</span>
                    <ChevronRight className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition-transform" />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(card.targetTab);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-purple-100 hover:bg-purple-600 hover:text-white dark:bg-purple-950/80 dark:hover:bg-purple-600 text-purple-900 dark:text-purple-200 transition-all flex items-center justify-between cursor-pointer border border-purple-300 dark:border-purple-500/40 shadow-sm"
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* PROBLEM WE SOLVE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-12 shadow-xl backdrop-blur-md space-y-8 text-slate-900 dark:text-white">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-widest px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/20">
              Addressing The Gap
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Problem We Solve
            </h2>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
              "Millions of women possess valuable skills but lack access to learning resources, portfolio visibility, job opportunities, freelancing projects, and career guidance."
            </p>
          </div>

          {/* 4 Core Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {problemHighlights.map((ph, idx) => {
              const IconComponent = ph.icon;
              return (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950/80 p-6 rounded-2xl border border-slate-200 dark:border-purple-500/20 space-y-3 hover:border-purple-400/50 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${ph.color} border`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {ph.title}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {ph.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-pink-700 dark:text-pink-400 uppercase tracking-widest">Platform Modules</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Features Designed for Growth
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200 font-semibold">
            Comprehensive tools enabling women to learn, showcase, apply, and earn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.id}
                className="bg-white/90 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-7 card-hover-award space-y-5 flex flex-col justify-between shadow-lg backdrop-blur-md text-slate-900 dark:text-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{feat.description}</p>

                  <div className="space-y-2 pt-2 border-t border-purple-100 dark:border-purple-500/20">
                    {feat.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('learn')}
                  className="w-full text-xs font-bold text-purple-700 dark:text-purple-300 hover:text-pink-600 dark:hover:text-white flex items-center justify-between pt-2 group cursor-pointer"
                >
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4 text-pink-600 dark:text-pink-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUCCESS STORIES SECTION */}
      <section id="success-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-purple-200 dark:border-purple-500/20 pb-4">
          <div>
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-widest">Real Results</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Success Stories</h2>
          </div>
          <button 
            type="button"
            onClick={() => onNavigate('portfolio')} 
            className="text-xs font-bold text-pink-700 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Verified Portfolios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, idx) => (
            <div key={idx} className="bg-white/90 dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-7 space-y-5 flex flex-col justify-between card-hover-award shadow-lg backdrop-blur-md text-slate-900 dark:text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-md" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{story.name}</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">{story.role}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">{story.location}</p>
                  </div>
                </div>

                {/* Income Growth Badge */}
                <div className="bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-semibold block">Income Growth</span>
                    <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                      {story.incomeStart} → {story.incomeCurrent}
                    </span>
                  </div>
                  <span className="bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                    {story.growth}
                  </span>
                </div>

                {/* Mini Trajectory Progress Bar Chart */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase">Income Growth Trajectory</span>
                  <div className="flex items-end gap-1.5 h-10 pt-1">
                    {story.chartBars.map((val, bIdx) => (
                      <div key={bIdx} className="flex-1 bg-purple-100 dark:bg-purple-500/20 rounded-t-xs overflow-hidden h-full flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-xs transition-all duration-500" 
                          style={{ height: `${val}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed font-medium">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-purple-100 dark:border-purple-500/20 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                <span>Track: {story.track}</span>
                <span className="text-purple-700 dark:text-purple-300 font-bold">✓ Verified Learner</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION FOOTER BANNER */}
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
