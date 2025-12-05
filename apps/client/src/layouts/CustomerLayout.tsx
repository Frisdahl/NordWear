import React from "react";
import { Outlet } from "react-router-dom";
import CustomerHeader from "../components/customer/CustomerHeader";

const CustomerLayout: React.FC = () => (
  <>
    <CustomerHeader />
    <main className="pt-24">
      <Outlet />
    </main>
  </>
);

export default CustomerLayout;
