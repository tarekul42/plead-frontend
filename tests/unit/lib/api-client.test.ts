import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import apiClient, {
  interactionsApi,
  leadsApi,
  propertiesApi,
  setAuthToken,
} from "@/lib/api-client";

vi.mock("axios", () => {
  const mockAxios: Record<string, unknown> = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: vi.fn().mockReturnValue(0) },
      response: { use: vi.fn().mockReturnValue(0) },
    },
  };
  return { default: mockAxios as unknown as typeof import("axios").default };
});

describe("api-client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setAuthToken", () => {
    it("stores token and clears it", () => {
      setAuthToken("my-token");
      setAuthToken(null);
    });
  });

  describe("propertiesApi", () => {
    it("list calls GET /properties", async () => {
      (apiClient.get as Mock).mockResolvedValue({ data: { success: true, data: [] } });
      await propertiesApi.list({ page: 1 });
      expect(apiClient.get).toHaveBeenCalledWith("/properties", { params: { page: 1 } });
    });

    it("get calls GET /properties/:slug", async () => {
      (apiClient.get as Mock).mockResolvedValue({ data: { success: true, data: {} } });
      await propertiesApi.get("test-slug");
      expect(apiClient.get).toHaveBeenCalledWith("/properties/test-slug");
    });

    it("create calls POST /properties", async () => {
      (apiClient.post as Mock).mockResolvedValue({ data: { success: true, data: {} } });
      await propertiesApi.create({ title: "Test" });
      expect(apiClient.post).toHaveBeenCalledWith("/properties", { title: "Test" });
    });
  });

  describe("leadsApi", () => {
    it("list calls GET /leads", async () => {
      (apiClient.get as Mock).mockResolvedValue({ data: { success: true, data: [] } });
      await leadsApi.list();
      expect(apiClient.get).toHaveBeenCalledWith("/leads", { params: undefined });
    });
  });

  describe("interactionsApi", () => {
    it("listByLead calls GET /leads/:leadId/interactions", async () => {
      (apiClient.get as Mock).mockResolvedValue({ data: { success: true, data: [] } });
      await interactionsApi.listByLead("lead-1");
      expect(apiClient.get).toHaveBeenCalledWith("/leads/lead-1/interactions");
    });
  });
});
