import React from "react";
import { Link } from "react-router-dom";
import clockSvg from "@/assets/admin/svgs/clock-icon.svg?raw";
import ArrowSvg from "@/assets/admin/svgs/arrow-down-icon.svg?raw";
import Icon from "../Icon";
import { useAuth } from "@/contexts/AuthContext";

const searchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`;

const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || "Admin User";
  const initials = getInitials(displayName);

  return (
    <header className="text-[#e3e3e3] px-11 h-[60px] bg-[#1a1a1a] flex items-center sticky top-0 z-50">
      <nav className="grid grid-cols-3 items-center w-full">
        <div className="justify-self-start">
          <Link to="/admin" className="font-bold text-xl text-white">
            Nordwear
          </Link>
        </div>

        <div className="justify-self-center w-full max-w-[500px]">
          <form className="relative w-full">
            <input
              type="text"
              placeholder="Søg efter produkter..."
              className="w-full bg-[#303030] text-[#e3e3e3] px-3 py-1.5 pl-10 placeholder-[#e3e3e3] border border-[#474747] focus:outline-none rounded-md text-sm"
            />
            <button
              type="submit"
              aria-label="Søg"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1"
            >
              <Icon
                src={searchIconSvg}
                className="h-5 w-5 stroke-[#e3e3e3]"
                strokeWidth={1.5}
              />
            </button>
          </form>
        </div>

        <div className="justify-self-end flex items-center gap-6">
          <Icon
            src={clockSvg}
            className="h-5 w-5 stroke-[#e3e3e3]"
            strokeWidth={2}
          />

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#25e82c] rounded-md flex items-center justify-center text-black font-semibold text-xs">
              {initials}
            </div>
            <Link
              to="/admin/new"
              className="flex items-center gap-2 whitespace-nowrap text-sm"
            >
              {displayName}
              <Icon
                src={ArrowSvg}
                className="h-4 w-4 stroke-[#e3e3e3]"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
