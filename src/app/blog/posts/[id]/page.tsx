import { Hero } from "@/components/Hero";
import { fetchPost, fetchPosts } from "@/libs/microcms";
import { Metadata } from "next";
import Link from "next/link";
import { RichText } from "../../../../components/RichText";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  const posts = await fetchPosts();
  return posts.contents.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost({ postID: params.id });
  return {
    title: `${post.title} | Blog - ryokosuge.com`,
    description: post.description,
  };
}

export default async function Page({ params }: Props) {
  const post = await fetchPost({ postID: params.id });
  return (
    <>
      <Hero title={post.title} description={post.description} />
      <main className='mx-auto mb-10 grid grid-cols-1 gap-2 sm:mb-12 md:mb-16 md:grid-cols-4'>
        <div className='flex flex-col md:col-span-1'>
          <Link
            href='/blog'
            className='text-lg font-semibold text-primary-dark hover:underline md:sticky md:top-0 md:pt-4'
          >
            ← Back blog.
          </Link>
        </div>
        <div className='flex flex-col gap-8 sm:gap-10 md:col-span-3 md:gap-12'>
          <article className='md:prose_ul:my-2 prose mx-auto max-w-full text-gray-900 md:prose-lg prose-p:my-2 prose-pre:my-2 prose-ul:my-2 prose-img:my-2 md:prose-p:my-2 md:prose-pre:my-3 md:prose-img:my-2'>
            <RichText body={post.content} />
          </article>
        </div>
      </main>
    </>
  );
}
