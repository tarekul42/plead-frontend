import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText(/Match the right lead to the right property in seconds/)).toBeInTheDocument();
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
    expect(screen.getByText("AI-Powered Real Estate Platform")).toBeInTheDocument();
  });

  it("renders the dashboard preview with match scores", () => {
    render(<Hero />);
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("71%")).toBeInTheDocument();
  });

  it("renders property cards in the preview", () => {
    render(<Hero />);
    expect(screen.getByText("Modern 3BR in Brooklyn")).toBeInTheDocument();
    expect(screen.getByText("Luxury Condo, Manhattan")).toBeInTheDocument();
    expect(screen.getByText("Cozy Studio, Downtown")).toBeInTheDocument();
  });

  it("renders the animated arrow indicator", () => {
    render(<Hero />);
    const arrow = document.querySelector("svg.lucide-arrow-down");
    expect(arrow).toBeInTheDocument();
  });
});
