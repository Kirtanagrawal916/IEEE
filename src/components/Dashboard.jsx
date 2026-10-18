import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Briefcase, 
  ArrowRight, 
  PlusCircle, 
  Edit3, 
  Building, 
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronRight,
  LogOut,
  IndianRupee,
  Lock,
  ArrowUpRight,
  X,
  Play
} from 'lucide-react';
import { api } from '../services/api';
import { skillTracks, initialPortfolios, initialOpportunities } from '../data/mockData';
import { 
  getUnlockedTracksForUser, 
  isTrackUnlocked, 
  getTotalOpportunitiesApplied 
} from '../utils/trackLockHelper';
import WalletWithdrawModal from './WalletWithdrawModal';
import CertificateModal from './CertificateModal';

export default function Dashboard({ user, onOpenSubmitModal, onOpenLogoutModal }) {
  const navigate = useNavigate();

  // State variables for real API data
  const [progressData, setProgressData] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isEnrolledModalOpen, setIsEnrolledModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isOpportunitiesModalOpen, setIsOpportunitiesModalOpen] = useState(false);

  // Escrow & Wallet State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(() => {
    return user?.walletBalance || user?.totalEarned || 12000;
  });

  const handleConfirmWithdrawal = (amount) => {
    const newBal = Math.max(0, walletBalance - amount);
    setWalletBalance(newBal);
    try {
      const savedUserStr = localStorage.getItem('herearn_user');
      const currentUser = savedUserStr ? JSON.parse(savedUserStr) : (user || {});
      const updatedUser = {
        ...currentUser,
        walletBalance: newBal
      };
      localStorage.setItem('herearn_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('[Dashboard] Wallet save error:', e);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        // Fetch real API data in parallel
        const [progRes, appRes, projRes] = await Promise.allSettled([
          api.getProgressMine(),
          api.getApplicationsMine(),
          api.getProjectsMine()
        ]);

        // 1. Progress Data (filter by unlocked courses only)
        const userUnlocked = getUnlockedTracksForUser(user, skillTracks);
        if (progRes.status === 'fulfilled' && progRes.value?.success && progRes.value?.progress) {
          const apiProgress = progRes.value.progress.filter(p => isTrackUnlocked(p.id || p.trackId, user));
          setProgressData(apiProgress);
        } else {
          // Fallback to local user completed lessons for unlocked tracks
          const completedLessonCount = (user?.completedLessons || []).length;
          setProgressData(userUnlocked.map(t => ({
            id: t.id,
            title: t.title,
            category: t.category,
            completedCount: Math.min(completedLessonCount, t.lessons?.length || 4),
            totalLessons: t.lessons?.length || 4,
            progressPercent: Math.min(100, Math.round((completedLessonCount / (t.lessons?.length || 4)) * 100))
          })));
        }

        // 2. Applications Data
        if (appRes.status === 'fulfilled' && appRes.value?.success && appRes.value?.applications) {
          setApplicationsData(appRes.value.applications);
        } else {
          // Fallback mock applications if guest/offline
          const userGigIds = user?.appliedGigIds || [];
          const userGigs = initialOpportunities.filter(g => userGigIds.includes(g.id));
          setApplicationsData(userGigs.map(g => ({
            id: `app-${g.id}`,
            opportunityTitle: g.title,
            company: g.company,
            status: 'Applied',
            appliedAt: new Date().toLocaleDateString()
          })));
        }

        // 3. Portfolio Projects Data
        if (projRes.status === 'fulfilled' && projRes.value?.success && projRes.value?.projects) {
          setProjectsData(projRes.value.projects);
        } else {
          // Fallback mock portfolios
          setProjectsData(initialPortfolios.slice(0, 2).map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            description: p.description,
            tags: [p.category || 'Skill Project', 'Verified']
          })));
        }

      } catch (err) {
        console.warn('[Dashboard] Error fetching API data:', err);
        setApiError('Unable to sync live server data. Displaying cached dashboard stats.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculated stats based on actual unlocked tracks and applied opportunities
  const unlockedCourses = getUnlockedTracksForUser(user, skillTracks);
  const totalCoursesEnrolled = unlockedCourses.length;
  const totalLessonsCompleted = (user?.completedLessons || []).length;

  // Projects data for modal display
  const localPortfolios = JSON.parse(localStorage.getItem('herearn_portfolios') || '[]');
  const displayProjects = projectsData.length > 0 
    ? projectsData 
    : (localPortfolios.length > 0 ? localPortfolios : initialPortfolios.slice(0, 3));
  const totalProjectsAdded = displayProjects.length;

  // Opportunities applied data for modal display
  const userGigIds = Array.from(new Set([
    ...(user?.appliedGigIds || []),
    ...(JSON.parse(localStorage.getItem('herearn_applied_gigs') || '[]'))
  ]));

  const displayOpportunities = userGigIds.length > 0 
    ? userGigIds.map(id => {
        const found = initialOpportunities.find(o => o.id === id);
        if (found) return found;
        const apiApp = applicationsData.find(a => a.opportunityId === id || a.id === id);
        return {
          id,
          title: apiApp?.opportunityTitle || apiApp?.title || "Freelance Micro-Gig",
          company: apiApp?.company || "Verified Partner",
          stipend: apiApp?.stipend || "₹6,000",
          category: apiApp?.category || "Opportunity",
          status: apiApp?.status || "Applied",
          appliedAt: apiApp?.appliedAt || "Recent"
        };
      })
    : (applicationsData.length > 0 ? applicationsData : []);

  const totalGigsApplied = Math.max(displayOpportunities.length, getTotalOpportunitiesApplied(user, applicationsData));

  const userName = user?.name || 'Learner';

  // Helper for Application Status Badge style
  const getStatusBadge = (status) => {
    const s = (status || 'Applied').toUpperCase();
    if (s === 'SHORTLISTED' || s === 'ACCEPTED' || s === 'APPROVED') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] font-extrabold px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Shortlisted
        </span>
      );
    }
    if (s === 'REJECTED' || s === 'DECLINED') {
      return (
        <span className="inline-flex items-center gap-1 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 text-[11px] font-extrabold px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Rejected
        </span>
      );
    }
    // Default Applied / Under Review (Yellow/Amber)
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[11px] font-extrabold px-3 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Applied
      </span>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 border border-purple-500/30 text-white shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                HerEarn Learner Dashboard
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>{totalGigsApplied} Opportunities Filled In</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {userName} 👋
            </h1>

            <p className="text-xs sm:text-sm text-purple-100 font-medium leading-relaxed">
              Keep advancing your skill tracks and expanding your micro-gig portfolio! Every completed lesson brings you closer to client opportunities.
            </p>
          </div>

          {onOpenLogoutModal && (
            <button
              onClick={onOpenLogoutModal}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/20 border border-white/20 text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
            >
              <LogOut className="w-4 h-4 text-rose-300" />
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* API Loading Indicator */}
      {isLoading && (
        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          <span>Syncing latest progress and application metrics from backend API...</span>
        </div>
      )}

      {/* API Error Warning banner if any */}
      {apiError && !isLoading && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-300">
          <span className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            {apiError}
          </span>
        </div>
      )}

      {/* Escrow & Wallet Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-950/80 rounded-3xl p-6 border border-purple-500/40 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shrink-0">
            <IndianRupee className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" /> Escrow Protected Wallet
              </span>
              <span className="text-[10px] text-purple-300 font-bold hidden sm:inline">Instant UPI Disbursal</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-white">₹{walletBalance.toLocaleString()}</span>
              <span className="text-xs text-slate-300 font-semibold">Available Balance</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-2xl text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">In Escrow (Active Gigs)</span>
            <span className="text-sm font-black text-amber-400">₹6,000</span>
          </div>

          <button
            type="button"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <IndianRupee className="w-4 h-4" />
            <span>Withdraw via UPI</span>
            <ArrowUpRight className="w-4 h-4 opacity-80" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/applications')}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-4 h-4 text-pink-300" />
            <span>Workrooms</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Courses Enrolled */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2 flex flex-col justify-between min-h-[175px] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Courses Enrolled</span>
              <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalCoursesEnrolled}
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block">
              {totalCoursesEnrolled === 1 ? '1 Active Skill Track' : `${totalCoursesEnrolled} Active Skill Tracks`}
            </span>
          </div>

          {/* Line to see enrolled courses as requested by user */}
          <button
            type="button"
            onClick={() => setIsEnrolledModalOpen(true)}
            className="w-full mt-auto pt-2.5 border-t border-purple-100 dark:border-purple-900/40 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center justify-between group cursor-pointer text-left transition-colors"
            title="Click to see which courses you are enrolled in"
          >
            <span className="underline decoration-purple-400/80 underline-offset-2">Click to see enrolled courses</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* Card 2: Lessons Completed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2 flex flex-col justify-between min-h-[175px] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lessons Completed</span>
              <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalLessonsCompleted}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
              {totalLessonsCompleted > 0 ? `${totalLessonsCompleted} Lessons Mastered` : '0 Modules Mastered'}
            </span>
          </div>

          {/* Line to see course certificate as requested by user */}
          <button
            type="button"
            onClick={() => setIsCertModalOpen(true)}
            className="w-full mt-auto pt-2.5 border-t border-emerald-100 dark:border-emerald-900/40 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center justify-between group cursor-pointer text-left transition-colors"
            title="Click to view course certificates"
          >
            <span className="underline decoration-emerald-400/80 underline-offset-2">Click to view course certificate</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* Card 3: Projects Added */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2 flex flex-col justify-between min-h-[175px] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projects Added</span>
              <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalProjectsAdded}
            </div>
            <span className="text-[11px] text-pink-600 dark:text-pink-400 font-bold block">
              {totalProjectsAdded > 0 ? `${totalProjectsAdded} Proof of Work Projects` : 'No projects uploaded yet'}
            </span>
          </div>

          {/* Line to see projects added as requested by user */}
          <button
            type="button"
            onClick={() => setIsProjectsModalOpen(true)}
            className="w-full mt-auto pt-2.5 border-t border-pink-100 dark:border-pink-900/40 text-[11px] font-extrabold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 flex items-center justify-between group cursor-pointer text-left transition-colors"
            title="Click to see projects added"
          >
            <span className="underline decoration-pink-400/80 underline-offset-2">Click to see projects added</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>

        {/* Card 4: Opportunities Applied */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2 flex flex-col justify-between min-h-[175px] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Opportunities Applied</span>
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalGigsApplied}
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
              {totalGigsApplied} Opportunities Filled In
            </span>
          </div>

          {/* Line to see total opportunities applied as requested by user */}
          <button
            type="button"
            onClick={() => setIsOpportunitiesModalOpen(true)}
            className="w-full mt-auto pt-2.5 border-t border-amber-100 dark:border-amber-900/40 text-[11px] font-extrabold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center justify-between group cursor-pointer text-left transition-colors"
            title="Click to see total opportunities applied"
          >
            <span className="underline decoration-amber-400/80 underline-offset-2">Click to see total opportunities applied</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      </div>

      {/* 5. Quick Actions Row */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-3">
        <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Quick Actions Workspace
        </h3>
        
        <div className="grid sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Browse Courses
            </span>
            <ArrowRight className="w-4 h-4 text-purple-600" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenSubmitModal) onOpenSubmitModal();
              else navigate('/portfolio');
            }}
            className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/60 border border-pink-200 dark:border-pink-800/60 text-pink-900 dark:text-pink-200 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              Add Portfolio Project
            </span>
            <ArrowRight className="w-4 h-4 text-pink-600" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/opportunities')}
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Find Opportunities
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* --- RESPONSIVE 12-COLUMN DASHBOARD WORKSPACE --- */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: 7 COLUMNS (Learning Progress & Portfolio Showcase) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 3. Learning Progress Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Learning Progress & Enrolled Courses
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Track lesson completion progress across your active skill courses.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/learn')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {progressData && progressData.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {progressData.map((course) => (
                  <div 
                    key={course.id || course.trackId}
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/70 space-y-3 flex flex-col justify-between hover:border-purple-400 transition-all shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md uppercase">
                          {course.category || 'Skill Track'}
                        </span>
                        <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                          {course.progressPercent || 0}%
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {course.title}
                      </h4>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
                          style={{ width: `${course.progressPercent || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                        <span>{course.completedCount || 0} of {course.totalLessons || 4} Lessons</span>
                        <span className={course.progressPercent >= 100 ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}>
                          {course.progressPercent >= 100 ? 'Mastered ✓' : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/learn')}
                      className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                    >
                      <span>Continue Course</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No active course enrollments found yet.</p>
                <button
                  onClick={() => navigate('/learn')}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                >
                  Explore Free Courses
                </button>
              </div>
            )}
          </div>

          {/* 6. My Portfolio Preview (Latest Projects) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-pink-500" />
                  My Portfolio Showcase
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Published proof-of-work project samples attached to gig applications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/portfolio')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {projectsData && projectsData.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {projectsData.slice(0, 2).map((proj) => (
                  <div 
                    key={proj.id}
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/70 space-y-3 flex flex-col justify-between hover:border-pink-400 transition-all shadow-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {proj.title}
                        </h4>
                        <span className="text-[10px] font-extrabold bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-md uppercase whitespace-nowrap">
                          {proj.category || 'Project'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Skill tags */}
                      {proj.tags && proj.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(Array.isArray(proj.tags) ? proj.tags : [proj.category]).map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                        ✓ Verified Proof of Work
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenSubmitModal) onOpenSubmitModal();
                          else navigate('/portfolio');
                        }}
                        className="text-xs font-bold text-purple-600 dark:text-purple-300 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">No portfolio projects published yet.</p>
                <button
                  onClick={() => {
                    if (onOpenSubmitModal) onOpenSubmitModal();
                    else navigate('/portfolio');
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                >
                  Add First Project
                </button>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: 5 COLUMNS (Opportunity Applications & Quick Financial Overview) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 4. My Applications Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-500" />
                  My Applications
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Real-time status updates from clients.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/opportunities')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Find Gigs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applicationsData && applicationsData.length > 0 ? (
              <div className="space-y-3">
                {applicationsData.map((app) => (
                  <div 
                    key={app.id || app.opportunityId}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 hover:border-amber-400 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {app.opportunityTitle || app.title || 'Micro-Gig Opportunity'}
                        </h4>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-purple-500 shrink-0" />
                          <span className="truncate">{app.company || 'Verified Client'}</span>
                        </span>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-700/50 text-[11px] text-slate-400">
                      <span>Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}</span>
                      <button
                        type="button"
                        onClick={() => navigate('/applications')}
                        className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Workroom</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">You haven't submitted any applications yet.</p>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
                >
                  Browse Live Gigs
                </button>
              </div>
            )}
          </div>

          {/* Quick Financial Overview & Escrow Summary Card */}
          <div className="bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-950/60 rounded-3xl p-6 border border-purple-500/30 shadow-md space-y-4 text-white backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                Wallet Summary
              </span>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Instant UPI Escrow
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Available</span>
                <span className="text-lg font-black text-emerald-400">₹{walletBalance.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">In Escrow</span>
                <span className="text-lg font-black text-amber-400">₹6,000</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Withdraw Payout to UPI</span>
            </button>
          </div>

        </div>

      </div>

      {/* Wallet Instant UPI Withdrawal Modal */}
      <WalletWithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        walletBalance={walletBalance}
        onConfirmWithdrawal={handleConfirmWithdrawal}
      />

      {/* Enrolled Courses Modal (Triggered by clicking the line in Card 1) */}
      {isEnrolledModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-purple-500/40 shadow-2xl max-w-lg w-full p-6 space-y-5 text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Your Enrolled Courses</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {unlockedCourses.length > 0 
                      ? `You are enrolled in ${unlockedCourses.length} certified course${unlockedCourses.length > 1 ? 's' : ''}`
                      : 'No active enrollments yet'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEnrolledModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {unlockedCourses.length > 0 ? (
              <div className="space-y-3">
                {unlockedCourses.map((c) => {
                  const doneLessons = (c.lessons || []).filter(l => (user?.completedLessons || []).includes(l.id)).length;
                  const totalL = c.lessons?.length || 4;
                  const pct = Math.round((doneLessons / totalL) * 100);

                  return (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Enrolled via Opportunity
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                            {c.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {c.category} • {c.duration} • {doneLessons} of {totalL} Lessons completed
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Progress</span>
                          <span className="text-purple-600 dark:text-purple-400">{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsEnrolledModalOpen(false);
                          navigate(`/courses/${c.id}`);
                        }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Continue Course Lectures</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">No Courses Enrolled Yet</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Courses are locked by default. When you apply for any opportunity on the Opportunities board, its corresponding certified skill track will be permanently unlocked in your profile!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEnrolledModalOpen(false);
                    navigate('/opportunities');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
                >
                  Browse Opportunities to Unlock Courses
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects Added Modal (Triggered by clicking the line in Card 3) */}
      {isProjectsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-pink-500/40 shadow-2xl max-w-lg w-full p-6 space-y-5 text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Your Added Projects</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {displayProjects.length > 0 
                      ? `${displayProjects.length} proof-of-work project${displayProjects.length > 1 ? 's' : ''} published to your profile`
                      : 'No proof of work published yet'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProjectsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {displayProjects.length > 0 ? (
              <div className="space-y-3">
                {displayProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 hover:border-pink-400 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-pink-500" /> {p.category || 'Skill Project'}
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                          {p.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {p.description || "Practical capstone deliverable demonstrating skill capability on HerEarn."}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        • Verified Deliverable
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProjectsModalOpen(false);
                          navigate(`/portfolio`);
                        }}
                        className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View in Showcase</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setIsProjectsModalOpen(false);
                    onOpenSubmitModal ? onOpenSubmitModal() : navigate('/portfolio/submit');
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Another Project</span>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 border border-pink-300 dark:border-pink-700 flex items-center justify-center mx-auto shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">No Projects Published Yet</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Showcase your work to clients and hiring partners. Upload real designs, copy, campaigns, or assignments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectsModalOpen(false);
                    onOpenSubmitModal ? onOpenSubmitModal() : navigate('/portfolio/submit');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
                >
                  Submit Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Total Opportunities Applied Modal (Triggered by clicking the line in Card 4) */}
      {isOpportunitiesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-amber-500/40 shadow-2xl max-w-lg w-full p-6 space-y-5 text-slate-900 dark:text-white max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Total Opportunities Applied</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {displayOpportunities.length > 0 
                      ? `You have applied to ${displayOpportunities.length} active freelance gig${displayOpportunities.length > 1 ? 's' : ''}`
                      : 'No applications submitted yet'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpportunitiesModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {displayOpportunities.length > 0 ? (
              <div className="space-y-3">
                {displayOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 inline-flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5 text-amber-500" /> {opp.category || 'Freelance Gig'}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            Stipend: {opp.stipend || '₹5,000'}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                          {opp.title || opp.opportunityTitle}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {opp.company || "Client Company"} • Applied {opp.appliedAt || "Recently"}
                        </p>
                      </div>

                      {getStatusBadge(opp.status)}
                    </div>

                    <div className="pt-1 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Course Unlocked
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setIsOpportunitiesModalOpen(false);
                          navigate(`/applications`);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Workroom</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setIsOpportunitiesModalOpen(false);
                    navigate('/opportunities');
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Browse More Opportunities</span>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto shadow-md">
                  <Briefcase className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">No Opportunities Applied Yet</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Explore available freelance micro-gigs and client projects. When you apply, you unlock matching course lectures!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpportunitiesModalOpen(false);
                    navigate('/opportunities');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
                >
                  Browse Available Gigs
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal 
        isOpen={isCertModalOpen} 
        onClose={() => setIsCertModalOpen(false)} 
        user={user} 
      />

    </div>
  );
}
