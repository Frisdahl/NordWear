import React from "react";
import Icon from "@/components/Icon";

const dashboardSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 3H4C3.44772 3 3 3.44772 3 4V11C3 11.5523 3.44772 12 4 12H9C9.55228 12 10 11.5523 10 11V4C10 3.44772 9.55228 3 9 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 3H15C14.4477 3 14 3.44772 14 4V7C14 7.55228 14.4477 8 15 8H20C20.5523 8 21 7.55228 21 7V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 12H15C14.4477 12 14 12.4477 14 13V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V13C21 12.4477 20.5523 12 20 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 16H4C3.44772 16 3 16.4477 3 17V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V17C10 16.4477 9.55228 16 9 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const Dashboard = () => {
  return (
    <div className="container mx-auto px-3 pt-8 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-[#303030]">
          <Icon
            src={dashboardSvg}
            className="h-[1.5rem] w-[1.5rem]"
            strokeWidth={2}
          />
          <h1 className="text-[1.5rem] font-bold">Oversigt</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl flex flex-col gap-4 p-6 border border-[#c7c7c7]">
        <h2 className="text-xl font-bold text-[#303030]">Velkommen til Admin Panelet</h2>
        <p className="text-[#606060]">
          Herfra kan du administrere din webshop. Du har mulighed for at:
        </p>
        <ul className="list-disc list-inside text-[#606060] space-y-1">
          <li>Se og behandle ordrer</li>
          <li>Oprette, redigere og slette produkter</li>
          <li>Administrere gavekort</li>
          <li>Få overblik over din forretning</li>
        </ul>
        <p className="text-[#606060] mt-2">
            Brug menuen til venstre for at navigere rundt i systemet.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
