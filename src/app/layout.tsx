import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aos-bouknadel.dabahelp.com"),
  title: "جمعية الأعمال الاجتماعية لموظفي وأعوان جماعة سيدي أبي القنادل | Association des Œuvres Sociales",
  description: "جمعية الأعمال الاجتماعية لموظفي وأعوان جماعة سيدي أبي القنادل - Association des Œuvres Sociales des Fonctionnaires et Agents de la Commune de Sidi Bouknadel",
  keywords: ["جمعية", "أعمال اجتماعية", "سيدي بوقنادل", "مغرب", "Association", "Œuvres Sociales", "Sidi Bouknadel", "Maroc", "جماعة سيدي أبي القنادل"],
  authors: [{ name: "Association des Œuvres Sociales - Sidi Bouknadel" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "جمعية الأعمال الاجتماعية | Association des Œuvres Sociales",
    description: "جمعية الأعمال الاجتماعية لموظفي وأعوان جماعة سيدي أبي القنادل",
    type: "website",
    url: "https://aos-bouknadel.dabahelp.com",
    siteName: "AOS Sidi Bouknadel",
    locale: "ar_MA",
  },
  twitter: {
    card: "summary_large_image",
    title: "جمعية الأعمال الاجتماعية | Association des Œuvres Sociales",
    description: "جمعية الأعمال الاجتماعية لموظفي وأعوان جماعة سيدي أبي القنادل",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
