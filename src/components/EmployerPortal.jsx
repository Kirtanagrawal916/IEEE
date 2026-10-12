import React, { useState } from 'react';
import { Briefcase, Plus, ShieldCheck, IndianRupee, Users, CheckCircle, Sparkles, Building2, Send } from 'lucide-react';

export default function EmployerPortal({ isOpen, onClose, onAddOpportunity, showToast }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [stipend, setStipend] = useState('₹6,000/month');
  const [location, setLocation] = useState('Remote (Work from Home)');
  const [category, setCategory] = useState('Digital Marketing');
  const [description, setDescription] = useState('');
  const [escrowAmount, setEscrowAmount] = useState('6000');
  const [isDepositing, setIsDepositing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !company) return;

    setIsDepositing(true);
    setTimeout(() => {
      setIsDepositing(false);
      const newOpp = {
        id: `opp-${Date.now()}`,
        title,
        company,
        stipend,
        type: 'Remote Micro-Gig',
        location,
        category,
        skillsRequired: [category, 'Communication', 'Deliverables'],
        description,
        skillMatchScore: 95,
        postedAt: 'Just now',
        escrowVerified: true
      };

      if (onAddOpportunity) onAddOpportunity(newOpp);
      if (showToast) showToast("🎉 Gig Posted & Escrow Funded!", "Opportunity has been published to the live Opportunities board.");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Employer Portal • Post Micro-Gig</h2>
              <p className="text-xs text-purple-600 dark:text-purple-300 font-semibold">Connect with verified female creators & guarantee stipend payouts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1">Opportunity Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Canva Social Graphic Designer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1">Company / Brand Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Bloom Crafts Co."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1">Skill Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Design">Graphic Design</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Content">SEO Copywriting</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1">Monthly Stipend</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹6,000/month"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 block mb-1">Project Description & Deliverables</label>
            <textarea
              rows={3}
              required
              placeholder="Describe tasks, expected weekly deliverables, and eligibility criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Escrow Deposit Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">100% Escrow Guarantee</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">Stipend is safely reserved before publishing gig.</p>
              </div>
            </div>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">₹{escrowAmount}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isDepositing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isDepositing ? 'Funding Escrow & Publishing...' : 'Deposit Escrow & Post Gig'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
