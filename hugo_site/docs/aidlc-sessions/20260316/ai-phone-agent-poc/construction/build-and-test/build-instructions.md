---
title: "Build Instructions: AI Agent 電話会話 PoC"
date: 2026-03-16T00:00:00+09:00
draft: false
---

# Build Instructions: AI Agent 電話会話 PoC

## Prerequisites
- **ランタイム**: Bun 1.2+（devcontainer 使用時は自動インストール）
- **外部アカウント**:
  - OpenAI API アカウント（Realtime API 対応プラン、APIキー発行済み）
  - Twilio アカウント（電話番号取得済み）
- **ローカルトンネル**: ngrok（Twilio webhook 受信用）

## Build Steps

### 1. リポジトリのクローン

```bash
git clone git@github.com:ryokosuge/ai-phone-agent.git
cd ai-phone-agent
```

### 2. 開発環境の起動

#### devcontainer（推奨）

VS Code でリポジトリを開き「Reopen in Container」を選択。Bun と依存関係が自動セットアップされます。

#### ローカル

```bash
bun install
```

### 3. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集：

| 変数 | 値 | 取得元 |
|---|---|---|
| `OPENAI_API_KEY` | `sk-...` | https://platform.openai.com/api-keys |
| `TWILIO_ACCOUNT_SID` | `AC...` | https://console.twilio.com |
| `TWILIO_AUTH_TOKEN` | `...` | https://console.twilio.com |
| `TWILIO_PHONE_NUMBER` | `+1...` | Twilio コンソール > Phone Numbers |
| `PORT` | `3000` | デフォルト |
| `PUBLIC_URL` | `https://xxxx.ngrok-free.app` | ngrok 起動後に取得 |

### 4. ngrok の起動

```bash
ngrok http 3000
```

表示された `Forwarding` の HTTPS URL を `.env` の `PUBLIC_URL` に設定。

### 5. サーバーの起動

```bash
bun run dev
```

### 6. ビルド成功の確認

- **期待される出力**:
  ```
  Server listening at http://0.0.0.0:3000
  Public URL: https://xxxx.ngrok-free.app
  ```
- **ヘルスチェック**:
  ```bash
  curl http://localhost:3000/health
  # => {"status":"ok"}
  ```

## Troubleshooting

### `Missing required environment variable` エラー
- **原因**: `.env` ファイルが未作成、または必須変数が未設定
- **対処**: `.env.example` からコピーして全変数を設定

### `bun install` が失敗する
- **原因**: Bun のバージョンが古い
- **対処**: `bun upgrade` で最新版に更新

### ngrok 接続エラー
- **原因**: ngrok が起動していない、または URL が `.env` に未反映
- **対処**: ngrok を再起動し、新しい URL を `PUBLIC_URL` に設定
