import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-emerald-500/50 text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-slate-900 dark:text-white">{toast.title}</p>
          <p className="text-slate-600 dark:text-slate-300">{toast.message}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-white ml-2 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
