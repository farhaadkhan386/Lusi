import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface AdminLoginProps {
  onBackToStore?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { login, loginWithGoogle } = useAdmin();
  const [email, setEmail] = useState('admin@lusi.in');
  const [password, setPassword] = useState('Raza@999');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const res = await loginWithGoogle();
      if (!res.success) setErrorMessage(res.message);
    } catch {
      setErrorMessage('Google authentication could not be completed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('A connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E0D] text-[#EFEBE4] flex flex-col justify-between font-sans selection:bg-[#C9A354] selection:text-black">
      {/* Top Header */}
      <header className="px-6 sm:px-12 py-6 flex items-center justify-between border-b border-[#24211D]">
        <div className="flex items-center gap-3">
          <span className="font-serif text-2xl tracking-[0.28em] text-white uppercase font-light">
            LUSI
          </span>
          <span className="text-[#595247] font-mono text-xs">/</span>
          <span className="text-[11px] uppercase tracking-luxury text-[#B3A99B] font-medium">
            Atelier Command Center
          </span>
        </div>

        {onBackToStore && (
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs text-[#A89F91] hover:text-white transition-colors tracking-wider uppercase font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Storefront</span>
          </button>
        )}
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#171513] border border-[#2B2721] rounded-xs shadow-2xl p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C9A354]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#24201A] border border-[#3E372E] flex items-center justify-center text-[#C9A354]">
              <Lock className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-wide">
              Administrator Access
            </h1>
            <p className="mt-2 text-xs text-[#9E9485] font-light leading-relaxed">
              Authenticate with your verified atelier credentials to manage catalog, inventory, and pan-India fulfillment.
            </p>
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="mb-6 p-3 bg-[#1F1C18] border border-[#332D24] rounded-xs text-[11px] text-[#C4BAA9]">
            <div className="flex items-center justify-between font-semibold text-white mb-1">
              <span className="flex items-center gap-1.5 text-[#C9A354]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Authorized Demo Credentials:</span>
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[#2B2620] text-[#E0D8CB] rounded-xs">
                Super Admin
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#A89F91] space-y-0.5">
              <div>Email: <strong className="text-white">admin@lusi.in</strong></div>
              <div>Password: <strong className="text-white">LusiAtelier2026</strong></div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-luxury text-[#BDB2A2] mb-1.5 font-medium">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C5F]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lusi.in"
                  className="w-full bg-[#1F1C18] border border-[#363027] rounded-xs py-3 pl-10 pr-4 text-sm text-white placeholder-[#5C5449] focus:outline-none focus:border-[#C9A354] transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] uppercase tracking-luxury text-[#BDB2A2] font-medium">
                  Atelier Security Key
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] text-[#C9A354] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#756C5F]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1F1C18] border border-[#363027] rounded-xs py-3 pl-10 pr-10 text-sm text-white placeholder-[#5C5449] focus:outline-none focus:border-[#C9A354] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#756C5F] hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-2 h-12 bg-[#C9A354] hover:bg-[#B38F44] text-[#141210] text-xs font-semibold uppercase tracking-luxury transition-all flex items-center justify-center gap-2 rounded-xs disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C9A354]/10 active:scale-98"
            >
              {isLoading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <span>LOGIN TO COMMAND CENTER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Firebase Google Auth Button */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-[#2B2620] w-full" />
              <span className="bg-[#171513] px-2 text-[10px] uppercase font-mono text-[#736857] shrink-0">
                Or Continue With
              </span>
              <div className="border-t border-[#2B2620] w-full" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full h-11 bg-[#1F1B16] hover:bg-[#2B251E] border border-[#3E362A] text-white text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 rounded-xs disabled:opacity-50 cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{isGoogleLoading ? 'Connecting...' : 'Authorize With Google (Firebase)'}</span>
            </button>
          </form>

          {/* Security Assurance */}
          <div className="mt-8 pt-6 border-t border-[#26221C] flex items-center justify-center gap-2 text-[11px] text-[#786F62]">
            <ShieldCheck className="w-4 h-4 text-[#8C7D69]" />
            <span>Protected 256-Bit Encrypted Session</span>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1A1815] border border-[#332D24] p-6 rounded-xs text-[#EAE4D8]">
            <h3 className="font-serif text-lg font-light text-white mb-2">Password Recovery</h3>
            <p className="text-xs text-[#A89F91] leading-relaxed mb-4">
              Enter your registered atelier email to receive cryptographic password reset instructions.
            </p>
            {forgotSubmitted ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 mb-4 rounded-xs">
                A verification link has been dispatched to {email}. Check your inbox.
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#24201A] border border-[#3E372E] rounded-xs p-2.5 text-xs text-white font-mono"
                  placeholder="admin@lusi.in"
                />
              </div>
            )}
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSubmitted(false);
                }}
                className="px-3 py-1.5 text-[#A89F91] hover:text-white"
              >
                Close
              </button>
              {!forgotSubmitted && (
                <button
                  type="button"
                  onClick={() => setForgotSubmitted(true)}
                  className="px-4 py-1.5 bg-[#C9A354] text-black font-semibold uppercase tracking-wider rounded-xs"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-5 text-center text-xs text-[#61584C] border-t border-[#24211D]">
        <span>© 2026 LUSI India · Internal Operational Dashboard · Confidentially Protected</span>
      </footer>
    </div>
  );
};
