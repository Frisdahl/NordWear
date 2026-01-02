import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Dropdown({
  label,
  children,
  className = "",
  triggerClassName = "text-gray-700 py-4 px-8",
  disableArrowRotation = false,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  disableArrowRotation?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full h-full focus:outline-none ${triggerClassName}`}
      >
        {label}
        <span
          className={`ml-2 transition-transform duration-200 ${
            !disableArrowRotation && open ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-0 w-56 rounded-none border border-t-0 bg-[#f2f1f0] shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
}
