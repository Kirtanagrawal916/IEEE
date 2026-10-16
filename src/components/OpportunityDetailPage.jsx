import React from 'react';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  CheckCircle2, 
  IndianRupee, 
  Clock, 
  Target, 
  ShieldCheck, 
  Layers, 
  Send, 
  X, 
  Sparkles, 
  Award,
  Share2,
  FileText
} from 'lucide-react';
import { calculateSkillMatch, DEFAULT_USER_SKILLS } from '../utils/skillMatcher';

export default function OpportunityDetailPage({ 
  gig, 
  user, 
  onBack, 
  onApply, 
  onToggleSkill 
}) {
  if (!gig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 text-slate-900 dark:text-white">
        <h2 className="text-xl font-bold">No Opportunity Selected</h2>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Back to Opportunities List
        </button>
      </div>
    );
  }

  const userSkills = (user && user.skills && user.skills.length > 0) 
    ? user.skills 
    : DEFAULT_USER_SKILLS;

  const matchRes = calculateSkillMatch(userSkills, gig.skillsRequired);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 text-xs font-extrabold text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities Board
        </button>

        <div className="flex items-center gap-2">
          <span className="bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
            {gig.category || 'Micro-Gig'}
          </span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold px-3 py-1 rounded-full">
            {gig.type || 'Remote'}
          </span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 border border-purple-500/30 text-white shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <img 
              src={gig.logo} 
              alt={gig.company} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-300 dark:border-purple-500/40 shadow-lg bg-white shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{gig.title}</h1>
              </div>
              <p className="text-sm text-purple-200 font-semibold flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-400" />
                {gig.company}
                {gig.verifiedClient && (
                  <span className="text-emerald-400 font-extrabold text-xs flex items-center gap-1 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Client Partner
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* 🎯 Skill Match Badge */}
          <div className={`px-4 py-2.5 rounded-2xl text-sm font-extrabold flex items-center gap-2 shadow-lg border shrink-0 ${
            matchRes.matchPercentage >= 80
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300'
              : matchRes.matchPercentage >= 50
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-300'
              : 'bg-slate-900 text-amber-300 border-slate-700'
          }`}>
            <Target className="w-5 h-5" />
            <span>🎯 {matchRes.matchPercentage}% Skill Match</span>
          </div>
        </div>

        {/* Key Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-purple-500/20 relative z-10 text-xs">
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-purple-300 font-bold uppercase block text-[10px]">Stipend Amount</span>
            <span className="text-base font-extrabold text-emerald-400 flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {gig.stipend}
            </span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-purple-300 font-bold uppercase block text-[10px]">Location / Format</span>
            <span className="text-sm font-bold text-white flex items-center gap-1">
              <MapPin className="w-4 h-4 text-purple-300" />
              {gig.location || 'Remote Work'}
            </span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-purple-300 font-bold uppercase block text-[10px]">Duration</span>
            <span className="text-sm font-bold text-white flex items-center gap-1">
              <Clock className="w-4 h-4 text-pink-300" />
              {gig.duration || 'Flexible'}
            </span>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10 space-y-1">
            <span className="text-purple-300 font-bold uppercase block text-[10px]">Applied Candidates</span>
            <span className="text-sm font-bold text-pink-300">
              {gig.applicantsCount || 0} Learners
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Description, Deliverables, Escrow */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Role Overview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Detailed Opportunity Scope
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
              {gig.description}
            </p>
          </div>

          {/* Key Deliverables Section */}
          {gig.deliverables && gig.deliverables.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-4">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Required Client Deliverables
              </h3>
              <div className="space-y-3">
                {gig.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-purple-50/60 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/50">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Escrow Guarantee Card */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl p-6 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 text-base font-extrabold">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              100% Guaranteed Escrow Payout Protection
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed font-medium">
              HerEarn holds client funds securely in escrow prior to project commencement. Once deliverables are reviewed and completed, stipend funds are released directly to your account.
            </p>
          </div>

        </div>

        {/* Right Column: Skill Matcher Breakdown & Dedicated Apply Action */}
        <div className="space-y-6">
          
          {/* Skill Matcher breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-pink-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Skill Requirements</h4>
              </div>
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-2.5 py-1 rounded-full border border-pink-200 dark:border-pink-800">
                {matchRes.matchedSkills.length}/{matchRes.totalRequired} Matched
              </span>
            </div>

            {/* Matched Skills */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                ✓ Your Matched Skills ({matchRes.matchedSkills.length})
              </span>
              {matchRes.matchedSkills.length > 0 ? (
                <div className="space-y-1.5">
                  {matchRes.matchedSkills.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No skills matched in your profile yet</p>
              )}
            </div>

            {/* Missing Skills */}
            {matchRes.missingSkills.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  ! Skills Needed for 100% Match ({matchRes.missingSkills.length})
                </span>
                <div className="space-y-2">
                  {matchRes.missingSkills.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="flex items-center gap-1.5">
                        <X className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{s}</span>
                      </span>
                      {onToggleSkill && (
                        <button
                          onClick={() => onToggleSkill(s)}
                          className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-2 py-1 rounded-md"
                        >
                          + Add Skill
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply & Start Assessment CTA Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <button
                type="button"
                onClick={() => onApply(gig)}
                disabled={gig.applied}
                className={`w-full py-4 rounded-2xl btn-gradient-award text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  gig.applied ? 'opacity-75 cursor-not-allowed shadow-none' : ''
                }`}
              >
                {gig.applied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    Already Applied
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Apply & Take Skill Assessment Quiz
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 font-medium">
                ⚡ Requires passing a 6-question quiz (Easy, Medium, Hard) to confirm eligibility.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
