import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { skillTracks } from '../data/mockData';

export default function LearnSection({ user, onCompleteLesson, onNavigateToPortfolio }) {
  const [selectedTrackId, setSelectedTrackId] = useState('track-1');
  const [activeLessonId, setActiveLessonId] = useState('m1-l1');

  const currentTrack = skillTracks.find(t => t.id === selectedTrackId) || skillTracks[0];
  const activeLesson = currentTrack.lessons.find(l => l.id === activeLessonId) || currentTrack.lessons[0];

  const userCompletedLessons = user?.completedLessons || [];
  const trackLessonsCount = currentTrack.lessons.length;
  const completedCount = currentTrack.lessons.filter(l => userCompletedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / trackLessonsCount) * 100);

  const isCurrentLessonCompleted = userCompletedLessons.includes(activeLesson.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 border border-purple-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            Skill Learning Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {currentTrack.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
            {currentTrack.description}
          </p>
        </div>

        {/* Track Progress Box */}
        <div className="bg-slate-900/80 border border-purple-500/30 p-4 rounded-2xl w-full md:w-72 space-y-2 text-white">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-200">Track Progress</span>
            <span className="text-purple-400">{progressPercent}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            {completedCount} of {trackLessonsCount} Lessons Completed
          </p>
        </div>
      </div>

      {/* Main Grid: Left Lesson Player & Details, Right Lesson Playlist */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Lesson Player & Notes */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Responsive Embedded Video Frame */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative">
            <iframe
              src={activeLesson.videoUrl}
              title={activeLesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Lesson Header & Mark Complete Action */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-purple-500/30 p-6 shadow-sm space-y-5 text-slate-900 dark:text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  {currentTrack.category} • {activeLesson.duration}
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeLesson.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onCompleteLesson(activeLesson.id)}
                className={`btn-gradient-award text-xs py-2.5 px-5 flex-shrink-0 cursor-pointer ${
                  isCurrentLessonCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/30'
                    : ''
                }`}
              >
                {isCurrentLessonCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-white" />
                    Lesson Completed!
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-white" />
                    Mark Lesson Complete
                  </>
                )}
              </button>
            </div>

            {/* Lesson Summary */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Lesson Overview</h3>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {activeLesson.summary}
              </p>
            </div>

            {/* Key Takeaways Checklist */}
            {activeLesson.keyTakeaways && (
              <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Key Concepts Mastered
                </h4>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-200 font-medium">
                  {activeLesson.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Downloadable Practice Brief */}
            <div className="flex items-center justify-between p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-500/30 text-xs">
              <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-semibold">
                <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Download Lesson Practice Worksheet & Canva Template (.PDF)</span>
              </div>
              <button type="button" className="text-purple-700 dark:text-purple-300 font-bold hover:underline cursor-pointer">Download</button>
            </div>
          </div>

          {/* Unlocked Capstone Portfolio Banner */}
          {progressPercent >= 60 && (
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white border border-purple-500/40 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Capstone Portfolio Ready!
              </div>
              <h3 className="text-xl font-bold text-white">Submit Your Project to Unlock Opportunities</h3>
              <p className="text-xs text-slate-200">
                You've completed enough lessons! Publish your practice graphic or strategy to your public portfolio to receive your Verified Skill Badge.
              </p>
              <button
                type="button"
                onClick={onNavigateToPortfolio}
                className="btn-gradient-award text-xs py-2.5 px-5 cursor-pointer"
              >
                <span>Go to Portfolio & Submit Project</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Track Switcher & Lesson Playlist */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Skill Track Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-purple-500/30 p-5 shadow-sm space-y-3 text-slate-900 dark:text-white">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Select Skill Track</h3>
            <div className="space-y-2">
              {skillTracks.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setActiveLessonId(track.lessons[0].id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    selectedTrackId === track.id
                      ? 'bg-purple-100 dark:bg-purple-900/60 border-purple-500 text-purple-950 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedTrackId === track.id ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold">{track.title}</p>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">{track.duration}</p>
                    </div>
                  </div>
                  {selectedTrackId === track.id && (
                    <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Playlist List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-purple-500/30 p-5 shadow-sm space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Track Lessons</h3>
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{completedCount}/{trackLessonsCount} Done</span>
            </div>

            <div className="space-y-2">
              {currentTrack.lessons.map((lesson, index) => {
                const isCompleted = userCompletedLessons.includes(lesson.id);
                const isActive = activeLessonId === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isActive
                          ? 'bg-white text-purple-600'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>

                      <div>
                        <p className={`text-xs font-bold line-clamp-1 ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {lesson.title}
                        </p>
                        <p className={`text-[10px] ${isActive ? 'text-purple-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          {lesson.duration}
                        </p>
                      </div>
                    </div>

                    {isActive && <Play className="w-4 h-4 text-white flex-shrink-0 fill-white" />}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
