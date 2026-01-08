import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const API_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN || '';

    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): Error {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      const baseURL = error.config?.baseURL;
      return new Error(`Can't connect to backend at ${baseURL}`);
    }

    const status = error.response?.status;
    if (status === 404) {
      return new Error('Endpoint not found');
    }

    if (status === 401 || status === 403) {
      return new Error('Authentication failed');
    }

    if (status && status >= 500) {
      return new Error('Server error');
    }

    return new Error(`API Error (${status || 'Unknown'})`);
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;

