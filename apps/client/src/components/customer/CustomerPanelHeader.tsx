import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../Notification";
import UserIcon from "../../assets/customer/user-icon.svg";
import ArrowDownIcon from "../../assets/admin/svgs/arrow-down-icon.svg";

const CustomerPanelHeader: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setNotification({ message: "Du er nu logget ud.", type: "success" });
    setTimeout(() => {
      setNotification(null);
      navigate("/");
    }, 2000);
  };

  return (
    <>
      {notification && (
        <Notification
          heading={notification.type === "success" ? "Success" : "Fejl"}
          subtext={notification.message}
          type={notification.type}
          show={true}
          onClose={() => setNotification(null)}
        />
      )}
      <header className="bg-[#1c1c1c] text-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold tracking-wider">
              NORDWEAR
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:underline">
                Butik
              </Link>
              <Link to="/customer/orders" className="hover:underline">
                Ordrer
              </Link>
              <Link to="/customer/favorites" className="hover:underline">
                Favoritter
              </Link>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2"
            >
              <img src={UserIcon} alt="User" className="h-8 w-8" />
              <img
                src={ArrowDownIcon}
                alt="Arrow down"
                className={`h-4 w-4 filter invert transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log af
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default CustomerPanelHeader;
