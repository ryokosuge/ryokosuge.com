---
title: "User Stories"
date: 2026-03-22T00:00:00+09:00
draft: false
---
## Epic 0: 初期セットアップ

### Story 0.1: Slack App接続
**As a** Developer (P-1)
**I want to** システムをSlackワークスペースに接続し、使用するチャンネルを設定できる
**So that** Slackチャンネルへの投稿でAgentチームが反応するようになる

**Acceptance Criteria:**
- **Given** Developerが初回セットアップを行う時
- **When** Slack Appをワークスペースにインストールし、対象チャンネルを指定する
- **Then** 指定チャンネルへの投稿をシステムが監視できる状態になる

### Story 0.2: GitHub連携設定
**As a** Developer (P-1)
**I want to** GitHubアカウントとの連携を設定できる
**So that** Agentチームがリポジトリの読み取りやIssue作成を行える

**Acceptance Criteria:**
- **Given** Developerが GitHub連携設定を行う時
- **When** GitHubトークンまたはOAuth認証を設定する
- **Then** 指定リポジトリへの読み取り・Issue作成権限が付与される

### Story 0.3: Devin連携設定
**As a** Developer (P-1)
**I want to** Devinとの連携方法を設定できる
**So that** Plan承認後にDevinへのタスク投入が自動で行える

**Acceptance Criteria:**
- **Given** Developerが Devin連携設定を行う時
- **When** Devinの認証情報と連携方式を設定する
- **Then** GitHub Issue経由でDevinにタスクを渡せる状態になる

### Story 0.4: Agent LLM設定
**As a** Developer (P-1)
**I want to** 各Agentが使用するLLMを設定・変更できる
**So that** Agent毎に最適なLLMを割り当てられる

**Acceptance Criteria:**
- **Given** Developerが Agent設定を行う時
- **When** 各Agent（PM、Design、Task）に使用するLLMプロバイダー・モデルを指定する
- **Then** 各Agentが指定されたLLMを使って応答を生成する

- **Given** LLM設定が未指定の時
- **When** システムがデフォルト設定を使用する
- **Then** 各Agentが事前設定されたデフォルトLLMで動作する

---

## Epic 1: Slack連携 - ミーティング開始

### Story 1.1: 要件投稿によるミーティング開始
**As a** Developer (P-1)
**I want to** Slackチャンネルに要件を投稿するだけでAI Agentチームのミーティングが自動的に開始される
**So that** 手動でAgentを起動したり設定したりする手間なく、すぐに議論が始まる

**Acceptance Criteria:**
- **Given** Developerが設定済みのSlackチャンネルにメッセージを投稿した時
- **When** メッセージが要件・開発リクエストとして認識される
- **Then** Slackスレッドが作成され、PM Agentが最初の応答を数秒以内に返す

- **Given** PM Agentがスレッドで応答を開始した時
- **When** 要件の初期分析が完了する
- **Then** Design AgentとTask Agentもスレッドに参加し、ミーティングが開始される

### Story 1.2: 対象リポジトリの指定
**As a** Developer (P-1)
**I want to** ミーティング開始時に対象のGitHubリポジトリを指定できる
**So that** 複数のプロジェクトに対してこのシステムを使える

**Acceptance Criteria:**
- **Given** Developerが要件を投稿する時
- **When** メッセージ内にリポジトリ情報（URL or リポジトリ名）を含める
- **Then** Agentチームがそのリポジトリを対象として議論を開始する

- **Given** リポジトリ情報が省略された時
- **When** チャンネルにデフォルトリポジトリが設定されている
- **Then** デフォルトリポジトリを対象として議論を開始する

---

## Epic 2: AI Agent Team Meeting

### Story 2.1: Agent間チャット形式の議論
**As a** Developer (P-1)
**I want to** Slackスレッド内でAI Agent同士が短いメッセージでチャット形式の議論を行う
**So that** 議論の過程をリアルタイムで確認でき、必要に応じて介入できる

**Acceptance Criteria:**
- **Given** ミーティングが開始された時
- **When** 各Agentが発言する
- **Then** 数行程度の短いメッセージとしてSlackスレッドに投稿される

- **Given** Agent間の議論が進行中の時
- **When** 各Agentが自分の専門領域に基づいて発言する
- **Then** PM Agentは要件整理、Design Agentは設計観点、Task Agentはタスク分解の視点で発言する

### Story 2.2: ユーザーの介入・方向修正
**As a** Developer (P-1)
**I want to** ミーティング進行中にSlackスレッドにコメントして議論の方向を修正できる
**So that** Agentの議論が意図と異なる方向に進んだ場合にすぐ軌道修正できる

**Acceptance Criteria:**
- **Given** Agent間の議論が進行中の時
- **When** Developerがスレッドにコメントを投稿する
- **Then** Agentチームがコメントを認識し、次の発言からその内容を反映する

- **Given** Developerが方向修正のコメントを投稿した時
- **When** PM Agentがコメントを処理する
- **Then** PM Agentが修正内容を確認し、議論の方向を調整する旨を返答する

### Story 2.3: 既存コードベースの理解
**As a** Developer (P-1)
**I want to** Agentチームが対象リポジトリの既存コードベースを分析・理解した上でミーティングを進めてくれる
**So that** 既存の設計やコード構造を踏まえた実現可能な議論が行われる

**Acceptance Criteria:**
- **Given** 対象リポジトリが指定された時
- **When** ミーティング開始前にAgentチームがリポジトリの分析を行う
- **Then** リポジトリ構造、使用技術、主要コンポーネントの概要を把握した状態で議論が開始される

- **Given** Design Agentが設計方針を提案する時
- **When** 既存コードとの整合性を評価する
- **Then** 既存アーキテクチャとの整合性や影響範囲を考慮した提案が行われる

---

## Epic 3: Plan生成・承認

### Story 3.1: 構造化されたPlan生成
**As a** Developer (P-1)
**I want to** ミーティングの結論として、要件・設計方針・タスク一覧を含む構造化されたPlanが生成される
**So that** 何を実装するかが明確に文書化される

**Acceptance Criteria:**
- **Given** Agent間の議論が一通り終了した時
- **When** PM Agentがミーティングの結論をまとめる
- **Then** 以下を含むPlanドキュメントが生成される:
  - 要件サマリー
  - 設計方針
  - タスク一覧（依存関係付き）
  - 各タスクの詳細仕様（要件・設計方針・実装指示を含む仕様書レベル）

### Story 3.2: Plan承認フロー
**As a** Developer (P-1)
**I want to** 生成されたPlanをSlack上で確認し、Approve/Rejectできる
**So that** 実装に進む前に内容を確認・修正できる

**Acceptance Criteria:**
- **Given** Planが生成された時
- **When** PM AgentがSlackスレッドにPlanサマリーと承認ボタンを投稿する
- **Then** DeveloperがApproveまたはRejectを選択できる

- **Given** DeveloperがRejectを選択した時
- **When** 修正コメントを追記する
- **Then** Agentチームが修正点を反映した新しいPlanを生成する

- **Given** DeveloperがApproveを選択した時
- **When** Planが確定する
- **Then** GitHub Issueの作成プロセスに進む

### Story 3.3: 議事録のGitHub保存
**As a** Developer (P-1)
**I want to** ミーティングの議事録とPlanがGitHubリポジトリにMarkdownとして保存される
**So that** 後から意思決定の経緯を振り返ることができる

**Acceptance Criteria:**
- **Given** Planが承認された時
- **When** 保存処理が実行される
- **Then** 対象リポジトリに議事録（ミーティングログ）とPlan（仕様書）がMarkdownファイルとしてコミットされる

---

## Epic 4: Devin連携 - タスク投入

### Story 4.1: GitHub Issue作成
**As a** Developer (P-1)
**I want to** 承認されたPlanの各タスクが自動的にGitHub Issueとして対象リポジトリに作成される
**So that** 手動でIssueを作成する手間なく、Devinに渡せる形でタスクが整理される

**Acceptance Criteria:**
- **Given** Planが承認された時
- **When** Task AgentがIssue作成を実行する
- **Then** 各タスクが個別のGitHub Issueとして作成され、以下を含む:
  - タスクタイトル
  - 詳細な仕様書（要件・設計方針・実装指示）
  - 依存関係の参照（関連Issue番号）
  - 受け入れ基準

### Story 4.2: DevinへのIssue割り当て
**As a** Developer (P-1)
**I want to** 作成されたGitHub IssueがDevinに渡されて実装が開始される
**So that** 手動でDevinにタスクを投げる手間が省ける

**Acceptance Criteria:**
- **Given** GitHub Issueが作成された時
- **When** 依存関係の順序に基づいてタスクが準備完了になる
- **Then** DevinにIssueが渡され、実装が開始される

- **Given** 依存関係のあるタスクがある時
- **When** 前提タスクがまだ完了していない
- **Then** 前提タスクの完了を待ってから次のタスクをDevinに渡す

### Story 4.3: 進捗通知
**As a** Developer (P-1)
**I want to** Devinの作業進捗がSlackに通知される
**So that** 各タスクの進行状況をSlackで把握できる

**Acceptance Criteria:**
- **Given** Devinがタスクの実装を進めている時
- **When** タスクのステータスが変化する（開始、PR作成、テスト完了等）
- **Then** 元のSlackスレッドに進捗通知が投稿される

### Story 4.4: 失敗時のエスカレーション
**As a** Developer (P-1)
**I want to** Devinのタスク実行が失敗した場合にSlackで通知を受け取る
**So that** 問題を把握し、対応を決められる

**Acceptance Criteria:**
- **Given** Devinがタスク実行中にエラーが発生した時
- **When** リトライしても解決しない
- **Then** Slackスレッドにエラー内容と対応オプションが通知される

---

## Epic 5: 複数リポジトリ管理

### Story 5.1: リポジトリ設定
**As a** Developer (P-1)
**I want to** Slackチャンネルごとにデフォルトのリポジトリを設定できる
**So that** 毎回リポジトリを指定する手間を省ける

**Acceptance Criteria:**
- **Given** Developerがシステムの設定コマンドを実行した時
- **When** チャンネルとリポジトリの紐付けを設定する
- **Then** そのチャンネルでの要件投稿時にデフォルトリポジトリが自動的に選択される

### Story 5.2: リポジトリの動的切り替え
**As a** Developer (P-1)
**I want to** 投稿時にデフォルト以外のリポジトリを指定できる
**So that** 柔軟に複数プロジェクトを扱える

**Acceptance Criteria:**
- **Given** デフォルトリポジトリが設定されているチャンネルで
- **When** Developerが投稿時に別のリポジトリを明示的に指定する
- **Then** 指定されたリポジトリを対象としてミーティングが開始される

---

## Implementation Order

| 順序 | Story | 理由 |
|---:|---|---|
| 1 | 0.1 | 前提: Slack App接続 |
| 2 | 0.2 | 前提: GitHub連携設定 |
| 3 | 0.3 | 前提: Devin連携設定 |
| 4 | 0.4 | 前提: Agent LLM設定 |
| 5 | 1.1 | 基盤: Slack連携とミーティング開始トリガー |
| 6 | 2.1 | 基盤: Agent間の対話機能 |
| 7 | 2.3 | 基盤: リポジトリ理解能力 |
| 8 | 2.2 | コア: ユーザー介入機能 |
| 9 | 3.1 | コア: Plan生成 |
| 10 | 3.2 | コア: Plan承認フロー |
| 11 | 4.1 | 連携: GitHub Issue作成 |
| 12 | 4.2 | 連携: Devinへの割り当て |
| 13 | 4.3 | 運用: 進捗通知 |
| 14 | 4.4 | 運用: エラーハンドリング |
| 15 | 3.3 | 運用: 議事録保存 |
| 16 | 1.2 | 拡張: リポジトリ指定 |
| 17 | 5.1 | 拡張: リポジトリ設定 |
| 18 | 5.2 | 拡張: リポジトリ切り替え |
