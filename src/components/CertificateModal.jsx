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
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Check, 
  BrainCircuit, 
  RotateCcw, 
  ChevronRight,
  Target
} from 'lucide-react';
import { skillTracks } from '../data/mockData';
import { isCourseCompleted, getCompletedTracksForUser } from '../utils/trackLockHelper';
import { getQuizForCategory } from '../data/opportunityQuizzes';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  user,
  initialCourseTitle = "Digital Marketing & Social Media Growth",
  trackTitle,
  onUpdateUserName
}) {
  const [selectedCourse, setSelectedCourse] = useState(trackTitle || initialCourseTitle);
  const [isCopied, setIsCopied] = useState(false);

  // Helper to extract the best initial name for the user
  const getInitialName = () => {
    if (user?.name && typeof user.name === 'string' && user.name.trim()) return user.name.trim();
    if (user?.fullName && typeof user.fullName === 'string' && user.fullName.trim()) return user.fullName.trim();
    if (user?.full_name && typeof user.full_name === 'string' && user.full_name.trim()) return user.full_name.trim();
    if (user?.displayName && typeof user.displayName === 'string' && user.displayName.trim()) return user.displayName.trim();
    if (user?.user_metadata?.full_name && typeof user.user_metadata.full_name === 'string' && user.user_metadata.full_name.trim()) {
      return user.user_metadata.full_name.trim();
    }
    if (user?.user_metadata?.name && typeof user.user_metadata.name === 'string' && user.user_metadata.name.trim()) {
      return user.user_metadata.name.trim();
    }

    try {
      const local = JSON.parse(localStorage.getItem('herearn_user') || 'null');
      if (local?.name && typeof local.name === 'string' && local.name.trim()) return local.name.trim();
      if (local?.fullName && typeof local.fullName === 'string' && local.fullName.trim()) return local.fullName.trim();
      if (local?.full_name && typeof local.full_name === 'string' && local.full_name.trim()) return local.full_name.trim();
      if (local?.username && typeof local.username === 'string' && local.username !== 'guest' && local.username !== 'guest_learner') {
        const u = local.username.replace(/^@/, '');
        return u.charAt(0).toUpperCase() + u.slice(1);
      }
      if (local?.email && typeof local.email === 'string' && local.email.includes('@')) {
        const prefix = local.email.split('@')[0].replace(/[._-]/g, ' ');
        return prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    } catch {}

    if (user?.username && typeof user.username === 'string' && user.username !== 'guest' && user.username !== 'guest_learner') {
      const u = user.username.replace(/^@/, '');
      return u.charAt(0).toUpperCase() + u.slice(1);
    }
    if (user?.email && typeof user.email === 'string' && user.email.includes('@')) {
      const prefix = user.email.split('@')[0].replace(/[._-]/g, ' ');
      return prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    return 'Ananya Sharma';
  };

  const [recipientName, setRecipientName] = useState(() => getInitialName());
  const [isEditingName, setIsEditingName] = useState(false);

  // Sync recipient name if user changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const detected = getInitialName();
      if (detected && detected !== 'Ananya Sharma') {
        setRecipientName(detected);
      } else if (!recipientName) {
        setRecipientName(detected);
      }
    }
  }, [isOpen, user]);

  // Handle keyboard Escape to go back/close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle recipient name change
  const handleNameChange = (newName) => {
    setRecipientName(newName);
    try {
      const current = JSON.parse(localStorage.getItem('herearn_user') || '{}');
      const updated = { ...current, name: newName };
      localStorage.setItem('herearn_user', JSON.stringify(updated));
    } catch {}
    if (onUpdateUserName) {
      onUpdateUserName(newName);
    }
  };

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
      const local = JSON.parse(localStorage.getItem('herearn_user') || '{}');
      if (Array.isArray(local?.completedLessons)) {
        ids = Array.from(new Set([...ids, ...local.completedLessons]));
      }
    } catch {}
    try {
      const localData = JSON.parse(localStorage.getItem('herearn_user_data') || '{}');
      if (Array.isArray(localData?.completedLessons)) {
        ids = Array.from(new Set([...ids, ...localData.completedLessons]));
      }
    } catch {}
    return ids;
  }, [user]);

  // Effective user object for completed tracks check
  const effectiveUser = useMemo(() => {
    let base = user && typeof user === 'object' ? { ...user } : {};
    try {
      const stored = JSON.parse(localStorage.getItem('herearn_user') || '{}');
      base = { ...stored, ...base };
    } catch {}
    base.completedLessons = userCompletedLessonIds;
    base.name = recipientName || base.name;
    return base;
  }, [user, userCompletedLessonIds, recipientName]);

  // Determine completed tracks for this user
  const completedTracks = useMemo(() => {
    return getCompletedTracksForUser(effectiveUser, skillTracks);
  }, [effectiveUser]);

  // Set default selected course
  useEffect(() => {
    if (trackTitle) {
      setSelectedCourse(trackTitle);
    } else if (completedTracks.length > 0) {
      setSelectedCourse(completedTracks[0].title);
    } else if (initialCourseTitle) {
      setSelectedCourse(initialCourseTitle);
    }
  }, [trackTitle, initialCourseTitle, completedTracks]);

  // Resolve currently active selected track
  const selectedTrack = useMemo(() => {
    return skillTracks.find(
      t => t.title === selectedCourse || 
           t.id === selectedCourse || 
           (t.title && selectedCourse && t.title.toLowerCase().includes(selectedCourse.toLowerCase()))
    ) || skillTracks[0];
  }, [selectedCourse]);

  // Course completion status
  const isCompleted = isCourseCompleted(selectedTrack, effectiveUser);
  const totalLessons = selectedTrack?.lessons?.length || 1;
  const doneLessons = (selectedTrack?.lessons || []).filter(l => userCompletedLessonIds.includes(l.id)).length;
  const progressPercent = Math.min(100, Math.round((doneLessons / totalLessons) * 100));

  // Certified Courses state (stores tracks that passed the course assessment with >= 70%)
  const [certifiedRecords, setCertifiedRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('herearn_certified_courses') || '{}');
    } catch {
      return {};
    }
  });

  // Track if current selected course has passed the assessment
  const currentCertRecord = certifiedRecords[selectedTrack.id] || certifiedRecords[selectedTrack.title];
  const isQuizPassed = Boolean(currentCertRecord && currentCertRecord.passed && currentCertRecord.score >= 70);

  // In-modal Course Assessment Quiz state
  const quizQuestions = useMemo(() => {
    return getQuizForCategory(selectedTrack?.category);
  }, [selectedTrack]);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [lastAttemptFailed, setLastAttemptFailed] = useState(false);

  // Reset quiz state if selectedTrack changes
  useEffect(() => {
    setCurrentQIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setQuizScore(null);
    setLastAttemptFailed(false);
  }, [selectedTrack]);

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    setUserAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQIndex]?.id]: idx
    }));
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < quizQuestions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setSelectedOption(userAnswers[quizQuestions[nextIdx]?.id] ?? null);
    } else {
      evaluateCourseQuiz();
    }
  };

  // Evaluate Course Quiz with 70% passing cutoff
  const evaluateCourseQuiz = () => {
    let earnedPoints = 0;
    let maxPoints = 0;

    quizQuestions.forEach(q => {
      const points = q.points || 10;
      maxPoints += points;
      if (userAnswers[q.id] === q.correctAnswer) {
        earnedPoints += points;
      }
    });

    const calculatedPercentage = Math.round((earnedPoints / maxPoints) * 100);
    setQuizScore(calculatedPercentage);

    const PASSING_SCORE = 70;
    const passed = calculatedPercentage >= PASSING_SCORE;

    if (passed) {
      const updated = {
        ...certifiedRecords,
        [selectedTrack.id]: {
          passed: true,
          score: calculatedPercentage,
          earnedPoints,
          maxPoints,
          certifiedAt: new Date().toISOString()
        },
        [selectedTrack.title]: {
          passed: true,
          score: calculatedPercentage,
          earnedPoints,
          maxPoints,
          certifiedAt: new Date().toISOString()
        }
      };
      setCertifiedRecords(updated);
      try {
        localStorage.setItem('herearn_certified_courses', JSON.stringify(updated));
      } catch {}

      setLastAttemptFailed(false);
      triggerCelebrationConfetti();
    } else {
      setLastAttemptFailed(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setQuizScore(null);
    setLastAttemptFailed(false);
  };

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const safeUsername = (effectiveUser?.username || recipientName || 'learner')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 5) || 'learn';

  const certId = `HE-${safeUsername.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleDownload = () => {
    if (!isCompleted || !isQuizPassed) return;
    window.print();
  };

  const handleShare = () => {
    if (!isCompleted || !isQuizPassed) return;
    const url = window.location.origin + `/profile?cert=${encodeURIComponent(selectedTrack.title)}&name=${encodeURIComponent(recipientName)}`;
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const currentQ = quizQuestions[currentQIndex];

  return (
    <>
      {/* Print Styles for Certificate */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #certificate-printable-card, #certificate-printable-card * {
            visibility: visible !important;
          }
          #certificate-printable-card {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2.5rem !important;
            box-sizing: border-box !important;
            background: linear-gradient(135deg, #2e0854 0%, #0f0918 50%, #1e1035 100%) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            z-index: 999999 !important;
          }
          .certificate-no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 text-slate-900 dark:text-white shadow-2xl relative space-y-4 sm:space-y-5 my-6 sm:my-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer border border-purple-200 dark:border-purple-800 shadow-xs"
                title="Go Back (Esc)"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>

              <div className="hidden sm:block">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Course Completion Certification
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Assessment & Verified Official Credential
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isQuizPassed ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wide border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Passed ({currentCertRecord?.score || 85}%) ✓</span>
                </span>
              ) : isCompleted ? (
                <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase tracking-wide border border-purple-300 dark:border-purple-800 flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3 text-pink-500" />
                  <span>Quiz Required (70%)</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wide border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Lessons ({progressPercent}%)</span>
                </span>
              )}

              <button 
                type="button"
                onClick={onClose}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course Track Selector */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
              Selected Course Track:
            </label>
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-bold cursor-pointer"
            >
              {skillTracks.map(t => {
                const completed = isCourseCompleted(t, effectiveUser);
                const rec = certifiedRecords[t.id] || certifiedRecords[t.title];
                const passed = Boolean(rec && rec.passed && rec.score >= 70);

                return (
                  <option key={t.id} value={t.title}>
                    {t.title} — {passed ? `🏆 Certified (${rec.score}%)` : completed ? '📝 Assessment Ready (Passing 70% required)' : `🔒 Incomplete Lessons`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* ========================================================
              CASE 1: LESSONS NOT COMPLETED (MUST FINISH LESSONS FIRST)
             ======================================================== */}
          {!isCompleted && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs space-y-3">
              <div className="flex items-center justify-between font-extrabold">
                <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Course Lessons Incomplete</span>
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-black">{progressPercent}% Completed</span>
              </div>

              <div className="w-full h-2 bg-amber-200/60 dark:bg-amber-900/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                You have completed <strong>{doneLessons} of {totalLessons}</strong> lessons. Complete all modules in <strong>"{selectedTrack.title}"</strong> to unlock the final certification assessment quiz.
              </p>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Continue Course Lessons</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              CASE 2: LESSONS COMPLETE, BUT QUIZ NOT YET PASSED (REQUIREMENT 5)
              Must take Course Assessment Quiz with Passing Score >= 70%
              Certificate is NOT displayed until score >= 70%!
             ======================================================== */}
          {isCompleted && !isQuizPassed && (
            <div className="space-y-4">
              
              {/* Assessment Intro Header Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border border-purple-500/30 space-y-1 text-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-300 flex items-center justify-center gap-1">
                  <BrainCircuit className="w-3.5 h-3.5" /> Course Completion Knowledge Assessment
                </span>
                <h4 className="text-base font-extrabold text-white">
                  Pass with 70% or Higher to Unlock Certificate
                </h4>
                <p className="text-[11px] text-purple-200">
                  Passing Score Required: <strong>70%</strong>. If you score 70% or more, your verified certificate will be generated and displayed.
                </p>
              </div>

              {/* FAILED ATTEMPT FEEDBACK SCREEN */}
              {lastAttemptFailed && quizScore !== null && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-center space-y-2 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center mx-auto font-black text-sm">
                    {quizScore}%
                  </div>
                  <h5 className="font-extrabold text-xs text-rose-800 dark:text-rose-200">
                    Assessment Not Passed — Certificate Locked
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    You scored <strong>{quizScore}%</strong>. A minimum score of <strong>70%</strong> is required to earn the official verified certificate.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleRetryQuiz}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Assessment Quiz</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                    >
                      Review Lessons
                    </button>
                  </div>
                </div>
              )}

              {/* ACTIVE QUIZ QUESTION CARD */}
              {!lastAttemptFailed && currentQ && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-purple-200 dark:border-purple-800/40 space-y-4">
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> Question {currentQIndex + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                      {currentQ.difficulty || 'Practical'} • {currentQ.points || 10} pts
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {currentQ.question.split('/')[0]}
                    </p>
                    {currentQ.question.includes('/') && (
                      <p className="text-[11px] font-medium text-purple-600 dark:text-purple-300">
                        🇮🇳 {currentQ.question.split('/')[1]}
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      const enText = option.split('/')[0];
                      const hiText = option.split('/')[1];

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-start gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-400'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                            isSelected ? 'bg-white text-purple-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <div className="flex-1">
                            <span>{enText}</span>
                            {hiText && (
                              <span className={`block text-[10px] mt-0.5 font-normal ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                                {hiText}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiz Navigation Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      disabled={currentQIndex === 0}
                      onClick={() => {
                        const prevIdx = currentQIndex - 1;
                        setCurrentQIndex(prevIdx);
                        setSelectedOption(userAnswers[quizQuestions[prevIdx]?.id] ?? null);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={selectedOption === null}
                      onClick={handleNextQuizQuestion}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-extrabold shadow-md hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{currentQIndex < quizQuestions.length - 1 ? 'Next Question' : 'Submit Assessment'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ========================================================
              CASE 3: COURSE COMPLETE AND ASSESSMENT PASSED (>= 70%)
              Certificate IS DISPLAYED!
             ======================================================== */}
          {isCompleted && isQuizPassed && (
            <div className="space-y-4">
              
              {/* Passed Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Assessment Passed with {currentCertRecord?.score}% (Passing score: 70%)
                </span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                  Verified
                </span>
              </div>

              {/* Recipient Name Customization */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Learner Full Name on Certificate:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(!isEditingName)}
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingName ? 'Done' : 'Change Name'}</span>
                  </button>
                </div>

                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Enter full name for certificate"
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-purple-400 dark:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-bold"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                      {recipientName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Appears on official credential
                    </span>
                  </div>
                )}
              </div>

              {/* Certificate Display Card */}
              <div 
                id="certificate-printable-card"
                className="relative overflow-hidden rounded-2xl border-4 border-double border-amber-400/80 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-center text-white space-y-4 shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold shadow-sm mx-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Credential • Passed Assessment ({currentCertRecord?.score}%)</span>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
                    <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                </div>

                {/* Certificate Header & Recipient Name */}
                <div className="space-y-1.5">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-amber-400 block">
                    HerEarn Foundation • Certificate of Excellence
                  </span>
                  <p className="text-xs text-purple-200 font-medium">
                    This is proudly presented to
                  </p>
                  
                  <div className="py-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide border-b-2 border-amber-400/60 pb-1.5 inline-block px-4 max-w-full break-words">
                      {recipientName}
                    </h2>
                  </div>
                </div>

                {/* Course Information */}
                <div className="py-2 border-y border-purple-500/30 space-y-1">
                  <p className="text-xs text-purple-200">
                    for successfully mastering and completing the capstone curriculum for
                  </p>
                  <p className="text-sm sm:text-base font-black text-pink-300">
                    {selectedTrack.title}
                  </p>
                </div>

                {/* Credential ID, Score, Date */}
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

                <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-extrabold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Cryptographically Verified & Industry Recognized</span>
                </div>
              </div>

              {/* Action Buttons: Download PDF & Share */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer order-last sm:order-first"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </button>

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
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
