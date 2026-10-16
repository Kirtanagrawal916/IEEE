import React from 'react';
import { 
  Building, 
  MapPin, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

/**
 * Reusable, Accessible JobCard Component for Skill to Women platform
 * Adheres to WCAG AA contrast, 44px+ tap targets, and clean card styling
 */
export default function JobCard({ 
  job, 
  onViewDetails, 
  onApply, 
  matchPercentage 
}) {
  if (!job) return null;

  return (
    <article 
      className="theme-card bg-white dark:bg-[#191026] border border-[#E5E7EB] dark:border-purple-900/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-[#7C3AED]/40 relative group"
      aria-label={`Job listing: ${job.title} at ${job.company}`}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category */}
            <span className="badge-plum text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3E8FF] text-[#6D28D9] dark:bg-purple-950/60 dark:text-purple-300 border border-[#E9D5FF] dark:border-purple-800/40">
              {job.category || 'Job Opportunity'}
            </span>
            
            {/* 100% Free Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FFF7ED] text-[#EA580C] dark:bg-orange-950/40 dark:text-orange-300 border border-[#FED7AA] dark:border-orange-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
              Free to Apply
            </span>
          </div>

          {/* Optional Match Percentage */}
          {matchPercentage !== undefined && matchPercentage >= 50 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] dark:bg-emerald-950/60 dark:text-emerald-300 border border-[#BBF7D0]">
              <Sparkles className="w-3 h-3" />
              {matchPercentage}% Match
            </span>
          )}
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails && onViewDetails(job)}
          className="text-lg sm:text-xl font-bold font-heading text-[#1F2937] dark:text-white hover:text-[#7C3AED] dark:hover:text-purple-300 transition-colors leading-snug mb-3 cursor-pointer"
        >
          {job.title}
        </h3>

        {/* Company & Core Metadata Box */}
        <div className="bg-[#FFF9F5] dark:bg-[#201533] p-3.5 rounded-xl border border-[#FED7AA]/50 dark:border-purple-800/30 space-y-2 mb-4 text-xs font-medium text-[#4B5563] dark:text-slate-300">
          <div className="flex items-center gap-2 font-bold text-[#1F2937] dark:text-white">
            <Building className="w-4 h-4 text-[#7C3AED] shrink-0" />
            <span className="truncate">{job.company}</span>
            {job.verifiedClient && (
              <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.2 rounded-md">
                Verified
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[13px]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#F97316] shrink-0" />
              <span className="truncate">{job.location || 'Remote (PAN India)'}</span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-[#1F2937] dark:text-emerald-300">
              <IndianRupee className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>{job.stipend || 'Competitive Stipend'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 text-[11px] text-[#6B7280] dark:text-slate-400 border-t border-slate-200/60 dark:border-purple-800/20">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {job.duration || job.type || 'Flexible'}
            </span>
            {job.deadline && (
              <span>• Deadline: <strong className="text-[#1F2937] dark:text-slate-200">{job.deadline}</strong></span>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-[#4B5563] dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Skill Tags */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {job.skillsRequired.slice(0, 3).map((skill, idx) => (
              <span 
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4B5563] dark:bg-slate-800 dark:text-slate-300"
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 3 && (
              <span className="text-[11px] text-[#6B7280] dark:text-slate-400 self-center">
                +{job.skillsRequired.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons (Accessible 44px+ tap targets) */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onApply && onApply(job)}
          disabled={job.applied}
          className={`tap-target w-full rounded-xl font-bold font-heading text-sm px-4 py-3 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            job.applied
              ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
              : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm hover:shadow-md'
          }`}
          aria-label={`Apply to ${job.title} for free`}
        >
          <span>{job.applied ? 'Applied' : 'Free Apply'}</span>
          {!job.applied && <ArrowRight className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(job)}
          className="tap-target w-full rounded-xl font-bold font-heading text-sm px-4 py-3 bg-white dark:bg-[#191026] border border-[#E5E7EB] dark:border-purple-800/40 text-[#4B5563] dark:text-slate-200 hover:bg-[#F3E8FF] hover:text-[#6D28D9] hover:border-[#7C3AED]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          aria-label={`View full details for ${job.title}`}
        >
          <span>View Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
