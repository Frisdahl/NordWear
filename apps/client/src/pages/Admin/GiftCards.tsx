import React from "react";
import giftCardSvg from "@/assets/admin/svgs/gift-card.svg";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useNavigate } from "react-router-dom";

const giftCardHeaderSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75v16.5M2.25 12h19.5M6.375 17.25a4.875 4.875 0 0 0 4.875-4.875V12m6.375 5.25a4.875 4.875 0 0 1-4.875-4.875V12m-9 8.25h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5Zm12.621-9.44c-1.409 1.41-4.242 1.061-4.242 1.061s-.349-2.833 1.06-4.242a2.25 2.25 0 0 1 3.182 3.182ZM10.773 7.63c1.409 1.409 1.06 4.242 1.06 4.242S9 12.22 7.592 10.811a2.25 2.25 0 1 1 3.182-3.182Z" /></svg>`;

const GiftCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-3 pt-8 min-h-screen">
      <div className="flex items-center gap-2 mb-6 text-[#303030]">
        <Icon src={giftCardHeaderSvg} className="h-5 w-5" strokeWidth={1.5} />
        <h1 className="text-[18px] font-bold">Gavekort</h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#c7c7c7] p-12 flex flex-col items-center justify-center text-center">
        <img src={giftCardSvg} alt="Gift Card" className="w-64 h-auto" />

        <h2 className="text-[1rem] font-bold text-[#303030] mb-2 uppercase">
          begynd at sælge gavekort
        </h2>

        <p className="text-[#606060] max-w-md mb-8">
          tilføj gavekort produkter eller lav gavekort og send dem direkte til
          dine kunder
        </p>

        <div className="flex gap-4">
          <Button
            variant="custom"
            className="bg-white border border-gray-300 text-[#303030] hover:bg-gray-50 rounded-lg h-10 px-6 text-[13px] font-medium transition-colors"
            onClick={() => navigate("/admin/giftcards/new")}
          >
            lav et gavekort
          </Button>
          <Button
            variant="custom"
            className="bg-[#303030] text-white hover:bg-[#404040] rounded-lg h-10 px-6 text-[13px] font-medium transition-colors"
          >
            tilføj gavekort produkt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GiftCards;
