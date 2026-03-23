---
title: "Code Summary: AI Agent 電話会話 PoC"
date: 2026-03-16T00:00:00+09:00
draft: false
---

# Code Summary: AI Agent 電話会話 PoC

## 生成ファイル一覧

| ファイル | 説明 |
|---|---|
| `package.json` | プロジェクト設定・依存関係 |
| `tsconfig.json` | TypeScript 設定 |
| `.env.example` | 環境変数テンプレート |
| `src/config/index.ts` | 環境変数読み込み・バリデーション |
| `src/index.ts` | エントリポイント（Fastify + WebSocket サーバー） |
| `src/services/twilio-service.ts` | Twilio 発信・TwiML 生成 |
| `src/services/openai-service.ts` | OpenAI Realtime API WebSocket 接続管理 |
| `src/handlers/call-handler.ts` | 発信トリガー API ハンドラー |
| `src/handlers/websocket-handler.ts` | Twilio Media Stream ⇔ OpenAI ブリッジ |
| `src/make-call.ts` | CLI 発信スクリプト |
| `.devcontainer/devcontainer.json` | devcontainer 設定（Bun） |
| `README.md` | セットアップ・実行手順 |

## 実行環境
- **ランタイム**: Bun（TypeScript ネイティブ実行、tsx/tsc 不要）
- **開発環境**: devcontainer（`oven/bun:latest` イメージ）

## 技術的な実装ポイント

### 音声フォーマット
- Twilio Media Streams: mulaw 8kHz（G.711 μ-law）
- OpenAI Realtime API: `g711_ulaw` に設定し、フォーマット変換なしで直接ブリッジ

### WebSocket ブリッジパターン
1. Twilio が `/media-stream` に WebSocket 接続
2. サーバーが OpenAI Realtime API に WebSocket 接続
3. Twilio → OpenAI: `input_audio_buffer.append` で音声転送
4. OpenAI → Twilio: `response.audio.delta` の音声を Media Stream に返送

### AI Agent の初期動作
- `session.updated` 後に `conversation.item.create` + `response.create` で AI が先に発話開始
- Server VAD で自動的にターン検出
