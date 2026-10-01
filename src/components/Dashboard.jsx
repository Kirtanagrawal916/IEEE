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
  LogOut
} from 'lucide-react';
import { api } from '../services/api';
import { skillTracks, initialPortfolios, initialOpportunities } from '../data/mockData';

export default function Dashboard({ user, onOpenSubmitModal, onOpenLogoutModal }) {
  const navigate = useNavigate();

  // State variables for real API data
  const [progressData, setProgressData] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

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

        // 1. Progress Data
        if (progRes.status === 'fulfilled' && progRes.value?.success && progRes.value?.progress) {
          setProgressData(progRes.value.progress);
        } else {
          // Fallback to local user completed lessons
          const completedLessonCount = (user?.completedLessons || []).length;
          setProgressData(skillTracks.map(t => ({
            id: t.id,
            title: t.title,
            category: t.category,
            completedCount: Math.min(completedLessonCount, t.lessonsCount || 4),
            totalLessons: t.lessonsCount || 4,
            progressPercent: Math.min(100, Math.round((completedLessonCount / (t.lessonsCount || 4)) * 100))
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

  // Calculated stats
  const totalCoursesEnrolled = progressData.length || (user ? 2 : 1);
  const totalLessonsCompleted = progressData.reduce((acc, curr) => acc + (curr.completedCount || 0), 0) || (user?.completedLessons?.length || 0);
  const totalProjectsAdded = projectsData.length;
  const totalGigsApplied = applicationsData.length;

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
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 border border-purple-500/30 text-white shadow-2xl space-y-4">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              HerEarn Learner Dashboard
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

      {/* 2. Stats Row (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Courses Enrolled */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Courses Enrolled</span>
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalCoursesEnrolled}
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block">Active Skill Tracks</span>
        </div>

        {/* Card 2: Lessons Completed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lessons Completed</span>
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalLessonsCompleted}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">Modules Mastered</span>
        </div>

        {/* Card 3: Projects Added */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projects Added</span>
            <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalProjectsAdded}
          </div>
          <span className="text-[11px] text-pink-600 dark:text-pink-400 font-bold block">Proof of Work</span>
        </div>

        {/* Card 4: Gigs Applied */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gigs Applied</span>
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalGigsApplied}
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">Client Applications</span>
        </div>
      </div>

      {/* 5. Quick Actions Row */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-3">
        <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Quick Actions
        </h3>
        
        <div className="grid sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs"
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
            className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 dark:hover:bg-pink-900/60 border border-pink-200 dark:border-pink-800/60 text-pink-900 dark:text-pink-200 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs"
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
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Find Opportunities
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      {/* 3. Learning Progress Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-4">
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
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All Courses
          </button>
        </div>

        {progressData && progressData.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {progressData.map((course) => (
              <div 
                key={course.id || course.trackId}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/70 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md uppercase">
                      {course.category || 'Skill Track'}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {course.title}
                    </h4>
                  </div>
                  <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                    {course.progressPercent || 0}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-300"
                      style={{ width: `${course.progressPercent || 0}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>{course.completedCount || 0} of {course.totalLessons || 4} Lessons</span>
                    <span>{course.progressPercent >= 100 ? 'Mastered ✓' : 'In Progress'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/learn')}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
              className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
            >
              Explore Free Courses
            </button>
          </div>
        )}
      </div>

      {/* 4. My Applications Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              My Opportunity Applications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Real-time application status updates from client partners.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/opportunities')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Find More Gigs
          </button>
        </div>

        {applicationsData && applicationsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Opportunity & Company</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Date Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {applicationsData.map((app) => (
                  <tr key={app.id || app.opportunityId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                          {app.opportunityTitle || app.title || 'Micro-Gig Opportunity'}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-purple-500" />
                          {app.company || 'Verified Client'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 text-right text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recently'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">You haven't submitted any opportunity applications yet.</p>
            <button
              onClick={() => navigate('/opportunities')}
              className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
            >
              Browse Live Gigs
            </button>
          </div>
        )}
      </div>

      {/* 6. My Portfolio Preview (Latest 2 Projects) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-pink-500" />
              My Portfolio Preview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Latest published proof-of-work project samples attached to gig applications.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/portfolio')}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View Portfolio Showcase
          </button>
        </div>

        {projectsData && projectsData.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {projectsData.slice(0, 2).map((proj) => (
              <div 
                key={proj.id}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/70 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {proj.title}
                    </h4>
                    <span className="text-[10px] font-extrabold bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-md uppercase whitespace-nowrap">
                      {proj.category || 'Project'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
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
              className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
            >
              Add First Project
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
