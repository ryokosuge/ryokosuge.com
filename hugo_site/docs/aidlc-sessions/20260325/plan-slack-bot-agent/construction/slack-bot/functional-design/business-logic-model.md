---
title: "Business Logic Model: Slack Bot"
date: 2026-03-25T00:00:00+09:00
draft: false
---

# Business Logic Model: Slack Bot

## BL-01: メンションイベント処理

### フロー
```
1. app_mentionイベント受信
2. event.textからBot ID (`<@BOT_ID>`) を除去
3. threadTsを決定:
   - event.thread_tsが存在 → event.thread_ts（スレッド内メンション）
   - event.thread_tsが未設定 → event.ts（新規スレッド）
4. チャンネルとthreadTsでストリーム処理を開始
```

### Bot ID除去ロジック
```
入力: "<@U12345> TypeScriptのジェネリクスについて教えて"
処理: 正規表現 /<@[A-Z0-9]+>/g にマッチする部分を除去し、先頭・末尾の空白をトリム
出力: "TypeScriptのジェネリクスについて教えて"
```

---

## BL-02: セッション解決

### フロー
```
1. SessionStore.has(threadTs) をチェック
2. IF true:
   a. sessionId = SessionStore.get(threadTs)
   b. session = unstable_v2_resumeSession(sessionId, { model })
3. IF false:
   a. session = unstable_v2_createSession({ model })
   b. stream()でsession_idを取得後、SessionStore.set(threadTs, sessionId)
4. EXCEPTION: resumeSessionが失敗した場合
   a. 新規セッションにフォールバック（createSession）
   b. SessionStoreを新しいsession_idで上書き
```

---

## BL-03: ストリーミング応答処理

### フロー
```
1. 仮メッセージ（「考え中...」）をスレッドに投稿 → messageTs取得
2. session.send(userMessage)
3. session.stream()でAsyncGeneratorを取得
4. for await (const msg of stream):
   a. msg.session_idをキャプチャ（初回のみSessionStoreに保存）
   b. msg.type === 'assistant' の場合:
      - msg.message.contentからテキストブロックを抽出
      - accumulatedTextに追加
      - formatToSlackMrkdwn(accumulatedText)でSlack形式に変換
      - chat.update(channel, messageTs, formattedText) で即時更新
5. ストリーム完了:
   - 最終テキストでchat.update（最終確定更新）
```

### テキスト抽出ロジック
```
SDKMessage.message.content は ContentBlock[] 型
ContentBlock の type === 'text' のものからtextフィールドを抽出
複数テキストブロックは結合
```

---

## BL-04: エラーハンドリング

### エラーシナリオと対処

| シナリオ | 対処 |
|---|---|
| createSession失敗 | スレッドに詳細エラー投稿、コンソールログ |
| resumeSession失敗 | createSessionにフォールバック、SessionStore更新 |
| session.send失敗 | スレッドに詳細エラー投稿、コンソールログ |
| stream中のエラー | 蓄積済みテキスト保持、エラーメッセージ追加投稿 |
| chat.update失敗 | コンソールログ（ストリーム処理は継続） |
| chat.postMessage失敗 | コンソールログ |

### エラーメッセージフォーマット
```
エラーが発生しました:
[Error.name]: [Error.message]
```

---

## BL-05: Markdown → Slack mrkdwn変換

### 変換ルール

| Markdown | Slack mrkdwn | 例 |
|---|---|---|
| `**bold**` | `*bold*` | **太字** → *太字* |
| `*italic*` / `_italic_` | `_italic_` | *斜体* → _斜体_ |
| `~~strike~~` | `~strike~` | ~~取消線~~ → ~取消線~ |
| `[text](url)` | `<url\|text>` | リンク変換 |
| `` `code` `` | `` `code` `` | そのまま |
| ` ```block``` ` | ` ```block``` ` | そのまま |
| `# heading` | `*heading*` | 見出し → 太字 |
| `- item` | `- item` | そのまま |
| `> quote` | `> quote` | そのまま |

### 注意事項
- Slackは`**`を太字として認識しないため変換が必要
- ネストされた記法（太字内のコードなど）は外側の記法を優先
- コードブロック内の記法は変換しない
