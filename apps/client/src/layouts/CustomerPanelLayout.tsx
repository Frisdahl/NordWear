import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerPanelHeader from '../components/customer/CustomerPanelHeader';

const CustomerPanelLayout: React.FC = () => {
  return (
    <div className="bg-[#F0F0F0] min-h-screen">
      <CustomerPanelHeader />
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerPanelLayout;