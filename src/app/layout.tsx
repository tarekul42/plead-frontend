import "./globals.css";

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { Toaster } from "@/components/common/toaster";
import { ClerkProviderWrapper } from "@/providers/clerk-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PropLead AI — Real Estate Lead Engine",
    template: "%s | PropLead AI",
  },
  description:
    "AI-powered SaaS for real estate agencies. Match leads to properties, generate marketing copy, and close deals faster.",
  openGraph: {
    title: "PropLead AI — Real Estate Lead Engine",
    description:
      "Match the right lead to the right property in seconds. AI-powered lead matching for real estate agents.",
    type: "website",
    siteName: "PropLead AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PropLead AI",
    description: "AI-powered real estate lead engine. Match, convert, close.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <ClerkProviderWrapper>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
