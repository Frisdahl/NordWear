import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CustomerCartIcon from "../../assets/customer/customer-cart.svg";
import { fetchCategories } from "../../services/api";
import { Category } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import useCart from "../../hooks/useCart";
import Notification from "../Notification";
import Cart from "./Cart";
import SearchOverlay from "./SearchOverlay";

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
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
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
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  // const lastNonSearchPathRef = React.useRef<string>("/");

  // // Remember the last non-search route
  // useEffect(() => {
  //   const current = location.pathname + location.search;
  //   if (location.pathname !== "/search") {
  //     lastNonSearchPathRef.current = current;
  //   }
  // }, [location]);

  const handleSearchClick = () => {
    setIsSearchOverlayOpen(true);
  };

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
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [headerRef]);

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
    isScrolled
      ? "bg-[#f2f1f0] border-b border-[#D1D0CE] shadow-md"
      : "bg-[#f2f1f0] border-b border-[#D1D0CE]"
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
      <div
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 text-[#1c1c1c] group"
      >
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
                <button onClick={handleSearchClick} className="p-2">
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
      </div>
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        headerHeight={headerHeight}
      />
    </>
  );
};
export default CustomerHeader;
