import { Metadata } from "next";
import { fetchPost, fetchPosts } from "@/libs/microcms";
import { Header } from "../../../../components/Header";
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
      <Header
        title={post.title}
        description={post.description}
        activePath="/blog"
      />
      <main className="mx-auto grid grid-cols-1 mb-10 sm:mb-12 md:mb-16 md:grid-cols-4 gap-2">
        <div className="flex flex-col md:col-span-1">
          <a
            href="/blog"
            className="text-primary-dark font-semibold text-lg hover:underline"
          >
            ← Back blog.
          </a>
        </div>
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 md:col-span-3">
          <article className="max-w-full prose md:prose-lg prose-p:my-2 md:prose-p:my-2 prose-pre:my-2 md:prose-pre:my-3 prose-ul:my-2 md:prose_ul:my-2 prose-img:my-2 md:prose-img:my-2 mx-auto text-gray-900">
            <RichText body={post.content} />
          </article>
        </div>
      </main>
    </>
  );
}
