import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Trophy, 
  Download, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { skillTracks } from '../data/mockData';

export default function CertificateModal({ 
  isOpen, 
  onClose, 
  user,
  initialCourseTitle = "Digital Marketing & Social Media Growth"
}) {
  const [selectedCourse, setSelectedCourse] = useState(initialCourseTitle);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const userName = user?.name || 'Verified Learner';
  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const certId = `HE-${(user?.username || 'learner').toUpperCase().slice(0, 5)}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleDownload = () => {
    // Printable / downloadable credential
    window.print ? window.print() : alert(`Certificate for "${selectedCourse}" downloaded!`);
  };

  const handleShare = () => {
    const url = window.location.origin + `/profile?cert=${encodeURIComponent(selectedCourse)}`;
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl max-w-xl w-full p-6 text-slate-900 dark:text-white shadow-2xl relative space-y-5 my-8">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-purple-200 dark:border-purple-500/20 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Official Course Certificate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Verified digital credential backed by HerEarn platform
            </p>
          </div>
        </div>

        {/* Certificate Display Card */}
        <div className="relative overflow-hidden rounded-2xl border-4 border-double border-amber-400/80 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-center text-white space-y-4 shadow-2xl">
          
          {/* Subtle background ornamentation */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
              HerEarn Foundation • Certificate of Excellence
            </span>
            <p className="text-xs text-purple-200 font-medium">This is proudly presented to</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {userName}
            </h2>
          </div>

          <div className="py-2 border-y border-purple-500/30 space-y-1">
            <p className="text-xs text-purple-200">
              for successfully mastering and completing the capstone curriculum for
            </p>
            <p className="text-base sm:text-lg font-black text-pink-300">
              {selectedCourse}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300 gap-2 pt-2 border-t border-purple-500/20">
            <div className="text-left space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Credential ID:</span>
              <span className="font-mono font-bold text-amber-300">{certId}</span>
            </div>
            <div className="text-center sm:text-right space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Issue:</span>
              <span className="font-semibold text-slate-200">{issueDate}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographically Verified & Industry Recognized</span>
          </div>
        </div>

        {/* Course Track Selector */}
        <div className="space-y-1.5">
          <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
            Select Course Track to View:
          </label>
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-bold cursor-pointer"
          >
            {skillTracks.map(t => (
              <option key={t.id} value={t.title}>
                {t.title} ({t.category})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{isCopied ? "Link Copied! ✓" : "Share Proof"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
