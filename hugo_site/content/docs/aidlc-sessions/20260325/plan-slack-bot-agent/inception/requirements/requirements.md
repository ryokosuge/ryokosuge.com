---
title: "Requirements Document: Slack Bot with Claude Agent SDK"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Intent Analysis Summary

- **User Request**: mpociot/claude-code-slack-botを参考に、bolt-js + Claude Agent SDK v2 Preview + Bun構成でSlack Botを構築
- **Request Type**: New Project（Greenfield）
- **Scope**: Multiple Components（Slack Bot + Claude Agent + セッション管理 + ストリーミング）
- **Complexity**: Moderate

---

## 技術スタック（確定）

| レイヤー | 技術 |
|---|---|
| ランタイム | Bun（最新版） |
| Slack Framework | @slack/bolt (bolt-js) |
| AI Agent | @anthropic-ai/claude-agent-sdk（v2 Preview） |
| 言語 | TypeScript |
| 接続方式 | Socket Mode（WebSocket） |

---

## Functional Requirements（機能要件）

### FR-01: Slack イベント受信
- チャンネル内での `app_mention` イベントを受信する
- @メンションされたメッセージのテキストを抽出し、Claude Agentに渡す
- ボット自身のメンション部分（`<@BOT_ID>`）をテキストから除去する

### FR-02: スレッドベースの会話管理
- @メンションがスレッド外の場合、新しいスレッドを開始して応答する
- @メンションがスレッド内の場合、同じスレッド内で応答する
- 各スレッド（`thread_ts`）に対して個別のClaude Agent SDKセッションを作成・管理する
- セッションIDとスレッドIDのマッピングを管理する

### FR-03: Claude Agent SDK v2 連携
- `unstable_v2_createSession()` で新規セッションを作成する
- `unstable_v2_resumeSession()` で既存セッションを再開する
- `session.send()` でユーザーメッセージを送信する
- `session.stream()` でClaude応答をストリーミング受信する
- セッションIDをストリームメッセージから抽出し保存する

### FR-04: ストリーミング応答表示
- Claudeの応答をストリーミングでSlackに表示する
- 初回は「考え中...」のような仮メッセージを投稿する
- ストリーミング受信に伴い `chat.update` APIでメッセージを逐次更新する
- 更新頻度を適切に制御する（Slack APIのレートリミット考慮）
- 応答完了時に最終テキストで更新する

### FR-05: エラーハンドリング
- Claude Agent SDKのエラー発生時、Slackスレッドにエラーメッセージを投稿する
- Slackイベント処理の失敗をコンソールにログ出力する
- セッション作成/再開の失敗を適切にハンドリングする

### FR-06: ツール拡張対応（将来対応、設計のみ）
- Claude Agent SDKのツール定義を追加可能なアーキテクチャにする
- ツール実行の権限承認機能を将来追加可能な設計にする

---

## Non-Functional Requirements（非機能要件）

### NFR-01: ランタイム
- Bunの最新版で動作すること
- `bun run` でアプリケーションを起動できること
- npm互換のパッケージ管理（`bun install`）を使用すること

### NFR-02: セッション管理
- `Map<thread_ts, session_id>` によるインメモリマッピング（初期実装）
- セッション管理をインターフェースで抽象化し、将来の永続化に対応可能にする

### NFR-03: ログ・モニタリング
- コンソールへの基本的なログ出力（起動、イベント受信、エラー）
- Slackでのエラー通知（該当スレッドへのエラーメッセージ投稿）

### NFR-04: 設定管理
- 環境変数による設定（`.env` ファイル対応）
  - `SLACK_BOT_TOKEN`: Slack Bot User OAuth Token
  - `SLACK_APP_TOKEN`: Slack App-Level Token
  - `SLACK_SIGNING_SECRET`: Slack Signing Secret
  - `ANTHROPIC_API_KEY`: Anthropic API Key
  - `CLAUDE_MODEL`: 使用するClaudeモデル（デフォルト値あり）

### NFR-05: コード品質
- TypeScript strict modeで開発する
- 関心の分離を意識したモジュール構成にする

### NFR-06: 開発環境
- Dev Container（`.devcontainer/`）で開発環境を構築できること
- ベースイメージはUbuntuを使用すること
- Bun、TypeScript等の必要なツールがコンテナ内にセットアップされていること
- Claude Code（Feature: `anthropics.claude-code`）をDev Container Featureとして含めること
- VS Code / Claude Code on the webからすぐに開発を開始できること

---

## Architecture Overview（アーキテクチャ概要）

```
+-------------------+     WebSocket      +-------------------+
|                   | <================> |                   |
|   Slack Platform  |   (Socket Mode)    |   Slack Bot App   |
|                   | ================> |   (Bun + bolt-js) |
+-------------------+   app_mention      +-------------------+
                                                |
                                                | send() / stream()
                                                v
                                         +-------------------+
                                         | Claude Agent SDK  |
                                         |   v2 Preview      |
                                         | (Session-based)   |
                                         +-------------------+
                                                |
                                                | API
                                                v
                                         +-------------------+
                                         |  Claude API       |
                                         |  (Anthropic)      |
                                         +-------------------+
```

### メッセージフロー

1. ユーザーがチャンネルで `@Bot メッセージ` を投稿
2. Slack Platform → Socket Mode WebSocket → bolt-js `app.event('app_mention')`
3. Bot がスレッドに「考え中...」メッセージを投稿
4. `thread_ts` から既存セッションを検索、なければ新規作成
5. `session.send(メッセージ)` → `session.stream()` でストリーミング開始
6. ストリーム受信ごとに `chat.update` でSlackメッセージを更新
7. ストリーム完了で最終メッセージを確定

### モジュール構成（想定）

```
src/
  index.ts              # エントリーポイント: bolt-js App初期化、ハンドラー接続
  config.ts             # 環境変数の読み込みと検証
  handlers/
    slack-handler.ts    # Slackイベント処理、メッセージ送信・更新
  agent/
    claude-handler.ts   # Claude Agent SDK連携、セッション管理
    session-store.ts    # セッションストア（インターフェース + インメモリ実装）
  utils/
    logger.ts           # ログユーティリティ
    message-formatter.ts # Markdown→Slack記法変換
```

---

## Constraints（制約事項）

- Claude Agent SDK v2はプレビュー版であり、APIが変更される可能性がある（すべてのエクスポートは `unstable_v2_` プレフィックス付き）
- Socket Modeアプリはslack Marketplaceに公開不可
- Slack APIのレートリミット（`chat.update` の頻度制御が必要）
- 単一ワークスペースのみ対応

---

## Out of Scope（対象外）

- DM対応
- スラッシュコマンド対応
- 本番環境へのデプロイ
- セッション永続化の実装（インターフェースのみ設計）
- 非アクティブセッションのタイムアウト・クリーンアップ
- ツール実行の権限承認機能の実装（将来追加可能な設計のみ）
- セキュリティルールの強制適用
- マルチワークスペース対応
