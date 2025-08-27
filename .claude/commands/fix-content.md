# Content Style Fix

Automatically fix style issues in blog content based on the style guide.

## Usage

This command automatically applies style guide corrections to Hugo blog content and shows what changes were made.

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

// Fix the content
const prompt = `
以下のHugoブログ記事を、提供されたスタイルガイドに基づいて修正してください。

スタイルガイド:
${styleGuide}

記事内容:
${content}

以下の修正を適用してください:

## 修正項目
1. **話し言葉の修正**: 口語表現を書き言葉に変更
2. **繰り返し表現の改善**: 冗長な表現を簡潔に
3. **文体統一**: 「です・ます調」に統一
4. **専門性向上**: より適切な表現に変更

## 出力形式
### 修正後の記事
\`\`\`markdown
[修正後の完全な記事内容]
\`\`\`

### 主な変更点
- **変更1**: [変更前] → [変更後]
- **変更2**: [変更前] → [変更後]
- **変更3**: [変更前] → [変更後]

### 修正の方針
- 記事の価値と体験談の価値は保持
- 読者にとって親しみやすい文体に調整
- 専門性を損なわない範囲での改善

重要: 記事のfrontmatter（---で囲まれた部分）とコードブロック、引用部分は変更しないでください。
本文の文体と表現のみを修正してください。
`;

const result = await claude.complete(prompt);

// Ask if the user wants to apply the changes
const applyChanges = await claude.askUser("修正内容を確認しました。この変更をファイルに適用しますか？", ["Yes", "No"]);

if (applyChanges === "Yes") {
  // Extract the corrected content and apply it
  const correctedMatch = result.match(/```markdown\n([\s\S]*?)\n```/);
  if (correctedMatch) {
    await claude.fs.writeFile(activeFile.path, correctedMatch[1]);
    return result + "\n\n✅ 変更がファイルに適用されました。";
  } else {
    return result + "\n\n❌ 修正内容の抽出に失敗しました。手動で適用してください。";
  }
} else {
  return result + "\n\n📝 変更は適用されませんでした。必要に応じて手動で修正してください。";
}
```