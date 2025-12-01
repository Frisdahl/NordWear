import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminNav from "../components/admin/AdminNav";

const AdminLayout: React.FC = () => (
  <>
    <AdminHeader />
    <div className="flex min-h-screen mt-14">
      <AdminNav />
      <main className="w-full px-11">
        <Outlet />
      </main>
    </div>
  </>
);

export default AdminLayout;
