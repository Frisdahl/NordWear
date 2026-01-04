import React from "react";

import { Outlet, Link } from "react-router-dom";
import CustomerCartIcon from "../assets/customer/customer-cart.svg";

const CheckoutHeader: React.FC = () => {
  return (
    <header className=" bg-white border-b border-gray-200">
      <div className="container max-w-[1100px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        <div className="flex-initial sm:flex-1 text-left sm:text-center">
          <Link to="/" className="font-bold text-2xl tracking-widest">
            NORDWEAR
          </Link>
        </div>
        <div className="flex-initial sm:flex-1 flex justify-end">
          <Link to="/cart">
            <img src={CustomerCartIcon} alt="Cart" className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

const CheckoutLayout: React.FC = () => {
  return (
    <div className="bg-[#f2f1f0] min-h-screen">
      <CheckoutHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CheckoutLayout;
