import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { AddCustomerModal } from '../components/AddCustomerModal';
import { useAuthStore } from '../store/useAuthStore';
import { useKhataStore } from '../store/useKhataStore';

export const AppLayout: React.FC = () => {
  const { initAuth } = useAuthStore();
  const { fetchSummary, fetchCustomers } = useKhataStore();

  useEffect(() => {
    initAuth();
    fetchSummary();
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex justify-center items-stretch py-0 sm:py-6 sm:px-4">
      {/* Mobile Shell Wrapper with iOS proportions */}
      <div className="w-full max-w-md bg-[#FFF6EC] min-h-screen sm:min-h-[850px] sm:max-h-[95vh] sm:rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden border border-[#F3DEC9]">
        
        {/* Dynamic Safe Area / iOS notch subtle spacer */}
        <div className="h-2 w-full bg-transparent safe-top" />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
          <Outlet />
        </main>

        {/* Global Modal */}
        <AddCustomerModal />

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
};
