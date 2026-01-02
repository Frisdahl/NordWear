import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import AnalyticsSvg from "@/assets/admin/svgs/analytics-icon.svg?raw";
import categoriesSvg from "@/assets/admin/svgs/categories-icon.svg?raw";
import ordersSvg from "@/assets/admin/svgs/orders-icon.svg?raw";
import settingsSvg from "@/assets/admin/svgs/settings-icon.svg?raw";
import Icon from "../Icon";

const productActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>`;
const productInactiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" /></svg>`;

const homeActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>`;
const homeInactiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg>`;

const subLinkIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" /></svg>`;

const items = [
  {
    label: "Hjem",
    path: "/admin/dashboard",
    svg: homeInactiveSvg,
    activeSvg: homeActiveSvg,
    activeStroke: 1.5,
  },
  {
    label: "Produkter",
    path: "/admin/all-products",
    svg: productInactiveSvg,
    activeSvg: productActiveSvg,
    activeStroke: 1.5,
    subItems: [
      { label: "Kollektioner", path: "/admin/categories" },
      { label: "Lager", path: "/admin/inventory" },
      { label: "Ordrer", path: "/admin/orders" },
      { label: "Gavekort", path: "/admin/giftcards" },
    ],
  },
  { label: "Analytics", path: "/admin/analytics", svg: AnalyticsSvg },
  { label: "Indstillinger", path: "/admin/settings", svg: settingsSvg },
];

const AdminNav: React.FC = () => {
  const location = useLocation();

  const isItemActive = (item: any) => {
    if (location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(
        (sub: any) =>
          location.pathname === sub.path ||
          location.pathname.startsWith(sub.path + "/")
      );
    }
    return false;
  };

  return (
    <div className="pl-4 pr-4 pt-8 bg-[#ebebeb] min-w-[240px] rounded-tl-2xl">
      <nav>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = isItemActive(item);
            const hasSubItems = (item as any).subItems;

            if (isActive && hasSubItems) {
              return (
                <li
                  key={item.path}
                  className="bg-[#fafafa] rounded-2xl px-4 pb-4 pt-1"
                >
                  <NavLink
                    to={item.path}
                    className="flex gap-2 items-center px-2 py-3 mb-1 text-[#303030]"
                  >
                    <Icon
                      src={
                        (item as any).activeSvg
                          ? (item as any).activeSvg
                          : item.svg
                      }
                      className="h-5 w-5"
                      strokeWidth={2}
                    />
                    <span className="whitespace-nowrap font-bold text-[clamp(11px,1.2vw,13px)]">
                      {item.label}
                    </span>
                  </NavLink>
                  <ul className="flex flex-col gap-1 mt-1">
                    {(item as any).subItems.map((sub: any) => (
                      <li key={sub.path}>
                        <NavLink
                          to={sub.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 pl-8 pr-2 py-2 rounded-lg transition-colors text-[clamp(11px,1.2vw,13px)] text-[#303030] group relative ${
                              isActive ? "bg-white" : "hover:bg-[#f2f2f2]"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                <div
                                  className={`transition-opacity ${
                                    isActive
                                      ? "opacity-100"
                                      : "opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  <Icon
                                    src={subLinkIcon}
                                    className="h-5 w-5"
                                    strokeWidth={1.5}
                                  />
                                </div>
                              </div>
                              <span className="whitespace-nowrap font-normal">
                                {sub.label}
                              </span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex gap-2 items-center px-6 py-2 rounded-lg transition-colors font-bold text-[clamp(11px,1.2vw,13px)] ${
                      isActive
                        ? "bg-[#fafafa] text-[#303030]"
                        : "text-[#303030]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        src={
                          isActive && (item as any).activeSvg
                            ? (item as any).activeSvg
                            : item.svg
                        }
                        className="h-5 w-5"
                        strokeWidth={
                          isActive && (item as any).activeStroke
                            ? (item as any).activeStroke
                            : 2
                        }
                      />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminNav;
