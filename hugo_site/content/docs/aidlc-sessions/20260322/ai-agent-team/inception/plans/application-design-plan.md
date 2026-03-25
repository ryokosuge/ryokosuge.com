---
title: "Application Design Plan"
date: 2026-03-22T00:00:00+09:00
draft: false
---
## Plan Overview
AI Agent Teamシステムのコンポーネント設計・サービス層設計・依存関係定義を行う。

## Execution Steps

### Phase 1: Component Identification
- [x] コンポーネント一覧の定義
- [x] 各コンポーネントの責務定義
- [x] コンポーネント間インターフェース定義

### Phase 2: Component Methods
- [x] 各コンポーネントのメソッドシグネチャ定義
- [x] 入出力型の定義

### Phase 3: Service Layer Design
- [x] サービス定義とオーケストレーション
- [x] Agent間通信パターンの定義

### Phase 4: Dependency & Data Flow
- [x] コンポーネント依存関係の整理
- [x] データフロー図の作成

### Phase 5: Consolidation
- [x] application-design.md（統合ドキュメント）の作成

---

## Design Questions

以下の質問に回答をお願いします。設計判断に直結するポイントのみに絞っています。

### Question 1
Agentオーケストレーションのパターンについて。Agent間の議論フローをどう制御しますか？

A) Orchestrator型: 中央のOrchestratorが各Agentの発言順序・タイミングを制御する
B) Event-driven型: 各Agentがイベント（他Agentの発言）に反応して自律的に発言する
C) Round-robin型: 決まった順番（PM→Design→Task→PM...）で発言を回す
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Agent間のコンテキスト共有について。ミーティング中、各Agentはどのように会話コンテキストを共有しますか？

A) 共有メモリ: 全Agentが同一のコンテキスト（会話履歴+状態）にアクセスする
B) メッセージパッシング: Slackスレッドのメッセージ履歴をそのまま各Agentの入力にする
C) Orchestratorが要約: Orchestratorが会話を要約して各Agentに渡す
D) Other (please describe after [Answer]: tag below)

[Answer]: Bでいいかなーと思ってるんだけど、他にいい案あるかな？

### Question 3
ミーティング状態の管理について。進行中のミーティングの状態（フェーズ、議題、結論等）はどこで管理しますか？

A) インメモリ（プロセス内）: シンプルだがプロセス再起動で失われる
B) データベース（DynamoDB等）: 永続的だが追加インフラが必要
C) Slackスレッドのメタデータ: Slack自体を状態ストアとして利用
D) Other (please describe after [Answer]: tag below)

[Answer]: Slackで良さそう

### Question 4
Slack連携のアーキテクチャについて。Slack Appの通信方式はどちらを想定していますか？

A) Socket Mode: WebSocket接続、ファイアウォール内でも動作、公開URLが不要
B) HTTP Mode (Events API): HTTPエンドポイントが必要、スケーラブル
C) よくわからないのでおすすめに任せる
D) Other (please describe after [Answer]: tag below)

[Answer]: 一旦はsocket modeでいいかなーと思ったけど、本番はBのプランになりそう


### Question 5
設定情報の管理について。チャンネル-リポジトリ紐付けやLLM設定などの設定はどこに保存しますか？

A) 設定ファイル（YAML/JSON）: シンプル、コードと一緒に管理
B) データベース（DynamoDB等）: 動的変更可能、Slackコマンドで設定変更
C) 環境変数 + 設定ファイルのハイブリッド
D) Other (please describe after [Answer]: tag below)

[Answer]: ここ、最適解がわからないのでいい感じに！

