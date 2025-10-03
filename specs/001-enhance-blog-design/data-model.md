# Data Model: Hugo Theme Configuration

## Theme Configuration Entity

### theme.toml
テーマのメタデータを定義

**Fields:**
- `name`: テーマ名 (string) - "ryokosuge-theme"
- `license`: ライセンス (string) - "MIT"
- `description`: テーマの説明 (string)
- `homepage`: ホームページURL (string)
- `min_version`: 最小Hugoバージョン (string) - "0.140.0"

### tailwind.config.js
Tailwind CSSの設定を定義

**Fields:**
- `content`: スキャン対象パス (array) - Hugo templates
- `theme.extend.colors`: カスタムカラー定義 (object)
  - `primary`: 水色よりの青 (#3b82f6系)
  - `background`: 背景色
  - `text`: テキスト色
- `theme.extend.fontFamily`: フォントファミリー定義 (object)
  - `sans`: 日本語フォントスタック
- `theme.extend.lineHeight`: 行間定義 (object)
  - Japanese-optimized values (1.85-2.0)

### config.yaml (Hugo configuration)
Hugoサイトの設定

**Fields:**
- `theme`: テーマ名 (string) - "ryokosuge-theme"
- `languageCode`: 言語コード (string) - "ja-jp"
- `build.writeStats`: ビルド統計出力 (boolean) - true
- `mainSections`: メインセクション (array) - ["research-logs", "daily-logs", "english-conversation"]
- `menu`: メニュー定義 (object)

---

## Content Type Entities

### Research Log
調べ物まとめコンテンツ

**Fields:**
- `title`: タイトル (string)
- `date`: 作成日 (datetime)
- `draft`: 下書きフラグ (boolean)
- `tags`: タグ (array)
- `type`: コンテンツタイプ (string) - "research-logs"

**Style Attributes:**
- アクセントカラー: 青系
- アイコン: 検索/虫眼鏡
- バッジカラー: bg-blue-100 dark:bg-blue-900

### Daily Log
日報コンテンツ

**Fields:**
- `title`: タイトル (string) - 日付形式 (YYYYMMDD)
- `date`: 作成日 (datetime)
- `draft`: 下書きフラグ (boolean)
- `type`: コンテンツタイプ (string) - "daily-logs"

**Style Attributes:**
- アクセントカラー: 緑系
- アイコン: カレンダー
- バッジカラー: bg-green-100 dark:bg-green-900

### English Conversation
英会話練習コンテンツ

**Fields:**
- `title`: タイトル (string)
- `date`: 作成日 (datetime)
- `draft`: 下書きフラグ (boolean)
- `tags`: タグ (array)
- `type`: コンテンツタイプ (string) - "english-conversation"

**Style Attributes:**
- アクセントカラー: 紫系
- アイコン: 吹き出し/会話
- バッジカラー: bg-purple-100 dark:bg-purple-900

---

## Theme Component Entities

### Layout Template
ページレイアウトの構造

**Types:**
- `baseof.html`: ベーステンプレート
- `single.html`: 個別記事表示
- `list.html`: 一覧表示
- `index.html`: トップページ

**Relationships:**
- single.html → baseof.html (extends)
- list.html → baseof.html (extends)
- index.html → baseof.html (extends)

### Partial Component
再利用可能なコンポーネント

**Types:**
- `head.html`: HTMLヘッダー
- `header.html`: サイトヘッダー
- `footer.html`: サイトフッター
- `navigation.html`: ナビゲーション
- `content-type-badge.html`: コンテンツタイプバッジ
- `dark-mode-toggle.html`: ダークモード切替
- `dark-mode-script.html`: FOUC防止スクリプト

**Dependencies:**
- header.html → dark-mode-toggle.html (includes)
- baseof.html → dark-mode-script.html (includes in head)

---

## Style System Entities

### Color Scheme
カラーパレット定義

**Light Mode:**
- `background`: #ffffff
- `text`: #1f2937
- `primary`: #3b82f6 (水色よりの青)
- `secondary`: #6b7280
- `accent`: #0ea5e9

**Dark Mode:**
- `background`: #1f2937
- `text`: #f9fafb
- `primary`: #60a5fa (ライトバージョン)
- `secondary`: #9ca3af
- `accent`: #38bdf8

### Typography System
タイポグラフィ設定

**Font Stack:**
- Primary: "Noto Sans JP"
- Fallbacks: "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif

**Sizes:**
- Base: 16px
- Headings: 1.5rem - 2.5rem
- Code: 0.875rem

**Spacing:**
- Line Height: 1.85 (normal), 2.0 (relaxed)
- Letter Spacing: 0.05em (normal), 0.1em (wide)

---

## State Management

### Dark Mode State
ダークモード状態管理

**Storage:**
- Location: localStorage
- Key: "theme"
- Values: "light" | "dark" | null (system default)

**State Transitions:**
1. Initial: Check localStorage → fallback to system preference
2. User Toggle: Update DOM class + save to localStorage
3. System Change: Listen to media query changes (if no localStorage value)

**Validation Rules:**
- Must prevent FOUC (Flash of Unstyled Content)
- Must apply before page render
- Must persist across page navigations
