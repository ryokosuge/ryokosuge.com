---
title: "Services"
date: 2026-03-25T00:00:00+09:00
draft: false
---
# Services

## S1: MessageProcessingService

**Purpose**: Slackイベントからエージェント応答までの一連のメッセージ処理フローをオーケストレーション

**Responsibilities**:
- メッセージ受信 → コンテキスト構築 → ルーティング → エージェント実行 → 応答送信の全フロー管理
- エラーハンドリングとフォールバック応答

**Orchestration Flow**:
```
1. SlackAdapter がメッセージイベントを受信
2. SlackAdapter → ChatEngine.processMessage() を呼び出し
3. ChatEngine が StateManager.getHistory() で会話コンテキストを取得
4. ChatEngine が AgentRouter.route() でルーティング先を決定
5. ChatEngine が該当エージェント（Conversation or CodeInvestigation）の execute() を呼び出し
6. ChatEngine が StateManager.saveMessage() で会話履歴を更新
7. ChatEngine が応答を SlackAdapter に返却
8. SlackAdapter が Slack にメッセージを送信
```

**Error Handling**:
- エージェント実行エラー → 固定エラーメッセージをSlackに送信
- Redis接続エラー → コンテキストなしで応答試行（degraded mode）
- Slack送信エラー → ログ記録のみ（リトライなし）

---

## S2: AgentOrchestrationService

**Purpose**: AIエージェントの生成・実行・管理を担当

**Responsibilities**:
- ConversationAgent / CodeInvestigationAgent のインスタンス管理
- エージェント実行のタイムアウト管理
- エージェント実行結果のログ記録

**Orchestration Flow**:
```
1. ChatEngine からエージェント種別と入力を受け取る
2. 対応するエージェントインスタンスを取得
3. エージェントの execute() を呼び出し
4. タイムアウト監視
5. 実行結果を ChatEngine に返却
```

---

## S3: ApplicationBootstrapService

**Purpose**: アプリケーション全体の起動・シャットダウンを管理

**Responsibilities**:
- 起動順序の制御（Redis接続 → Slack接続 → HealthCheckサーバー）
- グレースフルシャットダウン
- 各コンポーネントのDI（依存性注入）管理

**Bootstrap Flow**:
```
1. Logger の初期化
2. StateManager の初期化（Redis接続確立）
3. AgentRouter, ConversationAgent, CodeInvestigationAgent の初期化
4. ChatEngine の初期化（StateManager, AgentRouter, Agents を注入）
5. SlackAdapter の初期化・接続（ChatEngine を注入）
6. HealthCheckServer の起動（SlackAdapter, StateManager を注入）
7. シグナルハンドラ登録（SIGTERM, SIGINT → グレースフルシャットダウン）
```

**Shutdown Flow**:
```
1. SIGTERM/SIGINT 受信
2. HealthCheckServer 停止
3. SlackAdapter 切断
4. StateManager（Redis）切断
5. プロセス終了
```
