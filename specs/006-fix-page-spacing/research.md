# Research: ページ全体の余白統一

**Feature**: 001-fix-page-spacing
**Date**: 2025-11-25

## 調査項目

### 1. Tailwind CSSの余白クラス体系

**Decision**: レスポンシブpaddingクラス（`px-4 md:px-8 lg:px-12`）を採用

**Rationale**:
- Tailwind CSSはユーティリティファーストアプローチを採用
- ブレークポイントプレフィックス（`md:`, `lg:`）でレスポンシブ対応が容易
- `px-4` = 16px, `px-8` = 32px, `px-12` = 48px で仕様要件を満たす

**Alternatives considered**:
- カスタムCSSクラス作成 → 却下（Tailwindの標準クラスで十分）
- CSS変数による一元管理 → 却下（オーバーエンジニアリング）

### 2. max-width クラスの選択

**Decision**: `max-w-5xl`（1024px）を全ページで統一

**Rationale**:
- 現在のトップページとsingleページが`max-w-5xl`を使用
- 日本語コンテンツの可読性に適した幅
- 1024pxはデスクトップで適度な余白を確保

**Alternatives considered**:
- `max-w-4xl`（896px）→ 却下（より狭く、list.htmlとfooterの現状）
- `max-w-6xl`（1152px）→ 却下（日本語テキストには広すぎる）
- `max-w-3xl`（768px）→ 却下（コンテンツが窮屈）

### 3. レスポンシブブレークポイント戦略

**Decision**: Tailwindデフォルトブレークポイントを使用

| ブレークポイント | 幅 | 左右padding |
|----------------|-----|-------------|
| デフォルト（モバイル） | < 768px | `px-4`（16px） |
| `md:` | ≥ 768px | `px-8`（32px） |
| `lg:` | ≥ 1024px | `px-12`（48px） |

**Rationale**:
- モバイルファーストアプローチ
- 仕様要件（モバイル16px、デスクトップ40-48px）を満たす
- Tailwindの標準ブレークポイントで一貫性確保

**Alternatives considered**:
- カスタムブレークポイント → 却下（標準で十分）
- コンテナクエリ → 却下（ブラウザサポートとオーバーエンジニアリング）

### 4. 修正対象ファイルの特定

**Decision**: 以下のファイルを修正

| ファイル | 修正内容 |
|---------|---------|
| `list.html` | `max-w-4xl` → `max-w-5xl`, `px-4` → `px-4 md:px-8 lg:px-12` |
| `footer.html` | `max-w-4xl` → `max-w-5xl`, `px-4` → `px-4 md:px-8 lg:px-12` |
| `index.html` | `px-4` → `px-4 md:px-8 lg:px-12`（幅は既にmax-w-5xl） |
| `single.html` | `px-4` → `px-4 md:px-8 lg:px-12`（幅は既にmax-w-5xl） |
| `header.html` | `px-4` → `px-4 md:px-8 lg:px-12`（幅は既にmax-w-5xl） |

**Rationale**:
- 全テンプレートで同じ余白パターンを使用することで一貫性確保
- max-widthの統一でページ遷移時のジャンプを防止

### 5. 既存スタイルへの影響

**Decision**: 影響は最小限、後方互換性あり

**調査結果**:
- `main.css`のカスタムスタイル（`.prose-ja`等）は余白に影響しない
- Tailwindのユーティリティクラス上書きなし
- ダークモード対応に影響なし

**Rationale**:
- 変更はコンテナの幅とpaddingのみ
- コンテンツスタイル（typography, colors）は変更なし

## 未解決事項

なし - 全ての技術的決定が完了

## 次のステップ

1. quickstart.mdで修正手順を文書化
2. `/speckit.tasks`でタスク生成
3. 実装と目視確認
