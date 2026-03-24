import { useState } from "react";
import SelectableCard from "./SelectableCard";

const TYPOGRAPHY_OPTIONS = [
  { value: "modern sans-serif", label: "Sans-Serif", description: "Clean and contemporary" },
  { value: "classic serif", label: "Serif", description: "Elegant and timeless" },
  { value: "editorial", label: "Editorial", description: "Strong hierarchy" },
  { value: "playful", label: "Playful", description: "Friendly and rounded" },
  { value: "minimal", label: "Minimal", description: "Quiet and functional" },
];

interface TypographyStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TypographyStep({ value, onChange }: TypographyStepProps) {
  const [isCustom, setIsCustom] = useState(
    value !== "" && !TYPOGRAPHY_OPTIONS.some((o) => o.value === value)
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Typography
      </h2>
      <p className="text-base text-text-secondary mb-6">
        What type style fits your site?
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
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

      <input
        type="text"
        value={isCustom ? value : ""}
        onChange={(e) => {
          setIsCustom(true);
          onChange(e.target.value);
        }}
        onFocus={() => setIsCustom(true)}
        placeholder="Or describe: monospace, technical, handwritten..."
        className="w-full px-4 py-3 text-base bg-transparent border-b border-border-subtle text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
        maxLength={100}
      />
    </div>
  );
}
