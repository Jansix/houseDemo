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
    return api.del<void>(`/service/manager/${userId}/user`, {
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
}
