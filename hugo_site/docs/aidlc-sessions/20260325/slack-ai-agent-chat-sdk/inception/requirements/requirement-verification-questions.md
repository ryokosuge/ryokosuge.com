---
title: "Requirements Clarification Questions"
date: 2026-03-25T00:00:00+09:00
draft: false
---
# Requirements Clarification Questions

以下の質問に回答してください。各質問の `[Answer]:` タグの後にアルファベットを記入してください。

※ 対話途中で質問を修正。最終的に以下の質問と回答で確定。

## Question 1
Claude Agent SDKのエージェントにはどのような機能を持たせたいですか？

A) シンプルな会話のみ（ツール利用なし）
B) Web検索やファイル読み込みなどのツールを利用した会話
C) 特定のドメイン知識（RAG等）を持たせたエージェント
D) 複数エージェントの協調（マルチエージェント）
E) Other (please describe after [Answer]: tag below)

[Answer]: A, B, C, D

## Question 2
会話の永続化（状態管理）はどうしますか？

A) メモリ内（再起動で消える、まずはシンプルに）
B) Redis
C) PostgreSQL
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
デプロイ先はどこですか？

A) Vercel
B) Cloudflare Workers
C) 自前サーバー（VPS等）
D) Other (please describe after [Answer]: tag below)

[Answer]: D (AWS)

## Question 4
既存Hugo静的サイト（ryokosuge.com）との関係は？

A) 同じリポジトリ内に共存（モノレポ）
B) 別リポジトリとして独立
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5: Security Extensions
Security extension rulesをこのプロジェクトに適用しますか？

A) Yes — すべてのSECURITYルールをブロッキング制約として適用（本番グレードのアプリケーション向け推奨）
B) No — SECURITYルールをスキップ（PoC、プロトタイプ、実験的プロジェクト向け）
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Additional Notes
- 使用SDK: vercel/chat (https://github.com/vercel/chat) — Slack等マルチプラットフォームチャットボットSDK
- バックエンド: Claude Agent SDK
- プラットフォーム: Slack bot
- スコープ: 今回は設計までで大丈夫
