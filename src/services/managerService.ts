// src/services/managerService.ts

import { api } from './apiService'

// 使用者型別定義
export interface AdminUser {
  user_id: string
  login: string
  level: 'user' | 'admin'
  username: string
  phone: string | null
  avatar: string | null
  department: string | null
  created: string
  updated: string
  active?: boolean // 可選，兼容後端未提供
}

// 新增使用者的資料型別 (對應 /service/user/register)
export interface CreateUserData {
  login: string
  password: string
  username: string
}

// 更新使用者資料的型別 (對應 /service/manager/user_profile)
export interface UpdateUserProfileData {
  user_id: string
  level?: 'user' | 'admin'
  username?: string
  phone?: string
  avatar?: File | string // 可以是文件或字串路徑
  department?: string
  active?: boolean
}

// 系統設定項目型別
export interface SystemSetting {
  type: string
  value: string
}

// 網站設定型別
export interface SiteSettings {
  title: string
  logo: string
  primaryColor: string
  gradientMain: string
  gradientMid: string
  gradientSub: string
  gradientHorizontal: boolean
  lineUrl: string
  whatsappUrl: string
}

export const managerService = {
  /**
   * 獲取使用者列表
   * @returns Promise<AdminUser[]> 使用者列表
   */
  getUserList: async (): Promise<AdminUser[]> => {
    return api.get<AdminUser[]>(
      '/service/manager/user_list',
      {},
      {
        auth: true, // 管理功能需要認證
      }
    )
  },

  /**
   * 新增使用者 (註冊)
   * @param userData 使用者資料 (login, password, username)
   * @returns Promise<AdminUser> 新增的使用者資訊
   */
  createUser: async (userData: CreateUserData): Promise<AdminUser> => {
    return api.post<AdminUser>('/service/user/register', userData, {
      auth: true,
    })
  },

  /**
   * 刪除使用者
   * @param userId 使用者 ID
   * @returns Promise<void>
   */
  deleteUser: async (userId: string): Promise<void> => {
    return api.del<void>(`/service/manager/${userId}/user`, null, {
      auth: true,
    })
  },

  /**
   * 更新使用者資料
   * @param profileData 使用者資料
   * @returns Promise<AdminUser> 更新後的使用者資訊
   */
  updateUserProfile: async (
    profileData: UpdateUserProfileData
  ): Promise<AdminUser> => {
    // 將資料轉換為 FormData
    const formData = new FormData()

    // 添加所有欄位到 FormData，包括空字串
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // 特殊處理 File 物件
        if (value instanceof File) {
          formData.append(key, value)
        }
        // 特殊處理 boolean 值
        else if (typeof value === 'boolean') {
          formData.append(key, value ? 'true' : 'false')
        }
        // 其他值轉為字串
        else {
          formData.append(key, String(value))
        }
      }
    })

    console.log('更新使用者資料:', profileData)

    return api.patch<AdminUser>('/service/manager/user_profile', formData, {
      auth: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * 更新使用者權限 (簡化版本，只更新權限)
   * @param userId 使用者 ID
   * @param level 權限等級
   * @returns Promise<AdminUser> 更新後的使用者資訊
   */
  updateUserLevel: async (
    userId: string,
    level: 'user' | 'admin'
  ): Promise<AdminUser> => {
    // 將資料轉換為 FormData
    const formData = new FormData()
    formData.append('user_id', userId)
    formData.append('level', level)

    return api.patch<AdminUser>('/service/manager/user_profile', formData, {
      auth: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * 獲取系統設定列表
   * @returns Promise<SystemSetting[]> 系統設定列表
   */
  getSystemSettings: async (): Promise<SystemSetting[]> => {
    return api.get<SystemSetting[]>(
      '/service/manager/system/list',
      {},
      {
        auth: true,
      }
    )
  },

  /**
   * 解析系統設定為網站設定格式
   * @param settings 系統設定列表
   * @returns SiteSettings 網站設定物件
   */
  parseSystemSettings: (settings: SystemSetting[]): SiteSettings => {
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.type] = setting.value
      return acc
    }, {} as Record<string, string>)

    // 解析漸層顏色與橫向布林值
    const gradientArr = settingsMap.web_color_gradient?.split(',') || [
      '#EA5234',
      '#3A506B',
      '#1F2937',
      'false',
    ]
    const [gradientMain, gradientMid, gradientSub, gradientHorizontalRaw] =
      gradientArr
    const gradientHorizontal = gradientHorizontalRaw === 'true'

    return {
      title: settingsMap.web_title || '房屋網',
      logo: settingsMap.web_logo || '',
      primaryColor: settingsMap.web_color || '#EA5234',
      gradientMain: gradientMain || '#EA5234',
      gradientMid: gradientMid || '#3A506B',
      gradientSub: gradientSub || '#1F2937',
      gradientHorizontal,
      lineUrl: settingsMap.line_url || '',
      whatsappUrl: settingsMap.whatsapp_url || '',
    }
  },

  /**
   * 更新單一系統設定參數
   * @param type 設定類型
   * @param value 設定值
   * @param image 圖片文件 (可選)
   * @returns Promise<void>
   */
  updateSystemParameter: async (
    type: string,
    value: string,
    image?: File
  ): Promise<void> => {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('value', value)

    if (image) {
      formData.append('image', image)
    }

    return api.patch<void>('/service/manager/system/parameter', formData, {
      auth: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  /**
   * 批量更新系統設定
   * @param currentSettings 當前設定
   * @param originalSettings 原始設定
   * @param logoFile Logo 圖片文件 (可選)
   * @returns Promise<void>
   */
  updateSystemSettings: async (
    currentSettings: SiteSettings,
    originalSettings: SiteSettings,
    logoFile?: File
  ): Promise<void> => {
    const updates: Array<{ type: string; value: string; image?: File }> = []

    // 檢查每個欄位是否有變更
    if (currentSettings.title !== originalSettings.title) {
      updates.push({ type: 'web_title', value: currentSettings.title })
    }

    if (currentSettings.logo !== originalSettings.logo || logoFile) {
      updates.push({
        type: 'web_logo',
        value: currentSettings.logo,
        image: logoFile,
      })
    }

    if (currentSettings.primaryColor !== originalSettings.primaryColor) {
      updates.push({ type: 'web_color', value: currentSettings.primaryColor })
    }

    // 檢查漸層顏色與方向是否有變更
    const currentGradient = `${currentSettings.gradientMain},${currentSettings.gradientMid},${currentSettings.gradientSub},${currentSettings.gradientHorizontal}`
    const originalGradient = `${originalSettings.gradientMain},${originalSettings.gradientMid},${originalSettings.gradientSub},${originalSettings.gradientHorizontal}`

    if (currentGradient !== originalGradient) {
      updates.push({ type: 'web_color_gradient', value: currentGradient })
    }

    if (currentSettings.lineUrl !== originalSettings.lineUrl) {
      updates.push({ type: 'line_url', value: currentSettings.lineUrl })
    }

    if (currentSettings.whatsappUrl !== originalSettings.whatsappUrl) {
      updates.push({ type: 'whatsapp_url', value: currentSettings.whatsappUrl })
    }

    // 依次更新每個變更的設定
    for (const update of updates) {
      await managerService.updateSystemParameter(
        update.type,
        update.value,
        update.image
      )
    }
  },
}
