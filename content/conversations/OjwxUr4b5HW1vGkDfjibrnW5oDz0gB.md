---
date: 2025-12-23T04:23:33+09:00
draft: false
title: "tmuxを使ったClaude Codeの並列開発環境の調査"
description: "tmuxとClaude Codeを組み合わせた並列開発環境について調査。Git Worktreesとの組み合わせ方法、Claude Squad、dmux、Uziなどの主要ツール、ベストプラクティスと注意点をまとめた。"
tags:
  - tmux
  - Claude Code
  - 並列開発
  - Git Worktrees
  - Claude Squad
---

## 会話ログ

### 2025-12-23 04:20:00

**User**: tmuxを使ったclaude codeの並列開発みたいな環境構築について色々調べて欲しいです！

**Claude**: tmuxを使ったClaude Codeの並列開発環境について調査しますね。複数の観点から調べてみます。

Web検索とClaude Code Guideを使って情報収集を行いました。

## tmux + Claude Code 並列開発 調査結果

### 基本コンセプト

tmuxとClaude Codeを組み合わせることで、**複数のAIエージェントを同時に稼働させる並列開発**が可能になります。

**主なメリット：**
- 複数タスクの同時処理（Feature開発 + バグ修正 + テスト作成など）
- セッション永続化（ターミナルを閉じても作業継続）
- コンテキスト分離（各セッションが独立したコンテキストを持つ）

---

### 推奨アーキテクチャ: tmux + Git Worktrees

**最も安定した構成**は、tmuxと**Git Worktrees**の組み合わせです。

```bash
# 1. Worktree作成（各ブランチが独立したディレクトリに）
git worktree add ../project-feature-a -b feature-a
git worktree add ../project-bugfix -b bugfix-123

# 2. 各Worktreeでtmuxセッション起動
tmux new-session -d -s "feature-a" -c ~/project-feature-a
tmux new-session -d -s "bugfix" -c ~/project-bugfix

# 3. Claude Code起動
tmux send-keys -t "feature-a" "claude" Enter
tmux send-keys -t "bugfix" "claude" Enter

# セッション一覧確認
tmux list-sessions
```

**なぜWorktreesが必要か：** 同じディレクトリで複数セッションを動かすと、同じファイルを同時編集してしまいマージ競合が発生します。

---

### 主要ツール比較

| ツール | 特徴 | 向いているケース |
|--------|------|-----------------|
| **Claude Squad** | TUIで複数エージェントを視覚的に管理、`cs`コマンドで起動 | 手軽に始めたい人 |
| **dmux** | AI自動ブランチ命名、スマートマージ機能 | AI統合を重視 |
| **Uzi** | 3-5エージェント同時起動、各エージェントに専用ポート割当 | 大規模並列処理 |
| **Claude Code Agent Farm** | 最大50エージェント、ロック機構で競合防止 | エンタープライズ規模 |
| **ccswitch** | セッションを `~/.ccswitch/` に集約管理 | ディレクトリを綺麗に保ちたい |

---

### クイックスタート（Claude Squad）

最も簡単な方法は**Claude Squad**を使うことです：

```bash
# macOS
brew tap smtg-ai/claude-squad
brew install claude-squad

# または汎用インストール
curl -fsSL https://raw.githubusercontent.com/smtg-ai/claude-squad/main/install.sh | bash

# 起動
cs
```

**操作キー：**
- `n` - 新規セッション作成
- `↑/↓` - セッション選択
- `o` - 選択セッションに接続（作業開始）
- `s` - コミット＆プッシュ
- `D` - セッション削除

---

### 注意点・制限事項

1. **APIレート制限**: 複数セッション同時実行でレート制限に達する可能性
   - 対策: セッション起動を10-30秒ずらす

2. **コンテキストウィンドウ**: 長時間セッションでcontextが満杯に
   - 対策: `/clear`で定期リセット、または`/compact`で要約

3. **推奨同時セッション数**: 2-4セッション
   - 5以上はPCスペック依存（M1/M2 Macで4-6程度安定）

4. **セッション間の情報共有なし**: Session Aの学習はSession Bに引き継がれない
   - 対策: CLAUDE.mdに共通知識を記載

---

### 実用的なワークフロー例

```bash
#!/bin/bash
# parallel-dev.sh - 並列開発セットアップスクリプト

PROJECT_DIR=$(pwd)

# Feature Aのworktree + tmuxセッション
git worktree add $PROJECT_DIR/worktrees/feature-a -b feature-a 2>/dev/null
tmux new-session -d -s "feature-a" -c $PROJECT_DIR/worktrees/feature-a
tmux send-keys -t "feature-a" "claude 'Implement user authentication'" Enter

sleep 15  # レート制限対策

# Feature Bのworktree + tmuxセッション
git worktree add $PROJECT_DIR/worktrees/feature-b -b feature-b 2>/dev/null
tmux new-session -d -s "feature-b" -c $PROJECT_DIR/worktrees/feature-b
tmux send-keys -t "feature-b" "claude 'Build dashboard components'" Enter

echo "Sessions started:"
tmux list-sessions
echo "Attach with: tmux attach -t feature-a"
```

---

### Sources

- [Geeky Gadgets: Claude Code + Tmux for Continuous Workflows](https://www.geeky-gadgets.com/making-claude-code-work-247-using-tmux/)
- [Ona: How to run Claude Code in parallel](https://ona.com/stories/parallelize-claude-code)
- [GitButler Blog: Managing Multiple Claude Code Sessions](https://blog.gitbutler.com/parallel-claude-code)
- [GitHub: Claude Squad](https://github.com/smtg-ai/claude-squad)
- [GitHub: dmux](https://github.com/formkit/dmux)
- [GitHub: Claude Code Agent Farm](https://github.com/Dicklesworthstone/claude_code_agent_farm)
- [Simon Willison: Embracing the parallel coding agent lifestyle](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/)
- [Anthropic: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

---

### 2025-12-23 04:22:00

**User**: すみません、スラッシュコマンド教えて

**Claude**: タイポですね！正しくは `/save-conversation` です（`v`が抜けてました）。

## このプロジェクトで使えるスラッシュコマンド

| コマンド | 説明 |
|---------|------|
| `/daily` | 日報作成をサポート |
| `/english` | 英会話練習とコア・スクリプト作成 |
| `/research` | 調べ物まとめ作業をサポート |
| `/save-conversation` | 会話をブログ記事として保存 |
| `/pr` | Pull Request作成をサポート |
| `/plan` | 実装計画のワークフロー |

### Speckit系（設計・仕様書関連）
- `/speckit.specify` - 仕様書作成
- `/speckit.clarify` - 仕様の曖昧な点を質問
- `/speckit.plan` - 実装計画作成
- `/speckit.tasks` - タスク一覧生成
- `/speckit.checklist` - チェックリスト生成
- `/speckit.analyze` - 仕様書の整合性分析
- `/speckit.implement` - 実装実行
- `/speckit.constitution` - プロジェクト憲法作成
