export function DropdownItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
    >
      {children}
    </button>
  );
}
