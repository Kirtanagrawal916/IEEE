import React, { useState } from 'react';
import { 
  X, 
  IndianRupee, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building, 
  Smartphone,
  Lock,
  Sparkles,
  CreditCard,
  QrCode
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';

export default function WalletWithdrawModal({ 
  isOpen, 
  onClose, 
  walletBalance = 12000, 
  onConfirmWithdrawal,
  showToast 
}) {
  const [payoutMethod, setPayoutMethod] = useState('upi'); // 'upi' | 'bank'
  const [upiId, setUpiId] = useState('learner.creatives@oksbi');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [amount, setAmount] = useState(walletBalance > 0 ? Math.min(walletBalance, 6000) : 0);
  const [step, setStep] = useState('input'); // 'input' | 'processing' | 'success'
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (amount <= 0 || amount > walletBalance) return;
    if (payoutMethod === 'upi' && !upiId.trim()) return;
    if (payoutMethod === 'bank' && (!accountNumber.trim() || !ifscCode.trim())) return;

    setStep('processing');
    const generatedTxn = `PAYOUT-HE-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTxnId(generatedTxn);

    setTimeout(() => {
      setStep('success');
      triggerCelebrationConfetti();
      const transferDetails = {
        amount,
        method: payoutMethod === 'upi' ? 'UPI' : 'Bank Transfer',
        destination: payoutMethod === 'upi' ? upiId : `${accountNumber.slice(-4).padStart(accountNumber.length, '•')} (${ifscCode.toUpperCase()})`,
        txnId: generatedTxn,
      };

      if (onConfirmWithdrawal) {
        onConfirmWithdrawal(amount, transferDetails);
      }
      if (showToast) {
        showToast("💸 Payout Disbursed!", `₹${amount.toLocaleString()} disbursed via ${transferDetails.method}. Ref: ${generatedTxn}`);
      }
    }, 1200);
  };

  const handleCloseAll = () => {
    setStep('input');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Earnings Payout & Withdrawal</h2>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Direct to UPI or Verified Bank Account</p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {step === 'input' && (
            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              
              {/* Available Balance Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-950/50 border border-purple-200 dark:border-purple-800 text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Available Wallet Balance</span>
                <p className="text-3xl font-black text-purple-700 dark:text-purple-300">₹{walletBalance.toLocaleString()}</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Guaranteed Disbursal
                </span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Select Payout Method:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('upi')}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      payoutMethod === 'upi'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Instant UPI ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      payoutMethod === 'bank'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Bank Account</span>
                  </button>
                </div>
              </div>

              {/* Method Fields */}
              {payoutMethod === 'upi' ? (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Virtual Payment Address (UPI ID) <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="yourname@okhdfcbank or yournumber@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold pl-9"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                      Beneficiary Account Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name as per Bank Records"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 501004928192"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. HDFC0001234"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Withdrawal Amount (₹)
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(walletBalance)}
                    className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Withdraw Full Balance
                  </button>
                </div>
                <input
                  type="number"
                  min="100"
                  max={walletBalance}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-extrabold"
                />
              </div>

              {/* Quick Select Chips */}
              <div className="flex items-center gap-2 pt-1">
                {[1000, 3000, 6000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    disabled={amt > walletBalance}
                    onClick={() => setAmount(amt)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-extrabold cursor-pointer transition-all ${
                      amount === amt
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-purple-50'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={amount <= 0 || amount > walletBalance}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Authorize Instant Withdrawal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold">Initiating Instant Disbursal...</h3>
                <p className="text-xs text-slate-500">Routing payout securely via NPCI Escrow gateway</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-5 py-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Payout Disbursed Successfully
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{amount.toLocaleString()} Disbursed
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {payoutMethod === 'upi' ? `Sent to UPI ID: ${upiId}` : `Transferred to A/C ending in ${accountNumber.slice(-4) || '****'}`}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-[11px] space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Reference ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-bold text-emerald-600">₹0.00 (Zero Fee)</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600">Completed (Immediate Settlement)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-colors cursor-pointer"
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
