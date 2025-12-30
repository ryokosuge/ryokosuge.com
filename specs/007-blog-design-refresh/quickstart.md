# Quickstart: ブログデザインリフレッシュ

**Date**: 2025-12-29
**Feature**: 007-blog-design-refresh

---

## Prerequisites

- Docker Desktop (devcontainer用)
- devcontainer CLI: `npm install -g @devcontainers/cli`
- Git

---

## 開発環境セットアップ

### 1. リポジトリクローン

```bash
git clone https://github.com/ryokosuge/ryokosuge.com.git
cd ryokosuge.com
```

### 2. サブモジュール初期化

```bash
make submodule
# または
git submodule update --init --recursive
```

### 3. 開発サーバー起動

```bash
# Docker devcontainer経由 (推奨)
make server

# ローカルHugo (Hugo インストール済みの場合)
make server-local
```

サーバーは `http://localhost:1313` で起動します。

---

## ファイル構造

```
themes/ryokosuge-theme/
├── assets/css/main.css        # ← 主なスタイル変更箇所
├── layouts/
│   ├── _default/
│   │   ├── baseof.html        # ベーステンプレート
│   │   ├── list.html          # 一覧ページ
│   │   └── single.html        # 記事詳細
│   ├── partials/
│   │   ├── header.html        # ヘッダー
│   │   ├── navigation.html    # ナビゲーション
│   │   ├── post-card.html     # 記事カード
│   │   └── dark-mode-toggle.html
│   └── index.html             # トップページ
├── tailwind.config.js         # Tailwind設定
└── package.json               # npm依存関係
```

---

## 開発ワークフロー

### CSS変更

1. `themes/ryokosuge-theme/assets/css/main.css` を編集
2. Hugoがホットリロードで反映
3. ブラウザで確認

### Tailwind設定変更

1. `themes/ryokosuge-theme/tailwind.config.js` を編集
2. 開発サーバー再起動が必要な場合あり

### レイアウト変更

1. `themes/ryokosuge-theme/layouts/` 配下のファイルを編集
2. Hugoが自動リロード

---

## テスト方法

### 目視確認項目

- [ ] トップページの表示
- [ ] 記事一覧ページ (各カテゴリ)
- [ ] 記事詳細ページ
- [ ] ダークモード切替
- [ ] モバイル表示 (DevTools)
- [ ] コードブロックの表示

### Lighthouse テスト

```bash
# Chrome DevToolsで実行
# Performance, Accessibility, Best Practices をチェック
```

### コントラスト確認

- WCAG 2.1 AA: 4.5:1 以上
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 主な変更ファイル

### Phase 1: 基盤スタイル

| ファイル | 変更内容 |
|----------|----------|
| `tailwind.config.js` | カラーパレット追加 |
| `assets/css/main.css` | CSS変数、基本スタイル |

### Phase 2: コンポーネント

| ファイル | 変更内容 |
|----------|----------|
| `partials/header.html` | ヘッダーデザイン |
| `partials/navigation.html` | ナビゲーション + モバイルメニュー |
| `partials/post-card.html` | カードデザイン |
| `partials/dark-mode-toggle.html` | トグルボタン |

### Phase 3: ページレイアウト

| ファイル | 変更内容 |
|----------|----------|
| `index.html` | トップページ |
| `_default/list.html` | 一覧ページ |
| `_default/single.html` | 記事詳細 |

---

## トラブルシューティング

### スタイルが反映されない

```bash
# キャッシュクリア
make stop && make server
```

### Tailwindクラスが効かない

- `tailwind.config.js` の `content` パスを確認
- `safelist` に追加が必要な場合あり

### ダークモードが切り替わらない

- `localStorage` をクリア
- `dark-mode-script.html` の読み込み順を確認

---

## 参考リンク

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [デザイントークン定義](./data-model.md)
- [コンポーネント仕様](./contracts/components.md)
