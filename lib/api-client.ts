import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";
import type { PropertyListParams, LeadListParams } from "@/types";

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let authToken: string | null = null;
let tokenGetter: (() => Promise<string | null>) | null = null;
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: Error) => void;
}> = [];

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  timeout: 15000,
  withCredentials: true,
});

function processRefreshQueue(token: string) {
  refreshQueue.forEach(({ resolve }) => resolve(token));
  refreshQueue = [];
}

function failRefreshQueue(error: Error) {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
}

apiClient.interceptors.request.use(
  async (config) => {
    let token: string | null = null;
    if (tokenGetter) {
      token = await tokenGetter();
    }
    if (!token && authToken) {
      token = authToken;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;
    const errorData = error.response?.data?.error;

    if (statusCode === 401 && errorData?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        const newToken = response.data?.data?.token;
        if (newToken) {
          setAuthToken(newToken);
          processRefreshQueue(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
        throw new Error("No token in refresh response");
      } catch (refreshError) {
        failRefreshQueue(refreshError as Error);
        setAuthToken(null);
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (errorData) {
      return Promise.reject(
        new ApiError(
          statusCode || 500,
          errorData.code || "UNKNOWN_ERROR",
          errorData.message || "An unexpected error occurred",
          errorData.details,
        ),
      );
    }

    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }

    if (error.message === "Network Error") {
      return Promise.reject(new ApiError(503, "NETWORK_ERROR", "Unable to connect to server"));
    }

    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export function setTokenGetter(getter: (() => Promise<string | null>) | null) {
  tokenGetter = getter;
}

function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  return response.data?.data ?? (response.data as unknown as T);
}

function extractPaginatedData<T>(response: AxiosResponse<ApiResponse<T[]>>) {
  return {
    data: response.data?.data ?? [],
    meta: response.data?.meta,
  };
}

export const propertiesApi = {
  list: (params?: PropertyListParams) =>
    apiClient.get("/properties", { params }).then(extractPaginatedData),
  get: (slug: string) =>
    apiClient.get(`/properties/${slug}`).then(extractData),
  create: (data: unknown) =>
    apiClient.post("/properties", data).then(extractData),
  update: (id: string, data: unknown) =>
    apiClient.patch(`/properties/${id}`, data).then(extractData),
  delete: (id: string) =>
    apiClient.delete(`/properties/${id}`).then(extractData),
};

export const leadsApi = {
  list: (params?: LeadListParams) =>
    apiClient.get("/leads", { params }).then(extractPaginatedData),
  get: (id: string) =>
    apiClient.get(`/leads/${id}`).then(extractData),
  create: (data: unknown) =>
    apiClient.post("/leads", data).then(extractData),
  update: (id: string, data: unknown) =>
    apiClient.patch(`/leads/${id}`, data).then(extractData),
  delete: (id: string) =>
    apiClient.delete(`/leads/${id}`).then(extractData),
};

export const usersApi = {
  list: () =>
    apiClient.get("/users").then(extractPaginatedData),
  me: () =>
    apiClient.get("/users/me").then(extractData),
};

export const reviewsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/reviews", { params }).then(extractPaginatedData),
  create: (data: unknown) =>
    apiClient.post("/reviews", data).then(extractData),
  update: (id: string, data: unknown) =>
    apiClient.patch(`/reviews/${id}`, data).then(extractData),
  delete: (id: string) =>
    apiClient.delete(`/reviews/${id}`).then(extractData),
};

export const interactionsApi = {
  list: () =>
    apiClient.get("/interactions").then(extractPaginatedData),
  listByLead: (leadId: string) =>
    apiClient.get(`/leads/${leadId}/interactions`).then(extractData),
  create: (leadId: string, data: unknown) =>
    apiClient.post(`/leads/${leadId}/interactions`, data).then(extractData),
};

export const blogsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/blog", { params }).then(extractPaginatedData),
  get: (slug: string) =>
    apiClient.get(`/blog/${slug}`).then(extractData),
  create: (data: unknown) =>
    apiClient.post("/blog", data).then(extractData),
  update: (id: string, data: unknown) =>
    apiClient.patch(`/blog/${id}`, data).then(extractData),
  delete: (id: string) =>
    apiClient.delete(`/blog/${id}`).then(extractData),
};

export const adminApi = {
  toggleUserStatus: (id: string) =>
    apiClient.patch(`/admin/users/${id}/toggle-status`).then(extractData),
};

export const aiApi = {
  matchLeadProperties: (data: { leadId: string; propertyIds?: string[] }) =>
    apiClient.post("/ai/match-lead-properties", data).then(extractData),
  generatePropertyDescription: (data: { propertyId: string; tone: string }) =>
    apiClient.post("/ai/generate-property-description", data).then(extractData),
  generateOutreachEmail: (data: { leadId: string; propertyId: string; tone: string }) =>
    apiClient.post("/ai/generate-outreach-email", data).then(extractData),
};

export const uploadApi = {
  images: (files: FileList | File[], folder = "properties") => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("folder", folder);
    return apiClient.post("/upload/images", formData).then(extractData);
  },
  single: (file: File, folder = "avatars") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return apiClient.post("/upload/single", formData).then(extractData);
  },
};

export { ApiError };
export default apiClient;
