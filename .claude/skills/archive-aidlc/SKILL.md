---
name: archive-aidlc
description: Move aidlc-docs/ into hugo_site/docs/aidlc-sessions/<date>/<name>/ for archival
disable-model-invocation: true
---

## Task

`aidlc-docs/` ディレクトリを `hugo_site/docs/aidlc-sessions/<日付>/<名前>/` 配下に移動してアーカイブする。

## Steps

1. `aidlc-docs/` ディレクトリが存在するか確認する。存在しない場合はエラーメッセージを表示して終了する。
2. `aidlc-docs/` の内容からアーカイブ名を決定する:
   - `aidlc-docs/audit.md` を読み、最初の **User Input** エントリを探す
   - 見つかった場合、そのユーザーリクエストの内容を要約して **英語のkebab-case** で短い名前（2〜4単語）を生成する（例: `add-auth-api`, `refactor-payment-service`）
   - `audit.md` が無い場合やUser Inputが見つからない場合は `aidlc-docs/aidlc-state.md` の **Project Type** (greenfield/brownfield) を名前に使う
   - どちらも無い場合は `unnamed` を使う
3. 現在のタイムスタンプを `YYYYMMDD` 形式で取得する。
4. 移動先ディレクトリパスを `hugo_site/docs/aidlc-sessions/<timestamp>/<name>` とする（例: `hugo_site/docs/aidlc-sessions/20260312/add-auth-api`）。
5. `hugo_site/docs/aidlc-sessions/` ディレクトリが存在しない場合は作成し、`_index.md` を生成する:
     ```yaml
     ---
     title: "AIDLC Sessions"
     description: "AIDLC ワークフローによる開発セッションアーカイブ"
     bookCollapseSection: true
     ---
     ```
   - `hugo_site/docs/aidlc-sessions/<timestamp>/` ディレクトリが存在しない場合は作成する。
6. `aidlc-docs/` を移動先に移動する（`mv aidlc-docs/ hugo_site/docs/aidlc-sessions/<timestamp>/<name>/`）。
7. 移動したディレクトリ内の全 `.md` ファイルに Hugo front matter を付与する:
   - 対象: `audit.md`, `aidlc-state.md`, `_index.md` **以外**の全 `.md` ファイル
   - 既に front matter（`---` で始まる）があるファイルはスキップ
   - front matter 内容:
     ```yaml
     ---
     title: "<ファイル内の最初の # 見出し、無ければファイル名から生成>"
     date: <タイムスタンプから ISO 8601 形式で生成（例: 2026-03-12T00:00:00+09:00）>
     draft: false
     ---
     ```
   - `audit.md` と `aidlc-state.md` には Hugo ビルドから除外する front matter を付与:
     ```yaml
     ---
     _build:
       render: never
       list: never
     ---
     ```
8. `_index.md` ファイルを生成する:
   - **日付ディレクトリ**: `hugo_site/docs/aidlc-sessions/<timestamp>/_index.md`（既に存在する場合はスキップ）
     ```yaml
     ---
     title: "<YYYY-MM-DD>"
     date: <ISO 8601>
     bookCollapseSection: true
     ---
     ```
   - **セッションルート**: `hugo_site/docs/aidlc-sessions/<timestamp>/<name>/_index.md`
     ```yaml
     ---
     title: "<Name Title Case>"
     date: <ISO 8601>
     description: "AIDLC セッション: <Name Title Case>"
     bookCollapseSection: true
     ---
     ```
   - **inception / construction ディレクトリ**: weight を付与（inception: 1, construction: 2）
   - **サブディレクトリ**: 兄弟ディレクトリ間のアルファベット順で weight を付与、`bookCollapseSection: true`
   - 既存の `_index.md` はスキップ
9. **セッションルートの `_index.md` にページリンク一覧を生成する**:
   - セッション内の全 `.md` ファイル（`_index.md`, `audit.md`, `aidlc-state.md` を除く）を走査し、各ファイルの front matter から `title` を取得する
   - フェーズ（Inception / Construction）ごとにセクション見出し（`##`）でグルーピングする
   - さらにサブディレクトリ（requirements, user-stories, plans 等）ごとにサブ見出し（`###`）でグルーピングする
   - 各ページへのリンクは Hugo の `relref` ショートコードを使う:
     ```markdown
     - [Requirements Document]({{</* relref "inception/requirements/requirements" */>}})
     ```
   - リンク一覧はセッションルート `_index.md` の front matter の後に追記する
10. 移動完了後、結果を報告する:
   - 移動先パス
   - 含まれるファイル数
