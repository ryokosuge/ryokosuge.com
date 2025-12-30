# Data Model: デザイントークン定義

**Date**: 2025-12-29
**Feature**: 007-blog-design-refresh

## Overview

本ドキュメントはブログデザインリフレッシュで使用するデザイントークン（CSS変数、カラーパレット、スペーシング、タイポグラフィ）を定義する。

---

## 1. カラーパレット

### Primary Colors (アクセントカラー)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-primary` | `#0891b2` (cyan-600) | `#06b6d4` (cyan-500) | リンク、ボタン、アクティブ状態 |
| `--color-primary-hover` | `#0e7490` (cyan-700) | `#22d3ee` (cyan-400) | ホバー状態 |
| `--color-primary-glow` | `rgba(8, 145, 178, 0.2)` | `rgba(6, 182, 212, 0.2)` | グロー効果 |

### Background Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-bg-primary` | `#ffffff` | `#0f172a` (slate-900) | ページ背景 |
| `--color-bg-secondary` | `#f8fafc` (slate-50) | `#1e293b` (slate-800) | カード、セクション背景 |
| `--color-bg-tertiary` | `#f1f5f9` (slate-100) | `#334155` (slate-700) | インラインコード背景 |
| `--color-bg-code` | `#1e293b` | `#0f172a` | コードブロック背景 |

### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-text-primary` | `#0f172a` (slate-900) | `#f8fafc` (slate-50) | 見出し、本文 |
| `--color-text-secondary` | `#475569` (slate-600) | `#94a3b8` (slate-400) | 補足テキスト |
| `--color-text-muted` | `#64748b` (slate-500) | `#64748b` (slate-500) | 日付、メタ情報 |

### Border Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-border-default` | `#e2e8f0` (slate-200) | `#334155` (slate-700) | 通常の境界線 |
| `--color-border-hover` | `#06b6d4` | `#06b6d4` | ホバー時の境界線 |
| `--color-border-subtle` | `rgba(6, 182, 212, 0.2)` | `rgba(6, 182, 212, 0.3)` | 微妙な境界線 |

### Content Type Badge Colors

| Content Type | Light BG | Dark BG | Usage |
|--------------|----------|---------|-------|
| daily-logs | `#3b82f6` (blue-500) | `#60a5fa` (blue-400) | 日報バッジ |
| conversations | `#8b5cf6` (violet-500) | `#a78bfa` (violet-400) | 会話ログバッジ |
| research | `#10b981` (emerald-500) | `#34d399` (emerald-400) | 調査バッジ |
| english | `#f59e0b` (amber-500) | `#fbbf24` (amber-400) | 英語練習バッジ |

---

## 2. タイポグラフィ

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `"Noto Sans JP", "Hiragino Kaku Gothic ProN", sans-serif` | 本文、見出し |
| `--font-mono` | `ui-monospace, "SF Mono", Monaco, "Cascadia Code", monospace` | コード、ターミナル風要素 |

### Font Sizes (Scale)

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--text-xs` | `0.75rem` (12px) | 1.5 | バッジ、小さなラベル |
| `--text-sm` | `0.875rem` (14px) | 1.5 | メタ情報、日付 |
| `--text-base` | `1rem` (16px) | 1.75 | ベーステキスト |
| `--text-lg` | `1.125rem` (18px) | 1.75 | カード本文 |
| `--text-xl` | `1.25rem` (20px) | 1.8 | 記事本文 |
| `--text-2xl` | `1.5rem` (24px) | 1.5 | 小見出し (h4) |
| `--text-3xl` | `1.875rem` (30px) | 1.4 | 中見出し (h3) |
| `--text-4xl` | `2.25rem` (36px) | 1.3 | 大見出し (h2) |
| `--text-5xl` | `3rem` (48px) | 1.2 | ページタイトル (h1) |

### Japanese Typography Settings

| Property | Value | Rationale |
|----------|-------|-----------|
| `line-height` | 1.8 | 日本語の可読性に最適 |
| `letter-spacing` | 0.04em | 文字間隔を適度に確保 |
| `font-feature-settings` | `"palt" 1` | プロポーショナルメトリクス |

---

## 3. スペーシング

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | `0.25rem` (4px) | 最小間隔 |
| `--space-2` | `0.5rem` (8px) | タイト間隔 |
| `--space-3` | `0.75rem` (12px) | 小間隔 |
| `--space-4` | `1rem` (16px) | 標準間隔 |
| `--space-5` | `1.25rem` (20px) | 中間隔 |
| `--space-6` | `1.5rem` (24px) | 大間隔 |
| `--space-8` | `2rem` (32px) | セクション間 |
| `--space-12` | `3rem` (48px) | 大セクション間 |

### Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--container-max` | `64rem` (1024px) | コンテンツ最大幅 |
| `--container-prose` | `65ch` | 記事本文の最適幅 |

---

## 4. エフェクト

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | 微妙な影 |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.1)` | カード影 |
| `--shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.1)` | ホバー時影 |
| `--shadow-glow` | `0 0 20px var(--color-primary-glow)` | グロー効果 |

### Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `150ms ease` | 色変化 |
| `--transition-normal` | `200ms ease` | 標準アニメーション |
| `--transition-slow` | `300ms ease` | 複雑な変化 |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.25rem` (4px) | 小さな角丸 |
| `--radius-md` | `0.5rem` (8px) | 標準角丸 |
| `--radius-lg` | `0.75rem` (12px) | カード角丸 |
| `--radius-xl` | `1rem` (16px) | 大きな角丸 |

---

## 5. コンポーネント別トークン

### Header

| Property | Light | Dark |
|----------|-------|------|
| Background | `rgba(255, 255, 255, 0.9)` | `rgba(15, 23, 42, 0.9)` |
| Backdrop Filter | `blur(8px)` | `blur(8px)` |
| Border Bottom | `var(--color-border-default)` | `var(--color-border-default)` |

### Card

| Property | Light | Dark |
|----------|-------|------|
| Background | `var(--color-bg-secondary)` | `rgba(30, 41, 59, 0.8)` |
| Border | `var(--color-border-default)` | `var(--color-border-subtle)` |
| Border (hover) | `var(--color-primary)` | `var(--color-primary)` |
| Shadow (hover) | `var(--shadow-lg)` | `var(--shadow-glow)` |
| Transform (hover) | `translateY(-2px)` | `translateY(-2px)` |

### Code Block

| Property | Value |
|----------|-------|
| Background | `var(--color-bg-code)` |
| Border | `1px solid var(--color-border-subtle)` |
| Border Radius | `var(--radius-lg)` |
| Padding | `var(--space-4)` |
| Font | `var(--font-mono)` |
| Font Size | `0.875rem` |

---

## 6. Tailwind 設定マッピング

```javascript
// tailwind.config.js での実装
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#06b6d4',
          hover: '#22d3ee',
          glow: 'rgba(6, 182, 212, 0.2)',
        },
        // Slate系は既にTailwindに含まれる
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', /* ... */],
        mono: ['ui-monospace', 'SF Mono', /* ... */],
      },
      lineHeight: {
        japanese: '1.8',
      },
      letterSpacing: {
        japanese: '0.04em',
      },
    },
  },
}
```

---

## State Transitions

### Button/Link States

```
Default → Hover → Active → Focus
   ↓         ↓        ↓       ↓
 color   color+   opacity  outline
         glow     0.9      ring
```

### Card States

```
Default → Hover
   ↓         ↓
 border   border-primary
 subtle   shadow-glow
          translateY(-2px)
```

### Theme Transition

```
Light ↔ Dark (150ms ease)
- background-color
- border-color
- color
```
