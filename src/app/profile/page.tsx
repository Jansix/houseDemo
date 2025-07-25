'use client'

import { useState, useEffect, useRef } from 'react'
import PrivateRoute from '@/components/PrivateRoute'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [phoneError, setPhoneError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editForm, setEditForm] = useState({
    username: '',
    phone: '',
    department: '',
  })

  // 當 user 資料載入時，更新表單
  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || '',
        phone: user.phone || '',
        department: user.department || '',
      })
      setPreviewUrl(user.avatar || '')
      setPhoneError('') // 清除錯誤狀態
    }
  }, [user])

  // 清理預覽 URL 以避免記憶體洩漏
  useEffect(() => {
    return () => {
      if (selectedFile && previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [selectedFile, previewUrl])

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))

    // 電話號碼實時驗證
    if (field === 'phone') {
      if (value === '') {
        setPhoneError('')
      } else {
        const phoneRegex = /^09\d{8}$/
        if (!phoneRegex.test(value)) {
          if (value.length < 10) {
            setPhoneError('電話號碼必須是10碼')
          } else if (value.length > 10) {
            setPhoneError('電話號碼不能超過10碼')
          } else if (!value.startsWith('09')) {
            setPhoneError('電話號碼必須以09開頭')
          } else {
            setPhoneError('電話號碼格式不正確')
          }
        } else {
          setPhoneError('')
        }
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 檢查檔案類型
      if (!file.type.startsWith('image/')) {
        alert('請選擇圖片檔案')
        return
      }

      // 檢查檔案大小 (限制 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('圖片檔案不能超過 5MB')
        return
      }

      setSelectedFile(file)

      // 建立預覽 URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const validateForm = () => {
    // 電話號碼驗證：必須是09開頭的10碼數字（如果有輸入的話）
    if (editForm.phone && editForm.phone.trim() !== '') {
      const phoneRegex = /^09\d{8}$/
      if (!phoneRegex.test(editForm.phone)) {
        alert('請檢查電話號碼格式：必須是09開頭的10碼數字')
        return false
      }
    }

    return true
  }

  const handleSave = async () => {
    // 先驗證表單
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      // 使用 FormData 來支援檔案上傳
      const formData = new FormData()
      formData.append('username', editForm.username)
      formData.append('phone', editForm.phone)
      formData.append('department', editForm.department)

      if (selectedFile) {
        formData.append('avatar', selectedFile)
      }

      // 更新資料
      await authService.updateProfileWithFormData(formData)

      // 重新從後端獲取最新的用戶資訊
      const updatedProfile = await authService.getProfile()
      const updatedUser = {
        username: updatedProfile.username,
        phone: updatedProfile.phone,
        avatar: updatedProfile.avatar,
        department: updatedProfile.department,
        level: updatedProfile.level,
      }

      setUser(updatedUser) // 更新使用者資料到 context
      setIsEditing(false)
      // 清理預覽 URL
      if (selectedFile && previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setSelectedFile(null)
      setPhoneError('') // 清除錯誤狀態
      alert('個人資料更新成功！')
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setEditForm({
        username: user.username || '',
        phone: user.phone || '',
        department: user.department || '',
      })
      setPreviewUrl(user.avatar || '')
      // 清理預覽 URL 以避免記憶體洩漏
      if (selectedFile && previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setSelectedFile(null)
    }
    setPhoneError('')
    setIsEditing(false)
  }

  return (
    <PrivateRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">個人資料</h1>
            <div className="space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200`}
                >
                  編輯資料
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading || phoneError !== ''}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '儲存中...' : '儲存'}
                  </button>
                </>
              )}
            </div>
          </div>

          {user && (
            <div className="space-y-6">
              {/* 頭像區域 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    className={`w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 ${
                      isEditing ? 'cursor-pointer hover:border-primary-500' : ''
                    }`}
                    onClick={handleAvatarClick}
                  >
                    <img
                      src={
                        selectedFile
                          ? previewUrl
                          : `https://house_demo.codychen.me${user.avatar}`
                      }
                      alt="使用者頭像"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/ly_logo.png' // 預設頭像
                      }}
                    />
                  </div>
                  {isEditing && (
                    <div
                      className={`absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="text-center text-sm text-gray-600">
                  已選擇檔案: {selectedFile.name}
                </div>
              )}

              {/* 基本資訊 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用者名稱
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) =>
                        handleInputChange('username', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="請輸入使用者名稱"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {user.username || '未設定'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    部門
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) =>
                        handleInputChange('department', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="請輸入部門名稱"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {user.department || '未設定'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話號碼
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                          phoneError
                            ? 'border-red-300 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-primary-500'
                        }`}
                        placeholder="請輸入電話號碼（09開頭10碼）"
                        maxLength={10}
                      />
                      {phoneError && (
                        <p className="mt-1 text-sm text-red-600">
                          {phoneError}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        格式：09XXXXXXXX（選填）
                      </p>
                    </div>
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {user.phone || '未設定'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PrivateRoute>
  )
}
