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
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { skillTracks } from '../data/mockData';

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
        // Try fetching track details from backend
        const res = await api.getTrackDetails(targetId);
        if (res.success && res.track) {
          setTrack(res.track);
          setLessons(res.track.lessons || []);
        } else {
          throw new Error('Track not found on backend');
        }
      } catch (err) {
        // Fallback to local mock data
        const localTrack = skillTracks.find(t => t.id === targetId) || skillTracks[0];
        setTrack(localTrack);
        setLessons(localTrack.lessons || []);
      }

      // Fetch progress/enrollment
      try {
        const progRes = await api.getTrackProgress(targetId);
        if (progRes.success && progRes.progressPercent !== undefined) {
          setProgressPercent(progRes.progressPercent);
        }
      } catch (err) {
        // Local calculation fallback
        const completed = user?.completedLessons || [];
        setUserCompletedLessons(completed);
        const targetTrack = skillTracks.find(t => t.id === targetId) || skillTracks[0];
        const matchCount = targetTrack.lessons.filter(l => completed.includes(l.id)).length;
        setProgressPercent(Math.round((matchCount / (targetTrack.lessons.length || 1)) * 100));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackInfo();
  }, [trackId, user]);

  const handleEnrollOrContinue = async () => {
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
      // Navigate to first lesson or current lesson
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
        to="/learn"
        className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Skill Tracks
      </Link>

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-10 border border-purple-500/30 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
              {track.category || 'Skill Track'}
            </span>
            <span className="px-3 py-1 rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/30">
              {track.level || 'Beginner'}
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-4 h-4 text-purple-400" />
              {track.duration || '3h 30m'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{track.title}</h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{track.description}</p>

          {/* Progress bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold">
              <span>Course Progress</span>
              <span className="text-pink-400">{progressPercent}% Completed</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={handleEnrollOrContinue}
              disabled={isEnrolling}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
            >
              {isEnrolling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
              <span>{completedCount > 0 ? 'Continue Learning' : 'Start Track Free'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Course Syllabus / Lessons List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-purple-500/20 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Lesson Modules & Syllabus
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lessons.length} video lessons • {completedCount} of {lessons.length} completed
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const isCompleted = (user?.completedLessons || userCompletedLessons).includes(lesson.id);

            return (
              <div 
                key={lesson.id || idx}
                onClick={() => navigate(`/courses/${track.id}/lessons/${lesson.id}`)}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all hover:border-purple-500 hover:shadow-md ${
                  isCompleted 
                    ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm">{lesson.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> {lesson.duration || '15 min'}
                      {lesson.type && <span>• {lesson.type}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
