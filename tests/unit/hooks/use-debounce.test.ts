import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/use-debounce";

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("updates after delay", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: "initial" } },
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    await act(async () => {
      await new Promise((r) => setTimeout(r, 150));
    });

    expect(result.current).toBe("updated");
  });

  it("cancels previous timeout on rapid changes", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    rerender({ value: "c" });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 250));
    });

    expect(result.current).toBe("c");
  });
});
