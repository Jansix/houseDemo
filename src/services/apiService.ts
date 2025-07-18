// src/services/apiService.ts

import { AxiosRequestConfig } from 'axios'
import axiosInstance from '@/utils/axiosInstance'

interface ApiOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  auth?: boolean
}

async function request<T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data: any = null,
  options: ApiOptions = {}
): Promise<T> {
  const { headers = {}, params = {}, auth = false } = options // 預設不使用 credentials

  const config: AxiosRequestConfig = {
    method,
    url,
    params,
    withCredentials: auth,
  }

  if (!(data instanceof FormData)) {
    config.headers = { 'Content-Type': 'application/json', ...headers }
  } else {
    config.headers = headers
  }

  if (data) {
    config.data = data
  }

  try {
    const response = await axiosInstance(config)
    return response.data as T
  } catch (error) {
    console.error(`API Error on ${method.toUpperCase()} ${url}:`, error)
    throw error
  }
}

export const api = {
  get: <T>(
    url: string,
    params?: Record<string, any>,
    options?: Omit<ApiOptions, 'params'>
  ) => request<T>('get', url, null, { ...options, params }),
  post: <T>(url: string, data: any, options?: ApiOptions) =>
    request<T>('post', url, data, options),
  put: <T>(url: string, data: any, options?: ApiOptions) =>
    request<T>('put', url, data, options),
  patch: <T>(url: string, data: any, options?: ApiOptions) =>
    request<T>('patch', url, data, options),
  del: <T>(url: string, options?: ApiOptions) =>
    request<T>('delete', url, null, options),
}
