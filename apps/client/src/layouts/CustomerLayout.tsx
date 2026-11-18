import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
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

  // The header is fixed and the spacer under it takes its height, so the height has to be known before the first paint:
  // measured in an effect after the paint, the whole page was drawn 103 px too high and then dropped (a layout shift of
  // about 0.13 on every page).
  useLayoutEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
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
    <div className="customer-font bg-[#fefffe] min-h-screen flex flex-col">
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
