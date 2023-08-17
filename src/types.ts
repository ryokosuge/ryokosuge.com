export type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  content: string;
};

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
