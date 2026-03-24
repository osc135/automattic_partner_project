import { useState } from "react";

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
  cta?: {
    heading: string;
    subheading: string;
    button_text: string;
  };
  pull_quote?: {
    quote: string;
    attribution: string;
  };
  stats?: {
    items: { number: string; label: string }[];
  };
  testimonial?: {
    quote: string;
    author: string;
    context: string;
  };
  bio?: {
    name: string;
    location: string;
    statement: string;
  };
  about_page?: {
    heading: string;
    paragraphs: string[];
  };
  sample_post?: {
    title: string;
    date: string;
    excerpt: string;
    paragraphs: string[];
  };
  four_oh_four?: {
    heading: string;
    message: string;
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

function ff(name: string): string {
  return `'${name}', system-ui, sans-serif`;
}

type PageTab = "home" | "about" | "post" | "404";

const TABS: { key: PageTab; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "post", label: "Blog Post" },
  { key: "404", label: "404" },
];

export type { DesignSpec };

export default function ThemePreview({ design, filename, onDownload, onReset }: ThemePreviewProps) {
  const { colors, fonts, footer } = design;
  const [activeTab, setActiveTab] = useState<PageTab>("home");

  const fontUrls = new Set<string>();
  if (FONT_URLS[fonts.heading]) fontUrls.add(FONT_URLS[fonts.heading]);
  if (FONT_URLS[fonts.body]) fontUrls.add(FONT_URLS[fonts.body]);

  const headerEl = (
    <div style={{ backgroundColor: colors.foreground, color: colors.base, padding: "16px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ fontFamily: ff(fonts.heading), fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
          {design.theme_name}
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: "0.9rem", opacity: 0.7 }}>
          <span>Home</span>
          <span>About</span>
          <span>Blog</span>
          <span>Contact</span>
        </div>
      </div>
    </div>
  );

  const footerEl = (
    <div style={{ backgroundColor: colors.foreground, color: colors.base, padding: "64px 48px 40px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ fontFamily: ff(fonts.heading), fontWeight: 700, fontSize: "1.25rem", marginBottom: 8 }}>
          {design.theme_name}
        </div>
        <p style={{ fontSize: "0.875rem", opacity: 0.5, marginBottom: 40 }}>{footer.tagline}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 40 }}>
          {footer.columns.slice(0, 3).map((col, i) => (
            <div key={i}>
              <h4 style={{ fontFamily: ff(fonts.heading), fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}>{col.heading}</h4>
              <p style={{ fontSize: "0.875rem", opacity: 0.6, lineHeight: 1.6 }}>{col.text}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, fontSize: "0.875rem", opacity: 0.4 }}>
          {footer.copyright}
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activeTab) {
      case "home": {
        const arch = design.archetype || "B";
        const midSections: Record<string, string[]> = {
          A: ["pull_quote", "features"],
          B: ["stats", "features"],
          C: ["bio", "features"],
          D: ["features", "testimonial"],
          E: ["stats", "features"],
        };
        const sections = midSections[arch] || ["features"];
        const cta = design.cta || { heading: "Take the next step", subheading: "We're here to help.", button_text: design.hero.button_text };

        const renderSection = (key: string) => {
          switch (key) {
            case "features":
              return (
                <div key="features" style={{ background: `linear-gradient(180deg, ${colors.surface} 0%, ${colors.base} 100%)`, padding: "80px 48px" }}>
                  <h2 style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em", textAlign: "center", marginBottom: 48, color: colors.foreground }}>
                    {design.features.heading}
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1280, margin: "0 auto" }}>
                    {design.features.items.slice(0, 3).map((item, i) => (
                      <div key={i} style={{ backgroundColor: colors.base, borderRadius: 12, padding: 32, border: `1px solid ${colors.surface}` }}>
                        <h3 style={{ fontFamily: ff(fonts.heading), fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.3, marginBottom: 12, color: colors.foreground }}>{item.title}</h3>
                        <p style={{ color: colors.muted, lineHeight: 1.7, fontSize: "1rem" }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            case "stats": {
              const stats = design.stats?.items || [];
              return (
                <div key="stats" style={{ backgroundColor: colors.foreground, color: colors.base, padding: "64px 48px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: 32, maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
                    {stats.slice(0, 4).map((s, i) => (
                      <div key={i}>
                        <div style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1, marginBottom: 8, color: colors.accent }}>{s.number}</div>
                        <div style={{ fontSize: "0.875rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            case "pull_quote": {
              const pq = design.pull_quote;
              if (!pq?.quote) return null;
              return (
                <div key="pull_quote" style={{ backgroundColor: colors.surface, padding: "80px 48px", textAlign: "center" }}>
                  <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <p style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.5, color: colors.foreground }}>
                      &ldquo;{pq.quote}&rdquo;
                    </p>
                    {pq.attribution && (
                      <p style={{ marginTop: 16, fontSize: "0.875rem", color: colors.muted }}>— {pq.attribution}</p>
                    )}
                  </div>
                </div>
              );
            }
            case "testimonial": {
              const t = design.testimonial;
              if (!t?.quote) return null;
              return (
                <div key="testimonial" style={{ backgroundColor: colors.surface, padding: "80px 48px", textAlign: "center" }}>
                  <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <p style={{ fontFamily: ff(fonts.body), fontSize: "1.35rem", fontStyle: "italic", lineHeight: 1.6, color: colors.foreground, marginBottom: 20 }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p style={{ fontSize: "0.95rem", color: colors.accent, fontWeight: 600 }}>
                      {t.author}
                      {t.context && <span style={{ color: colors.muted, fontWeight: 400 }}> · {t.context}</span>}
                    </p>
                  </div>
                </div>
              );
            }
            case "bio": {
              const b = design.bio;
              if (!b?.name) return null;
              return (
                <div key="bio" style={{ backgroundColor: colors.base, padding: "80px 48px", textAlign: "center" }}>
                  <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <h2 style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8, color: colors.foreground }}>{b.name}</h2>
                    <p style={{ fontSize: "0.875rem", color: colors.accent, marginBottom: 24, letterSpacing: "0.05em", textTransform: "uppercase" }}>{b.location}</p>
                    <p style={{ fontFamily: ff(fonts.body), fontSize: "1.25rem", lineHeight: 1.7, color: colors.muted }}>{b.statement}</p>
                  </div>
                </div>
              );
            }
            default:
              return null;
          }
        };

        return (
          <>
            {/* Hero */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.foreground} 100%)`,
              color: colors.accent_foreground,
              padding: "120px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
              <h1 style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20, maxWidth: 800, marginLeft: "auto", marginRight: "auto", position: "relative" }}>
                {design.hero.heading}
              </h1>
              <p style={{ fontSize: "1.25rem", lineHeight: 1.6, opacity: 0.85, maxWidth: 600, margin: "0 auto 40px", position: "relative" }}>
                {design.hero.subheading}
              </p>
              <button style={{ backgroundColor: colors.base, color: colors.foreground, padding: "16px 36px", borderRadius: 8, border: "none", fontFamily: ff(fonts.body), fontSize: "1rem", fontWeight: 600, cursor: "pointer", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                {design.hero.button_text}
              </button>
            </div>
            {/* Archetype-specific sections */}
            {sections.map(renderSection)}
            {/* CTA */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.foreground} 0%, ${colors.accent} 100%)`,
              color: colors.accent_foreground,
              padding: "80px 48px",
              textAlign: "center",
            }}>
              <h2 style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em", marginBottom: 16 }}>
                {cta.heading}
              </h2>
              <p style={{ fontSize: "1.125rem", opacity: 0.8, marginBottom: 32, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
                {cta.subheading}
              </p>
              <button style={{ backgroundColor: colors.base, color: colors.foreground, padding: "16px 36px", borderRadius: 8, border: "none", fontFamily: ff(fonts.body), fontSize: "1rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                {cta.button_text}
              </button>
            </div>
          </>
        );
      }

      case "about": {
        const about = design.about_page || { heading: "About", paragraphs: ["This is the about page."] };
        return (
          <div style={{ backgroundColor: colors.base, padding: "80px 48px" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <h1 style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 32, color: colors.foreground }}>
                {about.heading}
              </h1>
              {about.paragraphs.map((p, i) => (
                <p key={i} style={{ fontFamily: ff(fonts.body), fontSize: "1.125rem", lineHeight: 1.8, color: colors.muted, marginBottom: 24 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        );
      }

      case "post": {
        const post = design.sample_post || { title: "Sample Post", date: "March 15, 2024", excerpt: "", paragraphs: ["This is a sample post."] };
        return (
          <div style={{ backgroundColor: colors.base, padding: "80px 48px" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              <p style={{ fontFamily: ff(fonts.body), fontSize: "0.875rem", color: colors.muted, marginBottom: 16 }}>
                {post.date}
              </p>
              <h1 style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16, color: colors.foreground }}>
                {post.title}
              </h1>
              {post.excerpt && (
                <p style={{ fontFamily: ff(fonts.body), fontSize: "1.25rem", lineHeight: 1.6, color: colors.accent, marginBottom: 32, fontStyle: "italic" }}>
                  {post.excerpt}
                </p>
              )}
              {/* Fake featured image placeholder */}
              <div style={{ backgroundColor: colors.surface, borderRadius: 12, height: 300, marginBottom: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: colors.muted, fontSize: "0.875rem" }}>Featured Image</span>
              </div>
              {post.paragraphs.map((p, i) => (
                <p key={i} style={{ fontFamily: ff(fonts.body), fontSize: "1.125rem", lineHeight: 1.8, color: colors.muted, marginBottom: 24 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        );
      }

      case "404": {
        const fourOhFour = design.four_oh_four || { heading: "Page not found", message: "The page you're looking for doesn't exist." };
        return (
          <div style={{ backgroundColor: colors.base, padding: "120px 48px", textAlign: "center" }}>
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              <p style={{ fontFamily: ff(fonts.heading), fontSize: "8rem", fontWeight: 800, lineHeight: 1, color: colors.accent, opacity: 0.15, marginBottom: -20 }}>
                404
              </p>
              <h1 style={{ fontFamily: ff(fonts.heading), fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16, color: colors.foreground }}>
                {fourOhFour.heading}
              </h1>
              <p style={{ fontFamily: ff(fonts.body), fontSize: "1.125rem", lineHeight: 1.7, color: colors.muted, marginBottom: 32 }}>
                {fourOhFour.message}
              </p>
              <button style={{ backgroundColor: colors.accent, color: colors.accent_foreground, padding: "14px 32px", borderRadius: 8, border: "none", fontFamily: ff(fonts.body), fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
                Go back home
              </button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="animate-fade-in">
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
          <button type="button" onClick={onReset} className="px-5 py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
            Start over
          </button>
          <button type="button" onClick={onDownload} className="px-6 py-2.5 text-sm text-white bg-accent hover:bg-accent-hover rounded-lg transition-all font-medium cursor-pointer shadow-lg shadow-accent/20">
            Download {filename}
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="rounded-xl overflow-hidden border border-border-subtle shadow-2xl">
        {/* Browser chrome with tabs */}
        <div className="bg-surface-raised border-b border-border-subtle">
          <div className="px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 text-center text-xs text-text-muted">
              {design.theme_name}
            </div>
          </div>
          {/* Page tabs */}
          <div className="flex px-4 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-border-subtle/50 text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme preview content */}
        <div style={{ fontFamily: ff(fonts.body), color: colors.foreground }}>
          {headerEl}
          {renderPage()}
          {footerEl}
        </div>
      </div>

      {/* Color palette */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-xs text-text-muted">Palette</span>
        <div className="flex gap-2">
          {Object.entries(colors).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full border border-border-subtle" style={{ backgroundColor: color }} title={name} />
              <span className="text-xs text-text-muted hidden sm:inline">{name.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom download */}
      <div className="mt-8 text-center">
        <button type="button" onClick={onDownload} className="group px-10 py-3.5 text-base text-white bg-accent hover:bg-accent-hover rounded-xl transition-all font-medium cursor-pointer shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98]">
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
