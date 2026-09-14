import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about PropLead AI — the free AI-powered real estate lead engine for agents and agencies.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
