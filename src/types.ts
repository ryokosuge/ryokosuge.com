export type Article = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  sections: ArticleSection[];
};

export const FieldID = {
  ARTICLE_SECTION_TEXT: "article_section_text",
  ARTICLE_SECTION_CODE: "article_section_code",
} as const;

export type FieldIDType = typeof FieldID[keyof typeof FieldID];

export type ArticleSection = ArticleSectionText | ArticleSectionCode;

export type ArticleSectionText = {
  fieldId: "article_section_text";
  body: string;
};

export type ArticleSectionCode = {
  fieldId: "article_section_code";
  lang: ArticleSectionCodeLang[];
  code: string;
};

export type ArticleSectionCodeLang = "go" | "typescript";
