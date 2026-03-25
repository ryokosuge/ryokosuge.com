---
title: "NFR Design Patterns: Slack Bot"
date: 2026-03-25T00:00:00+09:00
draft: false
---

# NFR Design Patterns: Slack Bot

## DP-01: Slack APIレートリミット対応パターン

**対応NFR**: NFR-PERF-02

### 問題
都度更新（チャンクごとに即時`chat.update`）を採用するが、Slack Web APIの`chat.update`はTier 3（約50回/分）のレートリミットがある。高速なストリーミングではこれを超過する可能性がある。

### パターン: Throttled Update with Minimum Interval

```
ストリームチャンク受信
  |
  +--> accumulatedTextにテキスト追加
  |
  +--> 前回更新からの経過時間チェック
       |
       +--> 経過時間 >= MIN_INTERVAL (1000ms)
       |      → chat.update実行、lastUpdateTime更新
       |
       +--> 経過時間 < MIN_INTERVAL
              → スキップ（次のチャンクで再チェック）

ストリーム完了
  |
  +--> 最終テキストで必ずchat.update実行（間隔に関わらず）
```

### 設計詳細
- **MIN_INTERVAL**: 1000ms（1秒間隔 = 最大60回/分、Tier 3制限内）
- **最終更新**: ストリーム完了時は間隔チェックをバイパスして必ず更新
- **実装場所**: SlackHandlerまたはapp_mentionハンドラー内で `lastUpdateTime` を管理

### 429レスポンス対応
- Slack APIが429（Rate Limited）を返した場合、`Retry-After` ヘッダーの秒数だけ待機
- 待機中のチャンクはaccumulatedTextに蓄積され、次の更新で反映

---

## DP-02: エラー分離パターン

**対応NFR**: NFR-REL-02

### パターン: Per-Request Error Boundary

```
app_mentionイベント受信
  |
  +--> try {
  |      全処理（仮メッセージ投稿 → セッション解決 → ストリーミング）
  |    } catch (error) {
  |      スレッドにエラー投稿
  |      コンソールにログ出力
  |    }
  |
  +--> 他のリクエストには影響しない
```

### 設計詳細
- 各`app_mention`イベントの処理は独立したtry-catchブロックで囲む
- 例外がイベントループに伝播してプロセスをクラッシュさせないことを保証
- エラー投稿自体が失敗した場合はコンソールログのみ

---

## DP-03: セッションフォールバックパターン

**対応NFR**: NFR-REL-01

### パターン: Graceful Degradation with Fallback

```
SessionStore.has(threadTs) ?
  |
  +--> YES: try {
  |           resumeSession(sessionId)
  |         } catch {
  |           createSession()  ← フォールバック
  |           SessionStore.set(threadTs, newSessionId)
  |         }
  |
  +--> NO: createSession()
           SessionStore.set(threadTs, sessionId)
```

### 設計詳細
- `resumeSession` の失敗は「期待される障害」として設計
- フォールバック時、ユーザーには新規セッション作成を意識させない
- SessionStoreのマッピングは常に最新のsession_idに更新

---

## DP-04: ストリーミング中断保護パターン

**対応NFR**: NFR-REL-03

### パターン: Accumulated State Preservation

```
stream処理中:
  accumulatedText = ""

  for await (const msg of stream) {
    accumulatedText += extractText(msg)
    // updateMessage(accumulatedText)  ← 蓄積テキストで更新
  }

エラー発生時:
  // accumulatedTextはスコープ内で保持されている
  // 最後に成功したupdateMessageの内容がSlack上に残る
  // エラーメッセージを別メッセージとしてスレッドに投稿
```

### 設計詳細
- `accumulatedText` はストリーム処理のスコープ内で管理
- `chat.update` は蓄積テキスト全体で更新するため、中断時も途中までのテキストがSlack上に表示される
- エラーは別メッセージとして投稿（既存の部分応答を上書きしない）

---

## DP-05: 設定バリデーションパターン

**対応NFR**: NFR-SEC-01, NFR-OPS-02

### パターン: Fail-Fast Configuration Validation

```
アプリケーション起動
  |
  +--> loadConfig()
       |
       +--> 全必須環境変数チェック
       |      |
       |      +--> 1つでも未設定 → エラーメッセージ出力 → process.exit(1)
       |
       +--> 検証済みAppConfigオブジェクトを返却
       |
  +--> App初期化（検証済み設定を使用）
```

### 設計詳細
- 起動時に全必須環境変数を一括チェック（部分チェックではない）
- 未設定の変数名を明示するエラーメッセージ
- 不正な状態でのアプリケーション起動を防止
