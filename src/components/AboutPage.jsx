import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  TrendingUp, 
  Users, 
  Lock, 
  Zap, 
  Layers, 
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  const problemPoints = [
    {
      title: "Digital Skill Access",
      desc: "Lack of affordable, practical, market-aligned training tailored for women starting or re-entering the workforce.",
      icon: BookOpen,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      title: "Portfolio Building",
      desc: "Absence of real-world projects and proof-of-work to prove capabilities to potential clients and employers.",
      icon: Layers,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20"
    },
    {
      title: "Verified Opportunities",
      desc: "High vulnerability to unverified gigs, scams, or low-paying opportunities without payment guarantees.",
      icon: AlertCircle,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Income Generation",
      desc: "Systemic barriers preventing women from achieving financial independence through remote & micro-gigs.",
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    }
  ];

  const loopSteps = [
    {
      step: "01",
      title: "Learn",
      tagline: "Market-Relevant Skills",
      desc: "Master digital marketing, content creation, Canva design, and virtual assistance through 100% free practical tracks.",
      icon: BookOpen,
      color: "from-purple-600 to-indigo-600"
    },
    {
      step: "02",
      title: "Build",
      tagline: "Hands-on Projects",
      desc: "Apply your learning to create real industry deliverables, client mockups, and practical assets.",
      icon: Layers,
      color: "from-indigo-600 to-pink-600"
    },
    {
      step: "03",
      title: "Showcase",
      tagline: "Verifiable Portfolios",
      desc: "Publish your verified portfolio to demonstrate authentic proof-of-work to clients and hiring partners.",
      icon: Award,
      color: "from-pink-600 to-amber-600"
    },
    {
      step: "04",
      title: "Earn",
      tagline: "Micro-Gigs & Jobs",
      desc: "Connect with verified micro-gigs, remote internships, and freelance projects across India with transparent stipends.",
      icon: Briefcase,
      color: "from-amber-600 to-emerald-600"
    }
  ];

  const impactMetrics = [
    {
      title: "Practical Skills",
      metric: "100% Free",
      desc: "Actionable micro-learning tracks without paywalls or hidden costs.",
      icon: Zap
    },
    {
      title: "Portfolio Proof",
      metric: "Verified",
      desc: "Proof-of-work system validating learner projects and skill competency.",
      icon: ShieldCheck
    },
    {
      title: "Verified Opportunities",
      metric: "Curated",
      desc: "Strict client vetting ensuring safe, legitimate, and paid micro-gigs.",
      icon: Globe
    },
    {
      title: "Financial Independence",
      metric: "Empowered",
      desc: "Enabling sustainable remote earnings and professional confidence.",
      icon: TrendingUp
    }
  ];

  const whyCards = [
    {
      title: "Learning Tracks",
      desc: "Structured, bite-sized curriculum designed for flexible self-paced learning on mobile or laptop.",
      icon: BookOpen
    },
    {
      title: "Portfolio Builder",
      desc: "Interactive portfolio showcase allowing learners to publish verified work samples and case studies.",
      icon: Award
    },
    {
      title: "Application System",
      desc: "Seamless one-click gig application process with real-time tracking from submission to acceptance.",
      icon: CheckCircle2
    },
    {
      title: "Opportunity Marketplace",
      desc: "Curated catalog of remote micro-gigs, internships, and freelance roles tailored for skilled women.",
      icon: Briefcase
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-4 sm:px-6 lg:px-8 space-y-20 animate-fade-in">
      
      {/* ========================================================
          1. HERO SECTION
         ======================================================== */}
      <section className="max-w-5xl mx-auto text-center space-y-8 pt-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>About HerEarn Platform</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Skill-to-Income Platform <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            for Women
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-medium">
          Empowering women to learn market-relevant skills, build verifiable portfolios, and connect with real earning opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-extrabold text-sm sm:text-base border border-purple-500/30 hover:border-pink-500/50 shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <Award className="w-4 h-4 text-pink-400" />
            <span>Create Portfolio</span>
          </button>
        </div>

      </section>

      {/* ========================================================
          2. PROBLEM SECTION
         ======================================================== */}
      <section className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Barriers We Are Solving
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-medium">
            Millions of women across India face systemic challenges when transitioning from learning to earning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 p-6 rounded-3xl space-y-4 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          3. SOLUTION SECTION (HEREARN LOOP)
         ======================================================== */}
      <section className="max-w-6xl mx-auto space-y-12 bg-slate-900/40 border border-purple-500/20 p-8 sm:p-12 rounded-3xl relative overflow-hidden backdrop-blur-md">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-3 relative z-10">
          <span className="text-xs font-extrabold text-pink-400 uppercase tracking-widest bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            Our Core Methodology
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            The HerEarn Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-medium">
            A continuous four-stage ecosystem built to turn raw curiosity into sustainable income.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {loopSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-950/80 border border-purple-500/30 rounded-3xl p-6 relative flex flex-col justify-between space-y-6 shadow-xl hover:border-pink-500/50 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-600 group-hover:text-purple-400 transition-colors">
                      {step.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-white">{step.title}</h3>
                    <p className="text-xs font-bold text-pink-400">{step.tagline}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

                {idx < loopSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-purple-400">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. IMPACT SECTION
         ======================================================== */}
      <section className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Real-World Impact
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-medium">
            Designed around trust, verification, and practical career outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactMetrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-3 text-center hover:border-purple-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.title}</p>
                <p className="text-2xl font-extrabold text-white tracking-tight">{item.metric}</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          5. WHY HEREARN SECTION
         ======================================================== */}
      <section className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why HerEarn Platform
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-medium">
            Four integrated core modules working together to power your professional growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {whyCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/80 border border-purple-500/20 p-7 rounded-3xl flex items-start gap-5 hover:border-pink-500/40 transition-all shadow-lg"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          6. CALL TO ACTION SECTION
         ======================================================== */}
      <section className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-900/60 via-slate-900 to-pink-900/60 border border-purple-500/40 p-8 sm:p-12 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-lg mx-auto font-medium">
            Join thousands of women learning skills, publishing portfolios, and securing income opportunities today.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
          >
            Create Account
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="px-7 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-slate-200 font-extrabold text-xs sm:text-sm border border-purple-500/30 transition-all cursor-pointer"
          >
            Explore Learning Tracks
          </button>
        </div>
      </section>

    </div>
  );
}
