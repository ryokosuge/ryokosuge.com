import { createClient, MicroCMSQueries } from "microcms-js-sdk";
import type { Post } from "../types";

const END_POINTS = {
  Posts: "posts",
} as const;

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

type FetchPostsInput = {
  queries?: MicroCMSQueries;
};

export const fetchPosts = async (input?: FetchPostsInput) => {
  return await client.getList<Post>({
    endpoint: END_POINTS.Posts,
    queries: {
      draftKey: import.meta.env.MICROCMS_DRAFT_KEY,
      ...input?.queries,
    },
  });
};

type GetPostInput = {
  postID: string;
  queries?: MicroCMSQueries;
};

export const getPost = async ({ postID, queries }: GetPostInput) => {
  return await client.get<Post>({
    endpoint: END_POINTS.Posts,
    contentId: postID,
    queries: {
      draftKey: import.meta.env.MICROCMS_DRAFT_KEY,
      ...queries,
    },
  });
};
