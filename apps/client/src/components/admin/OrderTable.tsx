import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/formatPrice";
import Dropdown from "@/components/Dropdown";
import { DropdownItem } from "@/components/DropdownItem";

type OrderItem = {
  id: number;
  created_at: string;
  customer?: {
    user: {
      name: string;
      email: string;
    };
  } | null;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELED";
  amount: number;
  currency: string;
  order_item: any[];
  paymentIntentId: string;
};

type Props = {
  orders: OrderItem[];
  loading: boolean;
  selected?: number[];
  onSelectedChange: React.Dispatch<React.SetStateAction<number[]>>;
  onTotalChange?: (n: number) => void;
  onDeleteSelected?: () => void;
  activeTab: string;
  sortField: string;
  sortOrder: string;
};

const StatusDisplay = ({
  status,
}: {
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELED";
}) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case "COMPLETED":
      return (
        <span className={`${baseClasses} bg-[#b0ffc0] text-[#105949]`}>
          Gennemført
        </span>
      );
    case "PENDING":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Afventer
        </span>
      );
    case "CANCELED":
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          Annulleret
        </span>
      );
    case "FAILED":
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          Fejlet
        </span>
      );
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

export default function OrderTable({
  orders,
  loading,
  selected = [],
  onSelectedChange,
  onTotalChange,
  onDeleteSelected,
  activeTab,
  sortField,
  sortOrder,
}: Props) {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter and Sort Logic
  const filteredOrders = React.useMemo(() => {
    let result = [...orders];

    // Filter
    if (activeTab === "Gennemført") {
      result = result.filter((o) => o.status === "COMPLETED");
    } else if (activeTab === "Afventer") {
      result = result.filter((o) => o.status === "PENDING");
    } else if (activeTab === "Annulleret") {
      result = result.filter((o) => o.status === "CANCELED");
    } else if (activeTab === "Fejlet") {
        result = result.filter((o) => o.status === "FAILED");
    }


    // Sort
    const isAscending = sortOrder === "Ældste først" || sortOrder === "Ældste";
    const multiplier = isAscending ? 1 : -1;

    result.sort((a, b) => {
      let valA: any = "";
      let valB: any = "";

      switch (sortField) {
        case "Kunde":
          valA = a.customer?.user.name.toLowerCase() ?? "";
          valB = b.customer?.user.name.toLowerCase() ?? "";
          break;
        case "Beløb":
          valA = a.amount;
          valB = b.amount;
          break;
        case "Oprettet":
        default:
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
          break;
      }

      if (valA < valB) return -1 * multiplier;
      if (valA > valB) return 1 * multiplier;
      return 0;
    });

    return result;
  }, [orders, activeTab, sortField, sortOrder]);

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
    filteredOrders.length > 0 && selected.length === filteredOrders.length;
  const someSelected = selected.length > 0 && !allSelected;
  const selectedCount = selected.length;

  const toggleSelectAll = () => {
    if (allSelected) onSelectedChange([]);
    else onSelectedChange(filteredOrders.map((o) => o.id));
  };

  const toggleSingle = (id: number) => {
    onSelectedChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    if (action === "delete" && onDeleteSelected) {
      onDeleteSelected();
    } else if (action === "cancel") {
      onSelectedChange([]);
    } else {
      alert(`Bulk action: ${action} - Not implemented yet`);
    }
  };

  if (loading) return <div className="p-4">Indlæser ordrer...</div>;
  if (filteredOrders.length === 0 && orders.length > 0)
    return (
      <div className="p-4 text-gray-500">Ingen ordrer matcher filteret.</div>
    );
  if (orders.length === 0) return <div className="p-4">Ingen ordrer fundet.</div>;

  return (
    <table className="w-full text-left border-collapse table-fixed">
      <colgroup>
        <col className="w-12" />
        <col className="w-[15%]" />
        <col className="w-[20%]" />
        <col className="w-[20%]" />
        <col className="w-[15%]" />
        <col className="w-[10%]" />
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
                  onClick={() => handleBulkAction("cancel")}
                >
                  Annuller
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
                        Slet ordrer
                      </div>
                   </DropdownItem>
                   <div className="h-[1px] bg-gray-200 my-1"></div>
                   <DropdownItem onClick={() => handleBulkAction("export")}>Eksporter CSV</DropdownItem>
                </Dropdown>
              </div>
            </th>
          ) : (
            <>
              <th className="py-3">Ordre #</th>
              <th className="py-3">Dato</th>
              <th className="py-3">Kunde</th>
              <th className="py-3">Status</th>
              <th className="py-3">Total</th>
              <th className="px-3 py-3">Håndtering</th>
            </>
          )}
        </tr>
      </thead>

      <tbody>
        {filteredOrders.map((order) => {
          const isSelected = selected.includes(order.id);
          const date = new Date(order.created_at).toLocaleDateString("da-DK", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <tr
              key={order.id}
              className={`border-b border-gray-200 ${
                isSelected ? "bg-green-100" : "bg-transparent"
              }`}
            >
              <td className="pl-4 py-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSingle(order.id)}
                />
              </td>

              <td className="py-4 font-semibold text-[#303030]">
                <span 
                  className="cursor-pointer hover:underline"
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                >
                  #{order.id}
                </span>
              </td>
              <td className="py-4 text-gray-500 text-sm">
                {date}
              </td>
               <td className="py-4">
                <div className="flex flex-col">
                  <span 
                    className="font-medium text-[#303030] cursor-pointer hover:underline w-fit"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    {order.customer?.user.name || "Gæst"}
                  </span>
                  <span className="text-xs text-gray-500">
                     {order.customer?.user.email || "—"}
                  </span>
                </div>
              </td>
              <td className="py-4">
                <StatusDisplay status={order.status} />
              </td>

              <td className="text-[#303030] font-medium py-4">
                 {formatPrice(order.amount / 100)}
              </td>

              <td
                className="px-3 relative py-4"
                ref={openDropdownId === order.id ? dropdownRef : null}
              >
                <button
                  className="p-2"
                  onClick={() =>
                    setOpenDropdownId(
                      openDropdownId === order.id ? null : order.id
                    )
                  }
                >
                  ⋮
                </button>
                {openDropdownId === order.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-md z-20">
                    <div
                      onClick={() => {
                        navigate(`/admin/orders/${order.id}`);
                        setOpenDropdownId(null);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Se ordre
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