import React from 'react';
import { Scale, ShieldCheck, CheckCircle2, ArrowLeft, LockKeyhole } from 'lucide-react';

export default function TermsPage({ onNavigate }) {
  const sections = [
    {
      title: "1. Platform Overview & Intent",
      content: "HerEarn is a skill-to-income platform dedicated to empowering women across India. All content, learning tracks, and portfolio verification tools are provided to support legitimate skill acquisition, career showcase, and verified opportunity connection."
    },
    {
      title: "2. Account Registration & Security",
      content: "Learners and employers must provide accurate, truthful email and credential details. You are responsible for maintaining the confidentiality of your account authentication details and OTP codes."
    },
    {
      title: "3. Learning Tracks & Content Usage",
      content: "All educational courses, guides, and practical track materials hosted on HerEarn are free for personal learning and skill growth. Commercial redistribution or unauthorized copying of core course material is prohibited."
    },
    {
      title: "4. Portfolio Proof-of-Work Verification",
      content: "Projects submitted to the HerEarn Portfolio Builder must represent your original work or team contributions. Submitting plagiarized assets or fraudulent deliverables will lead to project removal and account suspension."
    },
    {
      title: "5. Micro-Gigs & Opportunity Marketplace",
      content: "Opportunity listings, stipends, and client micro-gigs posted on HerEarn undergo verification. HerEarn acts as a connecting platform and ensures transparent deliverable expectations between clients and learners."
    },
    {
      title: "6. Platform Code of Conduct",
      content: "HerEarn maintains a respectful, supportive community for women. Harassment, discrimination, spamming, or fraudulent behavior will result in immediate termination of platform access."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-12 px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-pink-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
              <p className="text-xs text-slate-400 font-medium">Last updated: September 2026 • HerEarn Platform Terms</p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/70 border border-purple-500/20 p-6 sm:p-10 rounded-3xl space-y-8 backdrop-blur-md shadow-xl">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-800 pb-6 last:border-b-0 last:pb-0">
              <h2 className="text-lg font-bold text-purple-300">{sec.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{sec.content}</p>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
          <LockKeyhole className="w-4 h-4 text-emerald-400" />
          <span>Questions about our terms? Contact legal@herearn.org</span>
        </div>

      </div>
    </div>
  );
}
