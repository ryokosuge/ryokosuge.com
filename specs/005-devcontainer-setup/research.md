# Research: Devcontainer CLI Integration

**Date**: 2025-11-25
**Feature**: 001-devcontainer-setup

## 調査項目

### 1. devcontainer CLIの基本コマンド

#### devcontainer up
コンテナを作成・起動するコマンド。

```bash
devcontainer up --workspace-folder <path-to-project>
```

- コンテナイメージをダウンロード（または既存を使用）してコンテナを起動
- JSON形式で結果を返す（コンテナID、リモートワークスペースパス等）
- `devcontainer.json`の設定を読み込んで環境を構築

#### devcontainer exec
起動中のコンテナ内でコマンドを実行。

```bash
devcontainer exec --workspace-folder <path-to-project> <command>
```

- 内部的に`docker exec`を実行
- 作業ディレクトリはdevcontainerのマウントパスに自動設定
- 例: `devcontainer exec --workspace-folder . hugo server -D -p 1313`

### 2. ポート転送

- devcontainer.jsonの`forwardPorts`設定で自動的に処理される
- 現在の設定: `"forwardPorts": [32919, 1313]`
- devcontainer CLIでup後、ポート転送は自動的に有効になる

### 3. Makefile統合パターン

**Decision**: `devcontainer up` + `devcontainer exec`の組み合わせ

**Rationale**:
- 単一の`make server`コマンドでdevcontainer起動からHugoサーバー開始まで一括実行
- devcontainer upは冪等性があり、既に起動中なら高速にスキップ
- execでHugoサーバーを起動し、フォアグラウンドで実行

**Alternatives considered**:
- Docker Compose直接使用 → devcontainer.jsonの設定を活用できない
- VS Code経由のみ → CLI操作ができない

### 4. 推奨実装パターン

```makefile
# devcontainer環境でHugoサーバーを起動
server:
	devcontainer up --workspace-folder . && \
	devcontainer exec --workspace-folder . hugo server -D -p 1313 --bind 0.0.0.0

# devcontainer環境を停止
stop:
	docker stop $$(docker ps -q --filter "label=devcontainer.local_folder=$(PWD)")
```

**注意点**:
- `--bind 0.0.0.0`: コンテナ外からアクセスするために必要
- devcontainer upは初回のみ時間がかかる（イメージビルド）
- 2回目以降は高速（既存コンテナを再利用）

### 5. 考慮事項

#### 既存コマンドとの互換性
- 現在の`make server`は`hugo server -D -p 1313`を直接実行
- devcontainer版に変更すると、ローカルHugoがなくても動作可能に
- ただし、Docker Desktop起動が必須条件になる

#### エラーハンドリング
- Docker Desktop未起動時: devcontainer upがエラーを返す
- ポート競合時: Hugoサーバーがエラーを返す
- これらのエラーはそのままターミナルに表示される

## 参考資料

- [Dev Container CLI - VS Code Docs](https://code.visualstudio.com/docs/devcontainers/devcontainer-cli)
- [devcontainers/cli - GitHub](https://github.com/devcontainers/cli)
- [devcontainer exec usage](https://stuartleeks.github.io/devcontainer-cli/exec.html)
