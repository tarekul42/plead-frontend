import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users } from "lucide-react";

describe("StatCard", () => {
  it("renders title and value", () => {
    render(<StatCard title="Total Leads" value={42} icon={Users} />);
    expect(screen.getByText("Total Leads")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <StatCard title="Revenue" value="$1.2M" description="Last 30 days" icon={Users} />,
    );
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("renders positive trend", () => {
    render(
      <StatCard
        title="Conversion"
        value="12%"
        icon={Users}
        trend={{ value: "+2.5%", positive: true }}
      />,
    );
    const trend = screen.getByText("+2.5%");
    expect(trend).toBeInTheDocument();
    expect(trend.className).toContain("text-success");
  });

  it("renders negative trend", () => {
    render(
      <StatCard
        title="Bounce Rate"
        value="8%"
        icon={Users}
        trend={{ value: "+1.2%", positive: false }}
      />,
    );
    const trend = screen.getByText("+1.2%");
    expect(trend.className).toContain("text-danger");
  });
});
