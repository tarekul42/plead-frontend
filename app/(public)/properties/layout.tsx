import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Properties",
  description: "Browse our curated selection of properties for sale and rent. Filter by location, price, type, and more.",
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
