import { useState } from "react";
import SelectableCard from "./SelectableCard";

const COLOR_OPTIONS = [
  { value: "basic", label: "Basic", description: "Neutral, low contrast" },
  { value: "medium", label: "Medium", description: "Balanced palette" },
  { value: "bold", label: "Bold", description: "High contrast, saturated" },
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
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Color preference
      </h2>
      <p className="text-base text-text-secondary mb-6">
        How bold should the palette be?
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
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

      <input
        type="text"
        value={isCustom ? value : ""}
        onChange={(e) => {
          setIsCustom(true);
          onChange(e.target.value);
        }}
        onFocus={() => setIsCustom(true)}
        placeholder="Or describe: earth tones, pastels, monochrome..."
        className="w-full px-4 py-3 text-base bg-transparent border-b border-border-subtle text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
        maxLength={100}
      />
    </div>
  );
}
