---
title: "Requirements Document: AI Agent 電話会話 PoC"
date: 2026-03-16T00:00:00+09:00
draft: false
---
## Intent Analysis Summary

- **User Request**: AI Agentに電話を掛けさせて会話ができるようなPoCを作りたい
- **Request Type**: New Project (Greenfield)
- **Scope Estimate**: Multiple Components（AI Agent、テレフォニー、WebSocket中継、会話管理）
- **Complexity Estimate**: Moderate（PoCだが複数サービスのリアルタイム統合が必要）
- **Deployment Target**: ローカル開発環境のみ

## Technology Stack (推奨)

| カテゴリ | 技術 | 選定理由 |
|---|---|---|
| LLM + STT + TTS | OpenAI Realtime API | 音声入出力とLLM推論が一体化。低遅延でリアルタイム双方向会話に最適。日本語対応。 |
| テレフォニー | Twilio | Media Streams (WebSocket) で音声ストリームを中継可能。日本語電話番号対応。開発者向けドキュメントが充実。 |
| バックエンド | TypeScript (Node.js) | Twilio・OpenAI SDK の親和性が高い。WebSocket処理に強い。型安全。 |
| ローカルトンネル | ngrok 等 | Twilio からのWebhookをローカルサーバーに転送するため。 |

## Functional Requirements

### FR-1: 電話発信機能
- システムがTwilio APIを使用して指定の電話番号に発信できること
- 発信時にTwiMLで通話をWebSocket Media Streamに接続すること

### FR-2: リアルタイム音声ストリーミング
- Twilio Media Streams からの音声データ（mulaw/8kHz）をWebSocket経由で受信できること
- 受信した音声データをOpenAI Realtime APIに転送できること
- OpenAI Realtime APIからの応答音声をTwilio Media Streamsに返送できること

### FR-3: AI Agent 会話エンジン
- OpenAI Realtime API を使用してリアルタイム双方向会話を実現すること
- AI Agentにアウトバウンドセールスのペルソナ（システムプロンプト）を設定できること
- 日本語での会話に対応すること

### FR-4: 会話管理
- 通話の開始・終了を管理できること
- 通話ログ（基本情報）をコンソールに出力できること

### FR-5: 発信トリガー
- CLIコマンドまたはシンプルなHTTP APIで電話発信をトリガーできること
- 発信先の電話番号とAI Agentのプロンプト（オプション）を指定できること

## Non-Functional Requirements

### NFR-1: 遅延
- PoCのため厳密な数値目標は設けないが、自然な会話が成立する程度の応答速度を目指す
- OpenAI Realtime API のストリーミング機能を活用して遅延を最小化する

### NFR-2: スケーラビリティ
- PoCのため同時通話数は1件で十分
- 将来的な拡張は考慮しない

### NFR-3: セキュリティ
- PoCのためSecurity Extension はスキップ
- APIキー等はEnvironment Variables (.env) で管理する

### NFR-4: 可用性
- ローカル開発環境のみのため、可用性要件なし

## Architecture Overview (概要)

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   Twilio         |<--->|   Node.js        |<--->|   OpenAI         |
|   (Phone Call)   |     |   Server         |     |   Realtime API   |
|                  |     |   (WebSocket     |     |                  |
|   - Outbound     |     |    Bridge)       |     |   - LLM          |
|   - Media Stream |     |                  |     |   - STT          |
|                  |     |   - TwiML        |     |   - TTS          |
+------------------+     |   - WS Handler   |     +------------------+
                          |   - Call Trigger |
                          +------------------+
                                  ^
                                  |
                          +------------------+
                          |   ngrok          |
                          |   (Local Tunnel) |
                          +------------------+
```

**データフロー**:
1. CLI/API → Node.js Server → Twilio API (発信)
2. Twilio → WebSocket Media Stream → Node.js Server (音声受信)
3. Node.js Server → OpenAI Realtime API (音声転送)
4. OpenAI Realtime API → Node.js Server → Twilio Media Stream (応答音声)

## Scope Boundaries (スコープ外)

- 着信対応（インバウンド）
- Web UI / ダッシュボード
- 通話録音・永続化
- 複数同時通話
- 本番デプロイ
- 認証・認可
- エラーリカバリー（通話切断時の自動再接続等）

## Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
