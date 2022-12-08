import { createClient, MicroCMSQueries } from "microcms-js-sdk";
import type { Article } from "../types";

const END_POINTS = {
  Articles: "articles",
} as const;

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

type FetchArticlesInput = {
  queries?: MicroCMSQueries;
};

export const fetchArticles = async (input?: FetchArticlesInput) => {
  return await client.getList<Article>({
    endpoint: END_POINTS.Articles,
    queries: input?.queries,
  });
};

type GetArticleInput = {
  articleID: string;
  queries?: MicroCMSQueries;
};

export const getArticle = async ({ articleID, queries }: GetArticleInput) => {
  return await client.get<Article>({
    endpoint: END_POINTS.Articles,
    contentId: articleID,
    queries,
  });
};
