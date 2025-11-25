# Quickstart: Devcontainer開発環境

## 前提条件

- Docker Desktopがインストール・起動済み
- devcontainer CLIがインストール済み
  ```bash
  npm install -g @devcontainers/cli
  ```

## 使い方

### 開発サーバーの起動

```bash
make server
```

このコマンドは以下を実行します：
1. devcontainer環境を起動（初回はイメージビルドのため数分かかる）
2. Hugo開発サーバーを起動（ポート1313）
3. ブラウザで http://localhost:1313 にアクセスしてプレビュー

### 開発サーバーの停止

`Ctrl+C`でHugoサーバーを停止します。

devcontainer環境自体を停止する場合：
```bash
make stop
```

## トラブルシューティング

### Docker Desktopが起動していない場合

```
Error: Cannot connect to the Docker daemon
```

→ Docker Desktopを起動してから再実行してください。

### ポート1313が使用中の場合

```
Error: listen tcp 0.0.0.0:1313: bind: address already in use
```

→ 既存のHugoサーバーを停止するか、別のポートを使用してください。

### devcontainer CLIがインストールされていない場合

```
command not found: devcontainer
```

→ 以下でインストール：
```bash
npm install -g @devcontainers/cli
```

## 従来の方法（ローカルHugo使用）

ローカルにHugoがインストールされている場合は、従来通り以下でも動作します：
```bash
hugo server -D -p 1313
```
