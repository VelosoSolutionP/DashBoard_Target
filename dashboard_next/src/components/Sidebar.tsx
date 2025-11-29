"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaDollarSign, FaBox, FaExchangeAlt, FaPercentage } from "react-icons/fa";

const links = [
  { label: "Vendas", href: "/vendas", icon: FaDollarSign },
  { label: "Estoque", href: "/estoque", icon: FaBox },
  { label: "Movimentação", href: "/movimentacao", icon: FaExchangeAlt },
  { label: "Juros", href: "/juros", icon: FaPercentage },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen p-6 flex flex-col bg-gradient-to-b from-gray-50 to-gray-200 shadow-[8px_0_20px_rgba(0,0,0,0.1)] rounded-r-3xl transform-gpu perspective-1000">
      {/* Cabeçalho */}
      <h1 className="text-3xl font-bold mb-12 text-blue-700 tracking-wide">Dashboard</h1>

      {/* Menu */}
      <nav className="flex flex-col gap-5">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-4 px-5 py-3 rounded-2xl font-semibold
                transition-all duration-500 ease-out
                transform-gpu
                ${
                  active
                    ? "bg-blue-600 text-white shadow-[0_8px_15px_rgba(0,0,255,0.4)] scale-105 -translate-y-1"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700 hover:translate-x-2 hover:scale-105"
                }
              `}
            >
              <Icon
                className={`transition-transform duration-500 ${
                  active ? "scale-125 rotate-12" : "scale-100 rotate-0"
                }`}
              />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}