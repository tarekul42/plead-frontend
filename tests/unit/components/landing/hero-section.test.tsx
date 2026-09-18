import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/components/landing/hero";

describe("Hero (landing section)", () => {
  it("renders the main heading", () => {
    render(<Hero />);
    expect(screen.getByText(/Close more deals with/)).toBeInTheDocument();
  });

  it("renders the gradient subtitle", () => {
    render(<Hero />);
    expect(screen.getByText("AI-powered lead matching")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Match the right lead to the right property in seconds/),
    ).toBeInTheDocument();
  });

  it("renders the 'Start free' CTA link", () => {
    render(<Hero />);
    const startLink = screen.getByText("Start free").closest("a");
    expect(startLink).toHaveAttribute("href", "/sign-up");
  });

  it("renders the 'Explore properties' link", () => {
    render(<Hero />);
    const exploreLink = screen.getByText("Explore properties").closest("a");
    expect(exploreLink).toHaveAttribute("href", "/properties");
  });

  it("renders the AI badge", () => {
    render(<Hero />);
    expect(screen.getByText("AI-Powered Real Estate")).toBeInTheDocument();
  });

  it("renders the product demo tabs", () => {
    render(<Hero />);
    expect(screen.getByText("Property")).toBeInTheDocument();
    expect(screen.getByText("AI Match")).toBeInTheDocument();
    expect(screen.getByText("Outreach")).toBeInTheDocument();
  });

  it("renders the first slide property title", () => {
    render(<Hero />);
    expect(screen.getByText("Modern 3BR in Brooklyn")).toBeInTheDocument();
  });

  it("renders trust badges", () => {
    render(<Hero />);
    expect(screen.getByText("No credit card")).toBeInTheDocument();
    expect(screen.getByText("Free forever")).toBeInTheDocument();
    expect(screen.getByText("Cancel anytime")).toBeInTheDocument();
  });
});
