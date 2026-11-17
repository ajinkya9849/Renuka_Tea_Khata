import axios from 'axios';
import {
  Customer,
  CustomerListResponse,
  CustomerCreatePayload,
  Transaction,
  TransactionListResponse,
  ChaiEntryPayload,
  PaymentPayload,
  DashboardSummary,
  TodayTransactionItem,
  DailyReportResponse,
  CustomerLedgerResponse,
  User
} from '../types';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.protocol}//${window.location.hostname}:8000/api`;
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('renuka_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle 401 unauthorized errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('renuka_token');
      localStorage.removeItem('renuka_user');
      // If not already on login page, can redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth APIs
  auth: {
    login: async (email: string, password: string): Promise<{ access_token: string; user: User }> => {
      const res = await apiClient.post('/auth/login', { email, password });
      return res.data;
    },
    demoLogin: async (): Promise<{ access_token: string; user: User }> => {
      const res = await apiClient.post('/auth/demo-login');
      return res.data;
    },
    register: async (name: string, email: string, password: string, shop_name?: string): Promise<{ access_token: string; user: User }> => {
      const res = await apiClient.post('/auth/register', { name, email, password, shop_name });
      return res.data;
    },
    getMe: async (): Promise<User> => {
      const res = await apiClient.get('/auth/me');
      return res.data;
    },
    logout: async () => {
      await apiClient.post('/auth/logout');
    }
  },

  // Customer APIs
  customers: {
    list: async (search?: string, skip: number = 0, limit: number = 100): Promise<CustomerListResponse> => {
      const params: Record<string, any> = { skip, limit };
      if (search && search.trim()) {
        params.search = search.trim();
      }
      const res = await apiClient.get('/customers', { params });
      return res.data;
    },
    search: async (query: string): Promise<Customer[]> => {
      const res = await apiClient.get('/customers/search', { params: { q: query } });
      return res.data;
    },
    get: async (id: number): Promise<Customer> => {
      const res = await apiClient.get(`/customers/${id}`);
      return res.data;
    },
    create: async (data: CustomerCreatePayload): Promise<Customer> => {
      const res = await apiClient.post('/customers', data);
      return res.data;
    },
    update: async (id: number, data: Partial<CustomerCreatePayload>): Promise<Customer> => {
      const res = await apiClient.put(`/customers/${id}`, data);
      return res.data;
    },
    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/customers/${id}`);
    }
  },

  // Transaction APIs
  transactions: {
    addChaiEntry: async (customerId: number, data: ChaiEntryPayload): Promise<Transaction> => {
      const res = await apiClient.post(`/customers/${customerId}/chai-entry`, data);
      return res.data;
    },
    receivePayment: async (customerId: number, data: PaymentPayload): Promise<Transaction> => {
      const res = await apiClient.post(`/customers/${customerId}/payment`, data);
      return res.data;
    },
    list: async (customerId: number, type?: string): Promise<TransactionListResponse> => {
      const params: Record<string, any> = {};
      if (type && type !== 'ALL') {
        params.type = type;
      }
      const res = await apiClient.get(`/customers/${customerId}/transactions`, { params });
      return res.data;
    },
    listPayments: async (customerId: number): Promise<TransactionListResponse> => {
      const res = await apiClient.get(`/customers/${customerId}/payments`);
      return res.data;
    }
  },

  // Dashboard APIs
  dashboard: {
    getSummary: async (): Promise<DashboardSummary> => {
      const res = await apiClient.get('/dashboard/summary');
      return res.data;
    },
    getTodayTransactions: async (): Promise<TodayTransactionItem[]> => {
      const res = await apiClient.get('/dashboard/today-transactions');
      return res.data;
    },
    getOutstandingCustomers: async (): Promise<Customer[]> => {
      const res = await apiClient.get('/dashboard/outstanding-customers');
      return res.data;
    }
  },

  // Reports APIs
  reports: {
    getDaily: async (days: number = 30): Promise<DailyReportResponse> => {
      const res = await apiClient.get('/reports/daily', { params: { days } });
      return res.data;
    },
    getCustomerLedger: async (customerId: number): Promise<CustomerLedgerResponse> => {
      const res = await apiClient.get(`/reports/customer-ledger/${customerId}`);
      return res.data;
    }
  }
};
