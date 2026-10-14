import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Search, 
  Building, 
  Filter, 
  X, 
  ArrowUpDown, 
  ShieldCheck, 
  SlidersHorizontal, 
  Check, 
  Home as HomeIcon,
  Sparkles,
  RotateCcw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import JobCard from './ui/JobCard';
import TrustScamBanner from './ui/TrustScamBanner';
import { 
  calculateSkillMatch, 
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Filter States initialized from URL params if present
  const [opportunities, setOpportunities] = useState(propOpportunities || []);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState('All');
  const [sortBy, setSortBy] = useState('highest_match'); // 'highest_match' | 'highest_pay' | 'newest'
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (propOpportunities && propOpportunities.length > 0) {
      setOpportunities(propOpportunities);
    }
  }, [propOpportunities]);

  // Sync with backend API if filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const filters = {};
        if (selectedCategory !== 'All') filters.category = selectedCategory;
        if (searchQuery.trim()) filters.search = searchQuery.trim();

        const res = await api.getOpportunities(filters);
        if (res.success && res.opportunities) {
          setOpportunities(res.opportunities);
        }
      } catch (err) {
        // Fallback to in-memory filter
      }
    };

    fetchFiltered();
  }, [selectedCategory, searchQuery]);

  // Categories list
  const categories = [
    'All',
    'Digital Marketing',
    'Design',
    'E-Commerce',
    'Startup cohort',
    'Scholarship',
    'Learning Program'
  ];

  // Locations list
  const locations = [
    'All',
    'Remote',
    'Remote (India)',
    'Delhi NCR',
    'Mumbai',
    'PAN India'
  ];

  // User skills
  const userSkills = (user && user.skills && user.skills.length > 0) 
    ? user.skills 
    : DEFAULT_USER_SKILLS;

  // Multi-facet filtering logic
  const filteredGigs = opportunities.filter((gig) => {
    // 1. Category
    const matchesCategory = selectedCategory === 'All' || 
      (gig.category || '').toLowerCase() === selectedCategory.toLowerCase();

    // 2. Location
    const gigLoc = (gig.location || '').toLowerCase();
    const matchesLocation = selectedLocation === 'All' || 
      gigLoc.includes(selectedLocation.toLowerCase());

    // 3. Remote only toggle
    const matchesRemote = !onlyRemote || 
      gigLoc.includes('remote') || 
      (gig.type || '').toLowerCase().includes('remote');

    // 4. Job Type
    const matchesJobType = selectedJobType === 'All' || 
      (gig.type || '').toLowerCase().includes(selectedJobType.toLowerCase());

    // 5. Match Filter
    const matchRes = calculateSkillMatch(userSkills, gig.skillsRequired);
    const matchesMatchFilter = selectedMatchFilter === 'All' ||
      (selectedMatchFilter === 'HighMatch' && matchRes.matchPercentage >= 75) ||
      (selectedMatchFilter === 'ExactMatch' && matchRes.matchPercentage === 100);

    // 6. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      (gig.title || '').toLowerCase().includes(query) ||
      (gig.company || '').toLowerCase().includes(query) ||
      (gig.description || '').toLowerCase().includes(query) ||
      (gig.location || '').toLowerCase().includes(query) ||
      (gig.skillsRequired && gig.skillsRequired.some(s => s.toLowerCase().includes(query)));

    return matchesCategory && matchesLocation && matchesRemote && matchesJobType && matchesMatchFilter && matchesSearch;
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
    if (sortBy === 'newest') {
      return (b.id || '').localeCompare(a.id || '');
    }
    return 0;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedCategory('All');
    setSelectedJobType('All');
    setOnlyRemote(false);
    setSelectedExperience('All');
    setSelectedMatchFilter('All');
    setSortBy('highest_match');
  };

  const hasActiveFilters = searchQuery || selectedLocation !== 'All' || selectedCategory !== 'All' || selectedJobType !== 'All' || onlyRemote || selectedMatchFilter !== 'All';

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-slate-100 pb-20">
      
      {/* ========================================================
          1. HEADER BANNER (Clear, Welcoming, Trustworthy)
         ======================================================== */}
      <section className="bg-gradient-to-b from-[#FFF9F5] via-[#F3E8FF]/40 to-[#FFF9F5] dark:from-[#0F0918] dark:via-[#191026] dark:to-[#0F0918] border-b border-[#E5E7EB] dark:border-purple-900/30 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF7ED] dark:bg-orange-950/40 border border-[#FED7AA] text-[#EA580C] dark:text-orange-300 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
            <span>100% Free Job Board for Women • Verified Work</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-[#1F2937] dark:text-white tracking-tight">
            Explore Free Job & Gig Listings
          </h1>

          <p className="text-sm sm:text-base text-[#4B5563] dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover flexible work-from-home gigs, micro-projects, and returnships. Every job here is 100% free to apply with zero hidden fees.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#16A34A] bg-[#DCFCE7] dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
              <Check className="w-3.5 h-3.5" />
              <span>{opportunities.length} Active Openings</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#7C3AED] bg-[#F3E8FF] dark:bg-purple-950/40 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Escrow Pay Protection</span>
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. MAIN CONTENT AREA
         ======================================================== */}
      <main className="site-container pt-8 space-y-6">
        
        {/* Scam Warning Tip */}
        <TrustScamBanner />

        {/* ========================================================
            3. SEARCH & COMPREHENSIVE FILTER CONTROLS
           ======================================================== */}
        <div className="bg-white dark:bg-[#191026] p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] dark:border-purple-900/40 shadow-sm space-y-4">
          
          {/* Top Row: Search Input + WFH Toggle + Filter Button */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by job title, skill, company, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 pr-4 text-sm"
                aria-label="Search jobs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Remote Toggle */}
            <button
              type="button"
              onClick={() => setOnlyRemote(!onlyRemote)}
              className={`tap-target px-4 py-2.5 rounded-xl text-xs font-bold font-heading border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                onlyRemote
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                  : 'bg-[#FFF9F5] dark:bg-[#231738] border-[#E5E7EB] dark:border-purple-800/40 text-[#4B5563] dark:text-slate-300 hover:border-[#7C3AED]/40'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Work From Home Only</span>
            </button>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="md:hidden tap-target px-4 py-2.5 rounded-xl bg-[#F3E8FF] text-[#6D28D9] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && '• Active'}</span>
            </button>
          </div>

          {/* Bottom Filter Controls (Visible on Desktop, collapsible on Mobile) */}
          <div className={`pt-2 border-t border-slate-100 dark:border-purple-900/20 ${isFilterDrawerOpen ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Category Filter */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] dark:text-slate-400 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#FFF9F5] dark:bg-[#201533] border border-[#E5E7EB] dark:border-purple-800/40 text-[#1F2937] dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#7C3AED]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] dark:text-slate-400 mb-1">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-[#FFF9F5] dark:bg-[#201533] border border-[#E5E7EB] dark:border-purple-800/40 text-[#1F2937] dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#7C3AED]"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] dark:text-slate-400 mb-1">Job Type</label>
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full bg-[#FFF9F5] dark:bg-[#201533] border border-[#E5E7EB] dark:border-purple-800/40 text-[#1F2937] dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="All">All Job Types</option>
                  <option value="Micro-Gig">Micro-Gig</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                </select>
              </div>

              {/* Sorting Filter */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B7280] dark:text-slate-400 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#FFF9F5] dark:bg-[#201533] border border-[#E5E7EB] dark:border-purple-800/40 text-[#1F2937] dark:text-white text-xs font-semibold rounded-xl px-3 py-2.5 min-h-[44px] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="highest_match">Highest Skill Match</option>
                  <option value="highest_pay">Highest Stipend / Pay</option>
                  <option value="newest">Recently Posted</option>
                </select>
              </div>

            </div>

            {/* Active Filter Summary Bar */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 dark:border-purple-900/20 text-xs">
                <span className="text-[#6B7280] dark:text-slate-400 font-medium">
                  Showing <strong>{sortedGigs.length}</strong> matching results
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-[#EA580C] hover:underline font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================
            4. RESULTS HEADER & COUNT
           ======================================================== */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-[#1F2937] dark:text-white">
              {sortedGigs.length} Free {sortedGigs.length === 1 ? 'Opportunity' : 'Opportunities'} Available
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-slate-400">
              Verified roles with direct application and zero registration fees.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/post-gig')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#1E1233] border border-[#FED7AA] text-[#EA580C] text-xs font-bold font-heading hover:bg-[#FFF7ED] transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post an Opportunity (Free)</span>
          </button>
        </div>

        {/* ========================================================
            5. JOB CARDS GRID OR EMPTY STATE
           ======================================================== */}
        {sortedGigs.length === 0 ? (
          <div className="bg-white dark:bg-[#191026] rounded-2xl p-10 sm:p-14 text-center border border-[#E5E7EB] dark:border-purple-900/40 shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF9F5] dark:bg-[#231738] border border-[#FED7AA] flex items-center justify-center text-[#EA580C]">
              <Briefcase className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold font-heading text-[#1F2937] dark:text-white">
              No Opportunities Match Your Current Filters
            </h3>

            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
              We couldn't find any job listings matching your specific criteria. Try broadening your keywords, removing location filters, or resetting your choices.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="tap-target px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold font-heading text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Show All Open Opportunities</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGigs.map((gig) => {
              const matchResult = calculateSkillMatch(userSkills, gig.skillsRequired);
              return (
                <JobCard
                  key={gig.id}
                  job={gig}
                  matchPercentage={matchResult.matchPercentage}
                  onViewDetails={() => onViewDetails ? onViewDetails(gig) : navigate(`/opportunities/${gig.id}`)}
                  onApply={() => onApplyGig ? onApplyGig(gig) : navigate(`/opportunities/${gig.id}/apply`)}
                />
              );
            })}
          </div>
        )}

      </main>

    </div>
  );
}
