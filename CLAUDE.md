# Claude Code Configuration

## Project Overview
This is a Hugo-based blog site with the following structure:
- **Static Site Generator**: Hugo with custom ryokosuge-theme
- **Content Types**: Daily logs, Conversations, Research, English practice
- **Deployment**: Static site hosted at https://ryokosuge.com/

## Available Commands

### Development
```bash
# Start Hugo development server
make server
# or directly: hugo server -D -p 1313
```

### Setup
```bash
# Initialize git submodules (for theme)
make submodule
# or directly: git submodule update --init --recursive

# Authenticate with GitHub (for deployment)
make prepare
# or directly: gh auth login
```

### Content Management
- Daily logs: `content/daily-logs/`
- Conversation logs: `content/conversations/`
- Research notes: `content/research/`
- English practice: `content/english/`
- Archetypes available for all content types

### Claude Commands
Claude Code provides specialized slash commands for content creation:
- `/daily` - Interactive daily log creation workflow
- `/english` - English conversation practice with feedback
- `/research` - Research note creation with web search
- `/save-conversation` - Auto-save Claude conversations to blog
- `/pr` - Pull request creation workflow

## File Structure
- `config.yaml`: Hugo configuration
- `archetypes/`: Content templates (daily-logs.md, conversations.md, research.md, english.md)
- `content/`: Blog content organized by type
  - `daily-logs/`: Daily work logs
  - `conversations/`: Claude conversation logs
  - `research/`: Research and learning notes
  - `english/`: English practice scripts
- `static/`: Static assets
- `themes/ryokosuge-theme/`: Custom Hugo theme
- `public/`: Generated static site
- `.claude/`: Claude Code configuration and commands

## Development Workflow
1. Create new content using archetypes or Claude commands
2. Test locally with `make server`
3. Generate site with `hugo` command
4. Deploy generated `public/` directory

## Common Tasks
- **Add new daily log**: Use `/daily` command or `archetypes/daily-logs.md` template
- **Add new research note**: Use `/research` command or `archetypes/research.md` template
- **Practice English**: Use `/english` command or `archetypes/english.md` template
- **Save conversation**: Use `/save-conversation` command to archive Claude chats
- **Update theme**: `git submodule update --remote themes/ryokosuge-theme`

---

# Content Creation Guidelines

## Daily Log Creation (日報制作)

日報作成をサポートするワークフロー：

**推奨**: `/daily` コマンドを使用すると、対話形式で自動作成できます。

### 手順
1. **ファイル作成**
   ```bash
   hugo new content content/daily-logs/$(date +%Y%m%d).md
   ```

2. **インタビュー形式で内容収集**
   - 今日の主な活動確認
   - 各活動の詳細と印象
   - 学びや気づき
   - 感情や成果の確認
   - 明日への展望

3. **400文字程度のまとめ作成**
   - ポジティブな視点重視
   - 個人名は伏せる（Aさん、Bさん等）
   - 句読点で改行を入れる

4. **テンプレート使用**
   ```markdown
   ## 今日やったこと
   (箇条書きで簡潔に)

   ## 今日の振り返り
   (400文字程度の振り返り)
   ```

## Research Log Creation (調べ物まとめ)

調査結果をまとめるワークフロー：

**推奨**: `/research` コマンドを使用すると、対話形式で自動作成できます。

### 手順
1. **ファイル作成**
   ```bash
   hugo new content content/research/$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32).md
   ```

2. **インタビュー形式で調査**
   - 知りたいことの確認
   - Web検索で最新情報収集（10件→5件→3件に絞り込み）
   - 各サイトを300文字で要約
   - 全体を600文字でまとめ

3. **テンプレート使用**
   ```markdown
   ## 知りたかったこと
   ## 知りたいと思った理由
   ## 参考にしたサイトやページ
   ## 調べた内容
   ## わかったこと、わからなかったこと
   ```

## English Conversation Practice (英会話練習)

英語のコア・スクリプト作成ワークフロー：

**推奨**: `/english` コマンドを使用すると、対話形式で自動作成できます。

### 手順
1. **ファイル作成**
   ```bash
   hugo new content content/english/$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32).md
   ```

2. **会話練習プロセス**
   - ランダムなトピック選択
   - 自然な会話ラリー（2-3往復）
   - フィードバックセッション
   - 模範スクリプト作成

3. **テンプレート使用**
   ```markdown
   ## Conversation
   ## Feedback
   ## Polished Script
   ```

## Conversation Log Archiving (会話ログ保存)

Claude Code会話を自動的にブログ記事として保存：

**推奨**: `/save-conversation` コマンドを使用すると、完全自動で会話を保存できます。

### 手順
1. **自動ファイル作成**
   - コマンド実行で自動的に `content/conversations/[ランダムID].md` を生成
   - AIが会話を分析してタイトル、要約、タグを自動生成

2. **含まれる内容**
   - 会話全体の時系列ログ
   - 自動生成されたメタデータ（タイトル、要約、タグ）
   - タイムスタンプ付き会話履歴

3. **ファイル構造**
   ```markdown
   ---
   date: YYYY-MM-DDTHH:MM:SS+09:00
   draft: false
   title: "自動生成されたタイトル"
   description: "会話の要約"
   tags:
     - 自動抽出されたタグ
   ---

   ## 会話ログ
   （時系列の会話内容）
   ```

## Pull Request Creation

PR作成の標準手順：

**推奨**: `/pr` コマンドを使用すると、対話形式で自動作成できます。

### 手順
1. **差分確認**
   ```bash
   git diff origin/{{マージ先ブランチ}}...HEAD | cat
   ```

2. **PR作成**
   - `pr_body.txt`にPR内容記載
   - 以下のコマンドで作成・表示
   ```bash
   git push origin HEAD && \
   gh pr create --title "{{PRタイトル}}" --body-file pr_body.txt --assignee @me && \
   gh pr view --web
   ```

3. **PRテンプレート**
   ```markdown
   ## 概要
   ## 詳細
   ## 参考
   ```

## Active Technologies
- **Hugo**: Static site generator (v0.118.0+)
- **Theme**: Custom ryokosuge-theme
- **Content**: Markdown format (UTF-8 encoding)
- **Languages**: Go (Hugo), HTML/CSS/JavaScript (theme)
- **Deployment**: Static files to ryokosuge.com
- **Tools**: Claude Code for content automation
