---
title: "Requirements Clarification Questions"
date: 2026-03-16T00:00:00+09:00
draft: false
---

# Requirements Clarification Questions

AI Agentによる電話会話PoCの要件を明確にするため、以下の質問にお答えください。
各質問の `[Answer]: ` タグの後に選択肢の記号を記入してください。

## Question 1
AI Agentの会話に使用するLLMプロバイダーはどれですか？

A) OpenAI (GPT-4o / GPT-4o-mini)
B) Anthropic (Claude)
C) Google (Gemini)
D) 特にこだわりなし（おすすめで進めてほしい）
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 2
電話の発信に使用するテレフォニーサービスはどれですか？

A) Twilio
B) Vonage (Nexmo)
C) Amazon Connect
D) 特にこだわりなし（おすすめで進めてほしい）
E) Other (please describe after [Answer]: tag below)

[Answer]: D（日本語でやってみたい）

## Question 3
音声合成（Text-to-Speech）と音声認識（Speech-to-Text）のプロバイダーはどれを想定していますか？

A) OpenAI (Whisper / TTS)
B) Google Cloud Speech / TTS
C) Amazon Polly / Transcribe
D) ElevenLabs (TTS) + Whisper (STT)
E) 特にこだわりなし（おすすめで進めてほしい）
F) Other (please describe after [Answer]: tag below)

[Answer]: E

## Question 4
PoCの主な利用シーンはどのようなものですか？

A) カスタマーサポート（問い合わせ対応）
B) 予約受付・確認
C) アウトバウンドセールス（営業電話）
D) リマインダー・通知（一方的な情報伝達）
E) 汎用的な会話デモ（特定のユースケースなし）
F) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 5
バックエンドの実装言語はどれを希望しますか？

A) TypeScript (Node.js)
B) Python
C) Go
D) 特にこだわりなし（おすすめで進めてほしい）
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 6
PoCのスコープとして、どの範囲を想定していますか？

A) AI Agentが発信して一方的にメッセージを伝える（シンプル）
B) AI Agentが発信して双方向の会話ができる（リアルタイム対話）
C) 着信を受けてAI Agentが応対する（インバウンド）
D) 発信・着信両方に対応する
E) Other (please describe after [Answer]: tag below)

[Answer]: Bまでできたら嬉しい

## Question 7
リアルタイム音声ストリーミング（WebSocket等）は必要ですか？それともシンプルな録音→テキスト変換→応答生成→音声再生の方式でよいですか？

A) リアルタイムストリーミング（低遅延の自然な会話を重視）
B) シンプルな方式（PoCなので遅延は許容、実装のシンプルさを重視）
C) 特にこだわりなし（おすすめで進めてほしい）
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 8
デプロイ先の環境はどこを想定していますか？

A) ローカル開発環境のみ（PoCなのでローカルで動けばOK）
B) AWS
C) Google Cloud
D) Vercel / Railway 等のPaaS
E) 特にこだわりなし（おすすめで進めてほしい）
F) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9: Security Extensions
Security extension ルールをこのプロジェクトに適用しますか？

A) Yes — すべてのSECURITYルールをブロッキング制約として適用する（本番品質のアプリケーション向け推奨）
B) No — SECURITYルールをスキップする（PoC、プロトタイプ、実験的プロジェクト向け）
C) Other (please describe after [Answer]: tag below)

[Answer]: B
