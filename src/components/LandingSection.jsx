import React from 'react';
import { 
  BookOpen, 
  Award, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  PlayCircle, 
  Star 
} from 'lucide-react';
import { platformStats, skillTracks, initialOpportunities } from '../data/mockData';

export default function LandingSection({ onNavigate, onOpenAuth }) {
  return (
    <div className="min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              24-Hour Working Prototype Demo
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Empowering Women from <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">
                Market Skill Learning
              </span>{' '}
              to Real Income.
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              A streamlined platform enabling women to master high-demand digital skills in hours, publish verified portfolio projects, and connect directly with paid micro-gigs and flexible remote work.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('learn')}
                className="btn-primary text-base py-3.5 px-7 shadow-lg shadow-indigo-600/30"
              >
                Start Free Learning Track
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('gigs')}
                className="btn-secondary text-base py-3.5 px-7 bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              >
                Browse Paid Micro-Gigs
              </button>
            </div>

            {/* Quick Trust Signals */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-slate-400 text-xs font-medium">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Free Skill Courses</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Verified Client Gigs</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Earn within 30 Days</span>
              </div>
            </div>
          </div>

          {/* Interactive Core Loop Demo Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  The Core Platform Loop
                </span>
                <span className="text-xs text-slate-400 bg-slate-700 px-2.5 py-0.5 rounded-full">Interactive Demo</span>
              </div>

              {/* Step 1: Learn */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-500/30 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Learn Market Skills
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Bite-sized video lessons on Canva design, Instagram marketing, & Shopify store management.
                  </p>
                </div>
              </div>

              {/* Step 2: Showcase */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-purple-500/30 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    Publish Verified Portfolio
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Submit capstone projects to prove real skills & gain verified badge credentials.
                  </p>
                </div>
              </div>

              {/* Step 3: Earn */}
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-rose-500/30 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-rose-400" />
                    Apply & Earn Income
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    1-click apply to paid micro-gigs (₹2,500 – ₹15,000/mo) posted by local businesses.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('learn')}
                className="w-full btn-primary justify-center py-3 text-sm font-bold"
              >
                Experience Demo Path Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Platform Stats Bar */}
      <section className="bg-white border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {platformStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl font-extrabold text-indigo-600 tracking-tight">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skill Tracks Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">High Demand Tracks</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Learn in-demand skills for flexible work</h2>
          </div>
          <button 
            onClick={() => onNavigate('learn')}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All Tracks <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillTracks.map((track) => (
            <div 
              key={track.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={track.image} 
                    alt={track.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {track.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {track.duration}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{track.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{track.description}</p>
                  
                  <div className="pt-2 text-xs text-slate-500 font-medium border-t border-slate-100 flex items-center justify-between">
                    <span>Instructor: {track.instructor.split(' ')[0]} {track.instructor.split(' ')[1]}</span>
                    <span className="text-indigo-600 font-bold">{track.lessons.length} Lessons</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onNavigate('learn')}
                  className="w-full btn-secondary text-xs justify-center py-2.5"
                >
                  <PlayCircle className="w-4 h-4 text-indigo-600" />
                  Start Learning Track
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Micro-Gigs Preview */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Active Micro-Gigs</span>
              <h2 className="text-3xl font-bold text-white mt-1">Real paid opportunities ready for applications</h2>
            </div>
            <button 
              onClick={() => onNavigate('gigs')}
              className="text-sm font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              Browse All Opportunities <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {initialOpportunities.slice(0, 2).map((gig) => (
              <div 
                key={gig.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={gig.logo} alt={gig.company} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <h4 className="text-base font-bold text-white line-clamp-1">{gig.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{gig.company}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {gig.stipend}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{gig.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {gig.skillsRequired.map((s, idx) => (
                    <span key={idx} className="bg-slate-700/70 text-slate-300 text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{gig.type} • {gig.applicantsCount} Applicants</span>
                  <button 
                    onClick={() => onNavigate('gigs')}
                    className="btn-accent text-xs py-2 px-4"
                  >
                    View & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Testimonial Highlight */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-8 lg:p-12 border border-indigo-500/30 shadow-xl text-white relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                alt="Ananya Sharma"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-400 shadow-xl mb-3"
              />
              <h4 className="text-lg font-bold text-white">Ananya Sharma</h4>
              <p className="text-xs text-indigo-300 font-medium">Digital Marketing Graduate • Jaipur</p>
              <div className="flex items-center gap-1 text-amber-400 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Learner Spotlight</span>
              <h3 className="text-2xl lg:text-3xl font-bold text-white leading-snug">
                "I finished the 4-hour Digital Marketing track, uploaded my Instagram sample strategy, and landed my first ₹8,000/month remote gig in 5 days!"
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Before NariShakti, I wanted to earn independently from home but lacked portfolio proof. Completing the structured capstone project gave local store owners confidence to hire me.
              </p>
              <div className="pt-2 flex items-center gap-6 text-xs text-slate-400 font-medium">
                <div>
                  <span className="block text-lg font-bold text-emerald-400">₹12,500</span>
                  <span>Total Earned</span>
                </div>
                <div className="border-l border-slate-700 pl-6">
                  <span className="block text-lg font-bold text-indigo-400">2 Clients</span>
                  <span>Retained Monthly</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
