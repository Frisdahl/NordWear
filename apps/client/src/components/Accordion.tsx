import React, { useState, ReactNode, useRef } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/solid";

interface AccordionProps {
  id?: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  id,
  title,
  content,
  icon,
  isOpen = false,
  onToggle,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [localOpen, setLocalOpen] = useState(false);

  // Use controlled prop or local state
  const open = onToggle ? isOpen : localOpen;
  const handleToggle = onToggle ? onToggle : () => setLocalOpen(!localOpen);

  return (
    <div className="border-b border-[#d1d0cd]">
      <button
        onClick={handleToggle}
        className="w-full flex py-4 justify-between items-center text-left"
      >
        <span className="font-serif text-lg">{title}</span>
        <div className="relative h-5 w-5">
          <PlusIcon
            className="absolute h-5 w-5 text-gray-700 transition-opacity duration-500 ease-in-out"
            style={{ opacity: open ? 0 : 1 }}
          />
          <MinusIcon
            className="absolute h-5 w-5 text-gray-700 transition-opacity duration-500 ease-in-out"
            style={{ opacity: open ? 1 : 0 }}
          />
        </div>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight : 0,
        }}
      >
        <div className="pb-4 text-md text-gray-600">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
