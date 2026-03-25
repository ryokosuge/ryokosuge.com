---
title: "Component Dependencies"
date: 2026-03-25T00:00:00+09:00
draft: false
---
# Component Dependencies

## Dependency Matrix

| Component | Depends On | Depended By |
|---|---|---|
| C1: SlackAdapter | C2: ChatEngine, C8: Logger | C7: HealthCheckServer |
| C2: ChatEngine | C3: AgentRouter, C4: ConversationAgent, C5: CodeInvestigationAgent, C6: StateManager, C8: Logger | C1: SlackAdapter |
| C3: AgentRouter | C8: Logger | C2: ChatEngine |
| C4: ConversationAgent | C8: Logger | C2: ChatEngine |
| C5: CodeInvestigationAgent | C8: Logger | C2: ChatEngine |
| C6: StateManager | C8: Logger | C2: ChatEngine, C7: HealthCheckServer |
| C7: HealthCheckServer | C1: SlackAdapter, C6: StateManager, C8: Logger | なし（外部HTTP） |
| C8: Logger | なし | 全コンポーネント |

## Communication Patterns

### 同期呼び出し（関数コール）
```
SlackAdapter → ChatEngine → AgentRouter
                          → ConversationAgent
                          → CodeInvestigationAgent
                          → StateManager
```

### イベント駆動
```
Slack WebSocket → SlackAdapter.handleMessageEvent()
```

### HTTP
```
External Monitor → HealthCheckServer (GET /health)
```

## Data Flow Diagram

```
+-------+    WebSocket     +---------+    ChatRequest    +----------+
| Slack | <--------------> | Slack   | ----------------> | Chat     |
|       |    events/msgs   | Adapter |    ChatResponse   | Engine   |
+-------+                  +---------+ <---------------- +----------+
                                                           |    |   |
                                           getHistory()    |    |   | route()
                                           saveMessage()   |    |   |
                                                           v    |   v
                                                      +------+  |  +-------+
                                                      | State |  |  | Agent |
                                                      | Mgr   |  |  | Router|
                                                      +---+---+  |  +-------+
                                                          |       |
                                                          v       v
                                                      +------+  +------------+
                                                      | Redis|  | Agents     |
                                                      |      |  | Conv/Code  |
                                                      +------+  +-----+------+
                                                                       |
                                                                       v
                                                                 +----------+
                                                                 | Claude   |
                                                                 | API      |
                                                                 +----------+

+---------+   HTTP GET /health   +-------------+
| Monitor | ------------------> | HealthCheck  |
|         | <------------------ | Server       |
+---------+   JSON status       +-------------+
```

## Dependency Injection Strategy

全コンポーネントはコンストラクタインジェクションで依存関係を注入：

```
ApplicationBootstrapService
  ├── Logger（依存なし、最初に生成）
  ├── StateManager(logger)
  ├── AgentRouter(logger)
  ├── ConversationAgent(logger)
  ├── CodeInvestigationAgent(logger)
  ├── ChatEngine(stateManager, agentRouter, conversationAgent, codeInvestigationAgent, logger)
  ├── SlackAdapter(chatEngine, logger)
  └── HealthCheckServer(slackAdapter, stateManager, logger)
```

## 外部依存関係

| External System | Connected By | Protocol |
|---|---|---|
| Slack API | SlackAdapter | WebSocket (Socket Mode) |
| Redis | StateManager | TCP (Redis Protocol) |
| Claude API | ConversationAgent, CodeInvestigationAgent, AgentRouter | HTTPS |
