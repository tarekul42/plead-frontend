import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

// Mock next/navigation
const mockPathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

// Mock useCurrentUser
const mockUseCurrentUser = vi.fn();
vi.mock("@/hooks/use-current-user", () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

describe("DashboardSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the PropLead brand link", () => {
    mockPathname.mockReturnValue("/dashboard");
    mockUseCurrentUser.mockReturnValue({ role: null, isLoading: true });

    render(<DashboardSidebar />);
    expect(screen.getByText("PropLead")).toBeInTheDocument();
  });

  it("renders agent navigation links by default", () => {
    mockPathname.mockReturnValue("/dashboard");
    mockUseCurrentUser.mockReturnValue({ role: "agent", isLoading: false });

    render(<DashboardSidebar />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("My Leads")).toBeInTheDocument();
    expect(screen.getByText("My Properties")).toBeInTheDocument();
    expect(screen.getByText("Interactions")).toBeInTheDocument();
    expect(screen.getByText("AI Tools")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders manager-specific links", () => {
    mockPathname.mockReturnValue("/dashboard");
    mockUseCurrentUser.mockReturnValue({ role: "manager", isLoading: false });

    render(<DashboardSidebar />);

    expect(screen.getByText("AI Usage")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.queryByText("Interactions")).not.toBeInTheDocument();
  });

  it("renders admin-specific links", () => {
    mockPathname.mockReturnValue("/dashboard");
    mockUseCurrentUser.mockReturnValue({ role: "admin", isLoading: false });

    render(<DashboardSidebar />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Reviews")).toBeInTheDocument();
    expect(screen.getByText("AI Usage")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("shows the role badge when loaded", () => {
    mockPathname.mockReturnValue("/dashboard");
    mockUseCurrentUser.mockReturnValue({ role: "admin", isLoading: false });

    render(<DashboardSidebar />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("does not show role badge while loading", () => {
    mockPathname.mockReturnValue("/dashboard");
    mockUseCurrentUser.mockReturnValue({ role: null, isLoading: true });

    render(<DashboardSidebar />);

    expect(screen.queryByText("Agent")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("highlights the active link based on pathname", () => {
    mockPathname.mockReturnValue("/dashboard/leads");
    mockUseCurrentUser.mockReturnValue({ role: "agent", isLoading: false });

    render(<DashboardSidebar />);

    // The active link should have the "text-brand" class (applied via template literal)
    const leadsLink = screen.getByText("My Leads").closest("a");
    expect(leadsLink).toBeInTheDocument();
    // Active links get text-brand and font-medium classes
    expect(leadsLink?.className).toContain("text-brand");
  });

  it("brand links to /dashboard", () => {
    mockPathname.mockReturnValue("/dashboard/leads");
    mockUseCurrentUser.mockReturnValue({ role: "agent", isLoading: false });

    render(<DashboardSidebar />);

    const brandLink = screen.getByText("PropLead").closest("a");
    expect(brandLink).toHaveAttribute("href", "/dashboard");
  });
});
