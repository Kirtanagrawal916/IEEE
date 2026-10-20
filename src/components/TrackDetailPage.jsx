import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Play, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  UserCheck, 
  Sparkles,
  Loader2,
  Lock,
  Star,
  TrendingUp,
  ShieldCheck,
  Check,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api';
import { skillTracks } from '../data/mockData';
import { isTrackUnlocked } from '../utils/trackLockHelper';

export default function TrackDetailPage({ user, onCompleteLesson }) {
  const { trackId } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [userCompletedLessons, setUserCompletedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    const fetchTrackInfo = async () => {
      setIsLoading(true);
      const targetId = trackId || 'track-1';

      try {
        const res = await api.getTrackDetails(targetId);
        if (res.success && res.track) {
          // Merge with rich local mock data
          const localTrack = skillTracks.find(t => t.id === targetId) || {};
          setTrack({ ...localTrack, ...res.track });
          setLessons((res.track.lessons && res.track.lessons.length > 0) ? res.track.lessons : (localTrack.lessons || []));
        } else {
          throw new Error('Track not found on backend');
        }
      } catch (err) {
        const localTrack = skillTracks.find(t => t.id === targetId) || skillTracks[0];
        setTrack(localTrack);
        setLessons(localTrack.lessons || []);
      }

      // Fetch progress
      try {
        const progRes = await api.getTrackProgress(targetId);
        if (progRes.success && progRes.progressPercent !== undefined) {
          setProgressPercent(progRes.progressPercent);
        }
      } catch (err) {
        const completed = user?.completedLessons || [];
        setUserCompletedLessons(completed);
        const targetTrack = skillTracks.find(t => t.id === targetId) || skillTracks[0];
        const matchCount = (targetTrack.lessons || []).filter(l => completed.includes(l.id)).length;
        setProgressPercent(Math.round((matchCount / (targetTrack.lessons?.length || 1)) * 100));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackInfo();
  }, [trackId, user]);

  const handleEnrollOrContinue = async () => {
    const isUnlocked = isTrackUnlocked(track?.id || trackId, user);
    if (!isUnlocked) {
      navigate('/opportunities');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      await api.enrollTrack(track?.id || trackId);
    } catch (err) {
      console.log('[TrackDetail] Enroll notice:', err.message);
    } finally {
      setIsEnrolling(false);
      const firstLesson = lessons[0]?.id || 'm1-l1';
      navigate(`/courses/${track?.id || trackId || 'track-1'}/lessons/${firstLesson}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading skill track details...</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Track Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400">The requested skill track could not be loaded.</p>
        <Link to="/learn" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to All Tracks
        </Link>
      </div>
    );
  }

  const completedCount = lessons.filter(l => (user?.completedLessons || userCompletedLessons).includes(l.id)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Back link */}
      <Link 
        to="/courses"
        className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Course Catalog
      </Link>

      {/* Header Showcase Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
            {(track.isDemoCourse || track.id === 'track-demo') && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Demo Course • Always Unlocked
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white/10 text-purple-300 border border-white/20 backdrop-blur-md">
              {track.category || 'Skill Track'}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/20 backdrop-blur-md">
              {track.level || 'Beginner Friendly'}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {track.duration || '4 Hours'}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {track.rating || '4.9'} ({track.reviewsCount || '320'} reviews)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {track.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {track.description}
          </p>

          {/* Earning potential chip & Instructor */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {track.earningPotential && (
              <div className="bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Earn {track.earningPotential}</span>
              </div>
            )}
            <span className="text-slate-300 font-medium">
              Instructor: <strong className="text-white">{track.instructor || 'Senior Industry Mentor'}</strong>
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 pt-2 max-w-lg">
            <div className="flex justify-between text-xs font-bold">
              <span>Your Track Progress</span>
              <span className="text-amber-300">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {isTrackUnlocked(track?.id || trackId, user) ? (
              <button
                type="button"
                onClick={handleEnrollOrContinue}
                disabled={isEnrolling}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
              >
                {isEnrolling ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
                <span>{completedCount > 0 ? 'Resume Lessons' : 'Start Track Free'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/opportunities')}
                className="px-6 py-3.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 font-extrabold text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Lock className="w-5 h-5 text-amber-300" />
                <span>Track Locked (Apply Opportunity to Unlock)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skills Covered Pills */}
      {track.skillsCovered && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Skills & Software Covered in this Track:
          </h3>
          <div className="flex flex-wrap gap-2">
            {track.skillsCovered.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800"
              >
                #{skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Course Syllabus / Lessons List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Course Syllabus & Practice Modules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lessons.length} video lessons • {completedCount} of {lessons.length} completed
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Practical Client Briefs
          </span>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const isCompleted = (user?.completedLessons || userCompletedLessons).includes(lesson.id);
            const isTrackOpen = isTrackUnlocked(track.id, user);

            return (
              <div 
                key={lesson.id || idx}
                onClick={() => {
                  if (!isTrackOpen) {
                    navigate('/opportunities');
                    return;
                  }
                  navigate(`/courses/${track.id}/lessons/${lesson.id}`);
                }}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-purple-500 hover:shadow-md ${
                  !isTrackOpen
                    ? 'bg-slate-100/70 dark:bg-slate-800/30 border-dashed border-slate-300 dark:border-slate-700'
                    : isCompleted 
                    ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{lesson.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3" /> {lesson.duration || '15 min'}
                      {lesson.summary && <span className="hidden sm:inline text-slate-400 truncate max-w-md">• {lesson.summary}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCompleted && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      Completed
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
