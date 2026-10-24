import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Search, 
  Building, 
  Send,
  Sparkles,
  Filter,
  X,
  ArrowUpDown,
  ShieldCheck,
  Zap,
  PlusCircle,
  Eye,
  Info,
  Calendar,
  Layers,
  Target,
  SlidersHorizontal,
  Check,
  Award,
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { 
  calculateSkillMatch, 
  AVAILABLE_SKILLS, 
  DEFAULT_USER_SKILLS 
} from '../utils/skillMatcher';

export default function OpportunitiesSection({ 
  opportunities: propOpportunities, 
  user, 
  onApplyGig, 
  onViewDetails,
  onUpdateUserSkills 
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Parse incoming query parameters from home search or category chips
  const urlSearch = searchParams.get('search') || searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlSkill = searchParams.get('skill') || '';

  const [opportunities, setOpportunities] = useState(propOpportunities || []);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState('All'); // 'All', 'HighMatch' (75%+), 'ExactMatch' (100%)
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('highest_match'); // 'highest_match', 'newest', 'highest_pay', 'applicants'
  const [activeSkillFilter, setActiveSkillFilter] = useState(urlSkill || null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when URL search parameters change
  useEffect(() => {
    const query = searchParams.get('search') || searchParams.get('q') || '';
    const cat = searchParams.get('category') || '';
    const sk = searchParams.get('skill') || null;

    if (query !== undefined && query !== searchQuery) setSearchQuery(query);
    if (cat && cat !== selectedCategory) setSelectedCategory(cat);
    if (sk !== activeSkillFilter) setActiveSkillFilter(sk);
  }, [searchParams]);

  useEffect(() => {
    if (propOpportunities && propOpportunities.length > 0) {
      setOpportunities(propOpportunities);
    }
  }, [propOpportunities]);

  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true);
      try {
        const filters = {};
        if (selectedCategory !== 'All') filters.category = selectedCategory;
        if (searchQuery.trim()) filters.search = searchQuery.trim();
        if (activeSkillFilter) filters.skill = activeSkillFilter;

        const res = await api.getOpportunities(filters);
        if (res.success && res.opportunities) {
          setOpportunities(res.opportunities);
        }
      } catch (err) {
        // Fallback to props
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiltered();
  }, [selectedCategory, searchQuery, activeSkillFilter]);

  const categories = useMemo(() => {
    const fromGigs = (opportunities || []).map(g => g.category).filter(Boolean);
    const standard = ['Startup cohort', 'Scholarship', 'Learning Program', 'Digital Marketing', 'Design', 'Content Writing', 'E-Commerce & Shopify'];
    return ['All', ...Array.from(new Set([...fromGigs, ...standard]))];
  }, [opportunities]);

  // Current active user skills
  const userSkills = (user && user.skills && user.skills.length > 0) 
    ? user.skills 
    : DEFAULT_USER_SKILLS;

  // Filtering logic
  const filteredGigs = opportunities.filter(g => {
    const gigCat = (g.category || '').toLowerCase();
    const selCat = (selectedCategory || '').toLowerCase();
    const matchesCategory = selectedCategory === 'All' || 
                            gigCat === selCat ||
                            (selCat.includes('design') && gigCat.includes('design')) ||
                            (selCat.includes('marketing') && gigCat.includes('marketing')) ||
                            (selCat.includes('commerce') && gigCat.includes('commerce'));

    const gigSkills = Array.isArray(g.skillsRequired) 
      ? g.skillsRequired 
      : (Array.isArray(g.skills) ? g.skills : []);

    const matchesSkill = !activeSkillFilter || gigSkills.some(s => s.toLowerCase() === activeSkillFilter.toLowerCase());
    
    const matchRes = calculateSkillMatch(userSkills, gigSkills);
    const matchesMatchFilter = selectedMatchFilter === 'All' ||
                               (selectedMatchFilter === 'HighMatch' && matchRes.matchPercentage >= 75) ||
                               (selectedMatchFilter === 'ExactMatch' && matchRes.matchPercentage === 100);

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
                          (g.title || '').toLowerCase().includes(query) ||
                          (g.company || '').toLowerCase().includes(query) ||
                          (g.description || '').toLowerCase().includes(query) ||
                          (g.location || '').toLowerCase().includes(query) ||
                          gigSkills.some(s => s.toLowerCase().includes(query));
    return matchesCategory && matchesSkill && matchesMatchFilter && matchesSearch;
  });

  // Sorting logic
  const sortedGigs = [...filteredGigs].sort((a, b) => {
    const matchA = calculateSkillMatch(userSkills, a.skillsRequired).matchPercentage;
    const matchB = calculateSkillMatch(userSkills, b.skillsRequired).matchPercentage;

    if (sortBy === 'highest_match') {
      return matchB - matchA;
    }
    if (sortBy === 'highest_pay') {
      const getNum = (str) => parseInt(str?.replace(/[^0-9]/g, '') || '0', 10);
      return getNum(b.stipend) - getNum(a.stipend);
    }
    return 0;
  });

  const scrollToGigs = () => {
    const elem = document.getElementById('gigs-list-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white animate-fade-in pb-16">
      
      {/* ========================================================
          1. ELEGANT PASTEL HERO BANNER (Matching Reference Image)
         ======================================================== */}
      <section className="bg-gradient-to-b from-[#F5E6FE] via-[#FBF5FF] to-[#FAF8FC] dark:from-[#1E0D33] dark:via-[#160A25] dark:to-[#0F0818] border-b border-purple-100 dark:border-purple-950/60 py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
          
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
            CURATED FOR YOUR NEXT STEP
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Opportunities that move your career forward.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover returnships, programmes and roles from HerEarn partner organisations. Find a path that fits where you are today, then register your interest and we’ll help you take the next step.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={scrollToGigs}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-7 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-105"
            >
              <span>Explore opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. SECTION HEADER & COMMUNITY ACTION (Matching Reference Image)
         ======================================================== */}
      <div className="w-full px-4 sm:px-8 lg:px-12 pt-10 pb-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
              FIND YOUR NEXT OPENING
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Curated opportunities, made more accessible
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl font-medium">
              Explore roles and programmes shared by organisations creating more inclusive pathways into work.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-sm">
              <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span><strong>{sortedGigs.length}</strong> openings</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/post-gig')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold px-5 py-2.5 rounded-full text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <Users className="w-4 h-4" />
              <span>Join Our Community →</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================
          3. SEARCH & CATEGORY FILTERS BAR
         ======================================================== */}
      <div id="gigs-list-section" className="w-full px-4 sm:px-8 lg:px-12 space-y-6">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search roles, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Match filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500">Filter:</span>
              <select
                value={selectedMatchFilter}
                onChange={(e) => setSelectedMatchFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              >
                <option value="All">All Opportunities</option>
                <option value="HighMatch">High Match (75%+)</option>
                <option value="ExactMatch">Exact Match (100%)</option>
              </select>
            </div>

          </div>

        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-purple-100 dark:bg-purple-900/40 rounded-md"></div>
                  <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2">
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : sortedGigs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-purple-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No Opportunities Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No active listings match your current filters. Try resetting your search or exploring other categories.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setActiveSkillFilter(null);
                setSelectedMatchFilter('All');
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGigs.map((gig) => {
              const matchResult = calculateSkillMatch(userSkills, gig.skillsRequired);

              return (
                <div
                  key={gig.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group reveal-on-scroll"
                >
                  {/* Top Purple Gradient Accent Strip */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>

                  <div>
                    {/* Category Label at Top Left */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 capitalize">
                        {gig.category || 'Learning Program'}
                      </span>
                      {matchResult.matchPercentage >= 75 && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300">
                          {matchResult.matchPercentage}% Match
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onViewDetails ? onViewDetails(gig) : navigate(`/opportunities/${gig.id}`)}
                      className="text-lg font-extrabold text-purple-950 dark:text-purple-100 hover:text-purple-600 transition-colors leading-snug mb-4 cursor-pointer"
                    >
                      {gig.title}
                    </h3>

                    {/* Inset Info Box (Matching Reference Image Box Structure) */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2.5 mb-4 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{gig.company}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                        <span>{gig.location || 'PAN India'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{gig.stipend || 'First Year Students experience'}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-6 font-medium">
                      {gig.description}
                    </p>
                  </div>

                  {/* Dual Bottom Pill Buttons (Matching Reference Image Buttons) */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => onApplyGig(gig)}
                      disabled={gig.applied}
                      className={`w-full py-3 px-4 rounded-full font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all cursor-pointer ${
                        gig.applied 
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-[1.02]'
                      }`}
                    >
                      <span>{gig.applied ? 'Already Applied' : 'Register Interest'}</span>
                      {!gig.applied && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDetails ? onViewDetails(gig) : navigate(`/opportunities/${gig.id}`)}
                      className="w-full py-2.5 px-4 rounded-full bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 active:scale-[0.98] font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
