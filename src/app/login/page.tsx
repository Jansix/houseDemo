'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import config from '@/data/config'

interface LoginFormData {
  login: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, refreshAuthState } = useAuth()

  const [formData, setFormData] = useState<LoginFormData>({
    login: '',
    password: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})

  // 如果已經登入，直接導向首頁
  if (isAuthenticated) {
    router.push('/')
    return null
  }

  // 處理輸入欄位變更
  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 清除該欄位的錯誤訊息
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    if (!formData.login.trim()) {
      newErrors.login = '請輸入帳號'
    }

    if (!formData.password.trim()) {
      newErrors.password = '請輸入密碼'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log(
        '開始登入，發送請求到:',
        'https://house_demo.codychen.me/service/user/login'
      )
      console.log('登入資料:', {
        login: formData.login,
        password: formData.password,
      })

      // 呼叫登入 API
      const response = await authService.login({
        login: formData.login,
        password: formData.password,
      })

      console.log('登入成功，回應:', response)

      // 登入成功後刷新認證狀態
      console.log('開始刷新認證狀態...')
      await refreshAuthState()
      console.log('認證狀態刷新完成')

      // 延遲一下確保狀態更新完成
      setTimeout(() => {
        router.push('/')
      }, 100)
    } catch (error: any) {
      console.error('登入失敗，完整錯誤資訊:', error)

      if (error.response) {
        // 伺服器有回應，但狀態碼表示錯誤
        console.error('伺服器回應狀態:', error.response.status)
        console.error('伺服器回應資料:', error.response.data)
        console.error('伺服器回應標頭:', error.response.headers)

        if (error.response.status === 401) {
          alert('帳號或密碼錯誤，請重新輸入')
        } else {
          alert(
            `伺服器錯誤 (${error.response.status}): ${
              error.response.data?.message || '未知錯誤'
            }`
          )
        }
      } else if (error.request) {
        // 請求已發送但沒有收到回應
        console.error('請求已發送但沒有收到回應:', error.request)
        alert('無法連接到伺服器，可能是網路問題或 CORS 限制')
      } else {
        // 其他錯誤
        console.error('請求設定錯誤:', error.message)
        alert(`請求失敗: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo 區域 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">999 房屋網</h1>
          <p className="mt-2 text-gray-600">登入您的帳戶</p>
        </div>

        {/* 登入表單 */}
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 帳號欄位 */}
            <div>
              <label
                htmlFor="login"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                帳號 <span className="text-red-500">*</span>
              </label>
              <input
                id="login"
                type="text"
                value={formData.login}
                onChange={(e) => handleInputChange('login', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.login ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="請輸入您的帳號"
                autoComplete="username"
              />
              {errors.login && (
                <p className="mt-1 text-sm text-red-600">{errors.login}</p>
              )}
            </div>

            {/* 密碼欄位 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                密碼 <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="請輸入您的密碼"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 登入按鈕 */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200`}
              >
                {isSubmitting ? '登入中...' : '登入'}
              </button>
            </div>

            {/* 返回首頁連結 */}
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-primary-600 hover:text-primary-500 transition duration-200"
              >
                返回首頁
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
