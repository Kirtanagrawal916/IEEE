import React, { useState } from 'react';
import { 
  User, 
  Award, 
  BookOpen, 
  IndianRupee, 
  CheckCircle2, 
  Briefcase, 
  Edit3, 
  MapPin, 
  Sparkles,
  Plus,
  LogIn,
  UserPlus,
  Clock,
  TrendingUp,
  X,
  Camera
} from 'lucide-react';

export default function ProfileSection({ 
  user, 
  userPortfolios, 
  userAppliedGigs, 
  onOpenAuth, 
  onOpenSubmitModal,
  onUpdateProfile 
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state initialized from current user or defaults
  const [editName, setEditName] = useState(user?.name || '');
  const [editTitle, setEditTitle] = useState(user?.title || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName || 'My Profile',
      title: editTitle || 'Skill Learner',
      location: editLocation || 'India',
      bio: editBio || 'Learning skills & building portfolio on HerEarn.',
      avatar: editAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
    });
    setIsEditOpen(false);
  };

  // --- GUEST VIEW (When no user is logged in) ---
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in text-slate-900 dark:text-white">
        
        {/* Welcome Guest Hero Card */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 border border-purple-500/30 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center md:text-left">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Welcome to Your Learner & Freelance Dashboard
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Start Your Journey from <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                Learning Skills to Earning Income
              </span>
            </h1>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              Create your free learner profile or log in to track course progress, earn verified skill credentials, publish portfolio projects, and get hired for paid micro-gigs.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="btn-gradient-award text-sm py-3 px-6 font-bold flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Profile</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="btn-outline-award text-sm py-3 px-6 cursor-pointer text-white border-white/40 hover:bg-white/10"
              >
                <LogIn className="w-4 h-4 text-purple-300" />
                <span>Login to Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Demo Profile Setup Preview */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 sm:p-8 text-slate-900 dark:text-white space-y-6 shadow-md">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Quick Guest Profile Builder
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
              Enter your details below to create your instant profile and explore the dashboard.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const nameInput = e.target.guestName.value || "New Learner";
            const titleInput = e.target.guestTitle.value || "Digital Marketing Creator";
            const locationInput = e.target.guestLocation.value || "India";
            onUpdateProfile({
              name: nameInput,
              title: titleInput,
              location: locationInput,
              bio: "Passionate about learning new digital skills and taking on client micro-gigs.",
              avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
            });
          }} className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
              <input
                name="guestName"
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Skill Focus / Title</label>
              <input
                name="guestTitle"
                type="text"
                required
                placeholder="e.g. Canva Graphic Designer"
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">City / State</label>
              <input
                name="guestLocation"
                type="text"
                placeholder="e.g. Jaipur, Rajasthan"
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-3 pt-2">
              <button type="submit" className="btn-gradient-award text-xs py-3 px-6 font-bold cursor-pointer">
                Launch My Dashboard
              </button>
            </div>
          </form>
        </div>

      </div>
    );
  }

  // --- AUTHENTICATED USER DASHBOARD VIEW ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
          
          {/* Avatar */}
          <div className="relative group">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'} 
              alt={user.name} 
              className="w-28 h-28 rounded-full object-cover border-4 border-purple-400 shadow-xl"
            />
            <button
              type="button"
              onClick={() => {
                setEditName(user.name);
                setEditTitle(user.title);
                setEditLocation(user.location);
                setEditBio(user.bio);
                setEditAvatar(user.avatar);
                setIsEditOpen(true);
              }}
              className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all cursor-pointer"
              title="Edit Profile"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Details */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  {user.name}
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" title="Verified Learner" />
                </h1>
                <p className="text-xs sm:text-sm text-purple-200 font-bold mt-0.5">{user.title}</p>
              </div>

              {/* Edit Profile Button & Income Pill */}
              <div className="flex items-center gap-3 self-center sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditName(user.name);
                    setEditTitle(user.title);
                    setEditLocation(user.location);
                    setEditBio(user.bio);
                    setEditAvatar(user.avatar);
                    setIsEditOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-white/30 hover:bg-white/10 flex items-center gap-1.5 cursor-pointer text-white"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-300" />
                  <span>Edit Profile</span>
                </button>

                <div className="bg-slate-900/90 border border-purple-500/30 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <span className="text-[10px] text-slate-300 uppercase font-bold block">Total Income</span>
                    <span className="text-base font-extrabold text-emerald-400">₹{(user.earnings || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-200 max-w-2xl leading-relaxed font-medium">
              {user.bio || 'Building skills and publishing portfolio projects on HerEarn.'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-300 font-bold pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {user.location || 'India'}
              </span>
              <span>•</span>
              <span className="text-purple-300 font-bold">{user.skills?.length || 0} Verified Skills</span>
            </div>
          </div>

        </div>
      </div>

      {/* Dashboard Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider block">Completed Lessons</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{user.completedLessons?.length || 0}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider block">Portfolios Published</span>
          <p className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">{userPortfolios.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider block">Gigs Applied</span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{userAppliedGigs.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 p-4 rounded-2xl space-y-1 shadow-md">
          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider block">Skill Credentials</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">Verified</p>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Skills & Progress */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Verified Skills */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-md text-slate-900 dark:text-white">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Verified Skills & Badges
            </h3>

            <div className="space-y-2">
              {(user.skills || ["Digital Marketing", "Canva Graphics", "Instagram Ads"]).map((skill, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{skill}</span>
                  <span className="bg-purple-100 dark:bg-purple-600/30 text-purple-800 dark:text-purple-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-300 dark:border-purple-500/40">
                    <CheckCircle2 className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Track */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-md text-slate-900 dark:text-white">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Active Skill Track
            </h3>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">Digital Marketing & Social Media</p>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span>Progress</span>
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold">60%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill w-3/5"></div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                {user.completedLessons?.length || 3} lessons completed. Capstone unlocked!
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Published Portfolios & Applied Opportunities */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* My Portfolios */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-md text-slate-900 dark:text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                My Published Portfolios ({userPortfolios.length})
              </h3>

              <button
                type="button"
                onClick={onOpenSubmitModal}
                className="btn-gradient-award text-xs py-2 px-3 font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Project</span>
              </button>
            </div>

            {userPortfolios.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">No portfolio projects published yet.</p>
                <button type="button" onClick={onOpenSubmitModal} className="text-xs text-purple-700 dark:text-purple-400 font-bold hover:underline cursor-pointer">
                  + Publish your first capstone project
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {userPortfolios.map((item) => (
                  <div key={item.id} className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 space-y-2.5 text-slate-900 dark:text-white">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 font-medium">{item.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700/60 pt-2 font-bold">
                      <span>{item.date}</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">❤️ {item.likes} Likes</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applied Gigs Tracker */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 space-y-4 shadow-md text-slate-900 dark:text-white">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Applied Micro-Gigs & Internships ({userAppliedGigs.length})
            </h3>

            {userAppliedGigs.length === 0 ? (
              <p className="text-xs text-slate-600 dark:text-slate-300 py-4 text-center font-medium">No active applications yet. Browse the Opportunity Board to apply!</p>
            ) : (
              <div className="space-y-3">
                {userAppliedGigs.map((gig) => (
                  <div key={gig.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-900 dark:text-white">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{gig.title}</h4>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 font-medium">{gig.company} • Stipend: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{gig.stipend}</span></p>
                    </div>

                    <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold px-3 py-1 rounded-full text-[10px] border border-amber-300 dark:border-amber-500/30 self-start sm:self-center">
                      Under Review by Client
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-900 dark:text-white shadow-2xl relative space-y-4 text-xs">
            <button 
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Your Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title / Role</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location (City, State)</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gradient-award justify-center py-3 font-bold mt-2 cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
