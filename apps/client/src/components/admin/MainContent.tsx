import React, { useState } from "react";
import Dropdown from "@/components/Dropdown";
import Icon from "@/components/Icon";

const sortIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>`;
const arrowUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18" /></svg>`;
const arrowDownIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" /></svg>`;

interface MainContentProps {
  children: React.ReactNode;
  activeTab: string;
  tabs: string[];
  setActiveTab: (tab: string) => void;
  sortOptions: string[];
  sortField: string;
  setSortField: (field: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  children,
  activeTab,
  tabs,
  setActiveTab,
  sortOptions,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="bg-white rounded-2xl flex flex-col gap-0 pb-4 border border-[#c7c7c7]">
      {/* Top Bar: Tabs + Order By */}
      <div className="flex justify-between items-center p-4">
        {/* Status Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-bold text-[13px] px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-[#ebebeb] text-[#303030]"
                  : "text-[#a4a4a4] hover:bg-[#f2f2f2]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Order By Dropdown */}
        <Dropdown
          label={
            <div className="flex items-center gap-2 p-2">
              <Icon src={sortIconSvg} className="h-4 w-4" strokeWidth={1.5} />
              Sorter efter
            </div>
          }
          triggerClassName="bg-[#f2f2f2] border border-[#e6e6e6] text-[#303030] hover:bg-[#e6e6e6] rounded-lg h-10 px-6 flex items-center gap-2 text-[13px] font-medium transition-colors"
          disableArrowRotation={true}
        >
          <div className="flex flex-col py-1">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSortField(option)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <div
                  className={`w-4 h-4 rounded-full border border-[#8c8c8c] bg-white mr-3 transition-all ${
                    sortField === option ? "border-[3px]" : "border"
                  }`}
                ></div>
                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>

          <div className="h-[1px] w-full bg-gray-200 my-1"></div>

          <div className="flex flex-col py-1">
            <button
              onClick={() => setSortOrder("Ældste")}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors ${
                sortOrder === "Ældste" ? "bg-[#ebebeb]" : "hover:bg-[#f2f2f2]"
              }`}
            >
              <Icon src={arrowUpIcon} className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-sm">Ældste først</span>
            </button>
            <button
              onClick={() => setSortOrder("Nyeste")}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 transition-colors ${
                sortOrder === "Nyeste" ? "bg-[#ebebeb]" : "hover:bg-[#f2f2f2]"
              }`}
            >
              <Icon src={arrowDownIcon} className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-sm">Nyeste først</span>
            </button>
          </div>
        </Dropdown>
      </div>

      {children}
    </div>
  );
};

export default MainContent;
