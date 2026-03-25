---
title: "Requirements Verification Questions"
date: 2026-03-22T00:00:00+09:00
draft: false
---
「AI Agentチームを作りたい」というリクエストについて、以下の質問に回答をお願いします。
各質問の `[Answer]:` の後に選択肢の文字を記入してください。

---

## Question 1
このシステムの主なユーザーは誰ですか？

A) 自分個人（個人開発用ツール）
B) 小規模チーム（2-5人）
C) 中規模チーム（5-20人）
D) 組織全体
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
Slackでのやりとりの具体的なイメージを教えてください。

A) Slackチャンネルに要件を投稿すると、AI Agentが自動で応答・質問してくれる
B) Slack BotにDMで相談すると、AI Agentが応答してくれる
C) Slackスレッド内でAI Agentチームの各メンバー（要件定義Agent、設計Agent、実装Agentなど）が順番に対話する
D) Slackは通知・報告の場で、実際の開発作業は別のシステムで行う
E) Other (please describe after [Answer]: tag below)

[Answer]: 悩ましい...Aが理想ですが、進捗確認や細かいやりとり含めてやりたいので、Cもいいなーと思いました。要は要件を渡したらAI Agentとslack上でmeeting始まってplanまで定ったらdevinにタスクを投げるみたいなイメージです。

## Question 3
「開発まで進めてくれる」の範囲はどこまでですか？

A) 要件整理・設計ドキュメント生成まで（コード生成なし）
B) コード生成まで（PRの作成含む）
C) コード生成 + テスト実行 + PRの作成・レビューまで
D) コード生成 + テスト + デプロイまで（フルCI/CD）
E) Other (please describe after [Answer]: tag below)

[Answer]: CのPRの作成までです。レビューはまた別にしようかなと。

## Question 4
AI Agentの基盤となるLLMは何を想定していますか？

A) Claude API（Anthropic）
B) OpenAI API（GPT-4等）
C) 複数のLLMを組み合わせて使いたい
D) 特にこだわりなし（おすすめに任せる）
E) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 5
「AI Agentチーム」の構成イメージを教えてください。

A) 1つのAgentがすべてのタスク（要件整理、設計、実装）を担当
B) 役割別Agent（例: PM Agent、設計Agent、実装Agent）が連携する
C) タスク種別Agent（例: フロントエンドAgent、バックエンドAgent、テストAgent）が連携する
D) 役割別 + タスク種別の組み合わせ
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 6
開発対象のリポジトリはどこにありますか？

A) GitHub（パブリック / プライベート）
B) GitLab
C) まだ決まっていない
D) このリポジトリ自体を対象にしたい
E) Other (please describe after [Answer]: tag below)

[Answer]: GitHubにおく想定です。

## Question 7
デプロイ先・実行環境はどこを想定していますか？

A) ローカルマシン（開発用として）
B) クラウド（AWS / GCP / Azure）
C) コンテナ（Docker / Kubernetes）
D) サーバーレス（Lambda / Cloud Functions等）
E) Other (please describe after [Answer]: tag below)

[Answer]: クラウドになると思いますが、要件次第かなと。

## Question 8
最初のMVP（最小限の実用的な製品）として、どの機能を最優先にしますか？

A) Slack連携（Slackからの入力受付・応答）
B) AI Agent間の連携・オーケストレーション
C) コード生成機能
D) 要件整理・設計ドキュメント生成
E) Other (please describe after [Answer]: tag below)

[Answer]: AとBですかね

## Question 9
既存のAI Agent フレームワークの利用について。

A) Claude Agent SDK を使いたい
B) LangChain / LangGraph を使いたい
C) CrewAI / AutoGen などのマルチエージェントフレームワークを使いたい
D) フレームワークなしで自前実装したい
E) Other (please describe after [Answer]: tag below)

[Answer]: 要件に最適なフレームワークでいいかなと。個人的に仕事でStrands Agentsフレームワークを使うので、それが嬉しいです。

## Question 10: Security Extensions
このプロジェクトにセキュリティ拡張ルールを適用しますか？

A) Yes — すべてのSECURITYルールをブロッキング制約として適用する（本番グレードのアプリケーション推奨）
B) No — SECURITYルールをスキップする（PoC、プロトタイプ、実験的プロジェクト向け）
C) Other (please describe after [Answer]: tag below)

[Answer]: B セキュリティはまだ考えなくていいです。
