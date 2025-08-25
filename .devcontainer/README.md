# VSCode DevContainer for Go & Markdown

このディレクトリは、Go開発とMarkdown執筆の両方に最適化したVSCode用devcontainer環境です。

## 特徴
- **VSCode公式devcontainerイメージ**（Ubuntu 22.04ベース）
- **Goのバージョンを外部から指定可能**（`devcontainer.json`の`build.args.GO_VERSION`で切り替え）
- **Go公式バイナリでGoをインストール**
- **Hugo（Extended版）をプリインストール**（ブログ開発用）
- **GitHub CLI（gh）をプリインストール**
- **Claude Codeをプリインストール**（AIアシスタント開発支援）
- **Go製Markdownフォーマッター（markdownfmt）をインストール済み**
- **Markdown執筆に便利なVSCode拡張を多数プリセット**
    - Markdown All in One
    - markdownlint
    - Emojisense
    - Paste Image
    - Word Count
    - Material Icon Theme
    - One Dark Pro
- **エディタ設定もMarkdown用途に最適化**（折り返し、トリミング無効化、プレビュー強化など）

## 使い方
1. VSCodeでこのリポジトリを開く
2. コマンドパレットから「Remote-Containers: Reopen in Container」を選択
3. `/workspace` ディレクトリで開発・執筆を開始

## Goバージョンの切り替え
- `devcontainer.json` の `build.args.GO_VERSION` を任意のバージョン（例: "1.24.3"）に変更して再ビルドしてください。

## Markdownの自動整形について
- Go製の`markdownfmt`コマンドがインストールされています。
- VSCode拡張「Run on Save」（emeraldwalk.runonsave）を追加し、以下のような設定を`.vscode/settings.json`や`devcontainer.json`に追加することで、保存時に自動で`markdownfmt`を実行できます。

```json
"emeraldwalk.runonsave": {
  "commands": [
    {
      "match": "\\.md$",
      "cmd": "markdownfmt -w ${file}"
    }
  ]
},
"[markdown]": {
  "editor.formatOnSave": false
}
```

## 主要な拡張一覧
- yzhang.markdown-all-in-one
- davidanson.vscode-markdownlint
- bierner.emojisense
- mushan.vscode-paste-image
- esbenp.prettier-vscode
- ms-vscode.wordcount
- PKief.material-icon-theme
- zhuangtongfa.Material-theme

## Claude Codeの使用方法

### 前提条件
**Claude Pro アカウント**
- Claude Proのサブスクリプションが必要です
- GitHub CLIと同様に、初回使用時にログインが必要です

### 使用方法
1. **初回ログイン**
   ```bash
   # devcontainer起動後、初回のみログインが必要
   claude auth login
   ```

2. **Claude Code使用**
   ```bash
   # ログイン後は通常通り使用可能
   claude
   ```

3. **slash commands使用**
   プロジェクト内の `.claude/commands/` にあるslash commandsが利用できます：
   - `/daily` - 日報作成
   - `/research` - 調査ログ作成  
   - `/english` - 英会話練習
   - `/pr` - Pull Request作成

### トラブルシューティング
- 認証状態確認：`claude auth status`
- 再ログイン：`claude auth logout && claude auth login`

---

ご不明点や追加要望があればご連絡ください。