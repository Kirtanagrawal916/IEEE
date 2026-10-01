import React, { useState } from 'react';
import { ShieldCheck, IndianRupee, X, CheckCircle, ArrowRight, Lock, Building } from 'lucide-react';

export default function PaymentEscrowModal({ isOpen, onClose, amount, gigTitle, showToast }) {
  const [step, setStep] = useState('review'); // 'review' | 'paying' | 'success'

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setStep('paying');
    setTimeout(() => {
      setStep('success');
      if (showToast) showToast("💸 Escrow Payment Released!", `₹${amount || '6,000'} has been disbursed to creator's bank account via Razorpay/UPI.`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-black text-slate-900 dark:text-white">HerEarn Escrow Payment Protection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-center">
          
          {step === 'review' && (
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <IndianRupee className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Escrow Stipend Release</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white">₹{(amount || 6000).toLocaleString()}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">{gigTitle || 'Canva Social Graphic Deliverable'}</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span>Escrow Account Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> Funded & Locked</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span>Deliverable Verification:</span>
                  <span className="text-purple-600 font-bold">Approved by Client ✅</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Release Stipend via UPI / Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'paying' && (
            <div className="py-8 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Processing Secure Escrow Transfer...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Payment Successfully Disbursed!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-xs mx-auto">
                ₹{(amount || 6000).toLocaleString()} has been safely credited to the candidate's bank account with zero transaction fees.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-md hover:bg-purple-700 cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
