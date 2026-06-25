import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Find answers to common questions about PropLead AI. Search our help topics or contact support.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
