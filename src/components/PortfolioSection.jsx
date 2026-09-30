import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Heart, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter,
  Share2
} from 'lucide-react';

export default function PortfolioSection({ portfolios, onOpenSubmitModal }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState([]);

  const categories = ['All', 'Digital Marketing', 'Design', 'E-Commerce'];

  const filteredPortfolios = portfolios.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleLike = (id) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter(item => item !== id));
    } else {
      setLikedIds([...likedIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* ========================================================
          VIBRANT AZURE & IRIDESCENT AI CREATOR SHOWCASE BANNER
         ======================================================== */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-[#0B5CFF] via-[#0088FF] to-[#00D2FF] dark:from-[#052A7A] dark:via-[#004BB5] dark:to-[#0088EE] p-6 sm:p-10 border border-blue-300/40 shadow-2xl overflow-hidden text-white">
        
        {/* Floating Glowing Spheres in Background */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-500 blur-2xl opacity-75 pointer-events-none animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-500 via-pink-400 to-cyan-300 blur-2xl opacity-70 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-fuchsia-400 to-indigo-600 blur-xl opacity-60 pointer-events-none"></div>

        {/* TOP-LEFT / TOP-RIGHT BADGES */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
          {/* AI-Generated Glass Badge */}
          <div className="bg-slate-950/70 border border-cyan-400/50 text-cyan-200 text-xs font-black px-3.5 py-2 rounded-2xl flex items-center gap-2 shadow-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-generated Showcase</span>
          </div>
        </div>

        {/* Main Content Layout (Grid with Text on Left & AI Creator Card on Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-10">
          
          {/* Left Column: Title, Description & Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-200 text-xs font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-md">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verified Skill Showcase Gallery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              Learner Portfolio <br />
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-200 bg-clip-text text-transparent">
                Creative Showcase
              </span>
            </h1>

            <p className="text-sm sm:text-base text-cyan-100 font-medium leading-relaxed max-w-xl">
              Real projects created by women completing our skill tracks. Employers view these verified portfolios to offer paid micro-gigs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onOpenSubmitModal}
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Submit New Project</span>
              </button>
            </div>

          </div>

          {/* Right Column: AI Digital Creator Showcase Card (Matching Image Aesthetic) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden border-2 border-cyan-300/50 shadow-[0_20px_50px_rgba(0,136,255,0.6)] bg-slate-900/80 backdrop-blur-xl group hover:border-cyan-300 transition-all">
              
              <img 
                src="/portfolio_creator_ai.jpg" 
                alt="AI Digital Creator Showcase" 
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Glass Overlay Badge on Image */}
              <div className="absolute bottom-3 inset-x-3 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-cyan-400/30 text-white flex items-center justify-between shadow-lg">
                <div>
                  <h4 className="text-xs font-black text-cyan-200">Digital Skill Showcase</h4>
                  <p className="text-[10px] text-cyan-300/80 font-bold">100% Verified Profile Proof</p>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-[11px] font-black">
                  98% Match
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white">
        
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400"
          />
        </div>

      </div>

      {/* Portfolio Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPortfolios.map((portfolio) => {
          const isLiked = likedIds.includes(portfolio.id);
          const likeCount = portfolio.likes + (isLiked ? 1 : 0);

          return (
            <div 
              key={portfolio.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-purple-500/30 overflow-hidden card-hover-award flex flex-col justify-between shadow-md text-slate-900 dark:text-white"
            >
              <div>
                {/* Project Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img 
                    src={portfolio.imageUrl} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {portfolio.category}
                  </div>
                  {portfolio.verified && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Skill
                    </div>
                  )}
                </div>

                {/* Author Info & Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={portfolio.authorAvatar} 
                      alt={portfolio.authorName} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        {portfolio.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">{portfolio.location} • Track: {portfolio.skillTrack}</p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {portfolio.title}
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-3 leading-relaxed font-medium">
                    {portfolio.description}
                  </p>

                  {/* Skill Tag Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {portfolio.tags.map((tag, idx) => (
                      <span key={idx} className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <button 
                  type="button"
                  onClick={() => toggleLike(portfolio.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                    isLiked ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likeCount}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button type="button" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                  <a 
                    href={portfolio.imageUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-purple-700 dark:text-purple-300 hover:underline font-bold flex items-center gap-1"
                  >
                    View Project <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
