import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ArrowUp, 
  ChevronDown, 
  FileText, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  UserCheck, 
  HelpCircle, 
  Mail, 
  AlertCircle 
} from 'lucide-react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: FileText,
      content: `Welcome to HerEarn ("Platform", "we", "us", or "our"). HerEarn is a skill-to-income digital platform designed to empower women across India by providing free skill learning tracks, practical proof-of-work portfolio builders, and verified client opportunity connections. By accessing or using HerEarn, you agree to be bound by these Terms and Conditions.`
    },
    {
      id: 'use-of-platform',
      title: 'Use of Platform',
      icon: ShieldCheck,
      content: `HerEarn provides access to educational courses, interactive skill tracks, and micro-gig marketplace listings. You agree to use the platform solely for lawful educational and professional purposes. You must not attempt to disrupt platform performance, reverse engineer platform code, or engage in unauthorized data scraping.`
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: UserCheck,
      content: `Learners and client partners must provide accurate, complete registration details during sign up. You are responsible for maintaining the confidentiality of your account credentials and OTP verification tokens. Any activity occurring under your logged-in account is your sole responsibility.`
    },
    {
      id: 'content-policy',
      title: 'Content Policy',
      icon: Lock,
      content: `All portfolio projects submitted to HerEarn must represent your original work or authorized team contributions. Submitting plagiarized assets, misleading project details, or infringing copyright rights will result in project removal and permanent account suspension.`
    },
    {
      id: 'payments',
      title: 'Payments & Escrow Protection',
      icon: CreditCard,
      content: `Stipends and micro-gig payments listed on HerEarn are processed through our Escrow Protection model. Agreed client funds are reserved before work commences and released upon verified project delivery. Platform fee transparency is maintained across all completed transactions.`
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Protection',
      icon: ShieldCheck,
      content: `Your personal data, learning progress, and contact details are handled in accordance with our Privacy Policy. We do not sell your personal information to third-party data brokers. Contact information shared with client partners is limited to verified project applications.`
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers & Limitation of Liability',
      icon: AlertCircle,
      content: `HerEarn provides learning content and opportunity matching on an "as-is" basis. While we verify client listings and track course quality, HerEarn does not guarantee immediate employment outcomes or third-party client performance beyond escrow protections.`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      content: `If you have questions, feedback, or legal inquiries regarding these Terms & Conditions, please reach out to our legal and support team at legal@herearn.org or support@herearn.org.`
    }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in relative">
      
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-purple-500/20 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Legal Agreement
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Terms and Conditions
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Last updated: <strong className="text-slate-900 dark:text-white font-extrabold">September 30, 2026</strong> • Official HerEarn Terms of Service
          </p>
        </div>

        {/* Mobile Dropdown Table of Contents */}
        <div className="block lg:hidden bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-purple-500/30 shadow-md">
          <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
            Jump to Section:
          </label>
          <div className="relative">
            <select
              value={activeSection}
              onChange={(e) => scrollToSection(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-purple-500"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Grid Layout: Desktop Sidebar + Content Panel */}
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Table of Contents Sidebar */}
          <div className="hidden lg:block sticky top-24 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-purple-500/30 shadow-md space-y-2">
            <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider px-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              Table of Contents
            </h3>

            <nav className="space-y-1 pt-1">
              {sections.map((sec) => {
                const IconComponent = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Terms Content Panel */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-purple-500/30 shadow-xl space-y-10">
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    <sec.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {sec.title}
                  </h2>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-purple-500/40 via-purple-300/20 to-transparent"></div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {sec.content}
                </p>
              </section>
            ))}
          </div>

        </div>

      </div>

      {/* Fixed Back to Top Floating Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl border border-pink-400/40 hover:scale-110 transition-all cursor-pointer flex items-center justify-center"
        title="Back to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
}
