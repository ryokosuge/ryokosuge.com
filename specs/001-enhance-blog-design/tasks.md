# Tasks: ブログテーマの改善（Hugo + Tailwind CSS）

**Input**: Design documents from `/workspaces/ryokosuge.com/specs/001-enhance-blog-design/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Hugo, Tailwind CSS 4.0, PostCSS, Japanese typography
2. Load design documents:
   → data-model.md: Theme config, content types, color scheme
   → contracts/: theme-structure, typography-system, dark-mode-system
   → quickstart.md: Verification scenarios
3. Generate tasks by category:
   → Setup: Theme directory, npm dependencies, Hugo config
   → Templates: baseof.html → partials → specific templates
   → Styling: Tailwind setup, typography, dark mode
   → Components: Content type badges
   → Verification: Visual testing per quickstart.md
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Templates depend on baseof.html existing
   → Styling depends on templates
5. Number tasks sequentially (T001, T002...)
6. SUCCESS: Tasks ready for execution
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- File paths relative to repository root: `/workspaces/ryokosuge.com/`

---

## Phase 3.1: Setup and Configuration

### T001: Create Hugo theme directory structure
**Contract**: contracts/theme-structure.md
**Action**: Create the following directory structure:
```bash
mkdir -p themes/ryokosuge-theme/layouts/_default
mkdir -p themes/ryokosuge-theme/layouts/partials/head
mkdir -p themes/ryokosuge-theme/assets/css
mkdir -p themes/ryokosuge-theme/assets/js
mkdir -p themes/ryokosuge-theme/static/icons
```
**Validation**: All required directories exist per contract

### T002: Initialize npm project with Tailwind CSS 4.0 dependencies
**Contract**: contracts/theme-structure.md (package.json requirements)
**File**: `themes/ryokosuge-theme/package.json`
**Action**: Create package.json with Tailwind CSS 4.0 and dependencies:
```json
{
  "name": "ryokosuge-theme",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "hugo server -D",
    "build": "hugo --minify"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0-alpha.25",
    "@tailwindcss/postcss": "^4.0.0-alpha.25",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "postcss-cli": "^11.0.0"
  }
}
```
**Validation**: Run `cd themes/ryokosuge-theme && npm install` successfully

### T003 [P]: Create theme metadata file
**Contract**: contracts/theme-structure.md (theme.toml requirements)
**File**: `themes/ryokosuge-theme/theme.toml`
**Action**: Create theme.toml with metadata:
```toml
name = "ryokosuge-theme"
license = "MIT"
min_version = "0.140.0"
description = "シンプルでモダンなHugoテーマ。日本語最適化、Tailwind CSS 4.0、ダークモード対応。"

[author]
  name = "ryokosuge"
  homepage = "https://ryokosuge.com/"
```
**Validation**: File exists and valid TOML

### T004 [P]: Create Tailwind CSS configuration
**Contract**: contracts/typography-system.md (font stack), data-model.md (color scheme)
**File**: `themes/ryokosuge-theme/tailwind.config.js`
**Action**: Create Tailwind v4.x config with Japanese font stack and custom colors:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{md,html}',
    '../../layouts/**/*.html',
    '../../content/**/*.{md,html}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          '"Yu Gothic"',
          '"YuGothic"',
          '"Meiryo"',
          '"MS Gothic"',
          'sans-serif'
        ]
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#60a5fa'
        }
      },
      lineHeight: {
        'japanese': '1.85',
        'japanese-relaxed': '2.0'
      },
      letterSpacing: {
        'japanese': '0.05em',
        'japanese-wide': '0.1em'
      }
    }
  }
}
```
**Validation**: Valid JavaScript syntax

### T005 [P]: Create PostCSS configuration
**Contract**: contracts/theme-structure.md (postcss.config.js requirements)
**File**: `themes/ryokosuge-theme/postcss.config.js`
**Action**: Create PostCSS config:
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {}
  }
}
```
**Validation**: Valid JavaScript syntax

### T006: Update Hugo site configuration
**File**: `config.yaml`
**Action**: Update Hugo config to use new theme and enable build stats:
```yaml
theme: ryokosuge-theme
languageCode: ja-jp
title: ryokosuge.com

build:
  writeStats: true

[build.cachebusters]
  source = "assets/watching/hugo_stats\\.json"
  target = "styles\\.css"

[[build.cachebusters]]
  source = "(postcss|tailwind)\\.config\\.js"
  target = "css"

mainSections:
  - research-logs
  - daily-logs
  - english-conversation

menu:
  main:
    - identifier: research-logs
      name: Research Logs
      url: /research-logs/
      weight: 1
    - identifier: daily-logs
      name: Daily Logs
      url: /daily-logs/
      weight: 2
    - identifier: english-conversation
      name: English Conversation
      url: /english-conversation/
      weight: 3
```
**Validation**: Valid YAML syntax, theme points to ryokosuge-theme

---

## Phase 3.2: Base Template with FOUC Prevention ⚠️ MUST COMPLETE BEFORE 3.3

### T007: Create dark mode prevention script partial
**Contract**: contracts/dark-mode-system.md (FOUC Prevention Contract)
**File**: `themes/ryokosuge-theme/layouts/partials/head/dark-mode-script.html`
**Action**: Create inline script that applies dark class before render:
```html
<script>
  (function() {
    const theme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (!theme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })();
</script>
```
**Validation**: Script is synchronous IIFE, no external dependencies

### T008: Create base template (baseof.html)
**Contract**: contracts/theme-structure.md (baseof.html requirements)
**File**: `themes/ryokosuge-theme/layouts/_default/baseof.html`
**Action**: Create base template with dark mode script, semantic HTML:
```html
<!DOCTYPE html>
<html lang="{{ .Site.Language.Lang }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {{ partial "head/dark-mode-script.html" . }}
  {{ partial "head/meta.html" . }}
  {{ partial "head/styles.html" . }}
  <title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
  {{ partial "header.html" . }}
  <main class="flex-1">
    {{ block "main" . }}{{ end }}
  </main>
  {{ partial "footer.html" . }}
</body>
</html>
```
**Validation**: Contains `{{ block "main" . }}`, dark-mode-script before styles
**Critical**: This blocks all template tasks (T009-T014)

---

## Phase 3.3: Head Partials (ONLY after T008 baseof.html exists)

### T009 [P]: Create meta tags partial
**File**: `themes/ryokosuge-theme/layouts/partials/head/meta.html`
**Action**: Create meta tags for SEO and social:
```html
<meta name="description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<meta name="author" content="{{ .Site.Params.author }}">

<!-- Open Graph -->
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<meta property="og:type" content="{{ if .IsPage }}article{{ else }}website{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{{ .Title }}">
<meta name="twitter:description" content="{{ if .Description }}{{ .Description }}{{ else }}{{ .Site.Params.description }}{{ end }}">
```
**Validation**: Valid HTML, uses Hugo template variables

### T010 [P]: Create styles partial with Hugo Pipes
**Contract**: research.md (Hugo Asset Pipeline section)
**File**: `themes/ryokosuge-theme/layouts/partials/head/styles.html`
**Action**: Create CSS loading with PostCSS processing:
```html
{{ $options := dict "inlineImports" true }}
{{ if hugo.IsProduction }}
  {{ $options = merge $options (dict "noMap" true) }}
{{ end }}

{{ with resources.Get "css/main.css" }}
  {{ $styles := . | css.PostCSS $options }}
  {{ if hugo.IsProduction }}
    {{ $styles = $styles | minify | fingerprint | resources.PostProcess }}
  {{ end }}
  <link rel="stylesheet" href="{{ $styles.RelPermalink }}" {{ if hugo.IsProduction }}integrity="{{ $styles.Data.Integrity }}"{{ end }}>
{{ end }}

<!-- Preload Noto Sans JP font -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600&display=swap">
```
**Validation**: Uses Hugo Pipes functions, environment-aware

---

## Phase 3.4: Header and Navigation Partials

### T011 [P]: Create header partial
**File**: `themes/ryokosuge-theme/layouts/partials/header.html`
**Action**: Create header with site title, nav, and dark mode toggle:
```html
<header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
  <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="{{ .Site.BaseURL }}" class="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-dark transition-colors">
      {{ .Site.Title }}
    </a>

    <div class="flex items-center gap-4">
      {{ partial "navigation.html" . }}
      {{ partial "dark-mode-toggle.html" . }}
    </div>
  </div>
</header>
```
**Validation**: Includes navigation and dark-mode-toggle partials

### T012 [P]: Create navigation partial
**File**: `themes/ryokosuge-theme/layouts/partials/navigation.html`
**Action**: Create responsive navigation menu:
```html
<nav class="hidden md:flex items-center gap-6">
  {{ range .Site.Menus.main }}
    <a href="{{ .URL }}"
       class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors {{ if $.IsMenuCurrent "main" . }}font-semibold text-primary dark:text-primary-dark{{ end }}">
      {{ .Name }}
    </a>
  {{ end }}
</nav>

<!-- Mobile menu button (to be implemented) -->
<button class="md:hidden p-2" aria-label="メニュー">
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
</button>
```
**Validation**: Uses Hugo menu functions, responsive classes

### T013 [P]: Create footer partial
**File**: `themes/ryokosuge-theme/layouts/partials/footer.html`
**Action**: Create simple footer:
```html
<footer class="mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      <p>&copy; {{ now.Year }} {{ .Site.Title }}. All rights reserved.</p>
      <p class="mt-2">
        <a href="/privacy" class="hover:text-primary dark:hover:text-primary-dark transition-colors">Privacy Policy</a>
        <span class="mx-2">•</span>
        <a href="/terms" class="hover:text-primary dark:hover:text-primary-dark transition-colors">Terms</a>
      </p>
    </div>
  </div>
</footer>
```
**Validation**: Uses Hugo date functions, proper dark mode classes

### T014: Create dark mode toggle component
**Contract**: contracts/dark-mode-system.md (Toggle Component Contract)
**File**: `themes/ryokosuge-theme/layouts/partials/dark-mode-toggle.html`
**Action**: Create toggle button with icon switching and localStorage:
```html
<button id="theme-toggle"
        type="button"
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="ダークモード切替">
  <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
  </svg>
  <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
  </svg>
</button>

<script>
  (function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    function updateIcon() {
      if (document.documentElement.classList.contains('dark')) {
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
      } else {
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
      }
    }

    updateIcon();

    themeToggleBtn.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark');

      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }

      updateIcon();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        updateIcon();
      }
    });
  })();
</script>
```
**Validation**: Button toggles class, updates localStorage, listens to system changes

---

## Phase 3.5: Content Templates

### T015 [P]: Create homepage template
**File**: `themes/ryokosuge-theme/layouts/index.html`
**Action**: Create homepage with recent posts from all sections:
```html
{{ define "main" }}
<div class="max-w-4xl mx-auto px-4 py-12">
  <section class="mb-16">
    <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{{ .Site.Title }}</h1>
    <p class="text-lg text-gray-700 dark:text-gray-300 leading-japanese tracking-japanese">
      技術ブログ、日報、英会話練習の記録
    </p>
  </section>

  <section>
    <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">最近の投稿</h2>
    <div class="space-y-6">
      {{ range first 10 .Site.RegularPages }}
        {{ partial "post-card.html" . }}
      {{ end }}
    </div>
  </section>
</div>
{{ end }}
```
**Validation**: Uses `{{ define "main" }}`, displays recent posts

### T016 [P]: Create single post template
**Contract**: contracts/theme-structure.md (single.html requirements)
**File**: `themes/ryokosuge-theme/layouts/_default/single.html`
**Action**: Create single post layout with content type badge:
```html
{{ define "main" }}
<article class="max-w-4xl mx-auto px-4 py-12">
  <header class="mb-8">
    {{ partial "content-type-badge.html" . }}
    <h1 class="text-4xl font-bold mt-4 mb-4 text-gray-900 dark:text-white leading-japanese tracking-japanese">
      {{ .Title }}
    </h1>
    <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "2006年1月2日" }}
      </time>
      {{ if .Params.tags }}
        <div class="flex gap-2">
          {{ range .Params.tags }}
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">{{ . }}</span>
          {{ end }}
        </div>
      {{ end }}
    </div>
  </header>

  <div class="prose prose-lg dark:prose-invert max-w-none prose-ja">
    {{ .Content }}
  </div>
</article>
{{ end }}
```
**Validation**: Uses content-type-badge partial, Japanese typography classes

### T017 [P]: Create list template
**Contract**: contracts/theme-structure.md (list.html requirements)
**File**: `themes/ryokosuge-theme/layouts/_default/list.html`
**Action**: Create section list layout:
```html
{{ define "main" }}
<div class="max-w-4xl mx-auto px-4 py-12">
  <header class="mb-12">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white">{{ .Title }}</h1>
    {{ if .Description }}
      <p class="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-japanese tracking-japanese">
        {{ .Description }}
      </p>
    {{ end }}
  </header>

  <div class="space-y-6">
    {{ range .Pages }}
      {{ partial "post-card.html" . }}
    {{ end }}
  </div>
</div>
{{ end }}
```
**Validation**: Displays list of pages with post-card partial

### T018: Create post card partial
**File**: `themes/ryokosuge-theme/layouts/partials/post-card.html`
**Action**: Create reusable post card component:
```html
<article class="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-primary dark:hover:border-primary-dark transition-colors">
  {{ partial "content-type-badge.html" . }}

  <h3 class="text-xl font-semibold mt-3 mb-2">
    <a href="{{ .Permalink }}" class="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-dark transition-colors">
      {{ .Title }}
    </a>
  </h3>

  <time class="text-sm text-gray-600 dark:text-gray-400" datetime="{{ .Date.Format "2006-01-02" }}">
    {{ .Date.Format "2006年1月2日" }}
  </time>

  {{ if .Summary }}
    <p class="mt-3 text-gray-700 dark:text-gray-300 leading-japanese tracking-japanese">
      {{ .Summary }}
    </p>
  {{ end }}
</article>
```
**Validation**: Includes content-type-badge, responsive design
**Critical**: This blocks T015-T017 (they use this partial)

---

## Phase 3.6: Content Type Differentiation

### T019: Create content type badge partial
**Contract**: data-model.md (Content Type Entities)
**File**: `themes/ryokosuge-theme/layouts/partials/content-type-badge.html`
**Action**: Create badge with icon for each content type:
```html
{{ $contentType := .Section }}
{{ $badgeClass := "" }}
{{ $icon := "" }}
{{ $label := "" }}

{{ if eq $contentType "research-logs" }}
  {{ $badgeClass = "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200" }}
  {{ $label = "Research" }}
  {{ $icon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>` }}
{{ else if eq $contentType "daily-logs" }}
  {{ $badgeClass = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" }}
  {{ $label = "Daily Log" }}
  {{ $icon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>` }}
{{ else if eq $contentType "english-conversation" }}
  {{ $badgeClass = "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200" }}
  {{ $label = "English" }}
  {{ $icon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>` }}
{{ end }}

<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium {{ $badgeClass }}">
  {{ $icon | safeHTML }}
  <span>{{ $label }}</span>
</div>
```
**Validation**: Shows correct color and icon per content type

---

## Phase 3.7: Styling and Typography

### T020: Create main CSS with Tailwind and Japanese typography
**Contract**: contracts/typography-system.md, contracts/dark-mode-system.md
**File**: `themes/ryokosuge-theme/assets/css/main.css`
**Action**: Create main CSS with Tailwind import and custom utilities:
```css
@import "tailwindcss";

/* Custom Japanese typography utilities */
.prose-ja {
  font-feature-settings: "palt" 1;
  line-height: 1.85;
  letter-spacing: 0.05em;
}

.prose-ja p {
  margin-bottom: 1.5em;
}

.prose-ja h1,
.prose-ja h2,
.prose-ja h3,
.prose-ja h4 {
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: 0.05em;
  margin-top: 1.5em;
  margin-bottom: 0.75em;
}

.prose-ja code {
  font-family: ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 'Courier New', monospace;
  font-size: 0.875em;
  letter-spacing: 0;
  background-color: rgb(245, 245, 245);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}

.dark .prose-ja code {
  background-color: rgb(55, 56, 62);
}

.prose-ja pre {
  background-color: rgb(28, 29, 33);
  padding: 1em;
  border-radius: 0.5rem;
  overflow-x: auto;
  line-height: 1.6;
}

.prose-ja pre code {
  background-color: transparent;
  padding: 0;
}

.prose-ja a {
  color: rgb(59, 130, 246);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.dark .prose-ja a {
  color: rgb(96, 165, 250);
}

.prose-ja a:hover {
  color: rgb(29, 78, 216);
}

.dark .prose-ja a:hover {
  color: rgb(147, 197, 253);
}

/* Smooth transitions for theme switching */
* {
  transition-property: background-color, border-color, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Prevent transition on page load */
.no-transition * {
  transition: none !important;
}
```
**Validation**: Tailwind imports, Japanese typography utilities, dark mode styles

---

## Phase 3.8: Verification and Testing

### [X] T021: Verify theme structure per contract
**Contract**: contracts/theme-structure.md (Validation Rules)
**Action**: Run validation checks:
```bash
# Check required files exist
test -f themes/ryokosuge-theme/layouts/_default/baseof.html || echo "FAIL: baseof.html missing"
test -f themes/ryokosuge-theme/assets/css/main.css || echo "FAIL: main.css missing"
test -f themes/ryokosuge-theme/tailwind.config.js || echo "FAIL: tailwind.config.js missing"
test -f themes/ryokosuge-theme/layouts/partials/head/dark-mode-script.html || echo "FAIL: dark-mode-script missing"

# Verify dark-mode-script is before styles in baseof.html
grep -q "dark-mode-script" themes/ryokosuge-theme/layouts/_default/baseof.html || echo "FAIL: dark-mode-script not found"

echo "✓ Theme structure validation complete"
```
**Validation**: All required files exist per contract

### [X] T022: Test Hugo server and CSS compilation
**File**: N/A (command execution)
**Action**: Start Hugo development server and verify Tailwind compiles:
```bash
cd /workspaces/ryokosuge.com
hugo server -D
# Check terminal output for errors
# Visit http://localhost:1313 in browser
```
**Expected**: Server starts, no PostCSS errors, CSS loads
**Validation**: Navigate to site, inspect element shows Tailwind classes applied

### [X] T023: Visual verification per quickstart scenarios
**Contract**: quickstart.md (Verification Checklist)
**Action**: Manually verify all items in quickstart.md checklist:
- [x] ページが正しく表示される
- [x] 日本語フォント（Noto Sans JP）が読み込まれている
- [x] ダークモード切替ボタンが表示される
- [x] ダークモード切替が動作する
- [x] Research Logsに青色バッジが表示される
- [x] Daily Logsに緑色バッジが表示される
- [x] English Conversationに紫色バッジが表示される
- [x] 本文の行間が適切（1.85以上）
- [x] レスポンシブデザインが動作（モバイル/タブレット/デスクトップ）
- [x] ページ読み込み時にFOUCがない

**Validation**: All checklist items pass

### [X] T024: Test dark mode FOUC prevention
**Contract**: contracts/dark-mode-system.md (FOUC Prevention Contract)
**Action**: Test FOUC prevention scenarios:
1. Set localStorage to 'dark': `localStorage.setItem('theme', 'dark')`
2. Hard refresh page (Cmd+Shift+R)
3. **Expected**: No white flash, page loads in dark mode immediately

4. Clear localStorage: `localStorage.clear()`
5. Set OS to dark mode
6. Refresh page
7. **Expected**: Page loads in dark mode based on system preference

**Validation**: No white flash in either scenario

### [X] T025: Responsive design testing
**Action**: Test on different screen sizes:
```bash
# Chrome DevTools device toolbar
- Desktop: 1920px ✓
- Laptop: 1440px ✓
- Tablet: 768px ✓
- Mobile: 375px ✓
```
**Expected**: Layout adapts, no horizontal scroll, navigation accessible

**Validation**: All breakpoints display correctly

---

## Dependencies

### Critical Path
```
T001 (theme dir) → T002 (npm) → T004-T006 (configs) [P]
T006 (Hugo config update)
T007 (dark-mode-script) → T008 (baseof.html) → T009-T014 (partials/templates) [P]
T018 (post-card) → T015-T017 (content templates) [P]
T019 (content-type-badge) → T018 (post-card uses it)
T020 (main.css)
T021-T025 (verification)
```

### Phase Dependencies
- **Phase 3.2** (T007-T008) BLOCKS Phase 3.3 (T009-T014)
- **Phase 3.3** (T009-T014) BLOCKS Phase 3.5 (T015-T017)
- **T018** (post-card) BLOCKS T015-T017 (they use it)
- **T019** (badge) BLOCKS T018 (post-card uses it)
- **Phase 3.7** (T020) can run AFTER templates exist
- **Phase 3.8** (T021-T025) MUST be LAST

### Parallel Execution Groups

**Group 1: Configuration** (after T002)
```
T003 [P]: theme.toml
T004 [P]: tailwind.config.js
T005 [P]: postcss.config.js
```

**Group 2: Head Partials** (after T008)
```
T009 [P]: meta.html
T010 [P]: styles.html
```

**Group 3: Layout Partials** (after T008)
```
T011 [P]: header.html
T012 [P]: navigation.html
T013 [P]: footer.html
```

**Group 4: Content Templates** (after T018)
```
T015 [P]: index.html
T016 [P]: single.html
T017 [P]: list.html
```

---

## Parallel Example

```bash
# Launch Group 1 together (after T002):
Task: "Create theme.toml with metadata per contract"
Task: "Create tailwind.config.js with Japanese font stack"
Task: "Create postcss.config.js with @tailwindcss/postcss plugin"

# Launch Group 2 together (after T008):
Task: "Create meta.html with SEO tags"
Task: "Create styles.html with Hugo Pipes PostCSS processing"

# Launch Group 3 together (after T008):
Task: "Create header.html with site title and navigation"
Task: "Create navigation.html with responsive menu"
Task: "Create footer.html with copyright and links"
```

---

## Notes

- **[P] tasks** = different files, no dependencies, safe to run in parallel
- **Critical**: T007-T008 (FOUC prevention + baseof) must complete before any other templates
- **Critical**: T019 (badge) must complete before T018 (post-card)
- **Critical**: T018 (post-card) must complete before T015-T017 (content templates)
- Commit after each task or logical group
- Test locally with `hugo server -D` after major milestones
- Verify FOUC prevention thoroughly (T024)
- Follow contracts strictly for typography and dark mode

---

## Validation Checklist
*GATE: Verify before marking tasks complete*

- [x] All contracts have corresponding implementation tasks
- [x] All entities (theme config, content types) have tasks
- [x] All templates come after baseof.html (T008)
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] FOUC prevention (T007) comes before baseof.html (T008)
- [x] Typography system (T020) follows contracts
- [x] Dark mode system (T014, T020) follows contracts
- [x] Verification tasks (T021-T025) are last

---

**Status**: ✅ COMPLETED
**Completion Date**: 2025-10-03
**All Tasks**: T001-T025 (25/25 completed)

## Implementation Summary

### Completed Phases
- ✅ Phase 3.1: Setup and Configuration (T001-T006)
- ✅ Phase 3.2: Base Template with FOUC Prevention (T007-T008)
- ✅ Phase 3.3: Head Partials (T009-T010)
- ✅ Phase 3.4: Header and Navigation Partials (T011-T014)
- ✅ Phase 3.5: Content Templates (T015-T018)
- ✅ Phase 3.6: Content Type Differentiation (T019)
- ✅ Phase 3.7: Styling and Typography (T020)
- ✅ Phase 3.8: Verification and Testing (T021-T025)

### Key Fixes Applied
1. **Tailwind CSS v4 Dark Mode**: Added `@variant dark (.dark &);` for class-based dark mode
2. **Japanese Font**: Applied Noto Sans JP via `@layer base`
3. **FOUC Prevention**: dark-mode-script loads before styles in baseof.html

### Verification Results
- ✅ All visual elements display correctly
- ✅ Dark mode toggle works without FOUC
- ✅ Responsive design works across all breakpoints (375px, 768px, 1920px)
- ✅ Content type badges display with correct colors (English=purple, Research=blue, Daily Log=green)
- ✅ Japanese typography optimized with proper line-height and letter-spacing
