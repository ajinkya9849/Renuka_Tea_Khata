import { create } from 'zustand';
import { Customer, Transaction, DashboardSummary, ChaiEntryPayload, PaymentPayload, CustomerCreatePayload } from '../types';
import { api } from '../services/api';

interface KhataState {
  summary: DashboardSummary;
  customers: Customer[];
  selectedCustomer: Customer | null;
  transactions: Transaction[];
  searchQuery: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isAddCustomerModalOpen: boolean;

  fetchSummary: () => Promise<void>;
  fetchCustomers: (search?: string) => Promise<void>;
  fetchCustomer: (id: number) => Promise<Customer | null>;
  fetchTransactions: (customerId: number, type?: string) => Promise<void>;
  addChaiEntry: (customerId: number, payload: ChaiEntryPayload) => Promise<Transaction | null>;
  receivePayment: (customerId: number, payload: PaymentPayload) => Promise<Transaction | null>;
  createCustomer: (payload: CustomerCreatePayload) => Promise<Customer | null>;
  deleteCustomer: (id: number) => Promise<boolean>;
  setSearchQuery: (q: string) => void;
  setIsAddCustomerModalOpen: (open: boolean) => void;
  clearError: () => void;
}

export const useKhataStore = create<KhataState>((set, get) => ({
  summary: {
    today_chai_count: 0,
    today_amount: 0,
    total_customers: 0,
    total_outstanding_amount: 0
  },
  customers: [],
  selectedCustomer: null,
  transactions: [],
  searchQuery: '',
  isLoading: false,
  isSubmitting: false,
  error: null,
  isAddCustomerModalOpen: false,

  fetchSummary: async () => {
    try {
      const summary = await api.dashboard.getSummary();
      set({ summary });
    } catch (err: any) {
      console.error('Failed to fetch summary:', err);
    }
  },

  fetchCustomers: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const term = search !== undefined ? search : get().searchQuery;
      const res = await api.customers.list(term);
      set({ customers: res.items, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load customers', isLoading: false });
    }
  },

  fetchCustomer: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await api.customers.get(id);
      set({ selectedCustomer: customer, isLoading: false });
      return customer;
    } catch (err: any) {
      set({ error: err.message || 'Failed to load customer details', isLoading: false });
      return null;
    }
  },

  fetchTransactions: async (customerId: number, type?: string) => {
    try {
      const res = await api.transactions.list(customerId, type);
      set({ transactions: res.items });
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
    }
  },

  addChaiEntry: async (customerId: number, payload: ChaiEntryPayload) => {
    set({ isSubmitting: true, error: null });
    try {
      const tx = await api.transactions.addChaiEntry(customerId, payload);
      
      // Update selected customer state
      const current = get().selectedCustomer;
      if (current && current.id === customerId) {
        const updated = {
          ...current,
          total_cups: current.total_cups + payload.quantity,
          total_amount: Number(current.total_amount) + Number(tx.amount),
          outstanding_balance: Number(tx.balance_after)
        };
        set({ selectedCustomer: updated });
      }

      // Update customers list
      const updatedCustomers = get().customers.map(c => {
        if (c.id === customerId) {
          return {
            ...c,
            total_cups: c.total_cups + payload.quantity,
            total_amount: Number(c.total_amount) + Number(tx.amount),
            outstanding_balance: Number(tx.balance_after)
          };
        }
        return c;
      });

      // Prepend to transactions
      set({
        customers: updatedCustomers,
        transactions: [tx, ...get().transactions],
        isSubmitting: false
      });

      // Refresh dashboard summary in background
      get().fetchSummary();
      return tx;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to save chai entry';
      set({ error: msg, isSubmitting: false });
      return null;
    }
  },

  receivePayment: async (customerId: number, payload: PaymentPayload) => {
    set({ isSubmitting: true, error: null });
    try {
      const tx = await api.transactions.receivePayment(customerId, payload);

      // Update selected customer
      const current = get().selectedCustomer;
      if (current && current.id === customerId) {
        const updated = {
          ...current,
          total_paid: Number(current.total_paid) + Number(tx.amount),
          outstanding_balance: Number(tx.balance_after)
        };
        set({ selectedCustomer: updated });
      }

      // Update customer list
      const updatedCustomers = get().customers.map(c => {
        if (c.id === customerId) {
          return {
            ...c,
            total_paid: Number(c.total_paid) + Number(tx.amount),
            outstanding_balance: Number(tx.balance_after)
          };
        }
        return c;
      });

      set({
        customers: updatedCustomers,
        transactions: [tx, ...get().transactions],
        isSubmitting: false
      });

      get().fetchSummary();
      return tx;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to receive payment';
      set({ error: msg, isSubmitting: false });
      return null;
    }
  },

  createCustomer: async (payload: CustomerCreatePayload) => {
    set({ isSubmitting: true, error: null });
    try {
      const newCustomer = await api.customers.create(payload);
      set({
        customers: [newCustomer, ...get().customers],
        isSubmitting: false,
        isAddCustomerModalOpen: false
      });
      get().fetchSummary();
      return newCustomer;
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to create customer';
      set({ error: msg, isSubmitting: false });
      return null;
    }
  },

  deleteCustomer: async (id: number) => {
    try {
      await api.customers.delete(id);
      set({
        customers: get().customers.filter(c => c.id !== id),
        selectedCustomer: null
      });
      get().fetchSummary();
      return true;
    } catch {
      return false;
    }
  },

  setSearchQuery: (q: string) => {
    set({ searchQuery: q });
  },

  setIsAddCustomerModalOpen: (open: boolean) => {
    set({ isAddCustomerModalOpen: open, error: null });
  },

  clearError: () => set({ error: null })
}));
