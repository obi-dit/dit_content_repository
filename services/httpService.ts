/**
 * HTTP Service - A reusable HTTP client for making API requests
 *
 * This service provides a centralized way to make HTTP requests with:
 * - Automatic base URL configuration
 * - Default headers
 * - Error handling
 * - Request/response interceptors support
 * - Token management
 */

import { TOKEN_KEY } from "@/utils/auth";
import { toast } from "react-toastify";

export interface HttpServiceConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface HttpErrorResponse {
  data: {
    message: string | string[];
    error: string;
    statusCode: number;
  };
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  skipAuth?: boolean;
}

export class HttpService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: HttpServiceConfig = {}) {
    // Use relative paths in browser (for Next.js proxy) or absolute URL in server-side
    // If baseURL is explicitly provided, use it; otherwise use relative path for proxy
    if (config.baseURL) {
      this.baseURL = config.baseURL;
    } else if (typeof window !== "undefined") {
      // In browser: use relative paths so Next.js rewrites can proxy
      this.baseURL = "";
    } else {
      // Server-side: use full URL
      this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    }
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.timeout = config.timeout || 30000; // 30 seconds default
  }

  /**
   * Get the authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Set the authentication token in storage
   */
  setAuthToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Remove the authentication token from storage
   */
  clearAuthToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    // If baseURL is empty (for proxy), use relative path
    if (!this.baseURL) {
      let url = endpoint;

      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value));
        });
        const queryString = searchParams.toString();
        url += queryString ? `?${queryString}` : "";
      }

      return url;
    }

    // Use absolute URL when baseURL is

    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Build headers for the request
   */
  private buildHeaders(config: RequestConfig = {}): Record<string, string> {
    const headers: Record<string, string> = { ...this.defaultHeaders };

    // Add auth token if available and not skipped
    if (!config.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    // Merge custom headers (only if provided, and not empty object)
    if (config.headers && Object.keys(config.headers).length > 0) {
      Object.assign(headers, config.headers);
    }

    return headers;
  }

  /**
   * Handle response and parse JSON
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    let errorData: HttpErrorResponse | null = null;
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      if (isJson) {
        try {
          errorData = (await response.json()) as HttpErrorResponse;
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default error message
        }
      }

      // Handle specific status codes
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        this.clearAuthToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      if (response.status === 400) {
        console.log("response", errorData);
        if (errorData) {
          if (Array.isArray(errorData.data.message)) {
            errorData.data.message.forEach((message: string) => {
              toast.error(message);
            });
          } else {
            toast.error(errorData.data.message);
          }
        }
      }
    }

    if (isJson) {
      return await response.json();
    }

    return (await response.text()) as unknown as T;
  }

  /**
   * Make a request with timeout
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.buildURL(endpoint, config.params);
    const headers = config.headers || this.buildHeaders(config);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...config,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }

      throw new Error("An unexpected error occurred");
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    // Check if data is FormData - if so, don't stringify and don't set Content-Type
    const isFormData = data instanceof FormData;
    const headers = { ...this.buildHeaders(config) };

    // Remove Content-Type header for FormData to let browser set it with boundary
    if (isFormData) {
      delete headers["Content-Type"];
    }

    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Update default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }
}

// Create and export a default instance
const httpService = new HttpService();

export default httpService;
