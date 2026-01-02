import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminNav from "../components/admin/AdminNav";

const AdminLayout: React.FC = () => (
  <>
    <AdminHeader />
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <AdminNav />
      <main className="w-full px-11 pt-8 bg-[#f2f2f2] rounded-tr-2xl">
        <Outlet />
      </main>
    </div>
  </>
);

export default AdminLayout;
