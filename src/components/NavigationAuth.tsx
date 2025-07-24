'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function NavigationAuth() {
  const { isAuthenticated, user, isLoading } = useAuth()

  // 載入中時顯示輕量級占位符，不阻塞其他內容
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse h-6 w-12 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
        <Link
          href="/publish"
          className="block md:inline text-gray-700 hover:text-primary-600 transition duration-200 hover:bg-gray-50 md:hover:bg-transparent rounded-md md:rounded-none px-3 py-2 md:px-0 md:py-0"
        >
          刊登物件
        </Link>
        <Link
          href="/profile"
          className="block md:inline text-gray-700 hover:text-primary-600 transition duration-200 hover:bg-gray-50 md:hover:bg-transparent rounded-md md:rounded-none px-3 py-2 md:px-0 md:py-0"
        >
          歡迎，{user.username}
        </Link>
        {/* 只有管理員才顯示管理頁面連結 */}
        {user.level === 'admin' && (
          <Link
            href="/admin"
            className="block md:inline text-gray-700 hover:text-primary-600 transition duration-200 hover:bg-gray-50 md:hover:bg-transparent rounded-md md:rounded-none px-3 py-2 md:px-0 md:py-0"
          >
            管理
          </Link>
        )}
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="block md:inline text-gray-700 hover:text-primary-600 transition duration-200 hover:bg-gray-50 md:hover:bg-transparent rounded-md md:rounded-none px-3 py-2 md:px-0 md:py-0"
    >
      登入
    </Link>
  )
}
