import React, { useState } from 'react';
import { Sparkles, X, FileText, Download, Copy, Check, Target, Zap, Award, Briefcase } from 'lucide-react';

export default function ResumeBuilderModal({ isOpen, onClose, user, portfolios }) {
  const [copied, setCopied] = useState(false);
  const [targetRole, setTargetRole] = useState('Digital Marketing Specialist');

  if (!isOpen) return null;

  const userName = user?.name || 'Jane Doe';
  const email = user?.email || 'jane.doe@example.com';
  const location = user?.location || 'Mumbai, India';
  const bio = user?.bio || 'Passionate digital creator skilled in social media marketing, Canva visual design, and content writing.';

  const userProjects = (portfolios || []).slice(0, 3);

  const skillGaps = [
    { skill: 'SEO Keyword Clustering', status: 'Mastered', percent: 100 },
    { skill: 'Canva Brand Identity', status: 'Mastered', percent: 100 },
    { skill: 'Google Analytics 4', status: 'Recommended Track', percent: 60 },
  ];

  const handleCopy = () => {
    const text = `RESUME - ${userName}\nEmail: ${email} | Location: ${location}\nTarget Role: ${targetRole}\n\nSUMMARY:\n${bio}\n\nVERIFIED PROJECTS:\n${userProjects.map(p => `- ${p.title} (${p.category}): ${p.description}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">AI Resume Builder & Skill Analyzer</h2>
              <p className="text-xs text-purple-600 dark:text-purple-300 font-semibold">Auto-generates ATS-optimized resume from your verified portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Target Role Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">Target Role Analysis</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="mt-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold px-3 py-2 rounded-xl border border-purple-300 dark:border-purple-500/30 focus:outline-none"
              >
                <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                <option value="Canva Graphic Designer">Canva Graphic Designer</option>
                <option value="Shopify Store Manager">Shopify Store Manager</option>
                <option value="SEO Copywriter">SEO Copywriter</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Skill Match Readiness: <strong>92%</strong></span>
            </div>
          </div>

          {/* Skill Gap Analysis Row */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Skill-Gap Readiness Audit</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {skillGaps.map((sg, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{sg.skill}</span>
                    <span className="text-purple-600 dark:text-purple-400">{sg.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full" style={{ width: `${sg.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Preview Box */}
          <div className="border border-purple-200 dark:border-purple-500/30 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/80 space-y-4 font-sans text-xs">
            <div className="border-b border-purple-200 dark:border-purple-800 pb-3">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">{userName}</h3>
              <p className="text-purple-600 dark:text-purple-400 font-bold">{targetRole} • {location}</p>
              <p className="text-slate-500 dark:text-slate-400">{email}</p>
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold uppercase text-purple-700 dark:text-purple-300">Professional Summary</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{bio}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold uppercase text-purple-700 dark:text-purple-300">Verified Proof-of-Work Projects</h4>
              {userProjects.map((p, idx) => (
                <div key={idx} className="pl-3 border-l-2 border-purple-500 space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white">{p.title} <span className="text-purple-500 font-normal">({p.category})</span></p>
                  <p className="text-slate-600 dark:text-slate-300">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download ATS Resume</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
