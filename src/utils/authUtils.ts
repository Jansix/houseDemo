// src/utils/authUtils.ts

/**
 * 檢查是否可能有認證狀態
 * 避免在沒有認證資訊時調用 API
 */
export const hasPotentialAuthState = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  // 檢查 cookies 中是否有認證相關資訊
  const cookies = document.cookie
  const hasAuthCookie =
    cookies.includes('auth') ||
    cookies.includes('token') ||
    cookies.includes('session') ||
    cookies.includes('access') ||
    cookies.includes('jwt')

  // 檢查 localStorage 是否有認證資訊
  const hasLocalAuth =
    localStorage.getItem('token') ||
    localStorage.getItem('auth') ||
    localStorage.getItem('user')

  return hasAuthCookie || !!hasLocalAuth
}

/**
 * 清除所有認證相關的本地資料
 */
export const clearAuthState = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  // 清除 localStorage
  const authKeys = ['token', 'auth', 'user', 'access_token', 'refresh_token']
  authKeys.forEach((key) => {
    localStorage.removeItem(key)
  })

  // 清除 sessionStorage
  authKeys.forEach((key) => {
    sessionStorage.removeItem(key)
  })
}
