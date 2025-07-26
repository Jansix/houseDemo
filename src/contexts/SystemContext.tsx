// src/contexts/SystemContext.tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  systemService,
  SystemSettings,
  GlobalContact,
  ThemeConfig,
} from '@/services/authService'

interface SystemContextType {
  settings: SystemSettings | null
  globalContact: GlobalContact | null
  themeConfig: ThemeConfig | null
  webTitle: string
  webLogo: string
  gradientHorizontal?: boolean
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const SystemContext = createContext<SystemContextType>({
  settings: null,
  globalContact: null,
  themeConfig: null,
  webTitle: '',
  webLogo: '',
  isLoading: true,
  error: null,
  refetch: async () => {},
})

export function SystemProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSystemSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const systemSettings = await systemService.parseSystemSettings()
      setSettings(systemSettings)
    } catch (err) {
      console.error('Failed to fetch system settings:', err)
      setError('載入系統設定失敗')
      // 設定預設值
      setSettings({
        webTitle: '房屋平台',
        webLogo: '/ly_logo.png',
        globalContact: {
          line_url: 'https://google.com',
          whatsapp_url: 'https://google.com',
        },
        themeConfig: {
          primary: '#ea580c',
          gradient_main: '#ea580c',
          gradient_mid: '#3A506B',
          gradient_sub: '#1F2937',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemSettings()
  }, [])

  const contextValue: SystemContextType = {
    settings,
    globalContact: settings?.globalContact || null,
    themeConfig: settings?.themeConfig || null,
    webTitle: settings?.webTitle || '',
    webLogo: settings?.webLogo || '',
    gradientHorizontal: settings?.gradientHorizontal ?? false,
    isLoading,
    error,
    refetch: fetchSystemSettings,
  }

  return (
    <SystemContext.Provider value={contextValue}>
      {children}
    </SystemContext.Provider>
  )
}

// 自定義 hook 來使用系統配置
export function useSystem() {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider')
  }
  return context
}

// 便利的 hooks
export function useGlobalContact() {
  const { globalContact } = useSystem()
  return globalContact
}

export function useThemeConfig() {
  const { themeConfig } = useSystem()
  return themeConfig
}

export function useWebInfo() {
  const { webTitle, webLogo, gradientHorizontal } = useSystem()
  return { webTitle, webLogo, gradientHorizontal }
}
