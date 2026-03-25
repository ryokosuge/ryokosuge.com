---
title: "Code Generation Plan: AI Agent 電話会話 PoC"
date: 2026-03-16T00:00:00+09:00
draft: false
---
## Unit Context
- **Unit Name**: ai-phone-agent（単一ユニット）
- **Project Type**: Greenfield
- **Language**: TypeScript (Node.js)
- **Workspace Root**: /Users/ryokosuge/Workspaces/github.com/ryokosuge/docs

## Project Structure (Greenfield Single Unit)
```
<workspace-root>/
├── src/
│   ├── index.ts              # エントリポイント（Express + WebSocket サーバー）
│   ├── services/
│   │   ├── twilio-service.ts  # Twilio 発信 + TwiML 生成
│   │   └── openai-service.ts  # OpenAI Realtime API 接続管理
│   ├── handlers/
│   │   ├── websocket-handler.ts  # Twilio Media Stream WebSocket ハンドラー
│   │   └── call-handler.ts       # 発信トリガー API ハンドラー
│   └── config/
│       └── index.ts           # 環境変数・設定管理
├── .env.example               # 環境変数テンプレート
├── package.json
├── tsconfig.json
└── README.md                  # セットアップ・実行手順
```

## Requirements Traceability
| Step | Requirements |
|---|---|
| Step 1 | - (プロジェクト基盤) |
| Step 2 | FR-5 (発信トリガー) |
| Step 3 | FR-1 (電話発信), FR-2 (音声ストリーミング) |
| Step 4 | FR-3 (AI Agent 会話エンジン) |
| Step 5 | FR-2 (リアルタイム音声ストリーミング), FR-4 (会話管理) |
| Step 6 | FR-5 (発信トリガー) |
| Step 7 | FR-1〜FR-5 (統合) |
| Step 8 | - (ドキュメント) |

---

## Generation Steps

### Step 1: プロジェクト基盤セットアップ
- [x]`package.json` 作成（依存関係: express, ws, twilio, openai, dotenv, typescript 等）
- [x]`tsconfig.json` 作成
- [x]`.env.example` 作成（OPENAI_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, NGROK_URL）
- [x]`src/config/index.ts` 作成（環境変数読み込み・バリデーション）

### Step 2: 発信トリガー API ハンドラー
- [x]`src/handlers/call-handler.ts` 作成
  - POST `/api/call` エンドポイント（発信先番号、オプションでプロンプト指定）
  - リクエストバリデーション
  - Twilio Service 呼び出し

### Step 3: Twilio サービス層
- [x]`src/services/twilio-service.ts` 作成
  - Twilio Client 初期化
  - `makeCall(to: string, prompt?: string)` - 発信実行
  - TwiML 生成（Media Stream WebSocket 接続指定）

### Step 4: OpenAI Realtime API サービス層
- [x]`src/services/openai-service.ts` 作成
  - OpenAI Realtime API WebSocket 接続管理
  - セッション設定（日本語、音声モデル設定）
  - アウトバウンドセールス用システムプロンプト設定
  - 音声データ送受信インターフェース

### Step 5: WebSocket ブリッジハンドラー
- [x]`src/handlers/websocket-handler.ts` 作成
  - Twilio Media Stream WebSocket 接続ハンドラー
  - 音声フォーマット変換（mulaw/8kHz ⇔ OpenAI対応フォーマット）
  - Twilio → OpenAI 音声転送
  - OpenAI → Twilio 応答音声転送
  - 通話開始・終了イベント管理
  - コンソールログ出力（FR-4）

### Step 6: エントリポイント
- [x]`src/index.ts` 作成
  - Express サーバー起動
  - WebSocket サーバー起動（Twilio Media Stream 用）
  - API ルーティング設定（POST `/api/call`, POST `/twiml`）
  - TwiML エンドポイント（Twilio webhook 用）

### Step 7: 統合確認・動作検証用スクリプト
- [x]`package.json` に scripts 追加（`dev`, `build`, `start`）
- [x]全体の import/export 整合性確認

### Step 8: ドキュメント生成
- [x]`README.md` 作成（前提条件、セットアップ手順、実行方法、使い方）
- [x]`aidlc-docs/construction/ai-phone-agent/code/code-summary.md` 作成（生成コードサマリー）

---

## Notes
- テストコードは PoC スコープのため省略（手動テスト = 実際に電話発信して会話確認）
- Build and Test ステージでビルド・テスト手順を文書化
- OpenAI Realtime API の WebSocket 接続には `wss://api.openai.com/v1/realtime` エンドポイントを使用
- Twilio Media Streams は mulaw/8kHz フォーマットで音声データを送受信
