import React from 'react';
import { Coffee, UserPlus, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useKhataStore } from '../store/useKhataStore';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { setIsAddCustomerModalOpen } = useKhataStore();

  return (
    <header className="px-5 pt-4 pb-3 flex items-center justify-between">
      {/* Brand & Cafe Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#5B2D16] flex items-center justify-center shadow-cafe-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#321707] to-[#C45A0A] opacity-90" />
          <Coffee className="w-6 h-6 text-[#FFE7CC] relative z-10 transition-transform group-hover:scale-110" />
          {/* Subtle steam dot */}
          <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#FFE7CC] animate-ping opacity-75" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#181818] leading-tight font-sans">
            Renuka Chai Centre
          </h1>
          <p className="text-xs font-semibold text-[#C45A0A] uppercase tracking-wider">
            Chai Centre
          </p>
        </div>
      </div>

      {/* Header Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsAddCustomerModalOpen(true)}
          className="w-10 h-10 rounded-full bg-[#FBEBDD] text-[#5B2D16] hover:bg-[#FFE7CC] flex items-center justify-center transition-all shadow-cafe-sm active:scale-95"
          title="Add Customer"
          aria-label="Add Customer"
        >
          <UserPlus className="w-5 h-5 text-[#5B2D16]" />
        </button>

        <button
          onClick={logout}
          className="w-10 h-10 rounded-full bg-[#FBEBDD] text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FFE7CC] flex items-center justify-center transition-all shadow-cafe-sm active:scale-95"
          title={`Logged in as ${user?.name || 'Owner'}. Tap to Logout`}
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
