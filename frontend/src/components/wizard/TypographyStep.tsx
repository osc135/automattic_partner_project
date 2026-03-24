import { useState, useEffect } from "react";

const FONTS = ["Montserrat", "Schibsted Grotesk", "Karla", "DM Sans", "Open Sans"];

const FONT_URLS: Record<string, string> = {
  "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap",
  "Schibsted Grotesk": "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;700&display=swap",
  "Karla": "https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap",
  "DM Sans": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap",
  "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap",
};

const PAIRINGS = [
  { heading: "Montserrat", body: "DM Sans", vibe: "Modern & bold" },
  { heading: "Schibsted Grotesk", body: "Open Sans", vibe: "Sharp & clean" },
  { heading: "Montserrat", body: "Open Sans", vibe: "Professional" },
  { heading: "Karla", body: "DM Sans", vibe: "Friendly & warm" },
  { heading: "Schibsted Grotesk", body: "Karla", vibe: "Editorial" },
  { heading: "DM Sans", body: "DM Sans", vibe: "Minimal & unified" },
  { heading: "Montserrat", body: "Karla", vibe: "Confident & approachable" },
  { heading: "Schibsted Grotesk", body: "DM Sans", vibe: "Technical & precise" },
];

function fontFamily(name: string): string {
  return `'${name}', system-ui, sans-serif`;
}

function encodePairing(heading: string, body: string): string {
  return JSON.stringify({ heading, body });
}

function decodePairing(value: string): { heading: string; body: string } | null {
  try {
    const parsed = JSON.parse(value);
    if (parsed.heading && parsed.body) return parsed;
  } catch {
    // not a pairing
  }
  return null;
}

interface TypographyStepProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TypographyStep({ value, onChange }: TypographyStepProps) {
  const decoded = decodePairing(value);
  const isCustom = decoded !== null && !PAIRINGS.some(
    (p) => p.heading === decoded.heading && p.body === decoded.body
  );

  const [mode, setMode] = useState<"pairings" | "custom">(isCustom ? "custom" : "pairings");
  const [customHeading, setCustomHeading] = useState(decoded?.heading || "Montserrat");
  const [customBody, setCustomBody] = useState(decoded?.body || "DM Sans");

  // Load all fonts
  useEffect(() => {
    Object.values(FONT_URLS).forEach((url) => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }, []);

  const selectedPairing = decoded
    ? PAIRINGS.find((p) => p.heading === decoded.heading && p.body === decoded.body)
    : null;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-1">
        Typography
      </h2>
      <p className="text-base text-text-secondary mb-5">
        Pick a font pairing or choose your own.
      </p>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode("pairings")}
          className={`px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
            mode === "pairings"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "bg-surface-raised text-text-secondary border border-border-subtle hover:text-text-primary"
          }`}
        >
          Pairings
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("custom");
            onChange(encodePairing(customHeading, customBody));
          }}
          className={`px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
            mode === "custom"
              ? "bg-accent/15 text-accent border border-accent/30"
              : "bg-surface-raised text-text-secondary border border-border-subtle hover:text-text-primary"
          }`}
        >
          Custom pairing
        </button>
      </div>

      {mode === "pairings" && (
        <div className="grid grid-cols-2 gap-3">
          {PAIRINGS.map((pairing) => {
            const isSelected =
              selectedPairing?.heading === pairing.heading &&
              selectedPairing?.body === pairing.body;

            return (
              <button
                key={`${pairing.heading}-${pairing.body}`}
                type="button"
                onClick={() => onChange(encodePairing(pairing.heading, pairing.body))}
                className={`px-5 py-5 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-surface-selected border-border-active scale-[1.01]"
                    : "bg-surface-raised border-border-subtle hover:bg-surface-hover hover:border-border-active/30"
                }`}
              >
                {/* Font preview */}
                <div
                  style={{ fontFamily: fontFamily(pairing.heading), fontWeight: 700, letterSpacing: "-0.02em" }}
                  className={`text-xl leading-tight mb-2 ${isSelected ? "text-accent" : "text-text-primary"}`}
                >
                  The quick brown fox
                </div>
                <div
                  style={{ fontFamily: fontFamily(pairing.body) }}
                  className="text-sm text-text-secondary leading-relaxed mb-3"
                >
                  Jumps over the lazy dog near the riverbank.
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {pairing.heading === pairing.body
                      ? pairing.heading
                      : `${pairing.heading} + ${pairing.body}`}
                  </span>
                  <span className={`text-xs ${isSelected ? "text-accent" : "text-text-muted"}`}>
                    {pairing.vibe}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {mode === "custom" && (
        <div className="space-y-6">
          <p className="text-sm text-text-secondary">
            Choose a heading and body font separately.
          </p>

          {/* Heading font */}
          <div>
            <label className="block text-xs text-text-muted mb-3 uppercase tracking-wider">
              Heading font
            </label>
            <div className="grid grid-cols-5 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    setCustomHeading(font);
                    onChange(encodePairing(font, customBody));
                  }}
                  className={`py-3 px-2 rounded-lg text-center transition-all cursor-pointer border ${
                    customHeading === font
                      ? "bg-surface-selected border-border-active"
                      : "bg-surface-raised border-border-subtle hover:bg-surface-hover"
                  }`}
                >
                  <div
                    style={{ fontFamily: fontFamily(font), fontWeight: 700 }}
                    className={`text-lg leading-tight mb-1 ${customHeading === font ? "text-accent" : "text-text-primary"}`}
                  >
                    Aa
                  </div>
                  <div className="text-[10px] text-text-muted truncate">
                    {font}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Body font */}
          <div>
            <label className="block text-xs text-text-muted mb-3 uppercase tracking-wider">
              Body font
            </label>
            <div className="grid grid-cols-5 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => {
                    setCustomBody(font);
                    onChange(encodePairing(customHeading, font));
                  }}
                  className={`py-3 px-2 rounded-lg text-center transition-all cursor-pointer border ${
                    customBody === font
                      ? "bg-surface-selected border-border-active"
                      : "bg-surface-raised border-border-subtle hover:bg-surface-hover"
                  }`}
                >
                  <div
                    style={{ fontFamily: fontFamily(font) }}
                    className={`text-base leading-tight mb-1 ${customBody === font ? "text-accent" : "text-text-primary"}`}
                  >
                    Aa
                  </div>
                  <div className="text-[10px] text-text-muted truncate">
                    {font}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div className="bg-surface-raised rounded-xl border border-border-subtle p-6">
            <div className="text-xs text-text-muted uppercase tracking-wider mb-4">Preview</div>
            <div
              style={{ fontFamily: fontFamily(customHeading), fontWeight: 700, letterSpacing: "-0.02em" }}
              className="text-3xl text-text-primary leading-tight mb-3"
            >
              A heading that makes you want to keep reading
            </div>
            <div
              style={{ fontFamily: fontFamily(customBody) }}
              className="text-base text-text-secondary leading-relaxed"
            >
              This is what your body text will look like. It should be easy to read, comfortable at length, and complement the heading font without competing for attention.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
