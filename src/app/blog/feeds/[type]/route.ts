import { fetchPosts } from "@/libs/microcms";
import { Feed } from "feed";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest | Request,
  { params }: { params: Promise<{ type: "rss" }> },
) {
  const today = new Date();
  const siteURL = process.env.SITE_URL ?? "";
  const feed = new Feed({
    title: "ryokosuge.com",
    description: "適当に書いてるやつ",
    id: siteURL,
    link: siteURL,
    copyright: `&copy; ${today.getFullYear()} ryokosuge. All rights reserved.`,
  });

  const posts = await fetchPosts();
  posts.contents.forEach((post) => {
    feed.addItem({
      id: post.id,
      title: `${post.title} | Blog. - ryokosuge.com`,
      description: post.description,
      date: new Date(post.publishedAt),
      link: `${siteURL}/blog/posts/${post.id}/`,
    });
  });

  let content: string;
  const type = (await params).type;
  switch (type) {
    case "rss":
      content = feed.rss2();
      break;
  }

  return new NextResponse(content);
}
