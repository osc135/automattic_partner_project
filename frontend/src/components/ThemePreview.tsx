interface DesignSpec {
  theme_name: string;
  description: string;
  archetype: string;
  colors: {
    base: string;
    surface: string;
    foreground: string;
    muted: string;
    accent: string;
    accent_foreground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  hero: {
    heading: string;
    subheading: string;
    button_text: string;
  };
  features: {
    heading: string;
    items: { title: string; description: string }[];
  };
  footer: {
    tagline: string;
    columns: { heading: string; text: string }[];
    copyright: string;
  };
}

interface ThemePreviewProps {
  design: DesignSpec;
  filename: string;
  onDownload: () => void;
  onReset: () => void;
}

const FONT_URLS: Record<string, string> = {
  "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap",
  "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap",
  "DM Sans": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
  "Karla": "https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700&display=swap",
  "Schibsted Grotesk": "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;600;700;800&display=swap",
};

function fontFamily(name: string): string {
  return `'${name}', system-ui, sans-serif`;
}

export type { DesignSpec };

export default function ThemePreview({ design, filename, onDownload, onReset }: ThemePreviewProps) {
  const { colors, fonts, hero, features, footer } = design;

  // Load Google Fonts
  const fontUrls = new Set<string>();
  if (FONT_URLS[fonts.heading]) fontUrls.add(FONT_URLS[fonts.heading]);
  if (FONT_URLS[fonts.body]) fontUrls.add(FONT_URLS[fonts.body]);

  return (
    <div className="animate-fade-in">
      {/* Font loader */}
      {[...fontUrls].map((url) => (
        <link key={url} rel="stylesheet" href={url} />
      ))}

      {/* Action bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">{design.theme_name}</h2>
          <p className="text-sm text-text-secondary">{design.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-5 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Start over
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="px-6 py-2.5 text-sm text-white bg-accent hover:bg-accent-hover rounded-lg transition-all font-medium cursor-pointer shadow-lg shadow-accent/20"
          >
            Download {filename}
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="rounded-xl overflow-hidden border border-border-subtle shadow-2xl">
        {/* Browser chrome */}
        <div className="bg-surface-raised px-4 py-3 flex items-center gap-2 border-b border-border-subtle">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 text-center text-xs text-text-muted">
            {design.theme_name}
          </div>
        </div>

        {/* Theme preview */}
        <div style={{ fontFamily: fontFamily(fonts.body), color: colors.foreground }}>
          {/* Header */}
          <div style={{ backgroundColor: colors.foreground, color: colors.base, padding: "16px 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ fontFamily: fontFamily(fonts.heading), fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
                {design.theme_name}
              </div>
              <div style={{ display: "flex", gap: 24, fontSize: "0.9rem", opacity: 0.7 }}>
                <span>Home</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div style={{
            backgroundColor: colors.accent,
            color: colors.accent_foreground,
            padding: "100px 48px",
            textAlign: "center",
          }}>
            <h1 style={{
              fontFamily: fontFamily(fonts.heading),
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 20,
              maxWidth: 800,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
              {hero.heading}
            </h1>
            <p style={{
              fontSize: "1.25rem",
              lineHeight: 1.6,
              opacity: 0.9,
              maxWidth: 600,
              margin: "0 auto 32px",
            }}>
              {hero.subheading}
            </p>
            <button style={{
              backgroundColor: colors.base,
              color: colors.foreground,
              padding: "14px 32px",
              borderRadius: 8,
              border: "none",
              fontFamily: fontFamily(fonts.body),
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}>
              {hero.button_text}
            </button>
          </div>

          {/* Features */}
          <div style={{
            backgroundColor: colors.surface,
            padding: "80px 48px",
          }}>
            <h2 style={{
              fontFamily: fontFamily(fonts.heading),
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              textAlign: "center",
              marginBottom: 48,
              color: colors.foreground,
            }}>
              {features.heading}
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
              maxWidth: 1280,
              margin: "0 auto",
            }}>
              {features.items.slice(0, 3).map((item, i) => (
                <div key={i}>
                  <h3 style={{
                    fontFamily: fontFamily(fonts.heading),
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: 12,
                    color: colors.foreground,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ color: colors.muted, lineHeight: 1.7, fontSize: "1rem" }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            backgroundColor: colors.foreground,
            color: colors.base,
            padding: "64px 48px 40px",
          }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ fontFamily: fontFamily(fonts.heading), fontWeight: 700, fontSize: "1.25rem", marginBottom: 8 }}>
                {design.theme_name}
              </div>
              <p style={{ fontSize: "0.875rem", opacity: 0.5, marginBottom: 40 }}>
                {footer.tagline}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 40 }}>
                {footer.columns.slice(0, 3).map((col, i) => (
                  <div key={i}>
                    <h4 style={{ fontFamily: fontFamily(fonts.heading), fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}>
                      {col.heading}
                    </h4>
                    <p style={{ fontSize: "0.875rem", opacity: 0.6, lineHeight: 1.6 }}>
                      {col.text}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 24, fontSize: "0.875rem", opacity: 0.4 }}>
                {footer.copyright}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color palette display */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-xs text-text-muted">Palette</span>
        <div className="flex gap-2">
          {Object.entries(colors).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full border border-border-subtle"
                style={{ backgroundColor: color }}
                title={name}
              />
              <span className="text-xs text-text-muted hidden sm:inline">{name.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom action */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onDownload}
          className="group px-10 py-3.5 text-base text-white bg-accent hover:bg-accent-hover rounded-xl transition-all font-medium cursor-pointer shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          Download {filename}
          <span className="inline-block ml-2 transition-transform group-hover:translate-y-0.5">&darr;</span>
        </button>
        <p className="mt-3 text-xs text-text-muted">
          Install via WordPress &rarr; Appearance &rarr; Themes &rarr; Upload
        </p>
      </div>
    </div>
  );
}
