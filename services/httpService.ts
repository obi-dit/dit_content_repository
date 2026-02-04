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

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosProgressEvent,
  InternalAxiosRequestConfig,
} from "axios";
import { TOKEN_KEY } from "@/utils/auth";
import { toast } from "react-toastify";
import { ForbiddenError } from "@/utils/errors";

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

export interface RequestConfig {
  params?: Record<string, string | number | boolean>;
  skipAuth?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export class HttpService {
  private axiosInstance: AxiosInstance;

  constructor(config: HttpServiceConfig = {}) {
    // Determine base URL
    let baseURL: string;
    if (config.baseURL) {
      baseURL = config.baseURL;
    } else if (typeof window !== "undefined") {
      // In browser: use relative paths so Next.js rewrites can proxy
      baseURL = "";
    } else {
      // Server-side: use full URL
      baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    }

    // Create axios instance
    this.axiosInstance = axios.create({
      baseURL,
      timeout: config.timeout || 30000, // 30 seconds default
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      (axiosConfig: InternalAxiosRequestConfig) => {
        // Skip auth if specified in metadata
        const skipAuth = (axiosConfig as InternalAxiosRequestConfig & { skipAuth?: boolean }).skipAuth;
        if (!skipAuth) {
          const token = this.getAuthToken();
          if (token) {
            axiosConfig.headers.Authorization = `Bearer ${token}`;
          }
        }

        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<HttpErrorResponse>) => {
        return this.handleError(error);
      }
    );
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
   * Handle axios errors
   */
  private handleError(error: AxiosError<HttpErrorResponse>): never {
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout");
    }

    if (!error.response) {
      throw new Error("Network error - please check your connection");
    }

    const { status, data: errorData } = error.response;
    let errorMessage = `HTTP error! status: ${status}`;

    if (errorData) {
      errorMessage = errorData.message || errorData.error || errorMessage;
    }

    // Handle specific status codes
    if (status === 401) {
      // Unauthorized - clear token and redirect to login
      this.clearAuthToken();
      if (typeof window !== "undefined") {
        //check if the current path is the login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
       
      }
    }

    if (status === 400) {
      console.log("response", errorData);
      if (errorData) {
        const dataMessage = errorData.data?.message;
        if (Array.isArray(dataMessage)) {
          dataMessage.forEach((message: string) => {
            toast.error(message);
          });
        } else if (dataMessage) {
          toast.error(dataMessage);
        } else {
          toast.error(errorData.message || "Bad request");
        }
      }

      throw new Error(errorMessage);
    }

    if (status === 403) {
      // Forbidden - Permission denied
      let permissionErrorMessage =
        "You do not have permission to perform this action";

      if (errorData) {
        const dataMessage = errorData.data?.message;
        permissionErrorMessage =
          errorData.message ||
          (typeof dataMessage === "string"
            ? dataMessage
            : Array.isArray(dataMessage)
            ? dataMessage[0]
            : undefined) ||
          permissionErrorMessage;
      }

      toast.error(permissionErrorMessage, {
        autoClose: 5000,
        position: "top-right",
      });

      throw new ForbiddenError(permissionErrorMessage);
    }

    throw new Error(errorMessage);
  }

  /**
   * Build axios config from request config
   */
  private buildAxiosConfig(config: RequestConfig = {}): AxiosRequestConfig & { skipAuth?: boolean } {
    const axiosConfig: AxiosRequestConfig & { skipAuth?: boolean } = {};

    if (config.params) {
      axiosConfig.params = config.params;
    }

    if (config.timeout) {
      axiosConfig.timeout = config.timeout;
    }

    if (config.headers) {
      axiosConfig.headers = config.headers;
    }

    if (config.onUploadProgress) {
      axiosConfig.onUploadProgress = config.onUploadProgress;
    }

    if (config.skipAuth) {
      axiosConfig.skipAuth = true;
    }

    return axiosConfig;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const axiosConfig = this.buildAxiosConfig(config);
    const response = await this.axiosInstance.get<T>(endpoint, axiosConfig);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const axiosConfig = this.buildAxiosConfig(config);

    // Handle FormData - let axios set the Content-Type with boundary
    if (data instanceof FormData) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    const response = await this.axiosInstance.post<T>(endpoint, data, axiosConfig);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const axiosConfig = this.buildAxiosConfig(config);
    const response = await this.axiosInstance.put<T>(endpoint, data, axiosConfig);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const axiosConfig = this.buildAxiosConfig(config);
    const response = await this.axiosInstance.patch<T>(endpoint, data, axiosConfig);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const axiosConfig = this.buildAxiosConfig(config);
    const response = await this.axiosInstance.delete<T>(endpoint, axiosConfig);
    return response.data;
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Update default headers
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.axiosInstance.defaults.headers.common, headers);
  }
}

// Create and export a default instance
const httpService = new HttpService();

export default httpService;
