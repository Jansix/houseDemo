// src/utils/axiosInstance.ts

import axios, { AxiosError, AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://house_demo.codychen.me',
  withCredentials: true, // 開啟 cookie 支援，讓後端可以設定認證 cookie
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 新增回應攔截器，處理 401 未授權錯誤
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 檢查是否是 401 錯誤 (未授權)
    if (error.response?.status === 401) {
      console.log('收到 401 錯誤，使用者未授權，導向登入頁面')

      // 直接導向登入頁面，不做任何 token 刷新嘗試
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
