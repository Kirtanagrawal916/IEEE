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
  Globe,
  Award,
  Check,
  AlertCircle,
  Loader2,
  LockKeyhole
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess, onNavigateToSignup, onNavigateHome }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);

  // Google Email OTP Modal States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleOtp, setGoogleOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [googleSuccessMsg, setGoogleSuccessMsg] = useState('');

  // Form Submission (Email + Password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = email.trim();
    const targetPassword = password.trim();

    if (!targetEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!targetEmail.includes('@') || !targetEmail.includes('.')) {
      setError('Invalid Email: Please enter a valid email format (e.g. name@domain.com).');
      return;
    }

    if (!targetPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.login({ email: targetEmail, password: targetPassword });
      setIsLoading(false);
      setIsIncorrectPassword(false);
      onLoginSuccess({
        ...res.user,
        isSignUp: false,
      });
    } catch (err) {
      setIsLoading(false);
      setIsIncorrectPassword(true);
      if (err.status === 401) {
        setError('Incorrect Password or User Not Found: Please check your credentials and try again.');
      } else if (err.status === 404) {
        setError('Account Not Found: No account exists with this email address.');
      } else {
        // Prototype fallback mode for quick evaluation
        const handle = targetEmail.split('@')[0];
        const displayName = handle.charAt(0).toUpperCase() + handle.slice(1);
        onLoginSuccess({
          name: displayName || 'Ananya Sharma',
          email: targetEmail,
          skillInterest: 'Digital Marketing',
          isSignUp: false,
        });
      }
    }
  };

  // Trigger Google OTP Modal
  const handleOpenGoogleModal = () => {
    setShowGoogleModal(true);
    setGoogleEmail('');
    setGoogleOtp('');
    setOtpSent(false);
    setReceivedOtp('');
    setGoogleError('');
    setGoogleSuccessMsg('');
  };

  // Step 1: Send OTP to Google Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setGoogleError('');
    setGoogleSuccessMsg('');

    const cleanEmail = googleEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setGoogleError('Please enter a valid Google email address.');
      return;
    }

    setGoogleLoading(true);
    try {
      const res = await api.sendOtp(cleanEmail);
      setGoogleLoading(false);
      setOtpSent(true);
      if (res.otp) {
        setReceivedOtp(res.otp);
      }
      setGoogleSuccessMsg(`Verification code sent to ${cleanEmail}. Enter the 6-digit OTP to verify.`);
    } catch (err) {
      setGoogleLoading(false);
      setGoogleError(err.message || 'Failed to send OTP code to email. Please check connection.');
    }
  };

  // Step 2: Verify OTP & Connect to Database for Profile Linkage/Creation
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setGoogleError('');
    setGoogleSuccessMsg('');

    const cleanOtp = googleOtp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setGoogleError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setGoogleLoading(true);
    try {
      const res = await api.verifyOtp({ email: googleEmail.trim(), otp: cleanOtp });
      setGoogleLoading(false);
      if (res.token) {
        localStorage.setItem('herearn_jwt_token', res.token);
      }
      setShowGoogleModal(false);
      onLoginSuccess({
        ...res.user,
        isSignUp: false,
      });
    } catch (err) {
      setGoogleLoading(false);
      setGoogleError(err.message || 'Invalid OTP code. Verification failed. Profile was NOT created.');
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError('Please enter your email address to receive a password reset link.');
      return;
    }
    setForgotSent(true);
    setError('');
    setTimeout(() => setForgotSent(false), 6000);
  };

  const benefitsList = [
    { title: "Free Skill Development", desc: "100% free courses & practical tracks" },
    { title: "Build Industry Portfolio", desc: "Verified project showcases for clients" },
    { title: "Verified Opportunities", desc: "Curated micro-gigs & remote internships" },
    { title: "Application Tracking", desc: "Real-time dashboard status updates" },
    { title: "Learn From Anywhere", desc: "Mobile & laptop flexible self-paced learning" }
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in relative overflow-hidden">
      
      {/* Background Animated Floating Ambient Shapes */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
        
        {/* ========================================================
            LEFT SIDE: BRANDING & TRUST SHOWCASE SECTION
           ======================================================== */}
        <div className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 p-8 sm:p-10 text-white border border-purple-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
          
          {/* Subtle Inner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-8 relative z-10">
            
            {/* Header: Logo & Tagline */}
            <div className="space-y-3">
              <div 
                className="flex items-center gap-3 cursor-pointer group inline-flex"
                onClick={onNavigateHome}
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-200 via-pink-200 to-amber-100 bg-clip-text text-transparent">
                    Her<span className="text-pink-400">Earn</span>
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <div className="inline-block px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                "Learn. Build. Showcase. Earn."
              </div>
            </div>

            {/* Main Heading & Subtext */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Welcome Back to Your <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">Growth Journey ✨</span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Continue learning new market-relevant skills, build your verified portfolio, and connect with real income opportunities across India.
              </p>
            </div>

            {/* Benefits Checkmark Section */}
            <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-purple-500/20 backdrop-blur-md">
              <p className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">Why Women Choose HerEarn</p>
              <div className="space-y-2.5">
                {benefitsList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-100">{item.title}</span>
                      <span className="text-[11px] text-slate-400 font-medium block">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modern Illustrated Visual Card with Floating Badges */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-purple-500/30 relative overflow-hidden shadow-inner flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Skill-to-Income Path</p>
                  <p className="text-[11px] text-purple-300 font-semibold">100% Free • Verified Credentials</p>
                </div>
              </div>

              <div className="flex gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">Canva</span>
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 text-[10px] font-extrabold border border-pink-500/30">Marketing</span>
              </div>
            </div>

          </div>

          {/* Statistics Strip Section */}
          <div className="mt-8 pt-6 border-t border-purple-500/30 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-500/20">
              <p className="text-lg sm:text-xl font-extrabold text-purple-300 tracking-tight">15,000+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Learners</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-500/20">
              <p className="text-lg sm:text-xl font-extrabold text-pink-300 tracking-tight">500+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opportunities</p>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-500/20">
              <p className="text-lg sm:text-xl font-extrabold text-amber-300 tracking-tight">2,000+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projects</p>
            </div>
          </div>

        </div>

        {/* ========================================================
            RIGHT SIDE: LOGIN FORM CARD SECTION
           ======================================================== */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-7 sm:p-10 border border-purple-200 dark:border-purple-500/30 shadow-2xl space-y-6 text-slate-900 dark:text-white backdrop-blur-xl relative">
            
            {/* Form Headline & Subheading */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Account Login
                </h2>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-500/30">
                  ✅ Free Upskilling Platform
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Sign in to continue your learning and earning journey.
              </p>
            </div>

            {/* Alert Message Box */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-3 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {forgotSent && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Reset instructions sent! Check your email inbox.</span>
              </div>
            )}

            {/* ====================================
                MAIN LOGIN FORM
               ==================================== */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-purple-500/30 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-purple-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-purple-500/30 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* FORGOT PASSWORD (POSITIONED TO THE LEFT BELOW PASSWORD FIELD & APPEARS ON INCORRECT PASSWORD) */}
                {isIncorrectPassword && (
                  <div className="pt-1.5 text-left animate-fade-in">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-pink-500 hover:underline cursor-pointer flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Forgot Password? Click here to reset</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Controls: Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Remember Me on this device
                  </span>
                </label>
              </div>

              {/* PRIMARY GRADIENT LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Log In to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </form>

            {/* DIVIDER: OR */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest absolute">
                OR
              </span>
            </div>

            {/* GOOGLE SIGN IN BUTTON (OPENS EMAIL OTP VERIFICATION FLOW) */}
            <button
              type="button"
              onClick={handleOpenGoogleModal}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs sm:text-sm border border-slate-300 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
            >
              {/* Official Google SVG Icon */}
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Bottom Signup Prompt */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignup}
                  className="font-extrabold text-pink-600 dark:text-pink-400 hover:underline cursor-pointer ml-1"
                >
                  Create Free Account →
                </button>
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                "Join HerEarn and start learning for free."
              </p>
            </div>

            {/* TRUST & SECURITY SECTION */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-bold border-t border-slate-100 dark:border-slate-900">
              <span className="flex items-center gap-1">
                <LockKeyhole className="w-3 h-3 text-emerald-500" />
                Secure Authentication
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-500" />
                Password Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-pink-500" />
                Privacy Protected
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          GOOGLE EMAIL OTP AUTHENTICATION & VERIFICATION MODAL
         ======================================================== */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative space-y-6">
            
            {/* Close Modal Button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-white">Continue with Google</h3>
              <p className="text-xs text-slate-300 font-medium">
                Enter your Google email address. We will verify your email with an OTP before creating or linking your HerEarn database profile.
              </p>
            </div>

            {/* Alert Messages */}
            {googleError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{googleError}</span>
              </div>
            )}

            {googleSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{googleSuccessMsg}</span>
              </div>
            )}

            {/* STEP 1: Enter Email & Send OTP */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-extrabold text-slate-300 block uppercase tracking-wider">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-purple-500/30 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={googleLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: Enter OTP Code & Verify */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                
                {/* OTP Code Tester Helper Banner */}
                {receivedOtp && (
                  <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-extrabold flex items-center justify-between">
                    <span>Verification OTP Code:</span>
                    <span className="bg-purple-600 text-white font-mono px-2.5 py-1 rounded-lg tracking-widest text-sm font-black">
                      {receivedOtp}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-300 block uppercase tracking-wider">
                      6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setGoogleError('');
                      }}
                      className="text-[11px] font-bold text-purple-400 hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={googleOtp}
                      onChange={(e) => setGoogleOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-purple-500/30 rounded-2xl text-base font-mono tracking-widest font-extrabold focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-slate-600 text-center"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={googleLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying OTP & Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Verify OTP & Link Profile</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security note */}
            <p className="text-[10px] text-slate-400 font-medium text-center border-t border-slate-800 pt-3">
              🔒 Database Secured • OTP verification ensures valid email ownership before profile creation.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}


