import Link from "next/link";
import React from "react";
const links: { name: string; href: string }[] = [
  {
    name: "join to elections",
    href: "/",
  },
  {
    name: "go to vote",
    href: "/voting",
  },
];
export default function Header() {
  return (
    <header className="w-full bg-yellow-400 flex justify-items-start px-3.5 py-2.5 gap-3">
      {links.map((l, index) => (
        <Link
          href={l.href}
          key={index}
          className=" text-orange-700 font-bold text-xl uppercase hover:text-orange-900 transition-all"
        >
          {l.name}
        </Link>
      ))}
    </header>
  );
}
