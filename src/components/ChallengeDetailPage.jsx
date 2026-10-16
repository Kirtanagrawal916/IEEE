import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  Zap, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Send, 
  Check, 
  HelpCircle,
  FileText,
  Target,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { initialChallenges } from '../data/challengesData';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

export default function ChallengeDetailPage({ user, onCompleteChallenge, onUpdateUserSkillPoints, showToast }) {
  const { challengeId } = useParams();
  const navigate = useNavigate();

  const challenge = initialChallenges.find(c => c.id === challengeId) || initialChallenges[0];

  const [submissionTitle, setSubmissionTitle] = useState(
    challenge.id === 'ch-1' ? 'Fresh Sourdough Saturday Promo Post - Canva Design' : ''
  );
  const [submissionLink, setSubmissionLink] = useState('https://canva.com/design/DAF8.../view');
  const [submissionNotes, setSubmissionNotes] = useState(
    'Used warm amber (#D97706) and soft cream (#FEF3C7) to highlight the artisan feel, with clear WhatsApp CTA and prominent 20% discount offer banner.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionTitle) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const score = Math.floor(Math.random() * 10) + 90; // 90-99%
      const result = {
        score,
        pointsEarned: challenge.points,
        badgeUnlocked: challenge.badgeUnlocked,
        feedback: "Outstanding work! The color hierarchy and call-to-action match the client brief accurately.",
        submittedAt: new Date().toLocaleTimeString()
      };
      setEvaluationResult(result);
      triggerCelebrationConfetti();

      if (onUpdateUserSkillPoints) {
        onUpdateUserSkillPoints(challenge.points, challenge.badgeUnlocked);
      }
      if (showToast) {
        showToast("🎉 Challenge Completed!", `+${challenge.points} Skill Points earned & unlocked "${challenge.badgeUnlocked}" badge!`);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] dark:bg-[#0F0918] text-[#1F2937] dark:text-white transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Breadcrumb Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses & Challenges</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
              {challenge.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Hero Title Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={challenge.clientLogo} 
                  alt={challenge.company} 
                  className="w-14 h-14 rounded-2xl object-cover border border-purple-300 dark:border-purple-500/40 shadow-sm"
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {challenge.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-4 h-4" />
                    <span>Client: {challenge.company}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {challenge.description}
              </p>
            </div>

            <div className="flex md:flex-col gap-3 w-full md:w-auto shrink-0">
              <div className="flex-1 md:w-44 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 rounded-2xl p-3 text-center">
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold uppercase">Skill Points</p>
                <p className="text-xl font-black text-purple-700 dark:text-purple-300 flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>+{challenge.points} PTS</span>
                </p>
              </div>

              <div className="flex-1 md:w-44 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase">Estimated Time</p>
                <p className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{challenge.timeLimit}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Workroom Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Challenge Brief & Client Guidelines (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Real World Brief */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs uppercase tracking-wider border-b border-purple-100 dark:border-purple-500/20 pb-3">
                <Target className="w-4 h-4" />
                <span>Client Guidelines & Requirements</span>
              </div>

              <ul className="space-y-3 text-xs">
                {challenge.brief.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Badge Unlock Preview */}
            <div className="bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-pink-900/30 rounded-3xl border border-purple-500/30 p-6 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-extrabold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Unlockable Milestone Badge</span>
              </div>

              <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/70 p-3.5 rounded-2xl border border-purple-300 dark:border-purple-500/30">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {challenge.badgeUnlocked}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Verified proof added to your portfolio upon submission.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Tools */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 shadow-md space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Recommended Free Tools</span>
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                <a 
                  href="https://www.canva.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 transition-colors flex items-center gap-1"
                >
                  Canva Free Editor <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href="https://unsplash.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-100 transition-colors flex items-center gap-1"
                >
                  Unsplash Stock Photos <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Submission Workspace Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-500/20 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Submit Challenge Deliverable
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Provide your deliverable link and notes for automatic skill scoring.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  Ready to Submit
                </span>
              </div>

              {evaluationResult ? (
                /* Evaluated Success View */
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                        Challenge Passed with {evaluationResult.score}% Score!
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 max-w-md mx-auto">
                        {evaluationResult.feedback}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 font-bold text-xs text-purple-700 dark:text-purple-300 border border-emerald-300 dark:border-emerald-500/30 shadow-xs">
                        +{evaluationResult.pointsEarned} Skill Points Earned
                      </span>
                      <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 font-bold text-xs text-pink-700 dark:text-pink-300 border border-emerald-300 dark:border-emerald-500/30 shadow-xs">
                        Badge: {evaluationResult.badgeUnlocked}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/portfolio"
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs text-center shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>View in Portfolio Showcase</span>
                    </Link>
                    <Link
                      to="/courses"
                      className="flex-1 py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs text-center hover:bg-purple-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Explore More Challenges</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Submission Form */
                <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Submission Title / Project Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fresh Sourdough Bakery Promo Post - Canva Design"
                      value={submissionTitle}
                      onChange={(e) => setSubmissionTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Canva Design / Google Doc / Live Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        required
                        placeholder="https://canva.com/design/... or Google Drive link"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Paste a shareable link to your design, document, or deliverable asset.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1.5">
                      Notes / Caption Draft / Design Rationale
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe your design choices or write the Instagram caption draft here..."
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold leading-relaxed"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <p className="text-[11px] text-purple-800 dark:text-purple-300 font-semibold leading-relaxed">
                      Submitting earns +{challenge.points} Skill Points and unlocks the verified "{challenge.badgeUnlocked}" credential on your public profile.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-extrabold text-xs shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating Deliverable...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Deliverable (+{challenge.points} PTS)</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
