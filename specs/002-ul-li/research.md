# Research: ul/li タグマーカー表示修正

## 調査概要
箇条書きリスト（ul/li）のマーカー表示問題に関する技術調査と実装方針の決定。

## 問題分析

### 現状の問題
- **場所**: `themes/ryokosuge-theme/assets/css/main.css`
- **問題のコード** (50-61行目):
```css
.prose-ja ul,
.prose-ja ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 0;      /* ← これが原因 */
  margin-left: 0;       /* ← これが原因 */
}

.prose-ja li {
  margin-bottom: 0.5em;
  margin-left: 1.5em;
}
```

**原因**: `padding-left: 0` と `margin-left: 0` により、ブラウザデフォルトのリストマーカー表示領域が削除されている。

## CSS list-style プロパティの調査

### Decision: list-style-type の使用
**選択**: `list-style-type: square` をul要素に適用

**Rationale**:
- CSSネイティブの `square` が小さい四角（▪）に最も近い
- ブラウザ間で一貫した表示が保証される
- カスタムマーカー画像不要で軽量
- `currentColor` により自動的にテキスト色を継承

### Alternatives considered

#### 1. ::marker 疑似要素でカスタムコンテンツ
```css
.prose-ja li::marker {
  content: "▪ ";
}
```
**却下理由**:
- Safari 15未満で未サポート
- ネストレベルでの制御が複雑
- `list-style-type: square` で十分同等の見た目を実現可能

#### 2. ::before 疑似要素で完全カスタム
```css
.prose-ja li {
  list-style: none;
}
.prose-ja li::before {
  content: "▪";
  margin-right: 0.5em;
}
```
**却下理由**:
- リストセマンティクスを損なう（`list-style: none`）
- スクリーンリーダー対応が複雑化
- コード量増加

#### 3. Tailwindユーティリティクラス
```css
@apply list-square list-inside;
```
**却下理由**:
- `list-inside` はレイアウト崩れのリスク
- 既存の `.prose-ja` クラスとの統合が不自然

## 実装方針

### CSS修正内容
```css
.prose-ja ul {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;         /* 変更: マーカー表示領域確保 */
  margin-left: 0;
  list-style-type: square;     /* 追加: 四角マーカー */
}

.prose-ja ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;         /* 変更: 番号表示領域確保 */
  margin-left: 0;
  list-style-type: decimal;    /* 追加: 番号リスト明示 */
}

.prose-ja li {
  margin-bottom: 0.5em;
  margin-left: 0;              /* 変更: ul/olのpaddingで制御 */
}
```

### ネスト対応
CSSのデフォルト動作により、ネストされたul要素も親の `list-style-type: square` を継承。追加コード不要。

### ダークモード対応
`list-style-type` のマーカー色は自動的に `currentColor`（カレントテキスト色）を使用。既存のダークモード定義で自動対応。

## ブラウザ互換性

### list-style-type: square
- ✅ Chrome: 全バージョン対応
- ✅ Safari: 全バージョン対応
- ✅ Firefox: 全バージョン対応
- ✅ Edge: 全バージョン対応

**結論**: 互換性問題なし

## テスト戦略

### Visual Regression Testing
1. ローカル環境で `make server` 起動
2. 各コンテンツタイプで箇条書きを含むページを目視確認:
   - research-logs
   - daily-logs
   - english-conversation
3. 確認項目:
   - ✅ 四角マーカー表示
   - ✅ マーカーとテキスト間スペース
   - ✅ ネストリストの表示
   - ✅ ダークモード対応
   - ✅ モバイル表示

### Cross-browser Testing
- Chrome DevTools モバイルエミュレーション
- Safari (macOS)
- Firefox

## パフォーマンス影響

**結論**: 影響なし
- CSSプロパティ追加のみ（3行）
- レンダリングパフォーマンス変化なし
- ファイルサイズ増加: 約50バイト（無視できるレベル）

## リスク分析

### 低リスク
- ✅ 既存レイアウトへの影響最小（padding調整のみ）
- ✅ 後方互換性あり（CSSのみの変更）
- ✅ ロールバック容易（Git revert可能）

### 注意点
- `padding-left: 1.5em` の値は既存の `li { margin-left: 1.5em }` と同じ値を採用し、視覚的な連続性を保つ
- 将来的にデザイン変更が必要な場合、`padding-left` の値を調整

## まとめ

**実装アプローチ**: CSS `list-style-type: square` + `padding-left` 調整

**技術的決定**:
1. ✅ ネイティブCSS list-style使用（カスタムマーカー不要）
2. ✅ ブラウザ互換性完全保証
3. ✅ ダークモード自動対応
4. ✅ セマンティックHTML維持
5. ✅ パフォーマンス影響なし

**次フェーズへの引き継ぎ事項**:
- Phase 1でCSS変更の詳細仕様を data-model.md に記載
- quickstart.md でローカルテスト手順を文書化
