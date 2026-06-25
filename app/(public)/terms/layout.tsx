import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PropLead AI terms of service — the terms governing your use of our platform.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
