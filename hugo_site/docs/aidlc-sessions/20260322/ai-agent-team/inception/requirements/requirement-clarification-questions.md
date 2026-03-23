---
title: "Requirements Clarification Questions"
date: 2026-03-22T00:00:00+09:00
draft: false
---

# Requirements Clarification Questions

回答を分析したところ、以下の点について追加確認が必要です。

---

## Clarification 1: Devinの役割について
Q2の回答で「planまで定ったらdevinにタスクを投げる」と記載がありました。
これはシステムアーキテクチャに大きく影響する重要なポイントです。

### Clarification Question 1
Devinとの連携について、具体的にどのようなイメージですか？

A) AI Agentチームが要件整理・設計・タスク分解を行い、実装はDevinに丸投げする（AI AgentチームはコードGenerationしない）
B) AI Agentチームが要件整理・設計・タスク分解を行い、各タスクをDevin APIを通じて自動的にDevinに投げる
C) AI Agentチームが要件整理・設計を行い、簡単なタスクは自前で実装し、複雑なタスクはDevinに投げる
D) Other (please describe after [Answer]: tag below)

[Answer]: Aのイメージです。

## Clarification 2: Slack上のAgent Meeting フロー
Q2の回答から「Slack上でAI Agent同士がmeetingする」イメージが見えました。

### Clarification Question 2
Slack上でのAgent Meeting中、ユーザー（あなた）の関わり方はどのようなイメージですか？

A) Agentが自動でmeeting進行し、最終planのみユーザーに承認を求める
B) Agentのmeeting途中でもユーザーが介入・方向修正できるインタラクティブ形式
C) Agentが各ステップでユーザーに確認を取りながら進める（ステップバイステップ）
D) Other (please describe after [Answer]: tag below)

[Answer]: Bが理想です！Cでもいいかなというイメージ。

## Clarification 3: Strands Agents フレームワーク
Q9で「Strands Agentsフレームワーク」の希望がありました。

### Clarification Question 3
Strands Agents（AWS）を採用した場合、実行環境はAWSが前提になりますが問題ないですか？

A) はい、AWSで問題ない
B) AWSでなくても動くなら他のクラウドも検討したい
C) Strands Agentsは希望だが、制約があるなら他のフレームワークでもOK
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Clarification 4: MVP優先度の確認
Q8で「AとBですかね」と両方を選択されました。

### Clarification Question 4
MVPの最初のイテレーションとして、どちらを先に実装すべきですか？

A) まずSlack連携を先に作り、その上にAgent間連携を構築する
B) まずAgent間連携の仕組みを先に作り、後からSlackをインターフェースとして接続する
C) 両方同時に進める（並行開発）
D) Other (please describe after [Answer]: tag below)

[Answer]: Bの場合は一旦ローカルでできるイメージですかね？今回の肝はslack上でのやりとりなのでAがいいかなーと思っているのでCかもしれないです

