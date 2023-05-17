import type React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export type Props = {
  code: string;
  language: string;
};

export const SyntaxHighlight: React.FC<Props> = ({ code, language }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={a11yDark}
      customStyle={{ padding: "1.5em" }}
    >
      {code}
    </SyntaxHighlighter>
  );
};
