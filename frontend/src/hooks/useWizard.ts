import { useState, useCallback } from "react";
import type { ThemeBrief } from "../types";
import { WIZARD_STEPS } from "../types";

const INITIAL_BRIEF: ThemeBrief = {
  use_case: "",
  description: "",
  color_preference: "",
  typography_preference: "",
  layout_preference: null,
  notes: null,
};

export interface SuggestedPalette {
  colors: string[];
  name: string;
  description: string;
}

export function useWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [brief, setBrief] = useState<ThemeBrief>({ ...INITIAL_BRIEF });
  const [suggestedPalette, setSuggestedPalette] = useState<SuggestedPalette | null>(null);
  const [extractingPalette, setExtractingPalette] = useState(false);

  const currentStep = WIZARD_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case "use_case":
        return brief.use_case.trim().length > 0;
      case "description":
        return brief.description.trim().length > 0 && !extractingPalette;
      case "color":
        return brief.color_preference.trim().length > 0;
      case "typography":
        return brief.typography_preference.trim().length > 0;
      case "layout":
      case "notes":
      case "review":
        return true;
      default:
        return false;
    }
  }, [currentStep, brief, extractingPalette]);

  const goNext = useCallback(async () => {
    if (stepIndex >= WIZARD_STEPS.length - 1) return;

    const nextIndex = stepIndex + 1;
    const nextStep = WIZARD_STEPS[nextIndex];

    // Extract palette when moving to color step
    if (nextStep === "color" && brief.description.trim()) {
      setExtractingPalette(true);
      try {
        const res = await fetch("/api/extract-palette", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: brief.description }),
        });
        const data = await res.json();
        if (data.palette) {
          setSuggestedPalette(data.palette);
          // Auto-select if no color chosen yet
          if (brief.color_preference === "") {
            setBrief((prev) => ({
              ...prev,
              color_preference: `#suggested:${JSON.stringify(data.palette)}`,
            }));
          }
        }
      } catch {
        // Extraction failed — no big deal, user picks manually
      }
      setExtractingPalette(false);
    }

    setStepIndex(nextIndex);
  }, [stepIndex, brief.description, brief.color_preference]);

  const goBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  }, [stepIndex]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < WIZARD_STEPS.length) {
      setStepIndex(index);
    }
  }, []);

  const updateBrief = useCallback(
    <K extends keyof ThemeBrief>(field: K, value: ThemeBrief[K]) => {
      setBrief((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setStepIndex(0);
    setBrief({ ...INITIAL_BRIEF });
    setSuggestedPalette(null);
  }, []);

  const generateSlug = useCallback((): string => {
    const slug = brief.description
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    return slug || "generated-theme";
  }, [brief.description]);

  return {
    stepIndex,
    currentStep,
    brief,
    isFirstStep,
    isLastStep,
    canProceed,
    goNext,
    goBack,
    goToStep,
    updateBrief,
    reset,
    generateSlug,
    suggestedPalette,
    extractingPalette,
  };
}
