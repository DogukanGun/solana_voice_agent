import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletProvider from "./provider";
import ContextProvider from "./context";
import "@reown/appkit-wallet-button/react";
import { ModalProvider } from "./providers/ModalWrapper";
import InnerLayout from "./components/InnerLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexWallet",
  description: "AI powered wallet for the future",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider>
          <WalletProvider>
            <ModalProvider>
              <InnerLayout>{children}</InnerLayout>
            </ModalProvider>
          </WalletProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
