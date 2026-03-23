import SelectableCard from "./SelectableCard";

const LAYOUT_OPTIONS = [
  {
    value: "centred hero",
    label: "Centred Hero",
    description: "Large hero section with centered content",
  },
  {
    value: "full-width sections",
    label: "Full-Width Sections",
    description: "Edge-to-edge content blocks",
  },
  {
    value: "sidebar",
    label: "Sidebar",
    description: "Content area with a side column",
  },
  {
    value: "grid homepage",
    label: "Grid Homepage",
    description: "Card-based grid layout for the front page",
  },
  {
    value: "sticky navigation",
    label: "Sticky Navigation",
    description: "Fixed header that stays visible on scroll",
  },
];

interface LayoutStepProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function LayoutStep({ value, onChange }: LayoutStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Layout preference
      </h2>
      <p className="text-gray-500 mb-6">
        Choose a layout style, or skip this step to let the AI decide.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {LAYOUT_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange(null)}
        className={`mt-2 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
          value === null
            ? "bg-indigo-100 text-indigo-700 font-medium"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        Skip — let the AI decide
      </button>
    </div>
  );
}
