import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

const successIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>`;
const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>`;
const loadingIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 6.364-2.121-2.121M7.757 7.757 5.636 5.636m12.728 0-2.121 2.121M7.757 16.243l-2.121 2.121" /></svg>`;

interface NotificationProps {
  show: boolean;
  type: "success" | "error" | "loading";
  heading: string;
  subtext: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  show,
  type,
  heading,
  subtext,
  onClose,
}) => {
  useEffect(() => {
    if (show && type !== "loading") {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, type, onClose]);

  if (!show) return null;

  return createPortal(
    <div className="fixed inset-x-0 bottom-12 z-[9999] flex justify-center animate-fade-in-up">
      <div className="bg-[#1a1a1a] text-[#f2f2f2] rounded-xl shadow-2xl p-4 flex items-center gap-4 min-w-[320px] border border-[#333]">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            type === "success"
              ? "bg-[#25e82c]/10"
              : type === "error"
                ? "bg-red-500/10"
                : "bg-[#a0a0a0]/20"
          }`}
        >
          {type === "loading" ? (
            <Icon
              src={loadingIcon}
              className="h-6 w-6 stroke-[#f2f2f2]/90 animate-spin"
              strokeWidth={1.5}
            />
          ) : (
            <Icon
              src={type === "success" ? successIcon : errorIcon}
              className={`h-6 w-6 ${
                type === "success" ? "stroke-[#25e82c]" : "stroke-red-500"
              }`}
              strokeWidth={1.5}
            />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[#f2f2f2]">{heading}</span>
          <span className="text-xs text-[#f2f2f2]/80">{subtext}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Notification;
