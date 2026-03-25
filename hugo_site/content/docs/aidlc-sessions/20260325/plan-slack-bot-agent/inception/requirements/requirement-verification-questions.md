---
title: "Requirements Verification Questions"
date: 2026-03-25T00:00:00+09:00
draft: false
---
## Question 1
Botの主な用途は何ですか？

A) 汎用チャットボット（質問応答、会話、情報提供）
B) コーディングエージェント（コード生成、レビュー、デバッグ支援）
C) 業務自動化エージェント（ツール使用によるタスク実行）
D) A + B の組み合わせ（会話 + コーディング支援）
E) A + C の組み合わせ（会話 + 業務自動化）
F) Other

[Answer]: E

---

## Question 2
Botとの対話方法は？

A) チャンネル内 @メンションのみ
B) DMのみ
C) @メンション + DM 両方
D) スラッシュコマンドも含む
E) Other

[Answer]: A

---

## Question 3
Slack接続方式は？

A) Socket Mode（パブリックURL不要、社内ツール向け）
B) HTTP Mode（Webhook必要、Marketplace公開可能）
C) Other

[Answer]: A

---

## Question 4
スレッド内の会話コンテキスト維持は？

A) スレッドごとにセッション作成、会話履歴維持
B) メッセージごとに独立（コンテキスト不要）
C) Other

[Answer]: A

---

## Question 5
Claude Agent SDK v2でのツール使用は？

A) ツールなし（純粋な会話のみ）
B) 基本的なツール（Web検索、ファイル読み込みなど）
C) カスタムツールで業務特化の機能
D) まだ決めていない（拡張可能な設計で）
E) Other

[Answer]: D

---

## Question 6
応答のSlack表示方式は？

A) 全文完成後に一括投稿
B) ストリーミング表示（リアルタイム更新）
C) まずは一括投稿で、後からストリーミング対応可能な設計
D) Other

[Answer]: B

---

## Question 7
セッション（会話履歴）の永続化は？

A) インメモリのみ（再起動でリセット）
B) 外部ストレージに永続化（Redis、SQLite等）
C) まだ決めていない（拡張可能な設計で）
D) Other

[Answer]: C

---

## Question 8
デプロイ環境は？

A) ローカル開発環境のみ
B) クラウドサーバー（EC2, GCE等）
C) コンテナ（Docker / K8s）
D) サーバーレス ※Socket Modeと非互換
E) まだ決めていない
F) Other

[Answer]: A

---

## Question 9
ツール実行の権限承認機能（Approve/Denyボタン）は？

A) 必要
B) 不要（自動承認）
C) まだ決めていない（後で追加可能な設計で）
D) Other

[Answer]: C

---

## Question 10
エラーハンドリング・モニタリングの水準は？

A) 最小限（コンソールログ + Slackエラー表示）
B) 標準（構造化ログ + エラー通知 + ヘルスチェック）
C) 包括的（ログ基盤連携 + メトリクス + アラート）
D) Other

[Answer]: A

---

## Question 11
マルチワークスペース対応は？

A) 単一ワークスペースのみ
B) 複数ワークスペース対応（将来的に）
C) Other

[Answer]: A

---

## Question 12: Security Extensions
Should security extension rules be enforced for this project?

A) Yes（本番グレードとしてセキュリティルールを強制）
B) No（PoC/プロトタイプ向けでスキップ）
X) Other

[Answer]: B

---
