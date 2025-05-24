# VSCode DevContainer for Go & Markdown

このディレクトリは、Go開発とMarkdown執筆の両方に最適化したVSCode用devcontainer環境です。

## 特徴
- **VSCode公式devcontainerイメージ**（Ubuntu 22.04ベース）
- **Goのバージョンを外部から指定可能**（`devcontainer.json`の`build.args.GO_VERSION`で切り替え）
- **Go公式バイナリでGoをインストール**
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

---

ご不明点や追加要望があればご連絡ください。