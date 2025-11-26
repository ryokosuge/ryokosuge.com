# Feature Specification: Devcontainer開発環境セットアップ

**Feature Branch**: `001-devcontainer-setup`
**Created**: 2025-11-25
**Status**: Draft
**Input**: User description: "devcontainer cliを使ってdev環境を立ち上げられるようにしたいです。devtoolのmcpが使えるので、make serverでdevcontainer環境でhugo serveが立ち上がって、ローカルから確認できるようになると嬉しいです。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 開発環境の起動 (Priority: P1)

開発者として、単一のコマンドでdevcontainer環境を立ち上げてHugoサーバーを起動し、ローカルブラウザでサイトをプレビューできるようにしたい。これにより、ローカル環境にHugoやその他の依存関係をインストールすることなく、すぐに開発を始められる。

**Why this priority**: これが機能の核心であり、devcontainer環境でのHugo開発ワークフローを実現する最も重要な機能。

**Independent Test**: `make server`を実行し、ローカルブラウザでプレビューサイトにアクセスできることを確認することでテスト可能。

**Acceptance Scenarios**:

1. **Given** リポジトリをクローンした状態で、**When** `make server`を実行する、**Then** devcontainer環境が起動し、Hugoサーバーが立ち上がり、ローカルブラウザからサイトにアクセスできる
2. **Given** devcontainer環境が起動している状態で、**When** コンテンツファイルを変更する、**Then** 変更がリアルタイムでプレビューに反映される
3. **Given** devcontainer環境でHugoサーバーが稼働中の状態で、**When** 開発を終了したい、**Then** サーバーを適切に停止できる

---

### User Story 2 - 一貫した開発環境 (Priority: P2)

開発者として、どのマシンからでも同じ開発環境を再現できるようにしたい。これにより、「自分のマシンでは動く」問題を解消し、チームメンバー間で環境の差異による問題を防ぐ。

**Why this priority**: 環境の一貫性は重要だが、まず基本的な環境起動（P1）が動作することが前提となる。

**Independent Test**: 異なるマシン（またはクリーンな状態）から環境を起動し、同じ動作をすることを確認。

**Acceptance Scenarios**:

1. **Given** 新しいマシンにリポジトリをクローンした状態で、**When** devcontainer環境を起動する、**Then** 必要なツールがすべてインストールされた状態で環境が立ち上がる
2. **Given** devcontainerの設定が存在する状態で、**When** 複数の開発者が各自の環境で起動する、**Then** 全員が同じバージョンのツールを使用できる

---

### User Story 3 - DevTools MCP連携 (Priority: P3)

開発者として、DevTools MCPを使用してブラウザでのプレビュー確認やデバッグを行えるようにしたい。これにより、開発中にブラウザの開発者ツールと連携した効率的なデバッグが可能になる。

**Why this priority**: MCP連携は便利な追加機能だが、基本的な開発環境（P1）とその一貫性（P2）が先に必要。

**Independent Test**: DevTools MCPを使ってブラウザでのページ確認やスナップショット取得ができることを確認。

**Acceptance Scenarios**:

1. **Given** devcontainer環境でHugoサーバーが稼働中の状態で、**When** DevTools MCPのスナップショット機能を使用する、**Then** 現在のページ状態を確認できる
2. **Given** devcontainer環境でHugoサーバーが稼働中の状態で、**When** DevTools MCPでページ操作を行う、**Then** プレビューサイトを操作・確認できる

---

### Edge Cases

- ポートがすでに使用されている場合はどうなるか？
  - エラーメッセージを表示し、代替ポートを使用するか、ユーザーに通知する
- devcontainerの起動中にネットワーク接続が切れた場合はどうなるか？
  - 適切なエラーメッセージを表示し、再試行の方法を案内する
- Hugoのビルドエラーが発生した場合はどうなるか？
  - エラーの詳細をターミナルに表示し、開発者がデバッグできるようにする
- devcontainer環境が不正終了した場合はどうなるか？
  - 次回起動時にクリーンな状態から開始できる

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: システムは単一のコマンド（`make server`）で常にdevcontainer環境の起動からHugoサーバーの開始までを一括実行できなければならない
- **FR-002**: システムはdevcontainer内のHugoサーバーへローカルブラウザからアクセスできるようポート転送を設定しなければならない
- **FR-003**: 開発者はdevcontainer環境内でコンテンツの変更をリアルタイムプレビューできなければならない
- **FR-004**: システムは開発に必要なすべてのツールをdevcontainer内に自動的にセットアップしなければならない
- **FR-005**: システムはdevcontainer環境の起動・停止時に適切なフィードバックを開発者に提供しなければならない
- **FR-006**: システムはDevTools MCPと連携してブラウザでのプレビュー確認機能を提供しなければならない

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 開発者は初回セットアップ後、5分以内にdevcontainer環境を起動してプレビューサイトにアクセスできる
- **SC-002**: コンテンツ変更後、5秒以内にブラウザでプレビューに反映される
- **SC-003**: 新しい開発者がリポジトリをクローンしてから最初のプレビュー表示まで15分以内で完了できる
- **SC-004**: devcontainer環境の起動成功率が95%以上である
- **SC-005**: DevTools MCPによるページスナップショットの取得が成功する

## Clarifications

### Session 2025-11-25

- Q: どのコンテナランタイムを前提とすべきですか？ → A: Docker Desktop
- Q: `make server`はどのように動作すべきですか？ → A: 常にdevcontainer起動→Hugoサーバー開始を一括実行

## Assumptions

- 開発者のマシンにdevcontainer CLIがインストール済みである
- 開発者のマシンにDocker Desktopがインストール・起動済みである
- 開発者はdevcontainerの基本的な概念を理解している
- DevTools MCPはClaude Codeの設定で利用可能である
- ポート1313をデフォルトのHugoサーバーポートとして使用する
