import { useState } from "react";
import SelectableCard from "./SelectableCard";

const USE_CASES = [
  { value: "personal", label: "Personal", description: "A personal website or homepage" },
  { value: "business", label: "Business", description: "A company or professional site" },
  { value: "portfolio", label: "Portfolio", description: "Showcase creative work" },
  { value: "blog", label: "Blog", description: "Writing and content publishing" },
  { value: "magazine", label: "Magazine", description: "Editorial and news content" },
  { value: "restaurant", label: "Restaurant", description: "Food, menus, and dining" },
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
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What type of site is this?
      </h2>
      <p className="text-gray-500 mb-6">
        Choose a category or describe your own.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
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

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Or type your own
        </label>
        <input
          type="text"
          value={isCustom ? value : ""}
          onChange={(e) => {
            setIsCustom(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsCustom(true)}
          placeholder="e.g., dog grooming salon"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          maxLength={100}
        />
      </div>
    </div>
  );
}
