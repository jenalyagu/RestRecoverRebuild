import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

// Closest match to Avalon Serif from the brand kit
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader", // keep var name so existing components work
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta", // keep var name so existing components work
});

export const metadata: Metadata = {
  title: "RestRecoverRebuild — Your Postpartum Guide",
  description: "An AI-powered postpartum companion that helps you heal, find your rhythm, and build the village you deserve.",
  openGraph: {
    title: "RestRecoverRebuild",
    description: "Week by week. Real and honest.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
