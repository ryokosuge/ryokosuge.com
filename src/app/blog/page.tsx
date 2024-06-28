import type { Metadata } from "next";
import React from "react";
import { fetchPosts } from "../../libs/microcms";
import { Time } from "../../components/Time";
import { Hero } from "@/components/Hero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | ryokosuge.com",
  description: "適当に調べて適当に書いてます",
};

export default async function Page() {
  const { contents } = await fetchPosts();
  return (
    <>
      <Hero title='Blog' description='適当に調べて適当に書いてます' />
      <main className='mx-auto mb-10 grid grid-cols-1 gap-2 sm:mb-12 md:mb-16 md:grid-cols-4'>
        <div className='flex flex-col md:col-span-1' />
        <div className='flex flex-col gap-8 sm:gap-10 md:col-span-3 md:gap-12'>
          {contents.map(({ id, title, description, publishedAt }) => (
            <section key={id} className='flex flex-col gap-2 sm:gap-3'>
              <div className='text-sm font-semibold text-gray-900 sm:text-base md:text-lg'>
                <Time date={publishedAt} />
              </div>
              <h2 className='text-2xl font-bold text-primary-medium hover:underline sm:text-4xl md:text-6xl md:leading-tight'>
                <Link href={`/blog/posts/${id}`}>{title}</Link>
              </h2>
              <p className='text-sm text-gray-700 sm:text-base md:text-lg'>
                {description}
              </p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
