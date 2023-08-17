export type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  content: string;
  sections: PostSection[];
};

export const FieldID = {
  POST_SECTION_TEXT: "post_section_text",
  POST_SECTION_CODE: "post_section_code",
  POST_SECTION_RICH_EDITOR: "post_section_rich_v2",
} as const;

export type FieldIDType = (typeof FieldID)[keyof typeof FieldID];

export type PostSection =
  | PostSectionText
  | PostSectionCode
  | PostSectionRichText;

export type PostSectionText = {
  fieldId: "post_section_text";
  body: string;
};

export type PostSectionCode = {
  fieldId: "post_section_code";
  lang: PostSectionCodeLang[];
  code: string;
};

export type PostSectionRichText = {
  fieldId: "post_section_rich_v2";
  content: string;
};

export type PostSectionCodeLang = "go" | "typescript";

export type HeaderNavItem = {
  name: string;
  path: string;
};

export type SocialLink = {
  name: string;
  link: string;
  icon: string;
};

export type OGPData = {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export type Bookmark = OGPData & {
  publishedAt: string;
  comment?: string;
};
