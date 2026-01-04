import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import ProductTable from "@/components/admin/ProductTable";
import Icon from "@/components/Icon";
import MainContent from "@/components/admin/MainContent";
import Notification from "@/components/Notification";

const productActiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>`;

const tabs = ["Alle", "Aktive", "Kladde", "Arkiveret"];
const sortOptions = ["Product title", "Lavet", "Opdateret", "Lager", "Type"];

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [activeTab, setActiveTab] = useState("Alle");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "success" as "success" | "error",
    heading: "",
    subtext: "",
  });

  // Sorting State
  const [sortField, setSortField] = useState("Product title");
  const [sortOrder, setSortOrder] = useState("Nyeste");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/products", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        setProducts(data);
        setProductCount(data.length);
      } catch (err) {
        console.error("Fetch products failed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  const confirmDelete = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
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
        heading: "Produkter slettet",
        subtext: `${deletedCount} ${
          deletedCount === 1 ? "produkt er" : "produkter er"
        } blevet slettet.`,
      });
    } catch (err) {
      console.error("Delete failed:", err);
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl ved sletning",
        subtext: "Kunne ikke slette produkterne. Prøv igen senere.",
      });
    }
  };

  const confirmStatusChange = async (
    status: "ONLINE" | "OFFLINE" | "Kladde"
  ) => {
    try {
      const res = await fetch("/api/products/bulk-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ ids: selected, status }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
      const count = selected.length;
      setSelected([]);
      setRefreshKey((k) => k + 1);

      let statusText = "";
      if (status === "ONLINE") statusText = "aktiveret";
      if (status === "OFFLINE") statusText = "arkiveret";
      if (status === "DRAFT") statusText = "sat til kladde";

      setNotification({
        show: true,
        type: "success",
        heading: "Status opdateret",
        subtext: `${count} ${
          count === 1 ? "produkt er" : "produkter er"
        } blevet ${statusText}.`,
      });
    } catch (err) {
      console.error("Status update failed:", err);
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl ved opdatering",
        subtext: "Kunne ikke opdatere status. Prøv igen senere.",
      });
    }
  };

  const selectedProductNames = products
    .filter((p) => selected.includes(p.id))
    .map((p) => p.name);

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
          <div
            className="absolute inset-0 bg-[#303030]/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-md overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-[#f2f2f2] px-6 py-4 flex justify-between items-center border-b border-[#e6e6e6]">
              <h2 className="text-base font-bold text-[#303030]">
                Slet {selected.length}{" "}
                {selected.length === 1 ? "produkt" : "produkter"}?
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-[#a0a0a0] hover:text-[#303030] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-[#606060]">
                Dette kan ikke fortrydes. Alle medier, der kun bruges af dette
                produkt, vil også blive slettet.
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
            src={productActiveSvg}
            className="h-[1.5rem] w-[1.5rem]"
            strokeWidth={2}
          />
          <h1 className="text-[1.5rem] font-bold">Produkter</h1>
        </div>

        {/* Actions moved to Header */}
        <div className="flex gap-4">
          <Button
            variant="custom"
            size="md"
            className="bg-[#3b3b3b] text-[#f2f2f2] hover:bg-[#2b2b2b] rounded-lg h-10 px-4 text-[13px]"
            onClick={() => navigate("/admin/add-product")}
          >
            <PlusIcon className="w-4 h-4" /> Tilføj produkt
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
        <ProductTable
          products={products}
          loading={loading}
          selected={selected}
          onSelectedChange={setSelected}
          onTotalChange={setProductCount}
          onDeleteSelected={() => setShowDeleteModal(true)}
          onStatusChange={confirmStatusChange}
          activeTab={activeTab}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </MainContent>
    </div>
  );
};

export default AllProducts;
