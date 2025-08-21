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
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-full">
        <nav className="bg-white border-b border-gray-200 w-full">
          <div className="w-full px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/">
                  <h1 className="text-xl font-bold text-gray-900">
                    DocNotes
                  </h1>
                </Link>
              </div>
              <div className="flex items-center">
                <NavMenu />
                <NavMenuMobileButton />
              </div>
            </div>
          </div>
          <NavMenuMobile />
        </nav>

        {children}
      </body>
    </html>
  );
}
