import React from "react";
import { NavMenu } from "./NavMenu";
import { HEADER_NAV_ITEMS } from "../constants/headers";
import Image from "next/image";
import { Time } from "./Time";

type Props = {
  title: string;
  activePath?: string;
  description?: string;
  publishedAt?: string;
};

export const Header: React.FC<Props> = ({
  title,
  activePath,
  description,
  publishedAt,
}) => {
  return (
    <>
      <header className="mb-8 sm:mb-12 md:mb-16 flex justify-between items-center text-lg md:text-xl text-primary-medium">
        <a
          className="flex items-center gap-1 font-bold hover:underline"
          href="/"
        >
          <img
            className="aspect-square w-10 rounded-full mr-2"
            src="/assets/logo.png"
            alt=""
          />
          <span>ryokosuge.com</span>
        </a>
        <NavMenu items={HEADER_NAV_ITEMS} activePath={activePath} />
      </header>
      <div className="mb-6 sm:mb-10 md:mb-14">
        <h1 className="text-4xl sm:text-6xl md:text-8xl sm:leading-tight md:leading-tight font-bold mb-4 sm:mb-6 md:mb-8">
          {title}
          <span className="text-primary-dark">.</span>
        </h1>
        {publishedAt && (
          <div className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3 md:mb-4">
            <Time date={publishedAt} />
          </div>
        )}
        {description && (
          <div>
            <p className="text-sm sm:text-base md:text-lg text-gray-700">
              {description}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
