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
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-3 items-center text-xs text-gray-400">
            <div />
            <span className="justify-self-center">{process.env.NEXT_PUBLIC_BUILD_VERSION}</span>
            <a
              href="https://ko-fi.com/D1D81YDSBE"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy Me a Coffee at ko-fi.com"
              className="justify-self-end"
            >
              <img
                src="https://storage.ko-fi.com/cdn/kofi2.png?v=6"
                alt="Buy Me a Coffee at ko-fi.com"
                style={{ border: 0, height: "28px" }}
                height={28}
              />
            </a>
          </div>
        </div>
      </footer>
    </body>
  </html>
);

export default RootLayout;
