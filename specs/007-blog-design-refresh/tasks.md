# Tasks: ブログデザインリフレッシュ

**Input**: Design documents from `/specs/007-blog-design-refresh/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: 目視確認のみ（自動テストなし）

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Theme files**: `themes/ryokosuge-theme/`
- **CSS**: `themes/ryokosuge-theme/assets/css/main.css`
- **Layouts**: `themes/ryokosuge-theme/layouts/`

---

## Phase 1: Setup (基盤設定)

**Purpose**: デザイントークンとTailwind設定の更新

- [x] T001 Update color palette and design tokens in themes/ryokosuge-theme/tailwind.config.js
- [x] T002 Add CSS variables and base styles in themes/ryokosuge-theme/assets/css/main.css

---

## Phase 2: Foundational (共通基盤)

**Purpose**: 全ユーザーストーリーに必要なベーススタイル

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update body background and text colors in themes/ryokosuge-theme/layouts/_default/baseof.html
- [x] T004 [P] Verify dark mode script for system preference detection in themes/ryokosuge-theme/layouts/partials/head/dark-mode-script.html
- [x] T005 [P] Add transition utility classes for theme switching in themes/ryokosuge-theme/assets/css/main.css

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 訪問者がトップページで良い第一印象を受ける (Priority: P1) 🎯 MVP

**Goal**: 現代的でプロフェッショナルなトップページデザイン。統一された配色とレイアウト、レスポンシブ対応、ダークモード対応。

**Independent Test**:
- トップページを表示し、サイト名・ナビゲーション・最新記事が明確に視認できる
- モバイルでハンバーガーメニューが機能する
- ダーク/ライト切替が動作する

### Implementation for User Story 1

- [x] T006 [US1] Update header with sticky positioning and backdrop blur in themes/ryokosuge-theme/layouts/partials/header.html
- [x] T007 [US1] Implement desktop navigation with active state highlighting in themes/ryokosuge-theme/layouts/partials/navigation.html
- [x] T008 [US1] Add mobile hamburger menu with slide animation in themes/ryokosuge-theme/layouts/partials/navigation.html
- [x] T009 [P] [US1] Update dark mode toggle button with hover effects in themes/ryokosuge-theme/layouts/partials/dark-mode-toggle.html
- [x] T010 [US1] Redesign post card with glassmorphism and hover glow effect in themes/ryokosuge-theme/layouts/partials/post-card.html
- [x] T011 [US1] Update homepage layout with proper spacing in themes/ryokosuge-theme/layouts/index.html
- [x] T012 [US1] Add card hover styles (shadow, translateY, border) in themes/ryokosuge-theme/assets/css/main.css

**Checkpoint**: At this point, User Story 1 should be fully functional - verify:
- [ ] Header stays fixed on scroll
- [ ] Navigation links are visible and highlighted when active
- [ ] Mobile menu opens/closes properly
- [ ] Dark/Light mode toggle works
- [ ] Cards have hover effects
- [ ] Overall visual impression is modern and professional

---

## Phase 4: User Story 2 - 読者が記事を快適に読める (Priority: P2)

**Goal**: 長文コンテンツを疲れずに快適に読める記事ページ。適切な行間・文字サイズ、コードブロックのシンタックスハイライト。

**Independent Test**:
- 記事ページで長文を表示し、読みやすさを確認
- コードブロックがターミナル風でハイライトされている
- 見出しが視覚的に区別されている

### Implementation for User Story 2

- [x] T013 [US2] Update single page layout with improved header and spacing in themes/ryokosuge-theme/layouts/_default/single.html
- [x] T014 [US2] Enhance prose-ja typography (headings, paragraphs, lists) in themes/ryokosuge-theme/assets/css/main.css
- [x] T015 [US2] Style code blocks with terminal-like appearance in themes/ryokosuge-theme/assets/css/main.css
- [x] T016 [P] [US2] Add inline code styling with proper contrast in themes/ryokosuge-theme/assets/css/main.css
- [x] T017 [US2] Improve heading hierarchy visual distinction in themes/ryokosuge-theme/assets/css/main.css

**Checkpoint**: At this point, User Story 2 should be fully functional - verify:
- [ ] Article text is readable with proper line height
- [ ] Code blocks have dark background with syntax highlighting
- [ ] Headings are clearly distinguished (h1 > h2 > h3 > h4)
- [ ] Links are visible and have hover states
- [ ] Japanese text renders properly with Noto Sans JP

---

## Phase 5: User Story 3 - 訪問者が目的のコンテンツを見つけられる (Priority: P3)

**Goal**: ナビゲーションやカテゴリを使って目的のコンテンツを素早く発見できる。記事カードに明確な情報表示。

**Independent Test**:
- カテゴリをクリックして一覧ページに移動できる
- 記事カードにタイトル・日付・カテゴリが表示される

### Implementation for User Story 3

- [x] T018 [US3] Update list page layout with header and card grid in themes/ryokosuge-theme/layouts/_default/list.html
- [x] T019 [US3] Redesign content type badges with category colors in themes/ryokosuge-theme/layouts/partials/content-type-badge.html
- [x] T020 [P] [US3] Add badge color CSS for each content type in themes/ryokosuge-theme/assets/css/main.css

**Checkpoint**: At this point, User Story 3 should be fully functional - verify:
- [ ] List pages show proper header with title
- [ ] Cards display title, date, and category badge
- [ ] Category badges have distinct colors (blue/violet/emerald/amber)
- [ ] Clicking navigation takes you to correct category

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 全体的な品質向上と最終確認

- [x] T021 [P] Update footer with new design consistent with header in themes/ryokosuge-theme/layouts/partials/footer.html
- [x] T022 Verify responsive design on mobile, tablet, desktop viewports
- [x] T023 Check WCAG 2.1 AA color contrast compliance (4.5:1 ratio)
- [x] T024 Test dark/light mode transition smoothness (target: < 0.5s)
- [x] T025 Verify no layout shift on page load (CLS optimization)
- [x] T026 Run local development server (`make server`) and perform final visual review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Can proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent of US1/US2

### Within Each User Story

- CSS changes may depend on HTML structure changes
- Template changes can often be parallelized
- Verify after each task with `make server`

### Parallel Opportunities

**Phase 1:**
- T001, T002 can run sequentially (T002 depends on T001 for color definitions)

**Phase 2:**
- T004 [P], T005 [P] can run in parallel after T003

**Phase 3 (US1):**
- T009 [P] can run in parallel with other US1 tasks

**Phase 4 (US2):**
- T016 [P] can run in parallel with other US2 tasks

**Phase 5 (US3):**
- T020 [P] can run in parallel with other US3 tasks

**Phase 6:**
- T021 [P] can run in parallel with verification tasks

---

## Parallel Example: User Story 1

```bash
# After T006-T008 complete, these can run together:
Task: "Update dark mode toggle button in themes/ryokosuge-theme/layouts/partials/dark-mode-toggle.html"

# Card styling depends on HTML structure:
Task: "Redesign post card in themes/ryokosuge-theme/layouts/partials/post-card.html"
→ Then: "Add card hover styles in themes/ryokosuge-theme/assets/css/main.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T005)
3. Complete Phase 3: User Story 1 (T006-T012)
4. **STOP and VALIDATE**: Test homepage independently with `make server`
5. Demo if ready - basic design refresh is complete

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test homepage → MVP Complete!
3. Add User Story 2 → Test article pages → Reading experience improved
4. Add User Story 3 → Test list pages → Content discovery improved
5. Polish phase → Final quality assurance

### Recommended Execution Order

```
T001 → T002 → T003 → T004 + T005 (parallel)
→ T006 → T007 → T008 → T009 + T010 (parallel) → T011 → T012
→ T013 → T014 → T015 → T016 + T017 (parallel)
→ T018 → T019 → T020
→ T021 → T022 → T023 → T024 → T025 → T026
```

---

## File Change Summary

| File | Tasks | User Story |
|------|-------|------------|
| `tailwind.config.js` | T001 | Setup |
| `assets/css/main.css` | T002, T005, T012, T014-T017, T020 | All |
| `layouts/_default/baseof.html` | T003 | Foundational |
| `layouts/partials/head/dark-mode-script.html` | T004 | Foundational |
| `layouts/partials/header.html` | T006 | US1 |
| `layouts/partials/navigation.html` | T007, T008 | US1 |
| `layouts/partials/dark-mode-toggle.html` | T009 | US1 |
| `layouts/partials/post-card.html` | T010 | US1 |
| `layouts/index.html` | T011 | US1 |
| `layouts/_default/single.html` | T013 | US2 |
| `layouts/_default/list.html` | T018 | US3 |
| `layouts/partials/content-type-badge.html` | T019 | US3 |
| `layouts/partials/footer.html` | T021 | Polish |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Use `make server` to preview changes during development
- Reference `data-model.md` for exact color values and spacing
- Reference `contracts/components.md` for component specifications
