import type React from "react";
import useWindowSize from "../hooks/useWindowSize";
import type { HeaderNavItem } from "../types";

type Props = {
  items: HeaderNavItem[];
  activePath?: string;
};

const MobileMenu: React.FC<Props> = ({ items, activePath }) => (
  <div className="group relative">
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
            <a
              href={path}
              className={`block px-4 py-2 hover:bg-primary-light ${
                path === activePath ? "font-bold" : ""
              }`}
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
);

export const NavMenu: React.FC<Props> = ({ items, activePath }) => {
  const { width } = useWindowSize();

  if (width == null) {
    return null;
  }

  if (width < 640) {
    return <MobileMenu items={items} activePath={activePath} />;
  }

  return (
    <nav className="flex gap-2">
      {items.map(({ name, path }) => (
        <a
          key={`${name}${path}`}
          href={path}
          className={`p-2 ${path === activePath ? "font-bold" : ""}`}
        >
          {name}
        </a>
      ))}
    </nav>
  );
};
