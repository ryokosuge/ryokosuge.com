# Contract: Japanese Typography System

## Purpose
Define typography requirements for optimal Japanese content readability.

## Font Stack Contract

### Primary Font
**Name:** Noto Sans JP
**Source:** Google Fonts or self-hosted
**Weights:** 400 (Regular), 600 (Semi-bold)
**Format:** WOFF2 (primary), WOFF (fallback)

### Fallback Stack
Must be defined in this exact order:
```css
font-family: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans",
             "Yu Gothic", "YuGothic", "Meiryo", "MS Gothic", sans-serif;
```

**Rationale for order:**
1. Noto Sans JP - Primary web font
2. Hiragino - macOS/iOS high quality
3. Yu Gothic - Windows 8.1+/macOS 10.9+
4. Meiryo - Windows 7 fallback
5. MS Gothic - Universal Windows fallback
6. sans-serif - System default

## Typography Values Contract

### Font Sizes
- **Base**: 16px (1rem)
- **Small**: 14px (0.875rem)
- **H1**: 2.5rem (40px)
- **H2**: 2rem (32px)
- **H3**: 1.5rem (24px)
- **H4**: 1.25rem (20px)
- **Code**: 0.875rem (14px)

### Line Height (Leading)
Japanese content requires higher line-height than Western text:
- **Body Text**: 1.85 (minimum 1.75)
- **Relaxed**: 2.0
- **Headings**: 1.5
- **Code Blocks**: 1.6

**Validation:** Line height for body text MUST be >= 1.85

### Letter Spacing (Tracking)
- **Normal**: 0.05em
- **Wide**: 0.1em
- **Headings**: 0.05em

### Text Alignment
- **Japanese content**: Justified (text-align: justify)
- **Short headings**: Left-aligned
- **Code blocks**: Left-aligned with monospace font

### Font Feature Settings
```css
font-feature-settings: "palt" 1; /* Proportional alternate metrics */
```

## Tailwind CSS Configuration

### In tailwind.config.js or @theme block:
```javascript
// tailwind.config.js (v3.x)
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
```

### Or in main.css (Tailwind v4.x):
```css
@theme {
  --font-sans: "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans",
               "Yu Gothic", "YuGothic", "Meiryo", "MS Gothic", sans-serif;

  --leading-japanese: 1.85;
  --leading-japanese-relaxed: 2.0;

  --tracking-japanese: 0.05em;
  --tracking-japanese-wide: 0.1em;
}
```

## Custom Utility Classes

### .prose-ja
Japanese-optimized prose class:
```css
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
  font-family: ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono',
               'Courier New', monospace;
  font-size: 0.875em;
  letter-spacing: 0;
}
```

## Font Loading Contract

### Loading Strategy
1. **Preload critical font weights**:
```html
<link rel="preload" href="/fonts/noto-sans-jp-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/noto-sans-jp-600.woff2" as="font" type="font/woff2" crossorigin>
```

2. **Or use Google Fonts with font-display**:
```html
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600&display=swap">
```

### Font Display
Must use `font-display: swap` to prevent FOIT (Flash of Invisible Text)

```css
@font-face {
  font-family: 'Noto Sans JP';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/noto-sans-jp-400.woff2') format('woff2');
}
```

## Validation Rules

1. **Base font size MUST be >= 14px** (preferably 16px)
2. **Body line-height MUST be >= 1.85** for Japanese content
3. **Letter spacing MUST be >= 0.05em** for body text
4. **Font stack MUST include Noto Sans JP** as primary
5. **Font stack MUST include system fallbacks** in correct order
6. **Font-display MUST be 'swap'** to prevent FOIT
7. **Code blocks MUST use monospace font** without letter-spacing
8. **Headings MUST use font-weight: 600** or higher
9. **NO italic styling** for Japanese text

## Testing Contract

### Visual Tests
```bash
# Test on different platforms
- Windows: Check Yu Gothic/Meiryo rendering
- macOS: Check Hiragino rendering
- Linux: Check Noto Sans JP loading
- Mobile: Check Noto Sans JP loading
```

### Automated Checks
```javascript
// Check line-height
const bodyLineHeight = window.getComputedStyle(document.body).lineHeight;
assert(parseFloat(bodyLineHeight) >= 1.85, 'Line height too small for Japanese');

// Check letter-spacing
const bodyLetterSpacing = window.getComputedStyle(document.body).letterSpacing;
assert(bodyLetterSpacing !== 'normal', 'Letter spacing not set');

// Check font-family
const fontFamily = window.getComputedStyle(document.body).fontFamily;
assert(fontFamily.includes('Noto Sans JP'), 'Noto Sans JP not in font stack');
```

### Readability Metrics
- **Optimal line length**: 25-35 characters per line (Japanese)
- **Maximum paragraph length**: 150 characters
- **Minimum contrast ratio**: 4.5:1 (WCAG AA)
- **Dark mode contrast ratio**: 4.5:1 (WCAG AA)
