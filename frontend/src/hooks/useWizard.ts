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

export function useWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [brief, setBrief] = useState<ThemeBrief>({ ...INITIAL_BRIEF });

  const currentStep = WIZARD_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case "use_case":
        return brief.use_case.trim().length > 0;
      case "description":
        return brief.description.trim().length > 0;
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
  }, [currentStep, brief]);

  const goNext = useCallback(() => {
    if (stepIndex < WIZARD_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    }
  }, [stepIndex]);

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
  };
}
