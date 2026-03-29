# What I'd Do Next

## With Another Week

**Iteration flow.** The preview already shows the generated theme in-app. The next step is letting the user say "make the hero bolder" or "swap to a warmer palette" without starting from scratch. This means persisting the current design spec in session state and sending it back to the AI as context for a follow-up prompt. The two-stage architecture makes this feasible: the AI only needs to return a modified JSON spec, and the templates re-assemble.

**Expand the template library.** The current system has one layout skeleton per section type. Adding 2–3 variants per section (e.g., a split hero vs. centered hero, a grid features layout vs. alternating rows) and letting the AI select among them would significantly increase visual variety without sacrificing reliability.

**Real integration test.** The current test suite mocks the AI provider. Adding a slow-but-real test that calls the actual API, validates the design spec, builds the theme, and confirms it passes WordPress's theme check plugin would catch regressions that mocks can't.

**Query Loop patterns.** The spec calls out Query Loop as a "raises the bar" block. Supporting it means generating patterns that use `<!-- wp:query -->` with proper `queryId`, `query` attributes, and inner blocks (`post-template`, `post-title`, `post-excerpt`, `pagination`). The template approach scales here — a few well-tested Query Loop templates covering blog grids, recent posts, and category archives would cover most use cases.

## For Production Readiness

**Block validation pipeline.** The current validator checks structure (required files, no Custom HTML blocks, valid JSON). A production version needs to parse every block comment and validate it against WordPress's block grammar — correct attributes, proper nesting, matching open/close tags. The `@wordpress/block-serialization-default-parser` npm package could be integrated as a Node sidecar or replaced with a Python port.

**Rate limiting and authentication.** The `/api/generate` endpoint is expensive (external AI calls, CPU for ZIP assembly). Production needs per-IP rate limiting at minimum, and ideally user accounts with generation quotas. A simple token-bucket middleware on FastAPI would handle the rate limiting; auth could start as API keys and graduate to OAuth.

**Error recovery and retries.** Currently, if the AI returns invalid JSON, the user gets an error and has to retry manually. A production version should automatically retry with a tweaked prompt (e.g., appending "Your previous response was not valid JSON. Return ONLY the JSON object.") before surfacing the error. Exponential backoff for rate limits.

**Font loading robustness.** The constrained font set works but is brittle — if Google Fonts changes a slug or a font is temporarily unavailable, themes break silently. Self-hosting the font files inside the theme ZIP (as WOFF2) would eliminate this dependency entirely.

**Content security.** The current sanitization strips HTML tags, but a production version should also scan AI-generated copy for inappropriate content before packaging it into a theme. A lightweight content filter on the design spec output would catch edge cases where the AI generates something off-brand.

## Scaling to Complex Dynamic Features

**Multi-page themes.** Currently the generator produces index, single, page, and 404 templates. Expanding to archive, search, author, and custom page templates means more template files but the same pattern: design tokens in, valid markup out. The AI prompt would need to generate additional copy (archive descriptions, search placeholder text) but the architecture doesn't change.

**Style variations.** WordPress 6.2+ supports `theme.json` style variations — alternate color schemes and typography bundled with the theme. Generating 2–3 variations per theme (light/dark, alternate accent) would be a high-impact feature. The AI already produces a color system; asking it for two additional harmonious palettes is a small prompt addition, and each variation is just an additional JSON file in the `styles/` directory.

**Plugin-aware generation.** WooCommerce, Jetpack, and other popular plugins register their own blocks. A future version could accept "this site uses WooCommerce" as input and include product grid patterns, cart templates, and checkout styling in the generated theme. This requires expanding the template library per-plugin but doesn't change the core architecture.
