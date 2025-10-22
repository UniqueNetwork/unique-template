import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import { UniqueSDKProvider } from "@/context/UniqueSDKContext";
import { UniqueIndexerProvider } from "@/context/UniqueIndexerContext";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unique Network Builder",
  description: "Build NFT applications with Unique Network SDK",
  icons: {
    icon: '/logo.svg',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UniqueIndexerProvider>
          <UniqueSDKProvider>
            <WalletProvider>
              <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </WalletProvider>
          </UniqueSDKProvider>
        </UniqueIndexerProvider>
      </body>
    </html>
  );
}
