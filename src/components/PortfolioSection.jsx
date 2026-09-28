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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Page Header & Action Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            Verified Skill Showcase
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Learner Portfolio Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Real projects created by women completing our skill tracks. Employers view these verified portfolios to offer paid micro-gigs.
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="btn-primary text-xs py-3 px-6 shadow-indigo-600/30 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Submit New Project
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl text-white">
        
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
            className="w-full bg-slate-800 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
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
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover flex flex-col justify-between"
            >
              <div>
                {/* Project Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img 
                    src={portfolio.imageUrl} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full">
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
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        {portfolio.authorName}
                      </h4>
                      <p className="text-[11px] text-slate-500">{portfolio.location} • Track: {portfolio.skillTrack}</p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {portfolio.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {portfolio.description}
                  </p>

                  {/* Skill Tag Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {portfolio.tags.map((tag, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button 
                  onClick={() => toggleLike(portfolio.id)}
                  className={`flex items-center gap-1.5 font-bold transition-colors ${
                    isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{likeCount}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button className="hover:text-slate-900 flex items-center gap-1 font-semibold">
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </button>
                  <a 
                    href={portfolio.imageUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
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
