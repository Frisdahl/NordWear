import React, { useState } from "react";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import Dropdown from "@/components/Dropdown";
import { DropdownItem } from "@/components/DropdownItem";
import ProductTable from "@/components/admin/ProductTable";

const AllProducts = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const deleteSelected = async () => {
    if (selected.length === 0) {
      alert("Ingen produkter valgt");
      return;
    }
    if (!confirm(`Slet ${selected.length} produkter?`)) return;

    try {
      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }
      // clear selection and refresh table
      setSelected([]);
      setRefreshKey((k) => k + 1);
      alert("Slettet valgt(e) produkt(er)");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Kunne ikke slette produkterne");
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between">
        <div>
          <div className="flex gap-2">
            <h1 className="text-fluidTitle font-medium">Produkter</h1>
            <div className="w-max px-5 py-1 bg-nwDarkGray text-[12px] text-white rounded-[4px] flex items-start justify-center self-start">
              5
            </div>
          </div>
          <text className="font-medium">
            Her er alle af dine nuværende produkter i din butik.
          </text>
        </div>

        <div className="flex gap-4">
          <Dropdown label="Flere handlinger">
            <DropdownItem onClick={deleteSelected}>Slet valgte</DropdownItem>

            <DropdownItem onClick={() => alert("Eksporter CSV")}>
              Eksporter CSV
            </DropdownItem>
          </Dropdown>

          <Button variant="primary" size="md">
            <PlusIcon className="w-4 h-4" /> Tilføj produkt
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="h-[1px] w-full bg-[#9CA3AF] opacity-30"></div>

        <div className="flex gap-4">
          <Dropdown label="Filter efter:">
            <DropdownItem onClick={() => alert("Slettede 3 produkter")}>
              Slet valgte
            </DropdownItem>

            <DropdownItem onClick={() => alert("Eksporter CSV")}>
              Eksporter CSV
            </DropdownItem>
          </Dropdown>

          <Dropdown label="Sortér efter:">
            <DropdownItem onClick={() => alert("Slettede 3 produkter")}>
              Slet valgte
            </DropdownItem>

            <DropdownItem onClick={() => alert("Eksporter CSV")}>
              Eksporter CSV
            </DropdownItem>
          </Dropdown>
        </div>
        <div className="h-[1px] w-full bg-[#9CA3AF] opacity-30"></div>
      </div>

      <div>
        <ProductTable
          selected={selected}
          onSelectedChange={setSelected}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
};

export default AllProducts;
