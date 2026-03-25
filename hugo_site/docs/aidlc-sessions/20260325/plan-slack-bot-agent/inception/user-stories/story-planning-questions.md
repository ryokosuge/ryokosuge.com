---
title: "User Stories Planning Questions"
date: 2026-03-25T00:00:00+09:00
draft: false
---

# User Stories Planning Questions

ユーザーストーリー作成にあたり、以下の質問にお答えください。
各質問の `[Answer]:` の後に選択肢の記号を記入してください。

---

## Question 1
このSlack Botの主なユーザーはどのような人ですか？

A) 開発チームのエンジニア（技術的な質問や相談に使用）
B) 社内の全従業員（一般的な質問や業務サポートに使用）
C) 特定のプロジェクトチーム（プロジェクト固有のタスクに使用）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
Botへのメンション時、ユーザーはどのような種類のメッセージを送ることを想定していますか？

A) 短い質問（1〜2文程度）が中心
B) 長い文脈付きの相談（コードスニペット含む）が中心
C) 短い質問と長い相談の両方
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 3
ストリーミング応答の表示について、ユーザーにどのような体験を提供したいですか？

A) リアルタイムにテキストが流れるように表示される（更新頻度高め）
B) 数秒ごとにまとめて更新される（Slack APIへの負荷軽減重視）
C) 「考え中...」→ 完了後に一括表示（シンプルさ重視）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
エラーが発生した場合、ユーザーにどのように伝えるべきですか？

A) 詳細なエラー情報をスレッドに表示する（デバッグしやすい）
B) ユーザーフレンドリーな簡潔なメッセージのみ表示する（「エラーが発生しました。再度お試しください」）
C) エラー種別に応じて表示を切り替える（リトライ可能なものは案内付き、致命的なものは簡潔に）
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
ストーリーの粒度（サイズ）はどの程度が適切ですか？

A) 粗い粒度（機能要件1つにつき1ストーリー程度、5〜6ストーリー）
B) 中程度の粒度（機能を適度に分割、8〜12ストーリー）
C) 細かい粒度（具体的なシナリオごとに分割、15ストーリー以上）
D) Other (please describe after [Answer]: tag below)

[Answer]: C
