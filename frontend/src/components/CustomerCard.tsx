import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Phone } from 'lucide-react';
import { Customer } from '../types';
import { formatCurrency, getInitials } from '../utils/formatters';

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const navigate = useNavigate();
  const balance = Number(customer.outstanding_balance);
  const isSettled = balance <= 0;

  return (
    <div
      onClick={() => navigate(`/customers/${customer.id}`)}
      className="bg-[#FBEBDD] hover:bg-[#FFE7CC]/70 active:scale-[0.99] border border-[#F3DEC9] rounded-2xl p-3.5 mb-2.5 shadow-cafe-sm transition-all duration-150 cursor-pointer flex items-center justify-between group"
    >
      {/* Left: Initials Avatar + Name & Cups */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-full bg-[#FFE7CC] text-[#5B2D16] border border-[#F3DEC9] flex items-center justify-center font-bold text-sm tracking-tight flex-shrink-0 shadow-cafe-inner">
          {getInitials(customer.name)}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-[#181818] text-sm tracking-tight truncate group-hover:text-[#5B2D16] transition-colors">
            {customer.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-semibold text-[#6B7280]">
              {customer.total_cups} cups
            </span>
            {customer.phone && (
              <span className="text-[11px] text-[#6B7280]/80 flex items-center gap-0.5">
                • {customer.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Status / Due Badge + Chevron */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="text-right">
          {isSettled ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#16803C] border border-[#C2E7CE]">
              Settled
            </span>
          ) : (
            <div className="flex flex-col items-end">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FCE8E6] text-[#DC2626] border border-[#F8C4C0]">
                {formatCurrency(balance)} due
              </span>
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-[#C45A0A] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
