---
title: "Unit of Work — Story Map"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## ストーリー → ユニット マッピング

| Story ID | Story Title | Unit |
|---|---|---|
| US-1.1 | メンションによるボット呼び出し | Unit 1: Core Bot |
| US-1.2 | スレッド内での継続会話 | Unit 1: Core Bot |
| US-1.3 | ダイレクトメッセージでの対話 | Unit 1: Core Bot |
| US-2.1 | 自然言語での質問と回答 | Unit 1: Core Bot + Unit 2: AI Agents |
| US-2.2 | コンテキストを保持した会話 | Unit 1: Core Bot (StateManager) |
| US-3.1 | ファイル検索 | Unit 2: AI Agents |
| US-3.2 | コード読み取り | Unit 2: AI Agents |
| US-3.3 | ツール実行結果の提示 | Unit 2: AI Agents |
| US-4.1 | タスク種類に応じた自動ルーティング | Unit 2: AI Agents |
| US-5.1 | 会話履歴の永続化 | Unit 1: Core Bot |
| US-5.2 | スレッド単位のコンテキスト分離 | Unit 1: Core Bot |
| US-6.1 | ヘルスチェック | Unit 3: Infrastructure |
| US-6.2 | 構造化ログ出力 | Unit 3: Infrastructure |

## ユニット → ストーリー マッピング

### Unit 1: Core Bot（7ストーリー）
| Story | Feature | Priority |
|---|---|---|
| US-1.1 | Slack Bot基本機能 | 必須 |
| US-1.2 | Slack Bot基本機能 | 必須 |
| US-1.3 | Slack Bot基本機能 | 必須 |
| US-2.1 | シンプルな会話（部分） | 必須 |
| US-2.2 | コンテキスト保持 | 必須 |
| US-5.1 | 会話履歴永続化 | 必須 |
| US-5.2 | コンテキスト分離 | 必須 |

### Unit 2: AI Agents（5ストーリー）
| Story | Feature | Priority |
|---|---|---|
| US-2.1 | シンプルな会話（部分） | 必須 |
| US-3.1 | ファイル検索 | 必須 |
| US-3.2 | コード読み取り | 必須 |
| US-3.3 | ツール実行結果提示 | 必須 |
| US-4.1 | 自動ルーティング | 必須 |

### Unit 3: Infrastructure（2ストーリー）
| Story | Feature | Priority |
|---|---|---|
| US-6.1 | ヘルスチェック | 必須 |
| US-6.2 | 構造化ログ | 必須 |

## カバレッジ確認
- **全ストーリー数**: 13
- **マッピング済み**: 13（US-2.1はUnit 1 + Unit 2に跨る）
- **未割当**: なし
