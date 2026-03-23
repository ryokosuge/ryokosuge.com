---
title: "Integration Test Instructions: AI Agent 電話会話 PoC"
date: 2026-03-16T00:00:00+09:00
draft: false
---

# Integration Test Instructions: AI Agent 電話会話 PoC

## テスト戦略

PoC のため、手動テスト（実際の電話発信）で統合動作を検証します。

## 手動統合テストシナリオ

### シナリオ 1: 基本的な電話発信と AI 応答

**前提条件**:
- サーバーが起動していること（`bun run dev`）
- ngrok が起動し、`PUBLIC_URL` が設定されていること
- OpenAI / Twilio の API キーが有効であること

**テスト手順**:

1. 電話を発信する
   ```bash
   curl -X POST http://localhost:3000/api/call \
     -H "Content-Type: application/json" \
     -d '{"to": "+81XXXXXXXXXX"}'
   ```

2. 以下を確認：
   - [ ] API が `{"success": true, "callSid": "CA..."}` を返すこと
   - [ ] 指定した電話番号に着信すること
   - [ ] 電話に出ると AI Agent が日本語で自己紹介を始めること
   - [ ] こちらが話すと AI が応答すること（双方向会話）
   - [ ] コンソールにログが出力されること：
     - `[Twilio] Call initiated: CA...`
     - `[MediaStream] Stream started: MZ...`
     - `[OpenAI] Connected to Realtime API`
     - `[OpenAI] Session created`
     - `[OpenAI] Session configured`

3. 電話を切断し、以下を確認：
   - [ ] `[MediaStream] Stream stopped` がログに出力されること
   - [ ] `[MediaStream] Connection closed` がログに出力されること
   - [ ] `[OpenAI] Disconnected` がログに出力されること

### シナリオ 2: カスタムプロンプトでの発信

**テスト手順**:

1. カスタムプロンプト付きで発信
   ```bash
   curl -X POST http://localhost:3000/api/call \
     -H "Content-Type: application/json" \
     -d '{"to": "+81XXXXXXXXXX", "prompt": "あなたはカスタマーサポート担当です。丁寧に対応してください。"}'
   ```

2. 以下を確認：
   - [ ] AI がカスタムプロンプトに従った会話をすること

### シナリオ 3: CLI での発信

**テスト手順**:

1. CLI で発信
   ```bash
   bun run call +81XXXXXXXXXX
   ```

2. 以下を確認：
   - [ ] `Call initiated successfully! Call SID: CA...` が表示されること
   - [ ] 電話が着信し会話できること

### シナリオ 4: エラーケース

**テスト手順**:

1. 無効な電話番号で発信
   ```bash
   curl -X POST http://localhost:3000/api/call \
     -H "Content-Type: application/json" \
     -d '{"to": "invalid"}'
   ```

2. 以下を確認：
   - [ ] エラーレスポンス（500）が返ること

3. 電話番号なしで発信
   ```bash
   curl -X POST http://localhost:3000/api/call \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

4. 以下を確認：
   - [ ] 400 エラーが返ること（`Missing 'to' phone number`）
