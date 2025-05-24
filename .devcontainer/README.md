# Go 1.24.3 DevContainer

このディレクトリは、VSCodeのRemote - Containers拡張機能で利用できるGo 1.24.3開発環境です。

## 特徴
- Go 1.24.3（公式バイナリ）
- Ubuntu 22.04ベース
- 必要なビルドツール・git・vim等を同梱
- VSCode拡張 `golang.Go` 推奨設定済み

## 使い方
1. VSCodeでこのリポジトリを開く
2. コマンドパレットから「Remote-Containers: Reopen in Container」を選択
3. `/workspace` ディレクトリで開発を開始

---
Goのバージョンは `Dockerfile` 内の `GO_VERSION` で明示的に指定しています。