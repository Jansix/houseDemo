// src/components/PrivateRoute.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 只有在不是載入中且未認證時，才導向登入頁
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // 載入中或未認證時，不渲染內容
  if (isLoading || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
