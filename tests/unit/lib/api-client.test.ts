import { describe, it, expect, beforeEach, vi } from "vitest";
import apiClient, {
  propertiesApi,
  leadsApi,
  interactionsApi,
  setAuthToken,
} from "@/lib/api-client";

vi.mock("axios", () => {
  const mockAxios: Record<string, any> = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    defaults: { headers: { common: {} } },
    interceptors: {
      response: { use: vi.fn() },
    },
  };
  return { default: mockAxios as any };
});

describe("api-client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setAuthToken", () => {
    it("sets Authorization header when token provided", () => {
      setAuthToken("my-token");
      expect(apiClient.defaults.headers.common["Authorization"]).toBe("Bearer my-token");
    });

    it("removes Authorization header when null", () => {
      setAuthToken("my-token");
      setAuthToken(null);
      expect(apiClient.defaults.headers.common["Authorization"]).toBeUndefined();
    });
  });

  describe("propertiesApi", () => {
    it("list calls GET /properties", async () => {
      (apiClient.get as any).mockResolvedValue({ data: { success: true, data: [] } });
      await propertiesApi.list({ page: 1 });
      expect(apiClient.get).toHaveBeenCalledWith("/properties", { params: { page: 1 } });
    });

    it("get calls GET /properties/:slug", async () => {
      (apiClient.get as any).mockResolvedValue({ data: { success: true, data: {} } });
      await propertiesApi.get("test-slug");
      expect(apiClient.get).toHaveBeenCalledWith("/properties/test-slug");
    });

    it("create calls POST /properties", async () => {
      (apiClient.post as any).mockResolvedValue({ data: { success: true, data: {} } });
      await propertiesApi.create({ title: "Test" });
      expect(apiClient.post).toHaveBeenCalledWith("/properties", { title: "Test" });
    });
  });

  describe("leadsApi", () => {
    it("list calls GET /leads", async () => {
      (apiClient.get as any).mockResolvedValue({ data: { success: true, data: [] } });
      await leadsApi.list();
      expect(apiClient.get).toHaveBeenCalledWith("/leads", { params: undefined });
    });
  });

  describe("interactionsApi", () => {
    it("listByLead calls GET /leads/:leadId/interactions", async () => {
      (apiClient.get as any).mockResolvedValue({ data: { success: true, data: [] } });
      await interactionsApi.listByLead("lead-1");
      expect(apiClient.get).toHaveBeenCalledWith("/leads/lead-1/interactions");
    });
  });
});
