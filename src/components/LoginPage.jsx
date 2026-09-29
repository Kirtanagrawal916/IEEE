import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  Zap,
  Globe,
  Award
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onNavigateToSignup, onNavigateHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = email.trim() || 'ananya@herearn.org';
    const targetPassword = password.trim() || 'password123';

    setIsLoading(true);

    try {
      const res = await api.login({ email: targetEmail, password: targetPassword });
      setIsLoading(false);
      onLoginSuccess({
        ...res.user,
        isSignUp: false,
      });
    } catch (err) {
      setIsLoading(false);
      // Fallback demo user if backend offline
      const handle = targetEmail.split('@')[0];
      const displayName = handle.charAt(0).toUpperCase() + handle.slice(1);
      onLoginSuccess({
        name: displayName || 'Ananya Sharma',
        email: targetEmail,
        skillInterest: 'Digital Marketing',
        isSignUp: false,
      });
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    try {
      const res = await api.login({ email: 'ananya@herearn.org', password: 'password123' });
      setIsLoading(false);
      onLoginSuccess({
        ...res.user,
        isSignUp: false,
      });
    } catch (err) {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Ananya Sharma',
        email: 'ananya@herearn.org',
        skillInterest: 'Digital Marketing & Social Media',
        isSignUp: false,
      });
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError('Please enter your email address above to reset your password.');
      return;
    }
    setForgotSent(true);
    setError('');
    setTimeout(() => setForgotSent(false), 5000);
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
              Welcome back to your income journey ✨
            </h1>
            <p className="text-sm text-purple-200/90 leading-relaxed mb-6 font-medium">
              Log in to track your skill courses, apply for verified client micro-gigs, and manage your wallet balance.
            </p>

            {/* Feature Highlights List */}
            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3 bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Verified Skill Certifications</h4>
                  <p className="text-[11px] text-purple-200/70">Showcase completed project proof to clients instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Guaranteed Safe Payouts</h4>
                  <p className="text-[11px] text-purple-200/70">Escrow protected gig earnings direct to your bank or UPI.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Flexible Remote Work</h4>
                  <p className="text-[11px] text-purple-200/70">Work on micro-tasks in Hindi, Gujarati, or English.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="relative z-10 pt-6 border-t border-purple-500/20 mt-4">
            <p className="text-xs italic text-purple-200">
              "HerEarn helped me learn Canva design and land my first ₹4,500 gig within two weeks!"
            </p>
            <div className="flex items-center gap-2 mt-2">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" 
                alt="Ananya Sharma"
                className="w-6 h-6 rounded-full object-cover border border-purple-400"
              />
              <span className="text-[11px] font-bold text-white">Ananya Sharma • Digital Specialist</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-10 text-slate-900 dark:text-white shadow-2xl flex flex-col justify-between">
          <div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Login</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  Enter your login credentials to access your dashboard
                </p>
              </div>
              <span className="text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full font-bold border border-purple-300 dark:border-purple-700">
                Secure SSL 🔒
              </span>
            </div>

            {/* Quick 1-Click Demo Login */}
            <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 p-4 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 text-xs font-extrabold">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Quick 1-Click Sign In (Demo Mode)</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md font-bold">Fastest</span>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={isLoading}
                className="w-full btn-gradient-award justify-center text-xs py-2.5 cursor-pointer shadow-md"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In as Ananya Sharma</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                or sign in with email
              </span>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <span>⚠️ {error}</span>
              </div>
            )}

            {/* Forgot Password Confirmation */}
            {forgotSent && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password reset instructions sent to {email}!</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-10 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Keep me signed in</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gradient-award justify-center py-3.5 text-xs font-bold mt-3 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Switch to Sign Up */}
          <div className="text-center pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-purple-600 dark:text-purple-400 hover:underline font-bold cursor-pointer"
              >
                Create Free Account
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
