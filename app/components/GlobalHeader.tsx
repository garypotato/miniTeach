import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import NavigationButtons from "./NavigationButtons";
import HeaderNavLinks from "./HeaderNavLinks";

// Server Component - most of the header is static
export default function GlobalHeader() {
  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Server Rendered */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80">
              <Image
                src="/miniTeach.png"
                alt="MiniTeach Logo"
                width={480}
                height={80}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - Mixed Server/Client */}
          <nav className="hidden md:flex space-x-8 items-center">
            {/* Navigation Links - Client Component for i18n */}
            <HeaderNavLinks />

            {/* Dynamic Buttons & Language Toggle - Client Component */}
            <NavigationButtons />
          </nav>

          {/* Mobile Menu - Client Component */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
