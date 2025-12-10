import React from "react";
import { Outlet } from "react-router-dom";
import CustomerHeader from "../components/customer/CustomerHeader";

const CustomerLayout: React.FC = () => (
  <div className="bg-[#f2f1f0] min-h-screen">
    <CustomerHeader />
    <main className="pt-24">
      <Outlet />
    </main>
  </div>
);

export default CustomerLayout;
