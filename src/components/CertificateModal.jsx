import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Award, 
  Trophy, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Lock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { skillTracks } from '../data/mockData';
import { isCourseCompleted, getCompletedTracksForUser } from '../utils/trackLockHelper';

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  user,
  initialCourseTitle = "Digital Marketing & Social Media Growth",
  trackTitle
}) {
  const [selectedCourse, setSelectedCourse] = useState(trackTitle || initialCourseTitle);
  const [isCopied, setIsCopied] = useState(false);

  // Completed lesson IDs set for current user
  const userCompletedLessonIds = useMemo(() => {
    let ids = [];
    if (user?.completedLessons) {
      if (Array.isArray(user.completedLessons)) {
        ids = user.completedLessons;
      } else if (typeof user.completedLessons === 'string') {
        try {
          ids = JSON.parse(user.completedLessons);
        } catch {
          ids = [];
        }
      }
    }
    try {
      const localUser = JSON.parse(localStorage.getItem('herearn_user_data') || '{}');
      if (Array.isArray(localUser?.completedLessons)) {
        ids = Array.from(new Set([...ids, ...localUser.completedLessons]));
      }
    } catch {}
    return ids;
  }, [user]);

  // Determine completed tracks for this user
  const completedTracks = useMemo(() => {
    return getCompletedTracksForUser(user, skillTracks);
  }, [user, userCompletedLessonIds]);

  // Set default selected course
  useEffect(() => {
    if (trackTitle) {
      setSelectedCourse(trackTitle);
    } else if (completedTracks.length > 0) {
      // Prioritize completed course if available
      setSelectedCourse(completedTracks[0].title);
    } else if (initialCourseTitle) {
      setSelectedCourse(initialCourseTitle);
    }
  }, [trackTitle, initialCourseTitle, completedTracks]);

  if (!isOpen) return null;

  // Exact recipient name from user object - preserving user's exact name
  const userName = (user?.name || '').trim() || 'Verified Learner';

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Resolve currently active selected track
  const selectedTrack = skillTracks.find(
    t => t.title === selectedCourse || 
         t.id === selectedCourse || 
         (t.title && selectedCourse && t.title.toLowerCase().includes(selectedCourse.toLowerCase()))
  ) || skillTracks[0];

  // Verify course completion status
  const isCompleted = isCourseCompleted(selectedTrack, user);
  const totalLessons = selectedTrack?.lessons?.length || 1;
  const doneLessons = (selectedTrack?.lessons || []).filter(l => userCompletedLessonIds.includes(l.id)).length;
  const progressPercent = Math.min(100, Math.round((doneLessons / totalLessons) * 100));

  const certId = `HE-${(user?.username || 'learner').toUpperCase().slice(0, 5)}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleDownload = () => {
    if (!isCompleted) {
      alert(`Certificate locked! Please complete all ${totalLessons} lessons of "${selectedTrack.title}" before generating your certificate.`);
      return;
    }
    // Printable / downloadable credential
    window.print ? window.print() : alert(`Certificate for "${selectedTrack.title}" downloaded!`);
  };

  const handleShare = () => {
    if (!isCompleted) return;
    const url = window.location.origin + `/profile?cert=${encodeURIComponent(selectedTrack.title)}`;
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl max-w-xl w-full p-6 text-slate-900 dark:text-white shadow-2xl relative space-y-5 my-8">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-purple-200 dark:border-purple-500/20 pb-4">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
            isCompleted 
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700'
          }`}>
            {isCompleted ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Official Course Certificate
              </h3>
              {isCompleted ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                  Verified Unlocked
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase">
                  Incomplete ({progressPercent}%)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Verified digital credential backed by HerEarn platform
            </p>
          </div>
        </div>

        {/* Incomplete Course Notice Banner */}
        {!isCompleted && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-extrabold">
              <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Certificate Locked — Course Incomplete</span>
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-black">{progressPercent}% Done</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-amber-200/60 dark:bg-amber-900/60 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              You have completed <strong>{doneLessons} of {totalLessons}</strong> lessons. Certificates are only generated once you complete <strong>100%</strong> of the modules in this track.
            </p>
          </div>
        )}

        {/* Certificate Display Card */}
        <div className="relative overflow-hidden rounded-2xl border-4 border-double border-amber-400/80 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-center text-white space-y-4 shadow-2xl">
          
          {/* Subtle background ornamentation */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Locked Watermark Overlay when Course is NOT Completed */}
          {!isCompleted && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Course Not Completed</h4>
                <p className="text-xs text-slate-300 max-w-sm">
                  Finish all {totalLessons} lessons of <strong className="text-amber-300">"{selectedTrack.title}"</strong> to generate and download your official certificate with your name.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase">
                {doneLessons}/{totalLessons} Lessons Finished
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              HerEarn Foundation • Certificate of Excellence
            </span>
            <p className="text-xs text-purple-200 font-medium">This is proudly presented to</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {userName}
            </h2>
          </div>

          <div className="py-2 border-y border-purple-500/30 space-y-1">
            <p className="text-xs text-purple-200">
              for successfully mastering and completing the capstone curriculum for
            </p>
            <p className="text-base sm:text-lg font-black text-pink-300">
              {selectedTrack.title}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300 gap-2 pt-2 border-t border-purple-500/20">
            <div className="text-left space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Credential ID:</span>
              <span className="font-mono font-bold text-amber-300">{certId}</span>
            </div>
            <div className="text-center sm:text-right space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Issue:</span>
              <span className="font-semibold text-slate-200">{issueDate}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographically Verified & Industry Recognized</span>
          </div>
        </div>

        {/* Course Track Selector */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
            Select Course Track:
          </label>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-bold cursor-pointer"
          >
            {skillTracks.map(t => {
              const completed = isCourseCompleted(t, user);
              const done = (t.lessons || []).filter(l => userCompletedLessonIds.includes(l.id)).length;
              const total = t.lessons?.length || 0;
              return (
                <option key={t.id} value={t.title}>
                  {t.title} — {completed ? '✓ (100% Completed - Certificate Ready)' : `🔒 (${done}/${total} Lessons - Incomplete)`}
                </option>
              );
            })}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {isCompleted ? (
            <>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{isCopied ? "Link Copied! ✓" : "Share Proof"}</span>
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                disabled
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-extrabold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                title="Complete all course lessons to unlock"
              >
                <Lock className="w-4 h-4" />
                <span>Certificate Locked ({progressPercent}% Completed)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue Lessons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
