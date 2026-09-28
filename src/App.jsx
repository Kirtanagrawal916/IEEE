import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingSection from './components/LandingSection';
import LearnSection from './components/LearnSection';
import PortfolioSection from './components/PortfolioSection';
import OpportunitiesSection from './components/OpportunitiesSection';
import ProfileSection from './components/ProfileSection';

import AuthModal from './components/AuthModal';
import SubmitProjectModal from './components/SubmitProjectModal';
import ApplyGigModal from './components/ApplyGigModal';
import ToastNotification from './components/ToastNotification';

import { 
  initialUser, 
  initialPortfolios, 
  initialOpportunities 
} from './data/mockData';

export default function App() {
  // Default to 'profile' (Dashboard) tab as requested
  const [activeTab, setActiveTab] = useState('profile');
  
  // Persisted user state - defaults to null if not logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('herearn_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [theme, setTheme] = useState('dark');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [activeGigToApply, setActiveGigToApply] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Persist user when updated
  const saveUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('herearn_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('herearn_user');
    }
  };

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // Sign Out Handler
  const handleLogout = () => {
    saveUserData(null);
    setActiveTab('profile'); // Keep on Dashboard in guest view
    showToast("Signed Out", "You have successfully logged out.");
  };

  // Profile Update Handler
  const handleUpdateProfile = (profileData) => {
    const updated = {
      ...(user || initialUser),
      ...profileData
    };
    saveUserData(updated);
    showToast("✨ Profile Updated!", "Your dashboard profile has been saved.");
  };

  // Lesson Completion Action
  const handleCompleteLesson = (lessonId) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    const currentCompleted = user.completedLessons || [];
    let updatedLessons;

    if (currentCompleted.includes(lessonId)) {
      updatedLessons = currentCompleted.filter(id => id !== lessonId);
      showToast("Lesson Updated", "Lesson marked as incomplete.");
    } else {
      updatedLessons = [...currentCompleted, lessonId];
      showToast("🎉 Lesson Mastered!", "Your skill track progress has increased!");
    }

    saveUserData({
      ...user,
      completedLessons: updatedLessons
    });
  };

  // Submit Portfolio Project Action
  const handleSubmitProject = (newProject) => {
    const createdItem = {
      id: `p-${Date.now()}`,
      authorName: user ? user.name : "Guest Learner",
      authorAvatar: user ? user.avatar : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
      location: user ? user.location : "India",
      skillTrack: newProject.category,
      likes: 1,
      date: "Just now",
      ...newProject
    };

    setPortfolios([createdItem, ...portfolios]);
    showToast("✨ Portfolio Published!", "Your project is live on the public showcase gallery.");
  };

  // Apply to Gig Trigger
  const handleOpenApplyGig = (gig) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setActiveGigToApply(gig);
    setIsApplyOpen(true);
  };

  // Confirm Gig Application Action
  const handleConfirmApply = (gigId, coverNote) => {
    setOpportunities(opportunities.map(g => {
      if (g.id === gigId) {
        return {
          ...g,
          applied: true,
          applicantsCount: g.applicantsCount + 1
        };
      }
      return g;
    }));

    if (user) {
      saveUserData({
        ...user,
        appliedGigIds: [...(user.appliedGigIds || []), gigId]
      });
    }

    showToast("🚀 Application Sent!", "Client received your application with attached portfolio proof.");
  };

  // User Login Handler
  const handleLoginSuccess = (userData) => {
    const isNewSignUp = userData.isSignUp;
    const loggedInUser = {
      id: `u-${Date.now()}`,
      name: userData.name || (isNewSignUp ? 'New Learner' : 'Ananya Sharma'),
      email: userData.email || 'user@example.com',
      title: `${userData.skillInterest || 'Digital Marketing'} Specialist`,
      location: 'Jaipur, Rajasthan',
      bio: 'Passionate about building digital skills and delivering quality micro-gigs.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      verified: true,
      skills: ["Digital Marketing", "Canva Design", "Instagram Ads"],
      earnings: isNewSignUp ? 0 : 12500,
      completedLessons: isNewSignUp ? [] : ["m1-l1", "m1-l2", "m1-l3"],
      appliedGigIds: isNewSignUp ? [] : ["g1"]
    };

    saveUserData(loggedInUser);
    setActiveTab('profile'); // Switch to Dashboard view
    showToast(isNewSignUp ? "Account Created! 🎉" : "Welcome Back! ✨", `Signed in as ${loggedInUser.name}`);
  };

  const userPortfolios = portfolios.filter(p => p.authorName === (user?.name || "Guest Learner"));
  const userAppliedGigs = opportunities.filter(g => (user?.appliedGigIds || []).includes(g.id));

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Sticky Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Area - Default Dashboard on visit */}
      <main className="flex-1 pb-16">
        {activeTab === 'profile' && (
          <ProfileSection 
            user={user}
            userPortfolios={userPortfolios}
            userAppliedGigs={userAppliedGigs}
            onOpenAuth={handleOpenAuth}
            onOpenSubmitModal={() => setIsSubmitOpen(true)}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'home' && (
          <LandingSection 
            onNavigate={setActiveTab}
            onOpenAuth={() => handleOpenAuth('signup')}
            theme={theme}
          />
        )}

        {activeTab === 'learn' && (
          <LearnSection 
            user={user}
            onCompleteLesson={handleCompleteLesson}
            onNavigateToPortfolio={() => {
              setActiveTab('portfolio');
              setIsSubmitOpen(true);
            }}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioSection 
            portfolios={portfolios}
            onOpenSubmitModal={() => setIsSubmitOpen(true)}
          />
        )}

        {activeTab === 'gigs' && (
          <OpportunitiesSection 
            opportunities={opportunities}
            onApplyGig={handleOpenApplyGig}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-10 text-xs transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-sm">HerEarn • Skill-to-Income Platform for Women</p>
            <p className="opacity-75 mt-1">Empowering women across India to learn skills, build portfolios, and earn income.</p>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <button onClick={() => setActiveTab('profile')} className="hover:text-indigo-500">Dashboard</button>
            <button onClick={() => setActiveTab('home')} className="hover:text-indigo-500">Overview</button>
            <button onClick={() => setActiveTab('learn')} className="hover:text-indigo-500">Learn Case</button>
            <button onClick={() => setActiveTab('portfolio')} className="hover:text-indigo-500">Show Skill</button>
            <button onClick={() => setActiveTab('gigs')} className="hover:text-indigo-500">Opportunity</button>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <AuthModal 
        isOpen={isAuthOpen}
        initialMode={authMode} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      <SubmitProjectModal 
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitProject={handleSubmitProject}
      />

      <ApplyGigModal 
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        gig={activeGigToApply}
        userPortfolios={userPortfolios}
        onConfirmApply={handleConfirmApply}
      />

      <ToastNotification 
        toast={toast} 
        onClose={() => setToast(null)} 
      />

    </div>
  );
}
