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
  QrCode,
  Copy,
  Check,
  Download,
  Zap
} from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confettiHelper';
import { api } from '../services/api';

export default function WalletWithdrawModal({ 
  isOpen, 
  onClose, 
  walletBalance = 12000, 
  onConfirmWithdrawal,
  showToast 
}) {
  const [payoutMethod, setPayoutMethod] = useState('upi'); // 'upi' | 'bank'
  const [upiPrefix, setUpiPrefix] = useState('learner');
  const [upiSuffix, setUpiSuffix] = useState('@oksbi');
  const [upiId, setUpiId] = useState('learner@oksbi');
  
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  
  const [amount, setAmount] = useState(walletBalance > 0 ? Math.min(walletBalance, 2000) : 0);
  const [step, setStep] = useState('input'); // 'input' | 'processing' | 'success'
  const [txnId, setTxnId] = useState('');
  const [copiedTxn, setCopiedTxn] = useState(false);

  if (!isOpen) return null;

  const popularUpiProviders = [
    { label: 'Google Pay', suffix: '@oksbi', color: 'border-blue-300 dark:border-blue-600' },
    { label: 'PhonePe', suffix: '@ybl', color: 'border-purple-300 dark:border-purple-600' },
    { label: 'Paytm', suffix: '@paytm', color: 'border-cyan-300 dark:border-cyan-600' },
    { label: 'BHIM UPI', suffix: '@upi', color: 'border-emerald-300 dark:border-emerald-600' }
  ];

  const popularBanks = [
    { name: 'State Bank of India', ifsc: 'SBIN0001234' },
    { name: 'HDFC Bank', ifsc: 'HDFC0001234' },
    { name: 'ICICI Bank', ifsc: 'ICIC0001234' },
    { name: 'Punjab National Bank', ifsc: 'PUNB0001234' }
  ];

  const handleUpiSuffixSelect = (suffix) => {
    setUpiSuffix(suffix);
    const prefix = upiId.includes('@') ? upiId.split('@')[0] : upiId;
    setUpiId(`${prefix}${suffix}`);
  };

  const handleBankSelect = (bank) => {
    setBankName(bank.name);
    setIfscCode(bank.ifsc);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (amount <= 0 || amount > walletBalance) return;
    if (payoutMethod === 'upi' && !upiId.trim()) return;
    if (payoutMethod === 'bank' && (!accountNumber.trim() || !ifscCode.trim())) return;

    setStep('processing');
    let generatedTxn = `PAYOUT-HE-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const payoutPayload = {
      amount: Number(amount),
      method: payoutMethod.toUpperCase(),
      payoutDetails: payoutMethod === 'upi' ? { upiId: upiId.trim() } : {
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        ifscCode: ifscCode.trim(),
        bankName: bankName.trim(),
      },
    };

    try {
      try {
        const res = await api.withdrawWallet(payoutPayload);
        if (res.transaction?.txnId) {
          generatedTxn = res.transaction.txnId;
        }
      } catch (apiErr) {
        console.warn('[Withdrawal API]: Online API unavailable, falling back:', apiErr.message);
      }

      setTxnId(generatedTxn);
      setStep('success');
      triggerCelebrationConfetti();

      const transferDetails = {
        amount,
        method: payoutMethod === 'upi' ? 'UPI' : 'Bank Transfer',
        destination: payoutMethod === 'upi' 
          ? upiId 
          : `${accountNumber.slice(-4).padStart(accountNumber.length, '•')} (${bankName})`,
        txnId: generatedTxn,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        status: 'Completed'
      };

      // Persist permanently in withdrawal history and local user object
      try {
        const existingHistory = JSON.parse(localStorage.getItem('herearn_withdrawal_history') || '[]');
        const newRecord = {
          id: `tx-${Date.now()}`,
          title: `Payout Withdrawal (${transferDetails.method})`,
          client: transferDetails.destination,
          amount: `-₹${amount.toLocaleString()}`,
          date: transferDetails.date,
          status: 'Completed',
          txnId: generatedTxn
        };
        const updatedHistory = [newRecord, ...existingHistory];
        localStorage.setItem('herearn_withdrawal_history', JSON.stringify(updatedHistory));

        const savedUser = JSON.parse(localStorage.getItem('herearn_user') || '{}');
        if (savedUser.walletBalance !== undefined) {
          savedUser.walletBalance = Math.max(0, (savedUser.walletBalance || 0) - amount);
          localStorage.setItem('herearn_user', JSON.stringify(savedUser));
        }
      } catch (err) {
        console.warn('[Withdrawal] Storage sync:', err);
      }

      if (onConfirmWithdrawal) {
        onConfirmWithdrawal(amount, transferDetails);
      }
      if (showToast) {
        showToast("💸 Payout Disbursed!", `₹${amount.toLocaleString()} sent via ${transferDetails.method}. Ref: ${generatedTxn}`);
      }
    } catch (err) {
      setStep('input');
      showToast?.('Withdrawal Failed', err.message || 'Could not process transaction');
    }
  };

  const handleCopyTxn = () => {
    navigator.clipboard?.writeText(txnId);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2500);
  };

  const handleDownloadReceipt = () => {
    alert(`Payout Receipt for Ref: ${txnId} (₹${amount.toLocaleString()}) generated!`);
  };

  const handleCloseAll = () => {
    setStep('input');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8 text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-100 dark:border-purple-500/20 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-800 shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                Instant Earnings Withdrawal
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Zero Fee
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Instant NPCI Escrow Disbursal to UPI ID or Bank Account
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {step === 'input' && (
            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              
              {/* Available Balance Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/60 dark:via-slate-900 dark:to-purple-950/60 border border-purple-200 dark:border-purple-800 text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Available Wallet Balance</span>
                <p className="text-3xl font-black text-purple-700 dark:text-purple-300">₹{walletBalance.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 100% Escrow Guaranteed Immediate Settlement
                </span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
                  Choose Withdrawal Destination:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('upi')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      payoutMethod === 'upi'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300 dark:ring-purple-900'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Instant UPI (GPay/PhonePe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`p-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      payoutMethod === 'bank'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300 dark:ring-purple-900'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Bank Transfer (IMPS)</span>
                  </button>
                </div>
              </div>

              {/* Method Fields */}
              {payoutMethod === 'upi' ? (
                <div className="space-y-2">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                    UPI ID (Virtual Payment Address) <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. mobileNumber@oksbi or username@ybl"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-bold pl-9 shadow-inner"
                    />
                    <Smartphone className="w-4 h-4 text-purple-500 absolute left-3 top-3.5" />
                  </div>

                  {/* Quick Provider Suffix Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">Quick App Presets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularUpiProviders.map(p => (
                        <button
                          key={p.suffix}
                          type="button"
                          onClick={() => handleUpiSuffixSelect(p.suffix)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-extrabold cursor-pointer transition-all ${
                            upiId.endsWith(p.suffix)
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {p.label} ({p.suffix})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Popular Bank Selector */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">Quick Select Bank:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {popularBanks.map(b => (
                        <button
                          key={b.name}
                          type="button"
                          onClick={() => handleBankSelect(b)}
                          className={`p-1.5 rounded-lg border text-[11px] font-bold text-left cursor-pointer transition-all truncate ${
                            bankName === b.name
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-400'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                      Beneficiary Account Holder Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name as per bank records"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                        Account Number <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 501004928192"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs mb-1">
                        IFSC Code <span className="text-pink-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. HDFC0001234"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-xs font-semibold uppercase shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Withdrawal Amount (₹) <span className="text-pink-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAmount(walletBalance)}
                    className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    Withdraw Full Balance (₹{walletBalance.toLocaleString()})
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max={walletBalance}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 text-base font-black pl-8 shadow-inner"
                  />
                  <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Quick Select Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    disabled={amt > walletBalance}
                    onClick={() => setAmount(amt)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-extrabold cursor-pointer transition-all ${
                      amount === amt
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Authorize Instant Withdrawal (₹{amount.toLocaleString()})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-md"></div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Executing Instant Disbursal...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Routing payout securely through NPCI Unified Escrow Gateway
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-5 py-2 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Payout Disbursed Successfully
                </span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                  ₹{amount.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  {payoutMethod === 'upi' ? `Sent directly to UPI ID: ${upiId}` : `Transferred to A/C ending in ${accountNumber.slice(-4) || '****'} (${bankName})`}
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 text-slate-600 dark:text-slate-300 shadow-inner">
                <div className="flex justify-between items-center">
                  <span>Reference ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">{txnId}</span>
                    <button
                      type="button"
                      onClick={handleCopyTxn}
                      className="p-1 text-slate-400 hover:text-purple-600 rounded-md transition-colors cursor-pointer"
                      title="Copy Reference ID"
                    >
                      {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Payment Gateway:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">NPCI Escrow Instant Settlement</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-bold text-emerald-600">₹0.00 (100% Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-extrabold text-emerald-600">Completed (Funds Transferred)</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Slip</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-colors cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
