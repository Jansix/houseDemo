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
  level: string
}

export interface UserProfile {
  username: string
  phone: string | null
  avatar: string
  department: string
  level: string
}

// 系統配置相關介面
export interface SystemConfig {
  type: string
  value: string
}

export interface GlobalContact {
  line_url: string
  whatsapp_url: string
}

export interface ThemeConfig {
  primary: string
  gradient_main: string
  gradient_mid: string
  gradient_sub: string
}

export interface SystemSettings {
  webTitle: string
  webLogo: string
  globalContact: GlobalContact
  themeConfig: ThemeConfig
  gradientHorizontal?: boolean
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
    return api.patch<UserProfile>('/service/user/profile', formData, {
      auth: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// 系統配置服務
export const systemService = {
  // 獲取所有系統配置
  getSystemConfigs: async (): Promise<SystemConfig[]> => {
    return api.get<SystemConfig[]>('/service/web/system/list')
  },

  // 解析系統配置並返回結構化資料
  parseSystemSettings: async (): Promise<SystemSettings> => {
    const configs = await systemService.getSystemConfigs()

    // 從配置中提取各種設定
    const webTitle = configs.find((c) => c.type === 'web_title')?.value || ''
    const webLogo = configs.find((c) => c.type === 'web_logo')?.value || ''
    const lineUrl = configs.find((c) => c.type === 'line_url')?.value || ''
    const whatsappUrl =
      configs.find((c) => c.type === 'whatsapp_url')?.value || ''
    const webColor =
      configs.find((c) => c.type === 'web_color')?.value || '#ea580c'
    const webColorGradient =
      configs.find((c) => c.type === 'web_color_gradient')?.value ||
      '#ea580c,#3A506B,#1F2937'

    // 解析漸層顏色與方向
    const gradientParts = webColorGradient.split(',')
    const gradientColors = gradientParts.slice(0, 3)
    // 方向布林值（第4個值，若存在且為 'true' 則為 true，否則 false）
    const gradientHorizontal =
      gradientParts.length > 3 ? gradientParts[3] === 'true' : false

    return {
      webTitle,
      webLogo,
      globalContact: {
        line_url: lineUrl,
        whatsapp_url: whatsappUrl,
      },
      themeConfig: {
        primary: webColor,
        gradient_main: gradientColors[0] || '#ea580c',
        gradient_mid: gradientColors[1] || '#3A506B',
        gradient_sub: gradientColors[2] || '#1F2937',
      },
      gradientHorizontal,
    }
  },

  // 僅獲取全域聯絡資訊
  getGlobalContact: async (): Promise<GlobalContact> => {
    const settings = await systemService.parseSystemSettings()
    return settings.globalContact
  },

  // 僅獲取主題配置
  getThemeConfig: async (): Promise<ThemeConfig> => {
    const settings = await systemService.parseSystemSettings()
    return settings.themeConfig
  },
}
