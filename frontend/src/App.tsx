import { useState } from "react";
import Wizard from "./components/Wizard";
import type { ThemeBrief } from "./types";

type AppState =
  | { stage: "wizard" }
  | { stage: "loading" }
  | { stage: "success"; url: string; filename: string }
  | { stage: "error"; message: string };

function App() {
  const [state, setState] = useState<AppState>({ stage: "wizard" });

  const handleSubmit = async (brief: ThemeBrief, slug: string) => {
    setState({ stage: "loading" });

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

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setState({ stage: "success", url, filename: `${slug}.zip` });
    } catch (err) {
      setState({
        stage: "error",
        message: err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            WordPress Theme Generator
          </h1>
          <p className="mt-2 text-gray-500">
            Describe your ideal site and get a ready-to-install block theme.
          </p>
        </div>

        {state.stage === "wizard" && <Wizard onSubmit={handleSubmit} />}

        {state.stage === "loading" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600 text-lg">Generating your theme...</p>
            <p className="text-gray-400 text-sm mt-2">
              This may take 15–30 seconds.
            </p>
          </div>
        )}

        {state.stage === "success" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="text-5xl mb-4">&#10003;</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Theme generated!
            </h2>
            <p className="text-gray-500 mb-6">
              Your WordPress block theme is ready to download.
            </p>
            <a
              href={state.url}
              download={state.filename}
              className="inline-block px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Download {state.filename}
            </a>
            <button
              type="button"
              onClick={() => setState({ stage: "wizard" })}
              className="block mx-auto mt-4 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Generate another theme
            </button>
          </div>
        )}

        {state.stage === "error" && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="text-5xl mb-4">&#9888;</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Generation failed
            </h2>
            <p className="text-red-600 mb-6">{state.message}</p>
            <button
              type="button"
              onClick={() => setState({ stage: "wizard" })}
              className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer"
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
