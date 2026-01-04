import React, { useState, useEffect, useRef } from "react";
import Icon from "@/components/Icon";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (start: Date, end: Date) => void;
}

const calendarIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" /></svg>`;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Local state for pending changes
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  // Independent views for start and end calendars
  const [startViewDate, setStartViewDate] = useState(startDate);
  const [endViewDate, setEndViewDate] = useState(endDate);

  // Sync local state when prop changes or modal opens
  useEffect(() => {
    if (isOpen) {
        setLocalStartDate(startDate);
        setLocalEndDate(endDate);
        setStartViewDate(startDate);
        setEndViewDate(endDate);
    }
  }, [isOpen, startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("da-DK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePreset = (daysToSubtract: number, label: string) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysToSubtract);
    
    if (label === 'Igår') {
        end.setDate(end.getDate() - 1);
        start.setDate(end.getDate());
    }

    setLocalStartDate(start);
    setLocalEndDate(end);
    setStartViewDate(start);
    setEndViewDate(end);
  };

  const handleApply = () => {
    onRangeChange(localStartDate, localEndDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const SingleCalendar = ({ 
      viewDate, 
      onViewChange, 
      selectedDate, 
      onSelect 
  }: { 
      viewDate: Date, 
      onViewChange: (d: Date) => void, 
      selectedDate: Date, 
      onSelect: (d: Date) => void 
  }) => {
    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    const startingDay = firstDay === 0 ? 6 : firstDay - 1; // 0 = Mon

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: startingDay }, (_, i) => i);

    const monthName = viewDate.toLocaleString("da-DK", { month: "long" });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const handlePrevMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        onViewChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        onViewChange(newDate);
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(year, month, day);
        onSelect(newDate);
    };

    return (
      <div className="w-64 p-4">
        <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <div className="font-bold text-sm">
                {capitalizedMonth} {year}
            </div>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRightIcon className="w-4 h-4" />
            </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["M", "T", "O", "T", "F", "L", "S"].map((d) => (
            <div key={d} className="text-xs font-bold text-gray-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {padding.map((i) => <div key={`pad-${i}`} />)}
          {days.map((d) => {
            const date = new Date(year, month, d);
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            let classes = "text-sm py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors";
            if (isSelected) classes = "text-sm py-1.5 rounded-full bg-[#1c1c1c] text-white";

            return (
              <div key={d} onClick={() => handleDateClick(d)} className={classes}>
                {d}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 bg-white border border-[#c7c7c7] px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-[#f9f9f9] transition-colors"
      >
        <Icon
          src={calendarIconSvg}
          className="w-[1.125rem] h-[1.125rem] stroke-[#606060]"
        />
        <span className="text-[#303030]">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-[#c7c7c7] rounded-xl shadow-xl z-50 flex flex-col animate-fade-in-up overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-40 border-r border-[#e6e6e6] py-2 bg-[#f9f9f9]">
                <button onClick={() => handlePreset(1, 'Igår')} className="w-full text-left px-4 py-2 text-sm text-[#606060] hover:bg-[#e6e6e6] hover:text-[#1c1c1c]">Igår</button>
                <button onClick={() => handlePreset(7, 'Sidste uge')} className="w-full text-left px-4 py-2 text-sm text-[#606060] hover:bg-[#e6e6e6] hover:text-[#1c1c1c]">Sidste uge</button>
                <button onClick={() => handlePreset(30, 'Sidste måned')} className="w-full text-left px-4 py-2 text-sm text-[#606060] hover:bg-[#e6e6e6] hover:text-[#1c1c1c]">Sidste måned</button>
                <button onClick={() => handlePreset(90, 'Sidste kvartal')} className="w-full text-left px-4 py-2 text-sm text-[#606060] hover:bg-[#e6e6e6] hover:text-[#1c1c1c]">Sidste kvartal</button>
                <button onClick={() => handlePreset(365, 'Sidste år')} className="w-full text-left px-4 py-2 text-sm text-[#606060] hover:bg-[#e6e6e6] hover:text-[#1c1c1c]">Sidste år</button>
            </div>

            {/* Calendars Container */}
            <div className="flex flex-col">
                 <div className="flex">
                    <SingleCalendar 
                        viewDate={startViewDate} 
                        onViewChange={setStartViewDate} 
                        selectedDate={localStartDate} 
                        onSelect={setLocalStartDate} 
                    />
                    <div className="w-[1px] bg-[#e6e6e6] my-4"></div>
                    <SingleCalendar 
                        viewDate={endViewDate} 
                        onViewChange={setEndViewDate} 
                        selectedDate={localEndDate} 
                        onSelect={setLocalEndDate} 
                    />
                 </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t border-[#e6e6e6] p-4 flex justify-end gap-3 bg-white">
            <button 
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-[#c7c7c7] text-[#303030] text-sm font-medium hover:bg-gray-50 transition-colors"
            >
                Tilbage
            </button>
            <button 
                onClick={handleApply}
                className="px-4 py-2 rounded-lg bg-[#1c1c1c] text-white text-sm font-medium hover:bg-[#333] transition-colors"
            >
                Anvend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
