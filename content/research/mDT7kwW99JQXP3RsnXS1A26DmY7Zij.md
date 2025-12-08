---
date: 2025-12-08T00:00:00+09:00
draft: false
title: "AWS環境でAI Agentを使ったお問い合わせ対応システムの構成について調べてみた"
description: "Amazon Bedrock AgentCoreでマルチエージェント構成を調査"
tags: ["AWS", "AI", "Amazon Bedrock", "マルチエージェント", "カスタマーサポート"]
---

## 知りたかったこと

AWS環境でお問い合わせ対応をAI Agentにさせるためのマルチエージェント構成について知りたかった。

## 知りたいと思った理由

仕事でお問い合わせ対応をAI Agentに任せたいと考えている。
具体的には、
お問い合わせを最初にAI Agentが受け取り、
カテゴライズして専門のAgentにパスし、
対応できない場合はSlackでCSチームにエスカレーションする仕組みを作りたい。

## 参考にしたサイトやページ

[Amazon Bedrock AgentCore 公式](https://aws.amazon.com/bedrock/agentcore/)
[AgentCore 紹介ブログ（AWS公式）](https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-agentcore-securely-deploy-and-operate-ai-agents-at-any-scale/)
[マルチAIエージェントによる販売支援（日本語ブログ）](https://aws.amazon.com/jp/blogs/news/multi-aiagents-sales-support-with-bedrock-agentcore/)
[Customer Support シナリオ（公式ドキュメント）](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-customer-scenario.html)
[Agent Squad GitHubリポジトリ](https://github.com/awslabs/agent-squad)
[Amazon Bedrock マルチエージェントコラボレーション機能紹介](https://aws.amazon.com/jp/blogs/news/introducing-multi-agent-collaboration-capability-for-amazon-bedrock/)

## 調べた内容

- **Amazon Bedrock マルチエージェントコラボレーション**
    - 2024年12月にプレビュー発表、2025年3月にGA（一般提供）
    - 複数のAIエージェントが協調して複雑なタスクを処理できる
    - 構成モード
        - **Supervisor Mode**: 統括エージェントが全体を管理し、サブエージェントに作業を委任
        - **Supervisor Router Mode**: ルーティング特化で、適切なエージェントに直接振り分け
    - お問い合わせ対応では、Supervisor Agentが受付→カテゴリ判定→専門Agentへパスという流れが実現可能

- **Amazon Bedrock AgentCore**
    - 2025年7月プレビュー発表、2025年12月GA予定
    - Bedrock Agentsを**本番環境で大規模・安全に運用**するための基盤
    - フレームワーク・モデルは自由に選択可能（Mastra + Azure OpenAIも可能）
    - 主要コンポーネント
        - **AgentCore Runtime**: AIエージェントをホスティングするマネージドサービス
        - **AgentCore Memory**: 会話コンテキスト維持（短期記憶）＋顧客の好み（長期記憶）
        - **AgentCore Gateway**: マルチエージェントの協調制御
        - **AgentCore Policy**: エージェントの行動制限を自然言語で設定
        - **AgentCore Evaluations**: エージェントの品質を継続的に検査
    - AWS公式ドキュメントにカスタマーサポートAIエージェントのシナリオが用意されている

- **Agent Squad（旧Multi-Agent Orchestrator）**
    - AWS Labsが公開しているオープンソースフレームワーク
    - インテリジェント分類：エージェント特性と会話履歴から最適なエージェントを自動選定
    - コンテキスト管理：複数エージェント間で会話履歴を維持
    - Python/TypeScript両対応
    - Human-in-the-loop：複雑なケースは人間に検証を委ねる仕組み

- **想定されるお問い合わせ対応の構成**
    - Orchestrator Agent（AgentCore Gatewayで制御）がお問い合わせを受け取る
    - 内容をカテゴライズ
    - カテゴリごとの専門Agent（請求担当、技術サポート、一般問い合わせ等）にパス
    - 対応不可の場合はSlack通知でCSチームにエスカレーション

- **利用可能リージョン（AgentCore プレビュー）**
    - 米国東部（バージニア）
    - 米国西部（オレゴン）
    - アジアパシフィック（シドニー）
    - 欧州（フランクフルト）
    - ※東京リージョンは未対応

## わかったこと、わからなかったこと

わかったこととしては、
Amazon Bedrock AgentCoreを使えば、
マルチエージェント構成でお問い合わせ対応システムを構築できることが明確になった。
特にAgentCore Memory、
Gateway、
Policyなど本番運用に必要な機能が揃っており、
公式ドキュメントにカスタマーサポート向けのシナリオも用意されている点が心強い。

一方でわからなかったこととしては、
Slack通知の具体的な実装方法や、
AgentCoreの各機能（Memory、Gateway、Policy等）の詳しい使い方がまだ不透明。
また東京リージョンでの提供がまだのため、
レイテンシーの観点も今後検討が必要。
