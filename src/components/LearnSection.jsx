import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  Circle, 
  Award, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  Sparkles,
  Download,
  Lock,
  ArrowRight,
  Zap,
  Target,
  Trophy,
  CheckCircle2,
  Layers,
  Flame,
  Send,
  Loader2,
  Gamepad2,
  Crown,
  Brain,
  Compass,
  Radio,
  Star,
  Search,
  Filter,
  Check,
  FileText,
  MessageSquare,
  Share2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  GraduationCap,
  LayoutGrid,
  Tv,
  List,
  TableProperties,
  ArrowUpRight,
  ChevronDown,
  X
} from 'lucide-react';
import { skillTracks } from '../data/mockData';
import { initialChallenges } from '../data/challengesData';
import { api } from '../services/api';
import PuzzleHub from './puzzles/PuzzleHub';
import CertificateModal from './CertificateModal';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';
import { isTrackUnlocked, getUnlockedTrackIds } from '../utils/trackLockHelper';

export default function LearnSection({ user, onCompleteLesson, onNavigateToPortfolio, onUpdateUserSkillPoints, showToast }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');

  // Derive effective user from props or localStorage
  const effectiveUser = useMemo(() => {
    if (user && (user.name || user.email || user.username)) return user;
    try {
      const local = JSON.parse(localStorage.getItem('herearn_user') || 'null');
      if (local && (local.name || local.email || local.username)) return local;
    } catch {}
    return user || null;
  }, [user]);
  
  // Main Tab: 'courses' | 'challenges' | 'puzzles'
  const [activeTab, setActiveTab] = useState(
    urlTab === 'puzzles' || urlTab === 'games' 
      ? 'puzzles' 
      : urlTab === 'challenges' 
      ? 'challenges' 
      : 'courses'
  );

  // Sub-view inside 'courses': 'curriculum' (Expanded Syllabus Dossiers) | 'table' (Curriculum Matrix Table) | 'classroom' (Video Studio) | 'roadmap'
  const [courseSubView, setCourseSubView] = useState(() => {
    return searchParams.get('view') || 'curriculum';
  });

  const [puzzleSubGame, setPuzzleSubGame] = useState(() => searchParams.get('game') || 'queen');
  const [tracks, setTracks] = useState(skillTracks);
  const [selectedTrackId, setSelectedTrackId] = useState('track-1');
  const [activeLessonId, setActiveLessonId] = useState('m1-l1');
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [backendProgressPercent, setBackendProgressPercent] = useState(null);

  // Synchronize activeTab, courseSubView, and puzzleSubGame when searchParams change in the URL
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab === 'puzzles' || currentTab === 'games') {
      setActiveTab('puzzles');
    } else if (currentTab === 'challenges') {
      setActiveTab('challenges');
    } else if (currentTab === 'courses' || currentTab === 'curriculum') {
      setActiveTab('courses');
    }

    const currentView = searchParams.get('view');
    if (currentView && ['curriculum', 'table', 'classroom', 'roadmap'].includes(currentView)) {
      setCourseSubView(currentView);
    }

    const currentGame = searchParams.get('game');
    if (currentGame) {
      setPuzzleSubGame(currentGame);
    }
  }, [searchParams]);

  // Search & category filter
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Classroom internal tab: 'overview' | 'takeaways' | 'resources' | 'notes'
  const [classroomTab, setClassroomTab] = useState('overview');

  // Personal Lesson Notes
  const [lessonNotes, setLessonNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('herearn_lesson_notes') || '{}');
    } catch {
      return {};
    }
  });

  // Certificate Modal State
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certificateTrackTitle, setCertificateTrackTitle] = useState('');

  // Challenge Zone states
  const [challenges, setChallenges] = useState(initialChallenges);
  const [completedChallengeIds, setCompletedChallengeIds] = useState([]);
  const [userPoints, setUserPoints] = useState(user?.skillPoints || 150);

  // Fetch backend tracks if available
  useEffect(() => {
    const fetchLiveTracks = async () => {
      setIsLoadingTracks(true);
      try {
        const res = await api.getTracks();
        if (res.success && res.tracks && res.tracks.length > 0) {
          setTracks(prev => {
            const merged = [...skillTracks];
            res.tracks.forEach(liveTrack => {
              const idx = merged.findIndex(t => t.id === liveTrack.id);
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...liveTrack, lessons: (liveTrack.lessons && liveTrack.lessons.length > 0) ? liveTrack.lessons : merged[idx].lessons };
              } else {
                merged.push(liveTrack);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.log('[LearnSection] Using local skillTracks:', err.message);
      } finally {
        setIsLoadingTracks(false);
      }
    };

    fetchLiveTracks();
  }, []);

  // Fetch progress for selected track
  useEffect(() => {
    const fetchProgress = async () => {
      if (!selectedTrackId) return;
      try {
        const progRes = await api.getTrackProgress(selectedTrackId);
        if (progRes.success && progRes.progressPercent !== undefined) {
          setBackendProgressPercent(progRes.progressPercent);
        }
      } catch (err) {
        setBackendProgressPercent(null);
      }
    };

    fetchProgress();
  }, [selectedTrackId, user]);

  // Current track & active lesson
  const currentTrack = useMemo(() => {
    return tracks.find(t => t.id === selectedTrackId) || tracks[0] || skillTracks[0];
  }, [tracks, selectedTrackId]);

  const activeLesson = useMemo(() => {
    const lessonsList = currentTrack.lessons || [];
    return lessonsList.find(l => l.id === activeLessonId) || lessonsList[0] || {};
  }, [currentTrack, activeLessonId]);

  // Progress metrics
  const userCompletedLessons = user?.completedLessons || [];
  const trackLessonsCount = currentTrack.lessons ? currentTrack.lessons.length : 1;
  const completedCount = (currentTrack.lessons || []).filter(l => userCompletedLessons.includes(l.id)).length;
  const progressPercent = backendProgressPercent !== null 
    ? backendProgressPercent 
    : Math.round((completedCount / trackLessonsCount) * 100);

  const isCurrentLessonCompleted = userCompletedLessons.includes(activeLesson.id);

  // Tab changes
  const handleTabChange = (tab, game = 'queen') => {
    setActiveTab(tab);
    if (game) setPuzzleSubGame(game);
    setSearchParams(tab === 'courses' ? {} : { tab, ...(tab === 'puzzles' ? { game } : {}) });
  };

  // Launch track into Classroom mode
  const handleLaunchClassroom = (trackId, lessonId) => {
    if (!isTrackUnlocked(trackId, user)) {
      const targetTrack = tracks.find(t => t.id === trackId) || skillTracks[0];
      if (showToast) {
        showToast("🔒 Course Locked", `To access "${targetTrack.title}" lectures, please apply for an Opportunity in ${targetTrack.category} first!`);
      }
      navigate('/opportunities');
      return;
    }
    setSelectedTrackId(trackId);
    if (lessonId) {
      setActiveLessonId(lessonId);
    } else {
      const targetTrack = tracks.find(t => t.id === trackId) || skillTracks[0];
      const targetLesson = targetTrack.lessons?.[0]?.id || 'm1-l1';
      setActiveLessonId(targetLesson);
    }
    setCourseSubView('classroom');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Save personal notes
  const handleSaveNote = (text) => {
    const updated = { ...lessonNotes, [activeLesson.id]: text };
    setLessonNotes(updated);
    try {
      localStorage.setItem('herearn_lesson_notes', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Mark lesson complete
  const handleCompleteAndNext = (lessonId) => {
    onCompleteLesson(lessonId);
    triggerCelebrationConfetti();
    if (showToast) showToast("🎉 Lesson Mastered!", "+25 Skill Points added! Keep the momentum going.");

    const lessons = currentTrack.lessons || [];
    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setTimeout(() => {
        setActiveLessonId(nextLesson.id);
      }, 700);
    }
  };

  // Categories for filter
  const courseCategories = ['All', 'Demo Course', 'Marketing', 'Design', 'E-Commerce', 'Writing', 'Video', 'Operations'];

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    return tracks.filter(t => {
      const matchesCat = selectedCategory === 'All' || 
        (selectedCategory === 'Demo Course' && (t.id === 'track-demo' || t.isDemoCourse)) ||
        (t.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
      const query = courseSearch.trim().toLowerCase();
      const matchesSearch = !query ||
        t.title.toLowerCase().includes(query) ||
        (t.description || '').toLowerCase().includes(query) ||
        (t.instructor || '').toLowerCase().includes(query) ||
        (t.skillsCovered || []).some(s => s.toLowerCase().includes(query));
      return matchesCat && matchesSearch;
    });
  }, [tracks, selectedCategory, courseSearch]);

  // Total available lessons across all tracks
  const totalLessonsCount = useMemo(() => {
    return tracks.reduce((acc, t) => acc + (t.lessons?.length || 0), 0);
  }, [tracks]);

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* ========================================================
          STUDIO CONTROL BAR (TABS, STREAK & CERTIFICATES)
         ======================================================== */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Main Section Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          <button
            type="button"
            onClick={() => handleTabChange('courses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-500" />
            <span>Curriculum & Masterclasses</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('challenges')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'challenges'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Client Challenge Zone</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('puzzles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'puzzles'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-pink-400" />
            <span>Logic Arcade</span>
          </button>
        </div>

        {/* User Badges & Streak Counters */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              setCertificateTrackTitle(currentTrack.title);
              setIsCertificateOpen(true);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              progressPercent === 100
                ? 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
            }`}
            title={progressPercent === 100 ? "View & Download Official Certificate" : "Certificate Locked — Complete 100% of modules to unlock"}
          >
            {progressPercent === 100 ? (
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="hidden sm:inline">
              {progressPercent === 100 ? "Claim Certificate ✓" : `Certificate (${progressPercent}%)`}
            </span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span><strong className="text-purple-600 dark:text-purple-400">{userPoints}</strong> PTS</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-900 dark:text-amber-200">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>4-Day Streak</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          SECTION 1: CURRICULUM SYLLABUS & MASTERCLASSES
         ======================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Sub-Format View Switcher: Curriculum Dossiers vs Matrix Table vs Classroom vs Roadmap */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCourseSubView('curriculum')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseSubView === 'curriculum'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Syllabus Dossiers ({tracks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseSubView('table')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseSubView === 'table'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Curriculum Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseSubView('classroom')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseSubView === 'classroom'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Active Classroom Studio</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseSubView('roadmap')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseSubView === 'roadmap'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Earning Blueprint</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{totalLessonsCount} Practical Lessons Live</span>
            </div>
          </div>

          {/* ------------------------------------------------------
              FORMAT 1: SYLLABUS DOSSIERS (IMAGE-FREE CURRICULUM CARDS)
             ------------------------------------------------------ */}
          {courseSubView === 'curriculum' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Typographic Curriculum Header */}
              <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden">
                <div className="max-w-3xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase border border-white/15">
                    <span>// HER_EARN_SKILL_MATRIX_V2</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white !text-white">
                    Structured Skill Syllabi for Remote Earnings
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    Explore full course syllabi with direct lesson roadmaps. No fluff or generic theory—each lesson delivers a tangible workflow used by paid freelancers and agencies.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10 mt-6">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
                    {courseCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-white text-slate-950 font-black shadow-sm'
                            : 'bg-white/10 text-slate-200 hover:text-white hover:bg-white/20 border border-white/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search lessons & skills..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="w-full bg-slate-950/80 text-white text-xs pl-9 pr-3 py-2 rounded-xl border border-white/20 focus:outline-none focus:border-purple-400 placeholder-slate-400"
                    />
                    {courseSearch && (
                      <button 
                        type="button" 
                        onClick={() => setCourseSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Curriculum Dossiers List */}
              <div className="space-y-6">
                {isLoadingTracks && tracks.length === 0 ? (
                  <div className="space-y-6 animate-pulse">
                    {[1, 2].map((n) => (
                      <div key={n} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 shadow-sm">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="space-y-2">
                            <div className="h-4 w-28 bg-purple-100 dark:bg-purple-900/40 rounded"></div>
                            <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
                          </div>
                          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl"></div>
                          <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTracks.map((t, trackIndex) => {
                  const trackCompletedCount = (t.lessons || []).filter(l => userCompletedLessons.includes(l.id)).length;
                  const trackPercent = Math.round((trackCompletedCount / ((t.lessons && t.lessons.length) || 1)) * 100);

                  return (
                    <div
                      key={t.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white"
                    >
                      {/* Top Header Row: Track Index, Category, Title, Meta */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {(t.isDemoCourse || t.id === 'track-demo') && (
                              <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shadow-xs">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                Free Demo Course • Unlocked for Everyone
                              </span>
                            )}
                            <span className="font-mono text-[11px] font-black px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              TRACK 0{trackIndex + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                              {t.category}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-xs font-semibold text-slate-500">
                              {t.level || 'Beginner Friendly'}
                            </span>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                            {t.title}
                          </h2>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-normal">
                            {t.description}
                          </p>
                        </div>

                        {/* Right Meta Column: Earnings, Rating, Launch CTA */}
                        <div className="flex lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                          {t.earningPotential && (
                            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>{t.earningPotential}</span>
                            </div>
                          )}

                          {(() => {
                            const isUnlocked = isTrackUnlocked(t.id, user);
                            if (isUnlocked) {
                              return (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shadow-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Unlocked</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleLaunchClassroom(t.id)}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>{trackPercent > 0 ? `Resume (${trackPercent}%)` : 'Start Track'}</span>
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <button
                                type="button"
                                onClick={() => {
                                  if (showToast) {
                                    showToast("🔒 Course Locked", `To unlock "${t.title}", please apply for an Opportunity in ${t.category} on the board first!`);
                                  }
                                  navigate('/opportunities');
                                }}
                                className="px-5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 font-bold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all flex items-center gap-2 cursor-pointer shadow-xs group"
                                title="Course Locked — Apply for an Opportunity to Unlock"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                                <span>Start Track (Locked)</span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Lesson Modules Roadmap Strip (Interactive Timeline) */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          <span>Modules & Syllabus Breakdown ({t.lessons?.length || 0} Lessons)</span>
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            {isTrackUnlocked(t.id, user) ? 'Click any lesson to launch video' : '🔒 Apply opportunity to unlock lectures'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {(t.lessons || []).map((lesson, lessonIdx) => {
                            const isDone = userCompletedLessons.includes(lesson.id);
                            const isTrackOpen = isTrackUnlocked(t.id, user);

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => handleLaunchClassroom(t.id, lesson.id)}
                                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 group ${
                                  !isTrackOpen
                                    ? 'bg-slate-100/70 dark:bg-slate-800/30 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-400'
                                    : isDone
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400'
                                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                    MODULE 0{lessonIdx + 1}
                                  </span>
                                  {!isTrackOpen ? (
                                    <Lock className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                                  ) : isDone ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  ) : (
                                    <Play className="w-3 h-3 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:fill-current" />
                                  )}
                                </div>

                                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                  {lesson.title.replace(/^Lesson \d+:\s*/i, '')}
                                </h4>

                                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 font-medium">
                                  <span>{lesson.duration || '20 min'}</span>
                                  {!isTrackOpen ? (
                                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                      <Lock className="w-3 h-3" /> Locked
                                    </span>
                                  ) : isDone ? (
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Completed</span>
                                  ) : (
                                    <span className="group-hover:underline">Study Now &rarr;</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Footer: Skills Tags, Instructor & Progress Bar */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                        {/* Skills pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 mr-1">Skills:</span>
                          {(t.skillsCovered || []).map((skill, idx) => (
                            <span 
                              key={idx}
                              className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              #{skill}
                            </span>
                          ))}
                        </div>

                        {/* Progress metric */}
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] text-slate-600 dark:text-slate-400">
                            Instructor: <strong className="text-slate-800 dark:text-slate-200">{t.instructor ? t.instructor.split('(')[0] : 'Expert Mentor'}</strong>
                          </span>

                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-600" style={{ width: `${trackPercent}%` }} />
                            </div>
                            <span className="font-mono text-[10px] font-bold text-purple-600 dark:text-purple-400">
                              {trackPercent}%
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ------------------------------------------------------
              FORMAT 2: CURRICULUM MATRIX TABLE (DENSE TABULAR VIEW)
             ------------------------------------------------------ */}
          {courseSubView === 'table' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-fade-in text-slate-900 dark:text-white">
              
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Comprehensive Skill Track Comparison Matrix</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Overview of duration, lessons count, certified outcomes, and earning estimates.</p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  {tracks.length} Tracks Live
                </span>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-5">Track Code & Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Level</th>
                      <th className="py-3 px-4">Modules</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Estimated Earnings</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredTracks.map((t, idx) => {
                      const completedCountForTrack = (t.lessons || []).filter(l => userCompletedLessons.includes(l.id)).length;
                      const isFullyDone = completedCountForTrack === (t.lessons?.length || 1);

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-5">
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                                TRK-0{idx + 1}
                              </span>
                              <span>{t.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">{t.instructor}</span>
                          </td>
                          <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">{t.category}</td>
                          <td className="py-4 px-4 text-slate-500">{t.level || 'Beginner'}</td>
                          <td className="py-4 px-4 font-mono font-bold">{t.lessons?.length || 4} Lessons</td>
                          <td className="py-4 px-4 text-slate-500">{t.duration || '4h'}</td>
                          <td className="py-4 px-4">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t.earningPotential}</span>
                          </td>
                          <td className="py-4 px-4">
                            {!isTrackUnlocked(t.id, user) ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] inline-flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                                Locked
                              </span>
                            ) : isFullyDone ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                100% Certified
                              </span>
                            ) : completedCountForTrack > 0 ? (
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                                {completedCountForTrack}/{t.lessons?.length || 4} Done
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                Unlocked
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            {!isTrackUnlocked(t.id, user) ? (
                              <button
                                type="button"
                                onClick={() => {
                                  if (showToast) {
                                    showToast("🔒 Course Locked", `Apply for a ${t.category} Opportunity on the board to unlock "${t.title}"!`);
                                  }
                                  navigate('/opportunities');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:bg-amber-100 transition-all shadow-xs"
                              >
                                <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span>Locked</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleLaunchClassroom(t.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                              >
                                <span>Classroom</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Cards View */}
              <div className="md:hidden space-y-3 p-4">
                {filteredTracks.map((t, idx) => {
                  const completedCountForTrack = (t.lessons || []).filter(l => userCompletedLessons.includes(l.id)).length;
                  const isFullyDone = completedCountForTrack === (t.lessons?.length || 1);
                  const isUnlocked = isTrackUnlocked(t.id, user);

                  return (
                    <div 
                      key={t.id} 
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold block">
                            TRK-0{idx + 1} • {t.category}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                            {t.title}
                          </h4>
                          <span className="text-[11px] text-slate-500">{t.instructor}</span>
                        </div>
                        <div>
                          {!isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] inline-flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-amber-600" /> Locked
                            </span>
                          ) : isFullyDone ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                              Certified ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                              {completedCountForTrack}/{t.lessons?.length || 4} Done
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Duration & Modules</span>
                          <span className="font-bold">{t.duration || '4h'} • {t.lessons?.length || 4} Lessons</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Est. Earnings</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{t.earningPotential}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        {!isUnlocked ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (showToast) {
                                showToast("🔒 Course Locked", `Apply for a ${t.category} Opportunity on the board to unlock "${t.title}"!`);
                              }
                              navigate('/opportunities');
                            }}
                            className="w-full py-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-bold text-xs flex items-center justify-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Apply for Opportunity to Unlock</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleLaunchClassroom(t.id)}
                            className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <span>Open Classroom</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ------------------------------------------------------
              FORMAT 3: ACTIVE CLASSROOM & VIDEO STUDIO
             ------------------------------------------------------ */}
          {courseSubView === 'classroom' && !isTrackUnlocked(currentTrack.id, user) && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-amber-300 dark:border-amber-700/60 text-center space-y-6 shadow-xl animate-fade-in text-slate-900 dark:text-white">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                  Course Lectures Locked
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  "{currentTrack.title}" is Locked
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  To access these video lectures, please apply for a matching Opportunity in <strong>{currentTrack.category}</strong>. Once applied, this course will automatically open in your profile permanently!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/opportunities')}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Browse Opportunities to Unlock</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourseSubView('curriculum')}
                  className="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Back to Courses Catalog
                </button>
              </div>
            </div>
          )}

          {courseSubView === 'classroom' && isTrackUnlocked(currentTrack.id, user) && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Classroom Header Bar */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30">
                      {currentTrack.category} Track
                    </span>
                    <span className="text-xs text-slate-300">
                      Instructor: <strong className="text-white">{currentTrack.instructor || 'Senior Mentor'}</strong>
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">
                    {currentTrack.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    {currentTrack.description}
                  </p>
                </div>

                {/* Progress Box & Certificate CTA */}
                <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl w-full md:w-80 space-y-3 text-white backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">Track Progress</span>
                    <span className="text-amber-300">{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{completedCount} of {trackLessonsCount} Lessons Done</span>
                    {progressPercent === 100 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCertificateTrackTitle(currentTrack.title);
                          setIsCertificateOpen(true);
                        }}
                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-400" /> Claim Certificate
                      </button>
                    ) : (
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" /> Finish all {trackLessonsCount} lessons to certify
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Classroom Grid */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Embedded Video & Lesson Content (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Embedded Video Cinema Frame */}
                  <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative">
                    <iframe
                      src={activeLesson.videoUrl || "https://www.youtube.com/embed/fGddFf8_mP8"}
                      title={activeLesson.title || "Lesson Video"}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Lesson Meta Header & Completion Button */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 text-slate-900 dark:text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                          {currentTrack.category} • {activeLesson.duration || '20 min'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                          {activeLesson.title}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCompleteAndNext(activeLesson.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                          isCurrentLessonCompleted
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {isCurrentLessonCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Lesson Completed</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-white" />
                            <span>Mark Complete (+25 PTS)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Lesson Content Tab Switcher */}
                    <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => setClassroomTab('overview')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          classroomTab === 'overview'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        📝 Lesson Overview
                      </button>

                      <button
                        type="button"
                        onClick={() => setClassroomTab('takeaways')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          classroomTab === 'takeaways'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        💡 Concepts Mastered
                      </button>

                      <button
                        type="button"
                        onClick={() => setClassroomTab('resources')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          classroomTab === 'resources'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        📥 Downloads & Templates
                      </button>

                      <button
                        type="button"
                        onClick={() => setClassroomTab('notes')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          classroomTab === 'notes'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        📓 My Notes
                      </button>
                    </div>

                    {/* Tab 1: Overview */}
                    {classroomTab === 'overview' && (
                      <div className="space-y-4 text-xs leading-relaxed animate-fade-in">
                        <p className="text-slate-700 dark:text-slate-300 font-medium sm:text-sm">
                          {activeLesson.summary || "In this hands-on lesson, you will master the foundational execution steps, software tools, and best practices to deliver verified client deliverables."}
                        </p>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Practical Application in Paid Gigs
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300">
                            Clients on the HerEarn Opportunity Board regularly commission tasks based on this lesson. Practice the exercise file below and upload your completed deliverable to your portfolio.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Key Concepts */}
                    {classroomTab === 'takeaways' && (
                      <div className="space-y-3 animate-fade-in">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Checklist of Core Concepts:
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2 text-xs">
                          {(activeLesson.keyTakeaways || [
                            "Setting up project workspaces and file templates",
                            "Understanding target audience parameters",
                            "Client delivery formatting standards"
                          ]).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Downloads & Templates */}
                    {classroomTab === 'resources' && (
                      <div className="space-y-3 animate-fade-in text-xs">
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                          <div className="flex items-center gap-2.5">
                            <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">Lesson Practice Worksheet (.PDF)</p>
                              <p className="text-[10px] text-slate-500">Step-by-step client task brief with asset links</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (showToast) showToast("📥 Download Started", "Practice Worksheet (.PDF) downloaded.");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 cursor-pointer"
                          >
                            Download
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">Free Canva Pro / Figma Starter Template</p>
                              <p className="text-[10px] text-slate-500">Pre-configured dimensions, palettes, and layouts</p>
                            </div>
                          </div>
                          <a
                            href="https://www.canva.com"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Personal Notes */}
                    {classroomTab === 'notes' && (
                      <div className="space-y-3 animate-fade-in text-xs">
                        <label className="block font-bold text-slate-700 dark:text-slate-300">
                          Your Private Lesson Notes (Auto-saved)
                        </label>
                        <textarea
                          rows={4}
                          value={lessonNotes[activeLesson.id] || ''}
                          onChange={(e) => handleSaveNote(e.target.value)}
                          placeholder="Jot down client tips, shortcuts, or key reminders for this lesson..."
                          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    )}

                  </div>

                  {/* Unlocked Capstone Portfolio Banner */}
                  {progressPercent >= 60 && (
                    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-purple-500/40 shadow-xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>Capstone Portfolio Ready!</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Publish Your Deliverable & Unlock Client Micro-Gigs</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        You've completed enough lessons! Upload your project to the public portfolio showcase to earn your Verified Skill Badge and start receiving client inquiries.
                      </p>
                      <button
                        type="button"
                        onClick={onNavigateToPortfolio}
                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                      >
                        <span>Go to Portfolio & Publish Deliverable</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Brain Break Mini Arcade Callout */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-pink-600 dark:text-pink-400">
                        <Gamepad2 className="w-4 h-4" />
                        <span>Brain Break: Algorithmic Logic Arcade</span>
                      </div>
                      <span className="text-[10px] bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold px-2 py-0.5 rounded-full">
                        +Bonus Skill Points
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      Need a 5-minute break between videos? Sharpen your problem solving with our built-in puzzles:
                    </p>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleTabChange('puzzles', 'queen')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Queen Placing</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabChange('puzzles', 'dot-connect')}
                        className="px-3.5 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-pink-200 text-xs font-bold hover:bg-pink-200 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Dot Connect</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabChange('puzzles', 'hanoi')}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 text-xs font-bold hover:bg-purple-200 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Tower of Hanoi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabChange('puzzles')}
                        className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                      >
                        Explore All 10 Puzzles &rarr;
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Column: Playlist & Track Switcher (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Skill Track Switcher */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Switch Track
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCourseSubView('curriculum')}
                        className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        View Dossiers (6)
                      </button>
                    </div>

                    <div className="space-y-2">
                      {tracks.map((track, trackIdx) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => {
                            setSelectedTrackId(track.id);
                            setActiveLessonId(track.lessons?.[0]?.id || 'm1-l1');
                          }}
                          className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            selectedTrackId === track.id
                              ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                              0{trackIdx + 1}
                            </span>
                            <div className="truncate">
                              <p className="font-bold text-xs truncate">{track.title}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {track.lessons?.length || 4} Lessons • {track.category}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Playlist Lessons List */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 text-slate-900 dark:text-white sticky top-20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Lessons in Track ({currentTrack.lessons?.length || 0})
                      </h3>
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                        {completedCount}/{trackLessonsCount} Done
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                      {(currentTrack.lessons || []).map((lesson, index) => {
                        const isCompleted = userCompletedLessons.includes(lesson.id);
                        const isActive = lesson.id === activeLessonId;

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={`p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                              isActive
                                ? 'bg-purple-100 dark:bg-purple-950/80 border-purple-500 text-purple-950 dark:text-white shadow-xs font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : isActive ? (
                                <Play className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 fill-purple-600 dark:fill-purple-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="truncate">{lesson.title}</p>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Capstone link in playlist */}
                    <button
                      type="button"
                      onClick={onNavigateToPortfolio}
                      className="w-full mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-between hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Submit Capstone Deliverable</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ------------------------------------------------------
              FORMAT 4: 5-STAGE CAREER EARNING ROADMAP
             ------------------------------------------------------ */}
          {courseSubView === 'roadmap' && (
            <div className="space-y-8 animate-fade-in">
              <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-mono font-bold uppercase border border-white/15">
                  <Compass className="w-3.5 h-3.5" />
                  <span>// PATHWAY_TO_PAID_GIGS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  From Zero to Your First Paid Micro-Gig
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Follow this verified step-by-step pathway created for Indian women transitioning into remote digital careers.
                </p>
              </div>

              {/* 5-Step Visual Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  {
                    step: '01',
                    title: 'Pick a Skill Track',
                    desc: 'Select from high-demand tracks: Canva Design, Meta Ads, Shopify, Copywriting, or Video Editing.',
                    icon: BookOpen,
                    status: 'Active',
                    color: 'text-purple-600 dark:text-purple-400'
                  },
                  {
                    step: '02',
                    title: 'Master Lessons',
                    desc: 'Complete bite-sized video lessons & download real client practice worksheets.',
                    icon: Tv,
                    status: completedCount > 0 ? 'In Progress' : 'Pending',
                    color: 'text-indigo-600 dark:text-indigo-400'
                  },
                  {
                    step: '03',
                    title: 'Solve Client Brief',
                    desc: 'Tackle a 30-minute real client scenario in HerEarn Challenge Zone (+50 PTS).',
                    icon: Zap,
                    status: completedChallengeIds.length > 0 ? 'Done' : 'Next',
                    color: 'text-amber-500'
                  },
                  {
                    step: '04',
                    title: 'Publish Capstone',
                    desc: 'Publish your verified project to the public showcase to prove your skill to recruiters.',
                    icon: Award,
                    status: progressPercent >= 60 ? 'Unlocked' : 'Locked',
                    color: 'text-rose-500'
                  },
                  {
                    step: '05',
                    title: 'Land Paid Gigs',
                    desc: 'Apply to verified client micro-gigs on the Opportunity Board & receive escrow payouts.',
                    icon: Briefcase,
                    status: 'Goal',
                    color: 'text-emerald-500'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-300 dark:text-slate-700">
                            {item.step}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            item.status === 'Active' || item.status === 'In Progress' || item.status === 'Done' || item.status === 'Unlocked'
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className={`w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                        Stage {idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Banner */}
              <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base font-bold text-purple-950 dark:text-purple-200">
                    Ready to start your journey today?
                  </h4>
                  <p className="text-xs text-purple-800/80 dark:text-purple-300 font-medium">
                    Pick any of the 6 tracks and finish Lesson 1 in under 20 minutes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchClassroom('track-1')}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  Start Lesson 1 Now
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================
          SECTION 2: ⚡ HEREARN CHALLENGE ZONE VIEW
         ======================================================== */}
      {activeTab === 'challenges' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Challenge Zone Hero Banner */}
          <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 text-white shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real-World Client Briefs</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  HerEarn Challenge Zone ⚡
                </h1>

                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  Test your skills on real client briefs! Solve 30-minute mini challenges, submit your work, earn <strong className="text-amber-300 font-bold">Skill Points</strong>, and unlock verified profile badges.
                </p>

                {/* Banner Stats */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <strong>+{userPoints} PTS</strong> Earned
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <strong>{completedChallengeIds.length}</strong> Completed Challenges
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                    <Award className="w-4 h-4 text-pink-300" />
                    <span>Verified Badges</span>
                  </span>
                </div>
              </div>

              {/* Feature Callout Box */}
              <div className="bg-slate-950/80 border border-white/15 p-5 rounded-3xl text-center backdrop-blur-md w-full md:w-auto space-y-2">
                <span className="text-[11px] text-amber-300 font-bold uppercase block">Next Reward Target</span>
                <span className="text-lg font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                  <Award className="w-5 h-5 text-amber-400" /> +50 PTS / Challenge
                </span>
                <p className="text-[10px] text-slate-300 font-medium">Unlocks exclusive client gig invites</p>
              </div>
            </div>
          </div>

          {/* Active Challenges Grid (Typographic Brief Cards with Monogram Badge) */}
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((ch, idx) => {
              const isDone = completedChallengeIds.includes(ch.id);

              return (
                <div
                  key={ch.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-slate-900 dark:text-white space-y-5 relative group"
                >
                  <div className="space-y-4">
                    
                    {/* Top Row: Category & Rewards Pills */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {ch.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ⏱ {ch.timeLimit}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                          <Award className="w-3 h-3" /> 🏆 +{ch.points} PTS
                        </span>
                      </div>
                    </div>

                    {/* Challenge Title & Client Monogram Badge */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-base text-purple-600 dark:text-purple-400 shadow-xs shrink-0">
                        {ch.company ? ch.company.charAt(0) : 'C'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {ch.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mt-0.5">
                          Client: {ch.company} • Difficulty: <span className="text-purple-600 dark:text-pink-400 font-extrabold">{ch.difficulty}</span>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {ch.description}
                    </p>

                    {/* Badge Unlocked Preview */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Reward Badge: {ch.badgeUnlocked}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{ch.completedCount} Learner Submissions</span>
                    </div>

                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Real-World Practical Task
                    </span>

                    <button
                      type="button"
                      onClick={() => navigate(`/challenges/${ch.id}`)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                        isDone 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Completed (+{ch.points} PTS)</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Start Challenge ({ch.timeLimit})</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================
          SECTION 3: 🧩 MINI PUZZLE GAMES & LOGIC LAB VIEW
         ======================================================== */}
      {activeTab === 'puzzles' && (
        <PuzzleHub 
          user={user}
          onUpdateUserSkillPoints={(points, badge) => {
            setUserPoints(points);
            if (onUpdateUserSkillPoints) {
              onUpdateUserSkillPoints(points, badge);
            }
          }}
          showToast={showToast}
          defaultGame={puzzleSubGame}
        />
      )}

      {/* ========================================================
          OFFICIAL VERIFIED CERTIFICATE MODAL
         ======================================================== */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        user={effectiveUser}
        trackTitle={certificateTrackTitle || currentTrack.title}
      />

    </div>
  );
}
