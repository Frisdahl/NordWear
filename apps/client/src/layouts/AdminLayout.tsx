import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminNav from "../components/admin/AdminNav";

const AdminLayout: React.FC = () => (
  <>
    <AdminHeader />
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="w-full px-11 pt-14 bg-[#f2f2f2]">
        <Outlet />
      </main>
    </div>
  </>
);

export default AdminLayout;
