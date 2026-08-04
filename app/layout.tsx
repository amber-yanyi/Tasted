import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { getLocale } from "@/lib/i18n/server";

const crimson = Crimson_Text({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  // Relative image paths in openGraph/twitter are resolved against this. Without
  // it Next falls back to the Vercel deployment URL, so og:image pointed at
  // *.vercel.app — a hostname that is DNS-poisoned in mainland China, leaving
  // the link preview blank for exactly the people this is shared with.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tasted.app"
  ),
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
    title: "Tasted — Remember every bottle you taste.",
    description: "Photograph a label, keep the note, and build a memory of everything you've tasted.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasted — Remember every bottle you taste.",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} className={crimson.variable}>
      <head>
        {/* Safari's support for an SVG apple-touch-icon is unreliable; a 180x180
            PNG is what it consistently uses for the home-screen icon. */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <LocaleProvider initialLocale={locale}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </LocaleProvider>
      </body>
    </html>
  );
}
