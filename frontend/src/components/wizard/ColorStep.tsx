import { useState } from "react";
import { HexColorPicker } from "react-colorful";

const PALETTES = [
  {
    name: "Ocean",
    colors: ["#0f172a", "#1e40af", "#3b82f6", "#93c5fd", "#f0f9ff"],
    description: "Deep blues and calm tones",
  },
  {
    name: "Sunset",
    colors: ["#1c1917", "#c2410c", "#f97316", "#fbbf24", "#fffbeb"],
    description: "Warm oranges and golden hues",
  },
  {
    name: "Forest",
    colors: ["#14532d", "#15803d", "#4ade80", "#bbf7d0", "#f0fdf4"],
    description: "Natural greens and earth tones",
  },
  {
    name: "Midnight",
    colors: ["#0a0a0a", "#18181b", "#6366f1", "#a5b4fc", "#f5f5f5"],
    description: "Dark base with vibrant indigo",
  },
  {
    name: "Rose",
    colors: ["#1a1a2e", "#be185d", "#ec4899", "#f9a8d4", "#fff1f2"],
    description: "Bold pinks and soft blush",
  },
  {
    name: "Earth",
    colors: ["#292524", "#92400e", "#b45309", "#d6d3d1", "#fafaf9"],
    description: "Terracotta, stone, and warmth",
  },
  {
    name: "Monochrome",
    colors: ["#09090b", "#27272a", "#71717a", "#d4d4d8", "#fafafa"],
    description: "Clean blacks, grays, and whites",
  },
  {
    name: "Coral",
    colors: ["#1e293b", "#e11d48", "#fb7185", "#fecdd3", "#fff7ed"],
    description: "Vibrant coral with warm neutrals",
  },
];

const COLOR_KEYS = [
  { key: "primary", label: "Primary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
] as const;

interface ColorStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorStep({ value, onChange }: ColorStepProps) {
  const isCustom = value.startsWith("#custom:");
  const isPalette = !isCustom && PALETTES.some((p) => p.name === value);

  const [mode, setMode] = useState<"palette" | "custom">(
    isCustom ? "custom" : "palette"
  );

  const [customColors, setCustomColors] = useState<Record<string, string>>(() => {
    if (isCustom) {
      try {
        return JSON.parse(value.replace(/^#custom:/, ""));
      } catch {
        return { primary: "#2563eb", accent: "#8b5cf6", background: "#ffffff" };
      }
    }
    return { primary: "#2563eb", accent: "#8b5cf6", background: "#ffffff" };
  });

  const [activeColor, setActiveColor] = useState<string>("primary");

  const handleCustomChange = (key: string, color: string) => {
    const updated = { ...customColors, [key]: color };
    setCustomColors(updated);
    onChange(`#custom:${JSON.stringify(updated)}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Color preference
      </h2>
      <p className="text-base text-text-secondary mb-5">
        Pick a palette or choose your own colors.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("palette")}
          className={`px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
            mode === "palette"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "bg-surface-raised text-text-secondary border border-border-subtle hover:text-text-primary"
          }`}
        >
          Palettes
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("custom");
            onChange(`#custom:${JSON.stringify(customColors)}`);
          }}
          className={`px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
            mode === "custom"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "bg-surface-raised text-text-secondary border border-border-subtle hover:text-text-primary"
          }`}
        >
          Custom colors
        </button>
      </div>

      {mode === "palette" && (
        <div className="grid grid-cols-2 gap-3">
          {PALETTES.map((palette) => (
            <button
              key={palette.name}
              type="button"
              onClick={() => onChange(palette.name)}
              className={`flex items-start gap-3 px-4 py-4 rounded-xl text-left transition-all cursor-pointer border ${
                isPalette && value === palette.name
                  ? "bg-surface-selected border-border-active scale-[1.01]"
                  : "bg-surface-raised border-border-subtle hover:bg-surface-hover hover:border-border-active/30"
              }`}
            >
              <div className="flex gap-1 flex-shrink-0 pt-0.5">
                {palette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="min-w-0">
                <div className={`text-sm font-semibold ${isPalette && value === palette.name ? "text-accent" : "text-text-primary"}`}>
                  {palette.name}
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {palette.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {mode === "custom" && (
        <div>
          <p className="text-sm text-text-secondary mb-5">
            Pick your key colors — the AI will build a full palette around them.
          </p>

          <div className="flex gap-6">
            {/* Color picker */}
            <div className="flex-shrink-0">
              <HexColorPicker
                color={customColors[activeColor]}
                onChange={(color) => handleCustomChange(activeColor, color)}
                style={{ width: 220, height: 220 }}
              />
              {/* Hex input */}
              <div className="mt-3 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-white/10 flex-shrink-0"
                  style={{ backgroundColor: customColors[activeColor] }}
                />
                <input
                  type="text"
                  value={customColors[activeColor]}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                      handleCustomChange(activeColor, v);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-surface-raised border border-border-subtle rounded-lg text-text-primary font-mono focus:border-accent focus:outline-none"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Color slots */}
            <div className="flex-1 space-y-3">
              {COLOR_KEYS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveColor(key)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                    activeColor === key
                      ? "bg-surface-selected border-border-active"
                      : "bg-surface-raised border-border-subtle hover:bg-surface-hover"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg border border-white/10 flex-shrink-0"
                    style={{ backgroundColor: customColors[key] }}
                  />
                  <div>
                    <div className={`text-sm font-medium ${activeColor === key ? "text-accent" : "text-text-primary"}`}>
                      {label}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      {customColors[key]}
                    </div>
                  </div>
                </button>
              ))}

              {/* Preview strip */}
              <div className="flex rounded-lg overflow-hidden h-12 border border-border-subtle mt-4">
                <div className="flex-1" style={{ backgroundColor: customColors.background }} />
                <div className="flex-1" style={{ backgroundColor: customColors.primary }} />
                <div className="flex-1" style={{ backgroundColor: customColors.accent }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
