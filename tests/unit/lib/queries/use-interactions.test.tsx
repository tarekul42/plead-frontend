import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { useInteractions, useCreateInteraction } from "@/lib/queries/use-interactions";
import { server } from "@/src/test/mocks/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

describe("useInteractions", () => {
  beforeEach(() => server.resetHandlers());

  it("fetches interactions list", async () => {
    const { result } = renderHook(() => useInteractions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(Array.isArray(result.current.data?.data)).toBe(true);
  });

  it("returns interactions with expected shape", async () => {
    const { result } = renderHook(() => useInteractions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const interactions = result.current.data?.data;
    if (interactions && interactions.length > 0) {
      expect(interactions[0]).toHaveProperty("_id");
      expect(interactions[0]).toHaveProperty("leadId");
      expect(interactions[0]).toHaveProperty("type");
    }
  });

  it("handles server error gracefully", async () => {
    server.use(
      http.get(`${API}/interactions`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useInteractions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateInteraction", () => {
  beforeEach(() => server.resetHandlers());

  it("creates a new interaction for a lead", async () => {
    const newInteraction = {
      type: "call",
      notes: "Discussed property preferences",
      outcome: "positive",
    };

    const { result } = renderHook(() => useCreateInteraction("lead-1"), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newInteraction);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it("invalidates interactions cache on success", async () => {
    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const wrapper = function Wrapper({ children }: { children: React.ReactNode }) {
      return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
    };

    // Pre-populate cache
    qc.setQueryData(["interactions"], {
      data: [],
    });

    const { result } = renderHook(() => useCreateInteraction("lead-1"), {
      wrapper,
    });

    result.current.mutate({ type: "email", notes: "Sent listing" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
