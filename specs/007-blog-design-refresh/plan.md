# Implementation Plan: ブログデザインリフレッシュ

**Branch**: `007-blog-design-refresh` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-blog-design-refresh/spec.md`

## Summary

テック・デベロッパー風デザインへのリフレッシュ。シアン/ターコイズ (#06b6d4) をアクセントカラーとし、VS Code風のクールで技術的な印象を演出。既存のTailwind CSS + Hugoベースのテーマ構造を活用し、ダークモード基調のモダンなデザインに刷新する。

## Technical Context

**Language/Version**: HTML/CSS (Tailwind CSS v4), Hugo Templates (Go Template)
**Primary Dependencies**: Tailwind CSS v4, Hugo (static site generator), Noto Sans JP (日本語フォント)
**Storage**: N/A (静的サイト)
**Testing**: ブラウザでの目視確認、Lighthouse (パフォーマンス/アクセシビリティ)
**Target Platform**: モダンブラウザ (Chrome, Firefox, Safari, Edge)
**Project Type**: Web (静的サイト/Hugo テーマ)
**Performance Goals**: ページ読み込み3秒以内、テーマ切替0.5秒以内
**Constraints**: Hugo静的サイトジェネレーターの制約内、既存コンテンツ構造維持
**Scale/Scope**: 4ページタイプ (トップ/一覧/詳細/カテゴリ)、4コンテンツカテゴリ

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content-First Workflow | ✅ PASS | デザイン変更のみ、コンテンツ構造は維持 |
| II. Template-Based Creation | ✅ PASS | Hugo archetypesは変更なし |
| III. Japanese & English Support | ✅ PASS | Noto Sans JP継続使用、日本語タイポグラフィ最適化維持 |
| IV. Git-Based Publishing | ✅ PASS | テーマは既にgit submoduleとして管理 |
| V. Local Development First | ✅ PASS | `make server`でローカルプレビュー可能 |
| VI. Japanese-First Communication | ✅ PASS | 本計画は日本語で記述 |

**Gate Status**: ✅ ALL PASSED - Phase 0に進行可能

## Project Structure

### Documentation (this feature)

```text
specs/007-blog-design-refresh/
├── plan.md              # This file
├── research.md          # Phase 0 output - デザインリサーチ結果
├── data-model.md        # Phase 1 output - CSS変数・デザイントークン定義
├── quickstart.md        # Phase 1 output - 開発環境セットアップ
├── contracts/           # Phase 1 output - コンポーネント仕様
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
themes/ryokosuge-theme/
├── assets/
│   └── css/
│       └── main.css              # Tailwind CSS + カスタムスタイル
├── layouts/
│   ├── _default/
│   │   ├── baseof.html           # ベーステンプレート
│   │   ├── list.html             # 一覧ページ
│   │   └── single.html           # 記事詳細ページ
│   ├── partials/
│   │   ├── header.html           # ヘッダー
│   │   ├── footer.html           # フッター
│   │   ├── navigation.html       # ナビゲーション
│   │   ├── dark-mode-toggle.html # ダークモード切替
│   │   ├── post-card.html        # 記事カード
│   │   ├── content-type-badge.html # コンテンツタイプバッジ
│   │   └── head/
│   │       ├── dark-mode-script.html
│   │       ├── meta.html
│   │       └── styles.html
│   └── index.html                # トップページ
├── tailwind.config.js            # Tailwind設定
└── postcss.config.js             # PostCSS設定
```

**Structure Decision**: 既存のHugoテーマ構造を維持。CSS/スタイルの変更とHTMLテンプレートの更新のみ。

## Complexity Tracking

> 本機能は既存構造を維持するため、複雑性の正当化は不要

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |

---

## Constitution Check (Post-Design Re-evaluation)

*Phase 1完了後の再評価*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Content-First Workflow | ✅ PASS | archetypes, コンテンツ構造は一切変更なし |
| II. Template-Based Creation | ✅ PASS | Hugoテンプレート構造を維持 |
| III. Japanese & English Support | ✅ PASS | Noto Sans JP, prose-ja継続。日本語タイポグラフィ設定強化 |
| IV. Git-Based Publishing | ✅ PASS | テーマはgit submodule、変更はPR経由 |
| V. Local Development First | ✅ PASS | `make server`でホットリロード確認可能 |
| VI. Japanese-First Communication | ✅ PASS | 全ドキュメントは日本語で記述 |

**Post-Design Gate Status**: ✅ ALL PASSED - `/speckit.tasks` に進行可能

---

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| research.md | `specs/007-blog-design-refresh/research.md` | ✅ Complete |
| data-model.md | `specs/007-blog-design-refresh/data-model.md` | ✅ Complete |
| contracts/ | `specs/007-blog-design-refresh/contracts/` | ✅ Complete |
| quickstart.md | `specs/007-blog-design-refresh/quickstart.md` | ✅ Complete |

---

## Next Steps

1. `/speckit.tasks` を実行してタスク一覧を生成
2. 各タスクを順次実装
3. ローカルで目視確認
4. PRを作成してレビュー
