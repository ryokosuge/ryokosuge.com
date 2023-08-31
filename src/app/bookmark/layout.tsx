import { Header } from "../../components/Header";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bookmark | ryokosuge.com",
  description: "はてぶしたリンクのまとめページ",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        title="Bookmark"
        description="読んだ記事の一覧"
        activePath="/bookmark"
      />
      <main className="mx-auto grid grid-cols-1 mb-10 sm:mb-12 md:mb-16 md:grid-cols-4 gap-2">
        {children}
      </main>
    </>
  );
}
