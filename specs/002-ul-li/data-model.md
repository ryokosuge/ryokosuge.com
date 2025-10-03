# Data Model: CSS Style Definition

## 概要
このフィーチャーはデータモデルではなく、CSS スタイル定義の変更。視覚的な「状態」と「属性」としてモデル化。

## Style Entity: List Marker (リストマーカー)

### Visual States（表示状態）

#### State 1: Hidden (現状 - 問題状態)
```yaml
state: hidden
ul_padding_left: 0
ul_margin_left: 0
ul_list_style_type: none (implicit)
visual_result: マーカー非表示
```

#### State 2: Visible Square (目標状態)
```yaml
state: visible
ul_padding_left: 1.5em
ul_margin_left: 0
ul_list_style_type: square
marker_color: currentColor (テキスト色継承)
visual_result: 四角マーカー表示
```

### CSS Property Mapping（CSSプロパティマッピング）

#### For `ul` elements
| Property | Current Value | Target Value | Rationale |
|----------|---------------|--------------|-----------|
| `padding-left` | `0` | `1.5em` | マーカー表示領域確保 |
| `margin-left` | `0` | `0` (変更なし) | 外側余白は維持 |
| `list-style-type` | (未指定) | `square` | 四角マーカー指定 |
| `margin-top` | `1em` | `1em` (変更なし) | 上下マージン維持 |
| `margin-bottom` | `1em` | `1em` (変更なし) | 上下マージン維持 |

#### For `ol` elements
| Property | Current Value | Target Value | Rationale |
|----------|---------------|--------------|-----------|
| `padding-left` | `0` | `1.5em` | 番号表示領域確保 |
| `list-style-type` | (未指定) | `decimal` | 番号リスト明示 |

#### For `li` elements
| Property | Current Value | Target Value | Rationale |
|----------|---------------|--------------|-----------|
| `margin-left` | `1.5em` | `0` | ul/olのpaddingで制御に変更 |
| `margin-bottom` | `0.5em` | `0.5em` (変更なし) | 項目間スペース維持 |

### Nested List Behavior（ネストリスト動作）

```yaml
nesting_level_1:
  list_style_type: square
  padding_left: 1.5em

nesting_level_2:
  list_style_type: square (継承)
  padding_left: 1.5em (自動適用)
  total_indent: 3.0em (親 + 自身)

nesting_level_3:
  list_style_type: square (継承)
  padding_left: 1.5em (自動適用)
  total_indent: 4.5em (親2階層 + 自身)
```

**動作**: CSSカスケードにより、全ネストレベルで `square` マーカーが自動継承される。追加コード不要。

### Color Inheritance（色継承モデル）

```yaml
light_mode:
  text_color: inherit (theme default)
  marker_color: currentColor → text_colorを継承

dark_mode:
  text_color: inherit (theme dark default)
  marker_color: currentColor → text_colorを継承
```

**Validation Rule**: マーカー色は常にテキスト色と同一（FR-007準拠）

## CSS Selector Specificity（詳細度）

```yaml
selector: ".prose-ja ul"
specificity: (0, 1, 1)  # class + element
override_risk: low
reason: 既存の .prose-ja スコープ内で適用、外部への影響なし
```

## File Modification Scope（ファイル変更スコープ）

### Target File
```
Path: themes/ryokosuge-theme/assets/css/main.css
Lines: 50-61 (.prose-ja ul, .prose-ja ol, .prose-ja li セクション)
```

### Change Type
- **Type**: Modification (既存ルール更新)
- **Impact**: Global within `.prose-ja` context
- **Affected Pages**: 全ブログコンテンツ（research-logs, daily-logs, english-conversation）

## State Transition（状態遷移）

```
[Deployment前]
  ├─ CSS変更コミット
  ├─ ローカルビルド (hugo)
  └─ Visual確認

[Deployment]
  ├─ main branch merge
  ├─ 静的サイト再生成
  └─ マーカー表示ON

[Rollback可能]
  └─ Git revert → 元の非表示状態に戻る
```

## Constraints & Invariants（制約・不変条件）

### Invariants
1. `padding-left` 値 = `1.5em` (既存 `li { margin-left }` と同値)
2. `list-style-type: square` は全ネストレベルで統一
3. マーカー色 = テキスト色（常に）
4. `.prose-ja` スコープ外のリストは影響を受けない

### Constraints
- Tailwind CSS設定との互換性維持
- 既存のline-height, letter-spacing影響なし
- モバイル/デスクトップ共通スタイル（レスポンシブ対応不要）
