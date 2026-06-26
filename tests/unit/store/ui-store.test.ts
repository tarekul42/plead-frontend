import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "@/store/ui-store";

describe("ui-store", () => {
  beforeEach(() => {
    useUIStore.setState({ sidebarOpen: false });
  });

  it("starts with sidebar closed", () => {
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });

  it("toggles sidebar open", () => {
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(true);
  });

  it("toggles sidebar closed", () => {
    useUIStore.getState().toggleSidebar();
    useUIStore.getState().toggleSidebar();
    expect(useUIStore.getState().sidebarOpen).toBe(false);
  });
});
