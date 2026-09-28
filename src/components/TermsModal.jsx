import React from 'react';
import { FileText, Shield, CheckCircle2, Lock, Scale, AlertCircle, X } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-white overflow-y-auto">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative space-y-5 text-xs max-h-[90vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-purple-500/20 pb-4 pr-8">
          <div className="p-3 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">HerEarn Platform Policies</span>
            <h2 className="text-xl font-extrabold text-white">Terms & Conditions of Service</h2>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4 text-slate-300 leading-relaxed font-normal">
          
          {/* Section 1 */}
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-extrabold text-xs text-purple-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              1. Acceptance of Terms
            </h3>
            <p className="text-[11px] text-slate-300">
              By accessing or creating an account on the HerEarn platform, you agree to comply with and be bound by these Terms and Conditions. HerEarn provides a skill-learning and micro-gig marketplace designed for women creators and learners.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-extrabold text-xs text-purple-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              2. User Eligibility & Profile Integrity
            </h3>
            <p className="text-[11px] text-slate-300">
              Users must provide accurate, truthful details when building their learner profile. HerEarn reserves the right to verify skill credentials, portfolio submissions, and client feedback to preserve ecosystem trust.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-extrabold text-xs text-purple-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-pink-400" />
              3. Portfolio Projects & Intellectual Property
            </h3>
            <p className="text-[11px] text-slate-300">
              Users retain ownership of original capstone work and design assets submitted to the public portfolio showcase. By uploading content, users grant HerEarn permission to display their work to prospective clients and employers for hiring purposes.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-extrabold text-xs text-purple-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              4. Micro-Gigs, Stipends & Payments
            </h3>
            <p className="text-[11px] text-slate-300">
              Clients posting opportunities must accurately describe deliverables and stipend budgets. Freelance learners agree to deliver work on time. HerEarn facilitates verified project milestones to protect both learners and client partners against unpaid labor.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-4 space-y-1.5">
            <h3 className="font-extrabold text-xs text-purple-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              5. Community Safety & Professional Conduct
            </h3>
            <p className="text-[11px] text-slate-300">
              HerEarn maintains zero tolerance for harassment, discrimination, hate speech, or fraudulent job listings. Violations result in immediate suspension and removal from the platform.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-purple-500/20 flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-medium">Last updated: September 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-gradient-award text-xs py-2.5 px-6 font-bold cursor-pointer"
          >
            I Accept Terms
          </button>
        </div>

      </div>
    </div>
  );
}
