"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/lib/config";
import { Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center space-x-1">
      <div className="flex items-center space-x-1">
        {navItems?.length &&
          navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              size="sm"
              asChild
              className={`${
                pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              } transition-all duration-200`}
            >
              <a href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </a>
            </Button>
          ))}
      </div>

      <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-border">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full bg-accent hover:bg-accent/80">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
