import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Award, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  FileText, 
  Link as LinkIcon, 
  Target, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function ChallengeZoneModal({ isOpen, onClose, challenge, onSubmitChallenge }) {
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [sampleImage, setSampleImage] = useState('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  if (!isOpen || !challenge) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const score = Math.floor(Math.random() * 15) + 85; // 85 - 99 score
      const result = {
        score,
        pointsEarned: challenge.points,
        badgeUnlocked: challenge.badgeUnlocked,
        feedback: "Excellent design hierarchy! Your color palette matches the brand brief perfectly."
      };
      setSubmissionResult(result);
      if (onSubmitChallenge) {
        onSubmitChallenge(challenge, result);
      }
    }, 1500);
  };

  const handleCloseAll = () => {
    setSubmissionResult(null);
    setSubmissionTitle('');
    setSubmissionLink('');
    setSubmissionNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative space-y-6">
        
        <button 
          onClick={handleCloseAll}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pr-8">
          <img 
            src={challenge.clientLogo} 
            alt={challenge.company} 
            className="w-14 h-14 rounded-2xl object-cover border border-purple-300 dark:border-purple-500/40 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                {challenge.category}
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> ⏱ {challenge.timeLimit}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 🏆 +{challenge.points} Skill Points
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{challenge.title}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Client: {challenge.company} • Difficulty: <strong className="text-purple-600 dark:text-pink-400">{challenge.difficulty}</strong>
            </p>
          </div>
        </div>

        {/* Submission Success View */}
        {submissionResult ? (
          <div className="space-y-6 text-center animate-fade-in py-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl animate-bounce">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Challenge Completed! 🎉</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {submissionResult.feedback}
              </p>
            </div>

            {/* Score & Rewards Box */}
            <div className="grid grid-cols-3 gap-3 bg-purple-50 dark:bg-purple-950/40 p-4 rounded-2xl border border-purple-200 dark:border-purple-800/60 max-w-md mx-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Evaluated Score</span>
                <p className="text-xl font-black text-purple-700 dark:text-pink-400">{submissionResult.score}/100</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Skill Points</span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">+{submissionResult.pointsEarned}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Badge Unlocked</span>
                <p className="text-xs font-extrabold text-amber-600 dark:text-amber-300 truncate">{submissionResult.badgeUnlocked}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseAll}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
              Continue Learning & Earn Badges
            </button>
          </div>
        ) : (
          /* Main Challenge Brief & Submission Form */
          <div className="space-y-6">
            
            {/* Real World Client Brief Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-600 dark:text-pink-400" />
                Real-World Challenge Brief
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {challenge.description}
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-extrabold text-purple-800 dark:text-purple-300 uppercase">Client Guidelines:</span>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {challenge.brief.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Submission Title / Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Sourdough Bakery Promo Post - Canva Design"
                  value={submissionTitle}
                  onChange={(e) => setSubmissionTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Canva Design / Google Doc Link (Optional)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://canva.com/design/... or Google Drive link"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    className="w-full pl-10 pr-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Notes / Caption Draft
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your design choices or write the Instagram caption draft here..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400"
                ></textarea>
              </div>

              {/* Sample Work Preview Banner */}
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/40 text-purple-900 dark:text-purple-300 flex items-center justify-between text-[11px] font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Submitting earns +{challenge.points} Skill Points & unlocks "{challenge.badgeUnlocked}" Badge
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Evaluating Challenge Submission...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Challenge for Evaluation (+{challenge.points} PTS)
                  </>
                )}
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
