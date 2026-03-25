---
title: "Components"
date: 2026-03-25T00:00:00+09:00
draft: false
---
# Components

## C1: SlackAdapter

**Purpose**: Slack APIとの接続・イベント処理を担当するアダプター層

**Responsibilities**:
- Slack Socket Mode接続の確立・維持
- Slackイベント（メンション、DM、スレッド返信）の受信とパース
- メッセージをChatEngineに渡す正規化済みリクエストへ変換
- AIの応答をSlackメッセージ形式に変換して送信
- タイピングインジケータの制御
- Slack再接続・エラーハンドリング

**Technology**: `@chat-adapter/slack`

**Interface**:
- Input: Slack WebSocket events
- Output: 正規化されたメッセージリクエスト → ChatEngine
- Output: Slackメッセージ応答 ← ChatEngine

**将来の拡張点**: Socket Mode → Events API (HTTP) への切り替え（マルチワークスペース対応時）

---

## C2: ChatEngine

**Purpose**: チャットフローの中心的なオーケストレーションを行うコアコンポーネント

**Responsibilities**:
- SlackAdapterからのリクエストを受け取り処理フローを制御
- StateManagerを通じた会話コンテキストのロード・保存
- AgentRouterへのルーティング委譲
- エージェント応答の受け取りとSlackAdapterへの返却
- エラーハンドリング（固定メッセージ応答）

**Technology**: `vercel/chat` SDK (chat パッケージ)

**Interface**:
- Input: 正規化メッセージリクエスト（SlackAdapterから）
- Output: AI応答テキスト → SlackAdapter
- Depends: StateManager, AgentRouter

---

## C3: AgentRouter

**Purpose**: ユーザーメッセージの内容を分析し、適切なエージェントにルーティング

**Responsibilities**:
- LLMベースのメッセージ分類（会話 vs コード調査）
- 分類結果に基づくエージェント選択
- ルーティング判断のログ出力

**Technology**: Claude API（分類用の軽量プロンプト）

**Interface**:
- Input: ユーザーメッセージ + 会話コンテキスト
- Output: ルーティング先エージェント種別（conversation | code_investigation）

**ルーティング判断基準**:
- コード関連キーワード・意図を検出 → CodeInvestigationAgent
- 一般的な質問・会話 → ConversationAgent

---

## C4: ConversationAgent

**Purpose**: 一般的な会話・質問応答を担当するAIエージェント

**Responsibilities**:
- 自然言語での質問応答
- 会話コンテキストを踏まえた応答生成
- 指示語（「それ」「さっきの」等）の解釈

**Technology**: Claude Agent SDK

**Interface**:
- Input: ユーザーメッセージ + 会話履歴
- Output: AI応答テキスト

---

## C5: CodeInvestigationAgent

**Purpose**: コード調査・ファイル検索を担当するAIエージェント

**Responsibilities**:
- ファイル検索（ファイル名・パターンによる検索）
- コード読み取り（指定ファイルの内容取得）
- コードに基づいた質問応答
- ツール実行結果の自然言語での説明

**Technology**: Claude Agent SDK + Claude Code ネイティブツール

**Interface**:
- Input: ユーザーメッセージ + 会話履歴
- Output: AI応答テキスト（ツール実行結果を含む）

---

## C6: StateManager

**Purpose**: 会話状態の永続化とコンテキスト管理

**Responsibilities**:
- スレッド単位の会話履歴のRedis保存・取得
- DM会話の状態管理
- コンテキストのシリアライズ・デシリアライズ
- Redis接続の管理（接続プール、再接続）

**Technology**: `@chat-adapter/state-redis` + Redis

**Interface**:
- Input: スレッドID / チャンネルID + メッセージ
- Output: 会話履歴（メッセージ配列）
- Storage: Redis

---

## C7: HealthCheckServer

**Purpose**: アプリケーションの死活監視用HTTPエンドポイント

**Responsibilities**:
- `/health` HTTPエンドポイントの提供
- Slack接続状態のチェック
- Redis接続状態のチェック
- 正常時200、異常時5xxの返却

**Technology**: Bun HTTP server（軽量）

**Interface**:
- Input: HTTP GET `/health`
- Output: JSON `{ status: "ok" | "degraded" | "error", slack: boolean, redis: boolean }`

---

## C8: Logger

**Purpose**: 構造化ログの出力

**Responsibilities**:
- JSON形式での標準出力へのログ出力
- コンテキスト情報の付与（requestId, userId, channelId）
- ログレベル制御（info / warn / error）
- エラー時のスタックトレース記録

**Technology**: 軽量ログライブラリ（pino等）またはカスタム実装

**Interface**:
- Input: ログレベル + メッセージ + コンテキストオブジェクト
- Output: JSON形式の標準出力
