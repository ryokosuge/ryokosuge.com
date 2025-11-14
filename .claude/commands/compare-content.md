# Compare Content Style

Compare two blog posts or analyze style consistency across content.

## Usage

This command helps compare the writing style between blog posts or analyze style consistency across multiple posts in the project.

## Implementation

```javascript
// Get list of content files
const contentDir = '/Users/ryokosuge/Workspaces/github.com/ryokosuge/ryokosuge.com/content/';
const contentTypes = ['daily-logs', 'research', 'english', 'conversations'];
let allMarkdownFiles = [];

// Gather all markdown files from content directories
for (const type of contentTypes) {
  const typeDir = contentDir + type + '/';
  try {
    const files = await claude.fs.listFiles(typeDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    allMarkdownFiles = allMarkdownFiles.concat(markdownFiles.map(file => `${type}/${file}`));
  } catch (e) {
    // Directory might not exist, skip
  }
}

if (allMarkdownFiles.length === 0) {
  return "No content found in the content/ directories.";
}

// Present options to the user
const options = [
  "Compare two specific posts",
  "Analyze style consistency across all posts",
  "Check current post against style guide"
];

const choice = await claude.askUser("どの分析を実行しますか？", options);

const styleGuide = await claude.fs.readFile('/Users/ryokosuge/Workspaces/github.com/ryokosuge/ryokosuge.com/ARTICLE_STYLE_GUIDE.md');

if (choice === "Compare two specific posts") {
  // Let user select two posts to compare
  const post1 = await claude.askUser("最初の記事を選択してください:", allMarkdownFiles);
  const post2 = await claude.askUser("比較する記事を選択してください:", allMarkdownFiles.filter(f => f !== post1));
  
  const content1 = await claude.fs.readFile(contentDir + post1);
  const content2 = await claude.fs.readFile(contentDir + post2);
  
  const prompt = `
以下の2つのブログ記事の文体とスタイルを比較分析してください。

スタイルガイド:
${styleGuide}

記事1 (${post1}):
${content1}

記事2 (${post2}):
${content2}

## 比較分析項目
1. **文体の統一性**: 「です・ます調」の使用状況
2. **話し言葉の使用**: 口語表現の頻度と種類
3. **専門性のレベル**: 技術的表現の適切性
4. **読みやすさ**: 文章の流れと構造

## 出力形式
### 📊 比較結果
- **記事1の特徴**: 
- **記事2の特徴**: 
- **共通点**: 
- **相違点**: 

### 📝 推奨アクション
- **記事1への提案**: 
- **記事2への提案**: 
- **全体的な統一性向上のための提案**: 
`;

  return await claude.complete(prompt);

} else if (choice === "Analyze style consistency across all posts") {
  // Analyze all posts for consistency
  let allContent = "";
  for (const file of allMarkdownFiles.slice(0, 10)) { // Limit to first 10 files
    const content = await claude.fs.readFile(contentDir + file);
    allContent += `\n\n## ${file}\n${content}`;
  }
  
  const prompt = `
以下のHugoブログ記事群の文体とスタイルの一貫性を分析してください。

スタイルガイド:
${styleGuide}

記事一覧:
${allContent}

## 一貫性分析項目
1. **文体統一**: 全記事の「です・ます調」統一状況
2. **表現レベル**: 専門性と親しみやすさのバランス
3. **品質のばらつき**: 記事間の質的差異
4. **改善優先度**: 最も修正が必要な記事の特定

## 出力形式
### 📊 全体分析
- **統一性スコア**: (1-10)
- **主な問題点**: 
- **良い傾向**: 

### 📝 記事別評価
各記事の簡潔な評価と改善ポイント

### 🎯 改善計画
優先順位付きの具体的なアクションプラン
`;

  return await claude.complete(prompt);

} else {
  // Check current post against style guide
  const activeFile = await claude.workspace.getActiveFile();
  if (!activeFile || !activeFile.path.includes('content/')) {
    return "Please open a content file (.md) in the content/ directory.";
  }
  
  const content = await claude.fs.readFile(activeFile.path);
  
  const prompt = `
以下のHugoブログ記事をスタイルガイドと照らし合わせて詳細分析してください。

スタイルガイド:
${styleGuide}

記事内容:
${content}

## 詳細分析項目
1. **スタイルガイド準拠度**: 各項目の適合状況
2. **改善余地**: 具体的な修正が必要な箇所
3. **強み**: 既に優れている部分
4. **読者体験**: 読みやすさと親しみやすさの評価

## 出力形式
### ✅ スタイルガイド適合状況
- **文体統一**: ○/△/×
- **話し言葉修正**: ○/△/×
- **繰り返し表現**: ○/△/×
- **専門性**: ○/△/×

### 📋 具体的な修正提案
優先度の高い順に修正項目を列挙

### 🎯 次のアクション
この記事を改善するための具体的なステップ
`;

  return await claude.complete(prompt);
}
```