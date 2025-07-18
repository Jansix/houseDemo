'use client'

import { useState, useEffect } from 'react'
import PrivateRoute from '@/components/PrivateRoute'
import { useAuth } from '@/contexts/AuthContext'
import config from '@/data/config'

// 模擬網站設定型別
interface SiteSettings {
  title: string
  logo: string
  primaryColor: string
  lineUrl: string
  whatsappUrl: string
}

// 模擬使用者型別
interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  status: 'active' | 'inactive'
  createdAt: string
}

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('settings')
  const [isLoading, setIsLoading] = useState(false)

  // 網站設定狀態
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: '999 房屋網',
    logo: '/house1.png',
    primaryColor: '#EA5234',
    lineUrl: 'https://line.me/R/ti/p/@yourlineId',
    whatsappUrl: 'https://wa.me/886912345678',
  })

  // 使用者列表狀態
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: '張小明',
      email: 'zhang@example.com',
      phone: '0912-345-678',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: '李小華',
      email: 'li@example.com',
      phone: '0923-456-789',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      name: '王大明',
      email: 'wang@example.com',
      phone: '0934-567-890',
      role: 'user',
      status: 'inactive',
      createdAt: '2024-01-25',
    },
  ])

  // 新增使用者表單狀態
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  })

  const [showCreateForm, setShowCreateForm] = useState(false)

  // 處理網站設定更新
  const handleSettingsUpdate = async () => {
    setIsLoading(true)
    try {
      // TODO: 呼叫 API 更新網站設定
      console.log('更新網站設定:', siteSettings)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 模擬 API 延遲
      alert('網站設定更新成功！')
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 處理使用者建立
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('請填寫所有必要欄位')
      return
    }

    setIsLoading(true)
    try {
      // TODO: 呼叫 API 建立使用者
      const createdUser: AdminUser = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      }

      setUsers((prev) => [...prev, createdUser])
      setNewUser({ name: '', email: '', phone: '', password: '', role: 'user' })
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
      // TODO: 呼叫 API 刪除使用者
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      alert('使用者刪除成功！')
    } catch (error) {
      console.error('刪除失敗:', error)
      alert('刪除失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 處理使用者狀態切換
  const handleToggleUserStatus = async (userId: string) => {
    setIsLoading(true)
    try {
      // TODO: 呼叫 API 更新使用者狀態
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
            : u
        )
      )
      alert('使用者狀態更新成功！')
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  // 處理使用者權限更改
  const handleChangeRole = async (
    userId: string,
    newRole: 'user' | 'admin'
  ) => {
    setIsLoading(true)
    try {
      // TODO: 呼叫 API 更新使用者權限
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      alert('使用者權限更新成功！')
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後重試')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'settings', name: '網站設定', icon: '⚙️' },
    { id: 'users', name: '使用者管理', icon: '👥' },
  ]

  return (
    <PrivateRoute>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      網站 LOGO
                    </label>
                    <div className="flex items-center space-x-3">
                      <img
                        src={siteSettings.logo}
                        alt="LOGO"
                        className="w-12 h-12 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/house1.png'
                        }}
                      />
                      <input
                        type="text"
                        value={siteSettings.logo}
                        onChange={(e) =>
                          setSiteSettings((prev) => ({
                            ...prev,
                            logo: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="請輸入 LOGO 圖片路徑"
                      />
                    </div>
                  </div>

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
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    新增使用者
                  </button>
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
                          姓名 *
                        </label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="請輸入姓名"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          電子郵件 *
                        </label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="請輸入電子郵件"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          電話號碼
                        </label>
                        <input
                          type="tel"
                          value={newUser.phone}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="請輸入電話號碼"
                        />
                      </div>
                      <div>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          權限
                        </label>
                        <select
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser((prev) => ({
                              ...prev,
                              role: e.target.value as 'user' | 'admin',
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="user">使用者</option>
                          <option value="admin">管理者</option>
                        </select>
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
                            權限
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            狀態
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
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.phone || '未設定'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  handleChangeRole(
                                    user.id,
                                    e.target.value as 'user' | 'admin'
                                  )
                                }
                                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                disabled={isLoading}
                              >
                                <option value="user">使用者</option>
                                <option value="admin">管理者</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {user.status === 'active' ? '啟用' : '停用'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                disabled={isLoading}
                                className={`${
                                  user.status === 'active'
                                    ? 'text-red-600 hover:text-red-900'
                                    : 'text-green-600 hover:text-green-900'
                                } disabled:opacity-50`}
                              >
                                {user.status === 'active' ? '停用' : '啟用'}
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
