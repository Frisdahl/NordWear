import React from "react";

type ArrowIconProps = {
  direction?: "right" | "down";
  className?: string;
};

/** Thin line arrow that inherits the text colour. Decorative, so it is hidden from screen readers. */
const ArrowIcon: React.FC<ArrowIconProps> = ({
  direction = "right",
  className = "",
}) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${direction === "down" ? "rotate-90" : ""} ${className}`}
  >
    <path d="M1.5 8h12.5M9 3.25 13.75 8 9 12.75" />
  </svg>
);

export default ArrowIcon;
