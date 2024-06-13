import "../styles/globals.css";

import type { Metadata } from "next";
import Link from "next/link";
import { SOCIAL_LINKS } from "../constants/social";

export const metadata: Metadata = {
  title: "Home | ryokosuge.com",
  description: "メモ書き用で雑に書いてます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = new Date();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content="noindex" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link
          href="https://fonts.googleapis.com/css?family=Noto+Sans+JP|Open+Sans&display=optional"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-[100vh] m-auto bg-slate-50 box-border border-solid border-primary-dark border-[0.75rem] sm:border-[1rem]">
        <div className="max-w-7xl m-auto p-8 md:p-14">
          <header className="mb-8 sm:mb-12 md:mb-16 flex justify-between items-center text-lg md:text-xl text-primary-medium">
            <Link
              className="flex items-center gap-1 font-bold hover:underline"
              href="/"
            >
              <img
                className="aspect-square w-10 rounded-full mr-2"
                src="/assets/logo.png"
                alt=""
              />
              <span>ryokosuge.com</span>
            </Link>
          </header>
          {children}
          <footer className="mb-8 flex flex-col gap-2 items-center">
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ name, link, icon }) => (
                <a key={name} href={link} target="_blank" rel="noopener">
                  <img className="aspect-square w-8" src={icon} alt={name} />
                </a>
              ))}
            </div>
            <div className="px-8 mx-auto font-semibold text-center text-sm sm:text-base md:text-lg">
              &copy; {today.getFullYear()} ryokosuge. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
