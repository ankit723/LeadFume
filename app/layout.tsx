import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/providers/themeProvider";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leadfume - Build your leads with ease",
  description: "Leadfume helps you generate and manage high-quality leads efficiently. Our platform streamlines your lead generation process for better conversions.",
  keywords: ["lead generation", "sales leads", "marketing leads", "CRM", "lead management", "B2B leads"],
  authors: [{ name: "Leadfume" }],
  creator: "Leadfume",
  publisher: "Leadfume",
  metadataBase: new URL('https://leadfume.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Leadfume - Build your leads with ease",
    description: "Leadfume helps you generate and manage high-quality leads efficiently. Our platform streamlines your lead generation process for better conversions.",
    url: 'https://leadfume.com', // Replace with your actual domain
    siteName: 'Leadfume',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Create and add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Leadfume - Lead Generation Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Leadfume - Build your leads with ease",
    description: "Leadfume helps you generate and manage high-quality leads efficiently. Our platform streamlines your lead generation process for better conversions.",
    images: ['/og-image.jpg'], // Same as OpenGraph image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Leadfume",
                "url": "https://leadfume.com",
                "logo": "https://leadfume.com/logo.png",
                "sameAs": [
                  "https://twitter.com/leadfume",
                  "https://www.linkedin.com/company/leadfume",
                  "https://www.facebook.com/leadfume"
                ],
                "description": "Leadfume helps you generate and manage high-quality leads efficiently. Our platform streamlines your lead generation process for better conversions."
              })
            }}
          />
        </head>
        <body
          className={`${geistSans.className} antialiased bg-[whitesmoke] dark:bg-[hsl(0,0%,10%)]`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="white"
            enableSystem
            disableTransitionOnChange
            storageKey="leadfume-theme"
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
