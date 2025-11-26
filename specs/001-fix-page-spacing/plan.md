# Implementation Plan: ページ全体の余白統一

**Branch**: `001-fix-page-spacing` | **Date**: 2025-11-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fix-page-spacing/spec.md`

## Summary

ブログサイト全体で左右の余白（margin/padding）が統一されていない問題を修正する。現状、ページテンプレートによって`max-w-4xl`と`max-w-5xl`が混在しており、header/footerとメインコンテンツで異なる最大幅が適用されている。Tailwind CSSクラスを統一し、レスポンシブ対応の余白を一貫させる。

## Technical Context

**Language/Version**: Go Templates (Hugo), CSS/Tailwind CSS v4
**Primary Dependencies**: Tailwind CSS (via @import "tailwindcss")
**Storage**: N/A（静的サイト、CSSのみ）
**Testing**: 目視確認 + ブラウザDevTools
**Target Platform**: Web (デスクトップ/タブレット/モバイル)
**Project Type**: Static site (Hugo theme)
**Performance Goals**: 視覚的一貫性の確保、レイアウトシフトなし
**Constraints**: 既存のTailwindクラスを活用、カスタムCSSは最小限
**Scale/Scope**: 5テンプレートファイル（baseof, index, single, list, header, footer）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content-First Workflow | ✅ Pass | レイアウト修正は既存コンテンツワークフローに影響なし |
| II. Template-Based Creation | ✅ Pass | Hugoテンプレートの修正のみ |
| III. Japanese & English Support | ✅ Pass | 余白修正は言語サポートに影響なし |
| IV. Git-Based Publishing | ✅ Pass | 通常のGitワークフローで対応 |
| V. Local Development First | ✅ Pass | `make server`でローカル確認可能 |
| VI. Japanese-First Communication | ✅ Pass | 本計画は日本語で作成 |

**Gate Status**: ✅ ALL PASS - Phase 0進行可

## Project Structure

### Documentation (this feature)

```text
specs/001-fix-page-spacing/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # N/A (CSS修正のみ)
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A (API不要)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
themes/ryokosuge-theme/
├── assets/
│   └── css/
│       └── main.css            # Tailwind CSS設定（修正対象）
└── layouts/
    ├── _default/
    │   ├── baseof.html         # ベーステンプレート
    │   ├── list.html           # 一覧ページ（修正対象: max-w-4xl → max-w-5xl）
    │   └── single.html         # 個別記事ページ（確認対象）
    ├── index.html              # トップページ（確認対象）
    └── partials/
        ├── header.html         # ヘッダー（確認対象）
        └── footer.html         # フッター（修正対象: max-w-4xl → max-w-5xl）
```

**Structure Decision**: Hugo theme内のテンプレートファイルとCSSファイルを直接修正

## Current State Analysis

### 発見された問題

| ファイル | 現在の設定 | 問題点 |
|---------|-----------|--------|
| `index.html` | `max-w-5xl mx-auto px-4` | 基準として正しい |
| `single.html` | `max-w-5xl mx-auto px-4` | 基準と一致 |
| `list.html` | `max-w-4xl mx-auto px-4` | ❌ 幅が狭い |
| `header.html` | `max-w-5xl mx-auto px-4` | 基準と一致 |
| `footer.html` | `max-w-4xl mx-auto px-4` | ❌ 幅が狭い |

### 修正方針

1. **統一する最大幅**: `max-w-5xl`（1024px）を全ページで採用
2. **余白サイズ**:
   - デスクトップ: `px-12`（48px）- 仕様で決定した広い余白
   - タブレット: `px-8`（32px）
   - モバイル: `px-4`（16px）- 仕様の最低要件を満たす

## Complexity Tracking

> 本機能は単純なCSS修正のため、複雑性の正当化は不要

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |
