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
  FileText,
  AlertCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import TrustScamBanner from './ui/TrustScamBanner';
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 text-[#1F2937] dark:text-white">
        <h2 className="text-xl font-bold font-heading">No Opportunity Selected</h2>
        <button
          onClick={onBack}
          className="tap-target px-6 py-2.5 rounded-xl bg-[#7C3AED] text-white font-bold text-xs cursor-pointer"
        >
          Back to Opportunities Board
        </button>
      </div>
    );
  }

  const userSkills = (user && user.skills && user.skills.length > 0) 
    ? user.skills 
    : DEFAULT_USER_SKILLS;

  const matchRes = calculateSkillMatch(userSkills, gig.skillsRequired);

  return (
    <div className="site-container py-8 sm:py-12 space-y-8 animate-fade-in text-[#1F2937] dark:text-white pb-24 md:pb-12">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={onBack}
          className="tap-target inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#191026] border border-[#E5E7EB] dark:border-purple-800/40 text-xs font-bold text-[#7C3AED] dark:text-purple-300 hover:bg-[#F3E8FF] transition-all cursor-pointer shadow-xs"
          aria-label="Back to opportunities list"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities List</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge-free text-xs py-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Free Application
          </span>
          <span className="badge-plum text-xs py-1">
            {gig.category || 'Job Opportunity'}
          </span>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <TrustScamBanner variant="compact" />

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-[#191026] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-purple-900/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img 
              src={gig.logo || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=150'} 
              alt={gig.company} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#E5E7EB] dark:border-purple-800/40 bg-white shrink-0 shadow-xs"
            />
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#1F2937] dark:text-white leading-tight">
                {gig.title}
              </h1>
              <div className="flex items-center gap-2 flex-wrap text-sm text-[#4B5563] dark:text-slate-300 font-semibold">
                <Building className="w-4 h-4 text-[#7C3AED]" />
                <span>{gig.company}</span>
                {gig.verifiedClient && (
                  <span className="text-[#16A34A] text-xs font-bold flex items-center gap-1 bg-[#DCFCE7] dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Employer
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Skill Match Badge */}
          {matchRes.matchPercentage > 0 && (
            <div className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-[#F3E8FF] dark:bg-purple-950/60 text-[#6D28D9] dark:text-purple-300 border border-[#E9D5FF] shrink-0">
              <Target className="w-4 h-4 text-[#7C3AED]" />
              <span>{matchRes.matchPercentage}% Skill Match</span>
            </div>
          )}
        </div>

        {/* Key Info Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E5E7EB] dark:border-purple-900/30 text-xs">
          <div className="bg-[#FFF9F5] dark:bg-[#201533] p-3 rounded-xl border border-[#FED7AA]/50 space-y-1">
            <span className="text-[#6B7280] dark:text-slate-400 font-bold uppercase text-[10px] block">Stipend / Salary</span>
            <span className="text-sm sm:text-base font-extrabold text-[#16A34A] font-heading flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4" />
              {gig.stipend || 'Competitive Pay'}
            </span>
          </div>

          <div className="bg-[#FFF9F5] dark:bg-[#201533] p-3 rounded-xl border border-[#FED7AA]/50 space-y-1">
            <span className="text-[#6B7280] dark:text-slate-400 font-bold uppercase text-[10px] block">Location</span>
            <span className="text-xs sm:text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#F97316]" />
              {gig.location || 'Remote Work'}
            </span>
          </div>

          <div className="bg-[#FFF9F5] dark:bg-[#201533] p-3 rounded-xl border border-[#FED7AA]/50 space-y-1">
            <span className="text-[#6B7280] dark:text-slate-400 font-bold uppercase text-[10px] block">Duration / Type</span>
            <span className="text-xs sm:text-sm font-bold text-[#1F2937] dark:text-white flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              {gig.duration || gig.type || 'Flexible'}
            </span>
          </div>

          <div className="bg-[#FFF9F5] dark:bg-[#201533] p-3 rounded-xl border border-[#FED7AA]/50 space-y-1">
            <span className="text-[#6B7280] dark:text-slate-400 font-bold uppercase text-[10px] block">Applicants</span>
            <span className="text-xs sm:text-sm font-bold text-[#7C3AED] dark:text-purple-300">
              {gig.applicantsCount || 0} Women Applied
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Description, Deliverables, How to Apply */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Detailed Overview */}
          <section className="bg-white dark:bg-[#191026] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-purple-900/40 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-heading text-[#1F2937] dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#7C3AED]" />
              <span>About the Role</span>
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
              {gig.description}
            </p>
          </section>

          {/* Section 2: Key Deliverables & Requirements */}
          {gig.deliverables && gig.deliverables.length > 0 && (
            <section className="bg-white dark:bg-[#191026] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-purple-900/40 shadow-sm space-y-4">
              <h2 className="text-lg font-bold font-heading text-[#1F2937] dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#7C3AED]" />
                <span>Key Deliverables & Responsibilities</span>
              </h2>
              <div className="space-y-2.5">
                {gig.deliverables.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#FFF9F5] dark:bg-[#201533] p-3.5 rounded-xl border border-[#FED7AA]/50">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-[#1F2937] dark:text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 3: How to Apply (Clear 3 Steps) */}
          <section className="bg-white dark:bg-[#191026] rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] dark:border-purple-900/40 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-heading text-[#1F2937] dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#7C3AED]" />
              <span>How to Apply (100% Free)</span>
            </h2>
            
            <div className="space-y-3 text-xs sm:text-sm text-[#4B5563] dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <strong className="text-[#1F2937] dark:text-white">Submit Cover Note:</strong> Write a brief introductory note and optionally link your capstone portfolio project.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <strong className="text-[#1F2937] dark:text-white">Quick Skill Assessment:</strong> Complete a simple 6-question quiz to confirm role compatibility.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <strong className="text-[#1F2937] dark:text-white">Escrow Payment Protected:</strong> Upon client selection, stipend funds are held in escrow before work begins.
                </div>
              </div>
            </div>
          </section>

          {/* Payment Safety Guarantee */}
          <div className="bg-[#DCFCE7] dark:bg-emerald-950/40 rounded-2xl p-5 border border-[#BBF7D0] dark:border-emerald-800/40 text-[#14532D] dark:text-emerald-300 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold font-heading">
              <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
              <span>Guaranteed Payout Safety</span>
            </div>
            <p className="text-xs leading-relaxed font-normal text-[#166534] dark:text-emerald-400">
              HerEarn holds client funds securely in escrow prior to project work. Once deliverables are submitted, stipend funds are released directly to your account.
            </p>
          </div>

        </div>

        {/* Right Column: Sticky Apply Card & Skill Match Requirements */}
        <aside className="space-y-6">
          
          {/* Sticky Apply Action Card */}
          <div className="bg-white dark:bg-[#191026] rounded-2xl p-6 border border-[#E5E7EB] dark:border-purple-900/40 shadow-sm space-y-5 sticky top-24">
            
            <div className="space-y-1 text-center">
              <span className="badge-free text-[11px] py-1">
                Zero Application Fees
              </span>
              <p className="text-xl font-black font-heading text-[#1F2937] dark:text-white pt-1">
                {gig.stipend || 'Competitive Stipend'}
              </p>
              <p className="text-xs text-[#6B7280] dark:text-slate-400">
                Direct client contract with escrow guarantee
              </p>
            </div>

            {/* Main Apply Button */}
            <button
              type="button"
              onClick={() => onApply(gig)}
              disabled={gig.applied}
              className={`tap-target w-full rounded-xl font-bold font-heading text-sm px-6 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md min-h-[48px] ${
                gig.applied
                  ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed shadow-none'
                  : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
              }`}
            >
              {gig.applied ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  <span>Already Applied</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Free Apply & Skill Assessment</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#6B7280] dark:text-slate-400 leading-relaxed">
              Takes less than 5 minutes. Includes a short 6-question quiz to demonstrate your skills.
            </p>

            {/* Skill Requirements Breakdown */}
            <div className="pt-4 border-t border-[#E5E7EB] dark:border-purple-900/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1F2937] dark:text-white">Required Skills</span>
                <span className="text-[11px] font-bold text-[#7C3AED] dark:text-purple-300">
                  {matchRes.matchedSkills.length}/{matchRes.totalRequired} matched
                </span>
              </div>

              {/* Matched Skills */}
              {matchRes.matchedSkills.length > 0 && (
                <div className="space-y-1.5">
                  {matchRes.matchedSkills.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#166534] bg-[#DCFCE7] dark:bg-emerald-950/60 p-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Missing Skills */}
              {matchRes.missingSkills.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-[#6B7280] dark:text-slate-400 block font-medium">To learn or add:</span>
                  {matchRes.missingSkills.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-[#4B5563] dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                      <span>{s}</span>
                      {onToggleSkill && (
                        <button
                          type="button"
                          onClick={() => onToggleSkill(s)}
                          className="text-[10px] text-[#7C3AED] font-bold hover:underline cursor-pointer"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </aside>

      </div>

      {/* Mobile Sticky Bottom Apply Bar (Visible on mobile only, ensuring high conversion & zero frustration) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-[#191026] border-t border-[#E5E7EB] dark:border-purple-900/40 p-3 z-40 shadow-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase text-[#EA580C] block">100% Free</span>
          <span className="text-sm font-extrabold text-[#16A34A]">{gig.stipend || 'Paid Gig'}</span>
        </div>
        <button
          type="button"
          onClick={() => onApply(gig)}
          disabled={gig.applied}
          className={`tap-target px-6 py-2.5 rounded-xl font-bold font-heading text-xs flex items-center gap-1.5 shadow-md cursor-pointer ${
            gig.applied
              ? 'bg-[#E5E7EB] text-[#9CA3AF]'
              : 'bg-[#7C3AED] text-white'
          }`}
        >
          <span>{gig.applied ? 'Applied' : 'Free Apply'}</span>
          {!gig.applied && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>

    </div>
  );
}
