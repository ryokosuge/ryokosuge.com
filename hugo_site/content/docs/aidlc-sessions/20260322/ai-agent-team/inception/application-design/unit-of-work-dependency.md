---
title: "Unit of Work Dependencies"
date: 2026-03-22T00:00:00+09:00
draft: false
---
## Dependency Matrix

| Unit | Depends On | Depended By |
|---|---|---|
| U1: Slack連携 | U6 (Config) | U2 (event通知) |
| U2: Orchestration | U1 (Slack送信), U3 (Agent呼出), U4 (GitHub), U5 (Devin), U6 (Config/State) | - |
| U3: AI Agents | U6 (LLM Config) | U2 (Agent呼出) |
| U4: GitHub連携 | - | U2 (Issue作成/リポ分析), U3 (リポ情報参照) |
| U5: Devin連携 | U1 (Slack送信) | U2 (Devin委譲) |
| U6: Storage/Config | - | U1, U2, U3 |

## Dependency Diagram

```
+-------------------+
| U6: Storage/Config|  <-- 全Unitの基盤
+--------+----------+
         |
    +----+----+------------------+
    |         |                  |
    v         v                  v
+---+----+ +--+-------------+ +-+----------+
| U1:    | | U3:            | | U4:        |
| Slack  | | AI Agents      | | GitHub     |
+---+----+ +-------+--------+ +-----+------+
    |               |               |
    |    +----------+---------------+
    |    |
    v    v
+---+----+------+
| U2:           |
| Orchestration |  <-- 中央ハブ
+-------+-------+
        |
        v
+-------+-------+
| U5:           |
| Devin (via U1)|
+---------------+
```

## Implementation Order

| 順序 | Unit | 理由 |
|---:|---|---|
| 1 | U6: Storage/Config | 全Unitの基盤。DynamoDBテーブル定義、設定CRUD |
| 2 | U1: Slack連携 | インターフェース層。イベント受信・メッセージ送信の基盤 |
| 3 | U3: AI Agents | Agent本体。Strands Agents `Agent` クラスで3体実装 |
| 4 | U4: GitHub連携 | 外部連携。リポジトリ分析、Issue作成 |
| 5 | U2: Orchestration | 中央ハブ。U1/U3/U4/U6を統合するオーケストレーション |
| 6 | U5: Devin連携 | 最終連携。U1経由の@Devinメッセージ送信 |

### Rationale
- **U6が最初**: 全Unitが依存するDynamoDB基盤を先に整備
- **U1が2番目**: Slackからのイベント受信が動かないと他のUnitをE2Eでテストできない
- **U3が3番目**: Agentの応答品質がシステムの価値の根幹
- **U4が4番目**: リポジトリ分析はAgent議論の前提、Issue作成はPlan実行の前提
- **U2が5番目**: 全パーツが揃ってからオーケストレーション統合
- **U5が最後**: Slack送信の薄いラッパーなので最後でOK

## Interface Contracts

### U1 ↔ U2: Slack Event / Message
```python
# U1 → U2: イベント通知
class SlackEvent:
    channel: str
    thread_ts: str
    user: str
    text: str
    event_type: str  # message, app_mention, interaction

# U2 → U1: メッセージ送信依頼
class SlackMessage:
    channel: str
    thread_ts: str
    text: str
    blocks: list[dict] | None
    agent_name: str | None  # 発言者Agent名（表示用）
```

### U2 ↔ U3: Agent Invocation
```python
# U2 → U3: 発言要求
class AgentRequest:
    agent_type: str  # pm, design, task
    context: list[SlackMessage]  # 会話履歴
    repo_analysis: RepoAnalysis | None
    instruction: str  # Orchestratorからの指示

# U3 → U2: Agent応答
class AgentResponse:
    agent_type: str
    text: str
    structured_data: dict | None  # Plan, task list等
```

### U2 ↔ U4: GitHub Operations
```python
# U2 → U4: リポジトリ分析要求
class RepoAnalysisRequest:
    repo_url: str

# U4 → U2: 分析結果
class RepoAnalysis:
    structure: str
    tech_stack: list[str]
    components: list[str]
    summary: str

# U2 → U4: Issue作成要求
class IssueCreateRequest:
    repo_url: str
    issues: list[IssueSpec]

class IssueSpec:
    title: str
    body: str
    labels: list[str]
    depends_on: list[int]  # 依存Issue番号
```

### U2 ↔ U5: Devin Delegation
```python
# U2 → U5: Devin委譲要求
class DevinRequest:
    channel: str
    thread_ts: str
    issue_url: str
    spec_summary: str
```

### U* ↔ U6: Config/State Access
```python
# Config読み取り
class ChannelConfig:
    channel_id: str
    default_repo_url: str | None

class AgentLLMConfig:
    agent_type: str
    provider: str  # anthropic, openai, etc.
    model: str
    params: dict

# Meeting State
class MeetingState:
    meeting_id: str
    channel: str
    thread_ts: str
    repo_url: str
    phase: str
    plan: dict | None
    task_list: list[dict] | None
    created_at: str
    updated_at: str
```
