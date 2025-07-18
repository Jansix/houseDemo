'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function NavigationAuth() {
  const { isAuthenticated, user, logout } = useAuth()

  // 調試資訊
  console.log('NavigationAuth 狀態:', {
    isAuthenticated,
    user: user ? `${user.name} (${user.id})` : null,
  })

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('登出失敗:', error)
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/profile"
          className="text-gray-700 hover:text-primary-600 transition duration-200"
        >
          歡迎，{user.name}
        </Link>
        {/* 管理員才顯示管理頁面連結 */}
        {/* TODO: 等有權限系統後，根據使用者角色顯示 */}
        <Link
          href="/admin"
          className="text-gray-700 hover:text-primary-600 transition duration-200"
        >
          管理
        </Link>
        <button
          onClick={handleLogout}
          className="text-gray-700 hover:text-primary-600 transition duration-200"
        >
          登出
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="text-gray-700 hover:text-primary-600 transition duration-200"
    >
      登入
    </Link>
  )
}
