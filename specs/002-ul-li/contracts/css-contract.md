# CSS Contract: List Marker Display

## Contract Overview
CSSスタイル定義の「契約」。期待される視覚的な振る舞いとCSSルールの対応関係を定義。

## Contract 1: Square Marker Display (FR-001, FR-002)

### Input
```html
<div class="prose-ja">
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</div>
```

### Expected CSS Rules
```css
.prose-ja ul {
  list-style-type: square;
  padding-left: 1.5em;
}
```

### Expected Visual Output
- ✅ 各 `<li>` の左側に四角マーカー（▪）表示
- ✅ マーカーとテキスト間に適切なスペース
- ✅ マーカー色 = テキスト色

### Validation Criteria
```javascript
// Pseudo-test (conceptual)
const ul = document.querySelector('.prose-ja ul');
const computedStyle = window.getComputedStyle(ul);

assert(computedStyle.listStyleType === 'square');
assert(computedStyle.paddingLeft === '1.5em' || '24px'); // 1.5em = 24px (16px base)
```

## Contract 2: Nested List Uniformity (FR-004)

### Input
```html
<div class="prose-ja">
  <ul>
    <li>Level 1
      <ul>
        <li>Level 2
          <ul>
            <li>Level 3</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</div>
```

### Expected CSS Behavior
```css
/* 全レベルで同一ルール適用（継承） */
.prose-ja ul {
  list-style-type: square;  /* 全ネストレベルで継承 */
}
```

### Expected Visual Output
- ✅ Level 1: 四角マーカー
- ✅ Level 2: 四角マーカー（同じスタイル）
- ✅ Level 3: 四角マーカー（同じスタイル）
- ✅ インデントは階層ごとに1.5em加算

### Validation Criteria
```javascript
const nestedUls = document.querySelectorAll('.prose-ja ul ul, .prose-ja ul ul ul');
nestedUls.forEach(ul => {
  const style = window.getComputedStyle(ul);
  assert(style.listStyleType === 'square');
});
```

## Contract 3: Color Inheritance (FR-007)

### Input (Light Mode)
```html
<div class="prose-ja">
  <ul>
    <li>Light mode text</li>
  </ul>
</div>
```

### Expected CSS Behavior
```css
.prose-ja ul {
  list-style-type: square;
  /* color は親要素から継承 */
}
```

### Expected Visual Output
- ✅ Light mode: マーカー色 = テキスト色（通常黒系）
- ✅ Dark mode: マーカー色 = テキスト色（白系に自動変更）

### Validation Criteria
```javascript
const li = document.querySelector('.prose-ja ul li');
const liStyle = window.getComputedStyle(li);
const liColor = liStyle.color;

// マーカー色は ::marker 疑似要素経由で取得（簡略化）
// 実際は currentColor なので li.color と同一
assert(markerColor === liColor);
```

## Contract 4: Spacing Consistency (FR-005)

### Input
```html
<div class="prose-ja">
  <ul>
    <li>First item</li>
    <li>Second item</li>
  </ul>
</div>
```

### Expected CSS Rules
```css
.prose-ja ul {
  padding-left: 1.5em;  /* マーカー表示領域 */
}

.prose-ja li {
  margin-left: 0;       /* ul padding で制御 */
}
```

### Expected Visual Output
- ✅ マーカーとテキスト間: ブラウザデフォルトスペース（約0.5em相当）
- ✅ 左インデント: 1.5em（ulのpadding）

### Validation Criteria
```javascript
const ul = document.querySelector('.prose-ja ul');
const li = document.querySelector('.prose-ja li');

const ulStyle = window.getComputedStyle(ul);
const liStyle = window.getComputedStyle(li);

assert(ulStyle.paddingLeft === '1.5em' || '24px');
assert(liStyle.marginLeft === '0px');
```

## Contract 5: Cross-Browser Consistency (Edge Case)

### Browsers Tested
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

### Expected Behavior (All Browsers)
```css
.prose-ja ul {
  list-style-type: square;
  padding-left: 1.5em;
}
```

### Validation Criteria
- ✅ 全ブラウザで四角マーカー表示
- ✅ マーカー形状の微差は許容（ブラウザレンダリングエンジン差異）
- ✅ 色・配置は一貫

## Contract Test Implementation

### Manual Visual Test Checklist
```markdown
# test/visual/list-marker-test.md

## Test Cases
- [ ] TC-1: 単一リストで四角マーカー表示
- [ ] TC-2: ネストリスト（3階層）で全階層四角マーカー
- [ ] TC-3: Light modeでテキスト色と同色
- [ ] TC-4: Dark modeでテキスト色と同色
- [ ] TC-5: Chrome, Safari, Firefox各ブラウザで表示確認
- [ ] TC-6: モバイルビュー（375px幅）で表示確認
- [ ] TC-7: デスクトップビュー（1920px幅）で表示確認
```

### Automated Test (Future Enhancement)
```javascript
// specs/002-ul-li/contracts/list-marker.test.js
describe('List Marker Display Contract', () => {
  it('should display square markers', () => {
    const ul = document.querySelector('.prose-ja ul');
    expect(getComputedStyle(ul).listStyleType).toBe('square');
  });

  it('should have correct padding', () => {
    const ul = document.querySelector('.prose-ja ul');
    expect(getComputedStyle(ul).paddingLeft).toBe('24px'); // 1.5em @ 16px base
  });
});
```

## Contract Failure Scenarios

### Scenario 1: Marker Not Displayed
**Cause**: `padding-left: 0` のまま
**Detection**: Visual test failure
**Fix**: `padding-left: 1.5em` 追加確認

### Scenario 2: Wrong Marker Shape
**Cause**: `list-style-type` 未指定
**Detection**: マーカーが disc (丸) で表示
**Fix**: `list-style-type: square` 追加確認

### Scenario 3: Nested Lists Different Style
**Cause**: 継承ブロック or 詳細度問題
**Detection**: Level 2以降でマーカー消失
**Fix**: セレクター詳細度確認

## Contract Versioning
- **Version**: 1.0.0
- **Last Updated**: 2025-10-03
- **Status**: Draft (Implementation pending)
