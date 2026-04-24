import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thumbnail Generator",
  description: "Remove image backgrounds and compose them on a custom canvas",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
  >
    <body className="min-h-full flex flex-col">
      {children}
      <footer className="mt-auto border-t border-gray-200 bg-white py-3 px-4">
        <p className="text-center text-xs text-gray-400">
          {process.env.NEXT_PUBLIC_BUILD_VERSION}
        </p>
      </footer>
    </body>
  </html>
);

export default RootLayout;
