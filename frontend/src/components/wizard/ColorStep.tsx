import { useState } from "react";
import SelectableCard from "./SelectableCard";

const COLOR_OPTIONS = [
  {
    value: "basic",
    label: "Basic",
    description: "Neutral tones, low contrast, clean and minimal",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced palette with moderate contrast",
  },
  {
    value: "bold",
    label: "Bold",
    description: "High contrast, saturated, eye-catching colors",
  },
];

interface ColorStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorStep({ value, onChange }: ColorStepProps) {
  const [isCustom, setIsCustom] = useState(
    value !== "" && !COLOR_OPTIONS.some((o) => o.value === value)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Color preference
      </h2>
      <p className="text-gray-500 mb-6">
        How bold should the color palette be?
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {COLOR_OPTIONS.map((option) => (
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
          Or describe your color direction
        </label>
        <input
          type="text"
          value={isCustom ? value : ""}
          onChange={(e) => {
            setIsCustom(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsCustom(true)}
          placeholder="e.g., earth tones with terracotta accents"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          maxLength={100}
        />
      </div>
    </div>
  );
}
