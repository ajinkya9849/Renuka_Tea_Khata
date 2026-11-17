import React, { useState } from 'react';
import { IndianRupee, CheckCircle, AlertCircle, ArrowDownCircle } from 'lucide-react';
import { Customer } from '../types';
import { useKhataStore } from '../store/useKhataStore';
import { formatCurrency } from '../utils/formatters';

interface PaymentFormProps {
  customer: Customer;
  onSuccess?: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ customer, onSuccess }) => {
  const { receivePayment, isSubmitting } = useKhataStore();
  const currentOutstanding = Number(customer.outstanding_balance);

  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('Cash / UPI Payment');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [lastPaymentAmount, setLastPaymentAmount] = useState<number | null>(null);

  const numAmount = parseFloat(amount) || 0;
  const remainingDue = Math.max(0, currentOutstanding - numAmount);
  const isOverpayment = numAmount > currentOutstanding;

  const handleQuickAmount = (val: number) => {
    const finalVal = Math.min(val, currentOutstanding);
    setAmount(finalVal.toString());
    setErrorMessage(null);
  };

  const handleFullSettle = () => {
    setAmount(currentOutstanding.toString());
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numAmount <= 0) {
      setErrorMessage('Please enter a payment amount greater than ₹0');
      return;
    }

    if (numAmount > currentOutstanding) {
      setErrorMessage(`Payment cannot exceed outstanding due of ${formatCurrency(currentOutstanding)}`);
      return;
    }

    const res = await receivePayment(customer.id, {
      amount: numAmount,
      notes: notes.trim() || undefined,
    });

    if (res) {
      setLastPaymentAmount(numAmount);
      setShowSuccessToast(true);
      setAmount('');
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 2500);
    }
  };

  return (
    <div className="bg-[#FBEBDD] rounded-3xl p-5 border border-[#F3DEC9] shadow-cafe-md relative overflow-hidden">
      {/* Success Notification */}
      {showSuccessToast && (
        <div className="absolute top-2 left-4 right-4 bg-[#16803C] text-[#FFF6EC] py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold shadow-cafe-md animate-bounce">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#FFF6EC]" />
            <span>Payment received! {formatCurrency(lastPaymentAmount)}</span>
          </div>
          <span className="text-[10px] opacity-80">Ledger updated</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-[#181818] text-base tracking-tight flex items-center gap-1.5">
            <span>Receive Payment</span>
            <ArrowDownCircle className="w-4 h-4 text-[#16803C]" />
          </h3>
          <p className="text-xs text-[#6B7280]">
            Customer: <strong className="text-[#181818]">{customer.name}</strong>
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Current Due
          </span>
          <span className="text-base font-extrabold text-[#DC2626]">
            {formatCurrency(currentOutstanding)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Amount Input */}
        <div>
          <label className="block text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-1.5">
            Payment Amount
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-xl font-bold text-[#C45A0A] pointer-events-none">
              ₹
            </div>
            <input
              type="number"
              step="1"
              min="1"
              max={currentOutstanding}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="e.g. 100"
              className="w-full pl-9 pr-4 py-3.5 bg-[#FFF6EC] border border-[#F3DEC9] rounded-2xl text-xl font-extrabold text-[#181818] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#16803C] shadow-cafe-inner"
            />
          </div>
          {errorMessage && (
            <p className="text-xs text-[#DC2626] font-semibold mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
            Quick Select
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 200, 500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickAmount(preset)}
                className="py-2 rounded-xl bg-[#FFF6EC] hover:bg-[#FFE7CC] text-xs font-bold text-[#5B2D16] border border-[#F3DEC9] transition-all active:scale-95 shadow-cafe-sm"
              >
                ₹{preset}
              </button>
            ))}
          </div>

          {currentOutstanding > 0 && (
            <button
              type="button"
              onClick={handleFullSettle}
              className="w-full mt-2 py-1.5 rounded-xl bg-[#FFE7CC] hover:bg-[#F3DEC9] text-xs font-bold text-[#C45A0A] border border-[#F3DEC9] transition-all"
            >
              Full Due Settlement ({formatCurrency(currentOutstanding)})
            </button>
          )}
        </div>

        {/* Remaining Due After Payment Calculation */}
        <div className="bg-[#FFF6EC] rounded-2xl p-3.5 border border-[#F3DEC9] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Remaining Due After Payment
            </span>
            <span className={`text-lg font-extrabold ${remainingDue === 0 ? 'text-[#16803C]' : 'text-[#DC2626]'}`}>
              {formatCurrency(remainingDue)}
            </span>
          </div>
          {remainingDue === 0 && numAmount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E6F4EA] text-[#16803C]">
              Will Settle Full Khata
            </span>
          )}
        </div>

        {/* Notes */}
        <div>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment mode (Cash, UPI GPay, PhonePe)"
            className="w-full px-3.5 py-2 rounded-xl bg-[#FFF6EC] border border-[#F3DEC9] text-xs font-medium text-[#181818] placeholder-[#9CA3AF] focus:outline-none"
          />
        </div>

        {/* Receive Payment Button */}
        <button
          type="submit"
          disabled={isSubmitting || numAmount <= 0 || isOverpayment}
          className="w-full py-3.5 rounded-2xl bg-[#16803C] hover:bg-[#126b32] text-[#FFF6EC] font-bold text-sm tracking-wide shadow-cafe-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing Payment...</span>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-[#FFF6EC]" />
              <span>Receive Payment ({formatCurrency(numAmount)})</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
