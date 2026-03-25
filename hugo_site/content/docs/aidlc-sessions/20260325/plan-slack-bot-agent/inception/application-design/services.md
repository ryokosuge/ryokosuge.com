---
title: "Services: Slack Bot with Claude Agent SDK"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Service Overview

本アプリケーションは単一プロセスで動作するSlack Botであり、マイクロサービスやサービス間通信は不要。
「サービス」はアプリケーション内のオーケストレーションパターンとして定義する。

---

## Service 1: メッセージ処理オーケストレーション

**責務**: `app_mention` イベントから応答完了までの一連のフローを調整する。

### オーケストレーションフロー

```
app_mention Event
  |
  v
SlackHandler.registerHandlers (イベント受信)
  |
  +--> メンションテキスト抽出・Bot ID除去
  |
  +--> SlackHandler.postThinkingMessage (仮メッセージ投稿)
  |
  +--> ClaudeHandler.handleMessage (Agent処理開始)
  |      |
  |      +--> SessionStore.has/get (セッション検索)
  |      |
  |      +--> createSession / resumeSession
  |      |
  |      +--> session.send (メッセージ送信)
  |      |
  |      +--> session.stream (ストリーミング受信)
  |             |
  |             +--> onChunk --> MessageFormatter.formatToSlackMrkdwn
  |             |                  --> SlackHandler.updateMessage
  |             |
  |             +--> onComplete --> SlackHandler.updateMessage (最終更新)
  |             |
  |             +--> onError --> SlackHandler.postErrorMessage
  |
  v
完了
```

### 参加コンポーネント
- **SlackHandler**: イベント受信、メッセージ投稿・更新
- **ClaudeHandler**: Agent SDK連携、セッション管理
- **SessionStore**: セッションID永続化
- **MessageFormatter**: テキスト変換
- **Logger**: ログ出力（各ステップで使用）

---

## Service 2: セッションライフサイクル管理

**責務**: スレッドとClaude Agentセッションの紐づけを管理する。

### ライフサイクル

```
新規メンション（スレッド外）
  |
  +--> SessionStore.has(threadTs) = false
  |
  +--> createSession() --> stream() --> session_id取得
  |
  +--> SessionStore.set(threadTs, sessionId)
  |
  v
スレッド内メンション
  |
  +--> SessionStore.has(threadTs) = true
  |
  +--> SessionStore.get(threadTs) --> sessionId
  |
  +--> resumeSession(sessionId)
  |
  v
セッション未発見（プロセス再起動後など）
  |
  +--> SessionStore.has(threadTs) = false
  |
  +--> createSession() (新規作成にフォールバック)
```

### 参加コンポーネント
- **ClaudeHandler**: セッション作成・再開の判断と実行
- **SessionStore**: マッピングの保存・検索
