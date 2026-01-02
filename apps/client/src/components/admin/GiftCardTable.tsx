import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import Dropdown from "@/components/Dropdown";
import { DropdownItem } from "@/components/DropdownItem";

type GiftCardItem = {
  id: number;
  code: string;
  balance: number;
  initialAmount: number;
  isEnabled: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  giftCards: GiftCardItem[];
  loading: boolean;
  selected?: number[];
  onSelectedChange: React.Dispatch<React.SetStateAction<number[]>>;
  onTotalChange?: (n: number) => void;
  onDeleteSelected?: () => void;
  onStatusChange?: (status: boolean) => void;
  activeTab: string;
  sortField: string;
  sortOrder: string;
};

const StatusDisplay = ({
  isEnabled,
  expiresAt,
}: {
  isEnabled: boolean;
  expiresAt: string | null;
}) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  const now = new Date();
  const expiry = expiresAt ? new Date(expiresAt) : null;
  const isExpired = expiry && expiry < now;

  if (!isEnabled) {
    return (
      <span className={`${baseClasses} bg-red-100 text-red-800`}>
        Deaktiveret
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
        Udløbet
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-[#b0ffc0] text-[#105949]`}>
      Aktiv
    </span>
  );
};

export default function GiftCardTable({
  giftCards,
  loading,
  selected = [],
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
  const filteredGiftCards = React.useMemo(() => {
    let result = [...giftCards];
    const now = new Date();

    // Filter
    if (activeTab === "Aktive") {
      result = result.filter((g) => g.isEnabled && (!g.expiresAt || new Date(g.expiresAt) > now));
    } else if (activeTab === "Udløbet") {
      result = result.filter((g) => g.expiresAt && new Date(g.expiresAt) <= now);
    } else if (activeTab === "Deaktiveret") {
      result = result.filter((g) => !g.isEnabled);
    }

    // Sort
    const isAscending = sortOrder === "Ældste først" || sortOrder === "Ældste";
    const multiplier = isAscending ? 1 : -1;

    result.sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      switch (sortField) {
        case "Code":
          valA = a.code.toLowerCase();
          valB = b.code.toLowerCase();
          break;
        case "Saldo":
          valA = a.balance;
          valB = b.balance;
          break;
        case "Oprindeligt beløb":
          valA = a.initialAmount;
          valB = b.initialAmount;
          break;
        case "Oprettet":
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
          break;
        case "Udløbsdato":
          valA = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity;
          valB = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity;
          break;
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
  }, [giftCards, activeTab, sortField, sortOrder]);

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
    filteredGiftCards.length > 0 && selected.length === filteredGiftCards.length;
  const someSelected = selected.length > 0 && !allSelected;
  const selectedCount = selected.length;

  const toggleSelectAll = () => {
    if (allSelected) onSelectedChange([]);
    else onSelectedChange(filteredGiftCards.map((g) => g.id));
  };

  const toggleSingle = (id: number) => {
    onSelectedChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedItems = giftCards.filter(g => selected.includes(g.id));
  const allDisabled = selectedItems.length > 0 && selectedItems.every(g => !g.isEnabled);

  const handleBulkAction = (action: string) => {
    if (action === "delete" && onDeleteSelected) {
      onDeleteSelected();
    } else if (action === "toggleStatus" && onStatusChange) {
      onStatusChange(allDisabled ? true : false);
    } else {
      alert(`Bulk action: ${action} - Not implemented yet`);
    }
  };

  if (loading) return <div className="p-4">Indlæser gavekort...</div>;
  if (filteredGiftCards.length === 0 && giftCards.length > 0)
    return (
      <div className="p-4 text-gray-500">Ingen gavekort matcher filteret.</div>
    );
  if (giftCards.length === 0) return null; // Show the empty state from parent

  return (
    <table className="w-full text-left border-collapse table-fixed">
      <colgroup>
        <col className="w-12" />
        <col className="w-[20%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
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
                if (input) input.indeterminate = someSelected;
              }}
              onChange={toggleSelectAll}
            />
          </th>
          {selectedCount > 0 ? (
            <th colSpan={6} className="py-2">
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
                  onClick={() => handleBulkAction("toggleStatus")}
                >
                  {allDisabled ? "Aktiver" : "Deaktiver"}
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
                   <DropdownItem onClick={() => handleBulkAction("delete")} className="text-[#8e0e21] hover:bg-[#8e0e21]/10">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Slet gavekort
                      </div>
                   </DropdownItem>
                </Dropdown>
              </div>
            </th>
          ) : (
            <>
              <th className="py-3">Kode</th>
              <th className="py-3 pr-10">Status</th>
              <th className="py-3">Saldo</th>
              <th className="py-3">Oprindeligt beløb</th>
              <th className="py-3">Udløber</th>
              <th className="px-3 py-3 text-right">Håndtering</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {filteredGiftCards.map((gc) => {
          const isSelected = selected.includes(gc.id);
          return (
            <tr
              key={gc.id}
              className={`border-b border-gray-200 ${
                isSelected ? "bg-green-100" : "bg-transparent"
              }`}
            >
              <td className="pl-4 py-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSingle(gc.id)}
                />
              </td>

              <td 
                className="py-4 font-mono font-medium cursor-pointer hover:underline"
                onClick={() => navigate(`/admin/giftcards/${gc.id}`)}
              >
                {gc.code}
              </td>
              <td className="py-4 pr-10">
                <StatusDisplay isEnabled={gc.isEnabled} expiresAt={gc.expiresAt} />
              </td>

              <td className="text-gray-900 py-4 font-medium">
                {formatPrice(gc.balance / 100)}
              </td>
              <td className="text-gray-500 py-4">
                {formatPrice(gc.initialAmount / 100)}
              </td>
              <td className="py-4 text-gray-500">
                {gc.expiresAt ? new Date(gc.expiresAt).toLocaleDateString() : "Aldrig"}
              </td>

              <td
                className="px-3 relative py-4 text-right"
                ref={openDropdownId === gc.id ? dropdownRef : null}
              >
                <button
                  className="p-2"
                  onClick={() =>
                    setOpenDropdownId(
                      openDropdownId === gc.id ? null : gc.id
                    )
                  }
                >
                  ⋮
                </button>
                {openDropdownId === gc.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md z-20 text-left">
                    <div
                      onClick={() => {
                        navigate(`/admin/giftcards/${gc.id}`);
                        setOpenDropdownId(null);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Rediger
                    </div>
                    <div
                      onClick={() => {
                        if (onDeleteSelected) onDeleteSelected();
                        setOpenDropdownId(null);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Slet
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
