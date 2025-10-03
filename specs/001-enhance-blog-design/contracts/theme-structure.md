# Contract: Hugo Theme Directory Structure

## Purpose
Define the required directory structure and files for the custom Hugo theme.

## Required Structure

```
themes/ryokosuge-theme/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html           # REQUIRED: Base template
│   │   ├── single.html            # REQUIRED: Single post template
│   │   └── list.html              # REQUIRED: List template
│   ├── partials/
│   │   ├── head/
│   │   │   ├── meta.html          # REQUIRED: Meta tags
│   │   │   ├── styles.html        # REQUIRED: CSS loading
│   │   │   └── dark-mode-script.html  # REQUIRED: FOUC prevention
│   │   ├── header.html            # REQUIRED: Site header
│   │   ├── footer.html            # REQUIRED: Site footer
│   │   ├── navigation.html        # REQUIRED: Main navigation
│   │   ├── content-type-badge.html # REQUIRED: Content type indicator
│   │   └── dark-mode-toggle.html  # REQUIRED: Theme toggle button
│   ├── index.html                 # REQUIRED: Homepage
│   └── 404.html                   # OPTIONAL: Error page
├── assets/
│   ├── css/
│   │   └── main.css               # REQUIRED: Tailwind entry point
│   └── js/
│       └── main.js                # OPTIONAL: Additional JS
├── static/
│   └── icons/                     # OPTIONAL: SVG icons
├── theme.toml                     # REQUIRED: Theme metadata
├── tailwind.config.js             # REQUIRED: Tailwind configuration
├── postcss.config.js              # REQUIRED: PostCSS configuration
└── package.json                   # REQUIRED: npm dependencies
```

## File Contracts

### baseof.html
**Must contain:**
- `<!DOCTYPE html>` declaration
- `<html lang="{{ .Site.Language.Lang }}">` with language attribute
- `<head>` section with partials
- `{{ block "main" . }}{{ end }}` for content injection
- Dark mode script in head (before styles)
- Body with dark mode classes

**Example:**
```html
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
  {{ partial "head/dark-mode-script.html" . }}
  {{ partial "head/meta.html" . }}
  {{ partial "head/styles.html" . }}
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  {{ partial "header.html" . }}
  <main>
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
</body>
</html>
```

### single.html
**Must contain:**
- `{{ define "main" }}` block wrapper
- Content type badge partial
- Article content with `{{ .Content }}`
- Date and metadata display
- Proper semantic HTML (article, h1, etc.)

### list.html
**Must contain:**
- `{{ define "main" }}` block wrapper
- Section title
- Range over `.Pages`
- Content type badge for each item
- Pagination if applicable

### main.css
**Must contain:**
- `@import "tailwindcss";` directive
- Custom `@theme` block with Japanese typography
- Japanese-specific utility classes (`.prose-ja`)
- Dark mode color definitions

### theme.toml
**Must contain:**
- `name = "ryokosuge-theme"`
- `license = "MIT"`
- `min_version = "0.140.0"`
- `description` in Japanese and English

### tailwind.config.js
**Must contain:**
- `content` array with Hugo template paths
- Custom color definitions (primary, accent)
- Japanese font stack in `fontFamily.sans`
- Japanese-optimized line-height values

### postcss.config.js
**Must contain:**
- `@tailwindcss/postcss` plugin
- `autoprefixer` plugin

### package.json
**Must contain:**
- `tailwindcss@next` (v4.x)
- `@tailwindcss/postcss`
- `autoprefixer`
- `postcss`
- `postcss-cli`

## Validation Rules

1. **All REQUIRED files must exist** before theme can be used
2. **baseof.html must include dark-mode-script** before any styles
3. **main.css must be processed** through PostCSS pipeline
4. **Content type badge partial must support** all three content types
5. **Typography must use** Japanese-optimized values (line-height >= 1.85)

## Testing Contract

To verify theme structure:
```bash
# Check required files exist
test -f themes/ryokosuge-theme/layouts/_default/baseof.html
test -f themes/ryokosuge-theme/assets/css/main.css
test -f themes/ryokosuge-theme/tailwind.config.js

# Verify theme can be loaded
hugo server -D --theme=ryokosuge-theme

# Check for FOUC prevention
grep -q "dark-mode-script" themes/ryokosuge-theme/layouts/_default/baseof.html
```
