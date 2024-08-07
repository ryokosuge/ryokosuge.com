import "../styles/globals.css";

import GitHubLogo from "@/assets/github.png";
import Logo from "@/assets/logo.png";
import type { Metadata } from "next";
import { Noto_Sans_JP, Open_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | ryokosuge.com",
  description: "メモ書き用で雑に書いてます。",
};

const noto_sans_jp = Noto_Sans_JP({
  display: "optional",
  variable: "--font-noto-sans-jp",
  preload: false,
});

const open_sans = Open_Sans({
  display: "optional",
  variable: "--font-open-sans",
  preload: false,
});

/**
export const SOCIAL_LINKS = [
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

 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = new Date();

  return (
    <html
      lang='ja'
      className={`${noto_sans_jp.variable} ${open_sans.variable} font-noto-sans-jp`}
    >
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <meta name='robots' content='noindex' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </head>
      <body className='m-auto box-border min-h-screen border-[0.75rem] border-solid border-primary-dark bg-slate-50 font-noto-sans-jp sm:border-[1rem]'>
        <div className='m-auto max-w-7xl p-8 md:p-14'>
          <header className='mb-8 flex items-center justify-between text-lg text-primary-medium sm:mb-12 md:mb-16 md:text-xl'>
            <Link
              className='flex items-center gap-1 font-bold hover:underline'
              href='/'
            >
              <Image
                className='mr-2 aspect-square w-10 rounded-full'
                src={Logo.src}
                width={40}
                height={40}
                alt=''
              />
              <span>ryokosuge.com</span>
            </Link>
          </header>
          {children}
          <footer className='mb-8 flex flex-col items-center gap-2'>
            <div className='flex items-center gap-2'>
              <a
                href='https://github.com/ryokosuge'
                target='_blank'
                rel='noopener'
              >
                <Image
                  className='aspect-square w-8'
                  src={GitHubLogo.src}
                  alt=''
                  width={32}
                  height={32}
                />
              </a>
            </div>
            <div className='mx-auto px-8 text-center text-sm font-semibold sm:text-base md:text-lg'>
              &copy; {today.getFullYear()} ryokosuge. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
