import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProviderWrapper } from "@/providers/clerk-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/common/toaster";

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
    description:
      "AI-powered real estate lead engine. Match, convert, close.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
