import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "../../types";
import { searchProducts } from "../../services/api";
import ProductCard from "../../components/customer/ProductCard";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      searchProducts(query).then((products) => {
        setSearchResults(products);
      });
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Search Results for "{query}"</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div>
          <p className="text-lg">{searchResults.length} products found</p>
        </div>
        {searchResults.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Search;
