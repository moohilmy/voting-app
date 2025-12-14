'use client'
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import React from "react";

const links: { name: string; href: string }[] = [
  { name: "result", href: "/admin/voting-dashboard" }, 
  { name: "add candidate", href: "/admin/voting-dashboard/add-candidate" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#B45253] flex gap-3 px-4 py-3">
      {links.map((link, index) => {
        const isActive = pathname === link.href; 
        return (
          <Link
            href={link.href}
            key={index}
            className={`px-4 py-2 rounded-lg font-bold text-[.8rem] uppercase transition-all
              ${
                isActive
                  ? "bg-[#FFE797] text-[#B45253] shadow-inner"
                  : "bg-transparent text-[#FFE797] hover:bg-[#FFE797] hover:text-[#B45253]"
              }`}
          >
            {link.name}
          </Link>
        );
      })}
    </header>
  );
}
