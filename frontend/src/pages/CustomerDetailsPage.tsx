import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, Coffee, IndianRupee, Clock } from 'lucide-react';
import { useKhataStore } from '../store/useKhataStore';
import { ChaiEntryForm } from '../components/ChaiEntryForm';
import { PaymentForm } from '../components/PaymentForm';
import { TransactionHistory } from '../components/TransactionHistory';
import { formatCurrency } from '../utils/formatters';

export const CustomerDetailsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { selectedCustomer, fetchCustomer, transactions, fetchTransactions, isLoading } = useKhataStore();

  const [activeTab, setActiveTab] = useState<'ENTRY' | 'PAYMENT' | 'HISTORY'>('ENTRY');

  const id = parseInt(customerId || '0', 10);

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
      fetchTransactions(id);
    }
  }, [id]);

  if (isLoading && !selectedCustomer) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-[#C45A0A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-[#6B7280]">Loading customer khata...</p>
      </div>
    );
  }

  if (!selectedCustomer) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm font-bold text-[#DC2626] mb-3">Customer not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#5B2D16] text-[#FFF6EC] rounded-xl text-xs font-bold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const customerSince = new Date(selectedCustomer.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-[#FBEBDD] text-[#5B2D16] hover:bg-[#FFE7CC] flex items-center justify-center transition-all shadow-cafe-sm active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-base font-extrabold text-[#181818] tracking-tight">
            {selectedCustomer.name}
          </h2>
          <span className="text-[11px] font-semibold text-[#C45A0A]">
            Customer Khata
          </span>
        </div>
        {selectedCustomer.phone ? (
          <a
            href={`tel:${selectedCustomer.phone}`}
            className="w-10 h-10 rounded-full bg-[#E6F4EA] text-[#16803C] hover:bg-[#C2E7CE] flex items-center justify-center transition-all shadow-cafe-sm"
            title="Call Customer"
          >
            <Phone className="w-4 h-4" />
          </a>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Customer Information Card */}
      <div className="bg-[#FBEBDD] rounded-3xl p-4 border border-[#F3DEC9] shadow-cafe-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#F3DEC9]/60">
          <div>
            <h3 className="font-extrabold text-[#181818] text-lg tracking-tight">
              {selectedCustomer.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#C45A0A]" />
              <span>Customer Since: {customerSince}</span>
            </div>
          </div>
          {selectedCustomer.phone && (
            <span className="text-xs font-semibold text-[#5B2D16] bg-[#FFE7CC] px-2.5 py-1 rounded-full">
              {selectedCustomer.phone}
            </span>
          )}
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-[#FFF6EC] rounded-2xl p-2.5 border border-[#F3DEC9]">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Total Chai
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Coffee className="w-3.5 h-3.5 text-[#C45A0A]" />
              <span className="text-sm font-extrabold text-[#181818]">
                {selectedCustomer.total_cups}
              </span>
            </div>
          </div>

          <div className="bg-[#FFF6EC] rounded-2xl p-2.5 border border-[#F3DEC9]">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Total Amount
            </span>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              <span className="text-sm font-extrabold text-[#181818]">
                {formatCurrency(selectedCustomer.total_amount)}
              </span>
            </div>
          </div>

          <div className="bg-[#FFF6EC] rounded-2xl p-2.5 border border-[#F3DEC9]">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Balance Due
            </span>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              <span className={`text-sm font-extrabold ${Number(selectedCustomer.outstanding_balance) > 0 ? 'text-[#DC2626]' : 'text-[#16803C]'}`}>
                {formatCurrency(selectedCustomer.outstanding_balance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Large Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab('ENTRY')}
          className={`py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-cafe-sm ${
            activeTab === 'ENTRY'
              ? 'bg-[#5B2D16] text-[#FFF6EC] ring-2 ring-[#C45A0A] shadow-cafe-md'
              : 'bg-[#FBEBDD] text-[#5B2D16] hover:bg-[#FFE7CC] border border-[#F3DEC9]'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Add Chai Centre</span>
        </button>

        <button
          onClick={() => setActiveTab('PAYMENT')}
          className={`py-3 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-cafe-sm ${
            activeTab === 'PAYMENT'
              ? 'bg-[#16803C] text-[#FFF6EC] ring-2 ring-[#126b32] shadow-cafe-md'
              : 'bg-[#FBEBDD] text-[#16803C] hover:bg-[#FFE7CC] border border-[#F3DEC9]'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Receive Payment</span>
        </button>
      </div>

      {/* Tab Switcher for Transaction History */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`text-xs font-bold py-1.5 px-3 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'HISTORY'
              ? 'bg-[#FFE7CC] text-[#5B2D16]'
              : 'text-[#6B7280] hover:text-[#181818]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#C45A0A]" />
          <span>View Transaction History ({transactions.length})</span>
        </button>
      </div>

      {/* Content depending on active tab */}
      {activeTab === 'ENTRY' && (
        <ChaiEntryForm
          customer={selectedCustomer}
          onSuccess={() => {
            fetchTransactions(selectedCustomer.id);
          }}
        />
      )}

      {activeTab === 'PAYMENT' && (
        <PaymentForm
          customer={selectedCustomer}
          onSuccess={() => {
            fetchTransactions(selectedCustomer.id);
          }}
        />
      )}

      {activeTab === 'HISTORY' && (
        <TransactionHistory
          customer={selectedCustomer}
          transactions={transactions}
          onReceivePaymentClick={() => setActiveTab('PAYMENT')}
        />
      )}
    </div>
  );
};
