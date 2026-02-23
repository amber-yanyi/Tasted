import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const crimson = Crimson_Text({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: "Tasted - Wine Tasting Notes",
  description: "Remember every glass. A wine journal built on WSET tasting logic.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tasted",
  },
  applicationName: "Tasted",
  openGraph: {
    title: "Tasted",
    description: "Remember every glass. A wine journal built on WSET tasting logic.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasted",
    description: "Remember every glass. A wine journal built on WSET tasting logic.",
    images: ["/og-image.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1c1917",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={crimson.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
