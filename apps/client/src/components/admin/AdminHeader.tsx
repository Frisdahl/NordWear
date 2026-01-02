import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import clockSvg from "@/assets/admin/svgs/clock-icon.svg?raw";
import ArrowSvg from "@/assets/admin/svgs/arrow-down-icon.svg?raw";
import Icon from "../Icon";
import { useAuth } from "@/contexts/AuthContext";
import { searchProducts, searchOrders, searchGiftCards } from "../../services/api";

const searchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`;

interface SearchResults {
  orders: any[];
  products: any[];
  giftCards: any[];
}

const AdminHeader: React.FC = () => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults>({ orders: [], products: [], giftCards: [] });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filters = ["Ordrer", "Produkter", "Gavekort"];
  const availableFilters = filters.filter((f) => f !== activeFilter);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults({ orders: [], products: [], giftCards: [] });
        return;
      }

      setLoading(true);
      try {
        let orders = [];
        let products = [];
        let giftCards = [];

        // Determine what to search based on activeFilter
        if (!activeFilter || activeFilter === "Ordrer") {
            orders = await searchOrders(searchQuery);
        }
        if (!activeFilter || activeFilter === "Produkter") {
            products = await searchProducts(searchQuery);
        }
        if (!activeFilter || activeFilter === "Gavekort") {
            giftCards = await searchGiftCards(searchQuery);
        }

        setSearchResults({ orders, products, giftCards });
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  const handleResultClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults({ orders: [], products: [], giftCards: [] });
  };

  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || "Admin User";
  const initials = getInitials(displayName);

  return (
    <header className="text-[#e3e3e3] px-11 h-[60px] bg-[#1a1a1a] flex items-center sticky top-0 z-50">
      <nav className="grid grid-cols-3 items-center w-full">
        <div className="justify-self-start">
          <Link to="/admin" className="font-bold text-xl text-white">
            Nordwear
          </Link>
        </div>

        <div
          className="justify-self-center w-full max-w-[500px]"
          ref={searchRef}
        >
          <div className="relative w-full">
             {/* Dropdown Background */}
             {isSearchOpen && (
              <div className="absolute top-[-12px] left-[-20px] right-[-20px] bg-white rounded-lg shadow-2xl pt-16 pb-6 px-5 border border-gray-200 z-10 max-h-[80vh] overflow-y-auto">
                <div className="flex gap-2 mb-4 flex-wrap border-b border-gray-100 pb-4">
                  {availableFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {searchQuery.trim().length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-12 h-12 mb-3 opacity-50"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                    <p className="text-gray-500 font-medium">
                        Søg efter alt i butikken
                    </p>
                    </div>
                ) : loading ? (
                    <div className="text-center py-8 text-gray-500">Søger...</div>
                ) : (
                    <div className="space-y-6">
                        {(searchResults.orders.length === 0 && searchResults.products.length === 0 && searchResults.giftCards.length === 0) && (
                            <p className="text-center text-gray-500 py-4">Ingen resultater fundet.</p>
                        )}

                        {searchResults.orders.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Ordrer</h3>
                                <div className="space-y-1">
                                    {searchResults.orders.map(order => (
                                        <Link to={`/admin/orders/${order.id}`} key={order.id} onClick={handleResultClick} className="block p-2 hover:bg-gray-50 rounded flex justify-between">
                                            <span className="text-sm font-medium text-gray-800">Ordre #{order.id}</span>
                                            <span className="text-xs text-gray-500">{order.status}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {searchResults.products.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Produkter</h3>
                                <div className="space-y-1">
                                    {searchResults.products.map(product => (
                                        <Link to={`/admin/add-product/${product.id}`} key={product.id} onClick={handleResultClick} className="block p-2 hover:bg-gray-50 rounded flex items-center gap-3">
                                            {product.imageUrl && <img src={product.imageUrl} alt="" className="w-8 h-8 object-cover rounded" />}
                                            <div>
                                                <div className="text-sm font-medium text-gray-800">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.price} DKK</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {searchResults.giftCards.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Gavekort</h3>
                                <div className="space-y-1">
                                    {searchResults.giftCards.map(gc => (
                                        <Link to={`/admin/giftcards/${gc.id}`} key={gc.id} onClick={handleResultClick} className="block p-2 hover:bg-gray-50 rounded flex justify-between">
                                            <span className="text-sm font-medium text-gray-800">{gc.code}</span>
                                            <span className="text-xs text-gray-500">{gc.balance / 100} DKK</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
              </div>
            )}

            {/* Input Area */}
            <div className="relative z-20">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="p-1">
                        <Icon
                            src={searchIconSvg}
                            className={`h-5 w-5 ${isSearchOpen ? 'stroke-[#8a8a8a]' : 'stroke-[#e3e3e3]'}`}
                            strokeWidth={1.5}
                        />
                    </div>
                    {activeFilter && (
                        <div className="flex items-center gap-1 bg-[#474747] text-[#e3e3e3] px-2 py-0.5 rounded-full text-xs">
                            <span>{activeFilter}</span>
                            <button 
                                onClick={() => setActiveFilter(null)}
                                className="hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
                <input
                type="text"
                placeholder={activeFilter ? "" : "Søg..."}
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${
                  isSearchOpen ? 'bg-[#fcfcfc] text-[#8a8a8a] border-[#8a8a8a] border-2 placeholder-[#8a8a8a]' : 'bg-[#303030] text-[#e3e3e3] border-[#474747] border placeholder-[#e3e3e3]'
                } px-3 py-1.5 focus:outline-none rounded-lg text-sm ${activeFilter ? 'pl-[140px]' : 'pl-10'}`}
                />
            </div>
          </div>
        </div>

        <div className="justify-self-end flex items-center gap-6">
          <Icon
            src={clockSvg}
            className="h-5 w-5 stroke-[#e3e3e3]"
            strokeWidth={2}
          />

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#25e82c] rounded-md flex items-center justify-center text-black font-semibold text-xs">
              {initials}
            </div>
            <Link
              to="/admin/new"
              className="flex items-center gap-2 whitespace-nowrap text-sm"
            >
              {displayName}
              <Icon
                src={ArrowSvg}
                className="h-4 w-4 stroke-[#e3e3e3]"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminHeader;
