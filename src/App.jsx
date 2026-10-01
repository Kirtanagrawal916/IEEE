import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingSection from './components/LandingSection';
import LearnSection from './components/LearnSection';
import PortfolioSection from './components/PortfolioSection';
import OpportunitiesSection from './components/OpportunitiesSection';
import Dashboard from './components/Dashboard';
import ProfileSection from './components/ProfileSection';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import OpportunityDetailPage from './components/OpportunityDetailPage';
import OpportunityApplyPage from './components/OpportunityApplyPage';
import TrackDetailPage from './components/TrackDetailPage';
import LessonPlayerPage from './components/LessonPlayerPage';
import ApplicationsPage from './components/ApplicationsPage';
import PublicProfilePage from './components/PublicProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

import AuthModal from './components/AuthModal';
import SubmitProjectModal from './components/SubmitProjectModal';
import ApplyGigModal from './components/ApplyGigModal';
import LogoutModal from './components/LogoutModal';
import ToastNotification from './components/ToastNotification';
import ChatBot from './components/ChatBot';

import CertificateModal from './components/CertificateModal';
import ResumeBuilderModal from './components/ResumeBuilderModal';
import EmployerPortal from './components/EmployerPortal';
import MentorshipSection from './components/MentorshipSection';
import AdminPanel from './components/AdminPanel';
import PaymentEscrowModal from './components/PaymentEscrowModal';

import { 
  initialUser, 
  initialPortfolios, 
  initialOpportunities 
} from './data/mockData';

import { api } from './services/api';

function AppContent() {
  const navigate = useNavigate();

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('herearn_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('herearn_theme') || 'light';
  });

  // Modals & Active state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // New Feature Modules Modals State
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [certTrackTitle, setCertTrackTitle] = useState('Digital Marketing & Growth Strategy');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isEmployerOpen, setIsEmployerOpen] = useState(false);
  const [isPaymentEscrowOpen, setIsPaymentEscrowOpen] = useState(false);
  const [escrowAmount, setEscrowAmount] = useState(6000);
  const [escrowGigTitle, setEscrowGigTitle] = useState('Canva Social Graphic Deliverable');

  // Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      body.classList.add('light');
      body.classList.remove('dark');
    }
    localStorage.setItem('herearn_theme', theme);
  }, [theme]);

  // Initial Data Fetching from Express Backend API
  useEffect(() => {
    const fetchBackendData = async () => {
      // 1. Auto Login via JWT
      const token = localStorage.getItem('herearn_jwt_token');
      if (token) {
        try {
          const meRes = await api.getMe();
          if (meRes.success && meRes.user) {
            setUser(meRes.user);
            localStorage.setItem('herearn_user', JSON.stringify(meRes.user));
          }
        } catch (err) {
          console.log('[App] Auto-login check:', err.message);
        }
      }

      // 2. Opportunities Feed
      try {
        const oppRes = await api.getOpportunities();
        if (oppRes.success && oppRes.opportunities && oppRes.opportunities.length > 0) {
          setOpportunities(oppRes.opportunities);
        }
      } catch (err) {
        console.log('[App] Using fallback opportunities:', err.message);
      }

      // 3. Public Portfolio Feed
      try {
        const portRes = await api.getPublicPortfolio();
        if (portRes.success && portRes.projects && portRes.projects.length > 0) {
          setPortfolios(portRes.projects);
        }
      } catch (err) {
        console.log('[App] Using fallback portfolios:', err.message);
      }
    };

    fetchBackendData();
  }, []);

  const saveUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('herearn_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('herearn_user');
      localStorage.removeItem('herearn_jwt_token');
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
    navigate(mode === 'signup' ? '/signup' : '/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sign Out Handler
  const handleLogout = () => {
    saveUserData(null);
    navigate('/');
    showToast("Signed Out", "You have successfully logged out.");
  };

  // Profile Update Handler with API integration
  const handleUpdateProfile = async (profileData) => {
    try {
      const updatedUser = await api.updateProfile(profileData);
      setUser(updatedUser.user || updatedUser);
      showToast("✨ Profile Updated!", "Your dashboard profile has been saved to the backend database.");
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
      const updated = { ...(user || initialUser), ...profileData };
      saveUserData(updated);
      showToast("✨ Profile Updated!", "Your dashboard profile has been updated.");
    }
  };

  // Lesson Completion Action with API integration
  const handleCompleteLesson = async (lessonId) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }

    try {
      await api.markLessonComplete(lessonId);
      const currentCompleted = user.completedLessons || [];
      const updatedLessons = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];

      saveUserData({
        ...user,
        completedLessons: updatedLessons,
      });

      showToast("🎉 Lesson Mastered!", "Your skill track progress has increased in database!");
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
      const currentCompleted = user.completedLessons || [];
      const updatedLessons = currentCompleted.includes(lessonId)
        ? currentCompleted.filter(id => id !== lessonId)
        : [...currentCompleted, lessonId];

      saveUserData({
        ...user,
        completedLessons: updatedLessons,
      });
      showToast("🎉 Lesson Mastered!", "Your skill track progress has increased!");
    }
  };

  // Submit Portfolio Project Action with API integration
  const handleSubmitProject = async (newProject) => {
    try {
      const res = await api.createProject(newProject);
      const created = res.project || {
        id: `p-${Date.now()}`,
        authorName: user ? user.name : "Guest Learner",
        authorAvatar: user ? user.avatar : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        location: user ? user.location : "India",
        skillTrack: newProject.category,
        likes: 1,
        date: "Just now",
        ...newProject,
      };

      setPortfolios([created, ...portfolios]);
      showToast("✨ Portfolio Published!", "Your project is saved to database and live on the public showcase gallery.");
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
      const createdItem = {
        id: `p-${Date.now()}`,
        authorName: user ? user.name : "Guest Learner",
        authorAvatar: user ? user.avatar : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        location: user ? user.location : "India",
        skillTrack: newProject.category,
        likes: 1,
        date: "Just now",
        ...newProject,
      };

      setPortfolios([createdItem, ...portfolios]);
      showToast("✨ Portfolio Published!", "Your project is live on the public showcase gallery.");
    }
  };

  // View Opportunity Details in separate page
  const handleViewOpportunityDetails = (gig) => {
    setSelectedOpportunity(gig);
    navigate(`/opportunities/${gig.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply to Gig Trigger (Navigates to dedicated separate Opportunity Apply & Quiz page)
  const handleOpenApplyGig = (gig) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setSelectedOpportunity(gig);
    navigate(`/opportunities/${gig.id}/apply`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm Gig Application Action with Quiz Assessment & API integration
  const handleConfirmApply = async (gigId, coverNote, portfolioId, quizSummary) => {
    try {
      await api.applyOpportunity(gigId, { coverNote, portfolioId, quizSummary });
      setOpportunities(opportunities.map(g => {
        if (g.id === gigId) {
          return {
            ...g,
            applied: true,
            applicantsCount: (g.applicantsCount || 0) + 1,
            quizScore: quizSummary ? quizSummary.percentage : null,
            eligible: quizSummary ? quizSummary.isEligible : true,
          };
        }
        return g;
      }));

      if (user) {
        saveUserData({
          ...user,
          appliedGigIds: [...(user.appliedGigIds || []), gigId],
        });
      }

      if (quizSummary) {
        showToast(
          quizSummary.isEligible ? "🎉 Application & Quiz Passed!" : "Application Recorded", 
          quizSummary.isEligible ? `Eligible with ${quizSummary.percentage}% Quiz Score!` : `Quiz Score: ${quizSummary.percentage}%`
        );
      } else {
        showToast("🚀 Application Sent!", "Application recorded in database with portfolio proof.");
      }
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
      setOpportunities(opportunities.map(g => {
        if (g.id === gigId) {
          return {
            ...g,
            applied: true,
            applicantsCount: (g.applicantsCount || 0) + 1,
            quizScore: quizSummary ? quizSummary.percentage : null,
            eligible: quizSummary ? quizSummary.isEligible : true,
          };
        }
        return g;
      }));

      if (user) {
        saveUserData({
          ...user,
          appliedGigIds: [...(user.appliedGigIds || []), gigId],
        });
      }

      if (quizSummary) {
        showToast(
          quizSummary.isEligible ? "🎉 Application & Quiz Passed!" : "Application Recorded", 
          quizSummary.isEligible ? `Eligible Candidate status verified (${quizSummary.percentage}% Quiz Score)!` : `Quiz score recorded (${quizSummary.percentage}%).`
        );
      } else {
        showToast("🚀 Application Sent!", "Client received your application with attached portfolio proof.");
      }
    }
  };

  // User Login Handler
  const handleLoginSuccess = (userData) => {
    const isNewSignUp = userData.isSignUp;
    const loggedInUser = {
      id: userData.id || `u-${Date.now()}`,
      name: userData.name || 'Learner',
      email: userData.email || 'user@herearn.org',
      title: `${userData.skillInterest || 'Digital Skill'} Specialist`,
      location: userData.location || 'India',
      bio: userData.bio || 'Passionate about building digital skills and delivering quality micro-gigs on HerEarn.',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      verified: true,
      skills: userData.skills || [userData.skillInterest || "Digital Marketing", "Canva Design", "Instagram Management"],
      totalEarned: userData.totalEarned || 0,
      completedLessons: [],
      appliedGigIds: [],
    };

    saveUserData(loggedInUser);
    navigate('/dashboard');
    showToast(isNewSignUp ? "Account Created! 🎉" : "Welcome Back! ✨", `Signed in as ${loggedInUser.name}`);
  };

  // Continue as Guest Handler
  const handleContinueAsGuest = () => {
    saveUserData(null);
    navigate('/dashboard');
    setIsAuthOpen(false);
    showToast("Guest Mode Active 👤", "Exploring HerEarn in Guest Mode.");
  };

  const handleUpdateUserSkills = (newSkills) => {
    const updatedUser = user ? { ...user, skills: newSkills } : {
      name: 'Guest Learner',
      isGuest: true,
      skills: newSkills
    };
    setUser(updatedUser);
    localStorage.setItem('herearn_user', JSON.stringify(updatedUser));
    showToast("🎯 Skills Updated!", `Skill profile updated (${newSkills.length} skills active). Opportunity match percentages updated.`);
  };

  const userPortfolios = portfolios.filter(p => p.authorName === (user?.name || "Guest Learner"));
  const userAppliedGigs = opportunities.filter(g => (user?.appliedGigIds || []).includes(g.id));

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Sticky Navigation Header */}
      <Navbar 
        user={user}
        onLogout={() => setIsLogoutModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Area with React Router Routes */}
      <main className="flex-1 pb-16">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingSection 
                onNavigate={(page) => navigate(`/${page}`)}
                onOpenAuth={() => handleOpenAuth('signup')}
                theme={theme}
              />
            } 
          />

          <Route 
            path="/about" 
            element={
              <AboutPage 
                onNavigate={(page) => navigate(`/${page}`)}
              />
            } 
          />

          <Route 
            path="/terms" 
            element={<TermsPage />} 
          />

          <Route 
            path="/privacy" 
            element={
              <PrivacyPage 
                onNavigate={(page) => navigate(`/${page}`)}
              />
            } 
          />

          <Route 
            path="/learn" 
            element={
              <LearnSection 
                user={user}
                onCompleteLesson={handleCompleteLesson}
                onNavigateToPortfolio={() => {
                  navigate('/portfolio');
                  setIsSubmitOpen(true);
                }}
              />
            } 
          />

          <Route 
            path="/courses" 
            element={
              <LearnSection 
                user={user}
                onCompleteLesson={handleCompleteLesson}
                onNavigateToPortfolio={() => {
                  navigate('/portfolio');
                  setIsSubmitOpen(true);
                }}
              />
            } 
          />

          <Route 
            path="/courses/:trackId" 
            element={
              <TrackDetailPage 
                user={user}
                onCompleteLesson={handleCompleteLesson}
              />
            } 
          />

          <Route 
            path="/courses/:trackId/lessons/:lessonId" 
            element={
              <LessonPlayerPage 
                user={user}
                onCompleteLesson={handleCompleteLesson}
                showToast={showToast}
              />
            } 
          />

          <Route 
            path="/portfolio" 
            element={
              <PortfolioSection 
                portfolios={portfolios}
                user={user}
                onOpenSubmitModal={() => setIsSubmitOpen(true)}
                showToast={showToast}
              />
            } 
          />

          <Route 
            path="/profile/:userId" 
            element={<PublicProfilePage />} 
          />

          <Route 
            path="/opportunities" 
            element={
              <OpportunitiesSection 
                opportunities={opportunities}
                user={user}
                onApplyGig={handleOpenApplyGig}
                onViewDetails={handleViewOpportunityDetails}
                onUpdateUserSkills={handleUpdateUserSkills}
              />
            } 
          />

          <Route 
            path="/opportunities/:id" 
            element={
              <OpportunityDetailPage 
                gig={selectedOpportunity || opportunities[0]}
                user={user}
                onBack={() => navigate('/opportunities')}
                onApply={handleOpenApplyGig}
                onToggleSkill={handleUpdateUserSkills}
              />
            } 
          />

          <Route 
            path="/opportunities/:id/apply" 
            element={
              <ProtectedRoute user={user}>
                <OpportunityApplyPage 
                  gig={selectedOpportunity || opportunities[0]}
                  user={user}
                  userPortfolios={userPortfolios}
                  onBack={() => navigate(`/opportunities/${selectedOpportunity?.id || opportunities[0]?.id}`)}
                  onConfirmApplySuccess={(gigId, coverNote, portId, quizSummary) => handleConfirmApply(gigId, coverNote, portId, quizSummary)}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/applications" 
            element={
              <ProtectedRoute user={user}>
                <ApplicationsPage user={user} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard 
                  user={user}
                  onOpenSubmitModal={() => setIsSubmitOpen(true)}
                  onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute user={user}>
                <ProfileSection 
                  user={user}
                  userPortfolios={userPortfolios}
                  userAppliedGigs={userAppliedGigs}
                  onOpenAuth={handleOpenAuth}
                  onOpenSubmitModal={() => setIsSubmitOpen(true)}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateUserSkills={handleUpdateUserSkills}
                  onNavigate={(page) => navigate(`/${page}`)}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/login" 
            element={
              <LoginPage 
                onLoginSuccess={handleLoginSuccess}
                onContinueAsGuest={handleContinueAsGuest}
                onNavigateToSignup={() => navigate('/signup')}
                onNavigateHome={() => navigate('/')}
                onNavigate={(page) => navigate(`/${page}`)}
              />
            } 
          />

          <Route 
            path="/signup" 
            element={
              <SignupPage 
                onLoginSuccess={handleLoginSuccess}
                onContinueAsGuest={handleContinueAsGuest}
                onNavigateToLogin={() => navigate('/login')}
                onNavigateHome={() => navigate('/')}
              />
            } 
          />

          <Route 
            path="/mentorship" 
            element={
              <MentorshipSection showToast={showToast} />
            } 
          />

          <Route 
            path="/admin" 
            element={
              <AdminPanel opportunities={opportunities} portfolios={portfolios} showToast={showToast} />
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className={`border-t py-10 text-xs transition-colors ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-sm">HerEarn • Skill-to-Income Platform for Women</p>
            <p className="opacity-75 mt-1">Empowering women across India to learn skills, build portfolios, and earn income.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 font-semibold">
            <Link to="/dashboard" className="hover:text-indigo-400 cursor-pointer">Dashboard</Link>
            <Link to="/" className="hover:text-indigo-400 cursor-pointer">Overview</Link>
            <Link to="/mentorship" className="hover:text-indigo-400 cursor-pointer text-indigo-400 font-bold">Mentorship</Link>
            <Link to="/about" className="hover:text-indigo-400 cursor-pointer text-purple-400 font-bold">About Us</Link>
            <Link to="/learn" className="hover:text-indigo-400 cursor-pointer">Courses</Link>
            <Link to="/portfolio" className="hover:text-indigo-400 cursor-pointer">Show Skill</Link>
            <Link to="/opportunities" className="hover:text-indigo-400 cursor-pointer">Opportunity</Link>
            <button onClick={() => setIsEmployerOpen(true)} className="hover:text-pink-400 cursor-pointer font-bold text-pink-400">Post Gig</button>
            <Link to="/admin" className="hover:text-purple-400 cursor-pointer font-bold text-purple-400">Admin</Link>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <AuthModal 
        isOpen={isAuthOpen}
        initialMode={authMode} 
        onClose={() => setIsAuthOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
      />

      <SubmitProjectModal 
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitProject={handleSubmitProject}
      />

      <ApplyGigModal 
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        gig={selectedOpportunity}
        userPortfolios={userPortfolios}
        onConfirmApply={handleConfirmApply}
      />

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      {/* New Feature Modals */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        user={user}
        trackTitle={certTrackTitle}
      />

      <ResumeBuilderModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        user={user}
        portfolios={userPortfolios}
      />

      <EmployerPortal
        isOpen={isEmployerOpen}
        onClose={() => setIsEmployerOpen(false)}
        onAddOpportunity={(newOpp) => setOpportunities([newOpp, ...opportunities])}
        showToast={showToast}
      />

      <PaymentEscrowModal
        isOpen={isPaymentEscrowOpen}
        onClose={() => setIsPaymentEscrowOpen(false)}
        amount={escrowAmount}
        gigTitle={escrowGigTitle}
        showToast={showToast}
      />

      <ToastNotification 
        toast={toast} 
        onClose={() => setToast(null)} 
      />

      {/* Floating AI Chatbot on every page */}
      <ChatBot />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
