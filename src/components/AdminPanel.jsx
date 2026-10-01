import React, { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Users, Briefcase, Award, BarChart3, Sparkles } from 'lucide-react';

export default function AdminPanel({ opportunities, portfolios, showToast }) {
  const [activeTab, setActiveTab] = useState('moderation');
  const [approvedGigIds, setApprovedGigIds] = useState([]);

  const stats = [
    { label: 'Total Registered Users', value: '1,420', icon: Users, color: 'text-purple-600' },
    { label: 'Active Micro-Gigs', value: opportunities?.length || 8, icon: Briefcase, color: 'text-pink-600' },
    { label: 'Verified Portfolios', value: portfolios?.length || 12, icon: Award, color: 'text-amber-600' },
    { label: 'Stipends Disbursed', value: '₹4.2 Lakhs', icon: Shield, color: 'text-emerald-600' },
  ];

  const handleApproveGig = (id) => {
    setApprovedGigIds([...approvedGigIds, id]);
    if (showToast) showToast("✅ Opportunity Approved", "Gig has been verified and published to live board.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-6 border border-purple-500/30 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">HerEarn Admin & Content Moderation Panel</h1>
            <p className="text-xs text-purple-300 font-semibold">Platform oversight, escrow audits, and opportunity verification</p>
          </div>
        </div>

        <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          Super Admin Live
        </span>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</span>
                <IconComp className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Moderation Queue */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-500/30 p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Pending Micro-Gig Verification Queue</span>
        </h2>

        <div className="space-y-3">
          {(opportunities || []).slice(0, 4).map((opp) => (
            <div key={opp.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">{opp.company} • {opp.stipend}</span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{opp.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{opp.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {approvedGigIds.includes(opp.id) ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                    Verified & Live ✅
                  </span>
                ) : (
                  <button
                    onClick={() => handleApproveGig(opp.id)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Verify Escrow</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
