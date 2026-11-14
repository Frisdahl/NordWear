import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Customer pages use `scroll-behavior: smooth` on <html> (for in-page anchors),
// which would also animate this reset. "instant" overrides it, so a new page
// is at the top straight away, before it is painted.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
