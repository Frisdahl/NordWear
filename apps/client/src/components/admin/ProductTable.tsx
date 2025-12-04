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
};

type Props = {
  selected: number[];
  onSelectedChange: React.Dispatch<React.SetStateAction<number[]>>;
  refreshKey?: number;
  onTotalChange?: (n: number) => void;
  onDeleteSelected: () => void;
};

const StatusDisplay = ({
  status,
}: {
  status?: "ONLINE" | "OFFLINE" | "DRAFT";
}) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

  if (status === "ONLINE") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Aktiv
        </span>
      </div>
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
        console.log(data);
        // report total count to parent if provided
        if (onTotalChange) onTotalChange(data.length);
        // remove any selected ids that no longer exist
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
  }, [refreshKey]); // refetch when parent increments refreshKey

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
    products.length > 0 && selected.length === products.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) onSelectedChange([]);
    else onSelectedChange(products.map((p) => p.id));
  };

  const toggleSingle = (id: number) => {
    onSelectedChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading) return <div>Loading products…</div>;
  if (error)
    return <div className="text-red-600">Error loading products: {error}</div>;
  if (products.length === 0) return <div>No products found.</div>;

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="text-gray-500 font-medium">
          <th className="pl-2 w-6">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={toggleSelectAll}
            />
          </th>
          <th>Produkt</th>
          <th>Status</th>
          <th>Lager</th>
          <th>Type</th>
          <th>Håndtering</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => {
          const isSelected = selected.includes(product.id);
          return (
            <tr
              key={product.id}
              className={`border-b border-gray-200 ${
                isSelected ? "bg-green-100" : "bg-transparent"
              }`}
            >
              <td className="pl-2 w-6 py-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSingle(product.id)}
                />
              </td>

              <td className="py-4">
                <div className="font-semibold">{product.name ?? "—"}</div>
                <div className="text-xs text-gray-500">#{product.id}</div>
              </td>
              <td className="py-4">
                <StatusDisplay status={product.status} />
              </td>

              <td className="text-gray-500 py-4">
                {product.total_stock != null && product.num_variants != null
                  ? `${product.total_stock} på lager i ${product.num_variants} varianter`
                  : "—"}
              </td>
              <td className="py-4">{product.category?.name ?? "—"}</td>

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
