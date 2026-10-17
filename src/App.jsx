import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
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
import ChallengeDetailPage from './components/ChallengeDetailPage';
import SubmitProjectPage from './components/SubmitProjectPage';
import PortfolioDetailPage from './components/PortfolioDetailPage';
import PostGigPage from './components/PostGigPage';
import RecruiterDashboard from './components/RecruiterDashboard';

import LogoutModal from './components/LogoutModal';
import ToastNotification from './components/ToastNotification';
import ChatBot from './components/ChatBot';
import MentorshipSection from './components/MentorshipSection';
import CommunitySection from './components/CommunitySection';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';
import OpportunityNotificationBar from './components/OpportunityNotificationBar';

import { 
  initialUser, 
  initialPortfolios, 
  initialOpportunities 
} from './data/mockData';

import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { 
  getMatchingTrackForOpportunity, 
  isTrackUnlocked, 
  getUnlockedTrackIds 
} from './utils/trackLockHelper';

// Route wrappers that resolve the target opportunity by :id param dynamically
function OpportunityDetailRouteWrapper({ opportunities, selectedOpportunity, user, onBack, onApply, onToggleSkill }) {
  const { id } = useParams();
  const gig = opportunities.find(o => String(o.id) === String(id)) || selectedOpportunity || opportunities[0];
  return (
    <OpportunityDetailPage 
      gig={gig}
      user={user}
      onBack={onBack}
      onApply={onApply}
      onToggleSkill={onToggleSkill}
    />
  );
}

function OpportunityApplyRouteWrapper({ opportunities, selectedOpportunity, user, userPortfolios, onConfirmApplySuccess }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const gig = opportunities.find(o => String(o.id) === String(id)) || selectedOpportunity || opportunities[0];
  return (
    <OpportunityApplyPage 
      gig={gig}
      user={user}
      userPortfolios={userPortfolios}
      onBack={() => navigate(`/opportunities/${gig?.id || ''}`)}
      onConfirmApplySuccess={onConfirmApplySuccess}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/' || location.pathname === '/home' || location.pathname === '/landing' || location.pathname === '/about';

  // Unified Auth state via AuthContext
  const { user, setUser, logout: authLogout } = useAuth();

  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('herearn_theme') || 'light';
  });

  // Modals & Navigation state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  // Derive user applied gigs and portfolios to ensure all records appear in the profile
  const appliedGigIds = Array.from(new Set([
    ...(user?.appliedGigIds || []),
    ...(JSON.parse(localStorage.getItem('herearn_applied_gigs') || '[]'))
  ]));

  const userAppliedGigs = appliedGigIds.map(id => {
    const found = opportunities.find(o => o.id === id);
    if (found) return found;
    return {
      id,
      title: "Micro-Gig Application",
      company: "HerEarn Partner",
      category: "Freelance Opportunity",
      stipend: "₹5,000",
      status: "Applied",
      deadline: "Active"
    };
  });

  const userPortfolios = portfolios.filter(p => 
    !user || p.authorName === user.name || p.userId === user.id || p.authorUsername === user.username
  );

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

  // Initial Data Fetching from Express Backend API (Parallel, Non-blocking)
  useEffect(() => {
    const fetchBackendData = async () => {
      const token = localStorage.getItem('herearn_jwt_token');
      
      const promises = [
        // 1. Auto Login via JWT (if token exists)
        token ? api.getMe().then(meRes => {
          if (meRes.success && meRes.user) {
            setUser(meRes.user);
            localStorage.setItem('herearn_user', JSON.stringify(meRes.user));
          }
        }).catch(err => console.log('[App] Auto-login notice:', err.message)) : Promise.resolve(),

        // 2. Opportunities Feed
        api.getOpportunities().then(oppRes => {
          if (oppRes.success && oppRes.opportunities && oppRes.opportunities.length > 0) {
            setOpportunities(oppRes.opportunities);
          }
        }).catch(err => console.log('[App] Using fallback opportunities:', err.message)),

        // 3. Public Portfolio Feed
        api.getPublicPortfolio().then(portRes => {
          if (portRes.success && portRes.projects && portRes.projects.length > 0) {
            setPortfolios(portRes.projects);
          }
        }).catch(err => console.log('[App] Using fallback portfolios:', err.message))
      ];

      await Promise.allSettled(promises);
    };

    fetchBackendData();
  }, []);

  const saveUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('herearn_user', JSON.stringify(userData));
      // Asynchronously synchronize with backend database if logged in
      const token = localStorage.getItem('herearn_jwt_token');
      if (token && !userData.isGuest) {
        api.updateProfile({
          name: userData.name,
          username: userData.username,
          location: userData.location,
          bio: userData.bio,
          title: userData.title,
          avatar: userData.avatar,
          skills: userData.skills,
          skillPoints: userData.skillPoints,
          earnings: userData.earnings,
          totalEarned: userData.totalEarned,
          walletBalance: userData.walletBalance,
          completedLessons: userData.completedLessons,
          appliedGigIds: userData.appliedGigIds,
          badges: userData.badges,
        }).catch(err => {
          console.warn('[App] Background profile sync notice:', err?.message);
        });
      }
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
  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      if (authLogout) {
        await authLogout();
      } else {
        await api.logout();
      }
    } catch {
      // Ignore network errors
    }
    saveUserData(null);
    navigate('/');
    showToast("Signed Out 👋", "You have successfully logged out of HerEarn.");
  };

  // Profile Update Handler with API integration
  const handleUpdateProfile = async (profileData) => {
    try {
      const updatedUser = await api.updateProfile(profileData);
      const finalUser = updatedUser.user || updatedUser;
      setUser(finalUser);
      localStorage.setItem('herearn_user', JSON.stringify(finalUser));
      showToast("✨ Profile Updated!", "Your dashboard profile has been saved to the database.");
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
      const updated = { ...(user || initialUser), ...profileData };
      saveUserData(updated);
      showToast("✨ Profile Updated!", "Your dashboard profile has been updated.");
    }
  };

  // Lesson Completion Action with API integration
  const handleCompleteLesson = async (lessonId) => {
    const currentUser = user || JSON.parse(localStorage.getItem('herearn_user') || 'null') || initialUser;
    const currentCompleted = currentUser.completedLessons || [];
    const updatedLessons = currentCompleted.includes(lessonId)
      ? currentCompleted.filter(id => id !== lessonId)
      : [...currentCompleted, lessonId];

    const updatedUser = {
      ...currentUser,
      completedLessons: updatedLessons,
    };

    saveUserData(updatedUser);

    try {
      if (user && !user.isGuest) {
        await api.markLessonComplete(lessonId);
      }
    } catch (error) {
      console.warn('[App] Operation fallback:', error?.message);
    }

    showToast("🎉 Lesson Mastered!", "Your skill track progress has been recorded in your profile!");
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

  // Confirm Gig Application Action with Quiz Assessment & Course Track Unlock
  const handleConfirmApply = async (gigId, coverNote, portfolioId, quizSummary) => {
    // 1. Find matching gig and course track
    const targetGig = opportunities.find(g => g.id === gigId) || initialOpportunities.find(g => g.id === gigId);
    const matchingTrack = getMatchingTrackForOpportunity(targetGig);

    // 2. Compute updated unlocked tracks and applied gigs
    const currentUnlocked = getUnlockedTrackIds(user);
    const updatedUnlocked = Array.from(new Set([...currentUnlocked, matchingTrack.id]));
    const currentApplied = user?.appliedGigIds || [];
    const updatedApplied = Array.from(new Set([...currentApplied, gigId]));

    // Store in localStorage for permanent persistence
    try {
      localStorage.setItem('herearn_unlocked_tracks', JSON.stringify(updatedUnlocked));
      localStorage.setItem('herearn_applied_gigs', JSON.stringify(updatedApplied));
    } catch (e) {
      console.warn('[App] LocalStorage sync warning:', e);
    }

    try {
      await api.applyOpportunity(gigId, { coverNote, portfolioId, quizSummary });
      // Also try to enroll track on backend
      api.enrollTrack(matchingTrack.id).catch(() => {});

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

      const updatedUser = {
        ...(user || initialUser || { id: 'guest', name: 'Learner' }),
        appliedGigIds: updatedApplied,
        unlockedTrackIds: updatedUnlocked,
      };
      saveUserData(updatedUser);

      // Show celebration toast for unlocking the course lectures
      showToast(
        "🎉 Course Lectures Unlocked!", 
        `"${matchingTrack.title}" is now permanently unlocked in your profile and courses! You can start learning the lectures now.`
      );
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

      const updatedUser = {
        ...(user || initialUser || { id: 'guest', name: 'Learner' }),
        appliedGigIds: updatedApplied,
        unlockedTrackIds: updatedUnlocked,
      };
      saveUserData(updatedUser);

      showToast(
        "🎉 Course Lectures Unlocked!", 
        `"${matchingTrack.title}" is now permanently unlocked in your profile and courses! You can start learning the lectures now.`
      );
    }
  };

  // User Login Handler (Stores username & preserves persistent user account details)
  const handleLoginSuccess = (userData) => {
    const isNewSignUp = userData.isSignUp;
    const existingSaved = JSON.parse(localStorage.getItem('herearn_user') || 'null');
    const isSameUser = existingSaved && (
      existingSaved.id === userData.id ||
      existingSaved.email?.toLowerCase() === userData.email?.toLowerCase() ||
      existingSaved.username?.toLowerCase() === userData.username?.toLowerCase()
    );

    const rawUsername = (userData.username || (userData.name ? userData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : userData.email?.split('@')[0]) || 'learner').replace(/^@/, '');
    const displayName = userData.name || (rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1));

    const loggedInUser = {
      id: userData.id || (isSameUser ? existingSaved.id : `u-${Date.now()}`),
      name: displayName,
      username: rawUsername,
      email: userData.email || `${rawUsername}@herearn.org`,
      role: (userData.role || (isSameUser ? existingSaved.role : 'LEARNER')).toUpperCase(),
      title: userData.title || (isSameUser ? existingSaved.title : `${userData.skillInterest || 'Digital Skill'} Specialist`),
      location: userData.location || (isSameUser ? existingSaved.location : 'India'),
      bio: userData.bio || (isSameUser ? existingSaved.bio : 'Passionate about building digital skills and delivering quality micro-gigs on HerEarn.'),
      avatar: userData.avatar || (isSameUser ? existingSaved.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rawUsername)}`),
      verified: true,
      skills: userData.skills || (isSameUser ? existingSaved.skills : [userData.skillInterest || "Digital Marketing", "Canva Design", "Instagram Management"]),
      totalEarned: userData.totalEarned !== undefined ? userData.totalEarned : (isSameUser ? existingSaved.totalEarned : (userData.earnings || 0)),
      earnings: userData.earnings !== undefined ? userData.earnings : (isSameUser ? existingSaved.earnings : (userData.totalEarned || 0)),
      walletBalance: userData.walletBalance !== undefined ? userData.walletBalance : (isSameUser ? existingSaved.walletBalance : (userData.totalEarned || 0)),
      completedLessons: userData.completedLessons || (isSameUser ? existingSaved.completedLessons : []),
      appliedGigIds: userData.appliedGigIds || (isSameUser ? existingSaved.appliedGigIds : []),
      skillPoints: userData.skillPoints !== undefined ? userData.skillPoints : (isSameUser ? existingSaved.skillPoints : 150),
      badges: userData.badges || (isSameUser ? existingSaved.badges : []),
    };

    saveUserData(loggedInUser);

    // Save/update in registered user registry for fast, permanent lookup by username
    try {
      const regUsers = JSON.parse(localStorage.getItem('herearn_registered_users') || '[]');
      const filtered = regUsers.filter(u => u.email?.toLowerCase() !== loggedInUser.email?.toLowerCase() && u.username?.toLowerCase() !== rawUsername.toLowerCase());
      const existingInReg = regUsers.find(u => u.email?.toLowerCase() === loggedInUser.email?.toLowerCase() || u.username?.toLowerCase() === rawUsername.toLowerCase());
      filtered.push({
        id: loggedInUser.id,
        name: loggedInUser.name,
        username: loggedInUser.username,
        email: loggedInUser.email,
        password: userData.password || existingInReg?.password,
        skills: loggedInUser.skills,
        skillPoints: loggedInUser.skillPoints,
        earnings: loggedInUser.earnings,
        totalEarned: loggedInUser.totalEarned,
        walletBalance: loggedInUser.walletBalance,
        completedLessons: loggedInUser.completedLessons,
        appliedGigIds: loggedInUser.appliedGigIds,
        badges: loggedInUser.badges,
      });
      localStorage.setItem('herearn_registered_users', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Could not sync registry:', e);
    }

    const searchParams = new URLSearchParams(window.location.search);
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      navigate(redirectUrl);
      } else if (loggedInUser.role === 'ADMIN') {
    navigate('/admin');
  } else if (loggedInUser.role === 'EMPLOYER') {
    navigate('/recruiter');
  } else {
    navigate('/dashboard');
  }
    showToast(isNewSignUp ? "Account Created! 🎉" : "Welcome Back! ✨", `Signed in as ${loggedInUser.name} (@${loggedInUser.username})`);
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

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0F0918] text-[#F9FAFB]' : 'bg-[#FFF9F5] text-[#1F2937]'
    }`}>
      
      {/* Sticky Navigation Header & Opportunity Alert Bar */}
      {!isAdminRoute && (
        <>
          {!isHomePage && (
            <OpportunityNotificationBar opportunities={opportunities} />
          )}
          <Navbar 
            user={user}
            onLogout={() => setIsLogoutModalOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onUpdateUser={saveUserData}
            showToast={showToast}
          />
        </>
      )}

      {/* Main View Area with React Router Routes */}
      <main className={`flex-1 ${isAdminRoute ? 'pb-0' : 'pb-16'}`}>
        <Routes>
          {/* Default Opening Page is AboutPage */}
          <Route 
            path="/" 
            element={
              <AboutPage 
                onNavigate={(page) => navigate(`/${page}`)}
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
            path="/home" 
            element={
              <LandingSection 
                onNavigate={(page) => navigate(`/${page}`)}
                onOpenAuth={() => handleOpenAuth('signup')}
                theme={theme}
              />
            } 
          />

          <Route 
            path="/landing" 
            element={
              <LandingSection 
                onNavigate={(page) => navigate(`/${page}`)}
                onOpenAuth={() => handleOpenAuth('signup')}
                theme={theme}
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
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: points,
                      badges: badge ? [...new Set([...(user.badges || []), badge])] : (user.badges || [])
                    });
                  }
                }}
                showToast={showToast}
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
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: points,
                      badges: badge ? [...new Set([...(user.badges || []), badge])] : (user.badges || [])
                    });
                  }
                }}
                showToast={showToast}
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
                onOpenSubmitModal={() => navigate('/portfolio/submit')}
                showToast={showToast}
              />
            } 
          />

          {/* Dedicated Full Page Challenge Routes (No Blur/Overlay) */}
          <Route 
            path="/challenges/:challengeId" 
            element={
              <ChallengeDetailPage 
                user={user} 
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: (user.skillPoints || 0) + points,
                      badges: [...(user.badges || []), badge]
                    });
                  }
                }}
                showToast={showToast} 
              />
            } 
          />
          <Route 
            path="/challenge/:challengeId" 
            element={
              <ChallengeDetailPage 
                user={user} 
                onUpdateUserSkillPoints={(points, badge) => {
                  if (user) {
                    saveUserData({
                      ...user,
                      skillPoints: (user.skillPoints || 0) + points,
                      badges: [...(user.badges || []), badge]
                    });
                  }
                }}
                showToast={showToast} 
              />
            } 
          />

          {/* Dedicated Full Page Submit Project Routes */}
          <Route 
            path="/portfolio/submit" 
            element={
              <SubmitProjectPage 
                user={user} 
                onSubmitProject={handleSubmitProject} 
                showToast={showToast} 
              />
            } 
          />
          <Route 
            path="/submit-project" 
            element={
              <SubmitProjectPage 
                user={user} 
                onSubmitProject={handleSubmitProject} 
                showToast={showToast} 
              />
            } 
          />

          {/* Dedicated Full Page Portfolio Detail View Route */}
          <Route 
            path="/portfolio/:id" 
            element={
              <PortfolioDetailPage 
                portfolios={portfolios} 
                user={user} 
                showToast={showToast} 
              />
            } 
          />

          {/* Dedicated Full Page Post Gig Routes */}
          <Route 
            path="/post-gig" 
            element={
              <PostGigPage 
                onAddOpportunity={(newOpp) => setOpportunities([newOpp, ...opportunities])} 
                showToast={showToast} 
              />
            } 
          />
          <Route 
            path="/opportunities/post" 
            element={
              <PostGigPage 
                onAddOpportunity={(newOpp) => setOpportunities([newOpp, ...opportunities])} 
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
              <OpportunityDetailRouteWrapper 
                opportunities={opportunities}
                selectedOpportunity={selectedOpportunity}
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
                <OpportunityApplyRouteWrapper 
                  opportunities={opportunities}
                  selectedOpportunity={selectedOpportunity}
                  user={user}
                  userPortfolios={userPortfolios}
                  onConfirmApplySuccess={(gigId, coverNote, portId, quizSummary) => handleConfirmApply(gigId, coverNote, portId, quizSummary)}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/applications" 
            element={
              <ProtectedRoute user={user}>
                <ApplicationsPage 
                  user={user} 
                  onUpdateWallet={(updated) => saveUserData(updated)}
                  showToast={showToast}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard 
                  user={user}
                  onOpenSubmitModal={() => navigate('/portfolio/submit')}
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
                  onOpenSubmitModal={() => navigate('/portfolio/submit')}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateUserSkills={handleUpdateUserSkills}
                  onNavigate={(page) => navigate(`/${page}`)}
                  showToast={showToast}
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
            path="/community" 
            element={
              <CommunitySection 
                user={user} 
                showToast={showToast} 
              />
            } 
          />

          <Route
  path="/recruiter/*"
  element={
    <ProtectedRoute user={user}>
      <RecruiterDashboard user={user} showToast={showToast} />
    </ProtectedRoute>
  }
/>

          <Route 
            path="/admin" 
            element={
              <AdminPanel 
                user={user}
                onLoginSuccess={handleLoginSuccess}
                opportunities={opportunities} 
                portfolios={portfolios} 
                setOpportunities={setOpportunities}
                setPortfolios={setPortfolios}
                showToast={showToast} 
              />
            } 
          />
        </Routes>
      </main>

      {/* Footer (Hidden on Admin portal) */}
      {!isAdminRoute && (
        <footer className={`border-t py-12 transition-colors ${
          theme === 'dark' 
            ? 'bg-[#140C22] border-purple-900/30 text-slate-300' 
            : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#4B5563]'
        }`}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Top Row: Mission + Trust Badge */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-purple-900/30">
              <div className="flex items-center gap-3">
                <Link to="/" className="cursor-pointer group shrink-0" title="HerEarn Home">
                  <Logo size="md" />
                </Link>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-[#1F2937] dark:text-white">Skill to Women</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF7ED] text-[#EA580C] border border-[#FED7AA]">
                      100% Free for Job Seekers
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
                    Empowering women across India to build digital skills and access verified, free job opportunities.
                  </p>
                </div>
              </div>

              {/* Safe Job Guarantee Callout */}
              <div className="bg-[#FFF9F5] dark:bg-[#1E1233] border border-[#FED7AA] dark:border-purple-800/40 rounded-2xl p-3.5 max-w-md flex items-start gap-3">
                <span className="text-base leading-none">🛡️</span>
                <p className="text-xs text-[#4B5563] dark:text-slate-300 leading-relaxed">
                  <strong className="text-[#1F2937] dark:text-white">Safety First:</strong> HerEarn is 100% free. Never pay anyone for interviews, job applications, or registrations.
                </p>
              </div>
            </div>

            {/* Middle Row: Links Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-semibold">
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">Opportunities</p>
                <div className="flex flex-col space-y-2">
                  <Link to="/opportunities" className="hover:text-[#7C3AED] transition-colors py-1">Browse Free Jobs</Link>
                  <Link to="/opportunities" className="hover:text-[#7C3AED] transition-colors py-1">Remote Micro-Gigs</Link>
                  <Link to="/post-gig" className="hover:text-[#7C3AED] transition-colors py-1 font-bold text-[#7C3AED]">Post an Opening</Link>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">Free Learning</p>
                <div className="flex flex-col space-y-2">
                  <Link to="/learn" className="hover:text-[#7C3AED] transition-colors py-1">Skill Tracks</Link>
                  <Link to="/portfolio" className="hover:text-[#7C3AED] transition-colors py-1">Portfolio Showcase</Link>
                  <Link to="/mentorship" className="hover:text-[#7C3AED] transition-colors py-1">Peer Mentorship</Link>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">Candidate Hub</p>
                <div className="flex flex-col space-y-2">
                  <Link to="/dashboard" className="hover:text-[#7C3AED] transition-colors py-1">Learner Dashboard</Link>
                  <Link to="/applications" className="hover:text-[#7C3AED] transition-colors py-1">My Applications</Link>
                  <Link to="/profile" className="hover:text-[#7C3AED] transition-colors py-1">My Profile & Resume</Link>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">About & Trust</p>
                <div className="flex flex-col space-y-2">
                  <Link to="/about" className="hover:text-[#7C3AED] transition-colors py-1">About HerEarn</Link>
                  <Link to="/terms" className="hover:text-[#7C3AED] transition-colors py-1">Terms of Service</Link>
                  <Link to="/privacy" className="hover:text-[#7C3AED] transition-colors py-1">Privacy Policy</Link>
                </div>
              </div>
            </div>

            {/* Bottom Row: Copyright */}
            <div className="pt-6 border-t border-slate-100 dark:border-purple-900/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] dark:text-slate-400">
              <p>© 2026 Skill to Women (HerEarn). Open access initiative for women’s economic empowerment.</p>
              <p className="flex items-center gap-3">
                <span>Made for all women across India</span>
                <span className="text-[#EA580C] font-bold">100% Free</span>
              </p>
            </div>

          </div>
        </footer>
      )}

      {/* Confirmation Dialogs & Notifications */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
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
