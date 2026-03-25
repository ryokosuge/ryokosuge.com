---
title: "Logical Components: Slack Bot"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## LC-01: Throttled Message Updater

**対応パターン**: DP-01（レートリミット対応）

### 目的
`chat.update` の呼び出し頻度を制御し、Slack APIレートリミットに抵触しないようにする。

### 論理的構造
```typescript
// SlackHandlerまたはapp_mentionハンドラー内で管理
type ThrottleState = {
  lastUpdateTime: number;  // 最後にchat.updateした時刻（ms）
  pendingText: string;     // 未送信の蓄積テキスト
};

const MIN_UPDATE_INTERVAL = 1000; // 1秒

function shouldUpdate(state: ThrottleState): boolean {
  return Date.now() - state.lastUpdateTime >= MIN_UPDATE_INTERVAL;
}
```

### 動作
- チャンク受信時に `shouldUpdate()` をチェック
- 条件を満たせば `chat.update` 実行
- ストリーム完了時は無条件で最終更新

### 429対応
- `chat.update` が429を返した場合、`Retry-After` 秒だけ待機後にリトライ
- 待機中も `accumulatedText` にはテキストが蓄積され続ける

---

## LC-02: Error Reporter

**対応パターン**: DP-02（エラー分離）

### 目的
エラーをスレッドとコンソールの両方に報告する共通処理。

### 論理的構造
```
reportError(client, channel, threadTs, error):
  1. logger.error(error.name, error.message, error.stack)
  2. try {
       chat.postMessage(channel, threadTs, formatError(error))
     } catch (slackError) {
       logger.error("Failed to post error to Slack", slackError)
     }
```

### 動作
- エラー報告自体の失敗はアプリケーションに影響しない（catch & log）
- エラーメッセージにはエラー名と詳細を含める

---

## LC-03: Session Resolver

**対応パターン**: DP-03（セッションフォールバック）

### 目的
`threadTs` からClaude Agent SDKのセッションを解決する。

### 論理的構造
```
resolveSession(threadTs):
  sessionId = sessionStore.get(threadTs)

  IF sessionId exists:
    try:
      return resumeSession(sessionId)
    catch:
      logger.error("Session resume failed, creating new session")
      // fall through to create new session

  session = createSession()
  // session_idはstream()から取得後にsessionStore.setで保存
  return session
```

### 動作
- `resumeSession` の失敗は想定内として処理
- フォールバック時もユーザー体験は変わらない（新しいセッションで応答）

---

## LC-04: Stream Text Extractor

**対応パターン**: DP-04（ストリーミング中断保護）

### 目的
`SDKMessage` からテキストを抽出し蓄積する。

### 論理的構造
```
extractAssistantText(msg: SDKMessage): string | null
  IF msg.type !== 'assistant':
    return null

  texts = msg.message.content
    .filter(block => block.type === 'text')
    .map(block => block.text)

  return texts.join('')
```

### 動作
- `assistant` タイプのメッセージのみ処理
- 複数テキストブロックは結合
- テキストが無い場合は `null` を返す

---

## LC-05: Dev Container Configuration

**対応NFR**: NFR-OPS-01

### 目的
開発環境を `.devcontainer/` で定義し、即座に開発開始できるようにする。

### 論理的構造
```json
// .devcontainer/devcontainer.json
{
  "name": "Slack Bot Dev",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/anthropics/devcontainer-features/claude-code:latest": {},
    "ghcr.io/shyim/devcontainers-features/bun:latest": {}
  },
  "postCreateCommand": "bun install"
}
```

### 含まれるツール
- **Bun**: ランタイム + パッケージマネージャー + テストランナー
- **Claude Code**: AI開発アシスタント
- **Ubuntu**: ベースOS
