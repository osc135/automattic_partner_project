export interface ThemeBrief {
  use_case: string;
  description: string;
  color_preference: string;
  typography_preference: string;
  layout_preference: string | null;
  notes: string | null;
  theme_slug?: string;
}

export type WizardStep =
  | "use_case"
  | "description"
  | "color"
  | "typography"
  | "layout"
  | "notes"
  | "review";

export const WIZARD_STEPS: WizardStep[] = [
  "use_case",
  "description",
  "color",
  "typography",
  "layout",
  "notes",
  "review",
];

export const STEP_LABELS: Record<WizardStep, string> = {
  use_case: "Use Case",
  description: "Description",
  color: "Colors",
  typography: "Typography",
  layout: "Layout",
  notes: "Notes",
  review: "Review",
};
