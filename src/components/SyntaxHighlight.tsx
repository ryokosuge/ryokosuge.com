import type React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
