import React, { useState, useEffect } from 'react';
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
  Award
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
  const [opportunities, setOpportunities] = useState(propOpportunities || []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState('All'); // 'All', 'HighMatch' (75%+), 'ExactMatch' (100%)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('highest_match'); // 'highest_match', 'newest', 'highest_pay', 'applicants'
  const [activeSkillFilter, setActiveSkillFilter] = useState(null);
  const [isSkillsDrawerOpen, setIsSkillsDrawerOpen] = useState(true);

  useEffect(() => {
    if (propOpportunities && propOpportunities.length > 0) {
      setOpportunities(propOpportunities);
    }
  }, [propOpportunities]);

  useEffect(() => {
    const fetchFiltered = async () => {
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
      }
    };

    fetchFiltered();
  }, [selectedCategory, searchQuery, activeSkillFilter]);

  // Modal states
  const [detailModalGig, setDetailModalGig] = useState(null);
  const [isPostGigOpen, setIsPostGigOpen] = useState(false);
  const [postGigSuccess, setPostGigSuccess] = useState(false);
  const [newGigForm, setNewGigForm] = useState({
    title: '',
    company: '',
    category: 'Digital Marketing',
    type: 'Micro-Gig',
    stipend: '₹5,000 (Flat Fee)',
    description: '',
    deliverables: '',
    skillsRequired: ''
  });

  const categories = ['All', 'Digital Marketing', 'Design', 'E-Commerce', 'Content Writing'];
  const gigTypes = ['All', 'Micro-Gig', 'Remote Part-time', 'Remote Internship'];

  // Current active user skills
  const userSkills = (user && user.skills && user.skills.length > 0) 
    ? user.skills 
    : DEFAULT_USER_SKILLS;

  // Skill toggle handler
  const toggleUserSkill = (skillName) => {
    let updated;
    const exists = userSkills.some(s => s.toLowerCase().trim() === skillName.toLowerCase().trim());
    if (exists) {
      updated = userSkills.filter(s => s.toLowerCase().trim() !== skillName.toLowerCase().trim());
    } else {
      updated = [...userSkills, skillName];
    }
    if (onUpdateUserSkills) {
      onUpdateUserSkills(updated);
    }
  };

  // Filtering logic
  const filteredGigs = opportunities.filter(g => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesType = selectedType === 'All' || g.type === selectedType;
    const matchesSkill = !activeSkillFilter || (g.skillsRequired && g.skillsRequired.includes(activeSkillFilter));
    
    // Skill match filter
    const matchRes = calculateSkillMatch(userSkills, g.skillsRequired);
    const matchesMatchFilter = selectedMatchFilter === 'All' ||
                               (selectedMatchFilter === 'HighMatch' && matchRes.matchPercentage >= 75) ||
                               (selectedMatchFilter === 'ExactMatch' && matchRes.matchPercentage === 100);

    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
                          g.title.toLowerCase().includes(query) ||
                          g.company.toLowerCase().includes(query) ||
                          g.description.toLowerCase().includes(query) ||
                          (g.skillsRequired && g.skillsRequired.some(s => s.toLowerCase().includes(query)));
    return matchesCategory && matchesType && matchesSkill && matchesMatchFilter && matchesSearch;
  });

  // Sorting logic (Default to Highest Match %)
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
    if (sortBy === 'applicants') {
      return (b.applicantsCount || 0) - (a.applicantsCount || 0);
    }
    return 0; // default newest
  });

  const handlePostGigSubmit = (e) => {
    e.preventDefault();
    setPostGigSuccess(true);
    setTimeout(() => {
      setPostGigSuccess(false);
      setIsPostGigOpen(false);
      setNewGigForm({
        title: '',
        company: '',
        category: 'Digital Marketing',
        type: 'Micro-Gig',
        stipend: '₹5,000 (Flat Fee)',
        description: '',
        deliverables: '',
        skillsRequired: ''
      });
    }, 2000);
  };

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedMatchFilter('All');
    setSearchQuery('');
    setSortBy('highest_match');
    setActiveSkillFilter(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-purple-500/30 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Verified Micro-Gigs & Paid Flexible Work
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Opportunities & Skill Matcher Board
            </h1>
            
            <p className="text-sm sm:text-base text-purple-100 font-medium leading-relaxed">
              Apply directly to curated remote projects, retainer gigs, and internships with live <strong className="text-pink-300 font-bold">Skill Match %</strong> calculated based on your profile skills.
            </p>

            {/* Banner Quick Stats */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-purple-200">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <Briefcase className="w-4 h-4 text-purple-300" />
                <strong className="text-white font-extrabold">{opportunities.length}</strong> Live Active Gigs
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <Target className="w-4 h-4 text-pink-400" />
                Real-Time Skill Matching
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Escrow Protected
              </span>
            </div>
          </div>

          {/* Action CTAs in Banner */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setIsPostGigOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg hover:shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Post a Client Opportunity
            </button>
            <div className="bg-slate-950/70 border border-purple-400/20 p-3 rounded-2xl text-center backdrop-blur-md">
              <span className="text-[11px] text-purple-300 font-bold uppercase block">Avg Payout Range</span>
              <span className="text-base font-extrabold text-emerald-400">₹3,500 – ₹12,000 / mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Interactive Skill Matcher Panel */}
      <div className="bg-gradient-to-r from-purple-900/90 via-indigo-950 to-slate-900 border border-purple-500/30 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow-md">
              <Target className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">Skill Matcher System</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Live Match Calculation
                </span>
              </div>
              <p className="text-xs text-purple-200 font-medium">
                Check or uncheck your active skills below to recalculate 🎯 <strong className="text-pink-300">Match %</strong> for every opportunity card in real time.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSkillsDrawerOpen(!isSkillsDrawerOpen)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-purple-800/60 hover:bg-purple-800 border border-purple-400/30 text-purple-200 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-pink-400" />
            {isSkillsDrawerOpen ? 'Collapse Checklist' : 'Customize My Skills'}
          </button>
        </div>

        {/* Interactive Skill Checkboxes */}
        {isSkillsDrawerOpen && (
          <div className="pt-3 border-t border-purple-500/20 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Select Your Active Skills:
              </span>
              <span className="font-extrabold text-pink-300 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-400/30">
                {userSkills.length} Active Skills Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {AVAILABLE_SKILLS.slice(0, 12).map((skillName) => {
                const isChecked = userSkills.some(s => s.toLowerCase().trim() === skillName.toLowerCase().trim());
                return (
                  <label
                    key={skillName}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all select-none ${
                      isChecked
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-pink-400 text-white shadow-md ring-1 ring-pink-400/50'
                        : 'bg-slate-900/80 border-purple-500/20 text-slate-300 hover:border-purple-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleUserSkill(skillName)}
                      className="w-3.5 h-3.5 rounded text-pink-500 focus:ring-purple-400 cursor-pointer"
                    />
                    <span className="truncate">{skillName}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-purple-500/30 shadow-md space-y-4">
        
        {/* Top Row: Search & Dropdown Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, company, or required skill (e.g. Canva, Instagram, Shopify)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Match Filter, Work Type & Sort dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            
            {/* Match % Filter Dropdown */}
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 px-3 py-2 rounded-2xl text-xs">
              <Target className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span className="text-purple-900 dark:text-purple-300 font-bold">Match %:</span>
              <select
                value={selectedMatchFilter}
                onChange={(e) => setSelectedMatchFilter(e.target.value)}
                className="bg-transparent text-purple-900 dark:text-white font-extrabold focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-slate-900">All Matches</option>
                <option value="HighMatch" className="bg-white dark:bg-slate-900">🎯 High Match (75%+ Only)</option>
                <option value="ExactMatch" className="bg-white dark:bg-slate-900">🎯 100% Exact Match</option>
              </select>
            </div>

            {/* Work Type Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-2xl text-xs">
              <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
              >
                {gigTypes.map(t => (
                  <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-2xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="highest_match" className="bg-white dark:bg-slate-900">Highest Match %</option>
                <option value="newest" className="bg-white dark:bg-slate-900">Newest First</option>
                <option value="highest_pay" className="bg-white dark:bg-slate-900">Highest Pay</option>
                <option value="applicants" className="bg-white dark:bg-slate-900">Most Popular</option>
              </select>
            </div>

          </div>
        </div>

        {/* Category Filter Pills & Active Skill Badge */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Skill Filter tag if set */}
          {activeSkillFilter && (
            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-300 dark:border-purple-700">
              <span>Skill Filter: {activeSkillFilter}</span>
              <button onClick={() => setActiveSkillFilter(null)} className="hover:text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reset Filters button if any active */}
          {(selectedCategory !== 'All' || selectedType !== 'All' || selectedMatchFilter !== 'All' || searchQuery || activeSkillFilter) && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
        <span>Showing <strong className="text-slate-900 dark:text-white font-extrabold">{sortedGigs.length}</strong> matching opportunities</span>
        {sortedGigs.length > 0 && <span>Calculated against {userSkills.length} skills in your profile</span>}
      </div>

      {/* Opportunities List Grid with 🎯 Skill Match Badges */}
      {sortedGigs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {sortedGigs.map((gig) => {
            const matchRes = calculateSkillMatch(userSkills, gig.skillsRequired);

            return (
              <div 
                key={gig.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-purple-500/30 p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-slate-900 dark:text-white relative group"
              >
                
                <div className="space-y-4">
                  
                  {/* Top Row: Category Tag, Work Type & 🎯 Match % Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {gig.category || 'Gig'}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {gig.type || 'Remote'}
                      </span>
                    </div>

                    {/* 🎯 Skill Match Badge */}
                    <div className={`px-3 py-1 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm border ${
                      matchRes.matchPercentage >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300'
                        : matchRes.matchPercentage >= 50
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-300'
                        : 'bg-slate-800 text-amber-300 border-slate-700'
                    }`}>
                      <Target className="w-3.5 h-3.5" />
                      <span>🎯 {matchRes.matchPercentage}% Match</span>
                    </div>
                  </div>

                  {/* Company & Title Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={gig.logo} 
                        alt={gig.company} 
                        className="w-12 h-12 rounded-2xl object-cover border border-purple-200 dark:border-purple-500/40 shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                          {gig.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                          {gig.company}
                          {gig.verifiedClient && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" title="Verified Client" />
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Stipend Badge */}
                    <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 text-xs font-extrabold px-3 py-1.5 rounded-2xl whitespace-nowrap shadow-xs flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {gig.stipend}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
                    {gig.description}
                  </p>

                  {/* Key Deliverables */}
                  {gig.deliverables && gig.deliverables.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-950/70 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        Key Deliverables
                      </p>
                      <div className="grid sm:grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {gig.deliverables.slice(0, 2).map((d, idx) => (
                          <span key={idx} className="flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{d}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 🎯 Required Skills Pills with Matched vs Missing Indicators */}
                  {gig.skillsRequired && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <span>Required Skills:</span>
                        <span className="text-purple-600 dark:text-pink-400">{matchRes.matchedSkills.length}/{matchRes.totalRequired} Skills Matched</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {gig.skillsRequired.map((skill, idx) => {
                          const isMatched = matchRes.matchedSkills.includes(skill);
                          return (
                            <span
                              key={idx}
                              onClick={() => setActiveSkillFilter(skill)}
                              title={isMatched ? `Skill Matched: ${skill}` : `Missing Skill: ${skill}`}
                              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                                isMatched
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {isMatched ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              ) : (
                                <X className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                              <span>{skill} {isMatched ? '✓' : '✗'}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center justify-between sm:justify-start gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-500" />
                      {gig.location || 'Remote'}
                    </span>
                    <span>•</span>
                    <span className="text-purple-700 dark:text-purple-400 font-bold">
                      {gig.applicantsCount || 0} Applied
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewDetails) {
                          onViewDetails(gig);
                        } else {
                          setDetailModalGig(gig);
                        }
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="View Full Details & Match Breakdown"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onApplyGig(gig)}
                      disabled={gig.applied}
                      className={`flex-1 sm:flex-none btn-gradient-award text-xs py-2.5 px-5 cursor-pointer font-bold ${
                        gig.applied 
                          ? 'opacity-75 cursor-not-allowed shadow-none' 
                          : ''
                      }`}
                    >
                      {gig.applied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          Applied
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Apply ({matchRes.matchPercentage}% Match)
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-12 text-center space-y-4 shadow-md">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto">
            <Target className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Matching Opportunities Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We couldn't find opportunities matching your current filters or match requirement. Try resetting your search or selecting more skills above.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Detailed Opportunity View Modal with 🎯 Skill Match Breakdown */}
      {detailModalGig && (() => {
        const detailMatch = calculateSkillMatch(userSkills, detailModalGig.skillsRequired);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative space-y-6">
              
              <button 
                onClick={() => setDetailModalGig(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 pr-8">
                <img 
                  src={detailModalGig.logo} 
                  alt={detailModalGig.company} 
                  className="w-16 h-16 rounded-2xl object-cover border border-purple-300 dark:border-purple-500/40 shadow-sm"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                      {detailModalGig.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">• {detailModalGig.type}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{detailModalGig.title}</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    {detailModalGig.company}
                    {detailModalGig.verifiedClient && (
                      <span className="text-emerald-500 font-extrabold text-[11px] flex items-center gap-0.5 ml-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Client
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* 🎯 Skill Match Breakdown Box */}
              <div className="bg-purple-50/80 dark:bg-purple-950/40 p-4 sm:p-5 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-pink-500" />
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      Skill Match Score: <span className="text-pink-600 dark:text-pink-400">🎯 {detailMatch.matchPercentage}% Match</span>
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                    {detailMatch.matchedSkills.length} of {detailMatch.totalRequired} Skills Matched
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
                  {/* Matched Skills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Your Matched Skills:
                    </span>
                    {detailMatch.matchedSkills.length > 0 ? (
                      detailMatch.matchedSkills.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{s} ✓</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs italic">No direct skill match yet</p>
                    )}
                  </div>

                  {/* Missing Skills */}
                  {detailMatch.missingSkills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        Missing Skills for 100%:
                      </span>
                      {detailMatch.missingSkills.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                          <span className="flex items-center gap-1.5">
                            <X className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{s} ✗</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleUserSkill(s)}
                            className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white px-2 py-0.5 rounded-md font-bold"
                          >
                            + Add Skill
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Stipend / Fee</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{detailModalGig.stipend}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Duration</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{detailModalGig.duration || 'Flexible'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block">Applicants</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{detailModalGig.applicantsCount || 0} Learners Applied</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Role Overview & Description</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  {detailModalGig.description}
                </p>
              </div>

              {/* Deliverables List */}
              {detailModalGig.deliverables && detailModalGig.deliverables.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Required Deliverables</h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {detailModalGig.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 bg-purple-50/50 dark:bg-purple-950/30 p-2.5 rounded-xl border border-purple-100 dark:border-purple-900/40">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Escrow Guarantee Banner */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  100% Escrow Protected Payment Guarantee
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  The agreed stipend amount is reserved by HerEarn Escrow before work starts and released upon successful project delivery.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDetailModalGig(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDetailModalGig(null);
                    onApplyGig(detailModalGig);
                  }}
                  disabled={detailModalGig.applied}
                  className="btn-gradient-award text-xs py-2.5 px-6 font-bold cursor-pointer"
                >
                  {detailModalGig.applied ? 'Already Applied' : `Apply Now (${detailMatch.matchPercentage}% Match)`}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Post a Client Opportunity Modal */}
      {isPostGigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative space-y-5">
            
            <button 
              onClick={() => setIsPostGigOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 text-xs font-extrabold uppercase">
                <Building className="w-3.5 h-3.5" /> Client Partner Hub
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Post a Paid Micro-Gig</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect with verified, trained women creators for digital marketing, Canva design, and store setup.
              </p>
            </div>

            {postGigSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">Opportunity Submitted!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Our team is reviewing your project details. It will appear on the live board within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostGigSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Desi Spices & Crafts"
                    value={newGigForm.company}
                    onChange={(e) => setNewGigForm({ ...newGigForm, company: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Instagram Reels Manager or Canva Logo Designer"
                    value={newGigForm.title}
                    onChange={(e) => setNewGigForm({ ...newGigForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Category</label>
                    <select
                      value={newGigForm.category}
                      onChange={(e) => setNewGigForm({ ...newGigForm, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Design">Design</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="Content Writing">Content Writing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Stipend Budget</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹6,000 / month"
                      value={newGigForm.stipend}
                      onChange={(e) => setNewGigForm({ ...newGigForm, stipend: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Brief Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe what you need help with, key deliverables, and duration..."
                    value={newGigForm.description}
                    onChange={(e) => setNewGigForm({ ...newGigForm, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Opportunity for Verification
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
