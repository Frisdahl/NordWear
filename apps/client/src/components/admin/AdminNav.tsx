import React from "react";
import { NavLink } from "react-router-dom";
import AnalyticsSvg from "@/assets/admin/svgs/analytics-icon.svg?raw";
import DashboardSvg from "@/assets/admin/svgs/dashboard-icon.svg?raw";
import productsSvg from "@/assets/admin/svgs/products-icon.svg?raw";
import categoriesSvg from "@/assets/admin/svgs/categories-icon.svg?raw";
import ordersSvg from "@/assets/admin/svgs/orders-icon.svg?raw";
import settingsSvg from "@/assets/admin/svgs/settings-icon.svg?raw";
import Icon from "../Icon";

const items = [
  { label: "Dashboard", path: "/admin/dashboard", svg: DashboardSvg },
  { label: "Produkter", path: "/admin/all-products", svg: productsSvg },
  {
    label: "Kategorier / Kollektioner",
    path: "/admin/categories",
    svg: categoriesSvg,
  },
  { label: "Order", path: "/admin/orders", svg: ordersSvg },
  { label: "Analytics", path: "/admin/analytics", svg: AnalyticsSvg },
  { label: "Indstillinger", path: "/admin/settings", svg: settingsSvg },
];

const AdminNav: React.FC = () => {
  return (
    <div className="pl-6 pr-6 pt-14 bg-[#ebebeb]">
      <nav>
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex gap-2 items-center px-6 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-[#181C2D] text-white" : "text-[#2D2F36]"
                  }`
                }
              >
                <Icon
                  src={item.svg}
                  className="h-6 w-6 stroke-[#2D2F36]"
                  strokeWidth={2}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminNav;
