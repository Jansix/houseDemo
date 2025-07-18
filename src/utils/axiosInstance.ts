// src/utils/axiosInstance.ts

import axios, { AxiosError, AxiosRequestConfig } from 'axios'

// --- 處理並發請求的邏輯 ---
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(undefined)
    }
  })
  failedQueue = []
}
// -----------------------------

const axiosInstance = axios.create({
  baseURL: 'https://house_demo.codychen.me', // 已根據您提供的資訊設定
  withCredentials: false, // 暫時關閉 credentials，避免 CORS 問題
  timeout: 10000, // 請求超時時間
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 新增回應攔截器
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    // 檢查是否是 401 錯誤 (未授權)
    // 請確認後端在 Access Token 過期時是否確實回傳 401
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/refresh') &&
      !originalRequest.url?.includes('/login') && // 避免登入請求被攔截
      !originalRequest.url?.includes('/profile') && // 避免初始檢查被攔截
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => axiosInstance(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // 【請確認此路徑】呼叫後端的刷新 API
        await axiosInstance.post('/service/user/refresh') // <-- 已使用推斷路徑，請確認

        processQueue(null)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)
        // 如果連刷新都失敗，代表登入階段已完全失效
        // 強制導向到登入頁面
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
