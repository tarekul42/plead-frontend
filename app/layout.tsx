import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProviderWrapper } from "@/providers/clerk-provider";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "PropLead AI — Real Estate Lead Engine",
  description:
    "AI-powered SaaS for real estate agencies. Match leads to properties, generate marketing copy, and close deals faster.",
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
            <QueryProvider>{children}</QueryProvider>
          </ClerkProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
