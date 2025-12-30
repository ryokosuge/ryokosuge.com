# Research: ブログデザインリフレッシュ

**Date**: 2025-12-29
**Feature**: 007-blog-design-refresh

## 1. ダークモード配色

### Decision
ダークモードの背景色は純粋な黒 (#000) ではなく、ダークグレー (#0f172a または #1e293b) を使用。アクセントカラーはシアン (#06b6d4) を採用し、VS Code風の技術的な印象を演出。

### Rationale
- 純粋な黒は目に厳しく、エレガントさに欠ける
- ダークグレーは深みがありながらソフトな印象を与える
- シアン/ターコイズはVS Code系テーマ（Tokyo Night, Houston等）で人気
- 高コントラストのアクセントカラーは重要な要素を際立たせる

### Alternatives Considered
- **Dracula Theme風 (紫系)**: 人気だが個性が強すぎる
- **純粋な黒背景**: 目が疲れやすく、2025年のトレンドに反する
- **ニュートラルグレー**: 技術的な印象が薄い

### Sources
- [Dark Mode Design: Best Practices 2025](https://muksalcreative.com/2025/07/26/dark-mode-design-best-practices-2025/)
- [Web Design Trends 2025: Dark Mode & Glassmorphism](https://editorialge.com/web-design-trends-dark-mode-glassmorphism/)

---

## 2. Tailwind CSS v4 ダークモード設定

### Decision
Tailwind CSS v4では`@variant`ディレクティブでダークモードを設定。既存の`@variant dark (.dark &);`構文を維持し、class-basedのダークモード切替を継続。

### Rationale
- Tailwind v4では`tailwind.config.js`の`darkMode: "class"`設定が廃止
- CSS内で`@variant`または`@custom-variant`で定義する新方式
- 現在のプロジェクトは既にこの方式を採用済み

### Implementation
```css
@import "tailwindcss";
@variant dark (.dark &);
```

### Alternatives Considered
- **data-theme属性方式**: 複数テーマ対応に有利だが、現時点では不要
- **prefers-color-scheme のみ**: ユーザー手動切替ができない

### Sources
- [Tailwind CSS Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [Theme Colors with Tailwind v4](https://medium.com/@kevstrosky/theme-colors-with-tailwind-css-v4-0-and-next-themes-dark-light-custom-mode-36dca1e20419)

---

## 3. コードブロックスタイリング

### Decision
ターミナル風のコードブロックデザインを採用。コピーボタンを右上に配置し、シンタックスハイライトはダークテーマベースで実装。

### Rationale
- 開発者向けブログではコードの可読性が最重要
- コピーボタンは開発者にとって必須機能
- ターミナル風デザインは技術的な印象を強化

### Implementation Details
- 背景色: ダークグレー (#1e293b または #0f172a)
- ボーダー: シアンアクセント (#06b6d4) の微妙な境界線
- コピーボタン: 右上に配置、ホバーで表示
- フォント: ui-monospace, SF Mono, Monaco等のモノスペースフォント

### Alternatives Considered
- **ライトテーマコードブロック**: ダークモードとの統一感に欠ける
- **外部ライブラリ (Prism.js等)**: Hugo/Chroma で十分対応可能

### Sources
- [Hugo: Add Copy Button to Code Blocks](https://aaronluna.dev/blog/add-copy-button-to-code-blocks-hugo-chroma/)
- [Styling Code Blocks with CSS](https://desilvadev.com/blog/styling-code-blocks-with-css/)
- [Terminal CSS](https://terminalcss.xyz/)

---

## 4. カードデザインパターン

### Decision
グラスモーフィズム風の微妙な透明感と、ホバー時のグロー効果を組み合わせたカードデザイン。

### Rationale
- グラスモーフィズムは2025年のトレンドで、ダークモードと相性が良い
- 微妙なグロー効果はインタラクティブなフィードバックを提供
- ボーダーのハイライトは要素の区切りを明確にする

### Implementation Details
```css
/* カードホバー効果 */
.card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  backdrop-filter: blur(8px);
}
.card:hover {
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);
  transform: translateY(-2px);
}
```

### Alternatives Considered
- **フラットデザイン**: 視覚的なフィードバックが不足
- **強いドロップシャドウ**: 重たい印象を与える

### Sources
- [Web Design Trends 2025: Glassmorphism](https://blog.thegencode.com/posts/web-design-trends-2025-the-rise-of-dark-mode-and-glassmorphism)

---

## 5. ナビゲーションパターン

### Decision
スティッキーヘッダーを維持しつつ、コマンドライン風のアクセントを追加。現在位置の表示を強化。

### Rationale
- スティッキーヘッダーはナビゲーションのアクセシビリティを向上
- コマンドライン風アクセント（`>` や `$` 記号など）は技術的印象を強化
- アクティブリンクのハイライトは現在位置を明確にする

### Implementation Details
- ヘッダー背景: 半透明 + backdrop-blur
- アクティブリンク: シアンのアンダーラインまたはハイライト
- モバイルメニュー: ハンバーガーアイコンから展開

### Alternatives Considered
- **サイドバーナビゲーション**: モバイルでの使い勝手が悪い
- **非スティッキー**: ページトップへの回帰が困難

---

## 6. 日本語タイポグラフィ

### Decision
既存のNoto Sans JP設定を維持。コードブロック以外の等幅フォント使用は最小限に抑える。

### Rationale
- Noto Sans JPは日本語の可読性が高い
- 等幅フォントは英語圏では人気だが、日本語との混在で視認性が低下する可能性
- 既存の`prose-ja`クラスの行間・文字間隔設定は日本語に最適化済み

### Alternatives Considered
- **IBM Plex Sans JP**: 技術的印象があるが、Noto Sans JPほど汎用的でない
- **全面等幅フォント**: 日本語の可読性を損なう

---

## Summary

本リサーチにより、以下の方針が確定：

1. **配色**: ダークグレー背景 (#0f172a) + シアンアクセント (#06b6d4)
2. **Tailwind v4**: 既存の`@variant dark`設定を維持
3. **コードブロック**: ターミナル風 + コピーボタン
4. **カード**: グラスモーフィズム風 + ホバーグロー
5. **ナビゲーション**: スティッキー + コマンドライン風アクセント
6. **タイポグラフィ**: Noto Sans JP維持、prose-ja継続使用

すべての「NEEDS CLARIFICATION」は解決済み。Phase 1に進行可能。
