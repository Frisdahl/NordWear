import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../services/api";
import { Product } from "../../types";
import ProductCard from "./ProductCard";
import loopSvg from "../../assets/loop-icon.svg?raw";
import Icon from "../Icon";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  headerHeight: number;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  headerHeight,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const navigate = useNavigate();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isRendered, setIsRendered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsAnimating(true), 10); // Small delay to ensure the transition is applied
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsRendered(false), 300); // Match duration of the animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered) {
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
  }, [searchQuery, isRendered]);

  useEffect(() => {
    if (isRendered) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [isRendered]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowAllResults(true);
    }
  };

  const handleViewAllProducts = () => {
    setShowAllResults(true);
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        style={{
          pointerEvents: isAnimating ? "auto" : "none",
        }}
      ></div>
      <div
        className={`relative z-10 bg-[#f2f1f0] transform transition-transform duration-500 ease-in-out ${
          isAnimating ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: `${headerHeight}px` }}
      >
        <div className="px-12 py-2 md:py-4">
          <div className="flex items-center justify-center">
            <Icon
              src={loopSvg}
              className="h-5 w-5 stroke-[#f1f0ee]"
              strokeWidth={2}
            />
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Søg efter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 bg-[#f2f1f0] font-[EB-Garamond] text-3xl rounded-md focus:outline-none focus:ring-2 focus:ring-[transparent]"
              />
            </form>
            <button onClick={onClose} className="p-2">
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <>
              <div className="mt-8 mb-8">
                <p className="font-[EB-Garamond] text-[#1c1c1c] text-md pb-2 border-b border-[#d4d2cf] w-full">
                  Produkter
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4 overflow-y-auto">
                {(showAllResults
                  ? searchResults
                  : searchResults.slice(0, 5)
                ).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {!showAllResults && searchResults.length > 5 && (
                <div className="w-full flex justify-center py-9 ">
                  <button
                    onClick={handleViewAllProducts}
                    className=" bg-[#1c1c1c] self-center text-white px-6 py-3 rounded-[4px] hover:bg-[#333] transition-colors"
                  >
                    Vis alle produkter
                  </button>
                </div>
              )}
            </>
          )}
          {searchQuery.trim() !== "" && searchResults.length === 0 && (
            <p className="text-center text-gray-500">Ingen produkter fundet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
