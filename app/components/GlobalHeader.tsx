import Link from "next/link";
import MobileMenu from "./MobileMenu";
import NavigationButtons from "./NavigationButtons";

// Server Component - most of the header is static
export default function GlobalHeader() {
  return (
    <header className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Server Rendered */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80">
              <div className="mr-3 text-3xl">🎓👶</div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold leading-tight"
                  style={{ color: "#47709B" }}
                >
                  学霸带娃
                </span>
                <span
                  className="text-sm font-medium leading-tight opacity-80"
                  style={{ color: "#47709B" }}
                >
                  MiniTeach
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Mixed Server/Client */}
          <nav className="hidden md:flex space-x-8 items-center">
            {/* Static Links - Server Rendered */}
            <Link
              href="/"
              className="text-gray-700 hover:opacity-80 font-medium"
            >
              首页
            </Link>
            <Link
              href="/companions"
              className="text-gray-700 hover:opacity-80 font-medium"
            >
              所有陪伴师
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:opacity-80 font-medium"
            >
              关于我们
            </Link>
            
            {/* Dynamic Buttons - Client Component */}
            <NavigationButtons />
          </nav>

          {/* Mobile Menu - Client Component */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
