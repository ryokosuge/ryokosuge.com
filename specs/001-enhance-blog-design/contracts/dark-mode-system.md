# Contract: Dark Mode System

## Purpose
Define requirements for dark mode implementation with FOUC prevention and user preference persistence.

## Implementation Strategy Contract

### Method
**Class-based dark mode** with `dark` class on `<html>` element

**Rationale:**
- Allows manual user control
- Works with Tailwind's `dark:` variant
- Supports localStorage persistence
- Compatible with system preference detection

### Alternative Rejected
**Media query strategy (`@media (prefers-color-scheme: dark)`)** alone:
- No manual toggle control
- Cannot override system preference
- Poor user experience (2025 standard)

## FOUC Prevention Contract

### Critical Requirement
Dark mode script MUST execute before page render to prevent Flash of Unstyled Content.

### Implementation
**Inline script in `<head>`** before any stylesheets:

```html
<!-- layouts/partials/head/dark-mode-script.html -->
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

### Validation Rules
1. Script MUST be inline (not external file)
2. Script MUST be in `<head>` before `<link rel="stylesheet">`
3. Script MUST use IIFE to avoid global namespace pollution
4. Script MUST be synchronous (no async/defer)
5. Script MUST execute in < 5ms

## localStorage Contract

### Key-Value Specification
- **Key**: `"theme"`
- **Values**: `"light"` | `"dark"` | null (not set)
- **Storage**: localStorage (not sessionStorage or cookies)

### State Machine
```
Initial State:
  ├─ localStorage has "theme" → Use stored value
  └─ localStorage empty → Use system preference

User Toggle:
  ├─ Current: light → Set "dark" + add .dark class
  └─ Current: dark → Set "light" + remove .dark class

System Preference Change (if localStorage empty):
  ├─ prefers-color-scheme: dark → Add .dark class
  └─ prefers-color-scheme: light → Remove .dark class
```

## Toggle Component Contract

### Required Elements
1. **Button** with proper ARIA attributes
2. **Two icons** (sun and moon) with toggle visibility
3. **Click handler** to toggle mode
4. **localStorage update** on toggle
5. **Icon update** after toggle

### Implementation
```html
<!-- layouts/partials/dark-mode-toggle.html -->
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

    // Listen for system theme changes
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

## Color Scheme Contract

### Light Mode Colors
Must be defined in Tailwind configuration:
```css
--color-background: #ffffff;
--color-text: #1f2937;
--color-primary: #3b82f6;      /* 水色よりの青 */
--color-secondary: #6b7280;
--color-accent: #0ea5e9;
--color-border: #e5e7eb;
```

### Dark Mode Colors
Must provide sufficient contrast (WCAG AA: 4.5:1):
```css
--color-background: #1f2937;
--color-text: #f9fafb;
--color-primary: #60a5fa;      /* Lighter blue for dark bg */
--color-secondary: #9ca3af;
--color-accent: #38bdf8;
--color-border: #374151;
```

### Usage in Templates
All color classes MUST include dark mode variants:
```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 class="text-gray-900 dark:text-white">タイトル</h1>
  <p class="text-gray-700 dark:text-gray-300">本文</p>
  <a class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
    リンク
  </a>
</div>
```

## System Preference Listener Contract

### Implementation
Must listen for system preference changes:
```javascript
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  // Only update if user hasn't set preference
  if (!localStorage.getItem('theme')) {
    if (e.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateIcon();
  }
});
```

### Validation Rules
1. Listener MUST check localStorage before updating
2. Listener MUST respect user preference over system
3. Listener MUST update icon state
4. Listener MUST NOT interfere with manual toggle

## Accessibility Contract

### Requirements
1. Toggle button MUST have `aria-label` in Japanese: "ダークモード切替"
2. Toggle button MUST be keyboard accessible (focusable, enter/space triggers)
3. Color contrast MUST meet WCAG AA (4.5:1 for normal text)
4. Color contrast MUST meet WCAG AA in BOTH modes
5. Toggle button MUST have visible focus indicator
6. Icons MUST have `aria-hidden="true"` (decorative)

### Focus Indicator
```css
.theme-toggle:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

## Testing Contract

### Manual Tests
1. **FOUC Test**: Hard refresh page in dark mode - no white flash
2. **Toggle Test**: Click toggle - mode changes immediately
3. **Persistence Test**: Refresh page - mode persists
4. **System Test**: Change OS theme - site updates (if no localStorage)
5. **Icon Test**: Toggle button shows correct icon for current mode

### Automated Tests
```javascript
// Test 1: Dark class applied before render
const darkClass = document.documentElement.classList.contains('dark');
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
  assert(darkClass === true, 'Dark class not applied');
}

// Test 2: localStorage updates on toggle
const initialMode = localStorage.getItem('theme');
document.getElementById('theme-toggle').click();
const newMode = localStorage.getItem('theme');
assert(initialMode !== newMode, 'localStorage not updated');

// Test 3: Contrast ratio check
const bgColor = window.getComputedStyle(document.body).backgroundColor;
const textColor = window.getComputedStyle(document.body).color;
const contrast = calculateContrast(bgColor, textColor);
assert(contrast >= 4.5, 'Insufficient contrast ratio');
```

### Performance Requirements
- Dark mode toggle MUST respond in < 16ms (one frame at 60fps)
- localStorage read/write MUST complete in < 1ms
- FOUC prevention script MUST execute in < 5ms
- No layout shift when toggling modes

## Integration with Tailwind

### Tailwind Configuration
Enable dark mode in configuration:

**Tailwind v3.x (tailwind.config.js):**
```javascript
module.exports = {
  darkMode: 'class',
  // ...rest of config
}
```

**Tailwind v4.x (main.css):**
```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

### Validation Rules
1. Tailwind dark mode MUST be set to 'class' strategy (v3.x) or custom variant (v4.x)
2. All interactive elements MUST have dark mode styles
3. All text MUST be readable in both modes
4. All borders MUST be visible in both modes
5. All images SHOULD have appropriate brightness/contrast in dark mode
