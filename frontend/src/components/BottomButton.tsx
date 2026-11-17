import React from 'react';
import { Plus } from 'lucide-react';
import { useKhataStore } from '../store/useKhataStore';

export const BottomButton: React.FC = () => {
  const { setIsAddCustomerModalOpen } = useKhataStore();

  return (
    <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-5 z-30 pointer-events-none">
      <button
        onClick={() => setIsAddCustomerModalOpen(true)}
        className="pointer-events-auto w-full py-3.5 px-6 rounded-2xl bg-[#5B2D16] hover:bg-[#321707] text-[#FFF6EC] font-bold text-sm flex items-center justify-center gap-2 shadow-cafe-lg active:scale-[0.98] transition-all transform border border-[#C45A0A]/30 backdrop-blur-sm"
      >
        <Plus className="w-5 h-5 text-[#FFE7CC]" />
        <span>Add Customer</span>
      </button>
    </div>
  );
};
