import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition self-auto";

  const variants = {
    default: "bg-gray-800 text-white hover:bg-gray-700",
    primary: "bg-green-500 text-white hover:bg-green-600",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
