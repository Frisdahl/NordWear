import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import CustomerHeader from "../components/customer/CustomerHeader";
import Footer from "../components/customer/Footer";
import HeaderSpacer from "../components/customer/HeaderSpacer";

const CustomerLayout: React.FC = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("smooth-scroll");
    return () => {
      document.documentElement.classList.remove("smooth-scroll");
    };
  }, []);

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

  return (
    <div className="bg-[#f2f1f0] min-h-screen flex flex-col">
      <CustomerHeader headerRef={headerRef} />
      <HeaderSpacer height={headerHeight} />
      <main className="flex-grow">
        <Outlet context={{ headerHeight }} />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
