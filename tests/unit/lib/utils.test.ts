import { describe, it, expect } from "vitest";
import { cn, formatPrice, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    const falsy = false;
    expect(cn("base", falsy && "hidden", "visible")).toBe("base visible");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("formatPrice", () => {
  it("formats USD currency", () => {
    expect(formatPrice(500000)).toBe("$500,000");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("handles decimal values", () => {
    expect(formatPrice(1234.56)).toBe("$1,235");
  });
});

describe("formatDate", () => {
  it("formats ISO date string", () => {
    expect(formatDate("2025-06-15T00:00:00Z")).toBe("Jun 15, 2025");
  });

  it("formats Date object", () => {
    expect(formatDate(new Date("2024-01-01"))).toBe("Jan 1, 2024");
  });
});
