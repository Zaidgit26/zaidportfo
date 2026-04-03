import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Cursor } from "@/components/cursor";
import { PageTransition } from "@/components/page-transition";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "600"],
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Zaid Khaleel — Software Engineer",
  description:
    "Software engineer at Enarxi Innovations. Building GPU pipelines, ML systems, and full-stack applications.",
  openGraph: {
    title: "Zaid Khaleel — Software Engineer",
    description:
      "GPU-accelerated ML, computer vision, and full-stack engineering.",
    url: "https://zaidportfo.vercel.app",
    siteName: "Zaid Khaleel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zaid Khaleel — Software Engineer",
    description:
      "GPU-accelerated ML, computer vision, and full-stack engineering.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
        style={{
          fontFamily: "var(--font-ui)",
          backgroundColor: "var(--color-void)",
          color: "var(--color-text-primary)",
        }}
      >
        <Cursor />
        <Navigation />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}