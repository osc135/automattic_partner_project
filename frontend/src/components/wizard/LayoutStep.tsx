interface LayoutStepProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const LAYOUTS = [
  {
    value: "centred hero",
    label: "Centred Hero",
    description: "Big centered headline with supporting text",
  },
  {
    value: "full-width sections",
    label: "Full-Width",
    description: "Edge-to-edge colored content bands",
  },
  {
    value: "sidebar",
    label: "Sidebar",
    description: "Main content with a side column",
  },
  {
    value: "grid homepage",
    label: "Grid",
    description: "Card-based grid layout",
  },
  {
    value: "sticky navigation",
    label: "Sticky Nav",
    description: "Header that follows you on scroll",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Clean, text-focused, lots of whitespace",
  },
];

function LayoutDiagram({ type }: { type: string }) {
  const base = "rounded bg-text-muted/20";
  const accent = "rounded bg-accent/40";
  const muted = "rounded bg-text-muted/10";

  switch (type) {
    case "centred hero":
      return (
        <div className="flex flex-col gap-1.5 w-full">
          <div className={`${base} h-3 w-full`} />
          <div className={`${accent} h-14 w-full flex flex-col items-center justify-center gap-1 py-2`}>
            <div className="w-16 h-1.5 rounded bg-white/40" />
            <div className="w-10 h-1 rounded bg-white/20" />
          </div>
          <div className="flex gap-1.5">
            <div className={`${muted} h-8 flex-1`} />
            <div className={`${muted} h-8 flex-1`} />
            <div className={`${muted} h-8 flex-1`} />
          </div>
          <div className={`${base} h-6 w-full`} />
        </div>
      );
    case "full-width sections":
      return (
        <div className="flex flex-col gap-1.5 w-full">
          <div className={`${base} h-3 w-full`} />
          <div className={`${accent} h-10 w-full`} />
          <div className={`${muted} h-8 w-full`} />
          <div className={`${base} h-8 w-full`} />
          <div className={`${accent} h-6 w-full opacity-60`} />
        </div>
      );
    case "sidebar":
      return (
        <div className="flex flex-col gap-1.5 w-full">
          <div className={`${base} h-3 w-full`} />
          <div className="flex gap-1.5 flex-1">
            <div className={`${muted} flex-[2] h-24`} />
            <div className={`${base} flex-[1] h-24`} />
          </div>
          <div className={`${base} h-5 w-full`} />
        </div>
      );
    case "grid homepage":
      return (
        <div className="flex flex-col gap-1.5 w-full">
          <div className={`${base} h-3 w-full`} />
          <div className={`${accent} h-8 w-full`} />
          <div className="grid grid-cols-3 gap-1.5">
            <div className={`${muted} h-8`} />
            <div className={`${muted} h-8`} />
            <div className={`${muted} h-8`} />
            <div className={`${muted} h-8`} />
            <div className={`${muted} h-8`} />
            <div className={`${muted} h-8`} />
          </div>
          <div className={`${base} h-5 w-full`} />
        </div>
      );
    case "sticky navigation":
      return (
        <div className="flex flex-col gap-1.5 w-full relative">
          <div className={`${accent} h-3 w-full sticky top-0 z-10`} />
          <div className={`${muted} h-12 w-full`} />
          <div className="flex gap-1.5">
            <div className={`${base} h-8 flex-1`} />
            <div className={`${base} h-8 flex-1`} />
            <div className={`${base} h-8 flex-1`} />
          </div>
          <div className={`${muted} h-6 w-full`} />
          <div className={`${base} h-5 w-full`} />
        </div>
      );
    case "minimal":
      return (
        <div className="flex flex-col gap-2 w-full items-center py-2">
          <div className="w-12 h-1.5 rounded bg-text-muted/20" />
          <div className="h-4" />
          <div className="w-20 h-2 rounded bg-text-muted/30" />
          <div className="w-14 h-1 rounded bg-text-muted/15" />
          <div className="h-4" />
          <div className="w-24 h-1 rounded bg-text-muted/15" />
          <div className="w-24 h-1 rounded bg-text-muted/10" />
          <div className="w-20 h-1 rounded bg-text-muted/10" />
          <div className="h-4" />
          <div className="w-16 h-1 rounded bg-text-muted/15" />
        </div>
      );
    default:
      return null;
  }
}

export default function LayoutStep({ value, onChange }: LayoutStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Layout preference
      </h2>
      <p className="text-base text-text-secondary mb-6">
        Pick a structure or let the AI decide.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.value}
            type="button"
            onClick={() => onChange(layout.value)}
            className={`flex flex-col rounded-xl transition-all cursor-pointer border overflow-hidden ${
              value === layout.value
                ? "bg-surface-selected border-border-active scale-[1.01]"
                : "bg-surface-raised border-border-subtle hover:bg-surface-hover hover:border-border-active/30"
            }`}
          >
            {/* Diagram */}
            <div className="px-4 pt-4 pb-2 w-full">
              <div className="h-[120px] flex items-stretch">
                <LayoutDiagram type={layout.value} />
              </div>
            </div>

            {/* Label */}
            <div className="px-4 pb-4 text-left w-full">
              <div className={`text-sm font-semibold ${value === layout.value ? "text-accent" : "text-text-primary"}`}>
                {layout.label}
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                {layout.description}
              </div>
            </div>
          </button>
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
