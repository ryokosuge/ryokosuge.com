---
title: "Requirements Deep-Dive Questions"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Requirements Deep-Dive Questions

以下は、設計・実装フェーズで困らないために今のうちに詰めておくべきポイントです。

---

## Question 1
Devin APIの利用について。DevinにはAPI（REST API）がありますが、タスク投入の方法をどう想定していますか？

A) Devin APIを直接呼び出してタスクを投入する（自動化）
B) DevinのSlack連携を利用し、SlackメッセージでDevinにタスクを渡す
C) まだDevin APIの詳細を把握していないので、調査から始めたい
D) Other (please describe after [Answer]: tag below)

[Answer]: Bのイメージです！GitHub issueとかにタスクを書き出して、それを渡すイメージした。

## Question 2
Agent Meeting中の「対話」の粒度について。Slack上でAgent同士が議論する際、各メッセージの長さ・頻度はどのようなイメージですか？

A) 短いメッセージを頻繁にやりとり（チャットっぽく、1メッセージ数行）
B) まとまった分析結果を各Agentが順番に投稿（1メッセージが段落レベル）
C) 要点のみ簡潔に、最終的なPlanドキュメントを重視
D) Other (please describe after [Answer]: tag below)

[Answer]: Aですね、長く書くイメージないです

## Question 3
Agent Meetingの成果物（Plan）のフォーマットについて。Devinに渡すタスク仕様はどの程度の詳細さが必要ですか？

A) タスクタイトル + 簡単な説明文（Devinに詳細は任せる）
B) 要件・設計方針・実装指示を含む詳細な仕様書
C) PRD（Product Requirements Document）レベルのドキュメント
D) Other (please describe after [Answer]: tag below)

[Answer]: CよりのBです！

## Question 4
Agent構成の具体的なイメージについて。役割別+タスク種別の組み合わせとのことでしたが、MVP段階ではどこまでの構成にしますか？

A) 最小構成: PM Agent + 実装計画Agent の2体でスタート
B) 基本構成: PM Agent + 設計Agent + タスク分解Agent の3体
C) フル構成: PM Agent + 設計Agent + タスク分解Agent + フロント/バック/テスト専門Agent
D) Other (please describe after [Answer]: tag below)

[Answer]: Bまで行けるといいなーと思ってます

## Question 5
既存プロジェクトへの対応について。AI Agentチームは対象リポジトリの既存コードを読み解く必要がありますか？

A) はい、既存コードベースを理解した上で要件整理・設計を行ってほしい
B) いいえ、新規機能の要件・設計のみ行い、既存コードの理解はDevinに任せる
C) ケースバイケースで選べるようにしたい
D) Other (please describe after [Answer]: tag below)

[Answer]: Aです

## Question 6
ミーティング結果の永続化について。Agent Meetingの議事録やPlanはどこに保存しますか？

A) Slackスレッドの履歴のみ（別途保存しない）
B) GitHubリポジトリにMarkdownとしてコミット
C) 外部ストレージ（S3, DynamoDB等）に保存
D) Other (please describe after [Answer]: tag below)

[Answer]: Bでいいかなーと思ってます

## Question 7
複数プロジェクト対応について。このシステムは複数のGitHubリポジトリに対して使いたいですか？

A) 当面は1つのリポジトリ固定で使う
B) 複数リポジトリに対して使いたい（チャンネルごとに対象リポジトリを設定）
C) 将来的には複数対応したいが、MVPでは1リポジトリでOK
D) Other (please describe after [Answer]: tag below)

[Answer]: Bを前提にしてます！！

