import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RefreshCw, Volume2, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CAPTCHA_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateRandomCaptcha(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
  }
  return result;
}

export default function CaptchaChallenge({
  captchaCode,
  captchaInput,
  setCaptchaInput,
  onRefresh,
  hasError = false,
  errorMessage = ''
}) {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isDark } = useTheme();

  // Draw distorted captcha on canvas
  const drawCaptcha = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !captchaCode) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient matching theme
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    if (isDark) {
      bgGradient.addColorStop(0, '#1E1233');
      bgGradient.addColorStop(0.5, '#2D1B4E');
      bgGradient.addColorStop(1, '#1A0F2E');
    } else {
      bgGradient.addColorStop(0, '#FDF2F8');
      bgGradient.addColorStop(0.5, '#F5F3FF');
      bgGradient.addColorStop(1, '#EDE9FE');
    }
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add noise dots
    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = isDark
        ? `rgba(168, 85, 247, ${0.15 + Math.random() * 0.3})`
        : `rgba(124, 58, 237, ${0.12 + Math.random() * 0.25})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2 + 0.8,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Add random interference lines / curves
    const lineColors = isDark
      ? ['rgba(236, 72, 153, 0.4)', 'rgba(168, 85, 247, 0.4)', 'rgba(99, 102, 241, 0.35)']
      : ['rgba(236, 72, 153, 0.45)', 'rgba(124, 58, 237, 0.4)', 'rgba(79, 70, 229, 0.35)'];

    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = lineColors[i % lineColors.length];
      ctx.lineWidth = 1.2 + Math.random() * 1.2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width * 0.2, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width * 0.5,
        Math.random() * height,
        Math.random() * width * 0.8,
        Math.random() * height,
        width,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Draw characters with random rotation, font variation, and distinct brand colors
    const charColors = isDark
      ? ['#F472B6', '#C084FC', '#A78BFA', '#818CF8', '#FB7185', '#E879F9']
      : ['#BE185D', '#6D28D9', '#4338CA', '#7C3AED', '#DB2777', '#581C87'];

    const charCount = captchaCode.length;
    const charSpacing = (width - 24) / charCount;

    for (let i = 0; i < charCount; i++) {
      const char = captchaCode[i];
      const x = 14 + i * charSpacing + Math.random() * 4 - 2;
      const y = height / 2 + (Math.random() * 6 - 3);

      ctx.save();
      ctx.translate(x + 10, y);

      // Random tilt (-18 to +18 deg)
      const angle = (Math.random() - 0.5) * 0.5;
      ctx.rotate(angle);

      // Font styling
      const fontSize = Math.floor(22 + Math.random() * 4);
      ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
      ctx.fillStyle = charColors[i % charColors.length];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Soft shadow for depth
      ctx.shadowColor = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(124, 58, 237, 0.15)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, [captchaCode, isDark]);

  useEffect(() => {
    drawCaptcha();
  }, [drawCaptcha]);

  const handleRefreshClick = () => {
    setIsSpinning(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsSpinning(false), 500);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop any pending speech
    setIsSpeaking(true);

    const spokenText = `Security verification code: ${captchaCode.split('').join(', ')}`;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const isMatched = captchaInput.trim().length === captchaCode.length && 
                    captchaInput.trim().toUpperCase() === captchaCode.toUpperCase();

  return (
    <div className="space-y-2 p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/10 border border-purple-200/60 dark:border-purple-800/40 transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-bold text-[#1F2937] dark:text-slate-200">
          <Shield className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
          <span>Security Verification</span>
          <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400">(CAPTCHA)</span>
        </label>
        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-700/50">
          Anti-Bot
        </span>
      </div>

      {/* Visual Challenge & Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Canvas Display */}
        <div className="relative flex-1 rounded-xl overflow-hidden border border-purple-300 dark:border-purple-700/60 shadow-inner bg-[#FDF2F8] dark:bg-[#1E1233] flex items-center justify-center select-none group">
          <canvas
            ref={canvasRef}
            width={180}
            height={46}
            className="w-full max-w-[200px] h-[46px] block cursor-pointer"
            onClick={handleRefreshClick}
            title="Click to generate a new security code"
          />
          {/* Subtle click hint overlay on hover */}
          <div 
            onClick={handleRefreshClick}
            className="absolute inset-0 bg-purple-900/10 dark:bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none"
          >
            <span className="text-[10px] font-bold text-[#7C3AED] dark:text-purple-300 bg-white/90 dark:bg-black/80 px-2 py-0.5 rounded-full shadow-sm">
              Click to refresh
            </span>
          </div>
        </div>

        {/* Action Controls: Refresh & Audio */}
        <div className="flex items-center justify-end sm:justify-start gap-1.5">
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={isSpinning}
            className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-[#201533] text-slate-600 dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-purple-300 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
            title="Get new security code"
            aria-label="Refresh security code"
          >
            <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin text-[#7C3AED]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleSpeak}
            className={`p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-[#201533] transition-all cursor-pointer shadow-sm active:scale-95 ${
              isSpeaking
                ? 'text-[#7C3AED] dark:text-purple-300 border-[#7C3AED] animate-pulse'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#7C3AED] dark:hover:text-purple-300 hover:border-purple-400 dark:hover:border-purple-600'
            }`}
            title="Listen to code (Audio)"
            aria-label="Play security code audio"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input Field */}
      <div>
        <div className="relative">
          <input
            type="text"
            required
            autoComplete="off"
            spellCheck="false"
            maxLength={6}
            placeholder="Type the 6-character code"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            className={`w-full bg-white dark:bg-[#201533] text-[#1F2937] dark:text-white text-xs px-3.5 py-2.5 rounded-xl border font-mono font-bold tracking-widest uppercase transition-colors placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:tracking-normal ${
              hasError
                ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : isMatched
                  ? 'border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  : 'border-[#E5E7EB] dark:border-purple-900/40 focus:border-[#7C3AED] focus:outline-none'
            }`}
          />
          {isMatched && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center gap-1 text-[11px] font-bold pointer-events-none">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Matched</span>
            </div>
          )}
        </div>

        {/* Error or Hint message */}
        {hasError && errorMessage ? (
          <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        ) : (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Enter the letters and digits shown above. Case-insensitive.
          </p>
        )}
      </div>
    </div>
  );
}
