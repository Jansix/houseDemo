// src/contexts/AuthContext.tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { authService, UserProfile } from '@/services/authService'
import { hasPotentialAuthState, clearAuthState } from '@/utils/authUtils'

// 【請確認】請根據您的後端 API 回應，修改 User 型別定義
interface User {
  id: string
  name: string
  email: string
  // ... 其他可能的使用者欄位
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
  refreshAuthState: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false) // 改為 false，避免預設載入狀態

  useEffect(() => {
    // 暫時停用自動檢查認證狀態，避免 CORS 問題
    console.log('AuthContext 初始化，暫時不檢查認證狀態')
    setIsLoading(false)

    // const checkAuthStatus = async () => {
    //   // 先檢查是否有認證相關的 cookie 或 localStorage
    //   if (!hasPotentialAuthState()) {
    //     console.log('沒有發現認證狀態，跳過 API 檢查')
    //     setIsLoading(false)
    //     return
    //   }

    //   console.log('發現可能的認證狀態，檢查使用者資料...')
    //   setIsLoading(true)
    //   try {
    //     // 【請確認此路徑】呼叫 API 獲取當前登入使用者資料
    //     const userData = await authService.getProfile()
    //     setUser(userData)
    //     console.log('使用者已登入:', userData)
    //   } catch (error) {
    //     console.log('使用者未登入或 session 已過期，清除本地認證狀態')
    //     setUser(null)
    //     clearAuthState() // 清除無效的認證狀態
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }
    // checkAuthStatus()
  }, [])

  const logout = async () => {
    try {
      // 【請確認此路徑】呼叫登出 API
      await authService.logout()
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setUser(null)
      clearAuthState()
      if (typeof window !== 'undefined') {
        window.location.href = '/login' // 導向登入頁
      }
    }
  }

  const refreshAuthState = async () => {
    console.log('開始刷新認證狀態...')
    setIsLoading(true)
    try {
      const userData = await authService.getProfile()
      setUser(userData)
      console.log('認證狀態刷新成功，使用者資料:', userData)
    } catch (error) {
      console.log('刷新認證狀態失敗，可能使用者未登入')
      setUser(null)
      clearAuthState()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
        refreshAuthState,
      }}
    >
      {/* 調試資訊 */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999,
          }}
        >
          <div>認證狀態: {!!user ? '已登入' : '未登入'}</div>
          <div>載入中: {isLoading ? '是' : '否'}</div>
          <div>使用者: {user ? user.name : '無'}</div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
