import { createClient, MicroCMSQueries } from "microcms-js-sdk";

const END_POINTS = {
  Posts: "posts",
} as const;

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN ?? "",
  apiKey: process.env.MICROCMS_API_KEY ?? "",
});

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

type FetchPostsInput = {
  queries?: MicroCMSQueries;
};

export const fetchPosts = async (input?: FetchPostsInput) => {
  return await client.getList<Post>({
    endpoint: END_POINTS.Posts,
    queries: {
      limit: 100,
      ...input?.queries,
    },
  });
};

type FetchPostInput = {
  postID: string;
};

export const fetchPost = async ({ postID }: FetchPostInput) => {
  return await client.get<Post>({
    endpoint: END_POINTS.Posts,
    contentId: postID,
  });
};
