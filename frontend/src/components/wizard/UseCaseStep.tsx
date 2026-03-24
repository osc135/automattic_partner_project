import { useState } from "react";
import SelectableCard from "./SelectableCard";

const USE_CASES = [
  { value: "personal", label: "Personal", description: "Personal website or homepage" },
  { value: "business", label: "Business", description: "Company or professional site" },
  { value: "portfolio", label: "Portfolio", description: "Showcase creative work" },
  { value: "blog", label: "Blog", description: "Writing and publishing" },
  { value: "magazine", label: "Magazine", description: "Editorial and news" },
  { value: "restaurant", label: "Restaurant", description: "Food, menus, dining" },
];

interface UseCaseStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UseCaseStep({ value, onChange }: UseCaseStepProps) {
  const [isCustom, setIsCustom] = useState(
    value !== "" && !USE_CASES.some((uc) => uc.value === value)
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        What type of site?
      </h2>
      <p className="text-base text-text-secondary mb-6">
        Pick one or type your own.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {USE_CASES.map((uc) => (
          <SelectableCard
            key={uc.value}
            label={uc.label}
            description={uc.description}
            selected={!isCustom && value === uc.value}
            onClick={() => {
              setIsCustom(false);
              onChange(uc.value);
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
        placeholder="Or type something else..."
        className="w-full px-4 py-3 text-base bg-transparent border-b border-border-subtle text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
        maxLength={100}
      />
    </div>
  );
}
