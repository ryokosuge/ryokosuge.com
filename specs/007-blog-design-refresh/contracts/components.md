# Component Contracts: ブログデザインリフレッシュ

**Date**: 2025-12-29
**Feature**: 007-blog-design-refresh

---

## 1. Header Component

### File
`themes/ryokosuge-theme/layouts/partials/header.html`

### Structure
```html
<header class="site-header">
  <div class="header-container">
    <a class="site-title">{{ .Site.Title }}</a>
    <div class="header-actions">
      {{ partial "navigation.html" . }}
      {{ partial "dark-mode-toggle.html" . }}
    </div>
  </div>
</header>
```

### Specifications

| Property | Value |
|----------|-------|
| Position | `sticky top-0 z-50` |
| Background (Light) | `rgba(255, 255, 255, 0.9)` with `backdrop-blur` |
| Background (Dark) | `rgba(15, 23, 42, 0.9)` with `backdrop-blur` |
| Border Bottom | `1px solid var(--color-border-default)` |
| Padding | `1rem` vertical |
| Max Width | `64rem` centered |

### Behavior
- スクロール時も固定表示
- 背景はブラー効果で半透明
- テーマ切替時にスムーズにトランジション

---

## 2. Navigation Component

### File
`themes/ryokosuge-theme/layouts/partials/navigation.html`

### Structure
```html
<nav class="main-nav">
  {{ range .Site.Menus.main }}
    <a href="{{ .URL }}" class="nav-link {{ if active }}nav-active{{ end }}">
      {{ .Name }}
    </a>
  {{ end }}
</nav>
<!-- Mobile menu button -->
<button class="mobile-menu-btn">...</button>
<!-- Mobile menu panel -->
<div class="mobile-menu">...</div>
```

### Specifications

#### Desktop Navigation
| Property | Value |
|----------|-------|
| Display | `flex` horizontal, hidden on mobile |
| Gap | `1.5rem` |
| Link Color (Default) | `var(--color-text-secondary)` |
| Link Color (Hover) | `var(--color-primary)` |
| Link Color (Active) | `var(--color-primary)` with underline |
| Transition | `150ms ease` |

#### Mobile Navigation
| Property | Value |
|----------|-------|
| Trigger | Hamburger icon, visible on `< md` |
| Panel | Full-width dropdown or slide-in |
| Background | `var(--color-bg-secondary)` |
| Animation | `200ms ease-out` slide |

### Behavior
- デスクトップ: 水平リンクリスト
- モバイル: ハンバーガーメニューから展開
- アクティブページはシアンでハイライト

---

## 3. Dark Mode Toggle Component

### File
`themes/ryokosuge-theme/layouts/partials/dark-mode-toggle.html`

### Structure
```html
<button id="theme-toggle" class="theme-toggle">
  <svg id="theme-toggle-dark-icon"><!-- Moon --></svg>
  <svg id="theme-toggle-light-icon"><!-- Sun --></svg>
</button>
```

### Specifications

| Property | Value |
|----------|-------|
| Size | `2.5rem` (40px) |
| Icon Size | `1.25rem` (20px) |
| Background (Hover) | `var(--color-bg-tertiary)` |
| Border Radius | `var(--radius-md)` |
| Transition | `150ms ease` |

### Behavior
- クリックでライト/ダーク切替
- localStorage に設定を保存
- 初回訪問時はOS設定を検出
- アイコンは現在のモードの反対を表示（ダーク時は太陽、ライト時は月）

---

## 4. Post Card Component

### File
`themes/ryokosuge-theme/layouts/partials/post-card.html`

### Structure
```html
<article class="post-card">
  {{ partial "content-type-badge.html" . }}
  <h3 class="card-title">
    <a href="{{ .Permalink }}">{{ .Title }}</a>
  </h3>
  <time class="card-date">{{ .Date.Format "2006年1月2日" }}</time>
  {{ if .Description }}
    <p class="card-description">{{ .Description }}</p>
  {{ end }}
</article>
```

### Specifications

| Property | Light Mode | Dark Mode |
|----------|------------|-----------|
| Background | `var(--color-bg-secondary)` | `rgba(30, 41, 59, 0.8)` |
| Border | `1px solid var(--color-border-default)` | `1px solid var(--color-border-subtle)` |
| Border Radius | `var(--radius-lg)` | `var(--radius-lg)` |
| Padding | `2rem` | `2rem` |
| Backdrop Filter | none | `blur(8px)` |

#### Hover State
| Property | Value |
|----------|-------|
| Border Color | `var(--color-primary)` |
| Shadow | `var(--shadow-glow)` (dark) / `var(--shadow-lg)` (light) |
| Transform | `translateY(-2px)` |
| Transition | `300ms ease` |

### Behavior
- ホバー時に浮き上がり効果
- ダークモードではグロー効果
- グループ全体がクリック可能

---

## 5. Content Type Badge Component

### File
`themes/ryokosuge-theme/layouts/partials/content-type-badge.html`

### Structure
```html
<span class="content-badge content-badge-{{ .Section }}">
  {{ .Section }}
</span>
```

### Specifications

| Content Type | Background Color | Text Color |
|--------------|------------------|------------|
| daily-logs | `var(--badge-blue)` | `white` |
| conversations | `var(--badge-violet)` | `white` |
| research | `var(--badge-emerald)` | `white` |
| english | `var(--badge-amber)` | `white` |

| Property | Value |
|----------|-------|
| Padding | `0.25rem 0.75rem` |
| Border Radius | `var(--radius-sm)` |
| Font Size | `var(--text-xs)` |
| Font Weight | `500` |
| Text Transform | `uppercase` |

---

## 6. Code Block Component

### File
`themes/ryokosuge-theme/assets/css/main.css` (Prose styles)

### Specifications

| Property | Value |
|----------|-------|
| Background | `var(--color-bg-code)` |
| Border | `1px solid var(--color-border-subtle)` |
| Border Radius | `var(--radius-lg)` |
| Padding | `1rem 1.25rem` |
| Font Family | `var(--font-mono)` |
| Font Size | `0.875rem` |
| Line Height | `1.6` |
| Overflow | `auto` horizontal scroll |

### Optional: Copy Button
| Property | Value |
|----------|-------|
| Position | `absolute top-2 right-2` |
| Background | `var(--color-bg-tertiary)` |
| Icon | Clipboard icon |
| Opacity | `0` → `1` on hover (code block) |
| Transition | `150ms ease` |

---

## 7. Single Page Layout

### File
`themes/ryokosuge-theme/layouts/_default/single.html`

### Structure
```html
<article class="article-single">
  <header class="article-header">
    {{ partial "content-type-badge.html" . }}
    <h1 class="article-title">{{ .Title }}</h1>
    <div class="article-meta">
      <time>{{ .Date }}</time>
      {{ if .Params.tags }}
        <div class="tags">...</div>
      {{ end }}
    </div>
  </header>
  <div class="article-content prose-ja">
    {{ .Content }}
  </div>
</article>
```

### Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Max Width | `64rem` centered |
| Title | Font Size | `var(--text-5xl)` |
| Title | Line Height | `1.2` |
| Content | Max Width | `65ch` |
| Content | Font Size | `var(--text-xl)` |
| Content | Line Height | `1.8` |

---

## 8. List Page Layout

### File
`themes/ryokosuge-theme/layouts/_default/list.html`

### Structure
```html
<div class="list-page">
  <header class="list-header">
    <h1>{{ .Title }}</h1>
    {{ if .Description }}
      <p>{{ .Description }}</p>
    {{ end }}
  </header>
  <div class="post-list">
    {{ range .Pages }}
      {{ partial "post-card.html" . }}
    {{ end }}
  </div>
</div>
```

### Specifications

| Element | Property | Value |
|---------|----------|-------|
| Container | Max Width | `64rem` centered |
| Header | Margin Bottom | `3rem` |
| Post List | Display | `flex flex-col` |
| Post List | Gap | `1.5rem` |

---

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| `sm` | `640px` | - |
| `md` | `768px` | Navigation: horizontal |
| `lg` | `1024px` | Container padding increases |
| `xl` | `1280px` | - |
