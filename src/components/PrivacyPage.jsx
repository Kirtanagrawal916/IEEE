import React from 'react';
import { ShieldCheck, LockKeyhole, ArrowLeft } from 'lucide-react';

export default function PrivacyPage({ onNavigate }) {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you explicitly provide during account registration, email verification (OTP), portfolio project creation, and gig applications. This includes your name, verified email, skills, and portfolio work samples."
    },
    {
      title: "2. How Your Data Is Protected",
      content: "All passwords are encrypted using bcrypt password hashing algorithms. Data transfers between your browser and our servers are encrypted via standard SSL/TLS protocols."
    },
    {
      title: "3. Portfolio Transparency & Privacy Controls",
      content: "Your published portfolio projects are visible to prospective employers and clients to demonstrate proof-of-work. You maintain full ownership and control over your portfolio items and can edit or delete them at any time."
    },
    {
      title: "4. No Third-Party Data Selling",
      content: "HerEarn will never sell, rent, or lease your personal contact details or application data to third-party data brokers or advertisers."
    },
    {
      title: "5. Cookies & Authentication Tokens",
      content: "We use standard browser localStorage and secure tokens strictly for session authentication and maintaining your logged-in state across dashboard modules."
    },
    {
      title: "6. Your Privacy Rights",
      content: "You have the right to request a copy of your stored account data or request full deletion of your user account profile at any time by reaching out to privacy@herearn.org."
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
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
              <p className="text-xs text-slate-400 font-medium">Last updated: September 2026 • HerEarn Data Protection</p>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900/70 border border-purple-500/20 p-6 sm:p-10 rounded-3xl space-y-8 backdrop-blur-md shadow-xl">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-800 pb-6 last:border-b-0 last:pb-0">
              <h2 className="text-lg font-bold text-pink-300">{sec.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{sec.content}</p>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
          <LockKeyhole className="w-4 h-4 text-emerald-400" />
          <span>Your privacy is protected. Contact privacy@herearn.org for data requests.</span>
        </div>

      </div>
    </div>
  );
}
