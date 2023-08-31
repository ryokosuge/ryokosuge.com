import React from "react";

type Props = {
  date: string;
};

export const Time: React.FC<Props> = ({ date }) => (
  <time dateTime={date}>
    {new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  </time>
);
