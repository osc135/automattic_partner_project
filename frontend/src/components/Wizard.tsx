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
            suggestedPalette={wizard.suggestedPalette}
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

      <div className="min-h-[380px] animate-fade-in" key={wizard.currentStep}>
        {wizard.extractingPalette ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mb-4" />
            <p className="text-text-secondary">Analyzing your description for colors...</p>
          </div>
        ) : (
          renderStep()
        )}
      </div>

      <div className="flex justify-between items-center mt-10">
        {!wizard.isFirstStep ? (
          <button
            type="button"
            onClick={wizard.goBack}
            className="px-6 py-3 text-base text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            &larr; Back
          </button>
        ) : (
          <div />
        )}

        {wizard.isLastStep ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="group px-10 py-3.5 text-base text-white bg-accent hover:bg-accent-hover rounded-xl transition-all font-medium cursor-pointer shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Generate Theme
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={wizard.goNext}
            disabled={!wizard.canProceed()}
            className="group px-10 py-3.5 text-base text-white bg-accent hover:bg-accent-hover rounded-xl transition-all font-medium disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            {wizard.extractingPalette ? "Analyzing..." : "Next"}
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
}
