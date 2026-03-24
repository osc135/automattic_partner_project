import type { ThemeBrief } from "../../types";

interface ReviewStepProps {
  brief: ThemeBrief;
  onEdit: (step: number) => void;
}

function Row({
  label,
  value,
  step,
  onEdit,
  children,
}: {
  label: string;
  value?: string | null;
  step: number;
  onEdit: (s: number) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wider text-text-muted mb-1">
          {label}
        </div>
        {children || (
          <div className="text-base text-text-primary">
            {value || <span className="text-text-muted italic">—</span>}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="ml-4 text-sm text-text-muted hover:text-accent transition-colors cursor-pointer"
      >
        edit
      </button>
    </div>
  );
}

function ColorDisplay({ value }: { value: string }) {
  if (value.startsWith("#custom:")) {
    try {
      const colors = JSON.parse(value.replace("#custom:", ""));
      return (
        <div className="flex items-center gap-3">
          <span className="text-base text-text-primary">Custom</span>
          <div className="flex gap-1.5">
            {Object.entries(colors).map(([name, color]) => (
              <div
                key={name}
                className="w-6 h-6 rounded-full border border-white/10"
                style={{ backgroundColor: color as string }}
                title={`${name}: ${color}`}
              />
            ))}
          </div>
        </div>
      );
    } catch {
      return <span className="text-base text-text-primary">{value}</span>;
    }
  }
  return <span className="text-base text-text-primary">{value}</span>;
}

function TypographyDisplay({ value }: { value: string }) {
  try {
    const parsed = JSON.parse(value);
    if (parsed.heading && parsed.body) {
      const label = parsed.heading === parsed.body
        ? parsed.heading
        : `${parsed.heading} + ${parsed.body}`;
      return (
        <div className="flex items-baseline gap-3">
          <span
            className="text-base text-text-primary font-bold"
            style={{ fontFamily: `'${parsed.heading}', system-ui, sans-serif` }}
          >
            {label}
          </span>
        </div>
      );
    }
  } catch {
    // not JSON
  }
  return <span className="text-base text-text-primary">{value}</span>;
}

export default function ReviewStep({ brief, onEdit }: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Review
      </h2>
      <p className="text-base text-text-secondary mb-6">
        Confirm before generating.
      </p>

      <div className="bg-surface-raised rounded-lg px-5 py-2">
        <Row label="Use Case" value={brief.use_case} step={0} onEdit={onEdit} />
        <Row label="Description" value={brief.description} step={1} onEdit={onEdit} />
        <Row label="Colors" step={2} onEdit={onEdit}>
          <ColorDisplay value={brief.color_preference} />
        </Row>
        <Row label="Typography" step={3} onEdit={onEdit}>
          <TypographyDisplay value={brief.typography_preference} />
        </Row>
        <Row label="Layout" value={brief.layout_preference} step={4} onEdit={onEdit} />
        <Row label="Notes" value={brief.notes} step={5} onEdit={onEdit} />
      </div>
    </div>
  );
}
