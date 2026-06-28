import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/use-current-user";

// Mock Clerk's useUser
const mockUseUser = vi.fn();
vi.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
}));

// Mock API client
const mockGet = vi.hoisted(() => vi.fn());
vi.mock("@/lib/api-client", () => ({
  default: {
    get: (...args: unknown[]) => mockGet(...args),
  },
  usersApi: {
    me: () => mockGet("/users/me").then((r: { data: { data: unknown } }) => r.data.data),
  },
}));

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: qc }, children);
  };
}

describe("useCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading state when Clerk is not loaded", () => {
    mockUseUser.mockReturnValue({ user: null, isLoaded: false });
    mockGet.mockResolvedValue({ data: { data: null } });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeUndefined();
  });

  it("returns loading when Clerk is loaded but no clerkUser (nothing to fetch)", () => {
    mockUseUser.mockReturnValue({ user: null, isLoaded: true });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    // When Clerk is loaded but there is no user, the query is disabled,
    // but isLoading is true because !clerkUser evaluates to true per the hook.
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeUndefined();
  });

  it("fetches user data when clerkUser is loaded", async () => {
    const mockUser = {
      _id: "user-1",
      clerkId: "clerk_123",
      email: "agent@proplead.ai",
      name: "Agent Smith",
      role: "agent",
      agencyId: "agency-1",
    };

    mockUseUser.mockReturnValue({
      user: { id: "clerk_123" },
      isLoaded: true,
    });
    mockGet.mockResolvedValue({ data: { data: mockUser } });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.role).toBe("agent");
    expect(result.current.agencyId).toBe("agency-1");
  });

  it("returns role from user data", async () => {
    const mockUser = {
      _id: "user-2",
      clerkId: "clerk_456",
      email: "admin@proplead.ai",
      name: "Admin User",
      role: "admin",
      agencyId: "agency-1",
    };

    mockUseUser.mockReturnValue({
      user: { id: "clerk_456" },
      isLoaded: true,
    });
    mockGet.mockResolvedValue({ data: { data: mockUser } });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.role).toBe("admin");
  });

  it("calls /users/me endpoint", async () => {
    mockUseUser.mockReturnValue({
      user: { id: "clerk_789" },
      isLoaded: true,
    });
    mockGet.mockResolvedValue({
      data: { data: { _id: "u1", role: "agent", agencyId: "a1" } },
    });

    renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/users/me");
    });
  });
});
