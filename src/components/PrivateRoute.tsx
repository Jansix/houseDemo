// src/components/PrivateRoute.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 只有在不是載入中且未認證時，才導向登入頁
    if (!isLoading && !isAuthenticated) {
      // 保存當前路徑到 sessionStorage，以便登入後返回
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirectAfterLogin', pathname)
      }
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // 未認證時，不渲染內容（此時應該正在導向登入頁）
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default PrivateRoute
