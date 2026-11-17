import React, { useState } from 'react';
import { Coffee, ArrowDownCircle, History, Clock } from 'lucide-react';
import { Customer, Transaction } from '../types';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';

interface TransactionHistoryProps {
  customer: Customer;
  transactions: Transaction[];
  onReceivePaymentClick?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  customer,
  transactions,
  onReceivePaymentClick
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CHAI_ENTRY' | 'PAYMENT'>('ALL');

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'ALL') return true;
    return tx.transaction_type === activeTab;
  });

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-[#FBEBDD] p-1 rounded-2xl border border-[#F3DEC9]">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'ALL'
              ? 'bg-[#5B2D16] text-[#FFF6EC] shadow-cafe-sm'
              : 'text-[#6B7280] hover:text-[#181818]'
          }`}
        >
          All ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('CHAI_ENTRY')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'CHAI_ENTRY'
              ? 'bg-[#5B2D16] text-[#FFF6EC] shadow-cafe-sm'
              : 'text-[#6B7280] hover:text-[#181818]'
          }`}
        >
          Chai Centre
        </button>
        <button
          onClick={() => setActiveTab('PAYMENT')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'PAYMENT'
              ? 'bg-[#5B2D16] text-[#FFF6EC] shadow-cafe-sm'
              : 'text-[#6B7280] hover:text-[#181818]'
          }`}
        >
          Payment
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="bg-[#FBEBDD]/60 rounded-2xl p-8 text-center border border-[#F3DEC9]">
            <History className="w-8 h-8 text-[#C45A0A] mx-auto mb-2 opacity-60" />
            <p className="text-xs font-semibold text-[#6B7280]">
              No transactions found in this tab
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isChai = tx.transaction_type === 'CHAI_ENTRY';

            return (
              <div
                key={tx.id}
                className="bg-[#FBEBDD] rounded-2xl p-3.5 border border-[#F3DEC9] shadow-cafe-sm flex items-center justify-between transition-all hover:bg-[#FFE7CC]/50"
              >
                {/* Left: Icon and Details */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-cafe-inner ${
                      isChai
                        ? 'bg-[#FFE7CC] text-[#C45A0A]'
                        : 'bg-[#E6F4EA] text-[#16803C]'
                    }`}
                  >
                    {isChai ? (
                      <Coffee className="w-5 h-5" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#181818] leading-tight">
                      {isChai
                        ? `${tx.quantity} Chai Centre added`
                        : 'Payment received'}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#6B7280]">
                      <Clock className="w-3 h-3 text-[#C45A0A]" />
                      <span>{formatRelativeTime(tx.transaction_date)}</span>
                      {tx.notes && (
                        <span className="text-[11px] text-[#6B7280]/80 italic">
                          • {tx.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Balance */}
                <div className="text-right">
                  <span
                    className={`text-sm font-extrabold block ${
                      isChai ? 'text-[#C45A0A]' : 'text-[#16803C]'
                    }`}
                  >
                    {isChai ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                  </span>
                  <span className="text-[10px] font-semibold text-[#6B7280]">
                    Bal: {formatCurrency(tx.balance_after)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-[#FFE7CC]/60 rounded-2xl p-4 border border-[#F3DEC9] grid grid-cols-3 gap-2 text-center shadow-cafe-sm">
        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Total Chai
          </span>
          <span className="text-sm font-extrabold text-[#181818]">
            {customer.total_cups} cups
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Total Amount
          </span>
          <span className="text-sm font-extrabold text-[#181818]">
            {formatCurrency(customer.total_amount)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            Balance Due
          </span>
          <span className="text-sm font-extrabold text-[#DC2626]">
            {formatCurrency(customer.outstanding_balance)}
          </span>
        </div>
      </div>

      {/* Receive Payment Action Button */}
      {onReceivePaymentClick && Number(customer.outstanding_balance) > 0 && (
        <button
          onClick={onReceivePaymentClick}
          className="w-full py-3.5 rounded-2xl bg-[#16803C] hover:bg-[#126b32] text-[#FFF6EC] font-bold text-sm tracking-wide shadow-cafe-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <ArrowDownCircle className="w-4 h-4 text-[#FFF6EC]" />
          <span>Receive Payment ({formatCurrency(customer.outstanding_balance)})</span>
        </button>
      )}
    </div>
  );
};
