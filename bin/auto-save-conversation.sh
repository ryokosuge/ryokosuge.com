#!/bin/bash

# 会話自動保存Hook
# SessionEndまたはPreCompactイベントで実行され、会話を自動的にconversationsとして保存します

set -e

# 無限ループ対策: 環境変数でフラグ管理
if [ -n "$CLAUDE_HOOK_RUNNING" ]; then
  echo "⏭️  Hook already running, skipping to prevent infinite loop"
  exit 0
fi

# Hookが実行中であることを示すフラグを設定
export CLAUDE_HOOK_RUNNING=1

# デバッグログ（必要に応じてコメントアウト）
# echo "🔄 Auto-save conversation hook triggered"

# /save-conversation コマンドを実行
# Claude Codeのコマンド実行には、クライアント経由で実行する必要があります
# このスクリプトは実際にはClaude Codeによって解釈され、
# コマンド実行のトリガーとして機能します

echo "/save-conversation"

# 正常終了
exit 0
