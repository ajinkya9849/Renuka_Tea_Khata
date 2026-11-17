import React, { useEffect, useState } from 'react';
import { BarChart3, Calendar, ArrowUpRight, ArrowDownLeft, FileText, Download } from 'lucide-react';
import { api } from '../services/api';
import { DailyReportResponse, Customer } from '../types';
import { useKhataStore } from '../store/useKhataStore';
import { formatCurrency } from '../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { customers } = useKhataStore();
  const [reportData, setReportData] = useState<DailyReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | ''>('');
  const [ledgerData, setLedgerData] = useState<any | null>(null);

  useEffect(() => {
    loadDailyReport();
  }, []);

  const loadDailyReport = async () => {
    setLoading(true);
    try {
      const data = await api.reports.getDaily(30);
      setReportData(data);
    } catch (err) {
      console.error('Failed to load daily reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerLedger = async (cId: number) => {
    setSelectedCustomerId(cId);
    try {
      const data = await api.reports.getCustomerLedger(cId);
      setLedgerData(data);
    } catch (err) {
      console.error('Failed to load customer ledger:', err);
    }
  };

  const exportDailyCSV = () => {
    if (!reportData || reportData.items.length === 0) return;
    const headers = 'Date,Chai Cups,Chai Sales (INR),Payments Collected (INR),Net Change (INR)\n';
    const rows = reportData.items.map(item => 
      `${item.report_date},${item.total_cups},${item.chai_sales_amount},${item.payments_collected},${item.net_change}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `renuka_daily_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-xl font-extrabold text-[#181818] tracking-tight">
            Sales & Khata Reports
          </h2>
          <p className="text-xs text-[#6B7280]">
            Daily chai summary and ledger statements
          </p>
        </div>
        <button
          onClick={exportDailyCSV}
          className="p-2.5 rounded-2xl bg-[#FBEBDD] text-[#5B2D16] hover:bg-[#FFE7CC] border border-[#F3DEC9] flex items-center gap-1.5 text-xs font-bold transition-all shadow-cafe-sm"
          title="Export CSV"
        >
          <Download className="w-4 h-4 text-[#C45A0A]" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Aggregate Cards */}
      {reportData && (
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-[#FBEBDD] rounded-2xl p-3 border border-[#F3DEC9] text-center shadow-cafe-sm">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Total Cups
            </span>
            <span className="text-base font-extrabold text-[#5B2D16]">
              {reportData.total_cups}
            </span>
          </div>
          <div className="bg-[#FBEBDD] rounded-2xl p-3 border border-[#F3DEC9] text-center shadow-cafe-sm">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Chai Sales
            </span>
            <span className="text-base font-extrabold text-[#C45A0A]">
              {formatCurrency(reportData.total_sales)}
            </span>
          </div>
          <div className="bg-[#FBEBDD] rounded-2xl p-3 border border-[#F3DEC9] text-center shadow-cafe-sm">
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              Collected
            </span>
            <span className="text-base font-extrabold text-[#16803C]">
              {formatCurrency(reportData.total_collected)}
            </span>
          </div>
        </div>
      )}

      {/* Daily Breakdown List */}
      <div className="bg-[#FBEBDD] rounded-3xl p-4 border border-[#F3DEC9] shadow-cafe-sm">
        <h3 className="text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#C45A0A]" />
          <span>Daily Transaction Activity (Last 30 Days)</span>
        </h3>

        {loading ? (
          <div className="py-6 text-center text-xs text-[#6B7280]">
            Loading daily reports...
          </div>
        ) : reportData?.items.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#6B7280]">
            No daily transactions recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {reportData?.items.map((item) => (
              <div
                key={item.report_date}
                className="bg-[#FFF6EC] rounded-2xl p-3 border border-[#F3DEC9] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#181818] block">
                    {new Date(item.report_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-[11px] font-medium text-[#6B7280]">
                    {item.total_cups} cups served
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-[#C45A0A] block">
                      +{formatCurrency(item.chai_sales_amount)}
                    </span>
                    <span className="font-bold text-[#16803C] text-[11px] block">
                      -{formatCurrency(item.payments_collected)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Ledger Statement Generator */}
      <div className="bg-[#FBEBDD] rounded-3xl p-4 border border-[#F3DEC9] shadow-cafe-sm">
        <h3 className="text-xs font-bold text-[#5B2D16] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#C45A0A]" />
          <span>Customer Ledger Statement</span>
        </h3>

        <select
          value={selectedCustomerId}
          onChange={(e) => handleCustomerLedger(Number(e.target.value))}
          className="w-full py-2.5 px-3 bg-[#FFF6EC] border border-[#F3DEC9] rounded-2xl text-xs font-bold text-[#181818] focus:outline-none mb-3"
        >
          <option value="">Select customer to view statement...</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} (Due: {formatCurrency(c.outstanding_balance)})
            </option>
          ))}
        </select>

        {ledgerData && (
          <div className="space-y-2 bg-[#FFF6EC] p-3 rounded-2xl border border-[#F3DEC9]">
            <div className="flex justify-between text-xs pb-2 border-b border-[#F3DEC9]">
              <span className="font-bold text-[#181818]">{ledgerData.customer.name}</span>
              <span className="font-extrabold text-[#DC2626]">
                Closing Due: {formatCurrency(ledgerData.closing_balance)}
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1.5 text-[11px]">
              {ledgerData.entries.map((entry: any) => (
                <div key={entry.id} className="flex justify-between items-center py-1 border-b border-dashed border-[#F3DEC9]/60">
                  <div>
                    <span className="font-medium text-[#181818] block">{entry.description}</span>
                    <span className="text-[10px] text-[#6B7280]">
                      {new Date(entry.transaction_date).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={Number(entry.debit) > 0 ? 'text-[#C45A0A] font-bold' : 'text-[#16803C] font-bold'}>
                      {Number(entry.debit) > 0 ? `+${formatCurrency(entry.debit)}` : `-${formatCurrency(entry.credit)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
