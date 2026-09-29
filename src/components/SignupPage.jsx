import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Briefcase, 
  Zap,
  Star,
  Layers
} from 'lucide-react';

export default function SignupPage({ onLoginSuccess, onNavigateToLogin, onNavigateHome }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [skillInterest, setSkillInterest] = useState('Digital Marketing');
  const [role, setRole] = useState('learner'); // 'learner' or 'client'
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const displayName = name.trim();
    const cleanEmail = email.trim();

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: displayName,
        email: cleanEmail,
        skillInterest,
        isSignUp: true,
        role
      });
    }, 200);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Branding Showcase Column */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-purple-900/90 via-slate-900 to-pink-950/80 p-8 text-white border border-purple-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative Background Accents */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-pink-600/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            {/* Logo Header */}
            <div 
              className="flex items-center gap-3 cursor-pointer mb-8 group"
              onClick={onNavigateHome}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                Her<span className="text-pink-400">Earn</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 text-white">
              Start your journey to financial freedom 🚀
            </h1>
            <p className="text-sm text-purple-200/90 leading-relaxed mb-6 font-medium">
              Join thousands of women learning market-ready digital skills and earning verified income online.
            </p>

            {/* Quick Benefits Checklist */}
            <div className="space-y-3.5 my-6">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-purple-100">100% Free Interactive Courses</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-purple-100">Micro-Gigs Tailored for Beginners</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-purple-100">Direct Portfolio Showcase & Ratings</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-purple-100">Supportive Regional Community</span>
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-3 bg-purple-950/60 p-4 rounded-2xl border border-purple-500/30 mt-6">
              <div>
                <p className="text-xl font-extrabold text-amber-400">₹12.5L+</p>
                <p className="text-[10px] text-purple-200 uppercase tracking-wider font-semibold">Earned by Members</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-pink-400">4.9 ★</p>
                <p className="text-[10px] text-purple-200 uppercase tracking-wider font-semibold">Learner Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="relative z-10 pt-6 border-t border-purple-500/20 mt-6">
            <p className="text-[11px] text-purple-300 flex items-center gap-1.5 font-medium">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>No credit card required. Free forever for learners.</span>
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-10 text-slate-900 dark:text-white shadow-2xl flex flex-col justify-between">
          <div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Fill in your details to get instant access to courses & gigs
                </p>
              </div>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-300 dark:border-emerald-700">
                Free Sign Up 🎉
              </span>
            </div>

            {/* Role Selection Toggle */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">I want to:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('learner')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'learner'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Learn & Earn Gigs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'client'
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Hire Women Talent</span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold animate-fade-in">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Passwords (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Target Skill Track */}
              {role === 'learner' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Skill Track</label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={skillInterest}
                      onChange={(e) => setSkillInterest(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Digital Marketing">Digital Marketing & Social Media</option>
                      <option value="Graphic Design">Graphic Design & Canva</option>
                      <option value="E-Commerce">E-Commerce & Shopify Management</option>
                      <option value="Content Writing">Content Writing & Translation</option>
                      <option value="Data Entry">Virtual Assistant & Data Management</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded mt-0.5 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                    I agree to the <span className="text-purple-600 dark:text-purple-400 font-bold hover:underline">Terms of Service</span> and <span className="text-purple-600 dark:text-purple-400 font-bold hover:underline">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gradient-award justify-center py-3.5 text-xs font-bold mt-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Switch to Login */}
          <div className="text-center pt-5 border-t border-slate-200 dark:border-slate-800 mt-5">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-purple-600 dark:text-purple-400 hover:underline font-bold cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
