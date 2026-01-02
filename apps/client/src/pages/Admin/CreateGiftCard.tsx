import React, { useState } from "react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Notification from "@/components/Notification";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { createGiftCard } from "@/services/api";
import { useNavigate } from "react-router-dom";

const giftCardHeaderSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3.75v16.5M2.25 12h19.5M6.375 17.25a4.875 4.875 0 0 0 4.875-4.875V12m6.375 5.25a4.875 4.875 0 0 1-4.875-4.875V12m-9 8.25h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5Zm12.621-9.44c-1.409 1.41-4.242 1.061-4.242 1.061s-.349-2.833 1.06-4.242a2.25 2.25 0 0 1 3.182 3.182ZM10.773 7.63c1.409 1.409 1.06 4.242 1.06 4.242S9 12.22 7.592 10.811a2.25 2.25 0 1 1 3.182-3.182Z" /></svg>`;
const chevronRightSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>`;
const calendarIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" /></svg>`;
const penIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>`;
const searchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 1 0 10.607 10.607Z" /></svg>`;

const CreateGiftCard: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [expiration, setExpiration] = useState("Udløber ikke");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [code] = useState(() => Math.random().toString(36).substring(2, 14).toUpperCase());
  
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    heading: string;
    subtext: string;
  }>({ show: false, type: "success", heading: "", subtext: "" });

  // Date State
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0 = January
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  
  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  };

  const [dateInput, setDateInput] = useState(formatDate(now));

  const months = [
    "Januar", "Februar", "Marts", "April", "Maj", "Juni", 
    "Juli", "August", "September", "Oktober", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    const formatted = formatDate(selectedDate);
    setDateInput(formatted);
    setExpiration(formatted);
    setDropdownOpen(false);
  };

  const setPredefinedExpiration = (monthsToAdd: number | null, label: string) => {
    if (monthsToAdd === null) {
      setExpiration("Udløber ikke");
    } else {
      const date = new Date();
      date.setMonth(date.getMonth() + monthsToAdd);
      const formatted = formatDate(date);
      setExpiration(label);
      setDateInput(formatted);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
    setDropdownOpen(false);
  };

  const handleCreate = async () => {
    if (!amount) {
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl",
        subtext: "Indtast venligst et beløb.",
      });
      return;
    }

    let expiresAt: string | null = null;
    if (expiration !== "Udløber ikke") {
      const parts = dateInput.split(".");
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        expiresAt = date.toISOString();
      }
    }

    try {
      await createGiftCard({
        code,
        amount,
        expiresAt
      });
      setNotification({
        show: true,
        type: "success",
        heading: "Gavekort oprettet",
        subtext: "Gavekortet er nu aktivt og klar til brug.",
      });
      
      setTimeout(() => {
        navigate("/admin/giftcards");
      }, 2000);
    } catch (error: any) {
      console.error("Failed to create gift card:", error);
      setNotification({
        show: true,
        type: "error",
        heading: "Fejl ved oprettelse",
        subtext: error.response?.data?.message || "Der skete en fejl. Prøv igen.",
      });
    }
  };

  // Dynamic calendar generation
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    // Adjust for Monday start: Sun(0) -> 6, Mon(1) -> 0
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startingDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: startingDay }, (_, i) => i);

  return (
    <div className="container mx-auto px-3 pt-8 min-h-screen relative">
      <Notification
        show={notification.show}
        type={notification.type}
        heading={notification.heading}
        subtext={notification.subtext}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {/* Header with Breadcrumb-like style */}
      <div className="flex items-center gap-2 mb-6 text-[#303030]">
        <Icon src={giftCardHeaderSvg} className="h-5 w-5" strokeWidth={1.5} />
        <Icon src={chevronRightSvg} className="h-4 w-4 text-gray-400" strokeWidth={2} />
        <h1 className="text-[18px] font-bold">Lav nyt gavekort</h1>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left Column: Details */}
        <div className="bg-white rounded-2xl border border-[#c7c7c7] p-8 flex-1 max-w-2xl">
          <h2 className="text-base font-bold text-[#303030] mb-6">Gavekort detaljer</h2>

          <div className="flex flex-col gap-6">
            {/* Code Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#303030]">Gavekort kode</label>
              <div className="w-full h-10 px-3 flex items-center border border-[#e6e6e6] rounded-lg bg-[#f9f9f9] text-[#606060] font-mono">
                {code}
              </div>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#303030]">Indtast beløb</label>
              <input
                type="text"
                placeholder="199,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-3 border border-[#e6e6e6] rounded-lg focus:outline-none focus:border-[#303030] text-[#303030]"
              />
            </div>

            {/* Expiration Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full h-10 px-3 border border-[#e6e6e6] rounded-lg flex items-center justify-between bg-white focus:outline-none hover:bg-gray-50"
              >
                <div className="flex items-center gap-2 text-[#303030]">
                  <Icon src={calendarIcon} className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-sm">{expiration}</span>
                </div>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#e6e6e6] rounded-xl shadow-lg z-10 flex overflow-hidden min-h-[300px]">
                  {/* Left Column: Options */}
                  <div className="w-1/3 border-r border-[#e6e6e6] bg-[#f9f9f9]">
                    <ul className="flex flex-col py-2">
                      {[
                        { label: "Udløber ikke", value: null },
                        { label: "1 måned", value: 1 },
                        { label: "3 måneder", value: 3 },
                        { label: "1 år", value: 12 }
                      ].map((opt) => (
                        <li key={opt.label}>
                          <button
                            onClick={() => setPredefinedExpiration(opt.value, opt.label)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#e6e6e6] ${
                              expiration === opt.label ? "font-bold text-[#303030] bg-[#e6e6e6]" : "text-[#606060]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Calendar */}
                  <div className="w-2/3 p-4 flex flex-col">
                    {/* Date Input */}
                    <div className="mb-4">
                      <input 
                        type="text"
                        placeholder="DD.MM.ÅÅÅÅ"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="w-full h-9 px-3 border border-[#e6e6e6] rounded text-sm focus:outline-none focus:border-[#303030]"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4 px-2">
                      <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeftIcon className="w-4 h-4 text-[#303030]" />
                      </button>
                      <div className="font-bold text-sm text-[#303030]">{months[currentMonth]} {currentYear}</div>
                      <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronRightIcon className="w-4 h-4 text-[#303030]" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {["M", "T", "O", "T", "F", "L", "S"].map((d) => (
                        <div key={d} className="text-[10px] font-bold text-[#a0a0a0] mb-1">{d}</div>
                      ))}
                      {paddingDays.map((_, i) => (
                        <div key={`pad-${i}`} className="text-xs py-1.5"></div>
                      ))}
                      {days.map((d) => {
                        const dayDate = new Date(currentYear, currentMonth, d);
                        const formattedDay = formatDate(dayDate);
                        const isActive = formattedDay === dateInput;
                        const isToday = dayDate.toDateString() === now.toDateString();

                        return (
                          <div 
                            key={d} 
                            onClick={() => handleDateClick(d)}
                            className={`text-xs py-1.5 rounded cursor-pointer transition-colors ${
                              isActive 
                                ? "bg-[#303030] text-white" 
                                : isToday 
                                  ? "bg-gray-200 text-[#303030] font-bold" 
                                  : "text-[#303030] hover:bg-[#f2f2f2]"
                            }`}
                          >
                            {d}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
               <Button 
                variant="custom" 
                className="bg-[#303030] text-white hover:bg-[#404040] rounded-lg h-10 px-6 text-[13px] font-medium"
                onClick={handleCreate}
               >
                  Opret gavekort
               </Button>
          </div>
        </div>

        {/* Right Column: Customers & Notes */}
        <div className="flex flex-col gap-6 w-[350px]">
          {/* Customers Container */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-6">
            <h3 className="text-sm font-bold text-[#303030] mb-4">Kunder</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="søg efter kunde"
                className="w-full h-10 pl-10 pr-3 border border-[#e6e6e6] rounded-lg text-sm focus:outline-none focus:border-[#303030]"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon src={searchIconSvg} className="h-4 w-4 text-[#a0a0a0]" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Notes Container */}
          <div className="bg-white rounded-2xl border border-[#c7c7c7] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#303030]">Noter</h3>
              <button className="hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                <Icon src={penIconSvg} className="h-4 w-4 text-[#303030]" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-gray-400 text-[13px]">no notes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGiftCard;
