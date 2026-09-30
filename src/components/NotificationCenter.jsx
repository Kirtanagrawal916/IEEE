import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Target, 
  Zap, 
  Briefcase, 
  Award, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';

export const initialNotifications = [
  {
    id: "notif-1",
    type: "skill_match",
    title: "🎯 100% Skill Match Opportunity!",
    message: "New gig posted: 'Instagram Post Designer' matches 100% of your Canva & Marketing skills.",
    timestamp: "10 min ago",
    isRead: false,
    path: "/opportunities"
  },
  {
    id: "notif-2",
    type: "challenge",
    title: "⚡ Challenge Evaluated (+50 PTS)",
    message: "Your Canva Bakery Post challenge submission scored 94/100! 'Canva Bakery Specialist' badge unlocked.",
    timestamp: "1 hour ago",
    isRead: false,
    path: "/learn"
  },
  {
    id: "notif-3",
    type: "application",
    title: "💼 Application Viewed by Client",
    message: "Desi Flavors Handcrafted viewed your application for Social Media Manager.",
    timestamp: "3 hours ago",
    isRead: false,
    path: "/dashboard"
  },
  {
    id: "notif-4",
    type: "escrow",
    title: "🛡️ Escrow Stipend Reserved",
    message: "Stipend payment of ₹8,000 is reserved in HerEarn Escrow for KalaKriti Collective.",
    timestamp: "1 day ago",
    isRead: true,
    path: "/dashboard"
  },
  {
    id: "notif-5",
    type: "achievement",
    title: "🏆 Achievement Unlocked",
    message: "You unlocked the 'Verified Digital Marketer' badge on your public profile.",
    timestamp: "2 days ago",
    isRead: true,
    path: "/portfolio"
  }
];

export default function NotificationCenter({ theme, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread'
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('herearn_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const popupRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('herearn_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => 
      n.id === notif.id ? { ...n, isRead: true } : n
    ));
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(notif.path);
    } else if (notif.path) {
      window.location.href = notif.path;
    }
  };

  const getNotifIcon = (type) => {
    switch(type) {
      case 'skill_match':
        return <Target className="w-4 h-4 text-pink-500" />;
      case 'challenge':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'application':
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      case 'escrow':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="relative" ref={popupRef}>
      
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications Center"
        aria-label="Notifications Center"
        className={`p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-purple-400 ${
          isOpen
            ? 'bg-purple-600 text-white border-purple-500 shadow-md'
            : theme === 'dark'
            ? 'bg-slate-900/80 border-purple-500/30 text-purple-300 hover:text-white'
            : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
        }`}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-purple-500/30 shadow-2xl p-4 z-50 animate-fade-in text-slate-900 dark:text-white space-y-3">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Notifications</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {unreadCount > 0 ? `${unreadCount} unread activity updates` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllNotifications}
                  title="Clear all"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'unread'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-none">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 relative group ${
                    !n.isRead
                      ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-800/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-extrabold text-slate-900 dark:text-white leading-snug">
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block pt-1">
                      {n.timestamp}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors shrink-0 self-center" />
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-2 text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-semibold">No notifications to display</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
