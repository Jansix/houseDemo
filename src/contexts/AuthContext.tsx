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
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true) // 改為 true，等待認證檢查完成

  // 頁面初始載入時檢查認證狀態（輕量級檢查）
  useEffect(() => {
    let isMounted = true // 防止組件卸載後設置狀態

    const checkAuthStatus = async () => {
      try {
        console.log('開始輕量級認證檢查...')
        // 設置載入狀態為 true（僅用於 Header 顯示）
        if (isMounted) {
          setIsLoading(true)
        }

        // 嘗試獲取用戶資料來驗證登入狀態
        const profile = await authService.getProfile()

        // 確保組件仍然掛載才設置狀態
        if (isMounted) {
          setUser({
            username: profile.username,
            phone: profile.phone,
            avatar: profile.avatar,
            department: profile.department,
            level: profile.level,
          })
          console.log(
            '恢復登入狀態:',
            profile.username,
            'Level:',
            profile.level
          )
        }
      } catch (error) {
        console.log('無有效的認證狀態:', error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          console.log('認證檢查完成')
        }
      }
    }

    // 立即執行檢查，不延遲
    checkAuthStatus()

    return () => {
      isMounted = false
    }
  }, []) // 空依賴陣列，只在初始載入時執行一次

  // 使用 useMemo 來避免不必要的重新渲染
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      setUser,
      isLoading,
    }),
    [user, isLoading]
  )

  return (
    <AuthContext.Provider value={value}>
      {/* 移除全屏載入畫面，讓首頁內容優先渲染 */}

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
          <div>權限級別: {user ? user.level : '無'}</div>
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
