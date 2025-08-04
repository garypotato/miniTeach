import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./store/providers";
import SessionProvider from "./components/SessionProvider";
import GlobalModal from "./components/GlobalModal";
import GlobalHeader from "./components/GlobalHeader";
import GlobalFooter from "./components/GlobalFooter";
import GoToTop from "./components/GoToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiniTeach - Find Your Perfect Child Companion",
  description:
    "Connect with qualified child companions and educators for your family",
  icons: {
    icon: "/miniTech.png",
    shortcut: "/miniTech.png",
    apple: "/miniTech.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <SessionProvider>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <GlobalHeader />
              <main className="flex-1 pt-16">{children}</main>
              <GlobalFooter />
              <GoToTop />
            </div>
            <GlobalModal />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
