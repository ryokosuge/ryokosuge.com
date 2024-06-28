import React from "react";
import * as cheerio from "cheerio";
import openGraphScraper from "open-graph-scraper";
import HTML from "./HTML";

const parseOPGData = async (body: string) => {
  const $ = cheerio.load(body);
  const hrefs = $("a")
    .toArray()
    .map((element) => element.attribs.href);

  const result = await Promise.all(
    hrefs.map(async (href) => {
      try {
        const result = await openGraphScraper({
          url: href,
          onlyGetOpenGraphInfo: true,
        });

        if (result.error) {
          return undefined;
        }

        const { ogUrl, ogTitle, ogDescription, ogImage } = result.result;
        if (ogUrl == null || ogTitle == null) {
          return undefined;
        }

        const imageUrl = Array.isArray(ogImage) ? ogImage[0].url : undefined;

        return {
          url: ogUrl,
          title: ogTitle,
          description: ogDescription ?? "",
          imageUrl: imageUrl,
        };
      } catch {
        return undefined;
      }
    }),
  );
  return result.flatMap((r) => r ?? []);
};

export async function RichText({ body }: { body: string }) {
  const opgData = await parseOPGData(body);
  return <HTML body={body} ogpData={opgData} />;
}
