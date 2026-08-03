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
  description: "Photograph a label, keep the note, and build a memory of everything you've tasted.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tasted",
  },
  applicationName: "Tasted",
  openGraph: {
    title: "Tasted",
    description: "Photograph a label, keep the note, and build a memory of everything you've tasted.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasted",
    description: "Photograph a label, keep the note, and build a memory of everything you've tasted.",
    images: ["/og-image.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Must match manifest.json's theme_color, or the browser chrome and the
  // installed app's status bar disagree.
  themeColor: "#6B2233",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={crimson.variable}>
      <head>
        {/* Safari's support for an SVG apple-touch-icon is unreliable; a 180x180
            PNG is what it consistently uses for the home-screen icon. */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
