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
}: {
  label: string;
  value: string | null;
  step: number;
  onEdit: (s: number) => void;
}) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wider text-text-muted mb-1">
          {label}
        </div>
        <div className="text-base text-text-primary">
          {value || <span className="text-text-muted italic">—</span>}
        </div>
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
        <Row label="Colors" value={brief.color_preference} step={2} onEdit={onEdit} />
        <Row label="Typography" value={brief.typography_preference} step={3} onEdit={onEdit} />
        <Row label="Layout" value={brief.layout_preference} step={4} onEdit={onEdit} />
        <Row label="Notes" value={brief.notes} step={5} onEdit={onEdit} />
      </div>
    </div>
  );
}
