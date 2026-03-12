# CLAUDE.md

## プロジェクト概要

Hugo製の個人ブログサイト（ryokosuge.com）。カスタムテーマ + Tailwind CSS 4.1 + PostCSS で構築。

## 開発コマンド

```bash
# 依存パッケージのインストール（テーマディレクトリで実行）
cd themes/ryokosuge-theme && npm install

# 開発サーバー起動
hugo server -D

# 本番ビルド
hugo --minify

# 新しいコンテンツ作成
hugo new content/<section>/<slug>.md
```

## アーキテクチャ

- **SSG**: Hugo（Extended版）
- **テーマ**: `themes/ryokosuge-theme/`（カスタムテーマ）
- **CSS**: Tailwind CSS 4.1 + PostCSS（`@tailwindcss/postcss` プラグイン）
- **設定**: `config.yaml`
- **デプロイ**: GitHub Actions → S3 + CloudFront（`deploy.yml`）

## ディレクトリ構成

```
config.yaml                      # Hugo設定
content/                         # コンテンツ（Markdown）
  daily-logs/                    # 日報
  conversations/                 # 会話記録
  research/                      # 調査メモ
  english/                       # 英語学習
themes/ryokosuge-theme/          # カスタムテーマ
  package.json                   # Node.js依存管理（Tailwind等）
  postcss.config.js              # PostCSS設定
  tailwind.config.js             # Tailwind設定
  assets/css/main.css            # メインCSS
  layouts/                       # Hugoテンプレート
.github/workflows/deploy.yml    # CI/CDパイプライン
```

## package.json の構成

Node.js依存（Tailwind CSS, PostCSS等）はテーマディレクトリ（`themes/ryokosuge-theme/`）で管理。rootには `package.json` は置かない。

CI/CDでも `working-directory: themes/ryokosuge-theme` で `npm install` を実行する。

## コンテンツ規約

記事の文体は `ARTICLE_STYLE_GUIDE.md` を参照。要点：
- 「です・ます調」で統一
- 口語表現を避け、専門性を保つ
- 体験談ベースの親しみやすさを維持

## デプロイ

`main` ブランチへのpushで自動デプロイ（GitHub Actions）:
1. `npm install`（テーマディレクトリ）
2. `hugo --minify`
3. S3へsync
4. CloudFrontキャッシュ無効化
