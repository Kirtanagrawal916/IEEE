import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Zap, 
  Gamepad2, 
  GraduationCap, 
  Trophy, 
  Flame, 
  List, 
  TableProperties, 
  Tv, 
  Compass, 
  Search, 
  X, 
  TrendingUp, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  CheckCircle, 
  Circle, 
  Download, 
  Sparkles, 
  ExternalLink, 
  Crown, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Printer,
  Boxes,
  Loader2
} from 'lucide-react';
import { skillTracks } from '../data/mockData';
import { initialChallenges } from '../data/challengesData';
import { api } from '../services/api';
import PuzzleHub from './puzzles/PuzzleHub';

// LinkedIn icon SVG
function LinkedInIcon() {
  return (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

// Certificate Modal Component with Canvas Export & LinkedIn Integration
function CertificateModal({ isOpen, onClose, user, trackTitle }) {
  useEffect(() => {
    // Add overflow hidden to body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const certId = `HE-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const recipientName = user?.name || 'Verified Learner';
  const certifiedTrack = trackTitle || 'Digital Marketing & Growth Strategy';

  const handleDownloadCanvas = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const grad = ctx.createLinearGradient(0, 0, 1200, 800);
      grad.addColorStop(0, '#fcfaff');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#fdf2f8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 800);

      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, 1110, 710);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#7e22ce';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('OFFICIAL CERTIFICATE OF COMPLETION', 600, 140);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('HerEarn Skills Academy', 600, 200);

      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 22px sans-serif';
      ctx.fillText('This is to proudly certify that', 600, 260);

      ctx.fillStyle = '#6b21a8';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText(recipientName, 600, 335);

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(350, 355);
      ctx.lineTo(850, 355);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '19px sans-serif';
      ctx.fillText('has successfully mastered all practical modules, assignments & capstone deliverables for:', 600, 410);

      ctx.fillStyle = '#f3e8ff';
      ctx.fillRect(200, 440, 800, 70);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.strokeRect(200, 440, 800, 70);

      ctx.fillStyle = '#581c87';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(certifiedTrack, 600, 485);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`ISSUE DATE: ${issueDate}`, 120, 680);
      ctx.fillText(`CREDENTIAL ID: ${certId}`, 120, 710);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('VERIFIED AUTHENTIC CERTIFICATE ✓', 1080, 680);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('https://herearn.org/verify', 1080, 710);

      const link = document.createElement('a');
      link.download = `HerEarn-Certificate-${recipientName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.warn('[Certificate Export] Error generating image:', err);
      window.print();
    }
  };

  const handleAddToLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certifiedTrack)}&organizationName=HerEarn%20Skills%20Academy&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(window.location.origin)}&certId=${certId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Verified Skill Certificate
              </h2>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                Credential verifiable across client opportunities & LinkedIn
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body Container */}
        <div className="p-6 sm:p-10 space-y-6">
          <div className="relative border-8 border-double border-purple-200 dark:border-purple-800/60 p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-purple-50/40 via-white to-pink-50/30 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950 text-center space-y-6 shadow-inner">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg">
                <Award className="w-9 h-9" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Official Certificate of Completion
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                HerEarn Skills Academy
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              This is to proudly certify that
            </p>

            <div className="py-2">
              <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300 underline underline-offset-8 decoration-pink-500/50">
                {recipientName}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              has successfully mastered all practical modules, assignments & capstone deliverables for:
            </p>

            <div className="p-4 rounded-xl bg-purple-100/70 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-200 font-bold text-lg">
              {certifiedTrack}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-100 dark:border-purple-900/40 text-left text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Issue Date</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Credential ID</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{certId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Status</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToLinkedIn}
              className="px-4 py-2.5 rounded-xl bg-[#0077b5] hover:bg-[#005f93] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <LinkedInIcon />
              <span>Add to LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCanvas}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearnSection({ 
  user, 
  onCompleteLesson, 
  onNavigateToPortfolio, 
  onUpdateUserSkillPoints, 
  showToast 
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab & View Navigation States
  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    urlTab === 'puzzles' || urlTab === 'games' 
      ? 'puzzles' 
      : urlTab === 'challenges' 
      ? 'challenges' 
      : 'courses'
  ); // 'courses' | 'challenges' | 'puzzles'

  const [courseView, setCourseView] = useState(() => searchParams.get('view') || 'curriculum'); // 'curriculum' | 'table' | 'classroom' | 'roadmap'
  const [puzzleSubGame, setPuzzleSubGame] = useState(() => searchParams.get('game') || 'queen');

  // Track & Lesson Data States
  const [tracks, setTracks] = useState(skillTracks);
  const [selectedTrackId, setSelectedTrackId] = useState('track-1');
  const [activeLessonId, setActiveLessonId] = useState('m1-l1');
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [backendProgressPercent, setBackendProgressPercent] = useState(null);

  // Filters & Lesson Studio States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lessonTab, setLessonTab] = useState('overview'); // 'overview' | 'takeaways' | 'resources' | 'notes'
  const [lessonNotes, setLessonNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('herearn_lesson_notes') || '{}');
    } catch {
      return {};
    }
  });

  // Certificate Modal State
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [certTrackTitle, setCertTrackTitle] = useState('');

  // Challenge Zone states
  const [challenges, setChallenges] = useState(initialChallenges);
  const [completedChallengeIds, setCompletedChallengeIds] = useState([]);
  const [userPoints, setUserPoints] = useState(user?.skillPoints || 150);

  // Fetch Tracks
  useEffect(() => {
    const fetchLiveTracks = async () => {
      setIsLoadingTracks(true);
      try {
        const res = await api.getTracks();
        if (res.success && res.tracks && res.tracks.length > 0) {
          setTracks(prev => {
            const updated = [...skillTracks];
            res.tracks.forEach(t => {
              const idx = updated.findIndex(u => u.id === t.id);
              if (idx >= 0) {
                updated[idx] = { ...updated[idx], ...t, lessons: t.lessons && t.lessons.length > 0 ? t.lessons : updated[idx].lessons };
              } else {
                updated.push(t);
              }
            });
            return updated;
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

  // Fetch Progress
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

  const currentTrack = useMemo(() => {
    return tracks.find(t => t.id === selectedTrackId) || tracks[0] || skillTracks[0];
  }, [tracks, selectedTrackId]);

  const activeLesson = useMemo(() => {
    const lessons = currentTrack.lessons || [];
    return lessons.find(l => l.id === activeLessonId) || lessons[0] || {};
  }, [currentTrack, activeLessonId]);

  const userCompletedLessons = user?.completedLessons || [];
  const trackLessonsCount = currentTrack.lessons ? currentTrack.lessons.length : 1;
  const completedCount = (currentTrack.lessons || []).filter(l => userCompletedLessons.includes(l.id)).length;
  const progressPercent = backendProgressPercent !== null 
    ? backendProgressPercent 
    : Math.round((completedCount / trackLessonsCount) * 100);

  const isCurrentLessonCompleted = userCompletedLessons.includes(activeLesson.id);

  // Total lessons across all tracks
  const totalLessonsCount = useMemo(() => {
    return tracks.reduce((acc, t) => acc + (t.lessons?.length || 0), 0);
  }, [tracks]);

  // Tab switch handler
  const handleTabChange = (tab, game = 'queen') => {
    setActiveTab(tab);
    if (game) setPuzzleSubGame(game);
    setSearchParams(tab === 'courses' ? {} : { tab, ...(tab === 'puzzles' ? { game } : {}) });
  };

  // Jump directly to a track's classroom studio
  const handleOpenClassroom = (trackId) => {
    setSelectedTrackId(trackId);
    const targetTrack = tracks.find(t => t.id === trackId) || skillTracks[0];
    const firstLessonId = targetTrack.lessons?.[0]?.id || 'm1-l1';
    setActiveLessonId(firstLessonId);
    setCourseView('classroom');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Notes Handler
  const handleSaveNote = (text) => {
    const updated = { ...lessonNotes, [activeLesson.id]: text };
    setLessonNotes(updated);
    try {
      localStorage.setItem('herearn_lesson_notes', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Lesson Completion
  const handleLessonCompleteAction = (lessonId) => {
    onCompleteLesson(lessonId);
    if (showToast) {
      showToast('🎉 Lesson Mastered!', `+25 PTS earned! ${activeLesson.title}`);
    }
  };

  // Filtered tracks for Syllabus Dossiers
  const filteredTracks = useMemo(() => {
    return tracks.filter(t => {
      const matchCat = categoryFilter === 'All' || t.category?.toLowerCase().includes(categoryFilter.toLowerCase());
      const matchQuery = !searchQuery.trim() || 
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [tracks, categoryFilter, searchQuery]);

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* ========================================================
          1. TOP HUB SWITCHER BAR (Courses vs Challenges vs Logic Arcade)
         ======================================================== */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-purple-500/30 shadow-md">
        <div className="flex items-center gap-2 flex-wrap">
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
            <span>Curriculum Studio</span>
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

        {/* Right Status Badges: Certificate Button + PTS + Streak */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              setCertTrackTitle(currentTrack.title);
              setIsCertOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Preview Verified Certificate"
          >
            <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Official Certificate</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span><strong className="text-purple-600 dark:text-purple-400 font-extrabold">{userPoints}</strong> PTS</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs font-bold text-amber-900 dark:text-amber-200">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>4-Day Streak</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. VIEW 1: CURRICULUM STUDIO (Contains Sub-Views: Dossiers, Matrix, Classroom, Roadmap)
         ======================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fade-in">

          {/* Sub-view Navigation Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCourseView('curriculum')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseView === 'curriculum'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Syllabus Dossiers ({tracks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseView('table')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseView === 'table'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Curriculum Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseView('classroom')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseView === 'classroom'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Active Classroom Studio</span>
              </button>

              <button
                type="button"
                onClick={() => setCourseView('roadmap')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  courseView === 'roadmap'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Earning Blueprint</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{totalLessonsCount} Practical Lessons Live</span>
            </div>
          </div>

          {/* ----------------------------------------------------
              SUBVIEW A: SYLLABUS DOSSIERS
             ---------------------------------------------------- */}
          {courseView === 'curriculum' && (
            <div className="space-y-6 animate-fade-in">
              {/* Search & Category Filter Pills */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search track title or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto overflow-x-auto pb-1">
                  {['All', 'Marketing', 'Design', 'E-Commerce', 'Content', 'Handicrafts'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dossiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTracks.map((track, idx) => {
                  const completedInThis = (track.lessons || []).filter(l => userCompletedLessons.includes(l.id)).length;
                  const trackTotal = track.lessons?.length || 1;
                  const percent = Math.round((completedInThis / trackTotal) * 100);

                  return (
                    <div
                      key={track.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-xl hover:border-purple-400/50 transition-all duration-300 group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            TRACK 0{idx + 1}
                          </span>
                          <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {track.category || 'Specialization'}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                            {track.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                            {track.description}
                          </p>
                        </div>

                        {/* Inset Info Box */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl space-y-2 text-xs border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-purple-500" />
                              <span>{track.duration || '4-6 Weeks'}</span>
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {track.lessons?.length || 4} Practical Modules
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-1">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Deliverable:</span>
                            </span>
                            <span className="font-bold text-purple-600 dark:text-purple-400 truncate max-w-[150px]">
                              {track.capstone || 'Capstone Project'}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar (if started) */}
                        {completedInThis > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-slate-500">Your Progress</span>
                              <span className="text-purple-600 dark:text-purple-400">{percent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenClassroom(track.id)}
                        className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <span>{completedInThis > 0 ? 'Continue Classroom Studio' : 'Enter Classroom Studio'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              SUBVIEW B: CURRICULUM MATRIX TABLE
             ---------------------------------------------------- */}
          {courseView === 'table' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-4 px-6">Track & Instructor</th>
                      <th className="py-4 px-5">Discipline</th>
                      <th className="py-4 px-5">Modules</th>
                      <th className="py-4 px-5">Practical Hours</th>
                      <th className="py-4 px-5">Capstone Deliverable</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Studio Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-700 dark:text-slate-300">
                    {tracks.map((t, idx) => {
                      const completedCount = (t.lessons || []).filter(l => userCompletedLessons.includes(l.id)).length;
                      return (
                        <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{t.title}</div>
                            <div className="text-[11px] text-slate-400">Led by {t.instructor || 'Senior Industry Mentor'}</div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                              {t.category || 'Digital Skills'}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-bold">{t.lessons?.length || 4} Lessons</td>
                          <td className="py-4 px-5">{t.duration || '4-6 Weeks'}</td>
                          <td className="py-4 px-5">
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">{t.capstone || 'Client Deliverable'}</span>
                          </td>
                          <td className="py-4 px-5">
                            {completedCount > 0 ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                                {completedCount} / {t.lessons?.length || 4} Done
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold">
                                Ready
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenClassroom(t.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                            >
                              <span>Classroom</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------
              SUBVIEW C: ACTIVE CLASSROOM STUDIO
             ---------------------------------------------------- */}
          {courseView === 'classroom' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Banner */}
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
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

                {/* Track Progress Box */}
                <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl w-full md:w-80 space-y-3 text-white backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">Track Progress</span>
                    <span className="text-amber-300">{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{completedCount} of {trackLessonsCount} Lessons Done</span>
                    {progressPercent >= 80 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCertTrackTitle(currentTrack.title);
                          setIsCertOpen(true);
                        }}
                        className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" /> Claim Certificate
                      </button>
                    ) : (
                      <span className="text-slate-500">Finish 80% to certify</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Grid: Left Lesson Player & Details, Right Playlist */}
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Lesson Player & Interactive Tabs */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Video Player */}
                  <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative">
                    <iframe
                      src={activeLesson.videoUrl || 'https://www.youtube.com/embed/nU-IIXBWlS4'}
                      title={activeLesson.title || 'Lesson Video'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Lesson Details Card */}
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
                        onClick={() => handleLessonCompleteAction(activeLesson.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                          isCurrentLessonCompleted
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {isCurrentLessonCompleted ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-white" />
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

                    {/* Lesson Sub-Tabs: Overview, Takeaways, Downloads, Notes */}
                    <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto scrollbar-thin">
                      <button
                        type="button"
                        onClick={() => setLessonTab('overview')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          lessonTab === 'overview'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        📝 Lesson Overview
                      </button>

                      <button
                        type="button"
                        onClick={() => setLessonTab('takeaways')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          lessonTab === 'takeaways'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        💡 Concepts Mastered
                      </button>

                      <button
                        type="button"
                        onClick={() => setLessonTab('resources')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          lessonTab === 'resources'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        📥 Downloads & Templates
                      </button>

                      <button
                        type="button"
                        onClick={() => setLessonTab('notes')}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          lessonTab === 'notes'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        📓 My Notes
                      </button>
                    </div>

                    {/* Sub-tab 1: Overview */}
                    {lessonTab === 'overview' && (
                      <div className="space-y-4 text-xs leading-relaxed animate-fade-in">
                        <p className="text-slate-700 dark:text-slate-300 font-medium sm:text-sm">
                          {activeLesson.summary || 'In this hands-on lesson, you will master the foundational execution steps, software tools, and best practices to deliver verified client deliverables.'}
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

                    {/* Sub-tab 2: Takeaways */}
                    {lessonTab === 'takeaways' && (
                      <div className="space-y-3 animate-fade-in">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Checklist of Core Concepts:
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2 text-xs">
                          {(activeLesson.keyTakeaways || [
                            'Setting up project workspaces and file templates',
                            'Understanding target audience parameters',
                            'Client delivery formatting standards',
                            'Quality audit before handover'
                          ]).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sub-tab 3: Resources & Downloads */}
                    {lessonTab === 'resources' && (
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
                            onClick={() => showToast && showToast('📥 Download Started', 'Practice Worksheet (.PDF) downloaded.')}
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

                    {/* Sub-tab 4: Notes */}
                    {lessonTab === 'notes' && (
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

                  {/* Capstone Ready Banner */}
                  {progressPercent >= 60 && (
                    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-purple-500/40 shadow-xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>Capstone Portfolio Ready!</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Publish Your Deliverable & Unlock Client Micro-Gigs
                      </h3>
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

                  {/* Brain Break Arcade */}
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
                        <Boxes className="w-3.5 h-3.5" />
                        <span>Tower of Hanoi</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTabChange('puzzles')}
                        className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer"
                      >
                        Explore All 10 Puzzles →
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Column: Switch Track & Lesson Playlist */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Switch Track Selector */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Switch Track
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCourseView('curriculum')}
                        className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        View Dossiers ({tracks.length})
                      </button>
                    </div>

                    <div className="space-y-2">
                      {tracks.map((t, idx) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setSelectedTrackId(t.id);
                            setActiveLessonId(t.lessons?.[0]?.id || 'm1-l1');
                          }}
                          className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                            selectedTrackId === t.id
                              ? 'bg-purple-50 dark:bg-purple-950/70 border-purple-500 text-purple-950 dark:text-white shadow-xs'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                              0{idx + 1}
                            </span>
                            <div className="truncate">
                              <p className="font-bold text-xs truncate">{t.title}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {t.lessons?.length || 4} Lessons • {t.category}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Playlist */}
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
                      {(currentTrack.lessons || []).map((l, idx) => {
                        const isDone = userCompletedLessons.includes(l.id);
                        const isCurrent = l.id === activeLessonId;

                        return (
                          <div
                            key={l.id}
                            onClick={() => setActiveLessonId(l.id)}
                            className={`p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                              isCurrent
                                ? 'bg-purple-100 dark:bg-purple-950/80 border-purple-500 text-purple-950 dark:text-white shadow-xs font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : isCurrent ? (
                                <Play className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 fill-purple-600 dark:fill-purple-400" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="truncate">{l.title}</p>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                                  {l.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

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

          {/* ----------------------------------------------------
              SUBVIEW D: EARNING BLUEPRINT ROADMAP
             ---------------------------------------------------- */}
          {courseView === 'roadmap' && (
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
                    icon: Trophy,
                    status: 'Goal',
                    color: 'text-emerald-500'
                  }
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-black text-slate-300 dark:text-slate-700">
                            {s.step}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {s.status}
                          </span>
                        </div>

                        <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center">
                          <Icon className={`w-5 h-5 ${s.color}`} />
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {s.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        {idx === 0 ? (
                          <button
                            type="button"
                            onClick={() => setCourseView('curriculum')}
                            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Browse Tracks</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : idx === 1 ? (
                          <button
                            type="button"
                            onClick={() => setCourseView('classroom')}
                            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open Studio</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : idx === 2 ? (
                          <button
                            type="button"
                            onClick={() => handleTabChange('challenges')}
                            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Challenge Zone</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : idx === 3 ? (
                          <button
                            type="button"
                            onClick={onNavigateToPortfolio}
                            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Portfolio</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => navigate('/opportunities')}
                            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Find Gigs</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================
          3. VIEW 2: CLIENT CHALLENGE ZONE
         ======================================================== */}
      {activeTab === 'challenges' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-mono font-bold">
                <Zap className="w-3.5 h-3.5" /> 30-MINUTE CLIENT BRIEFS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                HerEarn Challenge Arena
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Solve realistic deliverables under timed conditions. Earn bonus Skill Points and unlock Verified Badges for client recruiters.
              </p>
            </div>

            <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl text-center space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Arena Balance</p>
              <p className="text-2xl font-black text-amber-400">{userPoints} PTS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(c => {
              const isCompleted = completedChallengeIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        {c.category}
                      </span>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {c.duration || '30 Min'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {c.scenario || c.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        +{c.pointsReward || 50} Skill Points
                      </span>
                      <span className="text-slate-500 font-semibold">{c.difficulty || 'Intermediate'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/challenges/${c.id}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isCompleted ? 'Review Submission' : 'Launch Challenge Brief'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          4. VIEW 3: LOGIC ARCADE (10 Interactive Puzzles)
         ======================================================== */}
      {activeTab === 'puzzles' && (
        <div className="space-y-6 animate-fade-in">
          <PuzzleHub
            initialGame={puzzleSubGame}
            onEarnPoints={(pts, title) => {
              const newPts = userPoints + pts;
              setUserPoints(newPts);
              if (onUpdateUserSkillPoints) {
                onUpdateUserSkillPoints(newPts, 'Puzzle Master');
              }
              if (showToast) {
                showToast(`🎮 Puzzle Solved! +${pts} PTS`, `Awesome work on ${title}!`);
              }
            }}
          />
        </div>
      )}

      {/* Verified Skill Certificate Modal */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        user={user}
        trackTitle={certTrackTitle}
      />

    </div>
  );
}
