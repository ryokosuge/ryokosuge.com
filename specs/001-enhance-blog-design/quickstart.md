# Quickstart: Hugo Theme Setup and Verification

## Prerequisites
- Hugo installed (>= 0.140.0)
- Node.js and npm installed (>= 18.x)
- Git installed

## Setup Steps

### 1. Install Dependencies
```bash
cd themes/ryokosuge-theme
npm install
cd ../..
```

### 2. Update Hugo Configuration
Edit `config.yaml`:
```yaml
theme: ryokosuge-theme
languageCode: ja-jp

build:
  writeStats: true

[build.cachebusters]
  source = "assets/watching/hugo_stats\\.json"
  target = "styles\\.css"

[[build.cachebusters]]
  source = "(postcss|tailwind)\\.config\\.js"
  target = "css"
```

### 3. Start Development Server
```bash
make server
# または
hugo server -D
```

### 4. Verify Theme is Working
Open browser to `http://localhost:1313/`

## Verification Checklist

### Visual Checks
- [ ] ページが正しく表示される
- [ ] 日本語フォント（Noto Sans JP）が読み込まれている
- [ ] ダークモード切替ボタンが表示される
- [ ] ダークモード切替が動作する
- [ ] ライトモードで読みやすい
- [ ] ダークモードで読みやすい

### Responsive Design Checks
- [ ] デスクトップで正しく表示される（1920px）
- [ ] タブレットで正しく表示される（768px）
- [ ] モバイルで正しく表示される（375px）
- [ ] ナビゲーションがモバイルで使える

### Content Type Checks
- [ ] Research Logsに青色バッジが表示される
- [ ] Daily Logsに緑色バッジが表示される
- [ ] English Conversationに紫色バッジが表示される
- [ ] 各コンテンツタイプのアイコンが表示される

### Typography Checks
- [ ] 本文の行間が適切（1.85以上）
- [ ] 文字間隔が適切（0.05em）
- [ ] 見出しが適切なサイズ
- [ ] コードブロックが読みやすい
- [ ] リンクが見やすい

### Dark Mode Checks
- [ ] ページ読み込み時に白いフラッシュがない（FOUC防止）
- [ ] トグルボタンをクリックするとモードが切り替わる
- [ ] ページをリロードしてもモードが維持される
- [ ] システム設定に従ってデフォルトモードが設定される
- [ ] アイコンが現在のモードを正しく表示する

### Performance Checks
- [ ] Tailwind CSSが正しくビルドされている
- [ ] CSSファイルサイズが妥当（< 50KB after gzip）
- [ ] 初回ペイントが速い（< 1秒）
- [ ] フォントがスムーズに読み込まれる（font-display: swap）

## Common Issues

### Issue: Tailwind classes not working
**Solution:**
```bash
# Verify PostCSS is configured
cat themes/ryokosuge-theme/postcss.config.js

# Check Hugo build stats
hugo --printPathWarnings
```

### Issue: Dark mode FOUC (white flash)
**Solution:**
Verify dark-mode-script.html is included BEFORE styles in baseof.html:
```html
<head>
  {{ partial "head/dark-mode-script.html" . }}  <!-- MUST BE FIRST -->
  {{ partial "head/styles.html" . }}
</head>
```

### Issue: Japanese fonts not loading
**Solution:**
Check browser network tab for font loading. Verify Noto Sans JP is loading from Google Fonts or local fonts directory.

### Issue: CSS not updating
**Solution:**
```bash
# Clear Hugo cache
rm -rf resources/_gen/

# Restart Hugo server
hugo server -D --disableFastRender
```

## Testing Scenarios

### Scenario 1: New User Visits Site (Light System Preference)
1. Clear localStorage: `localStorage.clear()`
2. Set OS to light mode
3. Refresh page
4. **Expected**: Site loads in light mode, no flash

### Scenario 2: New User Visits Site (Dark System Preference)
1. Clear localStorage: `localStorage.clear()`
2. Set OS to dark mode
3. Refresh page
4. **Expected**: Site loads in dark mode, no flash

### Scenario 3: User Toggles to Dark Mode
1. Start in light mode
2. Click dark mode toggle
3. Refresh page
4. **Expected**: Site loads in dark mode, preference persists

### Scenario 4: User Toggles to Light Mode
1. Start in dark mode
2. Click light mode toggle
3. Refresh page
4. **Expected**: Site loads in light mode, preference persists

### Scenario 5: Mobile Responsive View
1. Open Chrome DevTools
2. Toggle device toolbar (Cmd+Shift+M)
3. Select iPhone 12 Pro
4. **Expected**: Site is readable, navigation works, no horizontal scroll

### Scenario 6: Content Type Badge Display
1. Navigate to Research Logs list
2. **Expected**: Each post has blue badge with search icon
3. Navigate to Daily Logs list
4. **Expected**: Each post has green badge with calendar icon
5. Navigate to English Conversation list
6. **Expected**: Each post has purple badge with chat icon

## Success Criteria

All checklist items above must pass for theme to be considered working correctly.

## Next Steps

After verification:
1. Customize color scheme in `themes/ryokosuge-theme/tailwind.config.js`
2. Add custom typography styles in `themes/ryokosuge-theme/assets/css/main.css`
3. Customize header/footer in respective partials
4. Add site logo and favicon
5. Configure menu items in `config.yaml`
