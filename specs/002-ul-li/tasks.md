# Tasks: ul/li タグの箇条書きマーカー表示修正

**Input**: Design documents from `/specs/002-ul-li/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: CSS3, Tailwind CSS, Hugo
   → Structure: themes/ryokosuge-theme/assets/css/main.css (単一ファイル)
2. Load design documents:
   → data-model.md: CSS property mappings extracted
   → contracts/css-contract.md: Visual test contracts extracted
   → research.md: Implementation approach confirmed
   → quickstart.md: Test scenarios extracted
3. Generate tasks by category:
   → Setup: Branch & dependencies verification
   → Implementation: CSS modifications (single file)
   → Tests: Visual regression, cross-browser, mobile
   → Deploy: Build, PR, merge
4. Apply task rules:
   → Single file CSS = sequential implementation
   → Visual tests = parallel [P] execution
   → TDD not applicable (CSS styling, not logic)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Validate task completeness
8. Return: SUCCESS (8 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different test pages, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Target file**: `themes/ryokosuge-theme/assets/css/main.css`
- **Test scope**: All content types (research-logs, daily-logs, english-conversation)

## Phase 3.1: Setup & Preparation

- [x] **T001** Verify current branch is `002-ul-li` and Hugo dependencies are installed
  ```bash
  # Commands:
  git branch --show-current  # Should output: 002-ul-li
  hugo version               # Should show Hugo installed
  cd themes/ryokosuge-theme && npm list tailwindcss  # Verify Tailwind
  ```
  **Files**: N/A (verification only)
  **Expected**: Branch confirmed, Hugo available, Tailwind installed

## Phase 3.2: Core Implementation

- [x] **T002** Modify `.prose-ja ul` style in `themes/ryokosuge-theme/assets/css/main.css`
  ```css
  # Change lines 50-56:
  .prose-ja ul {
    margin-top: 1em;
    margin-bottom: 1em;
    padding-left: 1.5em;       /* CHANGE: was 0 */
    margin-left: 0;
    list-style-type: square;   /* ADD: square marker */
  }
  ```
  **Files**: `themes/ryokosuge-theme/assets/css/main.css` (lines 50-56)
  **Dependencies**: None
  **Expected**: ul elements have square marker definition

- [x] **T003** Add `.prose-ja ol` style in `themes/ryokosuge-theme/assets/css/main.css`
  ```css
  # Add after .prose-ja ul:
  .prose-ja ol {
    margin-top: 1em;
    margin-bottom: 1em;
    padding-left: 1.5em;       /* ADD: number display area */
    margin-left: 0;
    list-style-type: decimal;  /* ADD: decimal numbering */
  }
  ```
  **Files**: `themes/ryokosuge-theme/assets/css/main.css` (insert after ul block)
  **Dependencies**: T002 (same file, sequential)
  **Expected**: ol elements have decimal numbering

- [x] **T004** Modify `.prose-ja li` style in `themes/ryokosuge-theme/assets/css/main.css`
  ```css
  # Change lines 58-61:
  .prose-ja li {
    margin-bottom: 0.5em;
    margin-left: 0;            /* CHANGE: was 1.5em */
  }
  ```
  **Files**: `themes/ryokosuge-theme/assets/css/main.css` (lines 58-61)
  **Dependencies**: T002, T003 (same file, sequential)
  **Expected**: li margin controlled by parent ul/ol padding

## Phase 3.3: Visual Testing (Contract Validation)

- [x] **T005** [P] Start Hugo dev server and perform visual regression test for research-logs
  ```bash
  # Terminal 1:
  make server  # or: hugo server -D

  # Browser:
  # Open http://localhost:1313/research-logs/
  # Select any post with bullet lists
  # Verify:
  # ✅ Square markers (▪) displayed
  # ✅ Nested lists (2-3 levels) all have square markers
  # ✅ Marker color matches text color
  # ✅ Spacing between marker and text is appropriate
  ```
  **Files**: N/A (manual visual test)
  **Dependencies**: T004 (CSS complete)
  **Contract**: css-contract.md → Contract 1 & 2
  **Expected**: All FR-001, FR-002, FR-003, FR-004 validated on research-logs

- [x] **T006** [P] Visual regression test for daily-logs and english-conversation
  ```bash
  # Browser (dev server still running):
  # Test daily-logs:
  # Open http://localhost:1313/daily-logs/
  # Select post with lists → verify markers

  # Test english-conversation:
  # Open http://localhost:1313/english-conversation/
  # Select post with lists → verify markers

  # Checklist:
  # ✅ Square markers on all content types
  # ✅ Consistent appearance across pages
  ```
  **Files**: N/A (manual visual test)
  **Dependencies**: T004 (CSS complete)
  **Contract**: css-contract.md → Contract 1 & 3
  **Expected**: FR-003 validated (all content types uniform)

- [x] **T007** [P] Cross-browser and theme testing (Light/Dark mode)
  ```bash
  # Light Mode test:
  # Browser DevTools → Toggle dark mode OFF
  # Verify marker color = text color (dark)

  # Dark Mode test:
  # Browser DevTools → Toggle dark mode ON
  # Verify marker color = text color (light)

  # Cross-browser (if available):
  # Safari: open -a Safari http://localhost:1313
  # Firefox: open -a Firefox http://localhost:1313
  # Chrome: open -a "Google Chrome" http://localhost:1313

  # Checklist:
  # ✅ Light mode: markers visible, correct color
  # ✅ Dark mode: markers visible, correct color
  # ✅ All browsers: square markers displayed
  ```
  **Files**: N/A (manual visual test)
  **Dependencies**: T004 (CSS complete)
  **Contract**: css-contract.md → Contract 3 & 5
  **Expected**: FR-007 validated (color inheritance), cross-browser compatibility

- [x] **T008** [P] Mobile responsive and spacing validation
  ```bash
  # Chrome DevTools:
  # 1. Open DevTools (Cmd+Option+I)
  # 2. Toggle device toolbar (Cmd+Shift+M)
  # 3. Test viewports:
  #    - iPhone 14 Pro (393px)
  #    - iPad (768px)
  #    - Desktop (1920px)

  # For each viewport, verify:
  # ✅ Square markers displayed
  # ✅ Marker-to-text spacing consistent
  # ✅ No layout breaks or overflow
  # ✅ Nested lists properly indented
  ```
  **Files**: N/A (manual visual test)
  **Dependencies**: T004 (CSS complete)
  **Contract**: css-contract.md → Contract 4
  **Expected**: FR-005 validated (spacing), responsive design confirmed

## Phase 3.4: Production Build & Deployment

- [x] **T009** Verify production build and create pull request
  ```bash
  # 1. Production build test
  hugo

  # 2. Verify generated CSS
  cat public/css/main.*.css | grep -A2 "prose-ja ul"
  # Expected output: list-style-type:square; padding-left:1.5em

  # 3. Commit changes
  git add themes/ryokosuge-theme/assets/css/main.css
  git commit -m "fix: ul/liタグに四角マーカーを表示

  - .prose-ja ul に list-style-type: square 追加
  - padding-left を 0 → 1.5em に変更してマーカー領域確保
  - .prose-ja ol も同様に decimal マーカー明示
  - li の margin-left を 1.5em → 0 に変更（ul/ol padding で制御）

  Closes #002"

  # 4. Push and create PR
  git push origin 002-ul-li

  gh pr create \
    --title "fix: ul/liタグに四角マーカーを表示" \
    --body "$(cat specs/002-ul-li/quickstart.md | sed -n '/## 概要/,/## テスト結果/p')" \
    --assignee @me

  # 5. Open PR in browser
  gh pr view --web
  ```
  **Files**:
  - `themes/ryokosuge-theme/assets/css/main.css` (commit)
  - PR creation
  **Dependencies**: T005, T006, T007, T008 (all tests pass)
  **Expected**: PR created with test evidence, ready for review

## Dependencies

```
T001 (Setup)
  ↓
T002 (ul CSS) → T003 (ol CSS) → T004 (li CSS)
  ↓
T005, T006, T007, T008 (Visual tests) [P - can run in parallel]
  ↓
T009 (Build & PR)
```

## Parallel Execution Examples

### Phase 3.3: Visual Tests (After T004)
```bash
# All visual tests can run in parallel (different browser tabs/windows)
# Open multiple terminals/tabs:

# Tab 1: Research-logs test
# Tab 2: Daily-logs & English-conversation test
# Tab 3: Cross-browser & theme test
# Tab 4: Mobile responsive test

# All tests validate different aspects using same dev server
```

## Notes

- **No TDD**: CSS styling doesn't require failing tests first (visual validation)
- **Single file**: T002-T004 must be sequential (same main.css file)
- **[P] tests**: T005-T008 are parallel (different pages/viewports)
- **Commit strategy**: Single commit after implementation, before tests
- **Quick execution**: Estimated 20-30 minutes total

## Task Generation Rules Applied

1. **From Contracts** (css-contract.md):
   - Contract 1 & 2 → T005 (marker display & nesting)
   - Contract 3 → T007 (color inheritance)
   - Contract 4 → T008 (spacing)
   - Contract 5 → T007 (cross-browser)

2. **From Data Model** (data-model.md):
   - ul properties → T002
   - ol properties → T003
   - li properties → T004

3. **From Quickstart** (quickstart.md):
   - Setup steps → T001
   - Implementation steps → T002-T004
   - Test checklist → T005-T008
   - Deploy steps → T009

4. **Ordering**:
   - Setup → Implementation → Tests → Deploy
   - Sequential CSS edits (same file)
   - Parallel visual tests (different validation aspects)

## Validation Checklist

- [x] All contracts have corresponding tests (5 contracts → T005-T008)
- [x] All CSS properties have modification tasks (ul, ol, li → T002-T004)
- [x] Visual tests come after implementation (T002-T004 before T005-T008)
- [x] Parallel tasks truly independent (different pages/browsers/viewports)
- [x] Each task specifies exact file path or test scope
- [x] No task modifies same file as another [P] task (T002-T004 sequential)

---

**Total Tasks**: 9 (1 setup + 3 implementation + 4 tests + 1 deploy)
**Estimated Time**: 20-30 minutes
**Parallel Opportunities**: T005-T008 (visual tests)
