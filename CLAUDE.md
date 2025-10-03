# Claude Code Configuration

## Project Overview
This is a Hugo-based blog site with the following structure:
- **Static Site Generator**: Hugo with PaperMod theme
- **Content Types**: Research logs, daily logs, English conversation
- **Deployment**: Static site hosted at https://ryokosuge.com/

## Available Commands

### Development
```bash
# Start Hugo development server
make server
# or directly: hugo server -D
```

### Setup
```bash
# Initialize git submodules (for PaperMod theme)
make submodule
# or directly: git submodule update --init --recursive

# Authenticate with GitHub (for deployment)
make prepare
# or directly: gh auth login
```

### Content Management
- Research logs: `content/research-logs/`
- Daily logs: `content/daily-logs/`
- English conversation: `content/english-conversation/`
- Archetypes available for content templates

## File Structure
- `config.yaml`: Hugo configuration
- `archetypes/`: Content templates
- `content/`: Blog content organized by type
- `static/`: Static assets
- `themes/PaperMod/`: Theme submodule
- `public/`: Generated static site

## Development Workflow
1. Create new content using archetypes
2. Test locally with `make server`
3. Generate site with `hugo` command
4. Deploy generated `public/` directory

## Common Tasks
- **Add new research log**: Use `archetypes/research-logs.md` template
- **Add new daily log**: Use `archetypes/daily-logs.md` template  
- **Update theme**: `git submodule update --remote themes/PaperMod`

---

# Content Creation Guidelines

## Daily Log Creation (日報制作)

日報作成をサポートするワークフロー：

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

### 手順
1. **ファイル作成**
   ```bash
   hugo new content content/research-logs/$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32).md
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

### 手順
1. **ファイル作成**
   ```bash
   hugo new content content/english-conversation/$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32).md
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

## Pull Request Creation

PR作成の標準手順：

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
