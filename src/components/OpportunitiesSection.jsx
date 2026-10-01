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
  const [opportunities, setOpportunities] = useState(propOpportunities || []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState('All'); // 'All', 'HighMatch' (75%+), 'ExactMatch' (100%)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('highest_match'); // 'highest_match', 'newest', 'highest_pay', 'applicants'
  const [activeSkillFilter, setActiveSkillFilter] = useState(null);

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
    category: 'Startup cohort',
    type: 'Micro-Gig',
    stipend: '₹5,000 / Free Cohort',
    description: '',
    deliverables: '',
    skillsRequired: ''
  });

  const categories = ['All', 'Startup cohort', 'Scholarship', 'Learning Program', 'Digital Marketing', 'Design'];

  // Current active user skills
  const userSkills = (user && user.skills && user.skills.length > 0) 
    ? user.skills 
    : DEFAULT_USER_SKILLS;

  // Filtering logic
  const filteredGigs = opportunities.filter(g => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSkill = !activeSkillFilter || (g.skillsRequired && g.skillsRequired.includes(activeSkillFilter));
    
    const matchRes = calculateSkillMatch(userSkills, g.skillsRequired);
    const matchesMatchFilter = selectedMatchFilter === 'All' ||
                               (selectedMatchFilter === 'HighMatch' && matchRes.matchPercentage >= 75) ||
                               (selectedMatchFilter === 'ExactMatch' && matchRes.matchPercentage === 100);

    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
                          (g.title || '').toLowerCase().includes(query) ||
                          (g.company || '').toLowerCase().includes(query) ||
                          (g.description || '').toLowerCase().includes(query) ||
                          (g.skillsRequired && g.skillsRequired.some(s => s.toLowerCase().includes(query)));
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

  const handlePostGigSubmit = (e) => {
    e.preventDefault();
    const formattedSkills = newGigForm.skillsRequired
      ? newGigForm.skillsRequired.split(',').map(s => s.trim())
      : ['Canva Design', 'Digital Marketing'];

    const newGig = {
      id: `client-gig-${Date.now()}`,
      title: newGigForm.title,
      company: newGigForm.company,
      category: newGigForm.category,
      type: newGigForm.type,
      stipend: newGigForm.stipend,
      duration: 'Flexible / 2 Weeks',
      location: 'PAN India',
      postedAgo: 'Just Now',
      deadline: '7 Days Left',
      description: newGigForm.description,
      deliverables: newGigForm.deliverables ? newGigForm.deliverables.split('\n') : ['Complete client project brief'],
      skillsRequired: formattedSkills,
      applicantsCount: 0,
      verifiedClient: true,
      postedByClient: true
    };

    setOpportunities([newGig, ...opportunities]);
    setPostGigSuccess(true);
    setTimeout(() => {
      setPostGigSuccess(false);
      setIsPostGigOpen(false);
      setNewGigForm({
        title: '',
        company: '',
        category: 'Startup cohort',
        type: 'Micro-Gig',
        stipend: '₹5,000 / Free Cohort',
        description: '',
        deliverables: '',
        skillsRequired: ''
      });
    }, 1800);
  };

  const scrollToGigs = () => {
    const elem = document.getElementById('gigs-list-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white animate-fade-in pb-16">
      
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
              onClick={() => setIsPostGigOpen(true)}
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

        {/* ========================================================
            4. OPPORTUNITY CARDS GRID (Exact Box Design from Reference Image)
           ======================================================== */}
        {sortedGigs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <Briefcase className="w-10 h-10 text-purple-400 mx-auto" />
            <h3 className="text-lg font-bold">No Opportunities Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your category filter or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGigs.map((gig) => {
              const matchResult = calculateSkillMatch(userSkills, gig.skillsRequired);

              return (
                <div
                  key={gig.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/40 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Top Purple Gradient Accent Strip */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>

                  <div>
                    {/* Category Label & Glowing Match Badge at Top Right */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-black tracking-wider text-purple-600 dark:text-purple-400 capitalize bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                        {gig.category || 'Micro-Gig'}
                      </span>
                      
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-purple-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span className="text-xs font-black">{matchResult.matchPercentage}% Match</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => setDetailModalGig(gig)}
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
                      className={`w-full py-3 px-4 rounded-full font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
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
                      onClick={() => setDetailModalGig(gig)}
                      className="w-full py-2.5 px-4 rounded-full bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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

      {/* ========================================================
          OPPORTUNITY DETAIL MODAL
         ======================================================== */}
      {detailModalGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setDetailModalGig(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {detailModalGig.category}
              </span>
              <h2 className="text-2xl font-black">{detailModalGig.title}</h2>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-500" /> {detailModalGig.company} • {detailModalGig.location || 'Remote'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2 text-xs font-semibold">
              <p><strong className="text-purple-600 dark:text-purple-400">Stipend:</strong> {detailModalGig.stipend}</p>
              <p><strong className="text-purple-600 dark:text-purple-400">Duration:</strong> {detailModalGig.duration || 'Flexible'}</p>
              <p><strong className="text-purple-600 dark:text-purple-400">Deadline:</strong> {detailModalGig.deadline || 'Open'}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm text-purple-600 dark:text-purple-400">Role Description</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{detailModalGig.description}</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button 
                type="button" 
                onClick={() => setDetailModalGig(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold"
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
                className="px-6 py-2.5 rounded-full bg-purple-600 text-white text-xs font-extrabold hover:bg-purple-700"
              >
                {detailModalGig.applied ? 'Already Applied' : 'Register Interest →'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          POST GIG CLIENT MODAL
         ======================================================== */}
      {isPostGigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative space-y-5">
            
            <button 
              onClick={() => setIsPostGigOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-extrabold uppercase">
                <Building className="w-3.5 h-3.5" /> Client Partner Hub
              </span>
              <h2 className="text-xl font-bold">Post a Paid Opportunity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connect with verified, trained women creators for digital marketing, design, and work opportunities.
              </p>
            </div>

            {postGigSuccess ? (
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">Opportunity Submitted!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Your project has been submitted to the live board.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostGigSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aspire / Desi Crafts"
                    value={newGigForm.company}
                    onChange={(e) => setNewGigForm({ ...newGigForm, company: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. McKinsey Forward Program or Accelerator"
                    value={newGigForm.title}
                    onChange={(e) => setNewGigForm({ ...newGigForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Category</label>
                    <select
                      value={newGigForm.category}
                      onChange={(e) => setNewGigForm({ ...newGigForm, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700"
                    >
                      <option value="Startup cohort">Startup cohort</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Learning Program">Learning Program</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Stipend / Budget</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹5,000 / Free Cohort"
                      value={newGigForm.stipend}
                      onChange={(e) => setNewGigForm({ ...newGigForm, stipend: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Brief Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe program objectives and criteria..."
                    value={newGigForm.description}
                    onChange={(e) => setNewGigForm({ ...newGigForm, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publish Opportunity
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
