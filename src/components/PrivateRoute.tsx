// src/components/PrivateRoute.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// 可選：建立一個 Loading 畫面組件，提升使用者體驗
const FullPageLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5',
    }}
  >
    <h2 style={{ color: '#333' }}>Loading...</h2>
  </div>
)

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 當結束載入且未驗證時，導向登入頁
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // 正在檢查權限時，顯示全頁載入畫面
  if (isLoading) {
    return <FullPageLoader />
  }

  // 確認已驗證，才渲染頁面內容
  if (!isAuthenticated) {
    return null // 返回 null 來避免在重導向前短暫顯示內容
  }

  return <>{children}</>
}

export default PrivateRoute
