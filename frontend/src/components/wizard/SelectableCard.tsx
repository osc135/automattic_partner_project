interface SelectableCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectableCard({
  label,
  description,
  selected,
  onClick,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
        selected
          ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="font-medium text-gray-900">{label}</div>
      {description && (
        <div className="mt-1 text-sm text-gray-500">{description}</div>
      )}
    </button>
  );
}
