import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CustomerCartIcon from "../../assets/customer/customer-cart.svg";
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
  { name: "Skjorter", path: "/category/skjorter" },
  { name: "Hættetrøjer", path: "/category/hættetrøjer" },
  { name: "Jakker", path: "/category/jakker" },
];

const staticMenuItems: MenuItem[] = [{ name: "Om os", path: "/about" }];

interface CustomerHeaderProps {
  headerRef: React.RefObject<HTMLDivElement>;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ headerRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuItems] = useState<MenuItem[]>([
    ...mainMenuItems,
    ...staticMenuItems,
  ]);
  const [notification, setNotification] = useState<{
    heading: string;
    subtext: string;
    type: "success" | "error" | "";
  }>({ heading: "", subtext: "", type: "" });
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleNotification = (data: { heading: string; subtext: string; type: "success" | "error" }) => {
    setNotification({ heading: data.heading, subtext: data.subtext, type: data.type as "success" | "error" });
  };

  const handleSearchClick = () => {
    setIsSearchOverlayOpen(!isSearchOverlayOpen);
  };

  // Local measurement for the SearchOverlay only
  useEffect(() => {
    if (!headerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    });

    resizeObserver.observe(headerRef.current);

    return () => resizeObserver.disconnect();
  }, [headerRef]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerClasses = `transition-colors duration-300 bg-[#f2f1f0] border-b border-[#D1D0CE]`;

  const authLink = isAuthenticated ? (
    <Link to="/customer/orders">Konto</Link>
  ) : (
    <Link to="/login">Log på</Link>
  );

  return (
    <>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* 
        CRITICAL FIX: Move SearchOverlay OUTSIDE the headerRef div.
        If it's inside, its hidden content still counts towards offsetHeight, 
        causing the "113px" or ghost gap issue.
      */}
      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        headerHeight={headerHeight}
        onNotify={handleNotification}
      />

      <div
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 text-[#1c1c1c] group pr-[var(--scrollbar-width)]"
      >
        {/* Red Top Bar */}
        <div className="bg-[#630D0D] text-[#Fff] text-[0.875rem] md:text-[1rem] text-center py-2 px-4">
          Faste lave priser. Begrænset lager. Forlænget retur.
        </div>

        <header className={headerClasses}>
          <nav className="px-6 md:px-12 mx-auto py-2 lg:py-5 flex justify-between items-center relative">
            <div className="flex items-center">
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 -ml-2"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>

              <Link
                to="/"
                className="text-xl md:text-2xl font-bold tracking-widest uppercase hidden lg:block"
              >
                NORDWEAR
              </Link>

              <div className="hidden lg:block h-[1px] w-8 [1px] bg-[#1c1c1c] mx-6"></div>

              <div className="hidden lg:flex items-center space-x-6 text-[0.875rem]">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group/link relative uppercase tracking-wide font-medium"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 lg:hidden">
              <Link
                to="/"
                className="text-xl md:text-2xl font-bold tracking-widest uppercase"
              >
                NORDWEAR
              </Link>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4 min-w-[100px] justify-end">
              <div className="hidden lg:flex items-center">
                <div className="group/link relative inline-block text-[#1c1c1ca6] text-[0.875rem] uppercase tracking-wide font-medium">
                  {authLink}
                  <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#1c1c1c] origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover/link:scale-x-100"></span>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={handleSearchClick}
                  className="p-2 text-[#1c1c1ca6] uppercase text-[0.875rem] font-medium tracking-wide hidden sm:block"
                >
                  Søg
                </button>
                <button
                  onClick={handleSearchClick}
                  className="p-2 text-[#1c1c1c] sm:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 relative lg:hidden"
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
                  className="p-2 hidden lg:block text-[#1c1c1ca6] uppercase text-[0.875rem] font-medium tracking-wide"
                >
                  Indkøbskurv {cartCount > 0 && `(${cartCount})`}
                </button>
              </div>
            </div>
          </nav>
        </header>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 9998 }}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 h-full bg-[#f2f1f0] w-[80vw] md:w-[40vw] max-w-[400px] shadow-xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="p-6 flex justify-end items-center pb-4">
          <button onClick={() => setIsMenuOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col space-y-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-[1rem] uppercase tracking-wide font-medium border-b border-transparent hover:border-[#1c1c1c] transition-all duration-500 inline-block w-fit transform ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 100}ms` : "0ms",
                }}
              >
                {item.name}
              </Link>
            ))}
            <div
              className={`pt-6 border-t border-[#00000026] transition-all duration-500 transform ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: isMenuOpen
                  ? `${menuItems.length * 100}ms`
                  : "0ms",
              }}
            >
              <div className="text-[1rem] uppercase tracking-wide font-medium">
                {authLink}
              </div>
            </div>
          </div>
        </div>
      </div>

      {notification.subtext && (
        <Notification
          heading={notification.heading}
          subtext={notification.subtext}
          type={notification.type as "success" | "error"}
          show={true}
          onClose={() => setNotification({ heading: "", subtext: "", type: "" })}
        />
      )}
    </>
  );
};
export default CustomerHeader;
