import React, { useState, useEffect } from 'react';
import { X, Sparkles, Lock, Mail, User } from 'lucide-react';

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [skillInterest, setSkillInterest] = useState('Digital Marketing');

  useEffect(() => {
    if (isOpen) {
      setIsSignUp(initialMode === 'signup');
      setEmail('');
      setName('');
      setPassword('');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    let displayName = name.trim();
    if (!displayName) {
      if (email.trim()) {
        const handle = email.split('@')[0];
        displayName = handle.charAt(0).toUpperCase() + handle.slice(1);
      } else {
        displayName = isSignUp ? 'New Learner' : 'Learner';
      }
    }

    onLoginSuccess({
      name: displayName,
      email: email || 'user@herearn.org',
      skillInterest,
      isSignUp
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-900 dark:text-white">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl max-w-md w-full p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white mx-auto shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSignUp ? 'Create Free Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {isSignUp 
              ? 'Join HerEarn to start learning market skills & earning income' 
              : 'Sign in to access your learning tracks & micro-gig applications'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
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
          )}

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

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Skill Track</label>
              <select
                value={skillInterest}
                onChange={(e) => setSkillInterest(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              >
                <option value="Digital Marketing">Digital Marketing & Social Media</option>
                <option value="Graphic Design">Graphic Design & Canva</option>
                <option value="E-Commerce">E-Commerce & Shopify Management</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-gradient-award justify-center py-3 text-xs font-bold mt-2 cursor-pointer"
          >
            {isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>

        {/* Toggle sign up / sign in */}
        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-purple-700 dark:text-purple-400 hover:underline font-bold cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
}
