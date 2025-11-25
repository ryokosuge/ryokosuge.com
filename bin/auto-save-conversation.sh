#!/bin/bash

# 会話自動保存Hook
# SessionEndイベントで実行され、会話を自動的にconversationsとして保存します
# /save-conversationコマンドと同等の出力を生成します

set -e

LOG_FILE="/tmp/claude-hook-debug.log"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
CONTENT_DIR="$PROJECT_DIR/content/conversations"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "=== Hook triggered ==="

# stdinからJSONデータを読み取る
INPUT=$(cat)
log "Input: $INPUT"

# JSONからフィールドを抽出
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')
HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')

log "Event: $HOOK_EVENT, Session: $SESSION_ID"
log "Transcript: $TRANSCRIPT_PATH"

# transcript_pathが空またはファイルが存在しない場合は終了
if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  log "No transcript file found, skipping"
  exit 0
fi

# content/conversationsディレクトリが存在しない場合は作成
mkdir -p "$CONTENT_DIR"

# ランダムIDを生成
RANDOM_ID=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
OUTPUT_FILE="$CONTENT_DIR/${RANDOM_ID}.md"

log "Output file: $OUTPUT_FILE"

# 会話内容を抽出してマークダウンに変換
# userメッセージ: contentが文字列の場合のみ（tool_resultは配列なのでスキップ）
# assistantメッセージ: content配列からtypeがtextのものを抽出
CONVERSATION=$(cat "$TRANSCRIPT_PATH" | jq -r '
  select(.type == "user" or .type == "assistant") |
  {
    type: .type,
    timestamp: .timestamp,
    content: (
      if .type == "user" then
        if (.message.content | type) == "string" then
          .message.content
        else
          null
        end
      else
        [.message.content[] | select(.type == "text") | .text] | join("\n")
      end
    )
  } |
  select(.content != null and .content != "") |
  "### \(.timestamp)\n\n**\(if .type == "user" then "User" else "Claude" end)**: \(.content)\n"
' 2>/dev/null)

# 会話が空の場合は終了
if [ -z "$CONVERSATION" ]; then
  log "No conversation content found, skipping"
  exit 0
fi

# 会話の要約を作成（最初の数メッセージ）
CONVERSATION_SUMMARY=$(cat "$TRANSCRIPT_PATH" | jq -r '
  select(.type == "user" or .type == "assistant") |
  {
    type: .type,
    content: (
      if .type == "user" then
        if (.message.content | type) == "string" then
          .message.content
        else
          null
        end
      else
        [.message.content[] | select(.type == "text") | .text] | join("\n")
      end
    )
  } |
  select(.content != null and .content != "") |
  "\(.type): \(.content[0:500])"
' 2>/dev/null | head -20)

log "Generating title and summary with Claude..."

# Claude CLIを使ってタイトル・要約・タグを生成
METADATA_PROMPT="以下の会話ログを分析して、JSON形式で出力してください。

会話内容:
$CONVERSATION_SUMMARY

出力形式（必ずこの形式のJSONのみを出力）:
{
  \"title\": \"会話の主題を表す簡潔なタイトル（30-60文字）\",
  \"description\": \"会話の要約（100-200文字）\",
  \"tags\": [\"タグ1\", \"タグ2\", \"タグ3\"]
}

注意:
- titleは具体的で内容が伝わるものにする
- descriptionは何について話し、何を学んだかを明確に
- tagsは3-5個の重要キーワード
- 日本語で出力
- JSONのみを出力（説明文は不要）"

# claude -p でメタデータを生成
METADATA_JSON=$(claude -p "$METADATA_PROMPT" --output-format text 2>/dev/null || echo "")

log "Claude response: $METADATA_JSON"

# JSONからフィールドを抽出（失敗時はフォールバック値を使用）
CURRENT_DATE=$(date '+%Y-%m-%dT%H:%M:%S+09:00')
DISPLAY_DATE=$(date '+%Y年%m月%d日 %H:%M')

if [ -n "$METADATA_JSON" ]; then
  # ```json...``` コードブロックを除去してJSONを抽出
  CLEAN_JSON=$(echo "$METADATA_JSON" | sed 's/```json//g' | sed 's/```//g' | tr -d '\n' | grep -o '{.*}' || echo "")

  log "Clean JSON: $CLEAN_JSON"

  if [ -n "$CLEAN_JSON" ]; then
    TITLE=$(echo "$CLEAN_JSON" | jq -r '.title // empty' 2>/dev/null)
    DESCRIPTION=$(echo "$CLEAN_JSON" | jq -r '.description // empty' 2>/dev/null)
    TAGS=$(echo "$CLEAN_JSON" | jq -r '.tags // [] | .[]' 2>/dev/null)
  fi
fi

# フォールバック値
if [ -z "$TITLE" ]; then
  TITLE="会話ログ - $DISPLAY_DATE"
fi
if [ -z "$DESCRIPTION" ]; then
  DESCRIPTION="Claude Codeとの会話記録（自動保存）"
fi
if [ -z "$TAGS" ]; then
  TAGS="conversation
auto-saved"
fi

log "Title: $TITLE"
log "Description: $DESCRIPTION"

# タグをYAML形式に変換
TAGS_YAML=$(echo "$TAGS" | while read -r tag; do
  [ -n "$tag" ] && echo "  - $tag"
done)

# マークダウンファイルを作成
cat > "$OUTPUT_FILE" << EOF
---
date: $CURRENT_DATE
draft: false
title: "$TITLE"
description: "$DESCRIPTION"
tags:
$TAGS_YAML
---

## 会話ログ

$CONVERSATION
EOF

log "Conversation saved to: $OUTPUT_FILE"
log "=== Hook completed ==="

exit 0
