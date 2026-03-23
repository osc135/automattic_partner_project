import { useState } from "react";
import SelectableCard from "./SelectableCard";

const TYPOGRAPHY_OPTIONS = [
  {
    value: "modern sans-serif",
    label: "Modern Sans-Serif",
    description: "Clean, contemporary, and minimal",
  },
  {
    value: "classic serif",
    label: "Classic Serif",
    description: "Timeless, elegant, and authoritative",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Magazine-style with strong typographic hierarchy",
  },
  {
    value: "playful",
    label: "Playful",
    description: "Friendly, rounded, and approachable",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Restrained, quiet, and functional",
  },
];

interface TypographyStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TypographyStep({
  value,
  onChange,
}: TypographyStepProps) {
  const [isCustom, setIsCustom] = useState(
    value !== "" && !TYPOGRAPHY_OPTIONS.some((o) => o.value === value)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Typography style
      </h2>
      <p className="text-gray-500 mb-6">
        What kind of type treatment suits your site?
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {TYPOGRAPHY_OPTIONS.map((option) => (
          <SelectableCard
            key={option.value}
            label={option.label}
            description={option.description}
            selected={!isCustom && value === option.value}
            onClick={() => {
              setIsCustom(false);
              onChange(option.value);
            }}
          />
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Or describe your typography direction
        </label>
        <input
          type="text"
          value={isCustom ? value : ""}
          onChange={(e) => {
            setIsCustom(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsCustom(true)}
          placeholder="e.g., monospace with a technical feel"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          maxLength={100}
        />
      </div>
    </div>
  );
}
