import "../styles/globals.css";

import type { Metadata } from "next";
import { Noto_Sans_JP, Open_Sans } from "next/font/google";
import Link from "next/link";
import { SOCIAL_LINKS } from "../constants/social";

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
      <body className='m-auto box-border min-h-[100vh] border-[0.75rem] border-solid border-primary-dark bg-slate-50 font-noto-sans-jp sm:border-[1rem]'>
        <div className='m-auto max-w-7xl p-8 md:p-14'>
          <header className='mb-8 flex items-center justify-between text-lg text-primary-medium sm:mb-12 md:mb-16 md:text-xl'>
            <Link
              className='flex items-center gap-1 font-bold hover:underline'
              href='/'
            >
              <img
                className='mr-2 aspect-square w-10 rounded-full'
                src='/assets/logo.png'
                alt=''
              />
              <span>ryokosuge.com</span>
            </Link>
          </header>
          {children}
          <footer className='mb-8 flex flex-col items-center gap-2'>
            <div className='flex items-center gap-2'>
              {SOCIAL_LINKS.map(({ name, link, icon }) => (
                <a key={name} href={link} target='_blank' rel='noopener'>
                  <img className='aspect-square w-8' src={icon} alt={name} />
                </a>
              ))}
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
