export const BOOKMARK_HATENA_BOOKMARK_URL =
  "https://b.hatena.ne.jp/ryo_kosuge/bookmark.rss";

export type Bookmark = {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  publishedAt: string;
  comment?: string;
};
