import React, { useState } from 'react';
import { Users, Calendar, MessageSquare, Star, Award, CheckCircle, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function MentorshipSection({ showToast }) {
  const [bookedMentor, setBookedMentor] = useState(null);

  const mentors = [
    {
      id: 'm1',
      name: 'Ananya Sharma',
      role: 'Senior Product Marketer @ TechCorp',
      experience: '8+ Years Exp.',
      skills: ['Digital Marketing', 'Brand Growth', 'SEO Strategy'],
      rating: 4.9,
      reviews: 42,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      availability: 'Wed & Sat (6 PM IST)',
      bio: 'Helping female creators transition into remote digital marketing & freelance client retainers.'
    },
    {
      id: 'm2',
      name: 'Pooja Verma',
      role: 'Lead UI/UX & Brand Designer',
      experience: '6+ Years Exp.',
      skills: ['Canva Pro', 'Figma', 'Visual Branding'],
      rating: 5.0,
      reviews: 58,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      availability: 'Tue & Thu (5 PM IST)',
      bio: 'Empowering women to build high-converting graphic portfolios and land freelance clients.'
    },
    {
      id: 'm3',
      name: 'Ritu Mukherji',
      role: 'E-Commerce Growth Strategist',
      experience: '7+ Years Exp.',
      skills: ['Shopify', 'Catalog Mgmt', 'FB Ads'],
      rating: 4.8,
      reviews: 31,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
      availability: 'Mon & Fri (7 PM IST)',
      bio: 'Guiding women founders & store managers on scaling e-commerce inventory and client sales.'
    }
  ];

  const handleBookSession = (mentor) => {
    setBookedMentor(mentor);
    if (showToast) showToast("📅 Mentorship Session Booked!", `1-on-1 session confirmed with ${mentor.name} for ${mentor.availability}.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 border border-purple-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>HerEarn Mentorship & Peer Network</span>
          </div>
          <h1 className="text-3xl font-black text-white">Learn 1-on-1 From Female Tech Leaders</h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Book free 1-on-1 strategy sessions with experienced female mentors. Get feedback on your portfolio, career break restart advice, and gig application tips.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 dark:bg-slate-900/60 p-4 rounded-2xl border border-purple-500/30 text-xs font-bold shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-white">100% Free Sessions</p>
            <p className="text-purple-300 font-normal text-[11px]">Empowering women across India</p>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mentors.map((m) => (
          <div key={m.id} className="bg-white/90 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-lg flex flex-col justify-between hover:border-purple-500 transition-all">
            <div className="space-y-4">
              
              <div className="flex items-center gap-4">
                <img src={m.avatar} alt={m.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-md" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{m.name}</h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold">{m.role}</p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-extrabold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{m.rating} ({m.reviews} sessions)</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                "{m.bio}"
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {m.skills.map((sk, idx) => (
                  <span key={idx} className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 px-2.5 py-1 rounded-lg border border-purple-300 dark:border-purple-800">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="p-3 bg-purple-50 dark:bg-slate-950 rounded-xl border border-purple-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Availability:</span>
                <span className="text-purple-600 dark:text-purple-400">{m.availability}</span>
              </div>

            </div>

            <button
              onClick={() => handleBookSession(m)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{bookedMentor?.id === m.id ? 'Session Confirmed! ✅' : 'Book Free 1-on-1 Call'}</span>
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
