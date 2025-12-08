---
date: 2025-12-08T02:32:18+09:00
draft: false
title: "Amazon Bedrock AgentCoreの各機能とSlack連携について調べてみた"
description: "AgentCore Memory/Gateway/PolicyとSlack通知の実装方法を調査"
tags: ["AWS", "AI", "Amazon Bedrock", "AgentCore", "Slack"]
---

## 知りたかったこと

Amazon Bedrock AgentCoreの各機能（Memory、Gateway、Policy）の詳細な使い方と、Slack通知によるエスカレーションの実装パターンについて知りたかった。

## 知りたいと思った理由

前回の調査でAgentCoreを使ったマルチエージェント構成でお問い合わせ対応システムが作れることはわかった。
しかし、各機能の具体的な使い方や、対応できない場合にSlackでCSチームにエスカレーションする実装方法がまだ不透明だったため、詳細を調べたかった。

## 参考にしたサイトやページ

- [Amazon Bedrock AgentCore 公式ページ](https://aws.amazon.com/bedrock/agentcore/)
- [AgentCore Policy & Evaluations 発表（AWS公式）](https://aws.amazon.com/blogs/aws/amazon-bedrock-agentcore-adds-quality-evaluations-and-policy-controls-for-deploying-trusted-ai-agents/)
- [slack-app-integration-with-bedrock-agent（GitHub）](https://github.com/aws-samples/slack-app-integration-with-bedrock-agent)
- [Integrate Amazon Bedrock Agents with Slack（AWS公式）](https://aws.amazon.com/blogs/machine-learning/integrate-amazon-bedrock-agents-with-slack/)
- [AgentCore Runtime A2A プロトコル](https://aws.amazon.com/blogs/machine-learning/introducing-agent-to-agent-protocol-support-in-amazon-bedrock-agentcore-runtime/)

## 調べた内容

### AgentCore Memory（メモリ機能）

- AIエージェントに「記憶」を持たせるマネージドサービス
- 3種類のメモリタイプ
    - **Short-term Memory（短期記憶）**
        - セッション中の会話履歴を保持
        - `session_id` で管理
    - **Long-term Memory（長期記憶）**
        - 顧客の好みなど永続的な情報を保持
        - `actor_id`（ユーザー単位）で管理
    - **Episodic Memory（エピソード記憶）**
        - 経験から学習し適応する
        - より人間らしいインタラクションを実現
- お問い合わせ対応での活用
    - 過去のやり取りを覚えておくことでパーソナライズされた対応が可能
    - 顧客の問い合わせ傾向や好みを記憶

### AgentCore Gateway（ゲートウェイ機能）

- API、Lambda関数、外部サービスを **MCP（Model Context Protocol）互換のツール** に変換
- エージェントから簡単に外部ツールを呼び出せるようにする
- 提供する機能
    - 認証・認可
    - スロットリング（レート制限）
    - カスタムリクエスト/レスポンス変換
    - マルチテナンシー
    - ツール選択
- Slack APIもGateway経由でツールとして登録可能

### AgentCore Policy（ポリシー機能）※2025年12月発表

- エージェントの行動を制御するルールを設定
- **自然言語でポリシーを作成** → 自動でCedar（AWSのポリシー言語）に変換
- AgentCore Gatewayと統合し、すべてのツール呼び出しをリアルタイムでインターセプト
- 設定方法
    1. AgentCoreコンソールでポリシーエンジンを作成
    2. 1つ以上のAgentCoreゲートウェイに関連付け
    3. 強制モード or ログのみモードを選択
- ポリシー例
    - 「返金額が$1,000を超える場合はすべての払い戻しをブロック」
    - 「$100以下は自動対応、それ以上は人間にエスカレーション」
- **Human-in-the-loop** の実現
    - 特定条件で自動処理を止めて人間に確認を求める設定が可能

### AgentCore Identity

- OAuth 2.0で外部サービスと安全に連携
- 対応サービス
    - GitHub
    - Salesforce
    - **Slack**
    - Google
    - その他サードパーティ
- トークン管理を自動化

### Slack通知の実装パターン

- AWS公式サンプル：slack-app-integration-with-bedrock-agent（HR Assistant）
- アーキテクチャ
    1. Slack → API Gateway → Lambda → Bedrock Agent → Knowledge Base
    2. Lambda関数がSlackとBedrock Agentの橋渡し
    3. DynamoDB（Eventsテーブル）に会話履歴を保存
- Lambda関数の役割
    - Slackからのイベント受信・検証
    - Bedrock Agentの呼び出し（BedrockAgentId, BedrockAliasIdで指定）
    - DynamoDBへの読み書き
- 必要な権限
    - Lambda実行ロールに「invoke Bedrock alias」権限
    - DynamoDB読み書きアクセス
    - Slack event subscription（message.channels）

### エスカレーションの実装方法

- PolicyでブロックしつつSlack APIを呼び出して通知
    - 例：「対応できない」と判定されたらSlackチャンネルに通知
- AgentCore Identity経由でSlack OAuth連携
- Action Groupsを使って外部システム（HRMS等）との連携も可能

### 利用可能リージョン

- AgentCoreは9つのリージョンで利用可能
    - Asia Pacific: Mumbai, Singapore, Sydney, **Tokyo**
    - Europe: Dublin, Frankfurt
    - US: N. Virginia, Ohio, Oregon
- **東京リージョンも対応済み！**

## わかったこと、わからなかったこと

### わかったこと

AgentCoreの各機能の役割と使い方が明確になった。
Memoryは短期・長期・エピソード記憶の3種類があり、顧客対応のパーソナライズに活用できる。
Gatewayは外部APIをMCP互換ツールに変換し、Policyで行動制御が可能。
特にPolicyは自然言語でルールを書けるため、非エンジニアでも設定しやすい。
Slack連携はAWS公式のGitHubサンプルがあり、API Gateway + Lambda + Bedrock Agentの構成で実現できる。
また、東京リージョンも対応済みであることがわかり、レイテンシーの懸念も解消された。

### わからなかったこと

Policyでブロックした際のSlack通知の具体的なコード実装はまだ確認できていない。
実際に構築する際は、GitHubサンプルをベースにカスタマイズしていく必要がある。
