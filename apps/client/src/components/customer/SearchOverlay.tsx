import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../services/api";
import { Product } from "../../types";
import ProductCard from "./ProductCard";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight: number;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, headerHeight }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const navigate = useNavigate();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setShowAllResults(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const products = await searchProducts(searchQuery);
        setSearchResults(products);
      } catch (error) {
        console.error("Failed to search products:", error);
        setSearchResults([]);
      }
    }, 300); // Debounce search by 300ms

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [searchQuery, isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowAllResults(true);
    }
  };

  const handleViewAllProducts = () => {
    setShowAllResults(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 right-0 z-40" style={{ top: `${headerHeight}px` }}>
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white shadow-lg">
        <div className="px-12 py-2 md:py-4">
          <button onClick={onClose} className="absolute top-4 right-12 p-2">
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>
          <h2 className="text-xl font-semibold mb-4">Søg produkter</h2>
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <input
              type="text"
              placeholder="Søg efter produkter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c1c1c]"
            />
          </form>

          {searchResults.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 max-h-96 overflow-y-auto">
                {(showAllResults
                  ? searchResults
                  : searchResults.slice(0, 5)
                ).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {!showAllResults && searchResults.length > 5 && (
                <button
                  onClick={handleViewAllProducts}
                  className="w-full bg-[#1c1c1c] text-white py-3 rounded-md hover:bg-[#333] transition-colors"
                >
                  Vis alle produkter
                </button>
              )}
            </>
          )}
          {searchQuery.trim() !== "" && searchResults.length === 0 && (
            <p className="text-center text-gray-500">Ingen produkter fundet.</p>
          )}
        </div>
      </div>{" "}
    </div>
  );
};

export default SearchOverlay;
