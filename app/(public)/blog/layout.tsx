import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, guides, and insights for real estate professionals. Stay updated with the latest industry trends.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
