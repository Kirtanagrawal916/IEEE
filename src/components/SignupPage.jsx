import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import Logo from './Logo';
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
  Layers,
  Inbox,
  RefreshCw,
  ExternalLink,
  Shield
} from 'lucide-react';


export default function SignupPage({ onLoginSuccess, onNavigateToLogin, onNavigateHome, onContinueAsGuest }) {
  const { register: authRegister, resendConfirmationEmail } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [skillInterest, setSkillInterest] = useState('Digital Marketing');
  const [role, setRole] = useState('learner'); // 'learner' or 'client'
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email Confirmation State
  const [signupComplete, setSignupComplete] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatus, setResendStatus] = useState('');

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-suggest username when user types their name
  const handleNameChange = (val) => {
    setName(val);
    if (!username || username === name.toLowerCase().replace(/[^a-z0-9]/g, '_')) {
      setUsername(val.toLowerCase().replace(/[^a-z0-9]/g, '_'));
    }
  };

  const cleanUsername = (username.trim() || '').toLowerCase().replace(/^@/, '');
  const cleanEmail = email.trim().toLowerCase();

  // Load existing registry to check uniqueness live
  const registeredUsers = JSON.parse(localStorage.getItem('herearn_registered_users') || '[]');

  // Live Uniqueness & Availability Checks
  const isUsernameTaken = cleanUsername.length >= 3 && registeredUsers.some(u => u.username?.toLowerCase() === cleanUsername);
  const isUsernameAvailable = cleanUsername.length >= 3 && !isUsernameTaken;
  const isEmailTaken = cleanEmail.includes('@') && cleanEmail.includes('.') && registeredUsers.some(u => u.email?.toLowerCase() === cleanEmail);

  // Password Strength
  const passwordLength = password.length;
  let passwordStrength = 'weak';
  if (passwordLength >= 8) {
    passwordStrength = 'strong';
  } else if (passwordLength >= 6) {
    passwordStrength = 'good';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const displayName = name.trim() || (cleanEmail ? cleanEmail.split('@')[0] : 'Learner');
    const targetUsername = cleanUsername || displayName.toLowerCase().replace(/[^a-z0-9_]/g, '_') || 'learner';
    const targetEmail = cleanEmail;
    const targetPassword = password.trim();

    // 1. Password length validation
    if (targetPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // 2. Password matching check
    if (targetPassword !== confirmPassword.trim()) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    // 3. Username length check
    if (targetUsername.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    // 4. Unique Email enforcement
    if (isEmailTaken) {
      setError(`An account with the email "${targetEmail}" already exists. Please log in instead.`);
      return;
    }

    // 5. Unique Username enforcement
    if (isUsernameTaken) {
      setError(`The username "@${targetUsername}" is already taken by another user. Please choose a different handle.`);
      return;
    }

    setIsLoading(true);

    try {
      const res = await authRegister({
        name: displayName,
        username: targetUsername,
        email: targetEmail,
        password: targetPassword,
        skillInterest,
        role,
      });

      setIsLoading(false);

      if (res?.needsEmailConfirmation) {
        setSentEmail(targetEmail);
        setSignupComplete(true);
        // Do NOT store in active registeredUsers with password to prevent unverified login bypass
        return;
      }

      // Save to local registry only when auto-confirmed or already verified
      const updatedRegistry = registeredUsers.filter(u => u.email?.toLowerCase() !== targetEmail && u.username?.toLowerCase() !== targetUsername);
      const userRecord = {
        id: res?.user?.id || `u-${Date.now()}`,
        name: displayName,
        username: targetUsername,
        email: targetEmail,
        password: targetPassword,
        skills: [skillInterest],
        role,
        createdAt: new Date().toISOString()
      };
      updatedRegistry.push(userRecord);
      localStorage.setItem('herearn_registered_users', JSON.stringify(updatedRegistry));

      onLoginSuccess({
        ...(res?.user || {}),
        name: displayName,
        username: targetUsername,
        email: targetEmail,
        password: targetPassword,
        isSignUp: true,
        role,
      });
    } catch (err) {
      setIsLoading(false);
      // Gracefully handle network offline or "Failed to fetch" so learner signup is never blocked
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError') || err.status === 503) {
        const updatedRegistry = registeredUsers.filter(u => u.email?.toLowerCase() !== targetEmail && u.username?.toLowerCase() !== targetUsername);
        const fallbackUser = {
          id: `u-${Date.now()}`,
          name: displayName,
          username: targetUsername,
          email: targetEmail,
          password: targetPassword,
          role,
          skills: [skillInterest],
          skillPoints: 150,
          totalEarned: 0,
          walletBalance: 0,
          completedLessons: [],
          appliedGigIds: [],
          badges: [],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(targetUsername)}`,
          createdAt: new Date().toISOString()
        };
        updatedRegistry.push(fallbackUser);
        localStorage.setItem('herearn_registered_users', JSON.stringify(updatedRegistry));
        localStorage.setItem('herearn_user', JSON.stringify(fallbackUser));

        onLoginSuccess({
          ...fallbackUser,
          isSignUp: true,
        });
        return;
      }
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !sentEmail) return;
    try {
      setResendStatus('Sending verification email...');
      await resendConfirmationEmail(sentEmail);
      setResendCooldown(60);
      setResendStatus('Verification email re-sent! Please check your inbox.');
    } catch (err) {
      setResendStatus(err.message || 'Failed to resend confirmation email.');
    }
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
              className="cursor-pointer mb-8 group inline-flex items-center"
              onClick={onNavigateHome}
            >
              <Logo size="lg" />
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
          {signupComplete ? (
            <div className="py-6 px-2 text-center space-y-6 animate-fade-in my-auto">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-500/20">
                <Inbox className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  Action Required
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Confirm Your Email Address
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  We've sent a verification link to <strong className="text-purple-600 dark:text-purple-400">{sentEmail}</strong>. Please check your inbox and click the link to activate your HerEarn account.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-4 text-xs text-slate-700 dark:text-purple-200 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Clicking the link will automatically confirm your account and log you in.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>If you don't see the email, check your <strong>Spam</strong> or <strong>Promotions</strong> folder.</span>
                </div>
              </div>

              {resendStatus && (
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {resendStatus}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => window.open('https://mail.google.com', '_blank')}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Open Gmail</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendEmail}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-bold cursor-pointer"
                >
                  Already confirmed? Log in to your account →
                </button>
              </div>
            </div>
          ) : (
            <>
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
              
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Username <span className="text-purple-600 dark:text-purple-400 font-normal">(Login Handle)</span>
                  </label>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">@</span>
                    <input
                      type="text"
                      required
                      placeholder="ananya_sharma"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className={`w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-8 pr-4 py-3 rounded-xl border focus:outline-none font-mono font-semibold transition-colors ${
                        isUsernameTaken 
                          ? 'border-rose-500 focus:border-rose-500' 
                          : isUsernameAvailable 
                            ? 'border-emerald-500 focus:border-emerald-500' 
                            : 'border-slate-300 dark:border-slate-700 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  {cleanUsername.length > 0 && cleanUsername.length < 3 && (
                    <p className="text-[10px] text-amber-500 font-semibold mt-1">Username must be at least 3 characters</p>
                  )}
                  {isUsernameTaken && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                      <span>❌ @{cleanUsername} is already taken</span>
                    </p>
                  )}
                  {isUsernameAvailable && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <span>✓ @{cleanUsername} is available</span>
                    </p>
                  )}
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
                    className={`w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none transition-colors ${
                      isEmailTaken 
                        ? 'border-rose-500 focus:border-rose-500' 
                        : 'border-slate-300 dark:border-slate-700 focus:border-purple-500'
                    }`}
                  />
                </div>
                {isEmailTaken && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                    <span>❌ An account with this email already exists.</span>
                    <button 
                      type="button" 
                      onClick={onNavigateToLogin} 
                      className="underline text-purple-600 dark:text-purple-400 font-extrabold hover:text-purple-700 cursor-pointer ml-1"
                    >
                      Sign in instead
                    </button>
                  </p>
                )}
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
                  {passwordLength > 0 && (
                    <div className="flex items-center justify-between text-[10px] mt-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Strength:</span>
                      <span className={`font-bold ${
                        passwordStrength === 'strong' ? 'text-emerald-500' :
                        passwordStrength === 'good' ? 'text-amber-500' : 'text-rose-500'
                      }`}>
                        {passwordStrength === 'strong' ? '✓ Strong (8+ chars)' :
                         passwordStrength === 'good' ? 'Good (6+ chars)' : 'Too short (min 6 chars)'}
                      </span>
                    </div>
                  )}
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
                      className={`w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none ${
                        confirmPassword.length > 0 && password !== confirmPassword 
                          ? 'border-rose-500 focus:border-rose-500' 
                          : confirmPassword.length > 0 && password === confirmPassword
                            ? 'border-emerald-500 focus:border-emerald-500'
                            : 'border-slate-300 dark:border-slate-700 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  {confirmPassword.length > 0 && (
                    <p className={`text-[10px] font-bold mt-1 ${password === confirmPassword ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {password === confirmPassword ? '✓ Passwords match' : '❌ Passwords do not match'}
                    </p>
                  )}
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

            {/* DIVIDER: OR */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest absolute">
                OR
              </span>
            </div>

            {/* GOOGLE SIGN-UP OPTION */}
            <GoogleSignInButton
              text="Sign Up with Google"
              onSuccess={(user) => {
                onLoginSuccess({
                  ...user,
                  role,
                  skillInterest,
                  isSignUp: true,
                });
              }}
              onError={(msg) => {
                setError(msg);
              }}
              disabled={isLoading}
            />
          </div>

          {/* Switch to Login & Guest Account Access */}
          <div className="text-center pt-5 border-t border-slate-200 dark:border-slate-800 mt-5 space-y-4">
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

            {/* Administrator Portal Option */}
            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 flex items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Platform Staff / Admin?</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Passkey protected staff & governance portal</p>
                </div>
              </div>
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>Admin Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>


            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-3 px-4 rounded-xl border border-purple-300 dark:border-purple-500/30 bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-900 dark:text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Continue with Guest Account</span>
            </button>
          </div>
          </>
          )}

        </div>

      </div>
    </div>
  );
}
