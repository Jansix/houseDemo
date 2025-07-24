// src/utils/apiClient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api', // 使用 Next.js 代理
  withCredentials: true, // 確保發送跨域請求時包含 cookie
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 設定公開頁面路徑（不需要登入的頁面）
const PUBLIC_PATHS = ['/', '/houses', '/login']

// 檢查當前路徑是否為公開頁面
const isPublicPath = (pathname: string): boolean => {
  // 首頁
  if (pathname === '/') return true
  // 登入頁
  if (pathname === '/login') return true
  // 房屋詳情頁 (houses/[id])
  if (pathname.startsWith('/houses/')) return true
  // 房屋列表頁
  if (pathname === '/houses') return true

  return false
}

// 添加響應攔截器
apiClient.interceptors.response.use(
  (response) => response, // 正常響應直接返回
  (error) => {
    // 檢查響應狀態碼是否為 401
    if (error.response && error.response.status === 401) {
      console.warn('收到 401 Unauthorized')

      // 只有在瀏覽器環境中才進行導向
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname

        // 檢查是否為 profile 相關請求（用於狀態檢查）
        const isProfileRequest = error.config?.url?.includes(
          '/service/user/profile'
        )

        // 如果不是公開頁面且不是 profile 請求，才導向登入頁
        if (!isPublicPath(pathname) && !isProfileRequest) {
          console.log('非公開頁面收到 401，導向登入頁')
          window.location.href = '/login'
        } else {
          console.log('公開頁面或 profile 請求收到 401，不導向登入頁')
        }
      }
    }
    return Promise.reject(error) // 拋出錯誤，讓調用者處理其他錯誤
  }
)

export default apiClient
