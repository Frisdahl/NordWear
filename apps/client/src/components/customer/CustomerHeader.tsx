import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CustomerCartIcon from "../../assets/customer/customer-cart.svg";
import { searchProducts, fetchCategories } from "../../services/api";
import { Category, Product } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import useCart from "../../hooks/useCart";
import Notification from "../Notification";
import Cart from "./Cart";
import ProductCard from "./ProductCard";

interface MenuItem {
  name: string;
  path: string;
}

const mainMenuItems: MenuItem[] = [
  { name: "Deals", path: "/category/deals" },
  { name: "Sneakers", path: "/category/sneakers" },
  { name: "Shirts", path: "/category/shirts" },
];

const staticMenuItems: MenuItem[] = [
  { name: "Om os", path: "/about" },
  { name: "Size guide", path: "/size-guide" },
];

const CustomerHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    ...mainMenuItems,
    ...staticMenuItems,
  ]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      searchProducts(searchQuery).then((products) => {
        setSearchResults(products);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories: Category[] = await fetchCategories();
        const mainCategoryNames = mainMenuItems.map((item) =>
          item.name.toLowerCase()
        );

        const otherCategoryMenuItems: MenuItem[] = categories
          .filter(
            (category) =>
              !mainCategoryNames.includes(category.name.toLowerCase())
          )
          .map((category) => ({
            name: category.name,
            path: `/category/${category.name.toLowerCase()}`,
          }));

        setMenuItems([
          ...mainMenuItems,
          ...otherCategoryMenuItems,
          ...staticMenuItems,
        ]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    loadCategories();
  }, []);

  const handleLogout = () => {
    logout();
    setNotification({ message: "Du er nu logget ud.", type: "success" });
    setTimeout(() => {
      setNotification(null);
      navigate("/");
    }, 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClasses = `transition-colors duration-300 ${
    isScrolled || isSearchOpen
      ? "bg-[#f2f1f0] border-b border-[#D1D0CE] shadow-md"
      : "md:bg-transparent md:shadow-none md:border-b-0"
  }`;

  const categoryItems = menuItems.filter((item) =>
    item.path.startsWith("/category")
  );
  const otherItems = menuItems.filter(
    (item) => !item.path.startsWith("/category")
  );

  const authLink = isAuthenticated ? (
    <Link to="/customer/orders">Konto</Link>
  ) : (
    <Link to="/login">Log på</Link>
  );

  return (
    <>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSearchOpen(false)}
        ></div>
      )}
      <div className="fixed top-0 left-0 right-0 z-30 text-[#1c1c1c] group">
        <div className="bg-[#630D0D] text-[#Fff] text-[1rem] text-center py-2 text-sm">
          Faste lave priser. Begrænset lager. Forlænget retur.
        </div>
        <header className={`${headerClasses} group-hover:bg-[#f2f1f0]`}>
          <nav className="px-12 mx-auto py-2 md:py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(true)}>
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                {categoryItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group/link relative"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link
                to="/"
                className="text-xl md:text-2xl font-bold tracking-wider"
              >
                NORDWEAR
              </Link>
            </div>
            <div className="flex items-center space-x-4 md:space-x-8">
              <div className="hidden md:flex items-center space-x-8">
                {otherItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group/link relative"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
                  </Link>
                ))}
                <div className="group/link relative inline-block">
                  {authLink}
                  <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
                </div>
              </div>

              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2"
                >
                  Søg
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 relative md:hidden"
                >
                  <img
                    src={CustomerCartIcon}
                    alt="Indkøbskurv"
                    className="h-6 w-6"
                  />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-[#1c1c1c] text-white text-[8px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 hidden md:block"
                >
                  Indkøbskurv {cartCount > 0 && `(${cartCount})`}
                </button>
              </div>
            </div>
          </nav>
        </header>
        {isSearchOpen && (
          <div className="py-6 bg-[#f2f1f0] flex items-center px-12">
            <MagnifyingGlassIcon
              className="text-[#050608] h-8 w-8 mr-4 cursor-pointer"
              onClick={() => setIsSearchOpen(false)}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg efter..."
              className="bg-transparent text-3xl font-normal font-[EB-Garamond] w-full focus:outline-none"
            />
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="bg-[#f2f1f0] px-12 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {searchResults.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {searchResults.length > 4 && (
              <div className="text-center mt-8">
                <Link
                  to={`/search?q=${searchQuery}`}
                  className="inline-block bg-[#1c1c1c] text-white px-6 py-3 rounded-md"
                >
                  Vis alle resultater
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[90%] bg-white text-black shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 text-decoration-none">
            {[
              ...menuItems,
              {
                name: isAuthenticated ? "Konto" : "Log på",
                path: isAuthenticated ? "/customer/orders" : "/login",
              },
            ].map((item) => (
              <div key={item.name} className="group/link relative inline-block">
                <Link
                  to={item.path}
                  className="text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default CustomerHeader;
