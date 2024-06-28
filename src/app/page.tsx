import { Hero } from "@/components/Hero";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <Hero title='Home' description='メモ書き用で雑に書いてます。' />
      <ul>
        <li>
          <Link
            href='/blog'
            className='text-lg font-semibold text-primary-dark hover:underline md:sticky md:top-0 md:pt-4'
          >
            Blog. →
          </Link>
        </li>
      </ul>
    </>
  );
};

export default Page;
