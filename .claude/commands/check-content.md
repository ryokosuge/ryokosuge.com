# Content Style Check

Check blog content against the style guide and provide improvement suggestions.

## Usage

This command analyzes Hugo blog content for style issues and provides specific suggestions based on the project's style guide.

## Implementation

```javascript
// Get the currently open content file
const activeFile = await claude.workspace.getActiveFile();
if (!activeFile || !activeFile.path.includes('content/')) {
  return "Please open a content file (.md) in the content/ directory before running this command.";
}

// Read the content and style guide
const content = await claude.fs.readFile(activeFile.path);
const styleGuide = await claude.fs.readFile('/Users/ryokosuge/Workspaces/github.com/ryokosuge/ryokosuge.com/ARTICLE_STYLE_GUIDE.md');

// Analyze the content
const prompt = `
以下のHugoブログコンテンツを、提供されたスタイルガイドに基づいて分析し、改善提案を行ってください。

スタイルガイド:
${styleGuide}

ブログコンテンツ:
${content}

以下の観点でチェックし、具体的な改善提案を行ってください:

## チェック項目
1. **話し言葉チェック**: 口語表現の有無と修正提案
2. **繰り返し表現チェック**: 冗長な表現の特定と改善案
3. **文体統一チェック**: 「です・ます調」の統一状況
4. **専門性チェック**: ブログ記事として適切な表現の使用

## 出力形式
### ✅ 良い点
- 既に適切に書かれている部分を評価

### ⚠️ 改善提案
各問題点について:
- **問題箇所**: 具体的な文章を引用
- **問題点**: なぜ改善が必要か
- **修正提案**: 具体的な修正案

### 📊 総合評価
- 全体的な文体の統一度
- 読みやすさの評価
- 推奨される次のアクション

具体的で実行可能な改善提案を心がけてください。
`;

return await claude.complete(prompt);
```