import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Award, 
  Plus, 
  Heart, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Filter,
  Share2, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  Loader2,
  LayoutGrid,
  Columns,
  ArrowUpRight,
  Briefcase,
  MapPin,
  TrendingUp,
  Star,
  Check,
  Flame,
  ShieldCheck,
  FolderGit2,
  Tag,
  Wand2,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { initialPortfolios } from '../data/mockData';

export default function PortfolioSection({ portfolios, onOpenSubmitModal, user, onUpdatePortfolios, showToast }) {
  const navigate = useNavigate();

  // Local state for projects synced from props or fallback mock data
  const [projectList, setProjectList] = useState(() => {
    return (portfolios && portfolios.length > 0) ? portfolios : initialPortfolios;
  });

  // Sync when prop updates
  useEffect(() => {
    if (portfolios && portfolios.length > 0) {
      setProjectList(portfolios);
    }
  }, [portfolios]);

  // View mode: 'mosaic' (Visual Grid) or 'editorial' (Case Study Split View)
  const [viewMode, setViewMode] = useState('mosaic');
  
  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending'); // 'trending' | 'newest' | 'verified'

  // Backend Stats State
  const [stats, setStats] = useState({
    totalProjects: 8,
    totalLikes: 980,
    verifiedCount: 8,
    verifiedPercentage: 100,
    totalClientPayouts: '₹28,40,000+'
  });

  // User likes tracking
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('herearn_liked_portfolios');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Quick View Modal
  const [quickViewProject, setQuickViewProject] = useState(null);
  const [showVerificationGuide, setShowVerificationGuide] = useState(false);
  
  // CRUD Modals
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch backend stats on mount
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.getPortfolioStats();
        if (res.success && res.stats && isMounted) {
          setStats(prev => ({ ...prev, ...res.stats }));
        }
      } catch (err) {
        console.log('[PortfolioSection] Stats notice:', err.message);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  // Save liked IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('herearn_liked_portfolios', JSON.stringify(likedIds));
    } catch (e) {
      console.warn('Could not persist likes:', e);
    }
  }, [likedIds]);

  // Categories list
  const categories = [
    { id: 'All', label: 'All Works', icon: '✨' },
    { id: 'Design & Branding', label: 'Design & Branding', icon: '🎨' },
    { id: 'Social Media & Growth', label: 'Social & Growth', icon: '📱' },
    { id: 'E-Commerce & Shopify', label: 'E-Commerce', icon: '🛍️' },
    { id: 'Web & Fullstack', label: 'Web & Tech', icon: '💻' },
    { id: 'Copywriting & Content', label: 'Copy & Content', icon: '✍️' }
  ];

  // Popular quick tags for pills
  const popularTags = ['Figma', 'Canva Pro', 'Shopify', 'React', 'Meta Ads', 'Instagram Reels', 'Packaging', 'SEO'];

  // Spotlight featured project (defaults to high-engagement verified item)
  const spotlightProject = useMemo(() => {
    if (!projectList || projectList.length === 0) return null;
    return projectList.find(p => p.likes >= 150) || projectList[0];
  }, [projectList]);

  // Category normalizer for loose matching
  const matchesCategoryFilter = (projCat, filterCat) => {
    if (filterCat === 'All') return true;
    if (!projCat) return false;
    const cleanProj = projCat.toLowerCase();
    const cleanFilter = filterCat.toLowerCase();
    if (cleanProj === cleanFilter) return true;
    if (cleanFilter.includes('design') && cleanProj.includes('design')) return true;
    if (cleanFilter.includes('social') && (cleanProj.includes('social') || cleanProj.includes('marketing'))) return true;
    if (cleanFilter.includes('commerce') && cleanProj.includes('commerce')) return true;
    if (cleanFilter.includes('web') && (cleanProj.includes('web') || cleanProj.includes('tech'))) return true;
    if (cleanFilter.includes('copy') && (cleanProj.includes('copy') || cleanProj.includes('content'))) return true;
    return false;
  };

  // Filtered and Sorted projects
  const filteredProjects = useMemo(() => {
    let result = (projectList || []).filter(p => {
      // Category filter
      const matchesCat = matchesCategoryFilter(p.category || p.skillTrack, selectedCategory);
      
      // Tag filter
      const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? [p.tags] : []);
      const matchesTag = !selectedTag || tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());

      // Search query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        (p.title || '').toLowerCase().includes(query) ||
        (p.authorName || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query) ||
        (p.location || '').toLowerCase().includes(query) ||
        tags.some(t => t.toLowerCase().includes(query));

      return matchesCat && matchesTag && matchesSearch;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'trending') {
        const likesA = (a.likes || a.likesCount || 0) + (likedIds.includes(a.id) ? 1 : 0);
        const likesB = (b.likes || b.likesCount || 0) + (likedIds.includes(b.id) ? 1 : 0);
        return likesB - likesA;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'verified') {
        return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      }
      return 0;
    });

    return result;
  }, [projectList, selectedCategory, selectedTag, searchQuery, sortBy, likedIds]);

  // Handle Like action with backend sync
  const toggleLike = async (id, e) => {
    if (e) e.stopPropagation();
    const alreadyLiked = likedIds.includes(id);

    // Optimistic UI state
    if (alreadyLiked) {
      setLikedIds(prev => prev.filter(item => item !== id));
      setProjectList(prev => prev.map(p => {
        if (p.id === id) {
          const currentLikes = p.likes || p.likesCount || 0;
          return { ...p, likes: Math.max(0, currentLikes - 1), likesCount: Math.max(0, currentLikes - 1) };
        }
        return p;
      }));
    } else {
      setLikedIds(prev => [...prev, id]);
      setProjectList(prev => prev.map(p => {
        if (p.id === id) {
          const currentLikes = p.likes || p.likesCount || 0;
          return { ...p, likes: currentLikes + 1, likesCount: currentLikes + 1 };
        }
        return p;
      }));
      if (showToast) showToast("❤️ Appreciated!", "Your like was recorded and synced with the creator's profile.");
      
      // Async sync to backend
      try {
        await api.likeProject(id);
      } catch (err) {
        console.log('[Portfolio] Like sync notice:', err.message);
      }
    }
  };

  // Handle Share link
  const handleShare = (project, e) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}/portfolio/${project.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      if (showToast) showToast("🔗 Link Copied!", `Link to "${project.title}" copied to clipboard.`);
    }
  };

  // Handle Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);

    try {
      await api.updateProject(editingProject.id, {
        title: editingProject.title,
        category: editingProject.category,
        description: editingProject.description,
        projectUrl: editingProject.link || editingProject.projectUrl
      });
    } catch (err) {
      console.log('[Portfolio] Update API note:', err.message);
    } finally {
      setProjectList(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...editingProject } : p));
      if (onUpdatePortfolios) {
        onUpdatePortfolios(editingProject);
      }
      setIsSaving(false);
      setEditingProject(null);
      if (showToast) showToast("✨ Project Updated!", "Portfolio details have been saved.");
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    setIsSaving(true);

    try {
      await api.deleteProject(deletingProject.id);
    } catch (err) {
      console.log('[Portfolio] Delete API note:', err.message);
    } finally {
      setIsSaving(false);
      const targetId = deletingProject.id;
      setProjectList(prev => prev.filter(p => p.id !== targetId));
      setDeletingProject(null);
      if (showToast) showToast("🗑️ Project Removed", "The project has been removed from showcase.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in text-slate-900 dark:text-white">
      
      {/* ========================================================
          1. SPOTLIGHT SHOWCASE STAGE & CREATOR HERO
         ======================================================== */}
      <section className="relative rounded-[32px] overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-2xl p-6 sm:p-10 lg:p-12">
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Value Prop, CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 text-white text-xs font-semibold backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Verified Creator Showcase & Proof of Work</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
                Real Deliverables. <br />
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
                  Verified Female Talent.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                Explore authentic work samples created by learners completing our hands-on tracks. 
                Employers and recruiters review these live portfolios to commission paid micro-gigs.
              </p>
            </div>

            {/* Quick Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenSubmitModal ? onOpenSubmitModal() : navigate('/portfolio/submit')}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-900/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Your Work</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/opportunities')}
                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Briefcase className="w-4 h-4 text-cyan-300" />
                <span>Hire a Verified Creator</span>
              </button>
            </div>

            {/* Live Metrics Counter Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Showcases</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.totalProjects || projectList.length}+</div>
                <div className="text-[10px] text-slate-400">Curated Projects</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold mb-0.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Appreciation</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.totalLikes || 980}+</div>
                <div className="text-[10px] text-slate-400">Community Likes</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[10px] text-slate-400">Skill Certified</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Gigs Funded</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">{stats.totalClientPayouts || '₹28.4L+'}</div>
                <div className="text-[10px] text-slate-400">Client Payouts</div>
              </div>
            </div>

          </div>

          {/* Right Column: Spotlight Project Feature Card */}
          {spotlightProject && (
            <div className="lg:col-span-5 flex justify-center">
              <div 
                onClick={() => setQuickViewProject(spotlightProject)}
                className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-xl group cursor-pointer hover:border-amber-400/50 transition-all duration-300"
              >
                {/* Spotlight Header Ribbon */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 border-b border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Spotlight Deliverable</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Click to Preview</span>
                </div>

                {/* Project Image Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img 
                    src={spotlightProject.imageUrl || spotlightProject.image || '/portfolio_creator_ai.jpg'} 
                    alt={spotlightProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                    {spotlightProject.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-[11px] font-bold text-white flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={spotlightProject.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${spotlightProject.authorName}`}
                        alt={spotlightProject.authorName}
                        className="w-8 h-8 rounded-full border border-amber-400 object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{spotlightProject.authorName}</h4>
                        <p className="text-[10px] text-slate-400">{spotlightProject.location || 'India'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-rose-400">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                      <span>{spotlightProject.likes || spotlightProject.likesCount || 140}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {spotlightProject.title}
                  </h3>

                  {spotlightProject.impact && (
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-medium text-amber-200/90 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="line-clamp-1">{spotlightProject.impact}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-xs font-semibold">
                    <span className="text-cyan-300 flex items-center gap-1">
                      <span>Quick View Case</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {Array.isArray(spotlightProject.toolsUsed) ? spotlightProject.toolsUsed.slice(0, 2).join(', ') : 'Verified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          VERIFICATION TRANSPARENCY GUIDE BANNER
         ======================================================== */}
      <section className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 rounded-3xl p-5 sm:p-6 border border-emerald-500/30 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white">How Does Portfolio Verification Work?</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">100% Escrow Backed</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Verified proof-of-work projects receive priority recruiter matching, direct interviews, and guaranteed payments.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowVerificationGuide(prev => !prev)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{showVerificationGuide ? 'Hide Standards' : 'View 3-Step Standards'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showVerificationGuide ? 'rotate-90' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => onOpenSubmitModal ? onOpenSubmitModal() : navigate('/portfolio/submit')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>Submit Capstone</span>
              <Award className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showVerificationGuide && (
          <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
              <span className="text-emerald-400 font-extrabold font-mono text-[11px] block">STEP 1 • COURSE MASTER</span>
              <h4 className="font-bold text-white text-sm">Complete Track Lessons</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Watch all curriculum lessons in /learn and complete module takeaways to master foundational industry skills.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
              <span className="text-pink-400 font-extrabold font-mono text-[11px] block">STEP 2 • REAL DELIVERABLE</span>
              <h4 className="font-bold text-white text-sm">Build Capstone Brief</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Execute real client scenarios (Canva campaigns, Shopify catalogs, or SEO articles) with live demo links.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
              <span className="text-cyan-300 font-extrabold font-mono text-[11px] block">STEP 3 • PEER & MENTOR REVIEW</span>
              <h4 className="font-bold text-white text-sm">Earn Verified Talent Badge</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Our mentor community validates deliverable quality, unlocking the Emerald Verified shield and direct hire micro-gigs.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          2. STUDIO CONTROL BAR (CATEGORIES, VIEW TOGGLE, SEARCH)
         ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              // Compute count
              const count = cat.id === 'All' 
                ? projectList.length 
                : projectList.filter(p => matchesCategoryFilter(p.category || p.skillTrack, cat.id)).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.id); setSelectedTag(''); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive 
                      ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900 font-black' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Sort & View Mode Switcher */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, skills, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400 transition-colors"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="trending">🔥 Trending</option>
                <option value="newest">✨ Newest</option>
                <option value="verified">🏆 Verified First</option>
              </select>
            </div>

            {/* View Mode Toggle Switch */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('mosaic')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'mosaic' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Visual Mosaic Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('editorial')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'editorial' 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Editorial Case-Study View"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Case Studies</span>
              </button>
            </div>

          </div>

        </div>

        {/* Quick Tag Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 text-[11px] shrink-0">
            <Tag className="w-3 h-3" /> Quick Filter:
          </span>
          {popularTags.map(tag => {
            const isTagActive = selectedTag.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isTagActive ? '' : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isTagActive
                    ? 'bg-purple-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              type="button"
              onClick={() => setSelectedTag('')}
              className="text-[11px] text-purple-600 dark:text-purple-400 font-bold hover:underline shrink-0"
            >
              Clear Tag
            </button>
          )}
        </div>
      </section>

      {/* ========================================================
          3. MAIN PROJECT PRESENTATION SECTION (MOSAIC vs EDITORIAL)
         ======================================================== */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No projects found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any showcase projects matching "{searchQuery || selectedCategory || selectedTag}".
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setSelectedCategory('All'); setSelectedTag(''); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'mosaic' ? (
        
        /* ----------------------------------------------------
           VIEW MODE 1: VISUAL MOSAIC GRID
           ---------------------------------------------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProjects.map((portfolio) => {
            const isLiked = likedIds.includes(portfolio.id);
            const likeCount = (portfolio.likes || portfolio.likesCount || 0);

            return (
              <article 
                key={portfolio.id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Visual Header Image */}
                  <div 
                    onClick={() => setQuickViewProject(portfolio)}
                    className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <img 
                      src={portfolio.imageUrl || portfolio.image || '/portfolio_creator_ai.jpg'} 
                      alt={portfolio.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Overlay Pill */}
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg border border-white/10">
                      {portfolio.category}
                    </div>

                    {/* Verified Ribbon */}
                    {portfolio.verified !== false && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}

                    {/* Quick Preview Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                      <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick Preview</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Main Body */}
                  <div className="p-5 space-y-3.5">
                    
                    {/* Creator Identity Strip */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={portfolio.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.authorName || 'user'}`} 
                          alt={portfolio.authorName} 
                          className="w-9 h-9 rounded-full object-cover border border-purple-300 dark:border-purple-600/50"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {portfolio.authorName || 'Creator'}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{portfolio.location || 'India'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Admin/Owner Edit Options */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setEditingProject(portfolio); }}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); setDeletingProject(portfolio); }}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                      className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {portfolio.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                      {portfolio.description}
                    </p>

                    {/* Impact Metric Banner (if present) */}
                    {portfolio.impact && (
                      <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 text-[11px] font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="line-clamp-1">{portfolio.impact}</span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(portfolio.tags || [portfolio.category]).slice(0, 3).map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedTag(tag); }}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-slate-700 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-xs">
                  {/* Heart / Like */}
                  <button 
                    type="button" 
                    onClick={(e) => toggleLike(portfolio.id, e)}
                    className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                      isLiked ? 'text-rose-600' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{likeCount}</span>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => handleShare(portfolio, e)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
                      title="Share link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      type="button" 
                      onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                      className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[11px] hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                    >
                      <span>Case Study</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </article>
            );
          })}
        </div>

      ) : (

        /* ----------------------------------------------------
           VIEW MODE 2: EDITORIAL CASE-STUDY SPLIT VIEW
           ---------------------------------------------------- */
        <div className="space-y-6">
          {filteredProjects.map((portfolio) => {
            const isLiked = likedIds.includes(portfolio.id);
            const likeCount = (portfolio.likes || portfolio.likesCount || 0);

            return (
              <article 
                key={portfolio.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition-all p-6 sm:p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Visual Presentation (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div 
                      onClick={() => setQuickViewProject(portfolio)}
                      className="relative rounded-2xl aspect-[16/11] overflow-hidden bg-slate-950 cursor-pointer group shadow-md"
                    >
                      <img 
                        src={portfolio.imageUrl || portfolio.image || '/portfolio_creator_ai.jpg'} 
                        alt={portfolio.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                        {portfolio.category}
                      </div>
                      {portfolio.verified !== false && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    {/* Creator mini badge */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={portfolio.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.authorName || 'user'}`} 
                          alt={portfolio.authorName} 
                          className="w-8 h-8 rounded-full object-cover border border-purple-400"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{portfolio.authorName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{portfolio.location || 'India'}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleLike(portfolio.id, e)}
                        className={`flex items-center gap-1 text-xs font-bold cursor-pointer ${
                          isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{likeCount}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Case Scope, Deliverables & Outcomes (7 cols) */}
                  <div className="lg:col-span-7 space-y-4 text-left">
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          {portfolio.skillTrack || portfolio.category}
                        </span>
                        {portfolio.impact && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                            {portfolio.impact}
                          </span>
                        )}
                      </div>

                      <h2 
                        onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                        className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors leading-snug"
                      >
                        {portfolio.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {portfolio.description}
                      </p>
                    </div>

                    {/* Deliverables Checklist (if available) */}
                    {portfolio.deliverables && portfolio.deliverables.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Key Deliverables Completed:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 dark:text-slate-200">
                          {portfolio.deliverables.slice(0, 4).map((d, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight font-medium">{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Client Testimonial Quote (if available) */}
                    {portfolio.clientTestimonial && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-l-4 border-purple-500 text-xs italic text-slate-600 dark:text-slate-300">
                        "{portfolio.clientTestimonial}"
                      </div>
                    )}

                    {/* Tools Used + Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Tools:</span>
                        {(portfolio.toolsUsed || portfolio.tags || []).slice(0, 4).map((tool, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuickViewProject(portfolio)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                        >
                          Quick View
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Full Case Study</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </article>
            );
          })}
        </div>

      )}

      {/* ========================================================
          4. INTERACTIVE QUICK-VIEW LIGHTBOX MODAL
         ======================================================== */}
      {quickViewProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto animate-scale-in text-slate-900 dark:text-white">
            
            {/* Modal Top Bar */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  {quickViewProject.category}
                </span>
                {quickViewProject.verified !== false && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleShare(quickViewProject, e)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  type="button" 
                  onClick={() => setQuickViewProject(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Asset */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 overflow-hidden">
              <img 
                src={quickViewProject.imageUrl || quickViewProject.image || '/portfolio_creator_ai.jpg'}
                alt={quickViewProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Creator details & Likes */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={quickViewProject.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${quickViewProject.authorName}`}
                    alt={quickViewProject.authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{quickViewProject.authorName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{quickViewProject.location || 'India'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => toggleLike(quickViewProject.id, e)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      likedIds.includes(quickViewProject.id)
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedIds.includes(quickViewProject.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{quickViewProject.likes || quickViewProject.likesCount || 0} Likes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQuickViewProject(null);
                      navigate(`/portfolio/${quickViewProject.id}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>View Dedicated Page</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {quickViewProject.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {quickViewProject.description}
                </p>
              </div>

              {/* Impact Banner */}
              {quickViewProject.impact && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>Proven Client Impact:</strong> {quickViewProject.impact}</span>
                </div>
              )}

              {/* Deliverables Checklist */}
              {quickViewProject.deliverables && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What was Delivered:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {quickViewProject.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Testimonial */}
              {quickViewProject.clientTestimonial && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 space-y-1">
                  <p className="text-[11px] font-bold uppercase text-purple-700 dark:text-purple-300">Client Feedback</p>
                  <p className="text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{quickViewProject.clientTestimonial}"
                  </p>
                </div>
              )}

              {/* Action: Hire Creator */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="text-xs text-slate-500">
                  Ready to collaborate on a similar project?
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuickViewProject(null);
                    navigate('/opportunities');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Offer a Paid Micro-Gig</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          5. EDIT PROJECT MODAL
         ======================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-slate-900 dark:text-white animate-scale-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base">Edit Showcase Project</h3>
              <button type="button" onClick={() => setEditingProject(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Project Title</label>
                <input 
                  type="text" 
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required 
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Category</label>
                <select 
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Design & Branding">Design & Branding</option>
                  <option value="Social Media & Growth">Social Media & Growth</option>
                  <option value="E-Commerce & Shopify">E-Commerce & Shopify</option>
                  <option value="Web & Fullstack">Web & Fullstack</option>
                  <option value="Copywriting & Content">Copywriting & Content</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Project Deliverable URL</label>
                <input 
                  type="text" 
                  value={editingProject.link || editingProject.projectUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value, projectUrl: e.target.value })}
                  placeholder="https://behance.net/... or https://canva.com/..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <textarea 
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          6. DELETE CONFIRMATION MODAL
         ======================================================== */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-rose-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center text-slate-900 dark:text-white animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base">Delete Project?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove <strong className="text-slate-900 dark:text-white">"{deletingProject.title}"</strong> from the public showcase?
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setDeletingProject(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDeleteConfirm}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
