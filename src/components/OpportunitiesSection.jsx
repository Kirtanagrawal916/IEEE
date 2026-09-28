import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Search, 
  Building, 
  Send,
  Sparkles
} from 'lucide-react';

export default function OpportunitiesSection({ opportunities, onApplyGig }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Digital Marketing', 'Design', 'E-Commerce'];

  const filteredGigs = opportunities.filter(g => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 md:p-8 border border-rose-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            Verified Paid Opportunities
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Micro-Gigs & Flexible Work Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Apply directly to curated remote gigs and internships posted by vetted small businesses looking for trained women creators.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-center space-y-1 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Verified Clients Only</span>
          <span className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> 100% Escrow Protected
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl text-white">
        
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-md'
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
            placeholder="Search by gig, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500 placeholder-slate-400"
          />
        </div>

      </div>

      {/* Opportunities List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredGigs.map((gig) => (
          <div 
            key={gig.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              
              {/* Header: Company, Title & Pay */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={gig.logo} 
                    alt={gig.company} 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {gig.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {gig.company}
                      {gig.verifiedClient && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="Verified Client" />
                      )}
                    </p>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xs">
                  {gig.stipend}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {gig.description}
              </p>

              {/* Key Deliverables Bullet Points */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Key Deliverables:</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700 font-medium">
                  {gig.deliverables.map((d, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      • {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {gig.skillsRequired.map((skill, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>

            </div>

            {/* Footer & Apply Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 font-medium space-x-2">
                <span>{gig.type}</span>
                <span>•</span>
                <span className="text-indigo-600 font-semibold">{gig.applicantsCount} Applied</span>
              </div>

              <button
                onClick={() => onApplyGig(gig)}
                disabled={gig.applied}
                className={`btn-primary text-xs py-2.5 px-5 ${
                  gig.applied 
                    ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'
                }`}
              >
                {gig.applied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Application Submitted
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Apply with Portfolio
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
