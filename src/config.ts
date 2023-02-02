// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import type { HeaderNavItem, SocialLink } from "./types";

export const SITE_DESCRIPTION = "メモ書き用で雑に書いてます。";

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

export const SITE_HEADER_SOCIAL_LINKS: SocialLink[] = [
  {
    name: "twitter",
    link: "https://twitter.com/_ryokosuge",
    icon: "/assets/twitter.png",
  },
  {
    name: "github",
    link: "https://github.com/ryokosuge",
    icon: "/assets/github.png",
  },
];
