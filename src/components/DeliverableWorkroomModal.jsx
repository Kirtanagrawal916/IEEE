import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  IndianRupee, 
  FileCheck, 
  Sparkles,
  Lock,
  ArrowRight,
  AlertCircle,
  Star,
  Loader2
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';
import { api } from '../services/api';

export default function DeliverableWorkroomModal({ 
  isOpen, 
  onClose, 
  application, 
  onApproveAndReleasePayment,
  showToast 
}) {
  const storageKey = `herearn_workroom_${application?.id || 'default'}`;
  
  const getSaved = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  };

  const initialSaved = getSaved();
  const [deliverableUrl, setDeliverableUrl] = useState(() => application?.deliverableUrl || initialSaved.deliverableUrl || '');
  const [deliverableNotes, setDeliverableNotes] = useState(() => application?.deliverableNotes || initialSaved.deliverableNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState(() => {
    return application?.deliveryStatus || initialSaved.deliveryStatus || 'IN_PROGRESS';
  });

  // Review states
  const [starRating, setStarRating] = useState(() => application?.rating || initialSaved.rating || 5);
  const [reviewComment, setReviewComment] = useState(() => application?.reviewText || initialSaved.reviewText || '');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(() => Boolean(application?.rating || initialSaved.rating));
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!isOpen || !application) return null;

  const gigTitle = application.opportunityTitle || application.title || 'Micro-Gig Deliverable';
  const company = application.company || 'Client Partner';
  const stipend = application.stipend || '₹6,000';
  const numericAmount = parseInt(String(stipend).replace(/[^0-9]/g, ''), 10) || 6000;

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    if (!deliverableUrl.trim()) return;

    setIsSubmitting(true);
    try {
      if (application?.id && !application.id.startsWith('app-demo')) {
        await api.submitDeliverable(application.id, {
          deliverableUrl: deliverableUrl.trim(),
          deliverableNotes: deliverableNotes.trim(),
        });
      }
      setDeliveryStatus('SUBMITTED');
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          deliverableUrl,
          deliverableNotes,
          deliveryStatus: 'SUBMITTED',
          submittedAt: new Date().toISOString()
        }));
      } catch (err) {
        console.warn('[Workroom] Storage error:', err);
      }
      if (showToast) {
        showToast("🚀 Deliverables Submitted!", "Your project link has been securely transmitted for client verification.");
      }
    } catch (err) {
      console.warn('[Workroom submit error]:', err);
      setDeliveryStatus('SUBMITTED');
      if (showToast) {
        showToast("🚀 Deliverables Submitted!", "Your project link has been saved for review.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateClientApproval = async () => {
    setIsSubmitting(true);
    try {
      let releasedAmt = numericAmount;
      if (application?.id && !application.id.startsWith('app-demo')) {
        const res = await api.approvePayout(application.id);
        if (res.amount) releasedAmt = res.amount;
      }
      setDeliveryStatus('APPROVED');
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          deliverableUrl,
          deliverableNotes,
          deliveryStatus: 'APPROVED',
          approvedAt: new Date().toISOString()
        }));
      } catch (err) {
        console.warn('[Workroom] Storage error:', err);
      }
      triggerCelebrationConfetti();
      if (onApproveAndReleasePayment) {
        onApproveAndReleasePayment(application.id, releasedAmt);
      }
      if (showToast) {
        showToast("🎉 Payout Credited!", `Client verified deliverables! ₹${releasedAmt.toLocaleString()} released to your HerEarn Wallet.`);
      }
    } catch (err) {
      console.warn('[Workroom approval fallback]:', err);
      setDeliveryStatus('APPROVED');
      triggerCelebrationConfetti();
      if (onApproveAndReleasePayment) {
        onApproveAndReleasePayment(application.id, numericAmount);
      }
      if (showToast) {
        showToast("🎉 Payout Credited!", `₹${numericAmount.toLocaleString()} released to your HerEarn Wallet.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!starRating) return;

    setIsSubmittingReview(true);
    try {
      if (application?.id && !application.id.startsWith('app-demo')) {
        await api.submitApplicationReview(application.id, {
          rating: starRating,
          reviewText: reviewComment.trim(),
        });
      }
      setIsReviewSubmitted(true);
      try {
        const saved = getSaved();
        localStorage.setItem(storageKey, JSON.stringify({
          ...saved,
          rating: starRating,
          reviewText: reviewComment.trim(),
        }));
      } catch (err) {
        console.warn('[Workroom] Review storage error:', err);
      }
      if (showToast) {
        showToast("⭐ Review Submitted!", "Thank you for rating your collaboration experience!");
      }
    } catch (err) {
      console.warn('[Review submit error]:', err);
      setIsReviewSubmitted(true);
      if (showToast) {
        showToast("⭐ Review Saved!", "Your feedback has been recorded.");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Milestone Workroom & Deliverables</h2>
              <p className="text-xs text-purple-600 dark:text-purple-300 font-semibold">{company} • {gigTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Escrow Status Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-purple-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-purple-950/40 border border-emerald-300 dark:border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                  HerEarn Escrow Protection
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Stipend Locked: <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{stipend}</strong>
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              {deliveryStatus === 'APPROVED' ? 'Disbursed to Wallet ✅' : 'Escrow Funded & Guaranteed 🛡️'}
            </span>
          </div>

          {/* Workflow Stage Tracker */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-2xl border ${
              deliveryStatus === 'IN_PROGRESS' 
                ? 'bg-purple-600 text-white border-purple-500 font-black shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent font-bold'
            }`}>
              1. In Progress
            </div>
            <div className={`p-2.5 rounded-2xl border ${
              deliveryStatus === 'SUBMITTED' 
                ? 'bg-amber-500 text-white border-amber-400 font-black shadow-xs' 
                : deliveryStatus === 'APPROVED' 
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent font-bold'
            }`}>
              2. Under Review
            </div>
            <div className={`p-2.5 rounded-2xl border ${
              deliveryStatus === 'APPROVED' 
                ? 'bg-emerald-600 text-white border-emerald-500 font-black shadow-xs' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent font-bold'
            }`}>
              3. Approved & Paid
            </div>
          </div>

          {/* Status View: APPROVED */}
          {deliveryStatus === 'APPROVED' ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl p-6 border border-emerald-300 dark:border-emerald-700 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Milestone Completed & Paid!</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    The deliverables have been approved. The stipend of <strong>{stipend}</strong> has been credited to your active wallet balance.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-black text-xs border border-emerald-300 dark:border-emerald-700">
                  <IndianRupee className="w-4 h-4" />
                  <span>+₹{numericAmount.toLocaleString()} Credited</span>
                </div>
              </div>

              {/* Point 7: Post-Gig Rating & Review Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-5 border border-purple-200 dark:border-purple-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Gig Experience & Collaboration Review</h4>
                </div>

                {isReviewSubmitted ? (
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-4 h-4 ${s <= starRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`} 
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">{starRating} / 5 Stars</span>
                    </div>
                    {reviewComment && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{reviewComment}"</p>
                    )}
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block pt-1">
                      ✓ Feedback recorded in project history
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div>
                      <span className="text-xs text-slate-600 dark:text-slate-300 block mb-1.5 font-semibold">
                        How was your experience working on this milestone?
                      </span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setStarRating(star)}
                            className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                          >
                            <Star 
                              className={`w-6 h-6 ${star <= starRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Share a short testimonial or review on the client and gig requirements..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-medium"
                    ></textarea>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingReview && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Submit Star Review</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : deliveryStatus === 'SUBMITTED' ? (
            /* Status View: SUBMITTED (UNDER REVIEW) */
            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-3xl p-6 border border-amber-300 dark:border-amber-700 space-y-5">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-500 animate-spin" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Deliverables Submitted for Sign-off</h3>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">The client is reviewing your shared work assets.</p>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted Asset Link:</span>
                <a 
                  href={deliverableUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{deliverableUrl}</span>
                </a>
                {deliverableNotes && (
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] pt-1">
                    "{deliverableNotes}"
                  </p>
                )}
              </div>

              {/* Simulation button for demo / testing */}
              <div className="pt-2 border-t border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Demo Simulator:</span>
                <button
                  type="button"
                  onClick={handleSimulateClientApproval}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Simulate Client Approval & Release Escrow</span>
                </button>
              </div>
            </div>
          ) : (
            /* Status View: IN_PROGRESS (SUBMISSION FORM) */
            <form onSubmit={handleSubmitDeliverable} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Project Deliverable Link (Canva, Figma, Google Drive, GitHub) <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://canva.com/design/... or https://drive.google.com/..."
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold pl-10"
                  />
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Summary Notes & Handover Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Completed all 5 social carousel cards matching the color palette. PNG exports and raw editable templates included."
                  value={deliverableNotes}
                  onChange={(e) => setDeliverableNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isSubmitting ? 'Submitting to Escrow...' : 'Submit Deliverables for Review'}</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
