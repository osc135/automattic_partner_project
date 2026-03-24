"""Assembles WordPress block theme files from a design specification.

The AI returns design tokens and content. This module turns them into
valid WordPress block markup using hardcoded templates that are known
to work. This guarantees zero "Block contains unexpected content" errors.
"""

import json
from typing import Any, Dict


def build_theme_files(design: Dict[str, Any], theme_slug: str) -> Dict[str, str]:
    """Build all theme files from a design specification."""
    return {
        "style.css": _build_style_css(design, theme_slug),
        "theme.json": _build_theme_json(design),
        "functions.php": _build_functions_php(theme_slug),
        "templates/index.html": _build_index_html(theme_slug),
        "templates/single.html": _build_single_html(),
        "templates/page.html": _build_page_html(),
        "parts/header.html": _build_header_html(),
        "parts/footer.html": _build_footer_html(design),
        "patterns/hero.php": _build_hero_pattern(design, theme_slug),
        "patterns/features.php": _build_features_pattern(design, theme_slug),
    }


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
    colors = design.get("colors", {})
    fonts = design.get("fonts", {})

    theme = {
        "$schema": "https://schemas.wp.org/wp/6.5/theme.json",
        "version": 3,
        "settings": {
            "appearanceTools": True,
            "color": {
                "palette": [
                    {"slug": "background", "color": colors.get("background", "#ffffff"), "name": "Background"},
                    {"slug": "foreground", "color": colors.get("foreground", "#1a1a1a"), "name": "Foreground"},
                    {"slug": "primary", "color": colors.get("primary", "#2563eb"), "name": "Primary"},
                    {"slug": "secondary", "color": colors.get("secondary", "#4f46e5"), "name": "Secondary"},
                    {"slug": "accent", "color": colors.get("accent", "#0891b2"), "name": "Accent"},
                    {"slug": "muted", "color": colors.get("muted", "#f3f4f6"), "name": "Muted"},
                ]
            },
            "typography": {
                "fontFamilies": [
                    {
                        "fontFamily": fonts.get("heading", "Georgia, 'Times New Roman', serif"),
                        "slug": "heading",
                        "name": "Heading",
                    },
                    {
                        "fontFamily": fonts.get("body", "system-ui, -apple-system, sans-serif"),
                        "slug": "body",
                        "name": "Body",
                    },
                ],
                "fontSizes": [
                    {"slug": "small", "size": "0.875rem", "name": "Small"},
                    {"slug": "medium", "size": "1rem", "name": "Medium"},
                    {"slug": "large", "size": "1.25rem", "name": "Large"},
                    {"slug": "x-large", "size": "1.75rem", "name": "Extra Large"},
                    {"slug": "xx-large", "size": "2.5rem", "name": "2X Large"},
                    {"slug": "xxx-large", "size": "3.5rem", "name": "3X Large"},
                ],
            },
            "layout": {
                "contentSize": "800px",
                "wideSize": "1200px",
            },
            "spacing": {
                "units": ["px", "em", "rem", "vh", "vw", "%"],
            },
        },
        "styles": {
            "color": {
                "background": "var(--wp--preset--color--background)",
                "text": "var(--wp--preset--color--foreground)",
            },
            "typography": {
                "fontFamily": "var(--wp--preset--font-family--body)",
                "fontSize": "var(--wp--preset--font-size--medium)",
                "lineHeight": "1.7",
            },
            "elements": {
                "heading": {
                    "typography": {
                        "fontFamily": "var(--wp--preset--font-family--heading)",
                        "fontWeight": "700",
                        "lineHeight": "1.2",
                    },
                    "color": {
                        "text": "var(--wp--preset--color--foreground)",
                    },
                },
                "link": {
                    "color": {
                        "text": "var(--wp--preset--color--accent)",
                    },
                    ":hover": {
                        "color": {
                            "text": "var(--wp--preset--color--primary)",
                        },
                    },
                },
                "button": {
                    "color": {
                        "background": "var(--wp--preset--color--primary)",
                        "text": "var(--wp--preset--color--background)",
                    },
                    "typography": {
                        "fontFamily": "var(--wp--preset--font-family--body)",
                        "fontSize": "var(--wp--preset--font-size--medium)",
                    },
                },
            },
            "blocks": {
                "core/navigation": {
                    "typography": {
                        "fontFamily": "var(--wp--preset--font-family--body)",
                        "fontSize": "var(--wp--preset--font-size--medium)",
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


def _build_functions_php(theme_slug: str) -> str:
    func_prefix = theme_slug.replace("-", "_")
    return f"""<?php
function {func_prefix}_setup() {{
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
}}
add_action('after_setup_theme', '{func_prefix}_setup');

function {func_prefix}_styles() {{
    wp_enqueue_style('{theme_slug}-style', get_stylesheet_uri());
}}
add_action('wp_enqueue_scripts', '{func_prefix}_styles');
"""


def _build_index_html(theme_slug: str) -> str:
    return """<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:pattern {"slug":\"""" + theme_slug + """/hero"} /-->

<!-- wp:pattern {"slug":\"""" + theme_slug + """/features"} /-->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->"""


def _build_single_html() -> str:
    return """<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:post-title {"level":1} /-->

<!-- wp:post-featured-image /-->

<!-- wp:spacer {"height":"20px"} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:post-content /-->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->"""


def _build_page_html() -> str:
    return """<!-- wp:template-part {"slug":"header","area":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:post-title {"level":1} /-->

<!-- wp:post-content /-->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer"} /-->"""


def _build_header_html() -> str:
    return """<!-- wp:group {"backgroundColor":"muted","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-muted-background-color has-background"><!-- wp:spacer {"height":"16px"} -->
<div style="height:16px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"}} -->
<div class="wp-block-group"><!-- wp:site-title /-->

<!-- wp:navigation /--></div>
<!-- /wp:group -->

<!-- wp:spacer {"height":"16px"} -->
<div style="height:16px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->"""


def _build_footer_html(design: Dict[str, Any]) -> str:
    footer = design.get("footer", {})
    columns = footer.get("columns", [
        {"heading": "About", "text": "A short description of this site."},
        {"heading": "Links", "text": "Home, About, Contact"},
        {"heading": "Connect", "text": "Get in touch with us."},
    ])
    copyright_text = footer.get("copyright", "All rights reserved.")

    cols_markup = ""
    for col in columns[:3]:
        heading = _escape(col.get("heading", ""))
        text = _escape(col.get("text", ""))
        cols_markup += f"""<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {{"level":3}} -->
<h3 class="wp-block-heading">{heading}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>{text}</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

"""

    return f"""<!-- wp:group {{"backgroundColor":"foreground","textColor":"background","layout":{{"type":"constrained"}}}} -->
<div class="wp-block-group has-background-color has-foreground-background-color has-text-color has-background"><!-- wp:spacer {{"height":"60px"}} -->
<div style="height:60px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns -->
<div class="wp-block-columns">{cols_markup}</div>
<!-- /wp:columns -->

<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->

<!-- wp:paragraph {{"align":"center","fontSize":"small"}} -->
<p class="has-text-align-center has-small-font-size">{_escape(copyright_text)}</p>
<!-- /wp:paragraph -->

<!-- wp:spacer {{"height":"40px"}} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->"""


def _build_hero_pattern(design: Dict[str, Any], theme_slug: str) -> str:
    hero = design.get("hero", {})
    heading = _escape(hero.get("heading", "Welcome"))
    subheading = _escape(hero.get("subheading", ""))

    return f"""<?php
/**
 * Title: Hero
 * Slug: {theme_slug}/hero
 * Categories: featured
 */
?>
<!-- wp:group {{"backgroundColor":"primary","textColor":"background","layout":{{"type":"constrained"}}}} -->
<div class="wp-block-group has-background-color has-primary-background-color has-text-color has-background"><!-- wp:spacer {{"height":"80px"}} -->
<div style="height:80px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:heading {{"level":1,"textAlign":"center"}} -->
<h1 class="wp-block-heading has-text-align-center">{heading}</h1>
<!-- /wp:heading -->

<!-- wp:spacer {{"height":"16px"}} -->
<div style="height:16px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:paragraph {{"align":"center","fontSize":"large"}} -->
<p class="has-text-align-center has-large-font-size">{subheading}</p>
<!-- /wp:paragraph -->

<!-- wp:spacer {{"height":"80px"}} -->
<div style="height:80px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->"""


def _build_features_pattern(design: Dict[str, Any], theme_slug: str) -> str:
    features = design.get("features", {})
    section_heading = _escape(features.get("heading", "Features"))
    items = features.get("items", [])

    cols_markup = ""
    for item in items[:3]:
        title = _escape(item.get("title", ""))
        desc = _escape(item.get("description", ""))
        cols_markup += f"""<!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {{"level":3}} -->
<h3 class="wp-block-heading">{title}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>{desc}</p>
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
<!-- wp:group {{"backgroundColor":"muted","layout":{{"type":"constrained"}}}} -->
<div class="wp-block-group has-muted-background-color has-background"><!-- wp:spacer {{"height":"60px"}} -->
<div style="height:60px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:heading {{"textAlign":"center"}} -->
<h2 class="wp-block-heading has-text-align-center">{section_heading}</h2>
<!-- /wp:heading -->

<!-- wp:spacer {{"height":"30px"}} -->
<div style="height:30px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns -->
<div class="wp-block-columns">{cols_markup}</div>
<!-- /wp:columns -->

<!-- wp:spacer {{"height":"60px"}} -->
<div style="height:60px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div>
<!-- /wp:group -->"""


def _escape(text: str) -> str:
    """Escape HTML special characters in user/AI-provided text."""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
