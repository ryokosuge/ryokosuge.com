import parse, { Element } from "html-react-parser";
import type { DOMNode } from "html-react-parser";
import type {
  successResultObject,
  errorResultObject,
  imageObject,
} from "open-graph-scraper";

export type Props = {
  body: string;
  ogpData: (successResultObject | errorResultObject)[];
};

const convertAnchorElement = (dom: DOMNode) => {
  if (!(dom.parent == null && dom instanceof Element && dom.name === "p")) {
    return null;
  }

  if (
    !(
      dom.children.length === 1 &&
      dom.children[0] instanceof Element &&
      dom.children[0].name === "a"
    )
  ) {
    return null;
  }

  return {
    href: dom.children[0].attribs.href,
  };
};

const imageUrl = (ogImage?: string | imageObject | imageObject[]) =>
  Array.isArray(ogImage)
    ? ogImage[0].url
    : typeof ogImage === "string"
    ? ogImage
    : ogImage?.url;

const HTMLParser: React.FC<Props> = ({ body, ogpData }) => {
  const replace = (dom: DOMNode) => {
    const anchor = convertAnchorElement(dom);
    if (!anchor) {
      return;
    }

    const data = ogpData.find(
      (d) => d.ogUrl && anchor.href.startsWith(d.ogUrl)
    );

    if (data == null) {
      return null;
    }

    return (
      <a
        href={data.ogUrl}
        target="_blank"
        rel="noopener nofollow"
        className="not-prose p-4 flex flex-col gap-4 no-underline hover:underline items-center border rounded-lg shadow-md md:flex-row hover:bg-gray-100"
      >
        {imageUrl && (
          <img
            className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            src={imageUrl(data.ogImage)}
            alt=""
          />
        )}
        <div className="flex flex-col gap-4 py-4">
          <p className="text-xl font-bold tracking-tight text-primary-medium">
            {data.ogTitle}
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            {data.ogDescription}
          </p>
        </div>
      </a>
    );
  };

  return <>{parse(body, { replace, trim: true })}</>;
};

export default HTMLParser;
