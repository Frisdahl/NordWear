import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Dropdown({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
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
    <div ref={ref} className="relative inline-block">
      <Button
        variant="outline"
        size="md"
        onClick={() => setOpen(!open)}
        className="min-w-[150px]"
      >
        {label}
        <span className={`ml-2 transition ${open ? "rotate-180" : "rotate-0"}`}>
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </Button>

      {open && (
        <div className="absolute left-0 mt-2 w-48 rounded-md border bg-white shadow-md z-20">
          {children}
        </div>
      )}
    </div>
  );
}
