import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * GoogleSignInButton Component
 * Uses official Google Identity Services (GIS) Web SDK for OAuth 2.0 / OpenID Connect Sign-In
 * - Renders Google's official iframe button for immediate browser account selection
 * - Prompts Google's account selection One-Tap dialog (`select_account`)
 * - Cryptographically verified on server via google-auth-library
 */
export default function GoogleSignInButton({
  onSuccess,
  onError,
  text = 'Continue with Google',
  disabled = false,
  className = '',
}) {
  const auth = useAuth();
  const googleLoginFunc = auth?.googleLogin;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [useCustomFallback, setUseCustomFallback] = useState(false);
  const googleBtnContainerRef = useRef(null);
  const isProcessingRef = useRef(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Process Google credential / id_token returned from official Google sign-in
  const handleCredentialResponse = async (response) => {
    if (!response || !response.credential) {
      const msg = 'Google authentication response was empty. Please try again.';
      setErrorMessage(msg);
      if (onError) onError(msg);
      setIsLoading(false);
      isProcessingRef.current = false;
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      let res;
      if (googleLoginFunc) {
        res = await googleLoginFunc(response.credential);
      } else {
        res = await api.googleLogin(response.credential);
      }

      setIsLoading(false);
      isProcessingRef.current = false;

      if (onSuccess) {
        onSuccess(res.user);
      }
    } catch (err) {
      setIsLoading(false);
      isProcessingRef.current = false;
      const userMsg =
        err.message?.includes('network') || err.message?.includes('Failed to fetch')
          ? 'Unable to connect to HerEarn backend server. Please verify the server is running.'
          : err.message || 'Google sign-in failed. Please try again.';
      setErrorMessage(userMsg);
      if (onError) onError(userMsg);
    }
  };

  // Initialize and Render Official Google Identity Services Button
  useEffect(() => {
    if (!googleClientId) {
      setUseCustomFallback(true);
      return;
    }

    let intervalId = null;

    const renderOfficialGoogleButton = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            itp_support: true,
          });

          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              theme: document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline',
              size: 'large',
              type: 'standard',
              shape: 'pill',
              text: 'continue_with',
              logo_alignment: 'left',
              width: 320,
            });
            setUseCustomFallback(false);
          }

          // Trigger One Tap prompt if browser permits
          window.google.accounts.id.prompt();
          return true;
        } catch (err) {
          console.warn('[GIS] Render warning:', err.message);
          setUseCustomFallback(true);
        }
      }
      return false;
    };

    if (!renderOfficialGoogleButton()) {
      intervalId = setInterval(() => {
        if (renderOfficialGoogleButton()) {
          clearInterval(intervalId);
        }
      }, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [googleClientId]);

  // Click handler for fallback button
  const handleCustomButtonClick = () => {
    if (isLoading || isProcessingRef.current || disabled) return;

    if (!googleClientId) {
      setErrorMessage('Google Client ID is not configured in .env.');
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.info('[GIS] Prompt not displayed:', notification.getNotDisplayedReason());
        }
      });
    }
  };

  return (
    <div className={`w-full flex flex-col items-center space-y-2 ${className}`}>
      {/* Container for Official Google Rendered Button */}
      {googleClientId && (
        <div
          ref={googleBtnContainerRef}
          className="w-full flex justify-center min-h-[44px]"
        />
      )}

      {/* Fallback button shown if client ID missing or loading */}
      {(useCustomFallback || isLoading) && (
        <button
          type="button"
          onClick={handleCustomButtonClick}
          disabled={disabled || isLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{text}</span>
            </>
          )}
        </button>
      )}

      {/* Inline Error Notice */}
      {errorMessage && (
        <div
          role="alert"
          className="w-full p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-start gap-2 text-left"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
