import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 15000,
});

let authToken: string | null = null;

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message;
    if (message) {
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null) {
  authToken = token;
}

export const propertiesApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/properties", { params }).then((r) => r.data),
  get: (slug: string) => apiClient.get(`/properties/${slug}`).then((r) => r.data),
  create: (data: unknown) => apiClient.post("/properties", data).then((r) => r.data),
  update: (id: string, data: unknown) =>
    apiClient.patch(`/properties/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/properties/${id}`).then((r) => r.data),
};

export const leadsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/leads", { params }).then((r) => r.data),
  get: (id: string) => apiClient.get(`/leads/${id}`).then((r) => r.data),
  create: (data: unknown) => apiClient.post("/leads", data).then((r) => r.data),
  update: (id: string, data: unknown) =>
    apiClient.patch(`/leads/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/leads/${id}`).then((r) => r.data),
};

export const usersApi = {
  list: () => apiClient.get("/users").then((r) => r.data),
};

export const reviewsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/reviews", { params }).then((r) => r.data),
  update: (id: string, data: unknown) =>
    apiClient.patch(`/reviews/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/reviews/${id}`).then((r) => r.data),
};

export const interactionsApi = {
  list: () => apiClient.get("/interactions").then((r) => r.data),
  listByLead: (leadId: string) =>
    apiClient.get(`/leads/${leadId}/interactions`).then((r) => r.data),
  create: (leadId: string, data: unknown) =>
    apiClient.post(`/leads/${leadId}/interactions`, data).then((r) => r.data),
};

export const adminApi = {
  toggleUserStatus: (id: string) =>
    apiClient.patch(`/admin/users/${id}/toggle-status`).then((r) => r.data),
};

export const aiApi = {
  matchLeadProperties: (data: { leadId: string; propertyIds?: string[] }) =>
    apiClient.post("/ai/match-lead-properties", data).then((r) => r.data),
  generatePropertyDescription: (data: { propertyId: string; tone: string }) =>
    apiClient.post("/ai/generate-property-description", data).then((r) => r.data),
  generateOutreachEmail: (data: { leadId: string; propertyId: string; tone: string }) =>
    apiClient.post("/ai/generate-outreach-email", data).then((r) => r.data),
};

export default apiClient;
