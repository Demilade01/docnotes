"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/lib/config";
import { Bell, User } from "lucide-react";

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center space-x-6">
      <div className="flex items-baseline space-x-6">
        {navItems?.length &&
          navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              } px-3 py-2 text-sm font-medium transition-colors`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
