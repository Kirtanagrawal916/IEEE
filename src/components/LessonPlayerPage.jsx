import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Play, 
  Loader2, 
  Award, 
  ChevronLeft, 
  Gamepad2,
  Lock,
  Briefcase,
  ExternalLink,
  FileText,
  RefreshCw,
  AlertTriangle,
  Tv
} from 'lucide-react';
import { api } from '../services/api';
import { skillTracks } from '../data/mockData';
import { isTrackUnlocked } from '../utils/trackLockHelper';

export default function LessonPlayerPage({ user, onCompleteLesson, showToast }) {
  const { trackId, lessonId } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComplete, setIsSubmittingComplete] = useState(false);
  const [userCompletedLessons, setUserCompletedLessons] = useState(user?.completedLessons || []);
  const [activeMediaTab, setActiveMediaTab] = useState('video'); // 'video' | 'transcript'
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const loadLessonDetails = async () => {
      setIsLoading(true);
      const targetTrackId = trackId || 'track-1';
      const targetLessonId = lessonId || 'm1-l1';

      let foundTrack = null;
      let foundLessons = [];

      try {
        const trackRes = await api.getTrackDetails(targetTrackId);
        if (trackRes.success && trackRes.track) {
          foundTrack = trackRes.track;
          foundLessons = trackRes.track.lessons || [];
        } else {
          throw new Error('Fallback to local track');
        }
      } catch (err) {
        foundTrack = skillTracks.find(t => t.id === targetTrackId) || skillTracks[0];
        foundLessons = foundTrack.lessons || [];
      }

      setTrack(foundTrack);
      setLessons(foundLessons);

      const targetLesson = foundLessons.find(l => l.id === targetLessonId) || foundLessons[0];
      setCurrentLesson(targetLesson);

      setUserCompletedLessons(user?.completedLessons || []);
      setIsLoading(false);
    };

    loadLessonDetails();
  }, [trackId, lessonId, user]);

  const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const isCompleted = userCompletedLessons.includes(currentLesson?.id);

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    setIsSubmittingComplete(true);

    try {
      await api.markLessonComplete(currentLesson.id);
    } catch (err) {
      console.log('[LessonPlayer] API complete note:', err.message);
    } finally {
      if (onCompleteLesson) {
        onCompleteLesson(currentLesson.id);
      }

      setUserCompletedLessons(prev => [...new Set([...prev, currentLesson.id])]);
      setIsSubmittingComplete(false);

      if (showToast) {
        showToast("🎉 Lesson Completed!", `You have successfully completed "${currentLesson.title}".`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading lesson video player...</p>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Lesson Not Found</h2>
        <Link to={`/courses/${trackId}`} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Track Details
        </Link>
      </div>
    );
  }

  // Check if course track is locked
  if (!isTrackUnlocked(track?.id || trackId, user)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in text-slate-900 dark:text-white">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
            Course Lectures Locked
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            "{track?.title || 'This Course'}" is Locked
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
            To unlock this lecture, please apply for an Opportunity in <strong>{track?.category || 'this field'}</strong> on the opportunities board. Once you apply, the lectures will automatically open in your profile permanently!
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
            onClick={() => navigate('/courses')}
            className="px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Back to Courses Catalog
          </button>
        </div>
      </div>
    );
  }

  // Construct embedded YouTube URL
  const videoUrl = currentLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  const embedUrl = videoUrl.includes('watch?v=') 
    ? videoUrl.replace('watch?v=', 'embed/') 
    : (videoUrl.includes('embed') ? videoUrl : 'https://www.youtube.com/embed/dQw4w9WgXcQ');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link 
          to={`/courses/${track?.id || trackId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {track?.title || 'Track'}
        </Link>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Lesson {currentIndex + 1} of {lessons.length}
        </span>
      </div>

      {/* Main Grid: Video Player + Lesson Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Top: Video Player & Controls */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Media View Mode Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveMediaTab('video')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Video Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMediaTab('transcript')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMediaTab === 'transcript'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-purple-600'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lecture Notes & Transcript</span>
              </button>
            </div>

            <a
              href={embedUrl.includes('embed/') ? embedUrl.replace('/embed/', '/watch?v=') : embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Open video on YouTube in a new tab"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Conditional Media Display */}
          {activeMediaTab === 'video' ? (
            <div className="space-y-2">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                {iframeError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-950 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm sm:text-base">Video Embed Restricted or Blocked</h4>
                      <p className="text-xs text-slate-400 max-w-md">
                        Your browser or network has restricted inline YouTube playback. You can watch the lesson directly on YouTube or switch to the interactive lecture notes below.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <a
                        href={embedUrl.includes('embed/') ? embedUrl.replace('/embed/', '/watch?v=') : embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open on YouTube</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('transcript')}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Read Lesson Notes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe 
                    src={embedUrl}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onError={() => setIframeError(true)}
                  ></iframe>
                )}
              </div>
              
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Tip: Click "Watch on YouTube" if video loading is slow on your connection.</span>
                <button
                  type="button"
                  onClick={() => setIframeError(prev => !prev)}
                  className="hover:text-purple-500 underline text-[10px]"
                >
                  {iframeError ? 'Retry video player' : 'Player not loading?'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Comprehensive Lecture Dossier & Key Frameworks</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold">
                  {currentLesson.duration || '15 min read'}
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40">
                  <h4 className="font-extrabold text-purple-900 dark:text-purple-200 mb-1">Executive Summary</h4>
                  <p>{currentLesson.summary || 'Master real-world deliverables, design standards, and practical industry workflows tailored for freelance client projects.'}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white">Core Action Items & Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                    {(currentLesson.keyTakeaways && Array.isArray(currentLesson.keyTakeaways) ? currentLesson.keyTakeaways : [
                      "Understand fundamental client briefs and target audience personas",
                      "Leverage professional templates and brand guideline kits",
                      "Export high-resolution deliverables ready for client deployment",
                      "Document your workflow step-by-step to include in your proof-of-work portfolio"
                    ]).map((t, idx) => (
                      <li key={idx}><span className="font-semibold text-slate-800 dark:text-slate-200">{t}</span></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  ← Return to Video Player
                </button>
                <button
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={isSubmittingComplete || isCompleted}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Marked Complete ✓' : 'Mark Lesson Complete'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Lesson Header & Mark Complete CTA */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-purple-500/20 shadow-md space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                  {track?.title}
                </span>
                <h1 className="text-2xl font-black mt-2">{currentLesson.title}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-purple-500" /> {currentLesson.duration || '15 min'}
                  {currentLesson.instructor && <span>• Instructor: {currentLesson.instructor}</span>}
                </p>
              </div>

              {/* Complete Lesson Button */}
              <button
                type="button"
                onClick={handleMarkComplete}
                disabled={isSubmittingComplete || isCompleted}
                className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                }`}
              >
                {isSubmittingComplete ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isCompleted ? 'Completed ✓' : 'Mark Lesson Complete'}</span>
              </button>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Summary & Takeaways */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <BookOpen className="w-4 h-4" /> Summary & Key Takeaways
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentLesson.summary || 'In this lesson, you will master practical skills and concepts necessary to complete your portfolio project.'}
              </p>
            </div>

            {/* Previous / Next Lesson Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              {prevLesson ? (
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${track?.id || trackId}/lessons/${prevLesson.id}`)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Lesson
                </button>
              ) : <div />}

              {nextLesson ? (
                <button
                  type="button"
                  onClick={() => navigate(`/courses/${track?.id || trackId}/lessons/${nextLesson.id}`)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 text-xs font-bold flex items-center gap-2"
                >
                  Next Lesson <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/portfolio"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold flex items-center gap-2"
                >
                  Build Portfolio Project <Award className="w-4 h-4" />
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Playlist Syllabus */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-purple-500/20 shadow-md h-fit space-y-4">
          <h3 className="font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Track Syllabus ({lessons.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {lessons.map((lesson, idx) => {
              const isCurrent = lesson.id === currentLesson?.id;
              const isDone = userCompletedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id || idx}
                  onClick={() => navigate(`/courses/${track?.id || trackId}/lessons/${lesson.id}`)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    isCurrent 
                      ? 'bg-purple-600 text-white font-bold border-purple-500 shadow-md'
                      : isDone 
                      ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/40 text-slate-700 dark:text-slate-300' 
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent 
                        ? 'bg-white text-purple-700' 
                        : isDone 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {isDone ? '✓' : idx + 1}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                  </div>

                  <span className="text-[10px] opacity-80 shrink-0">{lesson.duration || '15m'}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Brain Break Link */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/courses?tab=puzzles"
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/50 flex items-center justify-between text-xs transition-all group"
            >
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold">
                <Gamepad2 className="w-4 h-4 text-pink-500" />
                <span>🧠 Quick Brain Break (Puzzles)</span>
              </div>
              <span className="text-[10px] text-pink-600 dark:text-pink-400 font-extrabold group-hover:translate-x-0.5 transition-transform">Play →</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
