// src/services/authService.ts

import { api } from './apiService'

export interface LoginRequest {
  login: string
  password: string
}

export interface LoginResponse {
  expire: string
  msg: string
}

export interface ProfileResponse {
  username: string
  phone: string | null
  avatar: string
  department: string
}

export interface UserProfile {
  username: string
  phone: string | null
  avatar: string
  department: string
}

export const authService = {
  // 登入
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/service/user/login', credentials, {
      auth: true,
    })
  },

  // 獲取使用者資料（當需要時才呼叫）
  getProfile: async (): Promise<ProfileResponse> => {
    return api.get<ProfileResponse>('/service/user/profile', {}, { auth: true })
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
