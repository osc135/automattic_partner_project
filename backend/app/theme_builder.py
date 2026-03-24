"""Assembles WordPress block theme files from a design specification.

The AI returns design tokens and content. This module turns them into
valid WordPress block markup using hardcoded templates that are known
to work. This guarantees zero "Block contains unexpected content" errors.
"""

import json
from typing import Any, Dict

FONT_MAP = {
    "Open Sans": {"slug": "Open+Sans:wght@400;600;700", "family": "'Open Sans', system-ui, sans-serif"},
    "Montserrat": {"slug": "Montserrat:wght@400;600;700;800", "family": "'Montserrat', system-ui, sans-serif"},
    "DM Sans": {"slug": "DM+Sans:wght@400;500;700", "family": "'DM Sans', system-ui, sans-serif"},
    "Karla": {"slug": "Karla:wght@400;600;700", "family": "'Karla', system-ui, sans-serif"},
    "Schibsted Grotesk": {"slug": "Schibsted+Grotesk:wght@400;600;700;800", "family": "'Schibsted Grotesk', system-ui, sans-serif"},
}

DEFAULT_FONT = {"slug": "DM+Sans:wght@400;500;700", "family": "'DM Sans', system-ui, sans-serif"}


def _resolve_font(name: str) -> Dict[str, str]:
    return FONT_MAP.get(name, DEFAULT_FONT)


def build_theme_files(design: Dict[str, Any], theme_slug: str) -> Dict[str, str]:
    return {
        "style.css": _build_style_css(design, theme_slug),
        "theme.json": _build_theme_json(design),
        "functions.php": _build_functions_php(theme_slug, design),
        "templates/index.html": _build_index_html(theme_slug),
        "templates/single.html": _build_single_html(),
        "templates/page.html": _build_page_html(),
        "parts/header.html": _build_header_html(),
        "parts/footer.html": _build_footer_html(design),
        "patterns/hero.php": _build_hero_pattern(design, theme_slug),
        "patterns/features.php": _build_features_pattern(design, theme_slug),
    }


def _c(design: Dict[str, Any], key: str, fallback: str = "#888888") -> str:
    """Get a color from the design spec with fallback."""
    return design.get("colors", {}).get(key, fallback)


def _build_style_css(design: Dict[str, Any], theme_slug: str) -> str:
    name = design.get("theme_name", "Generated Theme")
    desc = design.get("description", "An AI-generated WordPress block theme")
    return f"""/*
Theme Name: {name}
Theme URI: https://example.com/{theme_slug}
Description: {desc}
Version: 1.0.0
Requires at least: 6.2
Tested up to: 6.5
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: {theme_slug}
*/"""


def _build_theme_json(design: Dict[str, Any]) -> str:
    fonts = design.get("fonts", {})
    heading_font = _resolve_font(fonts.get("heading", "DM Sans"))
    body_font = _resolve_font(fonts.get("body", "DM Sans"))

    theme = {
        "$schema": "https://schemas.wp.org/wp/6.5/theme.json",
        "version": 3,
        "settings": {
            "appearanceTools": True,
            "color": {
                "palette": [
                    {"slug": "base", "color": _c(design, "base", "#ffffff"), "name": "Base"},
                    {"slug": "surface", "color": _c(design, "surface", "#f8f8fa"), "name": "Surface"},
                    {"slug": "foreground", "color": _c(design, "foreground", "#1a1a1a"), "name": "Foreground"},
                    {"slug": "muted", "color": _c(design, "muted", "#6b7280"), "name": "Muted"},
                    {"slug": "accent", "color": _c(design, "accent", "#2563eb"), "name": "Accent"},
                    {"slug": "accent-foreground", "color": _c(design, "accent_foreground", "#ffffff"), "name": "Accent Foreground"},
                ]
            },
            "typography": {
                "fontFamilies": [
                    {"fontFamily": heading_font["family"], "slug": "heading", "name": "Heading"},
                    {"fontFamily": body_font["family"], "slug": "body", "name": "Body"},
                ],
                "fontSizes": [
                    {"slug": "small", "size": "0.875rem", "name": "Small"},
                    {"slug": "base", "size": "1.0625rem", "name": "Base"},
                    {"slug": "medium", "size": "1.25rem", "name": "Medium"},
                    {"slug": "large", "size": "2rem", "name": "Large"},
                    {"slug": "x-large", "size": "3rem", "name": "X-Large"},
                    {"slug": "hero", "size": "clamp(2.5rem, 6vw, 5rem)", "name": "Hero"},
                ],
            },
            "spacing": {
                "spacingSizes": [
                    {"name": "XSmall", "slug": "20", "size": "0.5rem"},
                    {"name": "Small", "slug": "30", "size": "1rem"},
                    {"name": "Medium", "slug": "40", "size": "2rem"},
                    {"name": "Large", "slug": "50", "size": "4rem"},
                    {"name": "XLarge", "slug": "60", "size": "7rem"},
                    {"name": "2XLarge", "slug": "70", "size": "10rem"},
                ],
                "padding": True,
                "margin": True,
                "blockGap": True,
                "units": ["px", "em", "rem", "vh", "vw", "%"],
            },
            "layout": {
                "contentSize": "960px",
                "wideSize": "1280px",
            },
        },
        "styles": {
            "color": {
                "background": "var(--wp--preset--color--base)",
                "text": "var(--wp--preset--color--foreground)",
            },
            "typography": {
                "fontFamily": "var(--wp--preset--font-family--body)",
                "fontSize": "var(--wp--preset--font-size--base)",
                "lineHeight": "1.75",
            },
            "spacing": {
                "blockGap": "0px",
            },
            "elements": {
                "heading": {
                    "typography": {
                        "fontFamily": "var(--wp--preset--font-family--heading)",
                        "fontWeight": "700",
                    },
                    "color": {
                        "text": "var(--wp--preset--color--foreground)",
                    },
                },
                "h1": {
                    "typography": {
                        "fontSize": "var(--wp--preset--font-size--hero)",
                        "lineHeight": "1.1",
                        "letterSpacing": "-0.03em",
                    },
                },
                "h2": {
                    "typography": {
                        "fontSize": "var(--wp--preset--font-size--x-large)",
                        "lineHeight": "1.2",
                        "letterSpacing": "-0.01em",
                    },
                },
                "h3": {
                    "typography": {
                        "fontSize": "var(--wp--preset--font-size--large)",
                        "lineHeight": "1.3",
                    },
                },
                "link": {
                    "color": {"text": "var(--wp--preset--color--accent)"},
                    ":hover": {"color": {"text": "var(--wp--preset--color--foreground)"}},
                },
                "button": {
                    "color": {
                        "background": "var(--wp--preset--color--accent)",
                        "text": "var(--wp--preset--color--accent-foreground)",
                    },
                    "typography": {
                        "fontFamily": "var(--wp--preset--font-family--body)",
                        "fontSize": "var(--wp--preset--font-size--base)",
                        "fontWeight": "600",
                    },
                },
            },
            "blocks": {
                "core/navigation": {
                    "typography": {
                        "fontFamily": "var(--wp--preset--font-family--body)",
                        "fontSize": "var(--wp--preset--font-size--base)",
                    },
                },
                "core/site-title": {
                    "typography": {
                        "fontFamily": "var(--wp--preset--font-family--heading)",
                        "fontSize": "var(--wp--preset--font-size--medium)",
                        "fontWeight": "700",
                        "letterSpacing": "-0.02em",
                    },
                },
            },
        },
        "templateParts": [
            {"name": "header", "title": "Header", "area": "header"},
            {"name": "footer", "title": "Footer", "area": "footer"},
        ],
    }

    return json.dumps(theme, indent=2)


def _build_functions_php(theme_slug: str, design: Dict[str, Any] = None) -> str:
    func_prefix = theme_slug.replace("-", "_")
    fonts = (design or {}).get("fonts", {})
    heading_font = _resolve_font(fonts.get("heading", "DM Sans"))
    body_font = _resolve_font(fonts.get("body", "DM Sans"))

    font_slugs = list(dict.fromkeys([heading_font["slug"], body_font["slug"]]))
    families_param = "&family=".join(font_slugs)
    google_url = f"https://fonts.googleapis.com/css2?family={families_param}&display=swap"

    return f"""<?php
function {func_prefix}_setup() {{
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
}}
add_action('after_setup_theme', '{func_prefix}_setup');

function {func_prefix}_styles() {{
    wp_enqueue_style('{theme_slug}-fonts', '{google_url}', array(), null);
    wp_enqueue_style('{theme_slug}-style', get_stylesheet_uri(), array('{theme_slug}-fonts'));
}}
add_action('wp_enqueue_scripts', '{func_prefix}_styles');
"""


def _build_index_html(theme_slug: str) -> str:
    return (
        '<!-- wp:template-part {"slug":"header","area":"header"} /-->\n\n'
        '<!-- wp:pattern {"slug":"' + theme_slug + '/hero"} /-->\n\n'
        '<!-- wp:pattern {"slug":"' + theme_slug + '/features"} /-->\n\n'
        '<!-- wp:template-part {"slug":"footer","area":"footer"} /-->'
    )


def _build_single_html() -> str:
    return """<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:post-title {"level":1} /-->

<!-- wp:spacer {"height":"24px"} -->
<div style="height:24px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:post-featured-image /-->

<!-- wp:spacer {"height":"32px"} -->
<div style="height:32px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:post-content /--></div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->"""


def _build_page_html() -> str:
    return """<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)"><!-- wp:post-title {"level":1} /-->

<!-- wp:spacer {"height":"32px"} -->
<div style="height:32px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:post-content /--></div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->"""


def _build_header_html() -> str:
    return """<!-- wp:group {"backgroundColor":"foreground","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group has-base-color has-foreground-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)"><!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:site-title /-->

<!-- wp:navigation /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->"""


def _build_footer_html(design: Dict[str, Any]) -> str:
    footer = design.get("footer", {})
    tagline = _escape(footer.get("tagline", ""))
    columns = footer.get("columns", [
        {"heading": "About", "text": "A short description."},
        {"heading": "Links", "text": "Home, About, Contact"},
        {"heading": "Connect", "text": "Get in touch."},
    ])
    copyright_text = footer.get("copyright", "All rights reserved.")

    cols_markup = ""
    for col in columns[:3]:
        heading = _escape(col.get("heading", ""))
        text = _escape(col.get("text", ""))
        cols_markup += f"""<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {{"level":3,"fontSize":"medium"}} -->
<h3 class="wp-block-heading has-medium-font-size">{heading}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {{"fontSize":"small"}} -->
<p class="has-small-font-size">{text}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

"""

    return f"""<!-- wp:group {{"backgroundColor":"foreground","textColor":"base","style":{{"spacing":{{"padding":{{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|50","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}}}}},"layout":{{"type":"constrained","contentSize":"1280px"}}}} -->
<div class="wp-block-group has-base-color has-foreground-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40)"><!-- wp:site-title /-->

<!-- wp:paragraph {{"fontSize":"small","textColor":"muted"}} -->
<p class="has-small-font-size has-muted-color has-text-color">{tagline}</p>
<!-- /wp:paragraph -->

<!-- wp:spacer {{"height":"40px"}} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns -->
<div class="wp-block-columns">{cols_markup}</div>
<!-- /wp:columns -->

<!-- wp:spacer {{"height":"40px"}} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:spacer {{"height":"24px"}} -->
<div style="height:24px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:paragraph {{"fontSize":"small","textColor":"muted"}} -->
<p class="has-small-font-size has-muted-color has-text-color">{_escape(copyright_text)}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->"""


def _build_hero_pattern(design: Dict[str, Any], theme_slug: str) -> str:
    hero = design.get("hero", {})
    heading = _escape(hero.get("heading", "Welcome"))
    subheading = _escape(hero.get("subheading", ""))
    button_text = _escape(hero.get("button_text", "Get started"))

    return f"""<?php
/**
 * Title: Hero
 * Slug: {theme_slug}/hero
 * Categories: featured
 */
?>
<!-- wp:group {{"backgroundColor":"accent","textColor":"accent-foreground","style":{{"spacing":{{"padding":{{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}}}}},"layout":{{"type":"constrained"}}}} -->
<div class="wp-block-group has-accent-foreground-color has-accent-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)"><!-- wp:heading {{"level":1,"textAlign":"center","fontSize":"hero"}} -->
<h1 class="wp-block-heading has-text-align-center has-hero-font-size">{heading}</h1>
<!-- /wp:heading -->

<!-- wp:spacer {{"height":"24px"}} -->
<div style="height:24px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:paragraph {{"align":"center","fontSize":"medium"}} -->
<p class="has-text-align-center has-medium-font-size">{subheading}</p>
<!-- /wp:paragraph -->

<!-- wp:spacer {{"height":"32px"}} -->
<div style="height:32px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:buttons {{"layout":{{"type":"flex","justifyContent":"center"}}}} -->
<div class="wp-block-buttons"><!-- wp:button {{"backgroundColor":"base","textColor":"foreground"}} -->
<div class="wp-block-button"><a class="wp-block-button__link has-foreground-color has-base-background-color has-text-color has-background wp-element-button">{button_text}</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->"""


def _build_features_pattern(design: Dict[str, Any], theme_slug: str) -> str:
    features = design.get("features", {})
    section_heading = _escape(features.get("heading", "Features"))
    items = features.get("items", [])

    cards_markup = ""
    for item in items[:3]:
        title = _escape(item.get("title", ""))
        desc = _escape(item.get("description", ""))
        cards_markup += f"""<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {{"level":3}} -->
<h3 class="wp-block-heading">{title}</h3>
<!-- /wp:heading -->

<!-- wp:spacer {{"height":"12px"}} -->
<div style="height:12px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:paragraph {{"textColor":"muted"}} -->
<p class="has-muted-color has-text-color">{desc}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

"""

    return f"""<?php
/**
 * Title: Features
 * Slug: {theme_slug}/features
 * Categories: featured
 */
?>
<!-- wp:group {{"backgroundColor":"surface","style":{{"spacing":{{"padding":{{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}}}}},"layout":{{"type":"constrained","contentSize":"1280px"}}}} -->
<div class="wp-block-group has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--40)"><!-- wp:heading {{"textAlign":"center"}} -->
<h2 class="wp-block-heading has-text-align-center">{section_heading}</h2>
<!-- /wp:heading -->

<!-- wp:spacer {{"height":"48px"}} -->
<div style="height:48px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns -->
<div class="wp-block-columns">{cards_markup}</div>
<!-- /wp:columns --></div>
<!-- /wp:group -->"""


def _escape(text: str) -> str:
    """Escape HTML special characters in user/AI-provided text."""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
