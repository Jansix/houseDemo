// src/contexts/ThemeContext.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useThemeConfig } from './SystemContext'
import { hexToHsl } from '@/utils/colorUtils'
import tinycolor from 'tinycolor2'

const ThemeContext = createContext({})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const themeConfig = useThemeConfig()

  useEffect(() => {
    const applyTheme = () => {
      if (!themeConfig) {
        setIsLoading(false)
        return
      }

      try {
        // 構建主題物件
        const themeFromApi = {
          primary: themeConfig.primary,
          gradient_main: themeConfig.gradient_main,
          gradient_mid: themeConfig.gradient_mid,
          gradient_sub: themeConfig.gradient_sub,
        }
        // 主色處理
        const baseColor = tinycolor(themeFromApi.primary)
        const shades = {
          '50': baseColor.clone().lighten(35).toHexString(),
          '100': baseColor.clone().lighten(25).toHexString(),
          '200': baseColor.clone().lighten(15).toHexString(),
          '300': baseColor.clone().lighten(5).toHexString(),
          '400': baseColor.clone().lighten(2).toHexString(),
          '500': baseColor.clone().toHexString(),
          '600': baseColor.clone().darken(5).toHexString(),
          '700': baseColor.clone().darken(12).toHexString(),
          '800': baseColor.clone().darken(20).toHexString(),
          '900': baseColor.clone().darken(28).toHexString(),
        }
        for (const [shade, hex] of Object.entries(shades)) {
          const hsl = hexToHsl(hex)
          if (hsl) {
            document.documentElement.style.setProperty(
              `--primary-${shade}`,
              hsl
            )
          }
        }
        // 漸層主色
        const gradientMainHsl = hexToHsl(themeFromApi.gradient_main)
        if (gradientMainHsl) {
          document.documentElement.style.setProperty(
            '--gradient-main',
            gradientMainHsl
          )
        }
        // 漸層中間色
        const gradientMidHsl = hexToHsl(themeFromApi.gradient_mid)
        if (gradientMidHsl) {
          document.documentElement.style.setProperty(
            '--gradient-mid',
            gradientMidHsl
          )
        }
        // 漸層輔助色
        const gradientSubHsl = hexToHsl(themeFromApi.gradient_sub)
        if (gradientSubHsl) {
          document.documentElement.style.setProperty(
            '--gradient-sub',
            gradientSubHsl
          )
        }
      } catch (error) {
        console.error('載入主題失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    applyTheme()
  }, [themeConfig])

  // 這個 Provider 的主要工作是觸發 effect，也可以選擇性地傳遞 isLoading 狀態
  return (
    <ThemeContext.Provider value={{ isLoadingTheme: isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 可選：建立一個 hook 來讀取載入狀態
export function useTheme() {
  return useContext(ThemeContext)
}
