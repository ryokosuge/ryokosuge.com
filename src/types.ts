export type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  sections: PostSection[];
};

export const FieldID = {
  POST_SECTION_TEXT: "post_section_text",
  POST_SECTION_CODE: "post_section_code",
} as const;

export type FieldIDType = (typeof FieldID)[keyof typeof FieldID];

export type PostSection = PostSectionText | PostSectionCode;

export type PostSectionText = {
  fieldId: "post_section_text";
  body: string;
};

export type PostSectionCode = {
  fieldId: "post_section_code";
  lang: PostSectionCodeLang[];
  code: string;
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
