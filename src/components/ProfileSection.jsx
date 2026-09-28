import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import { skillTracks } from '../data/mockData';

export default function ProfileSection({ user, userPortfolios, userAppliedGigs }) {
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Profile Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 text-center md:text-left">
          
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500 shadow-xl flex-shrink-0"
          />

          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                  {user.name}
                  {user.verified && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" title="Verified Learner" />
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-300 font-medium">{user.title}</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-2xl flex items-center justify-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Income</span>
                  <span className="text-base font-extrabold text-emerald-400">₹{user.earnings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {user.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> {user.location}
              </span>
              <span>•</span>
              <span className="text-indigo-400 font-semibold">{user.skills.length} Verified Skills</span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Left Verified Skills & Track Progress, Right Projects & Applied Gigs */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Skills & Badges */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Verified Skill Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Verified Skill Credentials
            </h3>

            <div className="space-y-2">
              {user.skills.map((skill, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-indigo-950">{skill}</span>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Track Progress */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Current Learning Track
            </h3>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-800">Digital Marketing & Social Media</p>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Progress</span>
                  <span className="text-purple-600">60%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: '60%' }}></div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                3 of 5 lessons completed. Capstone portfolio project unlocked!
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: My Portfolio Projects & Applied Gigs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* My Submitted Portfolio Projects */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                My Published Portfolios ({userPortfolios.length})
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {userPortfolios.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-3.5 space-y-2.5 bg-slate-50">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg" />
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200 pt-2">
                    <span>{item.date}</span>
                    <span className="text-indigo-600 font-bold">{item.likes} Likes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applied Gigs Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-600" />
              Applied Opportunities ({userAppliedGigs.length})
            </h3>

            <div className="space-y-3">
              {userAppliedGigs.map((gig) => (
                <div 
                  key={gig.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900">{gig.title}</h4>
                    <p className="text-slate-500">{gig.company} • Stipend: {gig.stipend}</p>
                  </div>

                  <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-[11px] border border-amber-200 self-start sm:self-center">
                    Under Review by Client
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
