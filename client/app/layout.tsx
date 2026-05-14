import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import JivoChat from "@/components/JivoChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arbor Global | Confidential Logistics",
  description:
    "Discreet, secure, and bespoke shipping solutions for high-net-worth individuals, celebrities, and distinguished clients worldwide.",
  keywords: "confidential shipping, luxury logistics, private courier, HNWI, secure transport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {children}
        <JivoChat />
      </body>
    </html>
  );
}
