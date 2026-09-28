import React, { useState } from 'react';
import { X, Send, Briefcase, Award, CheckCircle2 } from 'lucide-react';

export default function ApplyGigModal({ isOpen, onClose, gig, userPortfolios, onConfirmApply }) {
  const [coverNote, setCoverNote] = useState('');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(userPortfolios[0]?.id || '');

  if (!isOpen || !gig) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmApply(gig.id, coverNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            1-Click Gig Application
          </div>
          <h2 className="text-xl font-bold text-white">{gig.title}</h2>
          <p className="text-xs text-slate-400">
            {gig.company} • Stipend: <span className="text-emerald-400 font-bold">{gig.stipend}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Attach Portfolio Project */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Attach Verified Portfolio Project</label>
            <select
              value={selectedPortfolioId}
              onChange={(e) => setSelectedPortfolioId(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500"
            >
              {userPortfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (Verified {p.category})
                </option>
              ))}
            </select>
          </div>

          {/* Proposal Message */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Proposal Note to Client</label>
            <textarea
              required
              rows={4}
              placeholder="Hi! I have completed the Digital Marketing skill track and published my portfolio. I can handle your Instagram posts and Canva designs efficiently..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Escrow Protection Included
            </p>
            <p>Your portfolio proof is automatically attached so clients review your application faster.</p>
          </div>

          <button
            type="submit"
            className="w-full btn-accent justify-center py-3 font-bold text-xs bg-rose-600 hover:bg-rose-700"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Application to Client
          </button>
        </form>

      </div>
    </div>
  );
}
