import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { CustomerCard } from './CustomerCard';
import { useKhataStore } from '../store/useKhataStore';

export const CustomerList: React.FC = () => {
  const { customers, isLoading, searchQuery, setIsAddCustomerModalOpen } = useKhataStore();

  if (isLoading && customers.length === 0) {
    return (
      <div className="px-5 py-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#FBEBDD]/60 animate-pulse rounded-2xl p-4 h-16 border border-[#F3DEC9]" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-[#FFE7CC] text-[#5B2D16] flex items-center justify-center mx-auto mb-3 shadow-cafe-sm">
          <Users className="w-7 h-7 text-[#C45A0A]" />
        </div>
        <h3 className="text-base font-bold text-[#181818] mb-1">
          {searchQuery ? `No customers matching "${searchQuery}"` : 'No customers yet'}
        </h3>
        <p className="text-xs text-[#6B7280] max-w-xs mx-auto mb-4">
          {searchQuery 
            ? 'Try searching with a different name or phone number.'
            : 'Add your first customer to start tracking daily chai entries and collections.'}
        </p>
        <button
          onClick={() => setIsAddCustomerModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B2D16] text-[#FFF6EC] text-xs font-bold shadow-cafe-sm active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-2 pb-24">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
          Customers ({customers.length})
        </span>
        <span className="text-[11px] font-medium text-[#C45A0A]">
          Sorted by Balance
        </span>
      </div>
      <div>
        {customers.map((cust) => (
          <CustomerCard key={cust.id} customer={cust} />
        ))}
      </div>
    </div>
  );
};
