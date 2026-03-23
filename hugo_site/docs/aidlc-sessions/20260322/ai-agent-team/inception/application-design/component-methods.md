---
title: "Component Methods"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Component Methods

## C-1: Slack Gateway

| Method | Purpose | Input | Output |
|---|---|---|---|
| `handle_event(event)` | Slackイベントの受信・振り分け | Slack Event payload | None (内部ルーティング) |
| `send_message(channel, thread_ts, text, blocks?)` | Slackスレッドにメッセージ送信 | channel ID, thread timestamp, message text, optional blocks | Message response |
| `send_approval_prompt(channel, thread_ts, plan_summary)` | Plan承認ボタン付きメッセージ送信 | channel ID, thread timestamp, plan summary | Interactive message response |
| `handle_interaction(payload)` | ボタン・アクションのハンドリング | Interaction payload | None (Orchestratorに通知) |

---

## C-2: Meeting Orchestrator

| Method | Purpose | Input | Output |
|---|---|---|---|
| `start_meeting(channel, thread_ts, user_message, repo_url?)` | 新規ミーティング開始 | channel, thread, user message, optional repo URL | Meeting ID |
| `handle_user_input(meeting_id, user_message)` | ユーザー介入の処理 | meeting ID, user message | None (フローに統合) |
| `request_agent_response(meeting_id, agent_type, context)` | Agentに発言を要求 | meeting ID, agent type, conversation context | Agent response text |
| `advance_phase(meeting_id)` | ミーティングフェーズを次に進める | meeting ID | New phase |
| `handle_approval(meeting_id, approved, comment?)` | Plan承認/却下の処理 | meeting ID, approval status, optional comment | None |
| `execute_task_creation(meeting_id)` | GitHub Issue作成の実行 | meeting ID | Created issue list |
| `delegate_to_devin(meeting_id, issues)` | Devinへのタスク委譲 | meeting ID, issue list | Delegation status |
| `get_conversation_context(meeting_id)` | Slackスレッドの会話履歴取得 | meeting ID | Message list |

---

## C-3: PM Agent

| Method | Purpose | Input | Output |
|---|---|---|---|
| `analyze_requirements(context, repo_analysis?)` | ユーザー要件の分析・整理 | conversation context, optional repo analysis | Requirements summary text |
| `facilitate_discussion(context, topic)` | 議題に基づく議論のファシリテーション | conversation context, topic | Facilitation message text |
| `summarize_meeting(context)` | ミーティングの結論まとめ | conversation context | Meeting summary text |
| `generate_plan(context, design_output, task_output)` | Planドキュメント生成 | conversation context, design data, task data | Plan document (structured) |

---

## C-4: Design Agent

| Method | Purpose | Input | Output |
|---|---|---|---|
| `propose_architecture(context, repo_analysis?)` | アーキテクチャ提案 | conversation context, optional repo analysis | Architecture proposal text |
| `review_feasibility(context, proposal)` | 技術的実現可能性の評価 | conversation context, proposal | Feasibility review text |
| `respond_to_discussion(context)` | 議論への設計観点からの応答 | conversation context | Design perspective text |

---

## C-5: Task Agent

| Method | Purpose | Input | Output |
|---|---|---|---|
| `decompose_tasks(context, design_output)` | 設計をタスクに分解 | conversation context, design output | Task list with dependencies |
| `generate_issue_specs(tasks)` | GitHub Issue用仕様書生成 | task list | Issue spec list (title, body, labels, deps) |
| `respond_to_discussion(context)` | 議論へのタスク観点からの応答 | conversation context | Task perspective text |

---

## C-6: Repository Analyzer

| Method | Purpose | Input | Output |
|---|---|---|---|
| `analyze_repository(repo_url)` | リポジトリの包括的な分析 | repository URL | RepoAnalysis (structure, tech stack, components) |
| `get_file_tree(repo_url)` | ファイル構造の取得 | repository URL | File tree |
| `get_tech_stack(repo_url)` | 使用技術の特定 | repository URL | Tech stack list |

---

## C-7: GitHub Integration

| Method | Purpose | Input | Output |
|---|---|---|---|
| `create_issue(repo, title, body, labels?, assignee?)` | GitHub Issue作成 | repo, title, body, optional labels/assignee | Issue URL & number |
| `create_issues_batch(repo, issue_specs)` | 複数Issue一括作成 | repo, issue spec list | Created issue list |
| `get_repo_info(repo_url)` | リポジトリ情報取得 | repo URL | Repo metadata |
| `get_repo_contents(repo_url, path?)` | リポジトリファイル内容取得 | repo URL, optional path | File contents |
| `commit_file(repo, path, content, message)` | ファイルコミット | repo, file path, content, commit message | Commit result |
| `get_pr_status(repo, pr_number)` | PR状態取得 | repo, PR number | PR status |

---

## C-8: Devin Integration

| Method | Purpose | Input | Output |
|---|---|---|---|
| `request_implementation(channel, thread_ts, issue_url, spec_summary)` | @DevinメンションでIssue実装を依頼 | channel, thread, issue URL, spec summary | Sent message ID |
| `format_devin_message(issue_url, spec_summary)` | Devin向けメッセージのフォーマット | issue URL, spec summary | Formatted message text with @Devin mention |

---

## C-9: Meeting State Store

| Method | Purpose | Input | Output |
|---|---|---|---|
| `create_meeting(channel, thread_ts, repo_url)` | ミーティング状態の初期化 | channel, thread timestamp, repo URL | Meeting ID |
| `get_meeting(meeting_id)` | ミーティング状態の取得 | meeting ID | Meeting state |
| `update_phase(meeting_id, phase)` | フェーズ更新 | meeting ID, new phase | Updated state |
| `store_plan(meeting_id, plan)` | Plan保存 | meeting ID, plan data | Stored plan |
| `get_meeting_by_thread(channel, thread_ts)` | スレッドからミーティング検索 | channel, thread timestamp | Meeting state |

---

## C-10: Config Store

| Method | Purpose | Input | Output |
|---|---|---|---|
| `get_repo_for_channel(channel_id)` | チャンネルのデフォルトリポジトリ取得 | channel ID | Repo URL or None |
| `set_repo_for_channel(channel_id, repo_url)` | チャンネルのデフォルトリポジトリ設定 | channel ID, repo URL | Success/Failure |
| `get_agent_llm_config(agent_type)` | Agent別LLM設定取得 | agent type | LLM provider, model, params |
| `set_agent_llm_config(agent_type, config)` | Agent別LLM設定更新 | agent type, LLM config | Success/Failure |
| `get_all_config()` | 全設定取得 | None | Full config |
