// src/contexts/AuthContext.tsx
'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from 'react'
import { UserProfile, authService } from '@/services/authService'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  setUser: (user: UserProfile | null) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 頁面初始載入時檢查認證狀態（只檢查一次）
  useEffect(() => {
    let isMounted = true // 防止組件卸載後設置狀態

    const checkInitialAuthStatus = async () => {
      try {
        console.log('開始初始認證檢查...')
        // 嘗試獲取用戶資料來驗證登入狀態
        const profile = await authService.getProfile()

        // 確保組件仍然掛載才設置狀態
        if (isMounted) {
          setUser({
            username: profile.username,
            phone: profile.phone,
            avatar: profile.avatar,
            department: profile.department,
          })
          console.log('頁面載入時恢復登入狀態:', profile.username)
        }
      } catch (error) {
        console.log('頁面載入時無有效的認證狀態:', error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          console.log('初始認證檢查完成')
        }
      }
    }

    // 設定一個延遲以避免立即執行
    const timer = setTimeout(checkInitialAuthStatus, 100)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, []) // 空依賴陣列，只在初始載入時執行一次

  // 登出函數
  const logout = () => {
    setUser(null)
    // 導向登入頁面
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // 使用 useMemo 來避免不必要的重新渲染
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      setUser,
      logout,
      isLoading,
    }),
    [user, isLoading]
  )

  return (
    <AuthContext.Provider value={value}>
      {/* 初始載入時的載入畫面 */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">檢查登入狀態...</p>
          </div>
        </div>
      )}

      {/* 開發環境調試資訊 */}
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
          <div>使用者: {user ? user.username : '無'}</div>
          <div>載入中: {isLoading ? '是' : '否'}</div>
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
