import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarChart } from "@/components/charts/bar-chart";

// Mock recharts ResponsiveContainer for jsdom
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "responsive-container" }, children),
  };
});

describe("BarChart (conversion chart)", () => {
  const conversionData = [
    { label: "Views", value: 1200 },
    { label: "Inquiries", value: 340 },
    { label: "Tours", value: 85 },
    { label: "Offers", value: 22 },
    { label: "Closings", value: 8 },
  ];

  it("renders without crashing", () => {
    const { container } = render(<BarChart data={conversionData} />);
    expect(container.querySelector("[data-testid='responsive-container']")).toBeInTheDocument();
  });

  it("accepts custom color prop", () => {
    const { container } = render(<BarChart data={conversionData} color="#10B981" />);
    expect(container.querySelector("[data-testid='responsive-container']")).toBeInTheDocument();
  });

  it("handles empty data array", () => {
    const { container } = render(<BarChart data={[]} />);
    expect(container.querySelector("[data-testid='responsive-container']")).toBeInTheDocument();
  });

  it("handles single data point", () => {
    const { container } = render(<BarChart data={[{ label: "Views", value: 100 }]} />);
    expect(container.querySelector("[data-testid='responsive-container']")).toBeInTheDocument();
  });

  it("handles large values", () => {
    const largeData = [
      { label: "A", value: 1_000_000 },
      { label: "B", value: 500_000 },
    ];
    const { container } = render(<BarChart data={largeData} />);
    expect(container.querySelector("[data-testid='responsive-container']")).toBeInTheDocument();
  });
});
