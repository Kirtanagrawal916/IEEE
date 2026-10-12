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
  ChevronLeft
} from 'lucide-react';
import { api } from '../services/api';
import { skillTracks } from '../data/mockData';

export default function LessonPlayerPage({ user, onCompleteLesson, showToast }) {
  const { trackId, lessonId } = useParams();
  const navigate = useNavigate();

  const [track, setTrack] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComplete, setIsSubmittingComplete] = useState(false);
  const [userCompletedLessons, setUserCompletedLessons] = useState(user?.completedLessons || []);

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
          
          {/* Responsive Video Container */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
            <iframe 
              src={embedUrl}
              title={currentLesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

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
        </div>

      </div>

    </div>
  );
}
