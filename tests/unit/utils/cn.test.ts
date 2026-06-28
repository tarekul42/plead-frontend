import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const falsy = false;
    const truthy = true;
    expect(cn("foo", falsy && "bar", "baz")).toBe("foo baz");
    expect(cn("foo", truthy && "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts using tailwind-merge", () => {
    expect(cn("px-2 px-4")).toBe("px-4");
    expect(cn("text-red-500 text-blue-500")).toBe("text-blue-500");
    expect(cn("p-1 p-3")).toBe("p-3");
  });

  it("flattens arrays of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
    expect(cn(["foo", ["bar", "baz"]])).toBe("foo bar baz");
  });

  it("handles null and undefined inputs", () => {
    expect(cn(null, undefined, "foo")).toBe("foo");
    expect(cn("")).toBe("");
  });

  it("handles objects", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("merges complex Tailwind utility classes correctly", () => {
    expect(cn("bg-red-500 bg-opacity-50 bg-blue-500")).toBe("bg-blue-500");
    expect(cn("hover:bg-red-500 hover:bg-blue-500")).toBe("hover:bg-blue-500");
  });
});
