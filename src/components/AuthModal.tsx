import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api.ts';
import { User } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name');
        const res = await api.register(name.trim(), email.trim(), password);
        if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
        }
      } else {
        const res = await api.login(email.trim(), password);
        if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const demoEmail = 'investigator@truthguard.ai';
      const demoPassword = 'demoPassword2026!';
      
      // Attempt login first
      try {
        const res = await api.login(demoEmail, demoPassword);
        if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
          return;
        }
      } catch {
        // If not found, register demo account
        const regRes = await api.register('Lead Fact-Checker', demoEmail, demoPassword);
        if (regRes.success && regRes.user) {
          onSuccess(regRes.user);
          onClose();
          return;
        }
      }
    } catch (err: any) {
      setError('Could not initialize demo login. Please try registering manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-2">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isRegister ? 'Create TruthGuard Account' : 'Sign in to TruthGuard'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister
              ? 'Join to save personal analysis audits and track investigative metrics'
              : 'Access your saved news audits and forensic reporting repository'}
          </p>
        </div>

        {/* Quick Demo Button for Instant Evaluation */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-center">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2 px-3 text-xs font-bold text-indigo-200 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>1-Click Instant Demo Login</span>
          </button>
          <span className="text-[10px] text-indigo-300/80 block mt-1">
            Instant evaluation without filling in forms
          </span>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-semibold">Or continue with</span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="analyst@domain.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle sign in / register */}
        <div className="text-center pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            {isRegister
              ? 'Already registered? Sign in here'
              : "Don't have an account? Create one"}
          </button>
        </div>

      </div>
    </div>
  );
};
