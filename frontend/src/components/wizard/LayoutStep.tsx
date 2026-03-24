import SelectableCard from "./SelectableCard";

const LAYOUT_OPTIONS = [
  { value: "centred hero", label: "Centred Hero", description: "Large centered banner" },
  { value: "full-width sections", label: "Full-Width", description: "Edge-to-edge blocks" },
  { value: "sidebar", label: "Sidebar", description: "Content with side column" },
  { value: "grid homepage", label: "Grid", description: "Card-based layout" },
  { value: "sticky navigation", label: "Sticky Nav", description: "Fixed header on scroll" },
];

interface LayoutStepProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function LayoutStep({ value, onChange }: LayoutStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Layout preference
      </h2>
      <p className="text-base text-text-secondary mb-6">
        Pick a structure or skip this.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
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
        className={`text-base transition-colors cursor-pointer ${
          value === null
            ? "text-accent"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        {value === null ? "Skipping — AI decides" : "Skip this step"}
      </button>
    </div>
  );
}
