import React from "react";
import { Link } from "react-router-dom";
import clockSvg from "@/assets/admin/svgs/clock-icon.svg?raw";
import loopSvg from "@/assets/admin/svgs/loop-icon.svg?raw";
import ArrowSvg from "@/assets/admin/svgs/arrow-down-icon.svg?raw";
import Icon from "../Icon";

const AdminHeader: React.FC = () => {
  return (
    <header className="text-2D2F36 px-11 py-5">
      <nav className="flex justify-between items-center gap-4 w-full">
        <Link to="/admin" className="font-bold text-xl">
          Nordwear
        </Link>

        <div className="flex items-center gap-8 w-[40%]">
          <form className="relative w-full">
            <input
              type="text"
              placeholder="Søg efter produkter..."
              className="w-full border px-3 py-1.5 pl-10 border-[#9CA3AF] placeholder-[#2D2F36] placeholder-opacity-100 focus:outline-none focus:border-[#2D2F36] focus:ring-1 focus:ring-[#2D2F36] rounded"
            />
            <button
              type="submit"
              aria-label="Søg"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1"
            >
              <Icon
                src={loopSvg}
                className="h-6 w-6 stroke-[#2D2F36]"
                strokeWidth={2}
              />
            </button>
          </form>

          <Icon
            src={clockSvg}
            className="h-5 w-5 stroke-[#2D2F36]"
            strokeWidth={2}
          />

          <div className="flex items-center gap-2">
            <div className="bg-gray-300 h-[50px] w-[50px] rounded-full"></div>
            <Link
              to="/admin/new"
              className="flex items-center ml-2 whitespace-nowrap"
            >
              Alexander Frisdahl
              <Icon
                src={ArrowSvg}
                className="h-5 w-5 stroke-width-1px stroke-[#2D2F36]"
                strokeWidth={0.1}
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
