import React, { useEffect, useState } from "react";
import giftCardSvg from "@/assets/admin/svgs/gift-card.svg";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { fetchGiftCards, batchUpdateGiftCards } from "@/services/api";
import MainContent from "@/components/admin/MainContent";
import GiftCardTable from "@/components/admin/GiftCardTable";
import Notification from "@/components/Notification";

const giftCardHeaderSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75v16.5M2.25 12h19.5M6.375 17.25a4.875 4.875 0 0 0 4.875-4.875V12m6.375 5.25a4.875 4.875 0 0 1-4.875-4.875V12m-9 8.25h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5Zm12.621-9.44c-1.409 1.41-4.242 1.061-4.242 1.061s-.349-2.833 1.06-4.242a2.25 2.25 0 0 1 3.182 3.182ZM10.773 7.63c1.409 1.409 1.06 4.242 1.06 4.242S9 12.22 7.592 10.811a2.25 2.25 0 1 1 3.182-3.182Z" /></svg>`;

const tabs = ["Alle", "Aktive", "Udløbet", "Deaktiveret"];
const sortOptions = [
  "Code",
  "Saldo",
  "Oprindeligt beløb",
  "Oprettet",
  "Udløbsdato",
];

const GiftCards: React.FC = () => {
  const navigate = useNavigate();
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Alle");
  const [selected, setSelected] = useState<number[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "success" as "success" | "error", heading: "", subtext: "" });

  const [giftcardCount, setGiftcardCount] = useState(0);

  // Sorting State
  const [sortField, setSortField] = useState("Code");
  const [sortOrder, setSortOrder] = useState("Nyeste");

  useEffect(() => {
    const loadGiftcards = async () => {
      setLoading(true);
      try {
        const fetchedGiftcards = await fetchGiftCards();
        setGiftCards(fetchedGiftcards);
      } catch (err) {
        console.log(err, "Failed to load gift cards");
      } finally {
        setLoading(false);
      }
    };

    loadGiftcards();
  }, [refreshKey]);

  const handleStatusChange = async (isEnabled: boolean) => {
    try {
      await batchUpdateGiftCards(selected, { isEnabled });
      setNotification({
        show: true,
        type: "success",
        heading: `Gavekort ${isEnabled ? "aktiveret" : "deaktiveret"}`,
        subtext: `${selected.length} ${selected.length === 1 ? "gavekort er" : "gavekort er"} blevet ${isEnabled ? "aktiveret" : "deaktiveret"}.`
      });
      setSelected([]);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Status update failed:", err);
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl",
        subtext: `Kunne ikke ${isEnabled ? "aktivere" : "deaktivere"} gavekortene.`,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch("/api/gift-cards/batch-delete", { // Assuming endpoint
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
      const deletedCount = selected.length;
      setSelected([]);
      setShowDeleteModal(false);
      setRefreshKey((k) => k + 1);
      setNotification({
        show: true,
        type: "success",
        heading: "Gavekort slettet",
        subtext: `${deletedCount} ${deletedCount === 1 ? "gavekort er" : "gavekort er"} blevet slettet.`
      });
    } catch (err) {
      console.error("Delete failed:", err);
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl ved sletning",
        subtext: "Kunne ikke slette gavekortene. Prøv igen senere."
      });
    }
  };

  return (
    <div className="container mx-auto px-3 pt-8 min-h-screen relative">
      <Notification 
        show={notification.show}
        type={notification.type}
        heading={notification.heading}
        subtext={notification.subtext}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#303030]/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-md overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-[#f2f2f2] px-6 py-4 flex justify-between items-center border-b border-[#e6e6e6]">
              <h2 className="text-base font-bold text-[#303030]">
                Slet {selected.length} {selected.length === 1 ? "gavekort" : "gavekort"}?
              </h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-[#a0a0a0] hover:text-[#303030] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-[#606060]">
                Dette kan ikke fortrydes. Gavekortet vil blive permanent slettet og kan ikke længere bruges.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e6e6e6] flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-[#c7c7c7] text-[#303030] text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Tilbage
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-[#8e0e21] text-white text-sm font-medium hover:bg-[#6e0a1a] transition-colors"
              >
                Bekræft
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mb-6 items-center">
        <div className="flex items-center gap-2 text-[#303030]">
          <Icon
            src={giftCardHeaderSvg}
            className="h-[1.5rem] w-[1.5rem]"
            strokeWidth={1.5}
          />
          <h1 className="text-[1.5rem] font-bold">Gavekort</h1>
        </div>

        <Button
          variant="custom"
          size="md"
          className="bg-[#3b3b3b] text-[#f2f2f2] hover:bg-[#2b2b2b] rounded-lg h-10 px-4 text-[13px]"
          onClick={() => navigate("/admin/giftcards/new")}
        >
          <PlusIcon className="w-4 h-4" /> Tilføj gavekort
        </Button>
      </div>

      {giftCards.length > 0 ? (
        <div className="mb-6">
          <MainContent
            activeTab={activeTab}
            tabs={tabs}
            setActiveTab={setActiveTab}
            sortOptions={sortOptions}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          >
            <GiftCardTable
              giftCards={giftCards}
              loading={loading}
              selected={selected}
              onSelectedChange={setSelected}
              onTotalChange={setGiftcardCount}
              onDeleteSelected={() => setShowDeleteModal(true)}
              onStatusChange={handleStatusChange}
              activeTab={activeTab}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </MainContent>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default GiftCards;
