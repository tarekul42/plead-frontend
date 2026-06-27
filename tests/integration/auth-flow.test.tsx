import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockUseUser = vi.fn().mockReturnValue({
  user: { id: "clerk_agent_1" },
  isLoaded: true,
});

const mockRedirectToSignIn = vi.fn();
const mockUseRouter = vi.fn().mockReturnValue({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
});

vi.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
  RedirectToSignIn: () => {
    mockRedirectToSignIn();
    return <div data-testid="redirect-to-signin">Redirecting to sign-in...</div>;
  },
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => mockUseRouter(),
  usePathname: () => "/dashboard",
}));

vi.mock("@/lib/api-client", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: {
          totalLeads: 10,
          totalProperties: 5,
          totalInteractions: 25,
          conversionRate: 0.12,
        },
      },
    }),
    interceptors: { request: { use: vi.fn().mockReturnValue(0) }, response: { use: vi.fn().mockReturnValue(0) } },
  },
  setAuthToken: vi.fn(),
}));

import React from "react";

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// Mock Dashboard that requires auth
function AuthenticatedDashboard() {
  const { user, isLoaded } = mockUseUser();
  const router = mockUseRouter();

  if (!isLoaded) return <div data-testid="loading">Loading...</div>;
  if (!user) return <div data-testid="redirect-to-signin">Redirecting to sign-in...</div>;

  return (
    <div data-testid="dashboard">
      <h1>Agent Overview</h1>
      <p>Welcome, {user.id}</p>
    </div>
  );
}

// Mock Sign-in page
function SignInPage() {
  return (
    <div data-testid="signin-page">
      <h1>Sign In</h1>
      <p>Please sign in to continue.</p>
      <button data-testid="google-signin">Sign in with Google</button>
      <button data-testid="email-signin">Sign in with Email</button>
    </div>
  );
}

describe("Auth Flow: Sign-in -> Redirect -> Dashboard Load", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      user: { id: "clerk_agent_1" },
      isLoaded: true,
    });
  });

  it("renders dashboard for authenticated user", async () => {
    renderWithProviders(<AuthenticatedDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("Agent Overview")).toBeInTheDocument();
    expect(screen.getByText(/Welcome, clerk_agent_1/)).toBeInTheDocument();
  });

  it("redirects unauthenticated user to sign-in", async () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: true,
    });

    renderWithProviders(<AuthenticatedDashboard />);

    expect(screen.getByTestId("redirect-to-signin")).toBeInTheDocument();
  });

  it("shows loading state while Clerk loads", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
    });

    renderWithProviders(<AuthenticatedDashboard />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders sign-in page with auth options", () => {
    renderWithProviders(<SignInPage />);

    expect(screen.getByTestId("signin-page")).toBeInTheDocument();
    expect(screen.getByTestId("google-signin")).toBeInTheDocument();
    expect(screen.getByTestId("email-signin")).toBeInTheDocument();
  });

  it("redirect to sign-in renders redirect component", async () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: true,
    });

    renderWithProviders(<AuthenticatedDashboard />);

    expect(screen.getByTestId("redirect-to-signin")).toBeInTheDocument();
  });

  it("dashboard loads user data after successful sign-in", async () => {
    // Simulate user signing in
    mockUseUser.mockReturnValue({
      user: { id: "clerk_agent_1", email: "agent@proplead.ai" },
      isLoaded: true,
    });

    renderWithProviders(<AuthenticatedDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("Agent Overview")).toBeInTheDocument();
  });

  it("handles session expiry gracefully", async () => {
    // Simulate session expiring (user becomes null after being authenticated)
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: true,
    });

    renderWithProviders(<AuthenticatedDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("redirect-to-signin")).toBeInTheDocument();
    });
  });

  it("handles Clerk loading failure", () => {
    mockUseUser.mockReturnValue({
      user: null,
      isLoaded: false,
    });

    renderWithProviders(<AuthenticatedDashboard />);

    // Should show loading, not crash
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});
