import React from 'react';
import { Sparkles, Target, Award, Heart, CheckCircle2, Shield, Users, ArrowRight, X, BookOpen, Briefcase } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-900 dark:text-white overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative space-y-6 text-xs max-h-[90vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-purple-200 dark:border-purple-500/20 pb-4 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-wider">About HerEarn</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Skill-to-Income Platform for Women</h2>
          </div>
        </div>

        {/* Problem Statement Hero Card */}
        <div className="bg-purple-950 dark:bg-gradient-to-br dark:from-purple-950 dark:via-slate-900 dark:to-indigo-950 border border-purple-400/40 dark:border-purple-500/30 rounded-2xl p-5 space-y-3 shadow-inner text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-[11px] font-bold border border-purple-400/30">
            <Target className="w-3.5 h-3.5 text-amber-300" />
            The Core Problem Statement
          </div>
          <p className="text-xs text-purple-100 leading-relaxed font-medium">
            Millions of skilled, talented, and ambitious women across India face significant barriers to financial independence due to a lack of structured access to market-relevant digital skills, verified proof-of-work showcases, and direct flexible income opportunities.
          </p>
        </div>

        {/* The HerEarn Solution */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Our Solution: The 3-Step Success Loop
          </h3>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-purple-500/20 rounded-xl p-3.5 space-y-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-300 w-fit">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">1. Learn Market Skills</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                Short, practical modules in Digital Marketing, Canva Graphic Design, Shopify E-Commerce, and Content Writing.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-pink-500/20 rounded-xl p-3.5 space-y-2">
              <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-600/30 text-pink-700 dark:text-pink-300 w-fit">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">2. Showcase Portfolio</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                Publish real capstone projects to a public verified showcase gallery to demonstrate proof-of-work.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-amber-500/20 rounded-xl p-3.5 space-y-2">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-600/30 text-amber-700 dark:text-amber-300 w-fit">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">3. Connect & Earn</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                Apply directly to client micro-gigs, remote internships, and freelance projects to earn income.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Impact */}
        <div className="space-y-2 border-t border-purple-200 dark:border-purple-500/20 pt-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            Mission & Impact Goal
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Our mission is to enable <strong className="text-purple-700 dark:text-pink-300 font-bold">100,000+ women</strong> to achieve financial independence by bridging the gap between digital learning and paid opportunities within <strong className="text-emerald-700 dark:text-emerald-400 font-bold">90 days of onboarding</strong>.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-purple-300 dark:border-purple-500/30">✓ Practical Skills</span>
            <span className="bg-pink-100 dark:bg-pink-500/20 text-pink-800 dark:text-pink-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-pink-300 dark:border-pink-500/30">✓ Proof-of-Work</span>
            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-500/30">✓ Micro-Gigs</span>
            <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/30">✓ Financial Empowerment</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-purple-200 dark:border-purple-500/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-gradient-award text-xs py-2.5 px-6 font-bold cursor-pointer"
          >
            Close About Info
          </button>
        </div>

      </div>
    </div>
  );
}
