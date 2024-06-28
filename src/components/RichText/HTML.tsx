import parse, { Element, Text } from "html-react-parser";
import type { DOMNode } from "html-react-parser";
import { BlogCard } from "../BlogCard";
import { SyntaxHighlight } from "./SyntaxHighlight";
import Link from "next/link";

const convertCodeElement = (dom: DOMNode) => {
  if (!(dom.parent == null && dom instanceof Element)) {
    return null;
  }

  let preDOM: Element | undefined = undefined;

  if (dom.name === "div") {
    // filename付きの場合はこっち
    if (
      !(
        dom.children.length === 1 &&
        dom.children[0] instanceof Element &&
        dom.children[0].name === "pre"
      )
    ) {
      return null;
    }

    preDOM = dom.children[0];
  } else if (dom.name === "pre") {
    preDOM = dom;
  }

  if (preDOM == null) {
    return null;
  }

  if (
    !(
      preDOM.children.length === 1 &&
      preDOM.children[0] instanceof Element &&
      preDOM.children[0].name === "code"
    )
  ) {
    return null;
  }

  const codeDOM = preDOM.children[0];
  if (!(codeDOM.children.length === 1 && codeDOM.children[0] instanceof Text)) {
    return null;
  }

  const code = codeDOM.children[0].data;
  const language = (l: string) => {
    const match = /language-(\w+)/.exec(l);
    return match && match[1] ? match[1] : "";
  };

  return {
    code,
    language: language(codeDOM.attribs["class"]),
  };
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

export type Props = {
  body: string;
  ogpData: Array<{
    url: string;
    title: string;
    description: string;
    imageUrl?: string;
  }>;
};

const HTMLParser: React.FC<Props> = ({ body, ogpData }) => {
  const replace = (dom: DOMNode) => {
    const code = convertCodeElement(dom);
    if (code) {
      return <SyntaxHighlight {...code} />;
    }

    const anchor = convertAnchorElement(dom);
    if (anchor) {
      const data = ogpData.find((o) => anchor.href.startsWith(o.url));
      if (!data) {
        return (
          <p>
            <Link
              href={anchor.href}
              target='_blank'
              rel='noopener nofollow'
              className='break-words no-underline hover:underline text-primary-medium'
            >
              {anchor.href}
            </Link>
          </p>
        );
      }
      return <BlogCard anchor={anchor} ogpData={data} />;
    }
  };

  return <>{parse(body, { replace, trim: true })}</>;
};

export default HTMLParser;
