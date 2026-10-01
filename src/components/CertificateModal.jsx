import React from 'react';
import { Award, X, Download, ShieldCheck, Share2, CheckCircle, Sparkles, Printer } from 'lucide-react';

export default function CertificateModal({ isOpen, onClose, user, trackTitle }) {
  if (!isOpen) return null;

  const certificateId = `HE-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const userName = user?.name || 'Verified Learner';
  const courseName = trackTitle || 'Digital Marketing & Growth Strategy';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Verified Skill Certificate</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Box */}
        <div className="p-6 sm:p-10 space-y-6">
          
          <div className="relative border-8 border-double border-purple-200 dark:border-purple-800/60 p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-purple-50/40 via-white to-pink-50/30 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950 text-center space-y-6 shadow-inner">
            
            {/* Watermark / Badge */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg">
                <Award className="w-9 h-9" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Official Certificate of Completion
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                HerEarn Skills Academy
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              This is to proudly certify that
            </p>

            <div className="py-2">
              <span className="text-2xl sm:text-3xl font-black text-purple-700 dark:text-purple-300 underline underline-offset-8 decoration-pink-500/50">
                {userName}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              has successfully completed all hands-on modules, practical assignments, and verified portfolio capstones for the skill track:
            </p>

            <div className="bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-500/40 p-4 rounded-2xl text-purple-900 dark:text-purple-200 font-extrabold text-base sm:text-lg">
              {courseName}
            </div>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left border-t border-purple-200 dark:border-purple-800/40 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Issue Date</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{issueDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Verification ID</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{certificateId}</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Sharable link with QR verification</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
