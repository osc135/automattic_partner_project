import { WIZARD_STEPS, STEP_LABELS } from "../types";

interface ProgressBarProps {
  currentIndex: number;
}

export default function ProgressBar({ currentIndex }: ProgressBarProps) {
  return (
    <div className="flex items-center mb-12">
      {WIZARD_STEPS.map((step, i) => (
        <div key={step} className="flex-1 flex flex-col items-center">
          {/* Dot + line */}
          <div className="flex items-center w-full">
            {i > 0 && (
              <div
                className={`flex-1 h-px transition-colors duration-300 ${
                  i <= currentIndex ? "bg-accent" : "bg-border-subtle"
                }`}
              />
            )}
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                i < currentIndex
                  ? "bg-accent"
                  : i === currentIndex
                    ? "bg-accent ring-4 ring-accent/20"
                    : "bg-border-subtle"
              }`}
            />
            {i < WIZARD_STEPS.length - 1 && (
              <div
                className={`flex-1 h-px transition-colors duration-300 ${
                  i < currentIndex ? "bg-accent" : "bg-border-subtle"
                }`}
              />
            )}
          </div>
          {/* Label */}
          <div
            className={`mt-3 text-xs transition-colors hidden sm:block ${
              i === currentIndex
                ? "text-text-primary font-medium"
                : i < currentIndex
                  ? "text-text-secondary"
                  : "text-text-muted"
            }`}
          >
            {STEP_LABELS[step]}
          </div>
        </div>
      ))}
    </div>
  );
}
