import type {
  successResultObject,
  errorResultObject,
} from "open-graph-scraper";

export type Props = {
  anchor: {
    href: string;
  };
  ogpData: (successResultObject | errorResultObject)[];
};

export const BlogCard: React.FC<Props> = ({ anchor, ogpData }) => {
  const data = ogpData.find((d) => d.ogUrl && anchor.href.startsWith(d.ogUrl));

  if (data == null) {
    return null;
  }

  const imageUrl = Array.isArray(data.ogImage)
    ? data.ogImage[0].url
    : typeof data.ogImage === "string"
    ? data.ogImage
    : data.ogImage?.url;

  return (
    <div className="my-4">
      <a
        href={anchor.href}
        target="_blank"
        rel="noopener nofollow"
        className="not-prose p-2 sm:p-4 flex flex-col md:flex-row gap-4 md:gap-6 no-underline hover:underline items-center border rounded-lg shadow-md hover:bg-gray-100"
      >
        {imageUrl && (
          <img
            className="object-cover rounded-lg h-48 sm:h-64 md:h-auto w-auto md:w-48"
            src={imageUrl}
            alt=""
          />
        )}
        <div className="flex flex-col gap-1">
          <p className="text-base sm:text-lg font-bold text-primary-medium">
            {data.ogTitle}
          </p>
          <p className="text-gray-700 line-clamp-3">{data.ogDescription}</p>
        </div>
      </a>
    </div>
  );
};
