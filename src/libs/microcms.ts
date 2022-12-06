import { createClient, MicroCMSQueries } from "microcms-js-sdk";
import type { Blog } from "../types";

const END_POINTS = {
  BLOGS: "blogs",
} as const;

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

type GetBlogsInput = {
  queries?: MicroCMSQueries;
};

export const getBlogs = async (input?: GetBlogsInput) => {
  return await client.getList<Blog>({
    endpoint: END_POINTS.BLOGS,
    queries: input?.queries,
  });
};

type GetBlogInput = {
  contentId: string;
  queries?: MicroCMSQueries;
};

export const getBlog = async ({ contentId, queries }: GetBlogInput) => {
  return await client.get<Blog>({
    endpoint: END_POINTS.BLOGS,
    contentId,
    queries,
  });
};
