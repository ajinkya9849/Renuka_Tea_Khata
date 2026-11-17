import React, { useState } from 'react';
import { Minus, Plus, CheckCircle, Sparkles, IndianRupee } from 'lucide-react';
import { Customer } from '../types';
import { useKhataStore } from '../store/useKhataStore';
import { formatCurrency } from '../utils/formatters';

interface ChaiEntryFormProps {
  customer: Customer;
  onSuccess?: () => void;
}

export const ChaiEntryForm: React.FC<ChaiEntryFormProps> = ({ customer, onSuccess }) => {
  const { addChaiEntry, isSubmitting } = useKhataStore();
  const [quantity, setQuantity] = useState<number>(1);
  const [rate, setRate] = useState<number>(Number(customer.rate_per_cup) || 10);
  const [notes, setNotes] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [lastSavedAmount, setLastSavedAmount] = useState<number | null>(null);

  const totalAmount = quantity * rate;

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuickAdd = (amount: number) => {
    setQuantity(prev => prev + amount);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || rate <= 0) return;

    const res = await addChaiEntry(customer.id, {
      quantity,
      rate_per_cup: rate,
      notes: notes.trim() || undefined,
    });

    if (res) {
      setLastSavedAmount(totalAmount);
      setShowSuccessToast(true);
      setQuantity(1);
      setNotes('');
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 2500);
    }
  };

  return (
    <div className="bg-[#FBEBDD] rounded-3xl p-5 border border-[#F3DEC9] shadow-cafe-md relative overflow-hidden">
      {/* Instant Success Banner */}
      {showSuccessToast && (
        <div className="absolute top-2 left-4 right-4 bg-[#16803C] text-[#FFF6EC] py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold shadow-cafe-md animate-bounce">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#FFF6EC]" />
            <span>Entry saved! +{formatCurrency(lastSavedAmount)}</span>
          </div>
          <span className="text-[10px] opacity-80">Ready for next</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-[#181818] text-base tracking-tight flex items-center gap-1.5">
          <span>Add Chai Centre</span>
          <Sparkles className="w-4 h-4 text-[#C45A0A]" />
        </h3>
        <span className="text-xs font-semibold text-[#6B7280]">
          Fast Entry
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Quantity Stepper Selector */}
        <div className="flex flex-col items-center justify-center py-2">
          <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
            Select Cups Quantity
          </label>
          <div className="flex items-center gap-5">
            {/* Minus Button */}
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1 || isSubmitting}
              className="w-13 h-13 w-12 h-12 rounded-2xl bg-[#FFF6EC] hover:bg-[#FFE7CC] active:scale-90 text-[#5B2D16] border border-[#F3DEC9] flex items-center justify-center transition-all disabled:opacity-40 shadow-cafe-sm"
              aria-label="Decrease quantity"
            >
              <Minus className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Giant Number Display */}
            <div className="min-w-[80px] text-center">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center text-4xl font-extrabold text-[#5B2D16] bg-transparent focus:outline-none focus:ring-0 selection:bg-[#FFE7CC]"
              />
              <span className="block text-xs font-medium text-[#6B7280] mt-0.5">
                {quantity === 1 ? 'cup' : 'cups'}
              </span>
            </div>

            {/* Plus Button */}
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isSubmitting}
              className="w-12 h-12 rounded-2xl bg-[#5B2D16] hover:bg-[#321707] active:scale-90 text-[#FFF6EC] flex items-center justify-center transition-all shadow-cafe-md"
              aria-label="Increase quantity"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Quick Increment Preset Chips */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {[1, 2, 4, 6, 9, 15].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleQuickAdd(amt)}
              className="py-1.5 px-2.5 rounded-xl bg-[#FFF6EC] hover:bg-[#FFE7CC] text-xs font-bold text-[#5B2D16] border border-[#F3DEC9] transition-all active:scale-95 shadow-cafe-sm"
            >
              +{amt}
            </button>
          ))}
        </div>

        {/* Rate Per Cup & Live Calculation */}
        <div className="bg-[#FFF6EC] rounded-2xl p-3.5 border border-[#F3DEC9] flex items-center justify-between">
          <div>
            <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Rate per cup
            </label>
            <div className="flex items-center gap-1 mt-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#C45A0A]" />
              <input
                type="number"
                step="0.5"
                min="1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 10)}
                className="w-16 text-sm font-bold text-[#181818] bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Amount Display */}
          <div className="text-right">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Entry Amount
            </span>
            <span className="text-lg font-extrabold text-[#C45A0A]">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add note (optional, e.g. Special ginger tea)"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF6EC] border border-[#F3DEC9] text-xs font-medium text-[#181818] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#C45A0A]"
          />
        </div>

        {/* Save Entry Button */}
        <button
          type="submit"
          disabled={isSubmitting || quantity <= 0}
          className="w-full py-3.5 rounded-2xl bg-[#5B2D16] hover:bg-[#321707] text-[#FFF6EC] font-bold text-sm tracking-wide shadow-cafe-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Saving Chai Entry...</span>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-[#FFE7CC]" />
              <span>Save Entry ({formatCurrency(totalAmount)})</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
