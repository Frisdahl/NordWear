import React, { useEffect, useState } from "react";

type ProductItem = {
  id: number;
  name?: string;
  price?: number;
  stock?: number;
  status?: string;
  revenue?: number;
  category?: { id: number; name: string } | null;
};

type Props = {
  selected: number[];
  onSelectedChange: React.Dispatch<React.SetStateAction<number[]>>;
  refreshKey?: number;
};

export default function ProductTable({
  selected,
  onSelectedChange,
  refreshKey = 0,
}: Props) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data: ProductItem[] = await res.json();
        setProducts(data);
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
    <table className="w-full text-left border-separate border-spacing-y-2">
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
          <th>Produkt ID</th>
          <th>Produkt navn</th>
          <th>Totalt lager</th>
          <th>Status</th>
          <th>Pris</th>
          <th>Omsætning</th>
          <th>Handling</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => {
          const isSelected = selected.includes(product.id);
          return (
            <tr
              key={product.id}
              className={`${isSelected ? "bg-green-100" : "bg-white"} `}
            >
              <td className="pl-2 w-6">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSingle(product.id)}
                />
              </td>

              <td>#{product.id}</td>
              <td>
                <div>{product.name ?? "—"}</div>
                {product.category?.name && (
                  <div className="text-xs text-gray-500">
                    {product.category.name}
                  </div>
                )}
              </td>

              <td>{product.stock ?? "—"}</td>

              <td
                className={
                  product.status === "Online"
                    ? "text-green-600"
                    : "text-red-500"
                }
              >
                {product.status ?? "—"}
              </td>

              <td>
                {product.price != null
                  ? `${product.price.toLocaleString()} kr.`
                  : "—"}
              </td>

              <td>{(product.revenue ?? 0).toLocaleString()} kr.</td>

              <td className="px-3">⋮</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
