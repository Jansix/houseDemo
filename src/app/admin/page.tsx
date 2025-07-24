'use client'

import { useState, useEffect } from 'react'
import PrivateRoute from '@/components/PrivateRoute'
import { useAuth } from '@/contexts/AuthContext'
import {
  managerService,
  AdminUser,
  CreateUserData,
  UpdateUserProfileData,
  SiteSettings,
} from '@/services/managerService'

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('settings')
  const [isLoading, setIsLoading] = useState(false)

  // 網站設定狀態
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: '',
    logo: '',
    primaryColor: '',
    gradientMain: '',
    gradientMid: '',
    gradientSub: '',
    lineUrl: '',
    whatsappUrl: '',
  })

  // 原始設定狀態 (用於比較變更)
  const [originalSettings, setOriginalSettings] = useState<SiteSettings>({
    title: '',
    logo: '',
    primaryColor: '',
    gradientMain: '',
    gradientMid: '',
    gradientSub: '',
    lineUrl: '',
    whatsappUrl: '',
  })

  // 使用者列表狀態
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)

  // 載入系統設定
  const loadSystemSettings = async () => {
    try {
      setIsLoading(true)
      const settings = await managerService.getSystemSettings()
      const parsedSettings = managerService.parseSystemSettings(settings)
      setSiteSettings(parsedSettings)
      setOriginalSettings(parsedSettings) // 同時設定原始設定值
    } catch (error) {
      console.error('載入系統設定失敗:', error)
      alert('載入系統設定失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 載入使用者列表
  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      const userList = await managerService.getUserList()
      setUsers(userList)
    } catch (error) {
      console.error('載入使用者列表失敗:', error)
      alert('載入使用者列表失敗，請稍後重試')
    } finally {
      setUsersLoading(false)
    }
  }

  // 組件載入時取得使用者列表
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    }
  }, [activeTab])

  // 組件載入時取得系統設定
  useEffect(() => {
    if (activeTab === 'settings') {
      loadSystemSettings()
    }
  }, [activeTab])

  // 新增使用者表單狀態 (只包含必填欄位)
  const [newUser, setNewUser] = useState({
    login: '',
    username: '',
    password: '',
  })

  const [showCreateForm, setShowCreateForm] = useState(false)

  // 編輯使用者狀態
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editUserData, setEditUserData] = useState({
    username: '',
    phone: '',
    department: '',
    level: 'user' as 'user' | 'admin',
    active: true,
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // Logo 文件狀態
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // 處理網站設定更新
  const handleSettingsUpdate = async () => {
    setIsLoading(true)
    try {
      // 呼叫批量更新 API
      await managerService.updateSystemSettings(
        siteSettings,
        originalSettings,
        logoFile || undefined
      )

      alert('網站設定更新成功！')

      // 更新完成後重新載入設定並跳轉到首頁
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 處理使用者建立
  const handleCreateUser = async () => {
    if (!newUser.login || !newUser.username || !newUser.password) {
      alert('請填寫所有必要欄位')
      return
    }

    setIsLoading(true)
    try {
      const userData: CreateUserData = {
        login: newUser.login,
        username: newUser.username,
        password: newUser.password,
      }

      await managerService.createUser(userData)

      // 重新載入使用者列表
      await loadUsers()

      setNewUser({
        login: '',
        username: '',
        password: '',
      })
      setShowCreateForm(false)
      alert('使用者建立成功！')
    } catch (error) {
      console.error('建立失敗:', error)
      alert('建立失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 處理使用者刪除
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('確定要刪除此使用者嗎？')) return

    setIsLoading(true)
    try {
      await managerService.deleteUser(userId)

      // 重新載入使用者列表
      await loadUsers()

      alert('使用者刪除成功！')
    } catch (error) {
      console.error('刪除失敗:', error)
      alert('刪除失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 處理使用者權限更改
  const handleChangeLevel = async (
    userId: string,
    newLevel: 'user' | 'admin'
  ) => {
    setIsLoading(true)
    try {
      await managerService.updateUserLevel(userId, newLevel)

      // 重新載入使用者列表
      await loadUsers()

      alert('使用者權限更新成功！')
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 開啟編輯使用者彈窗
  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setEditUserData({
      username: user.username,
      phone: user.phone || '',
      department: user.department || '',
      level: user.level,
      active: true, // 假設預設為啟用，API 需要確認此欄位
    })
    setAvatarFile(null) // 重置頭像文件
    setShowEditModal(true)
  }

  // 處理使用者資料更新
  const handleUpdateUser = async () => {
    if (!editingUser) return

    if (!editUserData.username) {
      alert('使用者名稱為必填欄位')
      return
    }

    setIsLoading(true)
    try {
      const updateData: UpdateUserProfileData = {
        user_id: editingUser.user_id,
        username: editUserData.username,
        level: editUserData.level,
        phone: editUserData.phone, // 直接包含，即使是空字串
        department: editUserData.department, // 直接包含，即使是空字串
        active: editUserData.active,
        ...(avatarFile && { avatar: avatarFile }), // 如果有選擇新頭像文件，則包含
      }

      console.log('發送更新資料:', updateData)
      await managerService.updateUserProfile(updateData)

      // 重新載入使用者列表
      await loadUsers()

      setShowEditModal(false)
      setEditingUser(null)
      alert('使用者資料更新成功！')
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 關閉編輯彈窗
  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingUser(null)
    setAvatarFile(null) // 重置頭像文件
  }

  const tabs = [
    { id: 'settings', name: '網站設定', icon: '⚙️' },
    { id: 'users', name: '使用者管理', icon: '👥' },
  ]

  return (
    <PrivateRoute>
      {/* 檢查是否為管理員 */}
      {authLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">驗證權限中...</p>
          </div>
        </div>
      ) : user?.level !== 'admin' ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              存取被拒絕
            </h1>
            <p className="text-gray-600 mb-6">
              您沒有權限存取管理頁面。僅限管理員使用。
            </p>
            <a
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition duration-200"
            >
              返回首頁
            </a>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md">
            {/* 頁面標題 */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800">
                使用者&網頁管理
              </h1>
              <p className="text-gray-600 mt-2">管理網站設定和使用者帳號</p>
            </div>

            {/* 分頁標籤 */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* 內容區域 */}
            <div className="p-6">
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    網站設定
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 標題設定 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        網站標題
                      </label>
                      <input
                        type="text"
                        value={siteSettings.title}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="請輸入網站標題"
                      />
                    </div>

                    {/* LOGO 設定 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        網站 LOGO
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        {/* LOGO 預覽區域 */}
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white shadow-sm">
                            {logoFile ? (
                              // 預覽新上傳的圖片
                              <img
                                src={URL.createObjectURL(logoFile)}
                                alt="新 LOGO 預覽"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : siteSettings.logo ? (
                              // 顯示當前 LOGO
                              <img
                                src={`https://house_demo.codychen.me${siteSettings.logo}`}
                                alt="當前 LOGO"
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              // 無 LOGO 時顯示占位符
                              <div className="text-center">
                                <div className="text-gray-300 text-xl">📷</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  無 LOGO
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-500 text-center">
                            {logoFile ? (
                              <span className="text-green-600 font-medium">
                                ✓ 新 LOGO 預覽
                              </span>
                            ) : siteSettings.logo ? (
                              <span>當前 LOGO</span>
                            ) : (
                              <span>尚未設定 LOGO</span>
                            )}
                          </div>
                        </div>

                        {/* 上傳控制區域 */}
                        <div className="mt-4 space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              setLogoFile(file || null)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                          />

                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              {logoFile
                                ? `已選擇: ${logoFile.name}`
                                : '支援 JPG、PNG、GIF 格式'}
                            </p>

                            {logoFile && (
                              <button
                                type="button"
                                onClick={() => setLogoFile(null)}
                                className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                              >
                                清除
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp 聯結 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp 聯結網址
                      </label>
                      <input
                        type="url"
                        value={siteSettings.whatsappUrl}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            whatsappUrl: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://wa.me/886912345678"
                      />
                    </div>
                    {/* LINE 聯結 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LINE 聯結網址
                      </label>
                      <input
                        type="url"
                        value={siteSettings.lineUrl}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            lineUrl: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://line.me/R/ti/p/@yourlineId"
                      />
                    </div>
                    {/* 主色系與漸層顏色設定（四欄位） */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 主色系設定 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          網站主色系
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={siteSettings.primaryColor}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                primaryColor: e.target.value,
                              }))
                            }
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteSettings.primaryColor}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                primaryColor: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="#EA5234"
                          />
                        </div>
                      </div>
                      {/* 漸層一 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          漸層一
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={siteSettings.gradientMain || ''}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                gradientMain: e.target.value,
                              }))
                            }
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteSettings.gradientMain || ''}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                gradientMain: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="#EA5234"
                          />
                        </div>
                      </div>
                      {/* 漸層二 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          漸層二
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={siteSettings.gradientMid || ''}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                gradientMid: e.target.value,
                              }))
                            }
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteSettings.gradientMid || ''}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                gradientMid: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="#3A506B"
                          />
                        </div>
                      </div>
                      {/* 漸層三 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          漸層三
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={siteSettings.gradientSub || ''}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                gradientSub: e.target.value,
                              }))
                            }
                            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={siteSettings.gradientSub || ''}
                            onChange={(e) =>
                              setSiteSettings((prev) => ({
                                ...prev,
                                gradientSub: e.target.value,
                              }))
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="#1F2937"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 儲存按鈕 */}
                  <div className="pt-4">
                    <button
                      onClick={handleSettingsUpdate}
                      disabled={isLoading}
                      className={`px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200 disabled:opacity-50`}
                    >
                      {isLoading ? '儲存中...' : '儲存設定'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      使用者管理
                    </h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        💡 雙擊使用者列表可編輯資料
                      </span>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        新增使用者
                      </button>
                    </div>
                  </div>

                  {/* 新增使用者表單 */}
                  {showCreateForm && (
                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        新增使用者
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            登入帳號 *
                          </label>
                          <input
                            type="text"
                            value={newUser.login}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                login: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="請輸入登入帳號"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            使用者名稱 *
                          </label>
                          <input
                            type="text"
                            value={newUser.username}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="請輸入使用者名稱"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            密碼 *
                          </label>
                          <input
                            type="password"
                            value={newUser.password}
                            onChange={(e) =>
                              setNewUser((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="請輸入密碼"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={handleCreateUser}
                          disabled={isLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
                        >
                          {isLoading ? '建立中...' : '建立使用者'}
                        </button>
                        <button
                          onClick={() => setShowCreateForm(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 使用者列表 */}
                  <div className="bg-white rounded-lg border overflow-hidden">
                    {usersLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <span className="ml-3 text-gray-600">載入中...</span>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">目前沒有使用者資料</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                使用者資訊
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                聯絡方式
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                部門
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                權限
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                建立日期
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                操作
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                              <tr
                                key={user.user_id}
                                onDoubleClick={() => handleEditUser(user)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                title="雙擊編輯使用者資料"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.username}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {user.login}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {user.phone || '未設定'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {user.department || '未設定'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <select
                                    value={user.level}
                                    onChange={(e) =>
                                      handleChangeLevel(
                                        user.user_id,
                                        e.target.value as 'user' | 'admin'
                                      )
                                    }
                                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    disabled={isLoading}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="user">使用者</option>
                                    <option value="admin">管理者</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(user.created).toLocaleDateString(
                                    'zh-TW'
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEditUser(user)
                                    }}
                                    disabled={isLoading}
                                    className="text-blue-600 hover:text-blue-900 disabled:opacity-50 mr-2"
                                  >
                                    編輯
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteUser(user.user_id)
                                    }}
                                    disabled={isLoading}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  >
                                    刪除
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 編輯使用者彈窗 */}
          {showEditModal && editingUser && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                          編輯使用者資料
                        </h3>

                        <div className="space-y-4">
                          {/* 登入帳號 (只顯示，不可編輯) */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              登入帳號
                            </label>
                            <input
                              type="text"
                              value={editingUser.login}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                          </div>

                          {/* 使用者名稱 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              使用者名稱 *
                            </label>
                            <input
                              type="text"
                              value={editUserData.username}
                              onChange={(e) =>
                                setEditUserData((prev) => ({
                                  ...prev,
                                  username: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="請輸入使用者名稱"
                            />
                          </div>

                          {/* 頭像上傳 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              頭像上傳
                            </label>
                            <div className="flex items-center space-x-3">
                              {/* 當前頭像顯示 */}
                              {editingUser?.avatar && (
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300">
                                  <img
                                    src={
                                      editingUser.avatar
                                        ? `https://house_demo.codychen.me${editingUser.avatar}`
                                        : ''
                                    }
                                    alt="目前頭像"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                </div>
                              )}
                              {/* 文件選擇器 */}
                              <div className="flex-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    setAvatarFile(file || null)
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {avatarFile
                                    ? `已選擇: ${avatarFile.name}`
                                    : '選擇新頭像圖片 (可選)'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 電話號碼 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              電話號碼
                            </label>
                            <input
                              type="tel"
                              value={editUserData.phone}
                              onChange={(e) =>
                                setEditUserData((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="請輸入電話號碼"
                            />
                          </div>

                          {/* 部門 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              部門
                            </label>
                            <input
                              type="text"
                              value={editUserData.department}
                              onChange={(e) =>
                                setEditUserData((prev) => ({
                                  ...prev,
                                  department: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="請輸入部門"
                            />
                          </div>

                          {/* 權限 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              權限
                            </label>
                            <select
                              value={editUserData.level}
                              onChange={(e) =>
                                setEditUserData((prev) => ({
                                  ...prev,
                                  level: e.target.value as 'user' | 'admin',
                                }))
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="user">使用者</option>
                              <option value="admin">管理者</option>
                            </select>
                          </div>

                          {/* 帳號狀態 */}
                          <div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editUserData.active}
                                onChange={(e) =>
                                  setEditUserData((prev) => ({
                                    ...prev,
                                    active: e.target.checked,
                                  }))
                                }
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700">
                                啟用帳號
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleUpdateUser}
                      disabled={isLoading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {isLoading ? '更新中...' : '更新資料'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseEditModal}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PrivateRoute>
  )
}
