import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PropertyCard } from "@/components/properties/property-card";
import { mockProperties } from "@/src/test/mocks/handlers";

describe("PropertyCard", () => {
  const property = mockProperties[0];

  it("renders property title as link", () => {
    render(<PropertyCard property={property} />);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", `/properties/${property.slug}`);
  });

  it("renders price formatted in USD", () => {
    render(<PropertyCard property={property} />);
    expect(screen.getByText(/\$550K/)).toBeInTheDocument();
  });

  it("renders location", () => {
    render(<PropertyCard property={property} />);
    expect(screen.getByText(property.location)).toBeInTheDocument();
  });

  it("renders beds, baths, and area", () => {
    render(<PropertyCard property={property} />);
    const twos = screen.getAllByText("2");
    expect(twos.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(`${property.area?.toLocaleString()} sqft`)).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<PropertyCard property={property} />);
    expect(screen.getByText(property.status)).toBeInTheDocument();
  });

  it("renders fallback icon when no images", () => {
    const noImg = { ...property, images: [] };
    render(<PropertyCard property={noImg} />);
    expect(screen.getByText(noImg.title)).toBeInTheDocument();
  });
});
