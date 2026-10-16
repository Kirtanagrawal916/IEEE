import React from 'react';
import logoPng from '../assets/logo.png';
import emblemPng from '../assets/logo-emblem.png';

/**
 * Official HerEarn Brand Logo Component
 * Unified, single-source-of-truth logo across the entire platform.
 * Supports transparent rendering with crisp contrast in both Light Mode & Dark Mode.
 *
 * @param {('full'|'icon'|'mark')} variant - 'full' (emblem + wordmark + tagline) or 'icon'/'mark' (emblem only)
 * @param {('xs'|'sm'|'md'|'lg'|'xl')} size - Size preset
 * @param {string} className - Optional custom classes
 * @param {boolean} animated - Whether to enable hover micro-animations
 */
export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
  imgClassName = '',
  animated = true,
  alt = 'HerEarn - Skill to Income Platform'
}) {
  const sizeClasses = {
    xs: variant === 'icon' || variant === 'mark' ? 'h-6 w-auto' : 'h-7 w-auto',
    sm: variant === 'icon' || variant === 'mark' ? 'h-8 w-auto' : 'h-9 w-auto',
    md: variant === 'icon' || variant === 'mark' ? 'h-10 w-auto' : 'h-12 w-auto',
    lg: variant === 'icon' || variant === 'mark' ? 'h-13 w-auto' : 'h-16 w-auto',
    xl: variant === 'icon' || variant === 'mark' ? 'h-16 w-auto' : 'h-20 w-auto',
  }[size] || 'h-12 w-auto';

  const isIconOnly = variant === 'icon' || variant === 'mark';
  const imageSrc = isIconOnly ? emblemPng : logoPng;

  return (
    <div
      className={`inline-flex items-center select-none ${animated ? 'transition-all duration-200 group-hover:scale-105' : ''} ${className}`}
      title="HerEarn • Skill to Income Platform"
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`${imgClassName || sizeClasses} object-contain transition-all duration-200 dark:brightness-110`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
