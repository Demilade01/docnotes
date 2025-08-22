import Link from "next/link";
import "./globals.css";
import NavMenu from "@/components/NavMenu";
import { Github } from "lucide-react";
import NavMenuMobileButton from "@/components/NavMenuMobileButton";
import NavMenuMobile from "@/components/NavMenuMobile";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-full bg-background">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="group">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">D</span>
                    </div>
                    <h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      DocNotes
                    </h1>
                  </div>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <NavMenu />
                <NavMenuMobileButton />
              </div>
            </div>
          </div>
          <NavMenuMobile />
        </nav>

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
