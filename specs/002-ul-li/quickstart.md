# Quickstart: List Marker Display Fix

## 目的
ul/liタグの箇条書きマーカー表示修正の実装・テスト・デプロイ手順を提供。

## 前提条件
- ✅ Hugo がインストールされている
- ✅ リポジトリが `002-ul-li` ブランチにチェックアウトされている
- ✅ Node.js がインストールされている（Tailwind CSS用）

## 実装手順

### Step 1: CSS ファイルを修正

```bash
# エディタで開く
open themes/ryokosuge-theme/assets/css/main.css
```

**修正箇所** (50-61行目):

#### Before (現状)
```css
.prose-ja ul,
.prose-ja ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 0;      /* ← 修正対象 */
  margin-left: 0;
}

.prose-ja li {
  margin-bottom: 0.5em;
  margin-left: 1.5em;   /* ← 修正対象 */
}
```

#### After (修正後)
```css
.prose-ja ul {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;       /* 変更: マーカー領域確保 */
  margin-left: 0;
  list-style-type: square;   /* 追加: 四角マーカー */
}

.prose-ja ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;       /* 変更: 番号領域確保 */
  margin-left: 0;
  list-style-type: decimal;  /* 追加: 番号リスト明示 */
}

.prose-ja li {
  margin-bottom: 0.5em;
  margin-left: 0;            /* 変更: ul/ol padding で制御 */
}
```

### Step 2: ローカルでテスト

```bash
# Hugo開発サーバー起動
make server

# または直接
hugo server -D
```

**アクセス**: http://localhost:1313

### Step 3: Visual テスト実施

#### テストページ例
1. **Research Log** (箇条書きを含むページ)
   - URL: http://localhost:1313/research-logs/[記事ID]/

2. **Daily Log** (箇条書きを含むページ)
   - URL: http://localhost:1313/daily-logs/[YYYYMMDD]/

3. **English Conversation** (箇条書きを含むページ)
   - URL: http://localhost:1313/english-conversation/[記事ID]/

#### 確認項目チェックリスト

```markdown
## Visual Test Checklist

### ✅ FR-001: マーカー表示
- [ ] 単一リスト（ul）で四角マーカー（▪）が表示される
- [ ] 各 li 要素の左側にマーカーが表示される

### ✅ FR-002: マーカータイプ
- [ ] マーカーの形状が四角（square）である
- [ ] 丸（disc）や他の形状でない

### ✅ FR-003: 全コンテンツタイプ対応
- [ ] research-logs でマーカー表示
- [ ] daily-logs でマーカー表示
- [ ] english-conversation でマーカー表示

### ✅ FR-004: ネストリスト
- [ ] 2階層ネストで両階層とも四角マーカー
- [ ] 3階層ネストで全階層とも四角マーカー
- [ ] インデントが階層ごとに適切

### ✅ FR-005: スペーシング
- [ ] マーカーとテキスト間のスペースが適切
- [ ] リスト全体の左インデントが1.5em

### ✅ FR-006: テーマ調和
- [ ] 既存デザインと違和感がない
- [ ] フォント、色、レイアウトが統一

### ✅ FR-007: 色対応
- [ ] Light mode: マーカー色 = テキスト色
- [ ] Dark mode: マーカー色 = テキスト色（白系に自動変更）
```

### Step 4: Cross-Browser テスト

#### デスクトップ
```bash
# Chrome でテスト
open -a "Google Chrome" http://localhost:1313

# Safari でテスト
open -a Safari http://localhost:1313

# Firefox でテスト (インストール済みの場合)
open -a Firefox http://localhost:1313
```

#### モバイルエミュレーション (Chrome DevTools)
1. Chrome で開く
2. DevTools を開く (Cmd+Option+I)
3. デバイスツールバーを表示 (Cmd+Shift+M)
4. iPhone 14 Pro (375px) で確認
5. iPad (768px) で確認

### Step 5: 本番ビルドテスト

```bash
# 本番用ビルド
hugo

# public/ ディレクトリ確認
ls -la public/

# CSSファイル確認（Tailwindビルド済み）
cat public/css/main.*.css | grep "list-style-type"
```

**期待される出力**:
```css
.prose-ja ul{list-style-type:square;...}
```

## トラブルシューティング

### 問題1: マーカーが表示されない

**原因**: CSSキャッシュ
**解決**:
```bash
# ブラウザハードリロード
Cmd+Shift+R (Chrome/Safari)

# または開発サーバー再起動
make server
```

### 問題2: Tailwind CSSビルドエラー

**原因**: node_modules未インストール
**解決**:
```bash
cd themes/ryokosuge-theme
npm install
cd ../..
hugo server -D
```

### 問題3: ネストリストでマーカー消失

**原因**: CSS詳細度問題
**確認**:
```bash
# ブラウザDevToolsで確認
# Elements > ul.prose-ja > Computed > list-style-type
```

**期待値**: `square` (全ネストレベル)

## デプロイ手順

### Step 1: コミット

```bash
# 変更確認
git diff themes/ryokosuge-theme/assets/css/main.css

# ステージング
git add themes/ryokosuge-theme/assets/css/main.css

# コミット
git commit -m "fix: ul/liタグに四角マーカーを表示

- .prose-ja ul に list-style-type: square 追加
- padding-left を 0 → 1.5em に変更してマーカー領域確保
- .prose-ja ol も同様に decimal マーカー明示
- li の margin-left を 1.5em → 0 に変更（ul/ol padding で制御）

Closes #002
"
```

### Step 2: プッシュ & PR作成

```bash
# プッシュ
git push origin 002-ul-li

# PR作成（GitHub CLI使用）
gh pr create \
  --title "fix: ul/liタグに四角マーカーを表示" \
  --body "$(cat <<'EOF'
## 概要
箇条書きリスト（ul/li）に四角マーカー（▪）を表示する修正。

## 変更内容
- `.prose-ja ul` に `list-style-type: square` 追加
- `padding-left` を `0` → `1.5em` に変更
- ネストリスト全階層で統一マーカー表示
- ライト/ダークモード両対応（色自動継承）

## テスト結果
- ✅ ローカル環境で全コンテンツタイプ確認
- ✅ Chrome, Safari, Firefox でクロスブラウザテスト
- ✅ モバイル/デスクトップ表示確認
- ✅ ネストリスト（3階層）動作確認

## 参考
- Spec: specs/002-ul-li/spec.md
- Research: specs/002-ul-li/research.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)" \
  --assignee @me

# PR URL取得
gh pr view --web
```

### Step 3: マージ & デプロイ

```bash
# PR承認後、マージ
gh pr merge --squash

# main ブランチに切り替え
git checkout main
git pull origin main

# デプロイは自動実行（GitHub Actions等）
# または手動デプロイの場合:
hugo
# public/ を本番環境にデプロイ
```

## ロールバック手順

万が一問題が発生した場合:

```bash
# コミットを特定
git log --oneline | grep "ul/li"

# Revert
git revert <commit-hash>
git push origin main
```

## 成功基準

全てのチェックリストが完了:
- ✅ CSS修正完了
- ✅ ローカルテスト PASS
- ✅ クロスブラウザテスト PASS
- ✅ 本番ビルド成功
- ✅ PR作成・マージ完了
- ✅ 本番環境で四角マーカー表示確認

## 所要時間目安
- 実装: 5分
- ローカルテスト: 10分
- クロスブラウザテスト: 10分
- PR作成・レビュー: 5分
- **合計: 約30分**
