import { useWizard } from "../hooks/useWizard";
import ProgressBar from "./ProgressBar";
import UseCaseStep from "./wizard/UseCaseStep";
import DescriptionStep from "./wizard/DescriptionStep";
import ColorStep from "./wizard/ColorStep";
import TypographyStep from "./wizard/TypographyStep";
import LayoutStep from "./wizard/LayoutStep";
import NotesStep from "./wizard/NotesStep";
import ReviewStep from "./wizard/ReviewStep";

interface WizardProps {
  onSubmit: (brief: ReturnType<typeof useWizard>["brief"], slug: string) => void;
}

export default function Wizard({ onSubmit }: WizardProps) {
  const wizard = useWizard();

  const handleSubmit = () => {
    onSubmit(wizard.brief, wizard.generateSlug());
  };

  const renderStep = () => {
    switch (wizard.currentStep) {
      case "use_case":
        return (
          <UseCaseStep
            value={wizard.brief.use_case}
            onChange={(v) => wizard.updateBrief("use_case", v)}
          />
        );
      case "description":
        return (
          <DescriptionStep
            value={wizard.brief.description}
            onChange={(v) => wizard.updateBrief("description", v)}
          />
        );
      case "color":
        return (
          <ColorStep
            value={wizard.brief.color_preference}
            onChange={(v) => wizard.updateBrief("color_preference", v)}
          />
        );
      case "typography":
        return (
          <TypographyStep
            value={wizard.brief.typography_preference}
            onChange={(v) => wizard.updateBrief("typography_preference", v)}
          />
        );
      case "layout":
        return (
          <LayoutStep
            value={wizard.brief.layout_preference}
            onChange={(v) => wizard.updateBrief("layout_preference", v)}
          />
        );
      case "notes":
        return (
          <NotesStep
            value={wizard.brief.notes ?? ""}
            onChange={(v) => wizard.updateBrief("notes", v || null)}
          />
        );
      case "review":
        return (
          <ReviewStep brief={wizard.brief} onEdit={wizard.goToStep} />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentIndex={wizard.stepIndex} />

      <div className="min-h-[320px]">{renderStep()}</div>

      <div className="flex justify-between mt-8">
        {!wizard.isFirstStep ? (
          <button
            type="button"
            onClick={wizard.goBack}
            className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {wizard.isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
          >
            Generate Theme
          </button>
        ) : (
          <button
            type="button"
            onClick={wizard.goNext}
            disabled={!wizard.canProceed()}
            className="px-6 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
