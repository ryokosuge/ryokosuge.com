export type Article = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  eyecatch?: ArticleEyecatch;
};

export type ArticleEyecatch = {
  url: string;
  width: number;
  height: number;
};
