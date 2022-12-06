export type Blog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  eyecatch?: BlogEyecatch;
};

export type BlogEyecatch = {
  url: string;
  width: number;
  height: number;
};
