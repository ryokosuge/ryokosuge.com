"use client";

import { useWindowSize } from "@uidotdev/usehooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  items: Array<{
    name: string;
    path: string;
  }>;
  activePath?: string;
};

export const NavMenu: React.FC<Props> = ({ items }) => {
  const { width } = useWindowSize();
  const pathname = usePathname();

  if (width == null) {
    return null;
  }

  if (width < 640) {
    return (
      <div className="group relative" tabIndex={0}>
        <button className="rounded px-3 py-2">
          Menu
          <span className="ml-2 text-sm">▼</span>
        </button>
        <nav
          tabIndex={0}
          className="absolute invisible group-focus-within:visible rounded bg-white w-40 right-0 top-full transition-all opacity-0 group-focus-within:opacity-100 group-focus-within:translate-y-1 shadow-lg"
        >
          <ul className="py-1">
            {items.map(({ name, path }) => (
              <li key={`${name} ${path}`}>
                <Link
                  href={path}
                  className={`block px-4 py-2 hover:bg-primary-light ${
                    pathname.startsWith(path) ? "font-bold" : ""
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <nav className="flex gap-2">
      {items.map(({ name, path }) => (
        <Link
          key={`${name} ${path}`}
          href={path}
          className={`p-2 ${pathname.startsWith(path) ? "font-bold" : ""}`}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
};
