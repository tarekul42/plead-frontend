import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProperties } from "@/lib/queries/use-properties";
import { mockProperties } from "@/src/test/mocks/handlers";

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

describe("useProperties", () => {
  it("fetches properties list", async () => {
    const { result } = renderHook(() => useProperties({ page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
    expect(result.current.data?.data).toHaveLength(mockProperties.length);
  });
});
