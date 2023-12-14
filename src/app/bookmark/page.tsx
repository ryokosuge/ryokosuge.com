import Parser from "rss-parser";
import openGraphScraper from "open-graph-scraper";
import type { Bookmark } from "../../constants/bookmark";
import { BOOKMARK_HATENA_BOOKMARK_URL } from "../../constants/bookmark";
import { Time } from "../../components/Time";
import { BlogCard } from "../../components/BlogCard";

const fetchBookmarks = async (page: number) => {
  const parser = new Parser();
  const url = new URL(BOOKMARK_HATENA_BOOKMARK_URL);
  url.searchParams.set("page", `${page}`)
  const feed = await parser.parseURL(url.toString());

  const result = await Promise.all<Bookmark | undefined>(
    feed.items.map(async (item) => {
      const url = item.link;
      if (url == null) {
        return undefined;
      }
      try {
        const result = await openGraphScraper({
          url,
          onlyGetOpenGraphInfo: true,
        });

        if (result.error) {
          return undefined;
        }

        const { ogImage } = result.result;
        const imageUrl = ogImage == null ? undefined : ogImage[0].url;

        return {
          url: result.result.ogUrl ?? url,
          title: result.result.ogTitle ?? item.title ?? "",
          description: result.result.ogDescription ?? item.contentSnippet ?? "",
          imageUrl: imageUrl,
          publishedAt: item.isoDate ?? "",
          comment: item.content,
        };
      } catch {
        return undefined;
      }
    })
  );
  return result.flatMap((r) => r ?? []);
};

export default async function Page() {
  let page = 1;
  const bookmarks: Bookmark[] = [];
  while (true) {
    const bs = await fetchBookmarks(page);
    bookmarks.push(...bs);
    if (page > 5 || bs.length === 0) {
      break;
    }
    page++;
  }

  return (
    <>
      <div className="flex flex-col md:col-span-1" />
      <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 md:col-span-3">
        {bookmarks.map(
          ({ title, description, imageUrl, url, publishedAt, comment }) => (
            <section key={url} className="flex flex-col gap-2 sm:gap-3">
              <div className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">
                <Time date={publishedAt} />
              </div>
              <BlogCard
                anchor={{ href: url }}
                ogpData={{ title, description, imageUrl }}
              />
              {comment && (
                <p className="text-sm sm:text-base md:text-lg text-gray-700">
                  {comment}
                </p>
              )}
            </section>
          )
        )}
      </div>
    </>
  );
}
