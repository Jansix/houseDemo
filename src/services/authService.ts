// src/services/authService.ts

import { api } from './apiService'

export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface UserProfile {
  id: string
  name: string
  phone: string
  avatar: string
  department: string
  lineId: string
  whatsappId: string
}

export const authService = {
  // 登入
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/service/user/login', credentials)
  },

  // 登出
  logout: async (): Promise<void> => {
    // TODO: 暫時使用靜態處理，等後端 API 準備好後替換
    console.log('調用登出 API (目前使用靜態處理)')

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 300))

    console.log('登出處理完成')
    return Promise.resolve()

    // 等 API 準備好後，取消註解下面這行並刪除上面的靜態處理
    // return api.post('/service/user/logout', {})
  },

  // 獲取使用者資料
  getProfile: async (): Promise<UserProfile> => {
    // TODO: 暫時使用靜態資料，等後端 API 準備好後替換
    console.log('調用 getProfile API (目前使用靜態資料)')

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 靜態使用者資料
    const mockUserData: UserProfile = {
      id: 'user_001',
      name: '張小明',
      phone: '0912-345-678',
      avatar: '/house1.png',
      department: '資訊部',
      lineId: 'zhang_xiaoming',
      whatsappId: '+886912345678',
    }

    console.log('回傳靜態使用者資料:', mockUserData)
    return mockUserData

    // 等 API 準備好後，取消註解下面這行並刪除上面的靜態資料
    // return api.get<UserProfile>('/service/user/profile');
  },

  // 更新使用者資料
  updateProfile: async (
    profileData: Partial<UserProfile>
  ): Promise<UserProfile> => {
    // TODO: 暫時使用靜態資料，等後端 API 準備好後替換
    console.log('調用 updateProfile API (目前使用靜態資料)', profileData)

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 800))

    // 模擬更新後的使用者資料
    const updatedUserData: UserProfile = {
      id: 'user_001',
      name: profileData.name || '張小明',
      phone: profileData.phone || '0912-345-678',
      avatar: profileData.avatar || '/house1.png',
      department: profileData.department || '資訊部',
      lineId: profileData.lineId || 'zhang_xiaoming',
      whatsappId: profileData.whatsappId || '+886912345678',
    }

    console.log('更新後的使用者資料:', updatedUserData)
    return updatedUserData

    // 等 API 準備好後，取消註解下面這行並刪除上面的靜態資料
    // return api.put<UserProfile>('/service/user/profile', profileData);
  },

  // 使用 FormData 更新使用者資料（支援檔案上傳）
  updateProfileWithFormData: async (
    formData: FormData
  ): Promise<UserProfile> => {
    // TODO: 暫時使用靜態資料，等後端 API 準備好後替換
    console.log(
      '調用 updateProfileWithFormData API (目前使用靜態資料)',
      formData
    )

    // 模擬 API 延遲
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模擬檔案上傳處理
    const avatarFile = formData.get('avatar') as File
    let avatarUrl = '/house1.png'

    if (avatarFile && avatarFile.size > 0) {
      // 模擬檔案上傳成功，生成假的 URL
      avatarUrl = URL.createObjectURL(avatarFile)
      console.log('模擬檔案上傳成功，新頭像 URL:', avatarUrl)
    }

    // 模擬更新後的使用者資料
    const updatedUserData: UserProfile = {
      id: 'user_001',
      name: (formData.get('name') as string) || '張小明',
      phone: (formData.get('phone') as string) || '0912-345-678',
      avatar: avatarUrl,
      department: (formData.get('department') as string) || '資訊部',
      lineId: (formData.get('lineId') as string) || 'zhang_xiaoming',
      whatsappId: (formData.get('whatsappId') as string) || '+886912345678',
    }

    console.log('更新後的使用者資料:', updatedUserData)
    return updatedUserData

    // 等 API 準備好後，取消註解下面這行並刪除上面的靜態資料
    // return api.put<UserProfile>('/service/user/profile', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });
  },

  // 刷新權杖
  refreshToken: async (): Promise<void> => {
    return api.post('/service/user/refresh', {})
  },
}
