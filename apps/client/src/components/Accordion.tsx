import React, { useState, ReactNode } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

interface AccordionProps {
  title: string;
  content: string;
  icon: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        {isOpen ? (
          <MinusIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <PlusIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 pl-9 text-sm text-gray-600">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default Accordion;
