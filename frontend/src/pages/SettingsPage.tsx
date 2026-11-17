import React, { useState } from 'react';
import { Store, User, IndianRupee, ShieldCheck, LogOut, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useKhataStore } from '../store/useKhataStore';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { fetchCustomers, fetchSummary } = useKhataStore();
  const [defaultRate, setDefaultRate] = useState<number>(10);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('renuka_default_rate', defaultRate.toString());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRefreshData = async () => {
    await fetchSummary();
    await fetchCustomers();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#181818] tracking-tight">
          Shop Settings
        </h2>
        <p className="text-xs text-[#6B7280]">
          Manage shop profile and khata defaults
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-[#16803C] text-[#FFF6EC] py-2.5 px-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Shop Profile Card */}
      <div className="bg-[#FBEBDD] rounded-3xl p-5 border border-[#F3DEC9] shadow-cafe-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[#F3DEC9]">
          <div className="w-12 h-12 rounded-2xl bg-[#5B2D16] text-[#FFE7CC] flex items-center justify-center font-bold text-lg shadow-cafe-sm">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#181818] text-base leading-tight">
              {user?.shop_name || 'Renuka Chai Centre'}
            </h3>
            <p className="text-xs text-[#6B7280]">
              {user?.name || 'Owner'} • {user?.email || 'owner@renukachai.com'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1.5">
              Default Chai Rate Per Cup (₹)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-[#C45A0A] pointer-events-none">
                <IndianRupee className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.5"
                min="1"
                value={defaultRate}
                onChange={(e) => setDefaultRate(parseFloat(e.target.value) || 10)}
                className="w-full pl-10 pr-4 py-3 bg-[#FFF6EC] border border-[#F3DEC9] rounded-2xl text-sm font-bold text-[#181818] focus:outline-none focus:ring-2 focus:ring-[#C45A0A]"
              />
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1">
              New customers will automatically inherit this rate per cup.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#5B2D16] hover:bg-[#321707] text-[#FFF6EC] font-bold text-xs shadow-cafe-md transition-all active:scale-[0.98]"
          >
            Save Default Settings
          </button>
        </form>
      </div>

      {/* Sync & Refresh */}
      <div className="bg-[#FBEBDD] rounded-3xl p-4 border border-[#F3DEC9] shadow-cafe-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#181818]">
              Refresh Khata Sync
            </h4>
            <p className="text-[11px] text-[#6B7280]">
              Synchronize today calculations with PostgreSQL
            </p>
          </div>
          <button
            onClick={handleRefreshData}
            className="p-2.5 rounded-xl bg-[#FFF6EC] hover:bg-[#FFE7CC] text-[#5B2D16] border border-[#F3DEC9] transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security & System Info */}
      <div className="bg-[#FFE7CC]/50 rounded-2xl p-3.5 border border-[#F3DEC9] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#5B2D16]">
          <ShieldCheck className="w-4 h-4 text-[#16803C]" />
          <span className="font-semibold">PostgreSQL & JWT Secured</span>
        </div>
        <span className="text-[10px] text-[#6B7280] font-medium">v1.0.0 Production</span>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3.5 rounded-2xl bg-[#FCE8E6] hover:bg-[#F8C4C0] text-[#DC2626] font-bold text-xs flex items-center justify-center gap-2 transition-all border border-[#F8C4C0] active:scale-[0.98]"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of Renuka Chai Centre</span>
      </button>
    </div>
  );
};
