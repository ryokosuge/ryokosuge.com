# Plan: Hugo Bookテーマ → Docsyテーマへの移行（Hugo Modules使用）

## Context

現在 `hugo_site/` にある Hugo サイトは `hugo-book` テーマを git submodule で管理しているが、submodule ディレクトリが空で機能していない。Google Docsy テーマに Hugo Modules を使って切り替える。

## 現在の環境

- **devcontainer**: `mcr.microsoft.com/devcontainers/base:ubuntu` ベースイメージ
  - Hugo extended 0.158.0（install.sh で手動インストール）→ **go get -tool に移行**
  - Bun（JS ランタイム）
  - **Go 未インストール** → **devcontainer feature で追加**
  - `git submodule update --init --recursive` で hugo-book 取得（削除予定）

## ツール管理方針

| ツール | 管理方法 |
|--------|----------|
| Go | devcontainer feature (`ghcr.io/devcontainers/features/go:1`) |
| Hugo | `go get -tool` で go.mod に記録 |
| SCSS | Dart Sass（`sass-embedded` を bun で管理）— LibSass 非推奨のため |
| PostCSS | bun で管理（postcss, postcss-cli, autoprefixer） |

## 実装ステップ

### Step 1: devcontainer の更新

**対象ファイル**: `.devcontainer/devcontainer.json`, `.devcontainer/install.sh`

devcontainer.json:
- Go を feature で追加

install.sh:
- Hugo の手動インストール（curl + dpkg）を**削除**（go get -tool に移行）
- `git submodule update --init --recursive` を**削除**
- 代わりに `cd hugo_site && go tool github.com/gohugoio/hugo version`（Hugo のダウンロード確認）を追加
- `cd hugo_site && bun install` を追加

### Step 2: hugo-book submodule の削除

**対象ファイル**: `/.gitmodules`, `hugo_site/themes/`

```bash
git submodule deinit -f hugo_site/themes/hugo-book
git rm -f hugo_site/themes/hugo-book
```

`.gitmodules` が空になれば削除。

### Step 3: Hugo Modules の初期化 + Hugo をツール依存に追加

```bash
cd hugo_site
hugo mod init github.com/ryokosuge/ryokosuge.com
go get -tool github.com/gohugoio/hugo@v0.158.0
```

→ `go.mod` に Hugo の `tool` ディレクティブが追加される。

**注意**: Hugo v0.155.3+ は Go 1.25+ を要求する。Go 1.24 環境では v0.147.0 が動作確認済み。devcontainer の Go feature バージョンを合わせること。

### Step 4: PostCSS + Dart Sass 依存関係のセットアップ（Bun使用）

```bash
cd hugo_site
bun init -y
bun add -d postcss postcss-cli autoprefixer sass-embedded
```

### Step 5: hugo.toml の更新

**対象ファイル**: `hugo_site/hugo.toml`

- `theme = "hugo-book"` を削除
- hugo-book 固有 params を削除
- `[module]` セクション追加（Docsy import）
- Docsy 向け `[params.ui]` 追加

```toml
baseURL = "https://ryokosuge.com/"
languageCode = "ja"
title = "ryokosuge.com"
contentDir = "docs"

[module]
  proxy = "direct"
  [module.hugoVersion]
    min = "0.155.3"
  [[module.imports]]
    path = "github.com/google/docsy"
  [[module.imports]]
    path = "github.com/google/docsy/dependencies"

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

[params]
  description = "AIDLC ワークフローによる開発ドキュメントアーカイブ"

[params.ui]
  sidebar_menu_compact = true
  sidebar_menu_foldable = true
  ul_show = 2

# 内部ファイルをビルドから除外
ignoreFiles = ["audit\\.md$", "aidlc-state\\.md$"]
```

※ `extended = true` は削除（Dart Sass を使うため extended ビルド不要）

### Step 6: Docsy モジュールの取得

```bash
cd hugo_site
go tool github.com/gohugoio/hugo mod get -u
go tool github.com/gohugoio/hugo mod tidy
```

※ Hugo を go tool 経由で実行

### Step 7: SCSS カスタマイズの移行

**削除**: `assets/_custom.scss`, `assets/_variables.scss`
**作成**: `assets/scss/_variables_project.scss`, `assets/scss/_styles_project.scss`

- `--font-size: 20px` → `$font-size-base: 1.25rem`
- `$menu-width` → Docsy の変数名をモジュール取得後に確認

### Step 8: コンテンツの front matter 更新

- `docs/_index.md` に `type: docs` を追加
- 各ファイルから `bookCollapseSection` を削除

### Step 9: .gitignore の更新

`hugo_site/node_modules/` を追加。

### Step 10: Makefile の更新

Hugo コマンドを `go tool github.com/gohugoio/hugo` 経由に変更:

```makefile
HUGO := go tool github.com/gohugoio/hugo

serve:
	$(HUGO) server

build:
	$(HUGO)

clean:
	rm -rf public resources

mod-update:
	$(HUGO) mod get -u
	$(HUGO) mod tidy
```

### Step 11: ビルド確認

`go tool github.com/gohugoio/hugo server` でビルドエラーなし・表示確認。

### Step 12: コミット & プッシュ

ブランチ `claude/add-docsy-theme-mCazu` にコミット・プッシュ。

## 実装途中の状態

以下は既にこのブランチで実施済み：

- [ ] Step 1: devcontainer 更新
- [ ] Step 2: hugo-book submodule 削除
- [ ] Step 3: Hugo Modules 初期化 + Hugo を go tool に追加
- [ ] Step 4: PostCSS + Dart Sass セットアップ
- [ ] Step 5: hugo.toml 更新
- [ ] Step 6: Docsy モジュール取得
- [ ] Step 7: SCSS カスタマイズ移行
- [ ] Step 8: コンテンツ front matter 更新
- [ ] Step 9: .gitignore 更新
- [ ] Step 10: Makefile 更新
- [ ] Step 11: ビルド確認
- [ ] Step 12: コミット & プッシュ

## 注意点

- **`contentDir = "docs"` の互換性**: Docsy は通常 `content/docs/` を想定。問題があれば構造変更が必要
- **深いネスト**: 5-6階層 → `sidebar_menu_foldable` + `ul_show` の調整が必要な可能性
- **Bun と PostCSS の互換性**: 問題があれば npm にフォールバック
- **Dart Sass**: `sass-embedded` は Hugo が PATH 上の `sass` を自動検出する。bun でインストールした場合 `node_modules/.bin/sass` に配置されるため、PATH に含める必要がある可能性あり
- **Hugo バージョンと Go バージョンの関係**: Hugo v0.155.3+ は Go 1.25+ を要求する。`GOPROXY=direct` の設定が必要な環境あり
