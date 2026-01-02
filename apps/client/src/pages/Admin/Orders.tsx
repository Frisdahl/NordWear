import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import OrderTable from "@/components/admin/OrderTable";
import Icon from "@/components/Icon";
import MainContent from "@/components/admin/MainContent";
import Notification from "@/components/Notification";
import { fetchOrders } from "@/services/api";

const ordersActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`;

const tabs = ["Alle", "Gennemført", "Afventer", "Annulleret", "Fejlet"];
const sortOptions = ["Oprettet", "Beløb", "Kunde"];

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [activeTab, setActiveTab] = useState("Alle");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "success" as "success" | "error", heading: "", subtext: "" });

  // Sorting State
  const [sortField, setSortField] = useState("Oprettet");
  const [sortOrder, setSortOrder] = useState("Nyeste");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
        setOrderCount(data.length);
      } catch (err) {
        console.error("Fetch orders failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  const confirmDelete = async () => {
    try {
      // Assuming a similar bulk delete endpoint exists for orders
      const res = await fetch("/api/orders", {
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
        heading: "Ordrer slettet",
        subtext: `${deletedCount} ${deletedCount === 1 ? "ordre er" : "ordrer er"} blevet slettet.`
      });
    } catch (err) {
      console.error("Delete failed:", err);
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl ved sletning",
        subtext: "Kunne ikke slette ordrerne. Prøv igen senere."
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
                Slet {selected.length} {selected.length === 1 ? "ordre" : "ordrer"}?
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
                Dette kan ikke fortrydes. Data for disse ordrer vil gå tabt permanent.
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

      {/* Header Outside */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-[#303030]">
          <Icon
            src={ordersActiveSvg}
            className="h-[1.5rem] w-[1.5rem]"
            strokeWidth={1.5}
          />
          <h1 className="text-[1.5rem] font-bold">Ordrer</h1>
        </div>

        {/* Actions moved to Header */}
        <div className="flex gap-4">
          <Button
            variant="custom"
            size="md"
            className="bg-[#3b3b3b] text-[#f2f2f2] hover:bg-[#2b2b2b] rounded-lg h-10 px-4 text-[13px]"
            onClick={() => alert("Opret ordre manuelt (kommer snart)")}
          >
            Opret ordre
          </Button>
        </div>
      </div>

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
        <OrderTable
          orders={orders}
          loading={loading}
          selected={selected}
          onSelectedChange={setSelected}
          onTotalChange={setOrderCount}
          onDeleteSelected={() => setShowDeleteModal(true)}
          activeTab={activeTab}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </MainContent>
    </div>
  );
};

export default Orders;
