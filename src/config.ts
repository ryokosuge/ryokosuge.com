// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Home";
export const SITE_DESCRIPTION = "メモ書き用で雑に書いてます。";

type HeaderNavItem = {
  name: string;
  path: string;
};

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Blog",
    path: "/blog",
  },
];

type SocialLink = {
  name: string;
  link: string;
};

export const SITE_HEADER_SOCIAL_LINKS: SocialLink[] = [
  {
    name: "twitter",
    link: "https://twitter.com/_ryokosuge",
  },
  {
    name: "github",
    link: "https://github.com/ryokosuge",
  },
];
