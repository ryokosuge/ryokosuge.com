# Quickstart: ページ全体の余白統一

**Feature**: 001-fix-page-spacing
**Date**: 2025-11-25

## 概要

このドキュメントは、ブログサイト全体の余白を統一するための修正手順を説明します。

## 前提条件

- Hugo開発環境がセットアップ済み
- `make server`または`hugo server -D`が実行可能

## 修正対象ファイル

```
themes/ryokosuge-theme/layouts/
├── _default/
│   ├── list.html      # 修正必須
│   └── single.html    # 修正必須
├── index.html         # 修正必須
└── partials/
    ├── header.html    # 修正必須
    └── footer.html    # 修正必須
```

## 修正パターン

### 統一するクラス

**Before（不統一）**:
```html
<!-- list.html, footer.html -->
<div class="max-w-4xl mx-auto px-4 ...">

<!-- index.html, single.html, header.html -->
<div class="max-w-5xl mx-auto px-4 ...">
```

**After（統一）**:
```html
<!-- 全ファイル共通 -->
<div class="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 ...">
```

### レスポンシブ余白

| 画面サイズ | ブレークポイント | 左右padding |
|-----------|----------------|-------------|
| モバイル | < 768px | 16px (`px-4`) |
| タブレット | ≥ 768px | 32px (`md:px-8`) |
| デスクトップ | ≥ 1024px | 48px (`lg:px-12`) |

## 修正手順

### 1. list.html

```diff
-<div class="max-w-4xl mx-auto px-4 py-12">
+<div class="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-12">
```

### 2. footer.html

```diff
-<div class="max-w-4xl mx-auto px-4 py-8">
+<div class="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-8">
```

### 3. index.html

```diff
-<div class="max-w-5xl mx-auto px-4 py-16">
+<div class="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-16">
```

### 4. single.html

```diff
-<article class="max-w-5xl mx-auto px-4 py-12">
+<article class="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-12">
```

### 5. header.html

```diff
-<div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
+<div class="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-4 flex items-center justify-between">
```

## 確認手順

### ローカルプレビュー

```bash
make server
# または
hugo server -D
```

### 確認項目チェックリスト

- [ ] トップページの左右余白が均等
- [ ] 記事一覧ページの余白がトップページと一致
- [ ] 個別記事ページの余白がトップページと一致
- [ ] ヘッダーとコンテンツの左端が揃っている
- [ ] フッターとコンテンツの左端が揃っている
- [ ] ページ遷移時にコンテンツ位置がジャンプしない
- [ ] モバイル表示（375px）で余白が適切
- [ ] タブレット表示（768px）で余白が適切
- [ ] デスクトップ表示（1024px以上）で余白が広い

### ブラウザDevToolsでの確認

1. DevToolsを開く（F12 または Cmd+Option+I）
2. 要素を選択してComputed Stylesを確認
3. padding-left/rightが期待値と一致するか確認

## トラブルシューティング

### 余白が変わらない場合

- ブラウザキャッシュをクリア
- Hugo serverを再起動
- Tailwindのビルドが完了しているか確認

### 特定のページだけ異なる場合

- そのページ専用のテンプレートがないか確認
- `layouts/`ディレクトリに追加のオーバーライドがないか確認
