import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "@/components/Dropdown";
import { DropdownItem } from "@/components/DropdownItem";

type ProductItem = {
  id: number;
  name?: string;
  total_stock?: number;
  num_variants?: number;
  status?: "ONLINE" | "OFFLINE" | "DRAFT";
  category?: { id: number; name: string } | null;
  type?: string;
  imageUrl?: string | null;
};

type Props = {
  products: ProductItem[];
  loading: boolean;
  selected?: number[];
  onSelectedChange: React.Dispatch<React.SetStateAction<number[]>>;
  onTotalChange?: (n: number) => void;
  onDeleteSelected?: () => void;
  onStatusChange?: (status: "ONLINE" | "OFFLINE" | "DRAFT") => void;
  activeTab: string;
  sortField: string;
  sortOrder: string;
};

const StatusDisplay = ({
  status,
}: {
  status?: "ONLINE" | "OFFLINE" | "DRAFT";
}) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

  if (status === "ONLINE") {
    return (
      <span className={`${baseClasses} bg-[#b0ffc0] text-[#105949]`}>
        Aktiv
      </span>
    );
  }
  if (status === "OFFLINE") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          Ikke aktiv
        </span>
      </div>
    );
  }
  if (status === "DRAFT") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          Kladde
        </span>
      </div>
    );
  }
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>—</span>;
};

export default function ProductTable({
  products,
  loading,
  selected,
  onSelectedChange,
  onTotalChange,
  onDeleteSelected,
  onStatusChange,
  activeTab,
  sortField,
  sortOrder,
}: Props) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement>(null);
  const navigate = useNavigate();

  // Filter and Sort Logic
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Filter
    if (activeTab === "Aktive") {
      result = result.filter((p) => p.status === "ONLINE");
    } else if (activeTab === "Kladde") {
      result = result.filter((p) => p.status === "DRAFT");
    } else if (activeTab === "Arkiveret") {
      result = result.filter((p) => p.status === "OFFLINE");
    }

    // Sort
    const isAscending = sortOrder === "Ældste først" || sortOrder === "Ældste";
    const multiplier = isAscending ? 1 : -1;

    result.sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      switch (sortField) {
        case "Product title":
          valA = a.name?.toLowerCase() ?? "";
          valB = b.name?.toLowerCase() ?? "";
          break;
        case "Lager":
          valA = a.total_stock ?? 0;
          valB = b.total_stock ?? 0;
          break;
        case "Type":
          valA = a.category?.name?.toLowerCase() ?? "";
          valB = b.category?.name?.toLowerCase() ?? "";
          break;
        case "Lavet":
        case "Opdateret":
        default:
          valA = a.id;
          valB = b.id;
          break;
      }

      if (valA < valB) return -1 * multiplier;
      if (valA > valB) return 1 * multiplier;
      return 0;
    });

    return result;
  }, [products, activeTab, sortField, sortOrder]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allSelected =
    filteredProducts.length > 0 && selected && selected.length === filteredProducts.length;
  const someSelected = selected && selected.length > 0 && !allSelected;
  const selectedCount = selected ? selected.length : 0;

  const toggleSelectAll = () => {
    if (allSelected) onSelectedChange([]);
    else onSelectedChange(filteredProducts.map((p) => p.id));
  };

  const toggleSingle = (id: number) => {
    onSelectedChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    if (action === "delete" && onDeleteSelected) {
        onDeleteSelected();
    } else if (action === "draft" && onStatusChange) {
        onStatusChange("DRAFT");
    } else if (action === "archive" && onStatusChange) {
        onStatusChange("OFFLINE");
    } else if (action === "active" && onStatusChange) {
        onStatusChange("ONLINE");
    } else {
        // alert(`Bulk action: ${action} - Not implemented yet`);
    }
  };


  if (loading) return <div>Loading products…</div>;
  if (filteredProducts.length === 0 && products.length > 0)
    return (
      <div className="p-4 text-gray-500">Ingen produkter matcher filteret.</div>
    );
  if (products.length === 0) return <div>No products found.</div>;

  return (
    <table className="w-full text-left border-collapse table-fixed">
      <colgroup>
        <col className="w-12" />
        <col className="w-[35%]" />
        <col className="w-[15%]" />
        <col className="w-[25%]" />
        <col className="w-[15%]" />
        <col className="w-[10%]" />
      </colgroup>
      <thead>
        <tr className="text-gray-500 font-medium bg-[#f2f2f2] border-t border-b border-[#c7c7c7]">
          <th className="pl-4 py-3">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = !!someSelected;
              }}
              onChange={toggleSelectAll}
            />
          </th>
          {selectedCount > 0 ? (
            <th colSpan={5} className="py-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#303030]">
                  {selectedCount} valgt
                </span>
                <button
                  className="bg-white border border-[#c7c7c7] text-[#303030] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => onSelectedChange([])}
                >
                  Annuller
                </button>
                <button
                  className="bg-white border border-[#c7c7c7] text-[#303030] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => handleBulkAction("draft")}
                >
                  Sæt som draft
                </button>
                <Dropdown
                  label={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#303030]">
                      <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
                    </svg>
                  }
                  triggerClassName="p-1.5 bg-white border border-[#c7c7c7] rounded-lg transition-colors text-[#303030] hover:bg-gray-50 h-[30px] flex items-center justify-center"
                  disableArrowRotation={true}
                  hideChevron={true}
                >
                   <DropdownItem onClick={() => handleBulkAction("active")}>
                      <div className="flex items-center gap-2 font-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Aktiver produkter
                      </div>
                   </DropdownItem>
                   <DropdownItem onClick={() => handleBulkAction("archive")}>
                      <div className="flex items-center gap-2 font-normal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                        Arkiver produkter
                      </div>
                   </DropdownItem>
                   <DropdownItem onClick={() => handleBulkAction("delete")} className="text-[#8e0e21] hover:bg-[#8e0e21]/10">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Slet produkter
                      </div>
                   </DropdownItem>
                   <div className="h-[1px] bg-gray-200 my-1"></div>
                   <DropdownItem onClick={() => handleBulkAction("add_tags")}>Tilføj tags</DropdownItem>
                   <DropdownItem onClick={() => handleBulkAction("remove_tags")}>Fjern tags</DropdownItem>
                   <div className="h-[1px] bg-gray-200 my-1"></div>
                   <DropdownItem onClick={() => handleBulkAction("add_collection")}>Tilføj til kollektion</DropdownItem>
                   <DropdownItem onClick={() => handleBulkAction("remove_collection")}>Fjern fra kollektion</DropdownItem>
                </Dropdown>
              </div>
            </th>
          ) : (
            <>
              <th className="py-3">Produkt</th>
              <th className="py-3 pr-10">Status</th>
              <th className="py-3">Lager</th>
              <th className="py-3">Type</th>
              <th className="px-3 py-3">Håndtering</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {filteredProducts.map((product) => {
          const isSelected = selected && selected.includes(product.id);
          return (
            <tr
              key={product.id}
              className={`border-b border-gray-200 ${
                isSelected ? "bg-green-100" : "bg-transparent"
              }`}
            >
              <td className="pl-4 py-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSingle(product.id)}
                />
              </td>

              <td className="py-4">
                <div className="flex items-center gap-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover bg-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div 
                      className="font-semibold cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin/add-product/${product.id}`)}
                    >
                      {product.name ?? "—"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 pr-10">
                <StatusDisplay status={product.status} />
              </td>

              <td className="text-gray-500 py-4">
                {product.total_stock != null && product.num_variants != null
                  ? `${product.total_stock} på lager i ${product.num_variants} varianter`
                  : "—"}
              </td>
              <td className="py-4">
                <span className="text-gray-500">
                  {product.category?.name ?? "—"}
                </span>
              </td>

              <td
                className="px-3 relative py-4"
                ref={openDropdownId === product.id ? dropdownRef : null}
              >
                <button
                  className="p-2"
                  onClick={() =>
                    setOpenDropdownId(
                      openDropdownId === product.id ? null : product.id
                    )
                  }
                >
                  ⋮
                </button>
                {openDropdownId === product.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md z-20">
                    <div
                      onClick={() => {
                        navigate(`/admin/add-product/${product.id}`);
                        setOpenDropdownId(null);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Rediger produkt
                    </div>
                    <div
                      onClick={() => {
                        if (onDeleteSelected) onDeleteSelected();
                        setOpenDropdownId(null);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Slet valgte
                    </div>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}