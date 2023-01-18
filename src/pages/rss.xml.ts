import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../config";
import { fetchPosts } from "../libs/microcms";

export const get = async () => {
  const { contents } = await fetchPosts();
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: contents.map(({ id, title, description, publishedAt }) => ({
      link: `/blog/posts/${id}`,
      title,
      description,
      pubDate: new Date(publishedAt),
    })),
  });
};
