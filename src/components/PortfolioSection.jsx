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
          ISOMETRIC DIGITAL CREATOR WORKSPACE BACKGROUND CONTAINER
         ======================================================== */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-[#06152B] via-[#0B2240] to-[#0E1C30] p-6 sm:p-10 border border-slate-700/60 shadow-2xl overflow-hidden text-white">
        
        {/* NEON LIME GREEN RING (TOP-RIGHT - MATCHING REFERENCE IMAGE) */}
        <div className="w-44 h-44 sm:w-64 sm:h-64 rounded-full border-[10px] sm:border-[16px] border-lime-400 shadow-[0_0_45px_rgba(163,230,53,0.85),inset_0_0_25px_rgba(163,230,53,0.6)] absolute -top-12 -right-12 sm:-top-20 sm:-right-20 z-0 opacity-90 pointer-events-none animate-pulse"></div>

        {/* NEON CORAL PINK RING (LEFT-CENTER - MATCHING REFERENCE IMAGE) */}
        <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full border-[8px] sm:border-[14px] border-rose-400 shadow-[0_0_40px_rgba(251,113,133,0.85),inset_0_0_20px_rgba(251,113,133,0.6)] absolute top-1/4 -left-16 sm:-left-20 z-0 opacity-85 pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* ELECTRIC CYAN ORB DISC (BOTTOM-RIGHT - MATCHING REFERENCE IMAGE) */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 shadow-[0_0_50px_rgba(34,211,238,0.85)] absolute -bottom-16 -right-16 sm:-bottom-20 sm:-right-20 z-0 opacity-85 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Isometric Code Lines Watermark Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 flex flex-col gap-3 font-mono text-[10px] tracking-widest uppercase select-none overflow-hidden text-cyan-300"
          style={{ transform: 'rotate(-15deg) scale(1.3)' }}
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap">
              01001100 01101111 01110010 01100101 01101101 • HER-EARN PORTFOLIO CREATOR CODE • 01001001 01000101 01000101
            </div>
          ))}
        </div>

        {/* Background Grid Pattern Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(56,189,248,0.8) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)'
          }}
        ></div>

        {/* Content Layer Inside Isometric Glass Canvas */}
        <div className="relative z-10 space-y-8">
          
          {/* Header & Action Bar */}
          <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-cyan-400/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-bold shadow-sm">
                <Award className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Verified Skill Showcase • Digital Creator Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Learner Portfolio Gallery
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100/90 max-w-xl font-medium leading-relaxed">
                Real projects created by women completing our skill tracks. Employers view these verified portfolios to offer paid micro-gigs.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center gap-2 flex-shrink-0 cursor-pointer transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Project</span>
            </button>
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

      </div>

    </div>
  );
}
