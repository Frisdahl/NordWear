import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CustomerCartIcon from "../../assets/customer/customer-cart.svg";
// remove next two imports
// import { fetchCategories } from "../../services/api";
// import { Category } from "../../types";
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
  { name: "Sneakers", path: "/category/sneakers" },
  { name: "Shirts", path: "/category/shirts" },
  { name: "Hoodies", path: "/category/hoodies" },
  { name: "Jackets", path: "/category/jackets" },
];

const staticMenuItems: MenuItem[] = [
  { name: "Om os", path: "/about" },
  { name: "Size guide", path: "/size-guide" },
];

interface CustomerHeaderProps {
  headerRef: React.RefObject<HTMLDivElement>;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ headerRef }) => {
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
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleSearchClick = () => {
    setIsSearchOverlayOpen(!isSearchOverlayOpen);
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
      ? "bg-[#f2f1f0] border-b border-[#D1D0CE]"
      : "bg-[#f2f1f0] border-b border-[#D1D0CE]"
  }`;

  // Show all (main + static) links on the left
  const leftItems = menuItems;

  const authLink = isAuthenticated ? (
    <Link to="/customer/orders">Konto</Link>
  ) : (
    <Link to="/login">Log på</Link>
  );

  return (
    <>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        headerHeight={headerHeight}
      />
      {notification && (
        <Notification
          heading={notification.type === "success" ? "Success" : "Fejl"}
          subtext={notification.message}
          type={notification.type}
          show={true}
          onClose={() => setNotification(null)}
        />
      )}
      <div
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 text-[#1c1c1c] group"
      >
        <div className="bg-[#630D0D] text-[#Fff] text-[1rem] text-center py-2">
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
              <div className="hidden md:flex items-center space-x-4 text-[0.875rem]">
                {leftItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group/link relative uppercase tracking-wide"
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
            <div className="flex items-center space-x-4 md:space-x-4">
              <div className="hidden md:flex items-center space-x-8">
                <div className="group/link relative inline-block text-[#1c1c1ca6]">
                  {authLink}
                  <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSearchClick}
                  className="p-2 text-[#1c1c1ca6]"
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
                  className="p-2 hidden md:block text-[#1c1c1ca6]"
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
