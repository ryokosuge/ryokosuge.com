# Quickstart Guide: Claude Conversation Logs

このガイドでは、`/save-conversation`スラッシュコマンドを使った会話ログ保存の使い方を説明します。

## 前提条件

- Claude Codeがインストールされていること
- このリポジトリがローカルにクローンされていること
- ryokosuge-themeカスタムテーマが`themes/`ディレクトリに存在していること
- Hugoがインストールされていること

## 30秒でわかる使い方

```
1. Claude Codeで会話する
2. /save-conversation を実行
3. 完了！
```

それだけです！タイトル・要約・タグは自動生成されます。

## 詳しい使い方

### 1. Claude Codeで会話

普通にClaude Codeと会話してください。例えば：

```
あなた: TypeScriptの型システムについて教えてください

Claude: TypeScriptの型システムは...

あなた: ジェネリクスの使い方は？

Claude: ジェネリクスは...

（会話が続く）
```

### 2. 会話を保存

良い会話ができたと思ったら、コマンドを実行：

```
/save-conversation
```

### 3. 自動で処理される

コマンドを実行すると、以下が自動的に行われます：

✅ **会話履歴を取得** - 現在のセッション全体を取得
✅ **AIが分析** - タイトル・要約・タグを自動生成
✅ **ファイル作成** - `content/conversations/[ランダムID].md`を作成
✅ **完了通知** - ファイルパスとタイトルを表示

**実行例**：

```
$ /save-conversation

✓ 会話を保存しました！

ファイル: content/conversations/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6.md
タイトル: TypeScriptの型システムとジェネリクスについて
タグ: TypeScript, 型システム, ジェネリクス, プログラミング

ローカルでプレビュー: make server
```

### 4. 生成された内容を確認

自動生成されたファイルを開いてみましょう：

```markdown
---
date: 2025-11-14T10:30:00+09:00
draft: false
title: "TypeScriptの型システムとジェネリクスについて"
description: "TypeScriptの型システムの基本とジェネリクスの使い方について議論。型安全性とコードの再利用性を向上させる方法を学んだ。"
tags:
  - TypeScript
  - 型システム
  - ジェネリクス
  - プログラミング
---

## 会話ログ

### 2025-11-14 10:15:32

**User**: TypeScriptの型システムについて教えてください

**Claude**: TypeScriptの型システムは...

### 2025-11-14 10:17:45

**User**: ジェネリクスの使い方は？

**Claude**: ジェネリクスは...

（会話が時系列で続く）
```

**すべて自動生成されています！**

### 5. ローカルでプレビュー

```bash
make server

# または
hugo server -D
```

ブラウザで `http://localhost:1313/conversations/` を開くと、新しい会話ログが表示されます。

### 6. 公開

```bash
# 変更をコミット
git add content/conversations/
git commit -m "feat: TypeScript型システムの会話ログを追加"

# リモートにプッシュ
git push origin <ブランチ名>
```

## よくある使い方

### 複数の会話を保存

同じセッションで `/save-conversation` を複数回実行すると、それぞれ別のファイルが作成されます（異なるランダムID）。

```
会話A → /save-conversation → file1.md
会話B → /save-conversation → file2.md
会話C → /save-conversation → file3.md
```

### 会話ログ一覧を見る

ブラウザで `/conversations/` にアクセスすると、すべての会話ログが新しい順に表示されます。

### タグで絞り込む

自動生成されたタグは、自動的にタグページが生成されます：

- `/tags/typescript/` - "TypeScript"タグの記事一覧
- `/tags/` - すべてのタグ一覧

## 生成される内容の詳細

### タイトル

- **生成方法**: AIが会話全体を分析し、主題を1文で要約
- **文字数**: 30-60文字が目安
- **例**: "Hugoでブログを構築する方法"

### 要約（description）

- **生成方法**: AIが会話の重要ポイントを抽出して2-3文で要約
- **文字数**: 100-200文字が目安
- **例**: "静的サイトジェネレータHugoを使ったブログ構築について議論。テーマ選択、コンテンツ管理、デプロイ方法を検討した。"

### タグ

- **生成方法**: AIが会話からキーワードを抽出
- **個数**: 3-5個
- **優先度順**: 重要な順に並べられる
- **例**: `[Hugo, 静的サイト, ブログ, Web開発]`

### 会話ログ

- **形式**: 時系列
- **区切り**: 各メッセージペアごとに見出し
- **タイムスタンプ**: `YYYY-MM-DD HH:MM:SS`
- **発言者**: `**User**:` と `**Claude**:`で区別

## トラブルシューティング

### `/save-conversation` が見つからない

- `.claude/commands/save-conversation.md` が正しく配置されているか確認
- Claude Codeを再起動してみてください

### 会話が空の場合

エラーメッセージが表示され、ファイルは作成されません：

```
エラー: 保存する会話がありません
少なくとも1つのメッセージペアが必要です
```

### タイトルや要約が期待と異なる

AI生成なので、完璧ではない場合があります。生成後に手動で編集することも可能です（ただし、初期仕様では自動生成のみ）。

### 日本語が文字化けする

- ファイルがUTF-8エンコーディングで保存されているか確認
- Hugoの `config.yaml` に以下が設定されているか確認:
  ```yaml
  defaultContentLanguage: ja
  ```

## 次のステップ

- [仕様書 (spec.md)](./spec.md) - 機能の詳細仕様
- [データモデル (data-model.md)](./data-model.md) - データ構造の詳細
- [実装計画 (plan.md)](./plan.md) - 技術的な実装詳細

## チートシート

```bash
# 会話を保存
/save-conversation

# ローカルプレビュー
make server
# または
hugo server -D

# ビルド（本番用）
hugo

# Git操作
git add content/conversations/
git commit -m "feat: 会話ログを追加"
git push
```

## 比較: 他のコンテンツタイプとの違い

| 機能 | Daily Logs | Research Logs | **Conversations** |
|------|-----------|---------------|------------------|
| 作成コマンド | `/daily` | `/research` | **`/save-conversation`** |
| 入力方法 | インタビュー形式 | Web検索+まとめ | **完全自動** |
| タイトル | 手動入力 | 手動入力 | **AI自動生成** |
| タグ | 手動入力 | 手動入力 | **AI自動生成** |
| 内容 | 日報 | 調査結果 | **会話履歴** |

## 参考情報

- [Hugo公式ドキュメント](https://gohugo.io/documentation/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Markdown記法チートシート](https://www.markdownguide.org/cheat-sheet/)
