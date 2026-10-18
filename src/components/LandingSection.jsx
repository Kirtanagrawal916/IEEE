import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Award, 
  Briefcase, 
  ShieldCheck,
  Search,
  MapPin,
  ChevronRight,
  IndianRupee,
  Palette,
  Megaphone,
  Feather,
  Scissors,
  Check,
  Building,
  HelpCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import JobCard from './ui/JobCard';
import TrustScamBanner from './ui/TrustScamBanner';
import { initialOpportunities } from '../data/mockData';

export default function LandingSection({ onNavigate, onOpenAuth, theme }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Search Bar State
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle.trim()) params.set('search', searchTitle.trim());
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    navigate(`/opportunities?${params.toString()}`);
  };

  const handleChipClick = (term) => {
    navigate(`/opportunities?search=${encodeURIComponent(term)}`);
  };

  // Honest Pilot Stats Strip Values
  const stats = [
    { value: "100%", label: "Free for Job Seekers", sublabel: "Zero Application Fees", icon: ShieldCheck, color: "text-[#EA580C]" },
    { value: "4", label: "Practical Skill Tracks", sublabel: "Self-paced with videos", icon: BookOpen, color: "text-[#7C3AED]" },
    { value: "8+", label: "Verified Partner Gigs", sublabel: "Remote & Local roles", icon: Briefcase, color: "text-[#16A34A]" },
    { value: "100+", label: "Pilot Women Learners", sublabel: "Launching in 2026", icon: Users, color: "text-[#7C3AED]" }
  ];

  // Job Categories
  const jobCategories = [
    { name: "Digital Marketing", count: "3 Openings", icon: Megaphone, color: "bg-[#F3E8FF] text-[#7C3AED]", desc: "Social media, Instagram management, and ads" },
    { name: "Canva & Graphic Design", count: "2 Openings", icon: Palette, color: "bg-[#FFF7ED] text-[#EA580C]", desc: "Flyers, social banners, and digital graphics" },
    { name: "E-Commerce Assistant", count: "2 Openings", icon: Laptop, count: "2 Openings", color: "bg-[#DCFCE7] text-[#16A34A]", desc: "Shopify product uploads, catalogs, and tags" },
    { name: "Content Writing", count: "1 Opening", icon: Feather, color: "bg-[#FEF3C7] text-[#D97706]", desc: "Product descriptions, captions, and blogs" },
    { name: "Handicrafts & Tailoring", count: "Curated Work", icon: Scissors, color: "bg-[#FCE7F3] text-[#BE185D]", desc: "Boutique orders, embroidery, and tailoring" },
    { name: "Virtual Support", count: "Remote Gigs", icon: Briefcase, color: "bg-[#E0E7FF] text-[#4338CA]", desc: "Data entry, customer support, and coordination" }
  ];

  // How It Works (3 Core Steps)
  const howItWorksSteps = [
    {
      step: "01",
      title: "1. Learn Practical Skills Free",
      desc: "Watch bite-sized video lessons in high-demand digital skills like Canva, social media management, and online sales.",
      icon: BookOpen,
      targetTab: "learn",
      cta: "Explore Free Tracks"
    },
    {
      step: "02",
      title: "2. Build a Verified Portfolio",
      desc: "Complete simple capstone projects to prove your work. We generate a shareable digital showcase link for your clients.",
      icon: Award,
      targetTab: "portfolio",
      cta: "View Sample Portfolios"
    },
    {
      step: "03",
      title: "3. Apply to Safe, Paid Gigs",
      desc: "Apply to verified flexible gigs with transparent pay. Client stipends are stored in escrow so you always get paid safely.",
      icon: IndianRupee,
      targetTab: "opportunities",
      cta: "Browse Open Gigs"
    }
  ];

  // Featured Jobs to display on Home
  const featuredJobs = initialOpportunities.slice(0, 3);

  // Success stories
  const successStories = [
    {
      name: "Pooja Sharma",
      role: "Canva Graphic Designer",
      location: "Jaipur, Rajasthan",
      incomeStart: "₹0",
      incomeCurrent: "₹18,500/mo",
      growth: "+100% Independent",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      quote: "As a homemaker, I never thought I could earn from my phone. Learning Canva on HerEarn gave me the confidence to design promo flyers for 3 local boutiques.",
      track: "Design"
    },
    {
      name: "Sunita Roy",
      role: "Social Media Coordinator",
      location: "Kolkata, WB",
      incomeStart: "₹3,500",
      incomeCurrent: "₹24,000/mo",
      growth: "+585% Growth",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
      quote: "The step-by-step Instagram marketing module taught me everything from captions to hashtags. Within 3 weeks of finishing, I landed my first recurring monthly client.",
      track: "Marketing"
    },
    {
      name: "Ananya Patel",
      role: "Shopify Catalog Specialist",
      location: "Surat, Gujarat",
      incomeStart: "₹8,000",
      incomeCurrent: "₹30,000/mo",
      growth: "+275% Growth",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      quote: "The portfolio builder showed clients my real store setup skills. I now manage online catalogs remotely for a textile collective from home.",
      track: "E-Commerce"
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden text-[#1F2937] dark:text-slate-100">
      
      {/* ========================================================
          1. HERO SECTION (Welcoming, Clear, High-Contrast)
         ======================================================== */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#FFF9F5] via-[#FFF3EB]/60 to-[#FFF9F5] dark:from-[#0F0918] dark:via-[#190F29]/60 dark:to-[#0F0918] border-b border-[#FED7AA]/40 dark:border-purple-950/40">
        
        {/* Soft background glow decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-200/40 via-orange-100/40 to-purple-100/30 dark:from-purple-900/20 dark:via-orange-900/10 dark:to-purple-950/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          

          {/* One Clear Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-[#1F2937] dark:text-white tracking-tight leading-[1.15]">
            Find Free Jobs & Skills Built for Women.
          </h1>

          {/* One Clear Sentence */}
          <p className="text-base sm:text-lg text-[#4B5563] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            A welcoming, free platform for women across India to learn in-demand digital skills, build verified portfolios, and connect with trusted work-from-home and local jobs.
          </p>

          {/* PROMINENT SEARCH BAR (Job Title + Location + Primary CTA) */}
          <form 
            onSubmit={handleHeroSearch}
            className="w-full max-w-3xl mx-auto pt-4"
            role="search"
            aria-label="Search free jobs and opportunities"
          >
            <div className="bg-white dark:bg-[#191026] p-2.5 sm:p-3 rounded-2xl border-2 border-[#E5E7EB] dark:border-purple-800/50 shadow-lg flex flex-col md:flex-row items-stretch gap-2.5">
              
              {/* Job Title / Skill Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Job title, skill (e.g. Canva, Social Media, Data Entry)..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full pl-11 pr-3 py-3 text-sm font-medium text-[#1F2937] dark:text-white placeholder-[#9CA3AF] bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 min-h-[48px]"
                  aria-label="Job title or skill"
                />
              </div>

              {/* Location Input */}
              <div className="relative md:w-56 flex items-center border-t md:border-t-0 md:border-l border-[#E5E7EB] dark:border-purple-800/40 pt-2 md:pt-0">
                <MapPin className="w-5 h-5 text-[#9CA3AF] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Location (e.g. Remote, Delhi)..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-11 pr-3 py-3 text-sm font-medium text-[#1F2937] dark:text-white placeholder-[#9CA3AF] bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 min-h-[48px]"
                  aria-label="Location"
                />
              </div>

              {/* Primary Search CTA */}
              <button
                type="submit"
                className="tap-target px-7 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold font-heading text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 min-h-[48px]"
              >
                <span>Search Free Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Popular Search Chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-3 text-xs text-[#6B7280] dark:text-slate-400">
              <span className="font-semibold">Popular searches:</span>
              {['Work from Home', 'Canva Design', 'Social Media', 'Data Entry', 'Shopify Catalog'].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E1233] border border-[#E5E7EB] dark:border-purple-800/30 text-[#4B5563] dark:text-slate-300 hover:text-[#7C3AED] hover:border-[#7C3AED]/40 transition-colors cursor-pointer text-xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </form>

          {/* Quick Dual Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-semibold text-[#4B5563] dark:text-slate-300">
            <button
              type="button"
              onClick={() => onNavigate('learn')}
              className="inline-flex items-center gap-1.5 text-[#7C3AED] dark:text-purple-300 hover:underline cursor-pointer font-bold"
            >
              <BookOpen className="w-4 h-4" />
              <span>Looking to learn first? Browse Free Video Courses →</span>
            </button>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <button
              type="button"
              onClick={() => onNavigate('opportunities')}
              className="inline-flex items-center gap-1.5 text-[#EA580C] dark:text-orange-300 hover:underline cursor-pointer font-bold"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore All Verified Gigs →</span>
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. STATS & TRUST STRIP
         ======================================================== */}
      <section className="site-container" aria-label="Key Platform Facts">
        <div className="bg-white dark:bg-[#191026] border border-[#E5E7EB] dark:border-purple-900/40 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-[#FFF9F5] dark:bg-[#231738] border border-[#FED7AA]/60 dark:border-purple-800/40 flex items-center justify-center text-[#7C3AED]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <p className={`text-2xl sm:text-3xl font-extrabold font-heading ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-[#1F2937] dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                    {item.sublabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scam Warning Banner */}
        <div className="pt-6">
          <TrustScamBanner />
        </div>
      </section>

      {/* ========================================================
          3. EXPLORE JOB CATEGORIES
         ======================================================== */}
      <section className="site-container space-y-6" aria-labelledby="job-categories-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E7EB] dark:border-purple-900/30 pb-4">
          <div>
            <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 uppercase tracking-wider block">
              Browse by Area
            </span>
            <h2 id="job-categories-heading" className="text-2xl sm:text-3xl font-black font-heading text-[#1F2937] dark:text-white">
              Explore Job Categories
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
          >
            <span>View all openings</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {jobCategories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/opportunities?category=${encodeURIComponent(cat.name)}`)}
                className="theme-card bg-white dark:bg-[#191026] p-5 rounded-2xl border border-[#E5E7EB] dark:border-purple-900/30 flex items-start gap-4 cursor-pointer hover:border-[#7C3AED] transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold font-heading text-[#1F2937] dark:text-white group-hover:text-[#7C3AED] transition-colors truncate">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                  <span className="inline-block text-[11px] font-bold text-[#7C3AED] dark:text-purple-300 pt-1">
                    {cat.count} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. FEATURED JOBS SECTION (Verified, 100% Free)
         ======================================================== */}
      <section className="site-container space-y-6" aria-labelledby="featured-jobs-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E7EB] dark:border-purple-900/30 pb-4">
          <div>
            <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block">
              100% Free Applications
            </span>
            <h2 id="featured-jobs-heading" className="text-2xl sm:text-3xl font-black font-heading text-[#1F2937] dark:text-white">
              Featured Free Opportunities
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('opportunities')}
            className="tap-target px-4 py-2 rounded-xl bg-[#F3E8FF] dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 font-bold font-heading text-xs hover:bg-[#7C3AED] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>See All {initialOpportunities.length} Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Featured Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onViewDetails={(j) => navigate(`/opportunities/${j.id}`)}
              onApply={(j) => navigate(`/opportunities/${j.id}/apply`)}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          5. FREE RESOURCES & SKILL TRACKS
         ======================================================== */}
      <section className="site-container space-y-6" aria-labelledby="free-skills-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E7EB] dark:border-purple-900/30 pb-4">
          <div>
            <span className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 uppercase tracking-wider block">
              Learn for Free
            </span>
            <h2 id="free-skills-heading" className="text-2xl sm:text-3xl font-black font-heading text-[#1F2937] dark:text-white">
              Free Practical Skill Tracks
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-0.5">
              Self-paced, bite-sized lessons designed to help you build real client deliverables.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
          >
            <span>Explore all courses</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Digital Marketing & Social Media",
              lessons: "5 Lessons • 4 Hours",
              desc: "Manage Instagram business pages, craft captions, and run hyper-local ads.",
              tag: "High Demand",
              icon: Megaphone,
              color: "text-[#7C3AED] bg-[#F3E8FF]"
            },
            {
              title: "Canva & Graphic Design",
              lessons: "5 Lessons • 3 Hours",
              desc: "Design marketing flyers, restaurant menus, product promos, and event banners.",
              tag: "Beginner Friendly",
              icon: Palette,
              color: "text-[#EA580C] bg-[#FFF7ED]"
            },
            {
              title: "Shopify & E-Commerce Management",
              lessons: "4 Lessons • 3.5 Hours",
              desc: "Upload product catalogs, optimize photos, set prices, and manage online stores.",
              tag: "Remote Roles",
              icon: Laptop,
              color: "text-[#16A34A] bg-[#DCFCE7]"
            },
            {
              title: "Content & Copywriting",
              lessons: "4 Lessons • 2.5 Hours",
              desc: "Write engaging product descriptions, social media hooks, and sales copy.",
              tag: "Flexible Work",
              icon: Feather,
              color: "text-[#D97706] bg-[#FEF3C7]"
            }
          ].map((track, idx) => {
            const IconC = track.icon;
            return (
              <div 
                key={idx}
                className="theme-card bg-white dark:bg-[#191026] p-5 rounded-2xl border border-[#E5E7EB] dark:border-purple-900/30 flex flex-col justify-between space-y-4 hover:border-[#7C3AED] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${track.color}`}>
                      <IconC className="w-5 h-5" />
                    </div>
                    <span className="badge-free text-[10px] py-0.5">
                      100% Free
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-[#1F2937] dark:text-white leading-snug">
                    {track.title}
                  </h3>

                  <p className="text-xs text-[#6B7280] dark:text-slate-400">
                    {track.lessons}
                  </p>

                  <p className="text-xs text-[#4B5563] dark:text-slate-300 leading-relaxed">
                    {track.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('learn')}
                  className="tap-target w-full py-2.5 rounded-xl bg-[#F3E8FF] dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 hover:bg-[#7C3AED] hover:text-white font-bold font-heading text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Start Free Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          6. HOW IT WORKS (Empowering 3-Step Journey)
         ======================================================== */}
      <section className="site-container space-y-8" aria-labelledby="how-it-works-heading">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="badge-plum text-xs">
            Simple 3-Step Process
          </span>
          <h2 id="how-it-works-heading" className="text-2xl sm:text-4xl font-black font-heading text-[#1F2937] dark:text-white">
            How Skill to Women Works
          </h2>
          <p className="text-xs sm:text-base text-[#4B5563] dark:text-slate-300 font-normal">
            No expensive certificates or complicated requirements. Start right where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorksSteps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div 
                key={idx}
                className="theme-card bg-white dark:bg-[#191026] p-6 rounded-2xl border border-[#E5E7EB] dark:border-purple-900/30 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-heading px-3 py-1 rounded-full bg-[#F3E8FF] text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300">
                      Step {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] dark:bg-[#231738] flex items-center justify-center text-[#7C3AED]">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-[#1F2937] dark:text-white">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-slate-300 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate(step.targetTab)}
                  className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer pt-2"
                >
                  <span>{step.cta}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          7. SUCCESS STORIES (Warm & Real Proof)
         ======================================================== */}
      <section className="site-container space-y-6" aria-labelledby="success-stories-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E7EB] dark:border-purple-900/30 pb-4">
          <div>
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider block">
              Real Impact
            </span>
            <h2 id="success-stories-heading" className="text-2xl sm:text-3xl font-black font-heading text-[#1F2937] dark:text-white">
              Women Building Real Incomes
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-bold text-[#7C3AED] dark:text-purple-300 hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
          >
            <span>View all learner portfolios</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((story, idx) => (
            <div 
              key={idx}
              className="theme-card bg-white dark:bg-[#191026] p-6 rounded-2xl border border-[#E5E7EB] dark:border-purple-900/30 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={story.avatar} 
                    alt={story.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#7C3AED]/40 shadow-xs" 
                  />
                  <div>
                    <h3 className="text-sm font-bold font-heading text-[#1F2937] dark:text-white">
                      {story.name}
                    </h3>
                    <p className="text-xs text-[#7C3AED] dark:text-purple-300 font-semibold">
                      {story.role}
                    </p>
                    <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
                      {story.location}
                    </p>
                  </div>
                </div>

                <div className="bg-[#FFF9F5] dark:bg-[#201533] p-3 rounded-xl border border-[#FED7AA]/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Monthly Earnings</span>
                    <span className="text-sm font-extrabold text-[#16A34A] font-heading">
                      {story.incomeCurrent}
                    </span>
                  </div>
                  <span className="badge-free text-[10px] py-0.5">
                    {story.growth}
                  </span>
                </div>

                <p className="text-xs text-[#4B5563] dark:text-slate-300 leading-relaxed italic">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-purple-900/20 text-[11px] text-[#6B7280] dark:text-slate-400 font-medium flex items-center justify-between">
                <span>Skill: {story.track}</span>
                <span className="text-[#16A34A] font-bold">✓ Verified Learner</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          8. CALL TO ACTION BANNER (Empowering & Simple)
         ======================================================== */}
      <section className="site-container">
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-2xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
              Join Our Open Pilot
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-heading text-white leading-tight">
              Ready to learn and earn on your own terms?
            </h2>
            <p className="text-xs sm:text-base text-purple-100 font-normal">
              100% free for women. No credit cards, no registration charges, and no hidden fees ever.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('learn')}
                className="tap-target px-7 py-3 rounded-xl bg-white text-[#7C3AED] hover:bg-purple-50 font-bold font-heading text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                className="tap-target px-7 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold font-heading text-sm shadow-md transition-all cursor-pointer"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
