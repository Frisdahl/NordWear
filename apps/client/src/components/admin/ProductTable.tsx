import React, { useEffect, useState } from "react";

type ProductItem = {
  id: number;
  name: string;
  stock?: number;
  status?: string;
  revenue?: number;
  // add category if your schema has it
  category?: { id: number; name: string } | null;
};

export default function ProductTable() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // adjust path if your server mounts routes under a different prefix
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: ProductItem[]) => setProducts(data))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const allSelected =
    products.length > 0 && selected.length === products.length;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(products.map((p) => p.id));
    }
  };

  const toggleSingle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading) return <div>Loading products…</div>;

  return (
    <table className="w-full text-left border-separate border-spacing-y-2">
      <thead>
        <tr className="text-gray-500 font-medium">
          {/* SELECT ALL checkbox */}
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
              {/* Single row checkbox */}
              <td className="pl-2 w-6">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSingle(product.id)}
                />
              </td>

              <td>#{product.id}</td>
              <td>{product.name}</td>
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

              <td>{(product.revenue ?? 0).toLocaleString()} kr.</td>

              <td className="px-3">⋮</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
