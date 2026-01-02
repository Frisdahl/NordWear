import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
  selected: number[];
  onSelectedChange: React.Dispatch<React.SetStateAction<number[]>>;
  refreshKey?: number;
  onTotalChange?: (n: number) => void;
  onDeleteSelected: () => void;
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
  selected,
  onSelectedChange,
  refreshKey = 0,
  onTotalChange,
  onDeleteSelected,
  activeTab,
  sortField,
  sortOrder,
}: Props) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data: ProductItem[] = await res.json();
        setProducts(data);
        if (onTotalChange) onTotalChange(data.length);
        onSelectedChange((prev) =>
          prev.filter((id) => data.some((p) => p.id === id))
        );
      } catch (err: any) {
        console.error("Fetch products failed:", err);
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshKey]);

  // Filter and Sort Logic
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Filter
    if (activeTab === "Aktive") {
      result = result.filter((p) => p.status === "ONLINE");
    } else if (activeTab === "Draft") {
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
    filteredProducts.length > 0 && selected.length === filteredProducts.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) onSelectedChange([]);
    else onSelectedChange(filteredProducts.map((p) => p.id));
  };

  const toggleSingle = (id: number) => {
    onSelectedChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading) return <div>Loading products…</div>;
  if (error)
    return <div className="text-red-600">Error loading products: {error}</div>;
  if (filteredProducts.length === 0 && products.length > 0)
    return <div className="p-4 text-gray-500">Ingen produkter matcher filteret.</div>;
  if (products.length === 0) return <div>No products found.</div>;

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="text-gray-500 font-medium bg-[#f2f2f2] border-t border-b border-[#c7c7c7]">
          <th className="pl-4 w-6 py-3 pr-8">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={toggleSelectAll}
            />
          </th>
          <th className="py-3">Produkt</th>
          <th className="py-3 pr-10">Status</th>
          <th className="py-3">Lager</th>
          <th className="py-3">Type</th>
          <th className="px-3 py-3">Håndtering</th>
        </tr>
      </thead>

      <tbody>
        {filteredProducts.map((product) => {
          const isSelected = selected.includes(product.id);
          return (
            <tr
              key={product.id}
              className={`border-b border-gray-200 ${
                isSelected ? "bg-green-100" : "bg-transparent"
              }`}
            >
              <td className="pl-4 w-6 py-4 pr-8">
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
                    <div className="font-semibold">{product.name ?? "—"}</div>
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
                        onDeleteSelected();
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
