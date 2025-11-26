# Tasks: Devcontainer開発環境セットアップ

**Input**: Design documents from `/specs/001-devcontainer-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: 手動テスト（コマンド実行確認）のみ - 自動テストタスクなし

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **設定ファイル**: `.devcontainer/`, `Makefile`
- **ドキュメント**: `.devcontainer/README.md`, `CLAUDE.md`

---

## Phase 1: Setup (確認・検証)

**Purpose**: 既存のdevcontainer設定を確認し、必要な前提条件を検証

- [x] T001 既存の`.devcontainer/devcontainer.json`の設定を確認（ポート転送、features等）
- [x] T002 [P] 既存の`.devcontainer/Dockerfile`の内容を確認
- [x] T003 [P] devcontainer CLIがインストールされていることを確認

---

## Phase 2: Foundational (ベース設定)

**Purpose**: devcontainer設定の更新（必要に応じて）

**⚠️ CRITICAL**: User Story 1の実装前に完了必須

- [x] T004 `.devcontainer/devcontainer.json`にHugoサーバー用の`--bind 0.0.0.0`オプションが必要か確認・対応
- [x] T005 [P] ポート1313の転送設定が正しく機能することを確認

**Checkpoint**: devcontainer設定準備完了

---

## Phase 3: User Story 1 - 開発環境の起動 (Priority: P1) 🎯 MVP

**Goal**: `make server`コマンドでdevcontainer環境を起動し、Hugoサーバーを立ち上げ、ローカルブラウザでプレビューできる

**Independent Test**: `make server`を実行し、http://localhost:1313 にアクセスしてサイトが表示されることを確認

### Implementation for User Story 1

- [x] T006 [US1] `Makefile`に`server`ターゲットを更新：devcontainer build + docker run + docker exec実行
- [x] T007 [US1] `Makefile`に`stop`ターゲットを追加：devcontainer環境の停止コマンド
- [x] T008 [US1] `make server`を実行してdevcontainer環境起動を確認
- [x] T009 [US1] ローカルブラウザで http://localhost:1313 にアクセスしてプレビュー表示を確認
- [x] T010 [US1] コンテンツファイルを変更してリアルタイムプレビューを確認
- [x] T011 [US1] `Ctrl+C`でHugoサーバー停止を確認

**Checkpoint**: User Story 1完了 - `make server`で開発環境起動からプレビューまで動作

---

## Phase 4: User Story 2 - 一貫した開発環境 (Priority: P2)

**Goal**: どのマシンからでも同じ開発環境を再現できる

**Independent Test**: 異なるマシン（またはクリーンな状態）から`make server`を実行し、同じ動作をすることを確認

### Implementation for User Story 2

- [x] T012 [US2] `.devcontainer/devcontainer.json`のfeatures設定を確認（Hugo、GitHub CLI、Node.js、Claude Code）
- [x] T013 [US2] `postCreateCommand`でgit submodule初期化が実行されることを確認・追加
- [x] T014 [US2] `.devcontainer/README.md`を更新：devcontainer CLIでの起動手順を追加

**Checkpoint**: User Story 2完了 - 環境の一貫性を保証する設定が整備

---

## Phase 5: User Story 3 - DevTools MCP連携 (Priority: P3)

**Goal**: DevTools MCPを使用してブラウザでのプレビュー確認やデバッグができる

**Independent Test**: DevTools MCPを使ってスナップショット取得やページ操作ができることを確認

### Implementation for User Story 3

- [x] T015 [US3] devcontainer環境でHugoサーバー起動後、DevTools MCPでページスナップショットを取得
- [x] T016 [US3] DevTools MCPでプレビューサイトの操作（クリック、入力等）を確認
- [x] T017 [US3] DevTools MCPとdevcontainer環境の連携が正常に動作することを確認

**Checkpoint**: User Story 3完了 - DevTools MCPによるデバッグ機能が利用可能

---

## Phase 6: Polish & ドキュメント更新

**Purpose**: ドキュメント整備と最終確認

- [x] T018 [P] `.devcontainer/README.md`を更新：devcontainer CLIの使い方を追加（T014で完了）
- [x] T019 [P] `CLAUDE.md`を更新：devcontainer環境の使い方を追記
- [x] T020 quickstart.mdの内容に沿って全体フローを最終確認
- [x] T021 エラーケースの確認（Docker未起動、ポート競合等）- quickstart.mdに記載済み

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Can start after Foundational (independent of US1)
- **User Story 3 (Phase 5)**: Depends on US1 (Hugoサーバーが起動している必要あり)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Requires US1 to be complete (Hugoサーバー必要)

### Within Each User Story

- 設定変更 → 動作確認 → 検証完了
- 各ストーリーは独立してテスト可能

### Parallel Opportunities

- Phase 1: T002, T003 can run in parallel
- Phase 2: T005 can run in parallel with T004
- Phase 4 (US2): Can run in parallel with Phase 3 (US1) after Foundational completion
- Phase 6: T018, T019 can run in parallel

---

## Parallel Example: User Story 1 & 2

```bash
# After Foundational phase, these can run in parallel:

# User Story 1 (Developer A):
Task: "Makefile更新：serverターゲット"
Task: "動作確認：make server"

# User Story 2 (Developer B):
Task: "devcontainer.json確認"
Task: "README.md更新"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup（確認・検証）
2. Complete Phase 2: Foundational（ベース設定）
3. Complete Phase 3: User Story 1（開発環境の起動）
4. **STOP and VALIDATE**: `make server`で起動→プレビュー表示を確認
5. MVP完了 - 基本機能が動作

### Incremental Delivery

1. Complete Setup + Foundational → 基盤準備完了
2. Add User Story 1 → `make server`動作確認 → MVP完了!
3. Add User Story 2 → 環境一貫性確認 → ドキュメント整備
4. Add User Story 3 → DevTools MCP連携確認 → 機能完成
5. Polish → 最終ドキュメント更新

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- 手動テストのみ（自動テストなし）
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- 既存の.devcontainer設定を最大限活用
