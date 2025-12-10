import React, { useState, ReactNode } from 'react';
import Icon from './Icon';
import arrowDownIcon from '@/assets/admin/svgs/arrow-down-icon.svg?raw';

interface AccordionProps {
  title: string;
  content: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-serif text-lg">{title}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <Icon src={arrowDownIcon} className="h-[14px] w-[14px] text-[#1c1c1c]" />
        </span>
      </button>
      <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="mt-3 text-sm text-gray-600">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Accordion;

