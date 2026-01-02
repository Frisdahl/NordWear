import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import categoriesSvg from "@/assets/admin/svgs/categories-icon.svg?raw";
import ordersSvg from "@/assets/admin/svgs/orders-icon.svg?raw";
import Icon from "../Icon";

const productActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>`;
const productInactiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" /></svg>`;

const analyticsActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>`;
const analyticsInactiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" /></svg>`;

const settingsActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
const settingsInactiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" /></svg>`;

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
  {
    label: "Analytics",
    path: "/admin/analytics",
    svg: analyticsInactiveSvg,
    activeSvg: analyticsActiveSvg,
    activeStroke: 1.5,
  },
  {
    label: "Indstillinger",
    path: "/admin/settings",
    svg: settingsInactiveSvg,
    activeSvg: settingsActiveSvg,
    activeStroke: 1.5,
  },
];

const AdminNav: React.FC = () => {
  const location = useLocation();

  const isItemActive = (item: any) => {
    if (location.pathname === item.path) return true;
    if (item.label === "Produkter") {
      if (location.pathname.startsWith("/admin/add-product")) return true;
    }
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
                            `flex items-center gap-2 pl-8 pr-2 py-2 rounded-lg transition-colors text-[clamp(11px,1.2vw,13px)] group relative ${
                              isActive ? "bg-[#1a1a1a] text-[#f2f2f2]" : "text-[#303030] hover:bg-[#f2f2f2]"
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
                                    className={`h-5 w-5 ${isActive ? "text-[#f2f2f2]" : ""}`}
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
