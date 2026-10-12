import React, { useEffect } from 'react';
import { 
  Award, 
  X, 
  Download, 
  ShieldCheck, 
  Share2, 
  Printer, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

export default function CertificateModal({ isOpen, onClose, user, trackTitle }) {
  useEffect(() => {
    if (isOpen) {
      triggerCelebrationConfetti();
    }
  }, [isOpen]);

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

  const handleAddToLinkedIn = () => {
    const certName = encodeURIComponent(courseName);
    const orgName = encodeURIComponent('HerEarn Skills Academy');
    const issueY = new Date().getFullYear();
    const issueM = new Date().getMonth() + 1;
    const certUrl = encodeURIComponent(window.location.origin);
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=${issueY}&issueMonth=${issueM}&certUrl=${certUrl}&certId=${certificateId}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadImage = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 800);
      grad.addColorStop(0, '#fcfaff');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#fdf2f8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 800);

      // Decorative Borders
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, 1140, 740);

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, 1110, 710);

      // Header Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7e22ce';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('OFFICIAL CERTIFICATE OF COMPLETION', 600, 140);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('HerEarn Skills Academy', 600, 200);

      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 22px sans-serif';
      ctx.fillText('This is to proudly certify that', 600, 260);

      // Learner Name
      ctx.fillStyle = '#6b21a8';
      ctx.font = 'bold 46px sans-serif';
      ctx.fillText(userName, 600, 335);

      // Underline
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(350, 355);
      ctx.lineTo(850, 355);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '19px sans-serif';
      ctx.fillText('has successfully mastered all practical modules, assignments & capstone deliverables for:', 600, 410);

      // Course Title Box
      ctx.fillStyle = '#f3e8ff';
      ctx.fillRect(200, 440, 800, 70);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.strokeRect(200, 440, 800, 70);

      ctx.fillStyle = '#581c87';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(courseName, 600, 485);

      // Verification Footer
      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`ISSUE DATE: ${issueDate}`, 120, 680);
      ctx.fillText(`CREDENTIAL ID: ${certificateId}`, 120, 710);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('VERIFIED AUTHENTIC CERTIFICATE ✓', 1080, 680);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText('https://herearn.org/verify', 1080, 710);

      // Download triggered
      const link = document.createElement('a');
      link.download = `HerEarn-Certificate-${userName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.warn('[Certificate Export] Error generating image:', err);
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Verified Skill Certificate</h2>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Credential verifiable across client opportunities & LinkedIn</p>
            </div>
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
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToLinkedIn}
              className="px-4 py-2.5 rounded-xl bg-[#0077b5] hover:bg-[#005f93] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <LinkedInIcon />
              <span>Add to LinkedIn Profile</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Image</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
