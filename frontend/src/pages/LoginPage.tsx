import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin, register, isLoading, error } = useAuthStore();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('owner@renukachai.com');
  const [password, setPassword] = useState<string>('password123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      const ok = await register(name, email, password);
      if (ok) navigate('/');
    } else {
      const ok = await login(email, password);
      if (ok) navigate('/');
    }
  };

  const handleDemoLogin = async () => {
    const ok = await demoLogin();
    if (ok) navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex justify-center items-center py-4 px-4">
      <div className="w-full max-w-md bg-[#FFF6EC] rounded-[2.5rem] p-7 shadow-2xl border border-[#F3DEC9] space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#5B2D16] flex items-center justify-center mx-auto shadow-cafe-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#321707] to-[#C45A0A]" />
            <Coffee className="w-8 h-8 text-[#FFE7CC] relative z-10" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FFE7CC] animate-ping opacity-75" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#181818] tracking-tight">
              Renuka Chai Centre
            </h1>
            <p className="text-xs font-bold text-[#C45A0A] uppercase tracking-wider mt-0.5">
              Khata Management
            </p>
          </div>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#5B2D16] to-[#C45A0A] hover:opacity-95 text-[#FFF6EC] font-bold text-xs flex items-center justify-between shadow-cafe-md active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFE7CC] animate-spin" />
            <span>Instant Login as Shop Owner</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#FFE7CC] group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative flex items-center justify-center">
          <hr className="w-full border-[#F3DEC9]" />
          <span className="absolute bg-[#FFF6EC] px-3 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
            Or Account Login
          </span>
        </div>

        {error && (
          <div className="bg-[#FCE8E6] border border-[#F8C4C0] text-[#DC2626] p-3 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1">
                Your Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#C45A0A] absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full pl-10 pr-4 py-3 bg-[#FBEBDD] border border-[#F3DEC9] rounded-2xl text-xs font-medium text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#C45A0A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#C45A0A] absolute left-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@renukachai.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FBEBDD] border border-[#F3DEC9] rounded-2xl text-xs font-medium text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#C45A0A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#C45A0A] absolute left-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FBEBDD] border border-[#F3DEC9] rounded-2xl text-xs font-medium text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#C45A0A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-[#5B2D16] hover:bg-[#321707] text-[#FFF6EC] font-bold text-xs uppercase tracking-wider shadow-cafe-md active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isRegisterMode ? 'Create Owner Account' : 'Sign In to Khata'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-bold text-[#C45A0A] hover:underline"
          >
            {isRegisterMode
              ? 'Already have an account? Sign in'
              : 'New to Renuka Chai? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};
