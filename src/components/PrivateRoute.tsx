// src/components/PrivateRoute.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 未認證時，導向登入頁
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // 確認已驗證，才渲染頁面內容
  if (!isAuthenticated) {
    return null // 返回 null 來避免在重導向前短暫顯示內容
  }

  return <>{children}</>
}

export default PrivateRoute
