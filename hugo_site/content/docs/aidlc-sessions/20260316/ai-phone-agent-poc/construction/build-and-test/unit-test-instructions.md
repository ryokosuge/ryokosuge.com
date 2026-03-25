---
title: "Unit Test Instructions: AI Agent 電話会話 PoC"
date: 2026-03-16T00:00:00+09:00
draft: false
---
## テスト戦略

本プロジェクトは PoC スコープのため、自動テストは設けていません。
TypeScript の型チェックによる静的検証のみ実施します。

## 型チェックの実行

```bash
bun run tsc --noEmit
```

### 期待される結果
- エラーなしで完了すること
- 警告がある場合は内容を確認し、問題なければ無視可

## 今後の拡張（PoC 後）

PoC 検証後に本格開発へ移行する場合、以下のテストを追加検討：

| テスト種別 | 対象 | ツール候補 |
|---|---|---|
| Unit Test | `twilio-service.ts`, `openai-service.ts` | bun:test |
| Mock Test | 外部 API 呼び出し（Twilio, OpenAI） | bun:test + msw |
