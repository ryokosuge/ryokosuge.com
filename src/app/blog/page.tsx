import type { Metadata } from "next";
import React from "react";
import { fetchPosts } from "../../libs/microcms";
import { Time } from "../../components/Time";
import { Header } from "../../components/Header";

export const metadata: Metadata = {
  title: "Blog | ryokosuge.com",
  description: "適当に調べて適当に書いてます",
};

export default async function Page() {
  const { contents } = await fetchPosts();
  return (
    <>
      <Header
        title="Blog"
        description="適当に調べて適当に書いてます"
        activePath="/blog"
      />
      <main className="mx-auto grid grid-cols-1 mb-10 sm:mb-12 md:mb-16 md:grid-cols-4 gap-2">
        <div className="flex flex-col md:col-span-1" />
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 md:col-span-3">
          {contents.map(({ id, title, description, publishedAt }) => (
            <section key={id} className="flex flex-col gap-2 sm:gap-3">
              <div className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">
                <Time date={publishedAt} />
              </div>
              <h2 className="font-bold text-2xl sm:text-4xl md:text-6xl md:leading-tight text-primary-medium hover:underline">
                <a href={`/blog/posts/${id}`}>{title}</a>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700">
                {description}
              </p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
