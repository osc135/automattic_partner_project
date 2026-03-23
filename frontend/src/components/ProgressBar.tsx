import { WIZARD_STEPS, STEP_LABELS } from "../types";

interface ProgressBarProps {
  currentIndex: number;
}

export default function ProgressBar({ currentIndex }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {WIZARD_STEPS.map((step, i) => (
        <div key={step} className="flex-1">
          <div
            className={`h-1.5 rounded-full transition-colors ${
              i <= currentIndex ? "bg-indigo-600" : "bg-gray-200"
            }`}
          />
          <div
            className={`mt-1 text-xs text-center hidden sm:block ${
              i === currentIndex
                ? "text-indigo-600 font-medium"
                : i < currentIndex
                  ? "text-gray-500"
                  : "text-gray-300"
            }`}
          >
            {STEP_LABELS[step]}
          </div>
        </div>
      ))}
    </div>
  );
}
