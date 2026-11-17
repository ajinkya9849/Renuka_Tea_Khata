import React from 'react';
import { Coffee, IndianRupee, TrendingUp, AlertCircle } from 'lucide-react';
import { useKhataStore } from '../store/useKhataStore';
import { formatCurrency } from '../utils/formatters';

export const DashboardSummary: React.FC = () => {
  const { summary } = useKhataStore();

  return (
    <div className="px-5 py-2 space-y-3">
      {/* Two Primary Summary Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Card 1: Today Chai Centre */}
        <div className="bg-[#FBEBDD] rounded-2xl p-4 border border-[#F3DEC9] shadow-cafe-sm transition-all hover:shadow-cafe-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280] tracking-wide">
              Today Chai Centre
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FFE7CC] flex items-center justify-center text-[#C45A0A]">
              <Coffee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-[#181818] tracking-tight">
              {summary.today_chai_count}
            </span>
            <span className="text-xs font-medium text-[#6B7280]">cups</span>
          </div>
        </div>

        {/* Card 2: Today Amount */}
        <div className="bg-[#FBEBDD] rounded-2xl p-4 border border-[#F3DEC9] shadow-cafe-sm transition-all hover:shadow-cafe-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280] tracking-wide">
              Today Amount
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FFE7CC] flex items-center justify-center text-[#5B2D16]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-extrabold text-[#181818] tracking-tight">
              {formatCurrency(summary.today_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Overall Outstanding Bar */}
      <div className="bg-[#FFE7CC]/50 rounded-xl px-3.5 py-2 border border-[#F3DEC9] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#5B2D16] font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-[#C45A0A]" />
          <span>Total Outstanding Khata</span>
        </div>
        <div className="font-bold text-[#DC2626]">
          {formatCurrency(summary.total_outstanding_amount)} due
        </div>
      </div>
    </div>
  );
};
