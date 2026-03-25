---
title: "Tech Stack Decisions: Slack Bot"
date: 2026-03-25T00:00:00+09:00
draft: false
---

# Tech Stack Decisions: Slack Bot

## 確定済み技術スタック

| レイヤー | 技術 | バージョン | 選定理由 |
|---|---|---|---|
| ランタイム | Bun | 最新版 | ユーザー指定。高速な起動・実行、TypeScriptネイティブサポート |
| Slack Framework | @slack/bolt (bolt-js) | 最新版 | ユーザー指定。Socket Mode対応、公式フレームワーク |
| AI Agent | @anthropic-ai/claude-agent-sdk | v2 Preview | ユーザー指定。セッションベースのマルチターン会話 |
| 言語 | TypeScript | 最新版 | ユーザー指定。strict mode使用 |
| 接続方式 | Socket Mode | - | WebSocket接続、Marketplaceに公開しないプライベートBot向け |

---

## 技術的判断

### TD-01: パッケージマネージャー
- **選定**: `bun install`（Bun内蔵）
- **理由**: Bun使用時は専用パッケージマネージャーが最適。npm互換

### TD-02: 環境変数管理
- **選定**: Bunの`.env`自動読み込み
- **理由**: Bunは`.env`ファイルをネイティブでサポート。`dotenv` パッケージ不要

### TD-03: Markdown → Slack mrkdwn変換
- **選定**: 自前実装（軽量なユーティリティ関数）
- **理由**: 変換ルールが限定的（太字、斜体、リンク、見出し程度）であり、外部ライブラリは過剰。テストも容易

### TD-04: ログ出力
- **選定**: `console.log` / `console.error` ベースの軽量ラッパー
- **理由**: 初期実装では構造化ログフレームワークは不要。将来必要になれば差し替え可能

### TD-05: テストフレームワーク
- **選定**: `bun:test`（Bun内蔵テストランナー）
- **理由**: Bun環境に最適。追加パッケージ不要。Jest互換API

---

## 外部依存パッケージ（想定）

| パッケージ | 用途 |
|---|---|
| `@slack/bolt` | Slackイベント処理、WebSocket接続 |
| `@anthropic-ai/claude-agent-sdk` | Claude Agent SDK v2 Preview |

**Note**: 依存パッケージは最小限に抑える方針。Bunの内蔵機能（`.env`読み込み、テストランナー）を活用。
