export interface User {
  id: number;
  name: string;
  email: string;
  shop_name: string;
  created_at: string;
}

export interface Customer {
  id: number;
  user_id: number;
  name: string;
  phone: string | null;
  rate_per_cup: number | string;
  total_cups: number;
  total_amount: number | string;
  total_paid: number | string;
  outstanding_balance: number | string;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'CHAI_ENTRY' | 'PAYMENT';

export interface Transaction {
  id: number;
  user_id: number;
  customer_id: number;
  transaction_type: TransactionType;
  quantity: number | null;
  rate_per_cup: number | string | null;
  amount: number | string;
  balance_before: number | string;
  balance_after: number | string;
  notes: string | null;
  transaction_date: string;
  created_at: string;
}

export interface DashboardSummary {
  today_chai_count: number;
  today_amount: number | string;
  total_customers: number;
  total_outstanding_amount: number | string;
}

export interface TodayTransactionItem {
  id: number;
  customer_id: number;
  customer_name: string;
  transaction_type: TransactionType;
  quantity: number | null;
  amount: number | string;
  balance_after: number | string;
  transaction_date: string;
}

export interface CustomerListResponse {
  items: Customer[];
  total: number;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
}

export interface ChaiEntryPayload {
  quantity: number;
  rate_per_cup?: number;
  notes?: string;
}

export interface PaymentPayload {
  amount: number;
  notes?: string;
}

export interface CustomerCreatePayload {
  name: string;
  phone?: string;
  rate_per_cup: number;
}

export interface DailyReportItem {
  report_date: string;
  total_cups: number;
  chai_sales_amount: number | string;
  payments_collected: number | string;
  net_change: number | string;
}

export interface DailyReportResponse {
  items: DailyReportItem[];
  total_cups: number;
  total_sales: number | string;
  total_collected: number | string;
}

export interface LedgerEntryItem {
  id: number;
  transaction_date: string;
  transaction_type: TransactionType;
  description: string;
  quantity: number | null;
  rate_per_cup: number | string | null;
  debit: number | string;
  credit: number | string;
  balance: number | string;
}

export interface CustomerLedgerResponse {
  customer: Customer;
  entries: LedgerEntryItem[];
  total_debit: number | string;
  total_credit: number | string;
  closing_balance: number | string;
}
