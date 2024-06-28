import Link from "next/link";

export type Props = {
  anchor: {
    href: string;
  };
  ogpData: {
    title: string;
    imageUrl?: string;
    description: string;
  };
};

export const BlogCard: React.FC<Props> = ({
  anchor,
  ogpData: { imageUrl, title, description },
}) => {
  return (
    <div className='my-4'>
      <Link
        href={anchor.href}
        target='_blank'
        rel='noopener nofollow'
        className='not-prose flex flex-col items-center gap-4 rounded-lg border p-2 no-underline shadow-md hover:bg-gray-100 hover:underline sm:p-4 md:flex-row md:gap-6'
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className='h-48 w-auto rounded-lg object-cover sm:h-64 md:h-auto md:w-48'
            src={imageUrl}
            alt=''
          />
        ) : (
          <div className='h-48 w-full rounded-lg bg-slate-300 object-cover sm:h-64 md:aspect-video md:h-auto md:w-48' />
        )}
        <div className='flex flex-col gap-1'>
          <p className='text-base font-bold text-primary-medium sm:text-lg'>
            {title}
          </p>
          <p className='line-clamp-3 text-gray-700'>{description}</p>
        </div>
      </Link>
    </div>
  );
};
