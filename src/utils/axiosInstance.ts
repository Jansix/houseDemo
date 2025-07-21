// src/utils/axiosInstance.ts

import axios, { AxiosError, AxiosRequestConfig } from 'axios'

// 懸浮提醒函數
const showLoginExpiredNotification = () => {
  // 移除之前的通知（如果存在）
  const existingNotification = document.getElementById(
    'login-expired-notification'
  )
  if (existingNotification) {
    existingNotification.remove()
  }

  // 創建懸浮通知
  const notification = document.createElement('div')
  notification.id = 'login-expired-notification'
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    animation: slideInRight 0.3s ease-out;
  `
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>⚠️</span>
      <span>登錄過期，請重新登錄</span>
    </div>
  `

  // 添加動畫樣式
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)
  document.body.appendChild(notification)

  // 2秒後移除通知並導向登入頁面
  setTimeout(() => {
    notification.remove()
    window.location.href = '/login'
  }, 2000)
}

const axiosInstance = axios.create({
  baseURL: '/api', // 使用 Next.js 代理
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
      console.log('收到 401 錯誤，使用者未授權')

      // 檢查是否是 profile 相關的請求（初始認證檢查或個人資料獲取）
      const isProfileRequest = error.config?.url?.includes(
        '/service/user/profile'
      )

      // 只在不是 profile 請求且在瀏覽器環境中才顯示通知和重定向
      if (!isProfileRequest && typeof window !== 'undefined') {
        console.log('顯示登錄過期通知並重定向')
        showLoginExpiredNotification()
      } else if (isProfileRequest) {
        console.log('Profile 請求失敗，但不顯示通知（可能是初始檢查）')
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
