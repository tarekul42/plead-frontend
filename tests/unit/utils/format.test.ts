import { describe, it, expect } from "vitest";
import { formatPrice, formatDate } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats a number as USD currency", () => {
    expect(formatPrice(500000)).toBe("$500,000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("formats small amounts", () => {
    expect(formatPrice(100)).toBe("$100");
  });

  it("formats millions", () => {
    expect(formatPrice(1500000)).toBe("$1,500,000");
  });

  it("does not include decimal places", () => {
    expect(formatPrice(1234.56)).toBe("$1,235");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    expect(formatDate("2025-03-15T00:00:00Z")).toBe("Mar 15, 2025");
  });

  it("formats a Date object", () => {
    expect(formatDate(new Date("2025-01-01"))).toBe("Jan 1, 2025");
  });

  it("formats December correctly", () => {
    expect(formatDate("2025-12-31T00:00:00Z")).toBe("Dec 31, 2025");
  });

  it("pads single-digit days", () => {
    expect(formatDate("2025-06-05T00:00:00Z")).toBe("Jun 5, 2025");
  });
});
