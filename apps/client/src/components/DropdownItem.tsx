export function DropdownItem({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 transition-colors font-normal ${
        className ? className : "text-gray-700 hover:bg-[#ebebeb]"
      }`}
    >
      {children}
    </button>
  );
}
