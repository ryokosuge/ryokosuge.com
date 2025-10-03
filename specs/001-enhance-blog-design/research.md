# Research: Custom Hugo Theme with Tailwind CSS Integration

## 1. Hugo Theme Structure and Required Files

### Decision
Modular Template Architecture with Base Template Pattern

### Rationale
- **baseof.html Pattern**: Eliminates code duplication by defining common HTML structure once
- **Block System**: Templates use `{{ block "main" . }}` for precise content injection
- **Template Lookup Order**: Hugo checks working directory before theme directory for easy customization
- **Partials Organization**: Subdirectories improve maintainability and logical grouping
- **Assets vs Static**: Assets for processed files, Static for files copied as-is

### Alternatives Considered
- **Flat Structure Without Base Template**: Rejected due to code duplication
- **Single Template File**: Rejected as not scalable for complex sites
- **Hugo Modules**: Considered for future migration after initial development

---

## 2. Hugo Asset Pipeline and PostCSS Integration

### Decision
Hugo Pipes with PostCSS for Asset Processing

### Rationale
- Native Hugo solution, no external build tools needed
- PostCSS flexibility for modern CSS features
- Environment-aware processing (development vs production)
- Source maps for debugging in development
- Minification and fingerprinting in production

### Alternatives Considered
- **npm Scripts with Separate Build**: Rejected due to complexity of running two processes
- **Hugo's css.TailwindCSS Function**: Less flexible for custom PostCSS plugins
- **Manual CSS Without Processing**: Loses benefits of modern CSS tooling

---

## 3. Tailwind CSS Latest Version Setup with Hugo

### Decision
Tailwind CSS 4.0 with PostCSS Integration

### Rationale
- **CSS-first configuration**: Eliminates JavaScript config file complexity
- **Simplified setup**: Single `@import "tailwindcss"` statement
- **Better performance**: Smaller bundle sizes and faster builds
- **Build Stats**: Enables Tailwind to scan Hugo templates for utility classes
- **Cache Busting**: Triggers CSS rebuild when configs or templates change

### Alternatives Considered
- **Tailwind Standalone CLI**: Less flexible, harder to integrate additional PostCSS plugins
- **Tailwind 3.x**: Older, more complex configuration approach
- **Hugo's css.TailwindCSS Function**: Good but less documented and flexible

---

## 4. Best Practices for Japanese Typography

### Decision
Comprehensive Japanese Typography System with Web Font Stack

### Rationale
- **Noto Sans JP Priority**: Free, excellent Unicode coverage, good legibility
- **Comprehensive Fallback Stack**: Covers macOS (Hiragino), Windows (Yu Gothic, Meiryo)
- **Higher Line Height**: 185-200% for complex kanji characters (vs 140-150% for Western)
- **Letter Spacing**: 0.05em improves legibility between complex characters
- **No Italic Usage**: Italics don't exist in Japanese typography

**Font Stack:**
```
"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans",
"Yu Gothic", "YuGothic", "Meiryo", "MS Gothic", sans-serif
```

**Typography Values:**
- Font Size: Minimum 14px, prefer 16px
- Line Height: 1.85-2.0
- Letter Spacing: 0.05em to 0.15em
- Line Length: 25-35 characters (optimal: 30)

### Alternatives Considered
- **System Font Stack Only**: Rejected due to inconsistent rendering across platforms
- **Single Web Font**: Rejected due to FOIT (Flash of Invisible Text) risk
- **Adobe Fonts**: Rejected due to licensing costs
- **Variable Fonts**: Not ready due to limited Japanese variable font availability

---

## 5. Dark Mode Implementation

### Decision
Class-Based Dark Mode with localStorage and System Preference Fallback

### Rationale
- **Class-Based Strategy**: Provides manual toggle control
- **localStorage Persistence**: User choice persists across sessions
- **System Preference Fallback**: Respects OS-level preference as default
- **FOUC Prevention**: Inline script in `<head>` applies dark class before render
- **Modern Standard**: Users expect manual control (2025 best practice)

**Implementation:**
- Use Tailwind's `dark:` variant
- Inline script in `<head>` to prevent flash
- Toggle button with localStorage
- Listen for system preference changes

### Alternatives Considered
- **Media Query Only**: Rejected, no manual toggle control
- **Data Attribute Strategy**: Less standard than class approach
- **CSS Custom Properties Only**: Loses Tailwind's built-in utilities
- **Cookie-Based**: More complex than localStorage for static sites
- **Third-party Libraries**: Overkill for static Hugo site

---

## Summary of Key Decisions

1. **Theme Structure**: Modular architecture with base template pattern
2. **Asset Processing**: Hugo Pipes with PostCSS
3. **Tailwind Integration**: Version 4.0 with CSS-first configuration
4. **Japanese Typography**: Noto Sans JP with 1.85-2.0 line-height, 0.05em letter-spacing
5. **Dark Mode**: Class-based with localStorage and system preference fallback

All approaches prioritize developer experience, performance, user experience, and modern standards (2025).
