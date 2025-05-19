import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner"
import Footer from "./components/ui/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leadfume by Tech Morphers",
  description: "Leadfume is a leading lead finding software used by various buisness accross the globe, developed by  the Tech Morphers which is a software development company that builds custom software solutions for businesses.",
  keywords: ["Leafume", "lead generation", "lead finding", "software development", "custom software", "software solutions", "business software", "software company", "Technology Solutions", "Software Development Company", "Custom Software Development", "Software Solutions for Businesses", "Technology Company"],
  authors: [{ name: "Tech ", url: "https://www.techmorphers.com" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Leadfume by Tech Morphers",
    url: "https://leadfume.techmorphers.com",
    description: "Leadfume is a leading lead finding software used by various buisness accross the globe, developed by  the Tech Morphers which is a software development company that builds custom software solutions for businesses.",
    siteName: "Leadfume",
    images: [{ url: "https://www.techmorphers.com/og-image.png", width: 1200, height: 630, alt: "Tech Morphers" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Morphers",
    description: "Tech Morphers is a software development company that builds custom software solutions for businesses.",
    images: [{ url: "https://www.techmorphers.com/og-image.png" }],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://leadfume.techmorphers.com",
  },
  category: "technology",
  creator: "Tech Morphers",
  publisher: "Tech Morphers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tech Morphers",
    url: "https://leadfume.techmorphers.com",
    logo: "https://www.techmorphers.com/og-image.png",
    sameAs: [
      "https://x.com/techmorphers",
      "https://www.linkedin.com/company/leadfume",
      "https://www.facebook.com/leadfume",
      "https://www.instagram.com/leadfume",
    ],
  }
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(47.9 95.8% 53.1%)",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="canonical" href="https://leadfume.techmorphers.com" />

          <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </head>
        <body
          className={`${geistSans.className} antialiased bg-[whitesmoke] dark:bg-[hsl(0,0%,10%)]`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="white"
            enableSystem
            storageKey="leadfume-theme"
          >
            {children}
            <Toaster />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
