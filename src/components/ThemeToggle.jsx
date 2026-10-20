import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Clean iOS-Style Dark Mode Toggle Switch Component for HerEarn
 * Scaled compactly to match the user's request:
 * - Compact pill switch (38px x 22px)
 * - Brand gradient (Purple to Pink: from-purple-600 to-pink-600) when active (Dark Mode ON)
 * - Soft neutral gray (bg-slate-300 dark:bg-slate-700) when inactive (Dark Mode OFF)
 * - Pure white circular knob (18px x 18px) with subtle drop shadow
 * - Fluid sliding animation
 */
export default function ThemeToggle({
  theme: propTheme,
  onToggleTheme: propToggleTheme,
  variant = 'switch',
  className = '',
  showLabel = false,
  showIcon = true,
  size = 'sm', // 'xs' | 'sm' | 'md'
}) {
  const context = useTheme();

  // Prefer props if passed, otherwise use ThemeContext
  const currentTheme = propTheme || context?.theme || 'light';
  const isDark = currentTheme === 'dark';

  const handleToggle = (e) => {
    e?.stopPropagation?.();
    if (propToggleTheme) {
      propToggleTheme();
    } else if (context?.toggleTheme) {
      context.toggleTheme();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Dimensions based on size prop (compact defaults)
  const sizeConfig = {
    xs: {
      track: 'w-[32px] h-[18px] p-[2px]',
      knob: 'w-[14px] h-[14px]',
      translate: 'translate-x-[14px]',
      icon: 'w-3 h-3',
    },
    sm: {
      track: 'w-[38px] h-[22px] p-[2px]',
      knob: 'w-[18px] h-[18px]',
      translate: 'translate-x-[16px]',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      track: 'w-[44px] h-[25px] p-[2px]',
      knob: 'w-[21px] h-[21px]',
      translate: 'translate-x-[19px]',
      icon: 'w-4 h-4',
    }
  }[size] || {
    track: 'w-[38px] h-[22px] p-[2px]',
    knob: 'w-[18px] h-[18px]',
    translate: 'translate-x-[16px]',
    icon: 'w-3.5 h-3.5',
  };

  // ---------------------------------------------------------------------------
  // 1. LABELED ROW VARIANT (For Dropdown Menus, Mobile Drawer & Settings)
  // ---------------------------------------------------------------------------
  if (variant === 'labeled') {
    return (
      <div 
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors select-none ${
          isDark 
            ? 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-purple-500/30' 
            : 'bg-purple-50/70 hover:bg-purple-100/80 text-slate-800 border border-purple-200'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
            isDark 
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40' 
              : 'bg-purple-100 text-purple-600 border border-purple-300/80'
          }`}>
            {isDark ? (
              <Moon className="w-3 h-3 fill-purple-300/30 stroke-[2.2]" />
            ) : (
              <Sun className="w-3 h-3 text-amber-500 stroke-[2.2]" />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white leading-tight text-[11px]">Dark Mode</p>
            <p className="text-[9px] text-slate-500 dark:text-slate-400">
              {isDark ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>

        {/* The Compact Toggle Switch matching Brand UI */}
        <div
          role="switch"
          aria-checked={isDark}
          aria-label="Toggle dark mode"
          className={`relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out cursor-pointer shadow-inner w-[38px] h-[22px] p-[2px] ${
            isDark
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_8px_rgba(168,85,247,0.35)]'
              : 'bg-slate-300 dark:bg-slate-700'
          }`}
        >
          <span
            className={`w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transform transition-transform duration-300 ease-in-out ${
              isDark ? 'translate-x-[16px]' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. COMPACT TOGGLE SWITCH VARIANT (Matches User's Image + Brand Colors)
  // ---------------------------------------------------------------------------
  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      {/* Optional Leading Icon */}
      {showIcon && (
        <span 
          onClick={handleToggle}
          className="cursor-pointer text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          title={isDark ? "Dark Mode: Active" : "Light Mode: Active"}
        >
          {isDark ? (
            <Moon className={`${sizeConfig.icon} text-purple-400 fill-purple-400/20`} />
          ) : (
            <Sun className={`${sizeConfig.icon} text-amber-500 fill-amber-500/20`} />
          )}
        </span>
      )}

      {showLabel && (
        <span 
          onClick={handleToggle}
          className="text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}

      {/* Pill Toggle Switch Button */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Toggle Dark Mode (currently ${isDark ? 'On' : 'Off'})`}
        title={`Toggle Dark Mode (currently ${isDark ? 'On' : 'Off'})`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex items-center shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-1.5 focus:ring-purple-400/60 focus:ring-offset-1 dark:focus:ring-offset-slate-900 shadow-inner hover:opacity-95 ${sizeConfig.track} ${
          isDark
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_8px_rgba(168,85,247,0.35)]' // Matches HerEarn Brand UI
            : 'bg-slate-300 dark:bg-slate-700' // Clean neutral off state
        }`}
      >
        {/* Pure White Circular Knob with Drop Shadow */}
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.22)] transform transition-transform duration-300 ease-in-out ${sizeConfig.knob} ${
            isDark ? sizeConfig.translate : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
