import React, { useState } from 'react';
import { X, Send, Briefcase, Award, CheckCircle2, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function ApplyGigModal({ isOpen, onClose, gig, userPortfolios = [], onConfirmApply }) {
  const [coverNote, setCoverNote] = useState('');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(userPortfolios[0]?.id || 'capstone-default');

  if (!isOpen || !gig) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmApply(gig.id, coverNote, selectedPortfolioId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-purple-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative space-y-6">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 text-xs font-extrabold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            1-Click Opportunity Application
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{gig.title}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>{gig.company}</span>
            <span>•</span>
            <span>Stipend: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{gig.stipend}</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Attach Portfolio Project */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Attach Proof-of-Work Portfolio Project
            </label>
            
            {userPortfolios && userPortfolios.length > 0 ? (
              <select
                value={selectedPortfolioId}
                onChange={(e) => setSelectedPortfolioId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-medium"
              >
                {userPortfolios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.category || 'Verified Project'})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 flex items-center justify-between gap-2">
                <span className="font-semibold">Attached: Course Skill Track Capstone Badge</span>
                <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-md">Verified</span>
              </div>
            )}
          </div>

          {/* Proposal Message */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Proposal Note to Client
            </label>
            <textarea
              required
              rows={4}
              placeholder="Hi! I have completed HerEarn's skill tracks and built sample projects in Canva/Marketing. I can handle your deliverables on time with quality work..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-400"
            ></textarea>
          </div>

          {/* Escrow Guarantee Box */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
            <p className="flex items-center gap-1.5 font-extrabold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Verified Escrow Payout Protection Included
            </p>
            <p className="text-emerald-700 dark:text-emerald-400">
              Your application includes verified skill credentials so client partners review your submission within 48 hours.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Submit Application to Client
          </button>
        </form>

      </div>
    </div>
  );
}
