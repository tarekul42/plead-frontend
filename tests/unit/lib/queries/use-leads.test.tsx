import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { useLeads, useLead, useCreateLead, useUpdateLead } from "@/lib/queries/use-leads";
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

describe("useLeads", () => {
  beforeEach(() => server.resetHandlers());

  it("fetches leads list", async () => {
    const { result } = renderHook(() => useLeads(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(true);
    expect(Array.isArray(result.current.data?.data)).toBe(true);
  });

  it("passes params to the query", async () => {
    const { result } = renderHook(() => useLeads({ page: 1, limit: 10 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toBeDefined();
  });

  it("handles server error gracefully", async () => {
    server.use(
      http.get(`${API}/leads`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useLeads(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useLead", () => {
  beforeEach(() => server.resetHandlers());

  it("fetches a single lead by id", async () => {
    const { result } = renderHook(() => useLead("lead-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data._id).toBe("lead-1");
  });

  it("does not fetch when id is empty", () => {
    const { result } = renderHook(() => useLead(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isFetching).toBe(false);
  });

  it("returns error for non-existent lead", async () => {
    server.use(
      http.get(`${API}/leads/:id`, () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const { result } = renderHook(() => useLead("nonexistent"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useCreateLead", () => {
  beforeEach(() => server.resetHandlers());

  it("creates a new lead", async () => {
    const newLead = {
      name: "New Lead",
      email: "new@example.com",
      assignedAgentId: "agent-1",
    };

    const { result } = renderHook(() => useCreateLead(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newLead);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.success).toBe(true);
  });
});

describe("useUpdateLead", () => {
  beforeEach(() => server.resetHandlers());

  it("updates an existing lead", async () => {
    const updates = { name: "Updated Name" };

    const { result } = renderHook(() => useUpdateLead("lead-1"), {
      wrapper: createWrapper(),
    });

    result.current.mutate(updates);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toBeDefined();
  });
});
