import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * Trust & Safety Notice Component
 * Reminds candidates that Skill to Women is 100% free and guards against job scams.
 */
export default function TrustScamBanner({ variant = 'bar' }) {
  if (variant === 'compact') {
    return (
      <div 
        className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF7ED] dark:bg-orange-950/30 border border-[#FED7AA] dark:border-orange-800/40 text-xs text-[#9A3412] dark:text-orange-200"
        role="note"
        aria-label="Safety Notice"
      >
        <ShieldCheck className="w-4 h-4 text-[#EA580C] shrink-0" />
        <p>
          <strong>Always 100% Free:</strong> Employers on this platform will never ask you for money or fees.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="w-full bg-[#FFF9F5] dark:bg-[#1A1028] border border-[#FED7AA] dark:border-purple-800/40 rounded-2xl p-4 sm:p-5 shadow-sm"
      role="region"
      aria-label="Trust and Job Scam Safety Guidelines"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] dark:bg-orange-900/40 text-[#EA580C] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-heading text-[#1F2937] dark:text-white flex items-center gap-2">
              <span>Stay Safe from Job Scams — Skill to Women is 100% Free</span>
              <span className="badge-free text-[10px] py-0.5">Zero Fees</span>
            </h4>
            <p className="text-xs text-[#6B7280] dark:text-slate-300 mt-1 leading-relaxed">
              We never charge candidates for job listings, applications, or interviews. Never share bank OTPs or pay registration fees for any job.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] dark:bg-emerald-950/60 dark:text-emerald-300 px-3.5 py-2 rounded-xl border border-[#BBF7D0] dark:border-emerald-800/40">
          <CheckCircle2 className="w-4 h-4" />
          <span>Verified Opportunities</span>
        </div>
      </div>
    </div>
  );
}
