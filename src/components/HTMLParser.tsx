import parse, { Element } from "html-react-parser";
import type { DOMNode } from "html-react-parser";
import { BlogCard } from "./BlogCard";
import type { OGPData } from "../types";

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

export type Props = {
  body: string;
  ogpData: OGPData[];
};

const HTMLParser: React.FC<Props> = ({ body, ogpData }) => {
  const replace = (dom: DOMNode) => {
    const anchor = convertAnchorElement(dom);
    if (anchor) {
      return <BlogCard anchor={anchor} ogpData={ogpData} />;
    }
  };

  return <>{parse(body, { replace, trim: true })}</>;
};

export default HTMLParser;
