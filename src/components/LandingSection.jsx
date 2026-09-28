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
  PlayCircle, 
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
  Scissors
} from 'lucide-react';

export default function LandingSection({ onNavigate, onOpenAuth }) {
  const [activeDashboardTab, setActiveDashboardTab] = useState('earnings');

  // 1. Statistics
  const stats = [
    { label: "Women Learners", value: "10,000+", icon: Users, color: "text-purple-400" },
    { label: "Skill Courses", value: "500+", icon: BookOpen, color: "text-pink-400" },
    { label: "Income Opportunities", value: "2,000+", icon: Briefcase, color: "text-amber-400" },
    { label: "Career Growth Support", value: "95%", icon: TrendingUp, color: "text-emerald-400" }
  ];

  // 2. Features Data
  const features = [
    {
      id: "feat-1",
      title: "Learn Market-Relevant Skills",
      icon: BookOpen,
      badge: "High Demand",
      description: "Master practical skills with bite-sized lessons taught by experienced industry mentors.",
      items: ["Digital Marketing", "Graphic Design", "Content Writing", "Tailoring & Handicrafts", "Coding & Technology"]
    },
    {
      id: "feat-2",
      title: "Portfolio Showcase",
      icon: Award,
      badge: "Verified Proof",
      description: "Build a verified digital portfolio that demonstrates your capability to real employers.",
      items: ["Upload Projects", "Display Certifications", "Showcase Products & Services"]
    },
    {
      id: "feat-3",
      title: "Income Opportunities",
      icon: Briefcase,
      badge: "Escrow Secured",
      description: "Access curated flexible work options tailored to your schedule and location.",
      items: ["Freelancing Projects", "Part-Time Jobs", "Remote Work", "Local Business Opportunities"]
    },
    {
      id: "feat-4",
      title: "AI Career Guidance",
      icon: Cpu,
      badge: "Smart Match",
      description: "Let AI evaluate your strengths, recommend learning tracks, and pair you with top gigs.",
      items: ["Skill Assessment", "Personalized Learning Path", "Income Recommendations"]
    },
    {
      id: "feat-5",
      title: "Community Support",
      icon: HeartHandshake,
      badge: "Sisterhood",
      description: "Join a thriving network of women founders, mentors, and fellow learners.",
      items: ["Women Mentors", "Success Stories", "Networking Groups"]
    }
  ];

  // 3. How It Works (5 Steps)
  const steps = [
    { number: "01", title: "Choose a Skill", desc: "Select from 500+ curated tracks in design, marketing, tech, or handicrafts." },
    { number: "02", title: "Learn Through Interactive Courses", desc: "Watch short video modules and complete hands-on practice projects." },
    { number: "03", title: "Build Portfolio", desc: "Upload capstone work to unlock verified skill credentials on your profile." },
    { number: "04", title: "Connect With Opportunities", desc: "Apply with 1-click to remote gigs, internships, and business partnerships." },
    { number: "05", title: "Start Earning", desc: "Receive safe escrow payouts and grow your monthly independent income." }
  ];

  // 4. Impact Benefits
  const benefits = [
    { title: "Financial Empowerment", desc: "Direct access to independent income streams for women." },
    { title: "Career Development", desc: "Structured upskilling pathways aligned with market trends." },
    { title: "Entrepreneurship Support", desc: "Tools and guidance to turn skills into home-run micro-businesses." },
    { title: "Flexible Income Opportunities", desc: "Work remotely on your own time without geographical constraints." },
    { title: "Increased Digital Literacy", desc: "Master modern AI tools, e-commerce platforms, and digital finance." }
  ];

  // 5. Success Stories
  const successStories = [
    {
      name: "Ananya Sharma",
      role: "Digital Marketing Freelancer",
      location: "Jaipur, Rajasthan",
      earnings: "₹18,500 / mo",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      quote: "Completing the Digital Marketing track gave me the confidence to pitch local boutiques. I now retain 3 monthly clients from home!",
      track: "Digital Marketing"
    },
    {
      name: "Sunita Patel",
      role: "Brand Packaging Artisan",
      location: "Ahmedabad, Gujarat",
      earnings: "₹24,000 / mo",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
      quote: "I learned product sticker design on Canva. Today I design packaging for 5 local tea and spice brands!",
      track: "Graphic Design"
    },
    {
      name: "Priya Verma",
      role: "Shopify Store Manager",
      location: "Indore, Madhya Pradesh",
      earnings: "₹15,000 / mo",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      quote: "The AI Career Guidance matched me with a handloom collective. I manage their online store listings remotely.",
      track: "E-Commerce"
    }
  ];

  // 6. Technology Pillar Items
  const techPillars = [
    { title: "AI Recommendation Engine", desc: "Analyzes learner strengths and predicts high-paying local skill demand." },
    { title: "Skill Matching System", desc: "Connects verified portfolio credentials directly with client job requirements." },
    { title: "Portfolio Management", desc: "Generates public, shareable showcase profiles with verified badges." },
    { title: "Job & Freelance Marketplace", desc: "Secure escrow payment system ensuring safe transactions for women creators." }
  ];

  return (
    <div className="space-y-24 pb-20 animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Ambient Gradient Glow Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>

        <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Women Empowerment & Career Platform
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Turn Skills Into <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                Sustainable Income
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Learn in-demand skills, build your portfolio, connect with clients, and start earning through jobs, freelancing, and entrepreneurship.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('learn')}
                className="btn-gradient-award text-sm py-4 px-8 shadow-xl"
              >
                Start Learning
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('gigs')}
                className="btn-outline-award text-sm py-4 px-8"
              >
                Explore Opportunities
              </button>
            </div>

            {/* Quick Micro Trust Badges */}
            <div className="pt-6 border-t border-purple-500/20 grid grid-cols-3 gap-3 text-slate-300 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Escrow Safe Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Verified Badges</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span>AI Guidance</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: Interactive Dashboard Preview */}
          <div className="lg:col-span-6">
            <div className="glass-card-glow rounded-3xl p-6 relative overflow-hidden shadow-2xl animate-float space-y-5">
              
              {/* Dashboard Preview Header */}
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-purple-300 ml-2">NariShakti Dashboard Hub</span>
                </div>
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live Preview
                </span>
              </div>

              {/* Interactive Tabs inside Dashboard Visual */}
              <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-xl text-xs font-bold">
                {[
                  { id: 'earnings', label: '📈 Earnings Growth' },
                  { id: 'portfolio', label: '🎨 Portfolio Proof' },
                  { id: 'ai', label: '🤖 AI Path' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveDashboardTab(t.id)}
                    className={`py-2 rounded-lg transition-all ${
                      activeDashboardTab === t.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Dashboard Visual Panel */}
              <div className="bg-slate-950/90 rounded-2xl p-5 border border-purple-500/20 space-y-4">
                {activeDashboardTab === 'earnings' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Income Tracker</span>
                        <p className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1">
                          ₹18,500 <span className="text-xs text-purple-300 font-normal">+34% this month</span>
                        </p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">3 Active Retainers</span>
                    </div>

                    {/* Progress Chart Simulation */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-slate-300 font-semibold">
                        <span>Digital Marketing Gig</span>
                        <span className="text-purple-400">₹8,500</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill w-[85%]"></div>
                      </div>

                      <div className="flex justify-between text-xs text-slate-300 font-semibold pt-1">
                        <span>Canva Banner Project</span>
                        <span className="text-pink-400">₹4,000</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill w-[60%]"></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDashboardTab === 'portfolio' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Verified Portfolio Artifacts</span>
                      <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full">Verified Badge</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-purple-500/30 flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=150" 
                        alt="Project" 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">7-Day Instagram Strategy for Boutiques</p>
                        <p className="text-[10px] text-purple-300">45% increase in client leads</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDashboardTab === 'ai' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-pink-400" />
                        AI Career Match Engine
                      </span>
                      <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold">98% Match</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Based on your Canva graphics score, AI recommends applying for <span className="text-pink-400 font-bold">Social Media Manager</span> gigs paying ₹12,000/mo.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Quick Action */}
              <button
                onClick={() => onNavigate('learn')}
                className="w-full btn-gradient-award justify-center text-xs py-3"
              >
                Experience Platform Demo
              </button>

            </div>
          </div>

        </div>

      </section>

      {/* STATISTICS SECTION */}
      <section className="bg-slate-900/90 border-y border-purple-500/20 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => {
              const IconComponent = s.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center mx-auto text-purple-300">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <p className={`text-3xl sm:text-4xl font-extrabold ${s.color} tracking-tight`}>{s.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (5 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-pink-400 uppercase tracking-widest">Platform Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Everything You Need to Succeed</h2>
          <p className="text-sm text-slate-300">
            A comprehensive ecosystem taking women from initial skill training to real financial independence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.id}
                className="glass-card rounded-3xl p-7 card-hover-award space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>

                  <div className="space-y-2 pt-2 border-t border-purple-500/15">
                    {feat.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('learn')}
                  className="w-full text-xs font-bold text-purple-300 hover:text-white flex items-center justify-between pt-2 group"
                >
                  <span>Explore {feat.title.split(' ')[0]}</span>
                  <ChevronRight className="w-4 h-4 text-pink-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS (5 STEPS) */}
      <section className="bg-slate-900/60 py-16 border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">Simple Roadmap</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How It Works</h2>
            <p className="text-sm text-slate-300">5 simple steps from learning your first module to receiving independent payouts.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-5 space-y-3 relative overflow-hidden">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {s.number}
                </span>
                <h4 className="text-base font-bold text-white leading-snug">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card-glow rounded-3xl p-8 lg:p-12 text-white space-y-8 relative overflow-hidden">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-extrabold text-pink-400 uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">From Learning to Financial Independence</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We empower women across tier 1, 2, and 3 cities to take control of their career growth, build scalable micro-enterprises, and achieve economic freedom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((b, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-purple-500/30 p-5 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-white">{b.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SUCCESS STORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">Real Results</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">Success Stories</h2>
          </div>
          <button onClick={() => onNavigate('portfolio')} className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1">
            View All Verified Portfolios <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-7 space-y-5 flex flex-col justify-between card-hover-award">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-purple-400 shadow-md" />
                  <div>
                    <h4 className="text-base font-bold text-white">{story.name}</h4>
                    <p className="text-xs text-purple-300 font-medium">{story.role}</p>
                    <p className="text-[11px] text-slate-400">{story.location}</p>
                  </div>
                </div>

                <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">Monthly Income:</span>
                  <span className="text-base font-extrabold text-emerald-400">{story.earnings}</span>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs text-slate-400">
                <span>Track: {story.track}</span>
                <span className="text-purple-400 font-bold">✓ Verified Success</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECHNOLOGY PILLARS SECTION */}
      <section className="bg-slate-900/80 border-y border-purple-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-pink-400 uppercase tracking-widest">Powered By Technology</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Advanced AI & Matching Infrastructure</h2>
            <p className="text-sm text-slate-300">Modern technology designed to match talent with high-demand opportunities efficiently.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techPillars.map((tp, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 space-y-3 hover:border-pink-500/40 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{tp.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{tp.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER TAGLINE CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-pink-950 border border-purple-500/40 rounded-3xl p-10 lg:p-16 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Ready to Start Earning?
            </h2>
            <p className="text-base text-slate-300 font-medium">
              "Empowering Women. Creating Opportunities. Building Futures."
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onNavigate('learn')}
                className="btn-gradient-award text-base py-4 px-8"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn-outline-award text-base py-4 px-8"
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
