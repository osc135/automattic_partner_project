import type { ThemeBrief } from "../../types";

interface ReviewStepProps {
  brief: ThemeBrief;
  onEdit: (step: number) => void;
}

function ReviewRow({
  label,
  value,
  stepIndex,
  onEdit,
}: {
  label: string;
  value: string | null;
  stepIndex: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="mt-0.5 text-gray-900">
          {value || <span className="text-gray-400 italic">Not specified</span>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onEdit(stepIndex)}
        className="ml-4 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
      >
        Edit
      </button>
    </div>
  );
}

export default function ReviewStep({ brief, onEdit }: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Review your brief
      </h2>
      <p className="text-gray-500 mb-6">
        Confirm everything looks right before generating your theme.
      </p>

      <div className="bg-white rounded-lg border border-gray-200 p-4 divide-y divide-gray-100">
        <ReviewRow
          label="Use Case"
          value={brief.use_case}
          stepIndex={0}
          onEdit={onEdit}
        />
        <ReviewRow
          label="Description"
          value={brief.description}
          stepIndex={1}
          onEdit={onEdit}
        />
        <ReviewRow
          label="Color Preference"
          value={brief.color_preference}
          stepIndex={2}
          onEdit={onEdit}
        />
        <ReviewRow
          label="Typography"
          value={brief.typography_preference}
          stepIndex={3}
          onEdit={onEdit}
        />
        <ReviewRow
          label="Layout"
          value={brief.layout_preference}
          stepIndex={4}
          onEdit={onEdit}
        />
        <ReviewRow
          label="Notes"
          value={brief.notes}
          stepIndex={5}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}
