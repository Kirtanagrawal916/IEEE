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
  ArrowRight,
  Zap,
  Target,
  Trophy,
  CheckCircle2,
  Layers,
  Flame,
  Send
} from 'lucide-react';
import { skillTracks } from '../data/mockData';
import { initialChallenges } from '../data/challengesData';
import ChallengeZoneModal from './ChallengeZoneModal';

export default function LearnSection({ user, onCompleteLesson, onNavigateToPortfolio, onUpdateUserSkillPoints }) {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'challenges'
  const [selectedTrackId, setSelectedTrackId] = useState('track-1');
  const [activeLessonId, setActiveLessonId] = useState('m1-l1');
  
  // Challenge Zone states
  const [challenges, setChallenges] = useState(initialChallenges);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [completedChallengeIds, setCompletedChallengeIds] = useState([]);
  const [userPoints, setUserPoints] = useState(user?.skillPoints || 150);

  const currentTrack = skillTracks.find(t => t.id === selectedTrackId) || skillTracks[0];
  const activeLesson = currentTrack.lessons.find(l => l.id === activeLessonId) || currentTrack.lessons[0];

  const userCompletedLessons = user?.completedLessons || [];
  const trackLessonsCount = currentTrack.lessons.length;
  const completedCount = currentTrack.lessons.filter(l => userCompletedLessons.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / trackLessonsCount) * 100);

  const isCurrentLessonCompleted = userCompletedLessons.includes(activeLesson.id);

  const handleChallengeSubmit = (challenge, result) => {
    if (!completedChallengeIds.includes(challenge.id)) {
      setCompletedChallengeIds([...completedChallengeIds, challenge.id]);
      const newTotal = userPoints + result.pointsEarned;
      setUserPoints(newTotal);
      if (onUpdateUserSkillPoints) {
        onUpdateUserSkillPoints(newTotal, result.badgeUnlocked);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* View Switcher Bar: Courses vs Challenge Zone */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-purple-500/30 shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Skill Tracks & Courses</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('challenges')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 relative ${
              activeTab === 'challenges'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>⚡ HerEarn Challenge Zone</span>
            <span className="bg-pink-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">NEW</span>
          </button>
        </div>

        {/* User Skill Points Counter */}
        <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-950/60 px-4 py-2 rounded-xl border border-purple-200 dark:border-purple-800/60 text-xs font-bold text-purple-900 dark:text-purple-200">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Skill Balance: <strong className="text-pink-600 dark:text-pink-400 font-extrabold">{userPoints} PTS</strong></span>
        </div>
      </div>

      {/* ========================================================
          SECTION 1: SKILL TRACKS & COURSES VIEW
         ======================================================== */}
      {activeTab === 'courses' && (
        <div className="space-y-8 animate-fade-in">
          
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
                          <p className="font-bold text-xs truncate max-w-[180px]">{track.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{track.lessons.length} Lessons</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Playlist Lessons List */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-purple-500/30 p-5 shadow-sm space-y-3 text-slate-900 dark:text-white">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Track Lessons ({currentTrack.lessons.length})
                </h3>

                <div className="space-y-2">
                  {currentTrack.lessons.map((lesson, index) => {
                    const isCompleted = userCompletedLessons.includes(lesson.id);
                    const isActive = lesson.id === activeLessonId;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-purple-50 dark:bg-purple-950/80 border-purple-500 text-purple-900 dark:text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          ) : isActive ? (
                            <Play className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 fill-purple-600 dark:fill-purple-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-bold line-clamp-1">{lesson.title}</p>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          SECTION 2: ⚡ HEREARN CHALLENGE ZONE VIEW
         ======================================================== */}
      {activeTab === 'challenges' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Challenge Zone Hero Banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 border border-purple-500/30 text-white shadow-2xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Real-World Mini Challenges
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  HerEarn Challenge Zone ⚡
                </h1>

                <p className="text-sm sm:text-base text-purple-100 font-medium leading-relaxed">
                  Test your skills on real client briefs! Solve 30-minute mini challenges, submit your work, earn <strong className="text-amber-300 font-bold">Skill Points</strong>, and unlock verified profile badges.
                </p>

                {/* Banner Stats */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-purple-200">
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
                    Verified Badges
                  </span>
                </div>
              </div>

              {/* Feature Callout Box */}
              <div className="bg-slate-950/70 border border-purple-400/20 p-5 rounded-3xl text-center backdrop-blur-md w-full md:w-auto space-y-2">
                <span className="text-[11px] text-purple-300 font-bold uppercase block">Next Reward Target</span>
                <span className="text-lg font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                  <Award className="w-5 h-5 text-amber-400" /> +50 PTS / Challenge
                </span>
                <p className="text-[10px] text-purple-200 font-medium">Unlocks exclusive client gig invites</p>
              </div>
            </div>
          </div>

          {/* Active Challenges Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((ch) => {
              const isDone = completedChallengeIds.includes(ch.id);

              return (
                <div
                  key={ch.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-purple-500/30 p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-slate-900 dark:text-white space-y-5 relative group"
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

                    {/* Challenge Title & Client Logo */}
                    <div className="flex items-start gap-3.5">
                      <img
                        src={ch.clientLogo}
                        alt={ch.company}
                        className="w-12 h-12 rounded-2xl object-cover border border-purple-200 dark:border-purple-500/40 shadow-xs group-hover:scale-105 transition-transform"
                      />
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
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/40 text-[11px] font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between">
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
                      onClick={() => setActiveChallenge(ch)}
                      className={`btn-gradient-award text-xs py-2.5 px-5 font-bold cursor-pointer ${
                        isDone ? 'bg-emerald-600 hover:bg-emerald-700 shadow-none' : ''
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          Completed (+{ch.points} PTS)
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          Start Challenge ({ch.timeLimit})
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

      {/* Challenge Interactive Modal */}
      {activeChallenge && (
        <ChallengeZoneModal
          isOpen={!!activeChallenge}
          onClose={() => setActiveChallenge(null)}
          challenge={activeChallenge}
          onSubmitChallenge={handleChallengeSubmit}
        />
      )}

    </div>
  );
}
