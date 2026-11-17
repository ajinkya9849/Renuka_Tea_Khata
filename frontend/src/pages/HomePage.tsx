import React, { useEffect } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { DashboardSummary } from '../components/DashboardSummary';
import { CustomerSearch } from '../components/CustomerSearch';
import { CustomerList } from '../components/CustomerList';
import { BottomButton } from '../components/BottomButton';
import { useKhataStore } from '../store/useKhataStore';

export const HomePage: React.FC = () => {
  const { fetchSummary, fetchCustomers } = useKhataStore();

  useEffect(() => {
    fetchSummary();
    fetchCustomers();
  }, []);

  return (
    <div className="relative min-h-full">
      {/* Header */}
      <DashboardHeader />

      {/* Dashboard Summary Cards */}
      <DashboardSummary />

      {/* Prominent Instant Customer Search */}
      <CustomerSearch />

      {/* Customer List */}
      <CustomerList />

      {/* Sticky Bottom + Add Customer Button */}
      <BottomButton />
    </div>
  );
};
