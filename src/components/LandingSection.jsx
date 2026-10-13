import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  // Floating Skill Cards for Hero Section
  const floatingSkills = [
    { title: "Graphic Design", icon: Palette, color: "from-[#DE9EE2] to-[#C777CD]", pos: "top-4 left-0 sm:-left-6" },
    { title: "Digital Marketing", icon: Megaphone, color: "from-[#7C5CE6] to-[#9B81EE]", pos: "top-32 -right-2 sm:-right-8" },
    { title: "Content Writing", icon: Feather, color: "from-[#DE9EE2] to-[#7C5CE6]", pos: "bottom-16 -left-4 sm:-left-8" },
    { title: "Tailoring", icon: Scissors, color: "from-emerald-500 to-teal-500", pos: "bottom-4 right-2 sm:right-10" },
    { title: "Web Development", icon: Code, color: "from-[#7C5CE6] to-[#DE9EE2]", pos: "-top-6 right-20 sm:right-32" }
  ];

  // Honest Pilot Stats Strip Values
  const stats = [
    { value: "100+", label: "Pilot Learners", sublabel: "(Launching 2026)", icon: Users, color: "text-[#7C5CE6] dark:text-purple-300" },
    { value: "4", label: "Skill Tracks", sublabel: "Curated Modules", icon: BookOpen, color: "text-[#DE9EE2] dark:text-pink-300" },
    { value: "8+", label: "Partner Opportunities", sublabel: "Gigs & Internships", icon: Briefcase, color: "text-[#7C5CE6] dark:text-purple-300" },
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
      color: "from-[#7C5CE6] to-[#9B81EE]",
      targetTab: "learn",
      ctaText: "Go to Learning Hub"
    },
    {
      step: "02",
      title: "2. Build & Showcase Portfolio",
      desc: "Create real portfolio projects to showcase your verified work to potential clients.",
      icon: Award,
      badge: "Verified Proof",
      color: "from-[#DE9EE2] to-[#C777CD]",
      targetTab: "portfolio",
      ctaText: "Go to Skill Showcase"
    },
    {
      step: "03",
      title: "3. Earn from Real Work",
      desc: "Apply to flexible gigs, freelance projects, and remote client opportunities.",
      icon: IndianRupee,
      badge: "Direct Payouts",
      color: "from-[#9B81EE] to-[#DE9EE2]",
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
      
      {/* 1. HERO SECTION (DYNAMIC LIGHT & DARK MODE HERO) */}
      <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center py-16 w-full px-4 sm:px-8 lg:px-12 overflow-hidden text-center">
        
        {/* Ambient Radial Glow Background (Inspo Lilac & Royal Tones) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#DE9EE2]/35 via-[#7C5CE6]/20 to-[#FAF0FC]/40 dark:from-purple-900/30 dark:via-fuchsia-900/20 dark:to-indigo-950/40 rounded-full blur-[130px] pointer-events-none"></div>

        {/* Subtle Grid Matrix Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124,92,230,0.35) 1px, transparent 0)',
            backgroundSize: '28px 28px'
          }}
        ></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8 flex flex-col items-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF0FC] dark:bg-[#1a0f30]/90 border border-[#DE9EE2]/50 dark:border-purple-500/40 text-[#7C5CE6] dark:text-purple-200 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#DE9EE2] animate-pulse" />
            <span>AI-POWERED SKILL-TO-INCOME RECOMMENDATION PLATFORM</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              Turn Skills Into
            </h1>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#7C5CE6] via-[#B772D9] to-[#DE9EE2] bg-clip-text text-transparent drop-shadow-sm">
              Sustainable Income
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bold max-w-xl mx-auto leading-relaxed">
            Bridging the gap between learning, opportunities, and financial independence.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md">
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#DE9EE2] hover:bg-[#C777CD] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('gigs')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white dark:bg-[#140c26]/90 border border-[#141024] dark:border-purple-500/40 text-slate-900 dark:text-purple-200 hover:bg-[#FAF0FC] dark:hover:bg-purple-900/40 font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center cursor-pointer hover:scale-105 backdrop-blur-md"
            >
              Explore Opportunities
            </button>
          </div>

          {/* Thin Horizontal Divider */}
          <div className="w-full max-w-xl border-t border-[#DE9EE2]/30 dark:border-purple-500/20 pt-6"></div>

          {/* 3 Trust Features Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-extrabold text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Escrow Safe Payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-[#7C5CE6] dark:text-purple-400 flex-shrink-0" />
              <span>Verified Badges</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-[#DE9EE2] dark:text-pink-400 flex-shrink-0" />
              <span>AI Matching</span>
            </div>
          </div>

        </div>

      </section>

      {/* STATS STRIP (Honest Pilot Launch Values) */}
      <section className="bg-white/80 dark:bg-slate-900/95 border-y border-[#DE9EE2]/30 dark:border-purple-500/30 py-10 relative">
        <div className="w-full px-4 sm:px-8 lg:px-12 space-y-4">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            {stats.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <div 
                  key={idx} 
                  className="p-4 sm:p-5 rounded-2xl bg-[#FAF0FC] dark:bg-slate-950/80 border border-[#DE9EE2]/30 dark:border-purple-500/30 shadow-md space-y-2 hover:border-[#DE9EE2]/60 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-purple-500/20 border border-[#DE9EE2]/30 flex items-center justify-center mx-auto text-[#7C5CE6] dark:text-purple-300">
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
            <p className="text-xs font-bold text-[#7C5CE6] dark:text-purple-300 bg-[#FAF0FC] dark:bg-purple-950/60 inline-block px-4 py-1 rounded-full border border-[#DE9EE2]/30 dark:border-purple-500/30">
              📌 Pilot stage: numbers reflect our launch goals.
            </p>
          </div>

        </div>
      </section>

      {/* WHAT WE DO SECTION */}
      <section id="what-we-do" className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#7C5CE6] dark:text-[#E8BAEC] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#FAF0FC] dark:bg-[#251838] border border-[#DE9EE2]/40">
            Our Core Mission & Platform Pillars
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('whatWeDo')}
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
            {t('whatWeDoSubtitle')}
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => onNavigate('learn')}
            className="glass-panel glass-card-interactive rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between group cursor-pointer border border-[#DE9EE2]/30"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7C5CE6] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#7C5CE6] transition-colors">
                Free Practical Upskilling
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Step-by-step video courses and practical exercises in Digital Marketing, Graphic Design, E-Commerce, and Copywriting tailored for women.
              </p>
            </div>
            <div className="pt-3 border-t border-[#DE9EE2]/20 text-[11px] font-bold text-[#7C5CE6] dark:text-[#E8BAEC] flex items-center gap-1">
              <span>Explore 4 Skill Tracks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('portfolio')}
            className="glass-panel glass-card-interactive rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between group cursor-pointer border border-[#DE9EE2]/30"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#DE9EE2] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#DE9EE2] transition-colors">
                Verified Digital Portfolio
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Automatically convert course capstone projects into a shareable proof-of-work portfolio. Showcase real deliverables directly to clients.
              </p>
            </div>
            <div className="pt-3 border-t border-[#DE9EE2]/20 text-[11px] font-bold text-[#DE9EE2] dark:text-[#E8BAEC] flex items-center gap-1">
              <span>Build Proof of Work</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('gigs')}
            className="glass-panel glass-card-interactive rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between group cursor-pointer border border-[#DE9EE2]/30"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#9B81EE] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#7C5CE6] transition-colors">
                Micro-Gigs & Job Matching
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Directly apply for verified freelance projects and flexible work-from-home gigs with transparent 🎯 Skill Match % and eligibility quizzes.
              </p>
            </div>
            <div className="pt-3 border-t border-[#DE9EE2]/20 text-[11px] font-bold text-[#7C5CE6] dark:text-[#E8BAEC] flex items-center gap-1">
              <span>Find Client Opportunities</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('gigs')}
            className="glass-panel glass-card-interactive rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between group cursor-pointer border border-[#DE9EE2]/30"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                100% Escrow Payout Safety
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Protected stipend payments (₹3,500 – ₹12,000/mo) stored in escrow before work starts so women get paid safely with zero online scam risk.
              </p>
            </div>
            <div className="pt-3 border-t border-[#DE9EE2]/20 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>Guaranteed Earnings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION (3 Core Cards Right Below Stats Strip) */}
      <section id="how-it-works" className="w-full px-4 sm:px-8 lg:px-12 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-[#7C5CE6] dark:text-[#E8BAEC] uppercase tracking-widest px-3 py-1 rounded-full bg-[#FAF0FC] dark:bg-[#251838] border border-[#DE9EE2]/40">
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
                className="glass-panel glass-card-interactive rounded-3xl p-7 space-y-4 shadow-xl flex flex-col justify-between relative overflow-hidden text-slate-900 dark:text-white cursor-pointer group border border-[#DE9EE2]/30"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold text-[#7C5CE6] dark:text-purple-300 bg-[#FAF0FC] dark:bg-[#251838] border border-[#DE9EE2]/40 px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#7C5CE6] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DE9EE2]/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#7C5CE6] dark:text-purple-300">
                    <span>Step {card.step}</span>
                    <ChevronRight className="w-4 h-4 text-[#DE9EE2] group-hover:translate-x-1 transition-transform" />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(card.targetTab);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs bg-[#FAF0FC] hover:bg-[#7C5CE6] hover:text-white dark:bg-purple-950/80 dark:hover:bg-[#7C5CE6] text-[#7C5CE6] dark:text-purple-200 transition-all flex items-center justify-between cursor-pointer border border-[#DE9EE2]/40 shadow-sm"
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-[#DE9EE2] group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* PROBLEM WE SOLVE SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="bg-white/95 dark:bg-slate-900/90 border border-[#DE9EE2]/30 dark:border-purple-500/30 rounded-3xl p-6 sm:p-12 shadow-xl backdrop-blur-md space-y-8 text-slate-900 dark:text-white">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-[#7C5CE6] dark:text-[#E8BAEC] uppercase tracking-widest px-3 py-1 rounded-full bg-[#FAF0FC] dark:bg-[#251838] border border-[#DE9EE2]/40">
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
                <div key={idx} className="bg-[#FAF0FC] dark:bg-slate-950/80 p-6 rounded-2xl border border-[#DE9EE2]/20 space-y-3 hover:border-[#DE9EE2]/50 transition-all">
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
      <section id="features" className="w-full px-4 sm:px-8 lg:px-12 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#7C5CE6] dark:text-[#E8BAEC] uppercase tracking-widest">Platform Modules</span>
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
                className="bg-white/95 dark:bg-slate-900/80 border border-[#DE9EE2]/30 dark:border-purple-500/30 rounded-3xl p-7 card-hover-award space-y-5 flex flex-col justify-between shadow-lg backdrop-blur-md text-slate-900 dark:text-white"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C5CE6] to-[#DE9EE2] flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-[#FAF0FC] dark:bg-[#251838] text-[#7C5CE6] dark:text-purple-200 border border-[#DE9EE2]/40 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{feat.description}</p>

                  <div className="space-y-2 pt-2 border-t border-[#DE9EE2]/20">
                    {feat.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#DE9EE2] flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('learn')}
                  className="w-full text-xs font-bold text-[#7C5CE6] dark:text-purple-300 hover:text-[#DE9EE2] flex items-center justify-between pt-2 group cursor-pointer"
                >
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4 text-[#DE9EE2] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SUCCESS STORIES SECTION */}
      <section id="success-stories" className="w-full px-4 sm:px-8 lg:px-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#DE9EE2]/30 pb-4">
          <div>
            <span className="text-xs font-extrabold text-[#7C5CE6] dark:text-[#E8BAEC] uppercase tracking-widest">Real Results</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">Success Stories</h2>
          </div>
          <button 
            type="button"
            onClick={() => onNavigate('portfolio')} 
            className="text-xs font-bold text-[#7C5CE6] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Verified Portfolios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, idx) => (
            <div key={idx} className="bg-white/95 dark:bg-slate-900/80 border border-[#DE9EE2]/30 dark:border-purple-500/30 rounded-3xl p-7 space-y-5 flex flex-col justify-between card-hover-award shadow-lg backdrop-blur-md text-slate-900 dark:text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#DE9EE2] shadow-md" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{story.name}</h4>
                    <p className="text-xs text-[#7C5CE6] font-medium">{story.role}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">{story.location}</p>
                  </div>
                </div>

                {/* Income Growth Badge */}
                <div className="bg-[#FAF0FC] dark:bg-emerald-500/15 border border-[#DE9EE2]/30 p-3 rounded-xl flex items-center justify-between text-xs">
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
                          className="w-full bg-gradient-to-t from-[#7C5CE6] to-[#DE9EE2] rounded-t-xs transition-all duration-500" 
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

              <div className="pt-3 border-t border-[#DE9EE2]/20 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                <span>Track: {story.track}</span>
                <span className="text-[#7C5CE6] font-bold">✓ Verified Learner</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION FOOTER BANNER */}
      <section className="w-full px-4 sm:px-8 lg:px-12">
        <div className="bg-gradient-to-r from-[#7C5CE6] via-[#91509E] to-[#DE9EE2] border border-[#DE9EE2]/40 rounded-3xl p-10 lg:p-16 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight text-white">
              Ready to Start Earning?
            </h2>
            <p className="text-base text-slate-100 font-medium">
              "Empowering Women. Creating Opportunities. Building Futures."
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="bg-white text-[#7C5CE6] hover:bg-slate-50 font-bold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg cursor-pointer hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                className="border-2 border-white text-white hover:bg-white/10 font-bold rounded-full px-8 py-3.5 text-sm sm:text-base cursor-pointer transition-all"
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
