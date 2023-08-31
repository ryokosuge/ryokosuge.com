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
    <div className="my-4">
      <a
        href={anchor.href}
        target="_blank"
        rel="noopener nofollow"
        className="not-prose p-2 sm:p-4 flex flex-col md:flex-row gap-4 md:gap-6 no-underline hover:underline items-center border rounded-lg shadow-md hover:bg-gray-100"
      >
        {imageUrl ? (
          <img
            className="object-cover rounded-lg h-48 sm:h-64 md:h-auto w-auto md:w-48"
            src={imageUrl}
            alt=""
          />
        ) : (
          <div className="object-cover rounded-lg h-48 sm:h-64 md:h-auto w-full md:w-48 md:aspect-video bg-slate-300" />
        )}
        <div className="flex flex-col gap-1">
          <p className="text-base sm:text-lg font-bold text-primary-medium">
            {title}
          </p>
          <p className="text-gray-700 line-clamp-3">{description}</p>
        </div>
      </a>
    </div>
  );
};
