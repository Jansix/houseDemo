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
    return api.post<LoginResponse>('/service/user/login', credentials, {
      auth: true,
    })
  },

  // 獲取使用者資料（當需要時才呼叫）
  getProfile: async (): Promise<UserProfile> => {
    return api.get<UserProfile>('/service/user/profile', {}, { auth: true })
  },

  // 更新使用者資料
  updateProfile: async (
    profileData: Partial<UserProfile>
  ): Promise<UserProfile> => {
    return api.put<UserProfile>('/service/user/profile', profileData, {
      auth: true,
    })
  },

  // 使用 FormData 更新使用者資料（支援檔案上傳）
  updateProfileWithFormData: async (
    formData: FormData
  ): Promise<UserProfile> => {
    return api.put<UserProfile>('/service/user/profile', formData, {
      auth: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
