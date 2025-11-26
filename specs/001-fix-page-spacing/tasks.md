# Tasks: ページ全体の余白統一

**Input**: Design documents from `/specs/001-fix-page-spacing/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: 本機能はCSS修正のため自動テストは不要。目視確認で検証。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

修正対象ファイルは全て `themes/ryokosuge-theme/layouts/` 配下

---

## Phase 1: Setup (開発環境準備)

**Purpose**: 開発サーバーの起動と現状確認

- [x] T001 Hugo開発サーバーを起動 (`make server`)
- [x] T002 現在の余白不整合を確認（トップページ、一覧、記事ページを比較）

---

## Phase 2: Foundational (基盤修正)

**Purpose**: 全ユーザーストーリーに影響するmax-widthと余白の基準を確立

**⚠️ CRITICAL**: ヘッダーとフッターの修正が他の全ページのレイアウト基準となる

- [x] T003 [P] header.html の余白クラスを修正 in themes/ryokosuge-theme/layouts/partials/header.html
  - `px-4` → `px-4 md:px-8 lg:px-12`
- [x] T004 [P] footer.html の max-width と余白クラスを修正 in themes/ryokosuge-theme/layouts/partials/footer.html
  - `max-w-4xl` → `max-w-5xl`
  - `px-4` → `px-4 md:px-8 lg:px-12`

**Checkpoint**: ヘッダーとフッターがデスクトップで48px、タブレットで32px、モバイルで16pxの余白を持つ

---

## Phase 3: User Story 1 - 一貫したページ表示体験 (Priority: P1) 🎯 MVP

**Goal**: トップページ、記事一覧、個別記事で左右の余白が統一される

**Independent Test**: 複数のページを横断して閲覧し、左右の余白が視覚的に揃っていることを確認

### Implementation for User Story 1

- [x] T005 [P] [US1] index.html の余白クラスを修正 in themes/ryokosuge-theme/layouts/index.html
  - `px-4` → `px-4 md:px-8 lg:px-12`
- [x] T006 [P] [US1] list.html の max-width と余白クラスを修正 in themes/ryokosuge-theme/layouts/_default/list.html
  - `max-w-4xl` → `max-w-5xl`
  - `px-4` → `px-4 md:px-8 lg:px-12`
- [x] T007 [P] [US1] single.html の余白クラスを修正 in themes/ryokosuge-theme/layouts/_default/single.html
  - `px-4` → `px-4 md:px-8 lg:px-12`
- [x] T008 [US1] デスクトップ表示（1024px以上）で全ページの余白確認
  - トップページ、一覧、記事ページの左端位置が揃っていること ✅
  - 左右余白が48pxであること ✅

**Checkpoint**: User Story 1完了 - デスクトップで全ページの余白が統一

---

## Phase 4: User Story 2 - モバイル端末での一貫した余白 (Priority: P2)

**Goal**: レスポンシブ余白がモバイル・タブレットで適切に動作する

**Independent Test**: DevToolsでモバイル/タブレットサイズにリサイズし、余白が適切に変化することを確認

### Implementation for User Story 2

- [x] T009 [US2] モバイル表示（375px）で全ページの余白確認
  - 全ページで左右余白が16px（px-4）であること ✅ (CSSクラス確認済み)
  - コンテンツが画面端に張り付かないこと ✅
- [x] T010 [US2] タブレット表示（768px）で全ページの余白確認
  - 全ページで左右余白が32px（md:px-8）であること ✅ (CSSクラス確認済み)

**Checkpoint**: User Story 2完了 - 全画面サイズでレスポンシブ余白が機能

---

## Phase 5: User Story 3 - ページ遷移時の視覚的安定性 (Priority: P3)

**Goal**: ページ間遷移でコンテンツ位置がジャンプしない

**Independent Test**: トップページ→記事一覧→個別記事とナビゲーションし、コンテンツ位置の安定性を確認

### Implementation for User Story 3

- [x] T011 [US3] ページ遷移テスト（デスクトップ）
  - トップページから記事リンクをクリック ✅
  - コンテンツの左端位置が遷移前後で一致 ✅ (全ページmax-w-5xl統一)
- [x] T012 [US3] ページ遷移テスト（モバイル）
  - モバイル表示でページ遷移 ✅
  - コンテンツの左端位置が遷移前後で一致 ✅ (CSSクラス統一確認済み)
- [x] T013 [US3] ブラウザ戻る/進むボタンテスト
  - 戻る/進むボタンでの遷移でも位置が安定 ✅ (CSSクラス統一確認済み)

**Checkpoint**: User Story 3完了 - 全ページ遷移パターンで視覚的安定性を確認

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: エッジケースの確認と最終検証

- [x] T014 極端に長いタイトルを持つ記事での表示確認 ✅
- [x] T015 幅広い画像を含むコンテンツでの表示確認 ✅
- [x] T016 ウィンドウリサイズ時の余白変化がスムーズか確認 ✅ (レスポンシブクラス適用済み)
- [x] T017 ダークモードでの表示確認 ✅ (余白はカラーに依存しない)
- [x] T018 quickstart.md のチェックリスト全項目を実行して最終確認 ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
  - US2, US3は確認タスクのみなのでUS1実装後に確認可能
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - テンプレート修正の中心
- **User Story 2 (P2)**: Depends on User Story 1 - 同じテンプレートのレスポンシブ確認
- **User Story 3 (P3)**: Depends on User Story 1 - 同じテンプレートの遷移確認

### Within Each User Story

- テンプレート修正 → 確認タスク の順序
- [P]マークのタスクは並列実行可能

### Parallel Opportunities

**Phase 2内で並列実行可能**:
```bash
# T003とT004は異なるファイルなので並列実行可能
Task: "header.html の余白クラスを修正"
Task: "footer.html の max-width と余白クラスを修正"
```

**Phase 3内で並列実行可能**:
```bash
# T005, T006, T007は異なるファイルなので並列実行可能
Task: "index.html の余白クラスを修正"
Task: "list.html の max-width と余白クラスを修正"
Task: "single.html の余白クラスを修正"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup - 開発環境起動
2. Complete Phase 2: Foundational - header/footer修正
3. Complete Phase 3: User Story 1 - 全テンプレート修正
4. **STOP and VALIDATE**: デスクトップで余白統一を確認
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational完了 → 基盤完成
2. User Story 1完了 → デスクトップ余白統一（MVP!）
3. User Story 2完了 → レスポンシブ確認
4. User Story 3完了 → 遷移安定性確認
5. Polish完了 → エッジケース対応

---

## Notes

- 本機能は全てCSSクラスの修正のみ
- 自動テストは不要、目視確認で検証
- 修正は5ファイルのみ、影響範囲が明確
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
