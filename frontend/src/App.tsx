import { useState, useEffect } from "react";
import Wizard from "./components/Wizard";
import ThemePreview from "./components/ThemePreview";
import type { DesignSpec } from "./components/ThemePreview";
import type { ThemeBrief } from "./types";

type AppState =
  | { stage: "landing" }
  | { stage: "wizard" }
  | { stage: "loading"; startTime: number }
  | { stage: "preview"; design: DesignSpec; filename: string; zipBase64: string }
  | { stage: "error"; message: string };

const LOADING_STEPS = [
  "Analyzing your brief",
  "Choosing colors & typography",
  "Writing site content",
  "Building templates",
  "Packaging theme",
];

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="mb-8 animate-float">
        <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      <h1 className="text-5xl sm:text-6xl font-bold text-text-primary text-center leading-tight mb-4">
        Build your theme
        <br />
        <span className="bg-gradient-to-r from-accent via-purple-400 to-pink-400 bg-clip-text text-transparent">
          in seconds
        </span>
      </h1>

      <p className="text-xl text-text-secondary text-center max-w-md mb-12 leading-relaxed">
        Describe your site and we'll generate a complete
        WordPress block theme ready to install.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="group px-10 py-4 text-lg text-white bg-accent hover:bg-accent-hover rounded-xl transition-all font-medium cursor-pointer shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]"
      >
        Start Building
        <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
      </button>

      <div className="mt-16 flex items-center gap-8 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          No coding required
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          Live preview
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success" />
          Ready to install
        </div>
      </div>
    </div>
  );
}

function LoadingScreen({ startTime }: { startTime: number }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setStepIndex(
        Math.min(Math.floor(elapsed / 2500), LOADING_STEPS.length - 1)
      );
    }, 400);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="relative w-24 h-24 mb-12">
        <div className="absolute inset-0 rounded-full border border-border-subtle animate-glow" />
        <div className="absolute inset-2 rounded-full border border-accent/30 animate-spin" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-4 rounded-full border border-accent/50 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse-dot" />
        </div>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        {LOADING_STEPS.map((step, i) => (
          <div
            key={step}
            className={`flex items-center gap-4 transition-all duration-500 ${
              i < stepIndex
                ? "text-text-muted"
                : i === stepIndex
                  ? "text-text-primary"
                  : "text-text-muted/20"
            }`}
          >
            <div className="w-5 text-center flex-shrink-0">
              {i < stepIndex ? (
                <span className="text-accent">&#10003;</span>
              ) : i === stepIndex ? (
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
              ) : (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </div>
            <span className="text-base">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }
  return new Blob([arr], { type: mimeType });
}

function App() {
  const [state, setState] = useState<AppState>({ stage: "landing" });

  const handleSubmit = async (brief: ThemeBrief, slug: string) => {
    setState({ stage: "loading", startTime: Date.now() });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...brief, theme_slug: slug }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Generation failed");
      }

      const data = await response.json();
      setState({
        stage: "preview",
        design: data.design,
        filename: data.filename,
        zipBase64: data.zip_base64,
      });
    } catch (err) {
      setState({
        stage: "error",
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  const handleDownload = () => {
    if (state.stage !== "preview") return;
    const blob = base64ToBlob(state.zipBase64, "application/zip");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = state.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => setState({ stage: "landing" });

  return (
    <div className="min-h-screen bg-grid bg-radial-glow">
      <div className={`px-6 py-12 mx-auto ${state.stage === "preview" ? "max-w-5xl" : "max-w-3xl"}`}>
        {state.stage !== "preview" && (
          <div className="text-center mb-10">
            {state.stage === "wizard" && (
              <>
                <p className="text-sm text-text-muted mb-1">Step-by-step</p>
                <h1 className="text-3xl font-bold text-text-primary">
                  Design your theme
                </h1>
              </>
            )}
          </div>
        )}

        {state.stage === "landing" && (
          <LandingScreen onStart={() => setState({ stage: "wizard" })} />
        )}

        {state.stage === "wizard" && (
          <div className="animate-fade-in">
            <Wizard onSubmit={handleSubmit} />
          </div>
        )}

        {state.stage === "loading" && (
          <LoadingScreen startTime={state.startTime} />
        )}

        {state.stage === "preview" && (
          <ThemePreview
            design={state.design}
            filename={state.filename}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}

        {state.stage === "error" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mb-8">
              <span className="text-error text-3xl font-light">!</span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Something went wrong
            </h2>
            <p className="text-lg text-error/70 mb-10 text-center max-w-sm">
              {state.message}
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="px-10 py-4 text-lg text-white bg-accent hover:bg-accent-hover rounded-xl transition-all font-medium cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
