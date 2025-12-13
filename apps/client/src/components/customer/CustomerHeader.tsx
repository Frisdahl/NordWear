import Cart from './Cart';

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CustomerCartIcon from "../../assets/customer/customer-cart.svg";
import { fetchCategories } from "../../services/api";
import { Category } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import useCart from "../../hooks/useCart";
import Notification from "../Notification";

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
    // ... (useEffect for scroll and menu open)
  }, [isMenuOpen]);

  const headerClasses = `transition-colors duration-300 bg-[#F1F0EE] shadow-md border-b border-gray-200 ${
    !isScrolled && "md:bg-transparent md:shadow-none md:border-b-0"
  }`;

  const categoryItems = menuItems.filter((item) =>
    item.path.startsWith("/category")
  );
  const otherItems = menuItems.filter(
    (item) => !item.path.startsWith("/category")
  );

  const authLink = isAuthenticated ? (
    <button onClick={handleLogout} className="hover:underline">
      Log af
    </button>
  ) : (
    <Link to="/login" className="hover:underline">
      Log på
    </Link>
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
      {/* This is the main fixed container for both banner and header */}
      <div className="fixed top-0 left-0 right-0 z-30 text-[#1c1c1c] group">
        {/* Top Banner */}
        <div className="bg-[#630D0D] text-[#Fff] text-[1rem] text-center py-2 text-sm">
          Faste lave priser. Begrænset lager. Forlænget retur.
        </div>

        {/* Main Header */}
        <header className={`${headerClasses} group-hover:bg-[#f2f1f0]`}>
          <nav className="container mx-auto px-2 md:px-6 py-2 md:py-4 flex justify-between items-center">
            {/* Desktop Menu & Burger Icon */}
            <div className="flex items-center space-x-8">
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
                    className="hover:underline"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link
                to="/"
                className="text-xl md:text-2xl font-bold tracking-wider"
              >
                NORDWEAR
              </Link>
            </div>

            {/* Right Icons & Desktop Menu */}
            <div className="flex items-center space-x-4 md:space-x-8">
              <div className="hidden md:flex items-center space-x-8">
                {otherItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="hover:underline"
                  >
                    {item.name}
                  </Link>
                ))}
                {authLink}
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2">
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
                <button onClick={() => setIsCartOpen(true)} className="p-2 relative md:hidden">
                  <img src={CustomerCartIcon} alt="Indkøbskurv" className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-[#1c1c1c] text-white text-[8px] flex items-center justify-center">{cartCount}</span>
                  )}
                </button>
                <button onClick={() => setIsCartOpen(true)} className="p-2 hidden md:block">
                  Indkøbskurv {cartCount > 0 && `(${cartCount})`}
                </button>
              </div>
            </div>
          </nav>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu Panel */}
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
          <nav className="flex flex-col space-y-4">
            {[
              ...menuItems,
              {
                name: isAuthenticated ? "Log af" : "Log på",
                path: isAuthenticated ? "#" : "/login",
              },
            ].map((item) =>
              item.path === "#" ? (
                <button
                  key={item.name}
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-lg hover:underline text-left"
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-lg hover:underline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default CustomerHeader;
