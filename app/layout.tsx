import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./providers/ReduxProvider";
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
        <ReduxProvider>
          <div className="min-h-screen flex flex-col">
            <GlobalHeader />
            <main className="flex-1">{children}</main>
            <GlobalFooter />
            <GoToTop />
          </div>
          <GlobalModal />
        </ReduxProvider>
      </body>
    </html>
  );
}
